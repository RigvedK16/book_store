// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import {
//   FaBook, FaShoppingCart, FaHeart, FaClock, FaStar,
//   FaTruck, FaUndo, FaChevronRight, FaSearch, FaFilter,
//   FaThLarge, FaList, FaTimes, FaCheck, FaSpinner, FaExclamationTriangle
// } from "react-icons/fa";
// import { api } from "../utils/api";
// import { addToCart } from "../redux/cartSlice";

// export default function Home() {
//   const { user } = useSelector((state) => state.auth);
//   const { totalItems } = useSelector((state) => state.cart);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [searchParams, setSearchParams] = useSearchParams();
//   const [books, setBooks] = useState([]);
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [sortBy, setSortBy] = useState("");
//   const [viewMode, setViewMode] = useState("grid");
//   const [activeTab, setActiveTab] = useState("browse");
//   const [message, setMessage] = useState({ type: "", text: "" });

//   // ✅ Cancel Order State
//   const [cancelingOrderId, setCancelingOrderId] = useState(null);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [orderToCancel, setOrderToCancel] = useState(null);

//   const categories = ["fiction", "non-fiction", "education", "technology", "self-help", "biography", "others"];

//   useEffect(() => {
//     fetchBooks();
//     fetchOrders();

//     const handleSearch = (e) => {
//       setSearchQuery(e.detail);
//       setActiveTab("browse");
//     };
//     window.addEventListener('searchBooks', handleSearch);

//     return () => {
//       window.removeEventListener('searchBooks', handleSearch);
//     };
//   }, []);

//   useEffect(() => {
//     filterAndSortBooks();
//   }, [books, searchQuery, selectedCategory, sortBy]);

//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       const data = await api("/books");
//       setBooks(data.books || []);
//     } catch (err) {
//       console.error("Error fetching books:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const bookingsRes = await api("/my-bookings");
//       setOrders(bookingsRes.bookings || []);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     }
//   };

//   const filterAndSortBooks = () => {
//     let filtered = [...books];

//     if (searchQuery) {
//       filtered = filtered.filter(book =>
//         book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         book.author.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (selectedCategory) {
//       filtered = filtered.filter(book => book.category === selectedCategory);
//     }

//     if (sortBy === "price") {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (sortBy === "price-desc") {
//       filtered.sort((a, b) => b.price - a.price);
//     } else if (sortBy === "new") {
//       filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     }

//     setFilteredBooks(filtered);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const query = e.target.search.value;
//     setSearchQuery(query);
//     setActiveTab("browse");
//   };

//   const handleAddToCart = (book) => {
//     if (!user) {
//       navigate("/login", { state: { from: { pathname: "/home" } } });
//       return;
//     }

//     dispatch(addToCart({ book, quantity: 1 }));
//     setMessage({ type: "success", text: `"${book.title}" added to cart! 🛒` });
//     setTimeout(() => setMessage({ type: "", text: "" }), 2500);
//   };

//   // ✅ NEW: Open Cancel Modal
//   const openCancelModal = (order) => {
//     setOrderToCancel(order);
//     setShowCancelModal(true);
//   };

//   // ✅ NEW: Close Cancel Modal
//   const closeCancelModal = () => {
//     setShowCancelModal(false);
//     setOrderToCancel(null);
//   };

//   // ✅ NEW: Cancel Order Handler
//   const handleCancelOrder = async () => {
//     if (!orderToCancel) return;

//     setCancelingOrderId(orderToCancel._id);

//     try {
//       // Call backend cancel endpoint
//       await api(`/booking/${orderToCancel._id}/cancel`, {
//         method: "PATCH",
//       });

//       // Success - Update local state
//       setOrders(prevOrders =>
//         prevOrders.map(order =>
//           order._id === orderToCancel._id
//             ? { ...order, status: "cancelled" }
//             : order
//         )
//       );

//       setMessage({
//         type: "success",
//         text: `Order cancelled successfully! Refund will be processed within 5-7 business days.`
//       });

//       closeCancelModal();
//       setTimeout(() => setMessage({ type: "", text: "" }), 4000);

//     } catch (err) {
//       console.error("Cancel order error:", err);
//       setMessage({
//         type: "error",
//         text: err.message || "Failed to cancel order. Please try again."
//       });
//       closeCancelModal();
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } finally {
//       setCancelingOrderId(null);
//     }
//   };

//   const orderStatusColors = {
//     booked: "badge-info",
//     cancelled: "badge-error",
//     delivered: "badge-success",
//   };

//   const orderStatusLabels = {
//     booked: "Booked",
//     cancelled: "Cancelled",
//     delivered: "Delivered",
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-black pt-20">
//       {/* Welcome Header with Search */}
//       <header className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-8">
//         <div className="container mx-auto px-4">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold">
//               Welcome back, {user?.firstName || "Reader"}! 👋
//             </h1>
//             <p className="opacity-90 mt-1">
//               Discover your next favorite read
//             </p>
//           </div>

//           {/* Toast Message */}
//           {message.text && (
//             <div className={`alert mx-4 mb-4 ${message.type === "success"
//               ? "alert-success bg-green-100 text-green-800 border border-green-300"
//               : "alert-error bg-red-100 text-red-800 border border-red-300"
//               }`}>
//               {message.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
//               <span>{message.text}</span>
//             </div>
//           )}

//           {/* Search Bar */}
//           <form onSubmit={handleSearch} className="max-w-2xl">
//             <div className="flex gap-2">
//               <div className="relative flex-1">
//                 <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   name="search"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search by title, author, or ISBN..."
//                   className="input input-bordered w-full pl-12 bg-white text-gray-900 placeholder-gray-400 border-0 focus:ring-2 focus:ring-white/50"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="btn bg-white text-emerald-600 border-none hover:bg-gray-100 px-6"
//               >
//                 Search
//               </button>
//             </div>
//           </form>

//           {/* Tabs */}
//           <div className="flex gap-4 mt-6">
//             <button
//               onClick={() => setActiveTab("browse")}
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "browse"
//                 ? "bg-white text-emerald-600"
//                 : "bg-white/20 hover:bg-white/30"
//                 }`}
//             >
//               <FaBook className="inline mr-2" />
//               Browse Books
//             </button>
//             <button
//               onClick={() => setActiveTab("orders")}
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "orders"
//                 ? "bg-white text-emerald-600"
//                 : "bg-white/20 hover:bg-white/30"
//                 }`}
//             >
//               <FaShoppingCart className="inline mr-2" />
//               My Orders
//               {orders.filter(o => o.status === "booked").length > 0 && (
//                 <span className="badge badge-sm badge-primary ml-2">
//                   {orders.filter(o => o.status === "booked").length}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {activeTab === "browse" ? (
//           <>
//             {/* Filters and View Toggle */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//               <div className="flex flex-wrap items-center gap-3">
//                 <div className="flex items-center gap-2">
//                   <FaFilter className="text-gray-500" />
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="select select-bordered bg-white text-gray-900"
//                   >
//                     <option value="">All Categories</option>
//                     {categories.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="select select-bordered bg-white text-gray-900"
//                 >
//                   <option value="">Sort By</option>
//                   <option value="price">Price: Low to High</option>
//                   <option value="price-desc">Price: High to Low</option>
//                   <option value="new">Newest First</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow">
//                 <button
//                   onClick={() => setViewMode("grid")}
//                   className={`p-2 rounded ${viewMode === "grid" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
//                 >
//                   <FaThLarge />
//                 </button>
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className={`p-2 rounded ${viewMode === "list" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
//                 >
//                   <FaList />
//                 </button>
//               </div>
//             </div>

//             <p className="text-gray-600 mb-4">
//               Showing {filteredBooks.length} of {books.length} books
//               {searchQuery && ` for "${searchQuery}"`}
//             </p>

//             {loading ? (
//               <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
//                 {[...Array(8)].map((_, i) => (
//                   <div key={i} className="card bg-white shadow animate-pulse">
//                     <div className={viewMode === "grid" ? "h-64 bg-gray-200" : "hidden"}></div>
//                     <div className="card-body p-4">
//                       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                       <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
//                       <div className="flex justify-between">
//                         <div className="h-6 bg-gray-200 rounded w-1/4"></div>
//                         <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : filteredBooks.length === 0 ? (
//               <div className="text-center py-12">
//                 <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg">No books found</p>
//                 <button
//                   onClick={() => {
//                     setSearchQuery("");
//                     setSelectedCategory("");
//                     setSortBy("");
//                   }}
//                   className="btn btn-outline border-emerald-500 text-emerald-600 mt-4"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             ) : (
//               <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
//                 {filteredBooks.map((book) => (
//                   <div
//                     key={book._id}
//                     className={`card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${viewMode === "list" ? "flex flex-row" : ""
//                       }`}
//                   >
//                     <figure className={viewMode === "grid" ? "" : "w-48"}>
//                       <img
//                         src={book.imageUrl || "https://via.placeholder.com/200x300"}
//                         alt={book.title}
//                         className={viewMode === "grid" ? "w-full h-64 object-cover" : "w-full h-48 object-cover"}
//                       />
//                       {book.stock < 10 && book.stock > 0 && (
//                         <span className="absolute top-2 left-2 badge badge-warning badge-xs">
//                           Low Stock
//                         </span>
//                       )}
//                       {book.stock === 0 && (
//                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//                           <span className="text-white font-bold">Out of Stock</span>
//                         </div>
//                       )}
//                     </figure>
//                     <div className="card-body p-4">
//                       <div className="text-xs text-emerald-600 font-medium mb-1 capitalize">
//                         {book.category}
//                       </div>
//                       <h3 className="card-title text-lg font-bold mb-1 line-clamp-1">
//                         {book.title}
//                       </h3>
//                       <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
//                       <div className="flex items-center gap-1 mb-3">
//                         <FaStar className="text-yellow-500" />
//                         <span className="text-sm font-medium">{book.rating || "New"}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-xl font-bold text-emerald-600">
//                           ₹{book.price}
//                         </span>
//                         <button
//                           onClick={() => handleAddToCart(book)}
//                           className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none disabled:opacity-50"
//                           disabled={book.stock === 0}
//                         >
//                           <FaShoppingCart className="mr-1" />
//                           {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           /* Orders Tab */
//           <>
//             <h2 className="text-2xl font-bold mb-6">My Orders</h2>
//             {orders.length === 0 ? (
//               <div className="card bg-white shadow p-6 text-center">
//                 <FaShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-500">No orders yet</p>
//                 <button
//                   onClick={() => setActiveTab("browse")}
//                   className="btn btn-outline border-emerald-500 text-emerald-600 mt-3"
//                 >
//                   Start Shopping
//                 </button>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {orders.map((order) => (
//                   <div key={order._id} className="card bg-white shadow hover:shadow-lg transition-shadow">
//                     <div className="card-body p-4">
//                       <div className="flex items-start justify-between mb-2">
//                         <div>
//                           <h3 className="font-bold line-clamp-1">
//                             {order.bookId?.title || "Book"}
//                           </h3>
//                           <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
//                         </div>
//                         <span className={`badge ${orderStatusColors[order.status] || "badge-ghost"}`}>
//                           {orderStatusLabels[order.status] || order.status}
//                         </span>
//                       </div>
//                       <p className="text-lg font-bold text-emerald-600">
//                         ₹{order.totalPrice}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">
//                         <FaClock className="inline mr-1" />
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </p>

//                       {/* ✅ Cancel Button - Only for 'booked' status */}
//                       {order.status === "booked" && (
//                         <button
//                           onClick={() => openCancelModal(order)}
//                           className="btn btn-xs btn-outline border-red-300 text-red-500 hover:bg-red-50 mt-3 w-full"
//                         >
//                           <FaTimes className="mr-1" />
//                           Cancel Order
//                         </button>
//                       )}

//                       {/* Cancelled/Delivered Info */}
//                       {order.status === "cancelled" && (
//                         <div className="alert alert-warning alert-xs mt-3 p-2">
//                           <FaExclamationTriangle className="w-3 h-3" />
//                           <span>Order cancelled. Refund will be processed.</span>
//                         </div>
//                       )}

//                       {order.status === "delivered" && (
//                         <div className="alert alert-success alert-xs mt-3 p-2">
//                           <FaCheck className="w-3 h-3" />
//                           <span>Order delivered successfully</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       {/* ✅ Cancel Order Confirmation Modal */}
//       {showCancelModal && orderToCancel && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="card bg-white shadow-2xl rounded-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
//             <div className="card-body p-6">
//               {/* Header */}
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
//                   <FaExclamationTriangle className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-900">Cancel Order?</h3>
//                   <p className="text-sm text-gray-500">This action cannot be undone</p>
//                 </div>
//               </div>

//               {/* Order Details */}
//               <div className="bg-gray-50 rounded-xl p-4 mb-4">
//                 <div className="flex gap-3">
//                   <img
//                     src={orderToCancel.bookId?.imageUrl || "https://via.placeholder.com/80x120"}
//                     alt={orderToCancel.bookId?.title}
//                     className="w-16 h-20 object-cover rounded-lg"
//                   />
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900 line-clamp-1">
//                       {orderToCancel.bookId?.title || "Book"}
//                     </p>
//                     <p className="text-sm text-gray-500">Qty: {orderToCancel.quantity}</p>
//                     <p className="text-sm font-bold text-emerald-600">₹{orderToCancel.totalPrice}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Warning Message */}
//               <div className="alert alert-warning bg-amber-50 text-amber-800 border border-amber-200 mb-4">
//                 <FaExclamationTriangle className="w-4 h-4" />
//                 <span className="text-sm">
//                   Refund will be processed within 5-7 business days to your original payment method.
//                 </span>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-3">
//                 <button
//                   onClick={closeCancelModal}
//                   disabled={cancelingOrderId}
//                   className="btn btn-ghost flex-1"
//                 >
//                   Keep Order
//                 </button>
//                 <button
//                   onClick={handleCancelOrder}
//                   disabled={cancelingOrderId === orderToCancel._id}
//                   className="btn bg-red-500 hover:bg-red-600 text-white border-none flex-1 disabled:opacity-70"
//                 >
//                   {cancelingOrderId === orderToCancel._id ? (
//                     <>
//                       <FaSpinner className="animate-spin mr-2" />
//                       Canceling...
//                     </>
//                   ) : (
//                     <>
//                       <FaTimes className="mr-2" />
//                       Yes, Cancel
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaBook, FaShoppingCart, FaHeart, FaClock, FaStar,
  FaTruck, FaUndo, FaChevronRight, FaSearch, FaFilter,
  FaThLarge, FaList, FaTimes, FaCheck, FaSpinner, FaExclamationTriangle, FaEye
} from "react-icons/fa";
import { api } from "../utils/api";
import { addToCart } from "../redux/cartSlice";

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("browse");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const categories = ["fiction", "non-fiction", "education", "technology", "self-help", "biography", "others"];

  useEffect(() => {
    fetchBooks();
    fetchOrders();

    const handleSearch = (e) => {
      setSearchQuery(e.detail);
      setActiveTab("browse");
    };
    window.addEventListener('searchBooks', handleSearch);

    return () => {
      window.removeEventListener('searchBooks', handleSearch);
    };
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchQuery, selectedCategory, sortBy]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await api("/books");
      setBooks(data.books || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const bookingsRes = await api("/my-bookings");
      setOrders(bookingsRes.bookings || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = [...books];

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "new") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredBooks(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    setSearchQuery(query);
    setActiveTab("browse");
  };

  const handleAddToCart = (book) => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/home" } } });
      return;
    }

    dispatch(addToCart({ book, quantity: 1 }));
    setMessage({ type: "success", text: `"${book.title}" added to cart! 🛒` });
    setTimeout(() => setMessage({ type: "", text: "" }), 2500);
  };

  const handleViewBook = (bookId) => {
    console.log("Navigating to book:", bookId);
    navigate(`/book/${bookId}`);
  };

  const openCancelModal = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    setCancelingOrderId(orderToCancel._id);

    try {
      await api(`/booking/${orderToCancel._id}/cancel`, {
        method: "PATCH",
      });

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderToCancel._id
            ? { ...order, status: "cancelled" }
            : order
        )
      );

      setMessage({
        type: "success",
        text: `Order cancelled successfully! Refund will be processed within 5-7 business days.`
      });

      closeCancelModal();
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);

    } catch (err) {
      console.error("Cancel order error:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to cancel order. Please try again."
      });
      closeCancelModal();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } finally {
      setCancelingOrderId(null);
    }
  };

  const orderStatusColors = {
    booked: "badge-info",
    cancelled: "badge-error",
    delivered: "badge-success",
  };

  const orderStatusLabels = {
    booked: "Booked",
    cancelled: "Cancelled",
    delivered: "Delivered",
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <header className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.firstName || "Reader"}! 👋
            </h1>
            <p className="opacity-90 mt-1 text-white">
              Discover your next favorite read
            </p>
          </div>

          {message.text && (
            <div className={`alert mx-4 mb-4 ${message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
              }`}>
              {message.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or ISBN..."
                  className="input input-bordered w-full pl-12 bg-white text-gray-900 placeholder-gray-400 border-0 focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button
                type="submit"
                className="btn bg-white text-emerald-600 border-none hover:bg-gray-100 px-6"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "browse"
                ? "bg-white text-emerald-600"
                : "bg-white/20 hover:bg-white/30 text-white"
                }`}
            >
              <FaBook className="inline mr-2" />
              Browse Books
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "orders"
                ? "bg-white text-emerald-600"
                : "bg-white/20 hover:bg-white/30 text-white"
                }`}
            >
              <FaShoppingCart className="inline mr-2" />
              My Orders
              {orders.filter(o => o.status === "booked").length > 0 && (
                <span className="badge badge-sm badge-primary ml-2">
                  {orders.filter(o => o.status === "booked").length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "browse" ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="select select-bordered bg-white text-gray-900"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select select-bordered bg-white text-gray-900"
                >
                  <option value="">Sort By</option>
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="new">Newest First</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <FaList />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              Showing {filteredBooks.length} of {books.length} books
              {searchQuery && ` for "${searchQuery}"`}
            </p>

            {loading ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card bg-white shadow animate-pulse">
                    <div className={viewMode === "grid" ? "h-64 bg-gray-200" : "hidden"}></div>
                    <div className="card-body p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No books found</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSortBy("");
                  }}
                  className="btn btn-outline border-emerald-500 text-emerald-600 mt-4"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
                {filteredBooks.map((book) => (
                  <div
                    key={book._id}
                    className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <figure className="relative">
                      <img
                        src={book.imageUrl || "https://via.placeholder.com/200x300"}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                      />
                      {book.stock < 10 && book.stock > 0 && (
                        <span className="absolute top-2 left-2 badge badge-warning badge-xs">
                          Low Stock
                        </span>
                      )}
                      {book.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold">Out of Stock</span>
                        </div>
                      )}
                    </figure>
                    <div className="card-body p-4">
                      <div className="text-xs text-emerald-600 font-medium mb-1 capitalize">
                        {book.category}
                      </div>
                      <h3 className="card-title text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                      <div className="flex items-center gap-1 mb-3">
                        <FaStar className="text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">{book.rating || "New"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-emerald-600">
                          ₹{book.price}
                        </span>
                        <div className="flex gap-2">
                          <a
                            href={`/book/${book._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors no-underline"
                            style={{ textDecoration: 'none', color: 'white' }}
                          >
                            <FaEye className="w-3 h-3" />
                            View
                          </a>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(book)}
                            className="inline-flex items-center justify-center w-8 h-8 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50"
                            disabled={book.stock === 0}
                            title={book.stock > 0 ? "Add to cart" : "Out of stock"}
                          >
                            <FaShoppingCart className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <div className="card bg-white shadow p-6 text-center">
                <FaShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders yet</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="btn btn-outline border-emerald-500 text-emerald-600 mt-3"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <div key={order._id} className="card bg-white shadow hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-1">
                            {order.bookId?.title || "Book"}
                          </h3>
                          <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                        </div>
                        <span className={`badge ${orderStatusColors[order.status] || "badge-ghost"}`}>
                          {orderStatusLabels[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-emerald-600">
                        ₹{order.totalPrice}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        <FaClock className="inline mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>

                      {order.status === "booked" && (
                        <button
                          onClick={() => openCancelModal(order)}
                          className="btn btn-xs btn-outline border-red-300 text-red-500 hover:bg-red-50 mt-3 w-full"
                        >
                          <FaTimes className="mr-1" />
                          Cancel Order
                        </button>
                      )}

                      {order.status === "cancelled" && (
                        <div className="alert alert-warning alert-xs mt-3 p-2">
                          <FaExclamationTriangle className="w-3 h-3" />
                          <span>Order cancelled. Refund will be processed.</span>
                        </div>
                      )}

                      {order.status === "delivered" && (
                        <div className="alert alert-success alert-xs mt-3 p-2">
                          <FaCheck className="w-3 h-3" />
                          <span>Order delivered successfully</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showCancelModal && orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card bg-white shadow-2xl rounded-2xl max-w-md w-full">
            <div className="card-body p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <FaExclamationTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Cancel Order?</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex gap-3">
                  <img
                    src={orderToCancel.bookId?.imageUrl || "https://via.placeholder.com/80x120"}
                    alt={orderToCancel.bookId?.title}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {orderToCancel.bookId?.title || "Book"}
                    </p>
                    <p className="text-sm text-gray-500">Qty: {orderToCancel.quantity}</p>
                    <p className="text-sm font-bold text-emerald-600">₹{orderToCancel.totalPrice}</p>
                  </div>
                </div>
              </div>

              <div className="alert alert-warning bg-amber-50 text-amber-800 border border-amber-200 mb-4">
                <FaExclamationTriangle className="w-4 h-4" />
                <span className="text-sm">
                  Refund will be processed within 5-7 business days to your original payment method.
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeCancelModal}
                  disabled={cancelingOrderId}
                  className="btn btn-ghost flex-1"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelingOrderId === orderToCancel._id}
                  className="btn bg-red-500 hover:bg-red-600 text-white border-none flex-1 disabled:opacity-70"
                >
                  {cancelingOrderId === orderToCancel._id ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Canceling...
                    </>
                  ) : (
                    <>
                      <FaTimes className="mr-2" />
                      Yes, Cancel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}