const express = require('express');

/**
 * Builds the router for a reader's saved-books (bookmarked books) list.
 */
function createSavedBooksRouter(savedBooksCollection) {
  const router = express.Router();

  // Saves a book to a reader's personal library, rejecting duplicates.
  router.post("/reader/save-book", async (req, res) => {
    try {
      const { userId, bookData } = req.body;

      if (!userId || !bookData) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existingBook = await savedBooksCollection.findOne({
        userId,
        'bookData.id': bookData.id
      });

      if (existingBook) {
        return res.status(400).json({ error: "Book already saved to library" });
      }

      const savedBook = {
        userId,
        bookData,
        savedAt: new Date()
      };

      const result = await savedBooksCollection.insertOne(savedBook);
      res.status(201).json({ message: "Book saved successfully", savedBook });
    } catch (error) {
      console.error('Error saving book:', error);
      res.status(500).json({ error: "Error saving book" });
    }
  });

  // Lists every book a reader has saved.
  router.get("/reader/saved-books/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const savedBooks = await savedBooksCollection.find({ userId }).toArray();
      res.json(savedBooks);
    } catch (error) {
      console.error('Error fetching saved books:', error);
      res.status(500).json({ error: "Error fetching saved books" });
    }
  });

  // Removes a book from a reader's saved-books list.
  router.delete("/reader/saved-books/:userId/:bookId", async (req, res) => {
    try {
      const { userId, bookId } = req.params;

      if (!userId || !bookId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const result = await savedBooksCollection.deleteOne({
        userId,
        'bookData.id': bookId
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Book not found in library" });
      }

      res.json({ message: "Book removed successfully" });
    } catch (error) {
      console.error('Error removing book:', error);
      res.status(500).json({ error: "Error removing book" });
    }
  });

  return router;
}

module.exports = createSavedBooksRouter;