// Loads variables from .env into process.env before anything else runs — this has to happen
// first, since config/db.js and utils/initializeAdmin.js both read process.env at call time.
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const initializeAdmin = require('./utils/initializeAdmin');
const createAuthRouter = require('./routes/auth.routes');
const createAdminRouter = require('./routes/admin.routes');
const createBooksRouter = require('./routes/books.routes');
const createLibrariesRouter = require('./routes/libraries.routes');
const createSavedBooksRouter = require('./routes/savedBooks.routes');
const createBorrowingRouter = require('./routes/borrowing.routes');
const createReadingActivityRouter = require('./routes/readingActivity.routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Connects to MongoDB, seeds the admin account if needed, and mounts every route module
 * once the collections they depend on are available.
 */
async function run() {
  let client;
  try {
    const connection = await connectDB();
    client = connection.client;
    const {
      bookCollection,
      userCollection,
      savedBooksCollection,
      borrowedBooksCollection,
      readingHistoryCollection,
      readingProgressCollection,
      borrowRequestsCollection
    } = connection;

    await initializeAdmin(userCollection);

    app.use(createAuthRouter(userCollection));
    app.use(createAdminRouter(userCollection));
    app.use(createBooksRouter(bookCollection, userCollection));
    app.use(createSavedBooksRouter(savedBooksCollection));
    app.use(createBorrowingRouter(borrowedBooksCollection, borrowRequestsCollection));
    app.use(createReadingActivityRouter(readingHistoryCollection, readingProgressCollection));
    app.use(createLibrariesRouter(userCollection));

    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB server connected successfully!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});