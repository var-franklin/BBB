const express = require('express');
const { ObjectId } = require('mongodb');
const sanitizeUser = require('../utils/sanitizeUser');

/**
 * Builds the router for admin-only user and librarian-application management endpoints.
 */
function createAdminRouter(userCollection) {
  const router = express.Router();

  // Lists librarian accounts still waiting on admin approval.
  router.get("/admin/pending-applications", async (req, res) => {
    try {
      const pendingLibrarians = await userCollection.find({
        userType: 'librarian',
        status: 'pending'
      }).toArray();

      const sanitizedApplications = pendingLibrarians.map(sanitizeUser);
      res.json(sanitizedApplications);
    } catch (error) {
      res.status(500).json({ error: "Error fetching pending applications" });
    }
  });

  // Approves or rejects a pending librarian application.
  router.patch("/admin/review-application/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status,
            'applicationDetails.reviewedAt': new Date(),
            'applicationDetails.notes': notes
          }
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json({
        message: `Application ${status}`,
        applicationId: id
      });
    } catch (error) {
      res.status(500).json({ error: "Error reviewing application" });
    }
  });

  // Lists every user account with a role-appropriate accountDetails summary attached.
  router.get("/admin/users", async (req, res) => {
    try {
      const users = await userCollection.find().toArray();
      const sanitizedUsers = users.map((user) => {
        const userWithoutPassword = sanitizeUser(user);
        return {
          ...userWithoutPassword,
          accountDetails: {
            createdAt: user.createdAt,
            status: user.status || 'active',
            ...(user.userType === 'librarian' && {
              libraryName: user.libraryName,
              libraryAddress: user.libraryAddress,
              applicationDetails: user.applicationDetails
            })
          }
        };
      });
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ error: "Error fetching users" });
    }
  });

  // Deletes a non-admin user account.
  router.delete("/admin/users/:id", async (req, res) => {
    try {
      const id = req.params.id;

      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.userType === 'admin') {
        return res.status(403).json({ error: "Cannot delete admin users" });
      }

      const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  });

  // Changes a non-admin user's role (e.g. reader <-> librarian).
  router.patch("/admin/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { userType } = req.body;

      if (!['admin', 'librarian', 'reader'].includes(userType)) {
        return res.status(400).json({ error: "Invalid user type" });
      }

      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.userType === 'admin') {
        return res.status(403).json({ error: "Cannot modify admin user type" });
      }

      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { userType } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User type updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error updating user type" });
    }
  });

  return router;
}

module.exports = createAdminRouter;