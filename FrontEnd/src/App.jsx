import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Home from "./pages/Home.jsx";
import Books from "./pages/Books.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import ProtectedAdmin from "./components/ProtectedAdmin.jsx";
import Cart from "./pages/Cart.jsx";
import BookDetail from "./pages/BookDetail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/books" element={<Books />} />

        <Route path="/book/:id" element={<BookDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected User Routes */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminPanel />
            </ProtectedAdmin>
          }
        />

        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-[60vh] grid place-items-center p-6 pt-24">
              <div className="text-center">
                <h1 className="text-2xl font-bold">404 - Page not found</h1>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist</p>
                <a href="/home" className="btn btn-primary mt-4">Go Home</a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;