```
├── bababook-client
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── assets
│   │   │   └── googleLogo.png
│   │   ├── components
│   │   │   ├── Auth.jsx
│   │   │   ├── ClientFooter.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Libraries.jsx
│   │   │   ├── LibraryModal.jsx
│   │   │   ├── LoadingAnimation.jsx
│   │   │   ├── Logout.jsx
│   │   │   ├── MapModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── styles.css
│   │   ├── images
│   │   │   ├── crime.jpg
│   │   │   ├── divine.jpg
│   │   │   ├── don.jpg
│   │   │   ├── illiad.jpg
│   │   │   ├── les.jpg
│   │   │   ├── little.jpg
│   │   │   ├── meta.jpg
│   │   │   ├── moby.jpg
│   │   │   ├── mocking.jpg
│   │   │   ├── odyssey.jpg
│   │   │   ├── pride.jpg
│   │   │   ├── sense.jpg
│   │   │   └── war.jpg
│   │   ├── router
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── router.jsx
│   │   ├── users
│   │   │   ├── admin
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── LibrarianApplications.jsx
│   │   │   │   └── ManageUsers.jsx
│   │   │   ├── librarian
│   │   │   │   ├── BorrowRequestManagement.jsx
│   │   │   │   ├── EditBooks.jsx
│   │   │   │   ├── LibrarianDashboard.jsx
│   │   │   │   ├── LibrarianLayout.jsx
│   │   │   │   ├── LibrarianWaitingPage.jsx
│   │   │   │   ├── ManageBooks.jsx
│   │   │   │   ├── UploadBook.jsx
│   │   │   │   ├── UploadBookPDF.jsx
│   │   │   │   └── UploadBookPDFViewer.jsx
│   │   │   ├── reader
│   │   │   │   ├── BookReader.jsx
│   │   │   │   ├── BorrowButton.jsx
│   │   │   │   ├── BorrowedBooks.jsx
│   │   │   │   ├── BrowseLibrary.jsx
│   │   │   │   ├── FindLibraries.jsx
│   │   │   │   ├── FindLibrariesMapView.jsx
│   │   │   │   ├── GoogleBookDetails.jsx
│   │   │   │   ├── GoogleBooksBrowse.jsx
│   │   │   │   ├── GoogleBooksFilter.jsx
│   │   │   │   ├── LocalBookDetails.jsx
│   │   │   │   ├── LocalBooksBrowse.jsx
│   │   │   │   ├── LocalBooksFilter.jsx
│   │   │   │   ├── ReaderDashboard.jsx
│   │   │   │   ├── ReaderLayout.jsx
│   │   │   │   ├── ReaderSettings.jsx
│   │   │   │   ├── ReadingProgressTracker.jsx
│   │   │   │   ├── SaveButton.jsx
│   │   │   │   └── SavedBooks.jsx
│   │   │   ├── LogoutSidebar.jsx
│   │   │   └── UserSettings.jsx
│   │   ├── utils
│   │   │   ├── AuthProvider.jsx
│   │   │   └── AuthUtils.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── bababook-server
    ├── config
    │   └── db.js
    ├── middleware
    │   └── verifyLibraryOwnership.js
    ├── routes
    │   ├── admin.routes.js
    │   ├── auth.routes.js
    │   ├── books.routes.js
    │   ├── borrowing.routes.js
    │   ├── libraries.routes.js
    │   ├── readingActivity.routes.js
    │   └── savedBooks.routes.js
    ├── utils
    │   ├── intializeAdmin.js
    │   └── sanitizeUser.js
    ├── .gitignore
    ├── folder-structure.md
    ├── index.js
    ├── package-lock.json
    └── package.json
```