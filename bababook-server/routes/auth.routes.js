const express = require('express');
const bcrypt = require('bcrypt');
const sanitizeUser = require('../utils/sanitizeUser');

// Salt rounds for hashing new user passwords on signup.
const SALT_ROUNDS = 10;

/**
 * Builds the router for authentication endpoints (signup and login) against the given user collection.
 */
function createAuthRouter(userCollection) {
  const router = express.Router();

  // Registers a new reader or librarian account. Librarian accounts start "pending" and need
  // admin approval; admin accounts cannot be created through this endpoint.
  router.post("/auth/signup", async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        middleName,
        lastName,
        userType,
        libraryName,
        libraryAddress,
        username,
        phoneNumber
      } = req.body;

      if (userType === 'admin') {
        return res.status(403).json({ error: "Admin accounts cannot be created through signup" });
      }

      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const existingUsername = await userCollection.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = {
        email,
        password: hashedPassword,
        firstName,
        middleName,
        lastName,
        username,
        phoneNumber,
        userType,
        status: userType === 'librarian' ? 'pending' : 'active',
        createdAt: new Date(),
        ...(userType === 'librarian' && {
          libraryName,
          libraryAddress,
          applicationDetails: {
            submittedAt: new Date(),
            reviewedAt: null,
            reviewedBy: null,
            notes: null
          }
        })
      };

      const result = await userCollection.insertOne(user);

      const userWithoutPassword = sanitizeUser(user);

      res.status(201).json({
        message: userType === 'librarian' ?
          "Account created and pending admin approval" :
          "Account created successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  });

  // Authenticates a user by email/password and returns the user document minus the password.
  router.post("/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const userWithoutPassword = sanitizeUser(user);

      res.json({
        message: "Login successful",
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ error: "Error logging in" });
    }
  });

  return router;
}

module.exports = createAuthRouter;