const { ObjectId } = require('mongodb');

/**
 * Builds the verifyLibraryOwnership middleware for a specific bookCollection, so book
 * update/delete routes can confirm the requesting library actually owns the book before proceeding.
 */
function createVerifyLibraryOwnership(bookCollection) {
  return async (req, res, next) => {
    try {
      const bookId = req.params.id;
      const libraryId = req.body.libraryId || req.query.libraryId;

      const book = await bookCollection.findOne({ _id: new ObjectId(bookId) });

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (book.libraryId !== libraryId) {
        return res.status(403).json({ error: "Unauthorized: You don't have permission to manage this book" });
      }

      // Attach the already-fetched book so downstream handlers don't need to query for it again.
      req.book = book;
      next();
    } catch (error) {
      res.status(500).json({ error: "Error verifying library ownership" });
    }
  };
}

module.exports = createVerifyLibraryOwnership;