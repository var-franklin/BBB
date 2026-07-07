# 📚 BaBaBook

**A full-stack web-based e-book library platform connecting readers, librarians, and administrators.**

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Known Limitations & Possible Improvements](#known-limitations--possible-improvements)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## About

BaBaBook is a full-stack digital library platform built to make borrowing and managing books simpler for everyone involved — readers looking for something to read, librarians running a collection, and administrators overseeing the platform. It combines a searchable book catalog (Google Books + locally uploaded titles), a request-based physical borrowing workflow, and library discovery on an interactive map, wrapped in a role-based experience for **readers**, **librarians**, and **admins**.

It was originally developed as an undergraduate research project at Cavite State University – Naic Campus, exploring how a well-designed web application can make library resources more accessible and encourage better reading habits in a digital-first world.

## Features

### 👤 Reader
- Browse and search books from two sources: the Google Books catalog and titles uploaded by partner libraries
- Filter by genre, language, sort order, and print type
- Save books to a personal reading list
- Request to borrow a physical copy from a specific library, and track request status (pending / approved / rejected)
- View currently borrowed books and generate a printable PDF "borrowing ticket"
- Check reading availability for Google Books titles and jump straight to Google's preview or full web reader
- Track reading progress (bookmarks, annotations, completion %) and reading history
- Find nearby libraries on an interactive map with location search (Leaflet + OpenStreetMap)
- Manage personal account settings

### 📖 Librarian
- Register a library account with a name and address — the account stays in a **pending** state (with a dedicated waiting screen) until an admin approves it
- Upload new books with full metadata and an optional PDF file
- Edit, delete, or bulk-delete books from the library's catalog
- Review incoming borrow requests from readers and approve (with a due date) or reject them
- Dashboard overview of library activity

### 🛠️ Admin
- A system admin account is created automatically the first time the server starts (see [Default Admin Account](#default-admin-account))
- Review and approve/reject pending librarian applications
- View and manage all registered users, including changing a user's role or removing an account (admin accounts are protected from deletion or demotion)
- Dashboard overview of platform activity

## Tech Stack

**Frontend** — `bababook-client`
- [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- [React Router DOM v7](https://reactrouter.com/) for routing, nested layouts, and protected routes
- [Tailwind CSS](https://tailwindcss.com/) with [Flowbite](https://flowbite.com/) / [Flowbite React](https://flowbite-react.com/) for UI components
- [React-Leaflet](https://react-leaflet.js.org/) + [Leaflet](https://leafletjs.com/) for interactive maps
- [Axios](https://axios-http.com/) for HTTP requests
- [jsPDF](https://github.com/parallax/jsPDF) to generate borrowing-ticket PDFs
- [Lucide React](https://lucide.dev/) for icons

**Backend** — `bababook-server`
- [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/), organized into routers, config, middleware, and utils modules
- [MongoDB](https://www.mongodb.com/) via the native Node.js driver (no ORM/ODM)
- [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
- [dotenv](https://www.npmjs.com/package/dotenv) for environment-based configuration
- [CORS](https://www.npmjs.com/package/cors)
- [Nodemon](https://nodemon.io/) for local development

**External Services**
- [Google Books API](https://developers.google.com/books) — external book catalog and search
- [OpenStreetMap Nominatim](https://nominatim.org/) — free geocoding for the library map search

## Project Structure

```
BBB/
├── bababook-client/            # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Shared UI: Navbar, Home, Auth, modals, footer, etc.
│   │   ├── router/              # Route definitions and the private-route guard
│   │   ├── users/
│   │   │   ├── admin/           # Admin dashboard, user & application management
│   │   │   ├── librarian/       # Librarian dashboard, book & borrow-request management
│   │   │   └── reader/          # Reader dashboard, browsing, borrowing, maps, reading
│   │   ├── utils/                # Auth context/provider
│   │   └── images/               # Static book cover assets
│   └── ...
├── bababook-server/             # Express + MongoDB backend
│   ├── config/
│   │   └── db.js                 # MongoDB connection & collection setup
│   ├── middleware/
│   │   └── verifyLibraryOwnership.js  # Confirms a library owns a book before edit/delete
│   ├── routes/
│   │   ├── admin.routes.js       # Librarian application review, user management
│   │   ├── auth.routes.js        # Signup & login
│   │   ├── books.routes.js       # Book upload, browsing, edit, delete
│   │   ├── borrowing.routes.js   # Borrow requests & borrowed books
│   │   ├── libraries.routes.js   # Library listings
│   │   ├── readingActivity.routes.js  # Reading history & progress
│   │   └── savedBooks.routes.js  # Reader's saved-books list
│   ├── utils/
│   │   ├── intializeAdmin.js     # Seeds the admin account from .env on first run
│   │   └── sanitizeUser.js       # Strips the password field before sending user data
│   ├── .env                       # Local environment variables (not committed)
│   └── index.js                   # App entry point — wires everything together
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher, with npm
- A MongoDB database — either a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster or a local MongoDB instance
- A [Google Books API key](https://console.cloud.google.com/) (free — enable the "Books API" on a Google Cloud project)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/var-franklin/BBB.git
cd BBB
```

**2. Set up the server**

```bash
cd bababook-server
npm install
```

Create a `.env` file in `bababook-server/` with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose_a_password
```

Start the server:

```bash
npm start
```

The API runs on `http://localhost:5000` by default, or whatever port you set in `PORT`.

**3. Set up the client**

In a new terminal window:

```bash
cd bababook-client
npm install
```

Open `src/users/reader/GoogleBooksBrowse.jsx` and replace the `API_KEY` constant with your own Google Books API key.

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Default Admin Account

On its first run, the server automatically creates a system admin account using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from your `.env` file, so you can log in and explore the admin dashboard immediately with whatever credentials you set there.

## API Reference

All endpoints are served from the Express backend, organized into route modules under `bababook-server/routes/`.

| Method | Endpoint | Description |
|---|---|---|
| **Auth** | | |
| POST | `/auth/signup` | Register a new reader or librarian account |
| POST | `/auth/login` | Log in with email and password |
| **Admin** | | |
| GET | `/admin/pending-applications` | List librarian applications awaiting review |
| PATCH | `/admin/review-application/:id` | Approve or reject a librarian application |
| GET | `/admin/users` | List all registered users |
| PATCH | `/admin/users/:id` | Change a user's role |
| DELETE | `/admin/users/:id` | Delete a user |
| **Books** | | |
| POST | `/upload-book` | Upload a new book to a library's catalog |
| GET | `/all-books` | List/search books (supports filtering & pagination) |
| GET | `/book/:id` | Get details for a single book |
| PATCH | `/book/:id` | 🔒 Update a book — checked against the owning library via `verifyLibraryOwnership` |
| DELETE | `/book/:id` | 🔒 Delete a book — checked against the owning library via `verifyLibraryOwnership` |
| DELETE | `/books/bulk-delete` | Delete multiple books at once |
| **Reader — Saved Books** | | |
| POST | `/reader/save-book` | Save a book to a reader's personal list |
| GET | `/reader/saved-books/:userId` | Get a reader's saved books |
| DELETE | `/reader/saved-books/:userId/:bookId` | Remove a saved book |
| **Reader — Borrowing** | | |
| POST | `/reader/request-borrow` | Submit a request to borrow a book |
| GET | `/reader/borrow-requests/:userId` | Get a reader's borrow request history |
| POST | `/reader/borrow-book` | Record a borrowed book |
| GET | `/reader/borrowed-books/:userId` | Get a reader's currently borrowed books |
| **Reader — Reading Activity** | | |
| POST | `/reader/reading-history` | Update a reader's reading history |
| POST | `/reader/reading-progress` | Update a reader's reading progress |
| **Librarian — Borrow Requests** | | |
| GET | `/librarian/all-borrow-requests` | Get all borrow requests for a library |
| GET | `/librarian/borrow-requests` | Get borrow requests for a library |
| PUT | `/librarian/borrow-requests/:requestId` | Approve or reject a borrow request |
| **Libraries** | | |
| GET | `/all-libraries` | List all approved libraries |
| GET | `/library/:id` | Get details for a single library |

## Known Limitations & Possible Improvements

This was built as a research/capstone project, and a few tradeoffs came with the territory:

- **Authentication:** login currently returns a user object stored in the browser's `localStorage` rather than a signed token/session. Route protection on the client is enforced in the UI layer, and the backend's `verifyLibraryOwnership` middleware checks a `libraryId` passed with the request rather than a verified session — a production version would add token-based auth (e.g., JWT) so these checks can't be spoofed by the caller.
- **Google Books API key in source:** the client's Google Books API key is still hardcoded in `GoogleBooksBrowse.jsx` rather than pulled from an environment variable.
- **Hardcoded API URL:** the client points to `http://localhost:5000` directly, so pointing it at a deployed backend currently requires a small code change rather than an environment variable.
- **No automated tests** are included yet.

## License

This project does not currently have an open-source license. All rights are reserved by the author.

## Acknowledgments

- Built by [Franklin Gian G. Sarmiento](https://github.com/var-franklin)
- Book cover images used for demo/display purposes belong to their respective publishers/copyright holders
- Powered by the [Google Books API](https://developers.google.com/books) and [OpenStreetMap](https://www.openstreetmap.org/)
