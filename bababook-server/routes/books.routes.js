const express = require('express');
const { ObjectId } = require('mongodb');
const createVerifyLibraryOwnership = require('../middleware/verifyLibraryOwnership');

/**
 * Builds the router for book CRUD and browsing endpoints. Needs the book collection for the
 * books themselves and the user collection to validate the uploading librarian.
 */
function createBooksRouter(bookCollection, userCollection) {
  const router = express.Router();
  const verifyLibraryOwnership = createVerifyLibraryOwnership(bookCollection);

  // Adds a new book on behalf of a verified librarian.
  router.post("/upload-book", async (req, res) => {
    try {
      const bookData = req.body;
      console.log("Received book data:", bookData);

      const { libraryId } = bookData;
      if (!libraryId) {
        console.log("No libraryId provided");
        return res.status(400).json({ error: "Library ID is required" });
      }

      const librarian = await userCollection.findOne({
        _id: new ObjectId(libraryId),
        userType: 'librarian'
      });

      console.log("Found librarian:", librarian);

      if (!librarian) {
        return res.status(403).json({ error: "Unauthorized: Invalid library ID or unauthorized librarian" });
      }

      const bookWithLibrary = {
        ...bookData,
        libraryId,
        libraryName: librarian.libraryName,
        publishDate: new Date(bookData.publishDate),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log("Attempting to insert book:", bookWithLibrary);

      const result = await bookCollection.insertOne(bookWithLibrary);

      console.log("Insert result:", result);

      if (result.acknowledged) {
        res.status(201).json({
          message: "Book added successfully",
          bookId: result.insertedId
        });
      } else {
        throw new Error("Failed to insert book");
      }
    } catch (error) {
      console.error("Error uploading book:", error);
      res.status(500).json({ error: "Error uploading book: " + error.message });
    }
  });

  // Lists books with optional library/category/search filtering and pagination.
  router.get("/all-books", async (req, res) => {
    try {
      const { libraryId, search, category, page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      let query = {};

      if (libraryId) {
        query.libraryId = libraryId;
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { bookTitle: { $regex: new RegExp(search, 'i') } },
          { authorName: { $regex: new RegExp(search, 'i') } }
        ];
      }

      const total = await bookCollection.countDocuments(query);

      const books = await bookCollection
        .find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      res.json({
        books,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalBooks: total,
          hasMore: skip + books.length < total
        }
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Error fetching books" });
    }
  });

  // Updates a book, only if the requesting library owns it (see verifyLibraryOwnership).
  router.patch("/book/:id", verifyLibraryOwnership, async (req, res) => {
    try {
      const id = req.params.id;
      const updateBookData = {
        ...req.body,
        updatedAt: new Date()
      };

      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updateBookData
      };

      const result = await bookCollection.updateOne(filter, updateDoc);
      res.json({ message: "Book updated successfully", result });
    } catch (error) {
      res.status(500).json({ error: "Error updating book" });
    }
  });

  // Deletes a single book, only if the requesting library owns it.
  router.delete("/book/:id", verifyLibraryOwnership, async (req, res) => {
    try {
      const id = req.params.id;
      const result = await bookCollection.deleteOne({ _id: new ObjectId(id) });
      res.json({ message: "Book deleted successfully", result });
    } catch (error) {
      res.status(500).json({ error: "Error deleting book" });
    }
  });

  // Deletes multiple books belonging to one library in a single request.
  router.delete("/books/bulk-delete", async (req, res) => {
    try {
      const { bookIds, libraryId } = req.body;

      if (!bookIds || !Array.isArray(bookIds) || !libraryId) {
        return res.status(400).json({ error: "Invalid request parameters" });
      }

      const objectIds = bookIds.map(id => new ObjectId(id));

      const result = await bookCollection.deleteMany({
        _id: { $in: objectIds },
        libraryId: libraryId
      });

      res.json({
        message: "Books deleted successfully",
        deletedCount: result.deletedCount
      });
    } catch (error) {
      console.error('Error in bulk delete:', error);
      res.status(500).json({ error: "Error deleting books" });
    }
  });

  // Fetches a single book by id.
  router.get("/book/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const book = await bookCollection.findOne({ _id: new ObjectId(id) });

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Error fetching book" });
    }
  });

  return router;
}

module.exports = createBooksRouter;