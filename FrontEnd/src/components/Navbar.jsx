import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/authSlice";
import { useState, useEffect } from "react";
// ✅ Fixed: Use FaShieldAlt instead of FaShield
import { FaBook, FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaShieldAlt } from "react-icons/fa";

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/logout", { method: "POST", credentials: "include" });
      localStorage.removeItem("token"); // ← ADD THIS
      dispatch(clearUser());
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("token"); // ← ADD THIS (even on error)
      dispatch(clearUser());
      navigate("/");
    }
  };

  const navLinks = [
    { name: "Categories", path: "/home?view=categories" },
    { name: "Deals", path: "/home?sort=price" },
    { name: "New Arrivals", path: "/home?sort=new" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
        : "bg-white/90 backdrop-blur-sm"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <FaBook className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              BookStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value;
                if (query) {
                  const event = new CustomEvent('searchBooks', { detail: query });
                  window.dispatchEvent(event);
                }
              }}
              className="w-full flex"
            >
              <input
                type="text"
                name="search"
                placeholder="Search books, authors..."
                className="input input-bordered w-full rounded-r-none border-r-0 focus:outline-none focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-l-none"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Auth & Cart Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Admin Panel Link - Only for Admins */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                    title="Admin Panel"
                  >
                    {/* ✅ Fixed: FaShieldAlt instead of FaShield */}
                    <FaShieldAlt className="w-4 h-4" />
                    <span className="hidden xl:inline">Admin</span>
                  </Link>
                )}

                {/* Cart Link */}
                <Link
                  to="/cart"
                  className="btn btn-sm btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white relative"
                  title="Shopping Cart"
                >
                  <FaShoppingCart />
                  {totalItems > 0 && (
                    <span className="badge badge-xs badge-primary absolute -top-1 -right-1">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User Profile Dropdown */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="avatar cursor-pointer">
                    <div className="w-9 rounded-full ring-2 ring-emerald-500 ring-offset-2 overflow-hidden">
                      <img
                        src={user?.photoUrl || "https://geographyandyou.com/images/user-profile.png"}
                        alt={user?.firstName}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-box w-52 border border-gray-100"
                  >
                    <li className="menu-title text-gray-500">
                      <span className="text-sm">
                        {user?.firstName} {user?.lastName}
                      </span>
                    </li>
                    <li>
                      <Link to="/home" className="text-gray-700 hover:text-emerald-600">
                        <FaUser className="mr-2" /> My Account
                      </Link>
                    </li>
                    {user?.role === "admin" && (
                      <li>
                        <Link to="/admin" className="text-emerald-600 hover:text-emerald-700">
                          {/* ✅ Fixed: FaShieldAlt */}
                          <FaShieldAlt className="mr-2" /> Admin Panel
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-600 w-full text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-sm bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white px-6 hover:shadow-lg hover:scale-105 transition-all"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="w-6 h-6 text-gray-700" />
            ) : (
              <FaBars className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white rounded-b-2xl shadow-lg">
            <div className="flex flex-col gap-2 px-4">
              {/* Mobile Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const query = e.target.search.value;
                  if (query) {
                    const event = new CustomEvent('searchBooks', { detail: query });
                    window.dispatchEvent(event);
                    setMobileMenuOpen(false);
                  }
                }}
                className="flex gap-2 mb-4"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search books..."
                  className="input input-bordered flex-1 bg-white text-gray-900 placeholder-gray-400"
                />
                <button type="submit" className="btn btn-sm bg-emerald-500 text-white">
                  <FaSearch />
                </button>
              </form>

              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <hr className="my-2" />

              {/* Auth Section - Mobile */}
              {isAuthenticated ? (
                <>
                  {/* Admin Link for Mobile */}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="px-4 py-3 text-emerald-600 font-medium flex items-center gap-2 bg-emerald-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {/* ✅ Fixed: FaShieldAlt */}
                      <FaShieldAlt className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}

                  <Link
                    to="/home"
                    className="px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser className="w-4 h-4" />
                    My Account
                  </Link>

                  <Link
                    to="/cart"
                    className="px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Cart
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left text-red-600 font-medium hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <FaTimes className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-sm bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}