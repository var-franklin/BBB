const { MongoClient, ServerApiVersion } = require('mongodb');

// Connection string now comes from the environment (see .env) instead of being hardcoded,
// so the real credentials never live in source control.
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/**
 * Opens the MongoDB connection and returns references to every collection the app uses,
 * along with the raw client so the caller can run its own connection checks against it.
 */
async function connectDB() {
  await client.connect();

  const bookCollection = client.db("BaBaBookDatabase").collection("books");
  const userCollection = client.db("BaBaBookDatabase").collection("users");
  const savedBooksCollection = client.db("BaBaBookDatabase").collection("savedBooks");
  const borrowedBooksCollection = client.db("BaBaBookDatabase").collection("borrowedBooks");
  const readingHistoryCollection = client.db("BaBaBookDatabase").collection("readingHistory");
  const readingProgressCollection = client.db("BaBaBookDatabase").collection("readingProgress");
  const borrowRequestsCollection = client.db("BaBaBookDatabase").collection("borrowRequests");

  return {
    client,
    bookCollection,
    userCollection,
    savedBooksCollection,
    borrowedBooksCollection,
    readingHistoryCollection,
    readingProgressCollection,
    borrowRequestsCollection
  };
}

module.exports = connectDB;