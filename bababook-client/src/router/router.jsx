import { createBrowserRouter, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import PrivateRoute from "./PrivateRoute";
import App from "../App";
import Home from "../components/Home";
import Auth from "../components/Auth";
import Logout from "../components/Logout";

import ReaderDashboard from "../users/reader/ReaderDashboard";
import ReaderLayout from "../users/reader/ReaderLayout";
import BrowseLibrary from "../users/reader/BrowseLibrary";
import BookReader from "../users/reader/BookReader";
import LocalBooksBrowse from "../users/reader/LocalBooksBrowse";
import LocalBookDetails from "../users/reader/LocalBookDetails";
import GoogleBooksBrowse from "../users/reader/GoogleBooksBrowse";
import GoogleBookDetails from "../users/reader/GoogleBookDetails";
import ReaderSettings from "../users/reader/ReaderSettings";
import SavedBooks from "../users/reader/SavedBooks";
import FindLibraries from "../users/reader/FindLibraries";
import BorrowedBooks from "../users/reader/BorrowedBooks";

import LibrarianDashboard from "../users/librarian/LibrarianDashboard";
import LibrarianLayout from "../users/librarian/LibrarianLayout";
import LibrarianWaitingPage from "../users/librarian/LibrarianWaitingPage";
import ManageBooks from "../users/librarian/ManageBooks";
import EditBooks from "../users/librarian/EditBooks";
import BorrowRequestsManagement from "../users/librarian/BorrowRequestManagement";

import AdminDashboard from "../users/admin/AdminDashboard";
import AdminLayout from "../users/admin/AdminLayout";
import UserSettings from "../users/UserSettings";
import ManageUsers from "../users/admin/ManageUsers";
import LibrarianApplications from "../users/admin/LibrarianApplications";
import Libraries from "../components/Libraries";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "libraries", element: <Libraries /> },
    ]
  },
  {
    path: "/auth",
    children: [
      { path: "sign-up", element: <Auth /> },
      { path: "sign-in", element: <Auth /> },
      { path: "logout", element: <Logout /> },
      { path: "waiting", element: <LibrarianWaitingPage /> },
    ]
  },
  {
    path: "/reader",
    element: (
      <PrivateRoute>
        <ReaderLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <ReaderDashboard /> },
      { path: "browse", element: <BrowseLibrary /> },
      { path: "browse/local", element: <LocalBooksBrowse /> },
      { path: "browse/local/:id", element: <LocalBookDetails /> },
      { path: "browse/google", element: <GoogleBooksBrowse /> },
      { path: "browse/google/:id", element: <GoogleBookDetails /> },
      { path: "browse/google/:id/read", element: <BookReader /> },
      { path: "borrowed-books", element: <BorrowedBooks /> },
      { path: "saved-books", element: <SavedBooks /> },
      { path: "find-libraries", element: <FindLibraries /> },
      { path: "settings", element: <ReaderSettings /> },
    ]
  },
  {
    path: "/librarian",
    element: (
      <PrivateRoute>
        <LibrarianLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <LibrarianDashboard /> },
      { path: "manage-books", element: <ManageBooks /> },
      { path: "settings", element: <UserSettings /> },
      { path: "borrow-requests", element: <BorrowRequestsManagement /> },
      { 
        path: "edit-books/:id", 
        element: <EditBooks />,
        loader: async ({ params }) => {
          const response = await fetch(`http://localhost:5000/book/${params.id}`);
          if (!response.ok) {
            throw new Error('Failed to load book');
          }
          const book = await response.json();
          return book;
        }
      }
    ]
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "librarian-applications", element: <LibrarianApplications /> },
      { path: "settings", element: <UserSettings /> },
    ]
  }
]);
export default router;