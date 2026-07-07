const express = require('express');
const { ObjectId } = require('mongodb');
const sanitizeUser = require('../utils/sanitizeUser');

/**
 * Builds the router for public library-browsing endpoints (approved librarian accounts
 * exposed as "libraries").
 */
function createLibrariesRouter(userCollection) {
  const router = express.Router();

  // Lists every approved library.
  router.get("/all-libraries", async (req, res) => {
    try {
      const libraries = await userCollection.find({
        userType: 'librarian',
        status: 'approved'
      }).toArray();

      const sanitizedLibraries = libraries.map((library) => {
        // Strip password and internal application-review details — neither belongs in a
        // public-facing library listing.
        const { applicationDetails, ...publicLibrary } = sanitizeUser(library);
        return publicLibrary;
      });

      if (sanitizedLibraries.length === 0) {
        return res.status(404).json({ message: "No libraries found" });
      }

      res.json(sanitizedLibraries);
    } catch (error) {
      console.error('Error fetching libraries:', error);
      res.status(500).json({ error: "Error fetching libraries" });
    }
  });

  // Fetches a single approved library by id.
  router.get("/library/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const library = await userCollection.findOne({
        _id: new ObjectId(id),
        userType: 'librarian',
        status: 'approved'
      });

      if (!library) {
        return res.status(404).json({ error: "Library not found" });
      }

      const { applicationDetails, ...sanitizedLibrary } = sanitizeUser(library);

      res.json(sanitizedLibrary);
    } catch (error) {
      console.error('Error fetching library:', error);
      res.status(500).json({ error: "Error fetching library details" });
    }
  });

  return router;
}

module.exports = createLibrariesRouter;