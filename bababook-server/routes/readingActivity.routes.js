const express = require('express');

/**
 * Builds the router for a reader's reading history and in-progress reading state.
 */
function createReadingActivityRouter(readingHistoryCollection, readingProgressCollection) {
  const router = express.Router();

  // Upserts a reading-history entry for a book (last read time, progress snapshot).
  router.post("/reader/reading-history", async (req, res) => {
    try {
      const { userId, book } = req.body;
      const historyEntry = {
        userId,
        bookId: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0] || 'Unknown Author',
        coverImage: book.volumeInfo.imageLinks?.thumbnail,
        lastRead: new Date(),
        progress: book.readingProgress || 0
      };

      await readingHistoryCollection.updateOne(
        { userId, bookId: book.id },
        { $set: historyEntry },
        { upsert: true }
      );

      res.status(201).json({ message: "Reading history updated", entry: historyEntry });
    } catch (error) {
      res.status(500).json({ error: "Error updating reading history" });
    }
  });

  // Upserts detailed reading progress (current page, bookmarks, annotations, completion %) for a book.
  router.post("/reader/reading-progress", async (req, res) => {
    try {
      const { userId, bookId, progress } = req.body;
      const progressEntry = {
        userId,
        bookId,
        currentPage: progress.currentPage,
        totalPages: progress.totalPages,
        bookmarks: progress.bookmarks || [],
        annotations: progress.annotations || [],
        lastRead: new Date(),
        completionPercentage: progress.completionPercentage
      };

      await readingProgressCollection.updateOne(
        { userId, bookId },
        { $set: progressEntry },
        { upsert: true }
      );

      res.status(201).json({ message: "Reading progress updated", progress: progressEntry });
    } catch (error) {
      res.status(500).json({ error: "Error updating reading progress" });
    }
  });

  return router;
}

module.exports = createReadingActivityRouter;