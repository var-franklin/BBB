const express = require('express');
const { ObjectId } = require('mongodb');

/**
 * Fetches borrow requests for a given library, optionally sorted by most recently requested.
 * Shared by /librarian/all-borrow-requests and /librarian/borrow-requests, which previously
 * duplicated this exact query and only differed in whether the results were sorted.
 */
async function getBorrowRequestsByLibrary(borrowRequestsCollection, libraryId, { sortByMostRecent = false } = {}) {
  const cursor = borrowRequestsCollection.find({ 'bookData.libraryId': libraryId });
  if (sortByMostRecent) {
    cursor.sort({ requestedAt: -1 });
  }
  return cursor.toArray();
}

/**
 * Builds the router for the full borrowing lifecycle: direct borrows, borrow requests,
 * and the librarian-side request queue.
 */
function createBorrowingRouter(borrowedBooksCollection, borrowRequestsCollection) {
  const router = express.Router();

  // Marks a book as borrowed for a reader, rejecting a second active borrow of the same book.
  router.post("/reader/borrow-book", async (req, res) => {
    try {
      const { userId, bookData } = req.body;

      if (!userId || !bookData) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existingBorrow = await borrowedBooksCollection.findOne({
        userId,
        'bookData.id': bookData.id,
        'bookData.status': 'borrowed'
      });

      if (existingBorrow) {
        return res.status(400).json({ error: "You have already borrowed this book" });
      }

      const borrowedBook = {
        userId,
        bookData,
        borrowedAt: new Date()
      };

      const result = await borrowedBooksCollection.insertOne(borrowedBook);
      res.status(201).json({ message: "Book borrowed successfully", borrowedBook });
    } catch (error) {
      console.error('Error borrowing book:', error);
      res.status(500).json({ error: "Error borrowing book" });
    }
  });

  // Lists a reader's currently borrowed (not yet returned) books.
  router.get("/reader/borrowed-books/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const borrowedBooks = await borrowedBooksCollection.find({
        userId,
        'bookData.status': 'borrowed'
      }).toArray();

      res.json(borrowedBooks);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      res.status(500).json({ error: "Error fetching borrowed books" });
    }
  });

  // Submits a borrow request for a librarian to approve, rejecting a duplicate active request.
  router.post("/reader/request-borrow", async (req, res) => {
    try {
      const { userId, userName, userEmail, bookData } = req.body;

      if (!userId || !bookData) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existingRequest = await borrowRequestsCollection.findOne({
        userId,
        'bookData.id': bookData.id,
        status: { $in: ['pending', 'approved'] }
      });

      if (existingRequest) {
        return res.status(400).json({ error: "You have already requested this book" });
      }

      const borrowRequest = {
        userId,
        userName,
        userEmail,
        bookData,
        status: 'pending',
        requestedAt: new Date()
      };

      const result = await borrowRequestsCollection.insertOne(borrowRequest);
      res.status(201).json({ message: "Borrow request submitted successfully", borrowRequest });
    } catch (error) {
      console.error('Error submitting borrow request:', error);
      res.status(500).json({ error: "Error submitting borrow request" });
    }
  });

  // Lists a specific reader's own borrow requests, most recent first.
  router.get("/reader/borrow-requests/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const borrowRequests = await borrowRequestsCollection.find({
        userId
      }).sort({ requestedAt: -1 }).toArray();

      res.json(borrowRequests);
    } catch (error) {
      console.error('Error fetching borrow requests:', error);
      res.status(500).json({ error: "Error fetching borrow requests" });
    }
  });

  // Lists all borrow requests for a library, most recent first.
  router.get("/librarian/all-borrow-requests", async (req, res) => {
    try {
      const { libraryId } = req.query;

      if (!libraryId) {
        return res.status(400).json({ error: "Library ID is required" });
      }

      const borrowRequests = await getBorrowRequestsByLibrary(borrowRequestsCollection, libraryId, { sortByMostRecent: true });

      res.json(borrowRequests);
    } catch (error) {
      console.error('Error fetching borrow requests:', error);
      res.status(500).json({ error: "Error fetching borrow requests" });
    }
  });

  // Lists all borrow requests for a library, in natural (unsorted) order.
  router.get("/librarian/borrow-requests", async (req, res) => {
    try {
      const { libraryId } = req.query;

      if (!libraryId) {
        return res.status(400).json({ error: "Library ID is required" });
      }

      const borrowRequests = await getBorrowRequestsByLibrary(borrowRequestsCollection, libraryId);

      res.json(borrowRequests);
    } catch (error) {
      console.error('Error fetching borrow requests:', error);
      res.status(500).json({ error: "Error fetching borrow requests" });
    }
  });

  // Approves or rejects a borrow request; approval also creates the corresponding borrowed-book record.
  router.put("/librarian/borrow-requests/:requestId", async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status, dueDate } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const request = await borrowRequestsCollection.findOne({
        _id: new ObjectId(requestId)
      });

      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      const result = await borrowRequestsCollection.updateOne(
        { _id: new ObjectId(requestId) },
        {
          $set: {
            status,
            processedAt: new Date(),
            dueDate: status === 'approved' ? dueDate : null
          }
        }
      );

      if (status === 'approved') {
        const borrowedBook = {
          userId: request.userId,
          bookData: {
            ...request.bookData,
            status: 'borrowed',
            borrowDate: new Date(),
            dueDate
          }
        };
        await borrowedBooksCollection.insertOne(borrowedBook);
      }

      res.json({ message: `Request ${status} successfully` });
    } catch (error) {
      console.error('Error processing borrow request:', error);
      res.status(500).json({ error: "Error processing borrow request" });
    }
  });

  return router;
}

module.exports = createBorrowingRouter;