const bcrypt = require('bcrypt');

// Salt rounds for hashing the seeded admin password — named instead of repeating the magic
// number 10 here and in auth.routes.js.
const SALT_ROUNDS = 10;

/**
 * Creates the single default admin account (from ADMIN_EMAIL / ADMIN_PASSWORD) the first time
 * the server starts against a database that doesn't already have one.
 */
async function initializeAdmin(userCollection) {
  try {
    const adminExists = await userCollection.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, SALT_ROUNDS);
      const adminUser = {
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        fullName: "System Administrator",
        userType: "admin",
        createdAt: new Date()
      };

      await userCollection.insertOne(adminUser);
      console.log("Admin account created successfully");
    }
  } catch (error) {
    console.error("Error initializing admin account:", error);
  }
}

module.exports = initializeAdmin;