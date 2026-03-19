import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    FaStar, FaShoppingCart, FaHeart, FaArrowLeft, FaTrash, FaEdit,
    FaCheck, FaExclamationTriangle, FaSpinner, FaUser, FaCalendar,
    FaTruck, FaUndo, FaShieldAlt   // ✅ fixed here
} from "react-icons/fa";
import { api } from "../utils/api";
import { addToCart } from "../redux/cartSlice";

export default function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { totalItems } = useSelector((state) => state.cart);

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Review states
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [userReview, setUserReview] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [reviewPage, setReviewPage] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        fetchBookDetails();
        fetchReviews();
    }, [id, reviewPage]);

    const fetchBookDetails = async () => {
        try {
            setLoading(true);
            const data = await api(`/book/${id}`);
            setBook(data.book);
        } catch (err) {
            console.error("Error fetching book:", err);
            setMessage({ type: "error", text: "Failed to load book details" });
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);
            const data = await api(`/book/${id}/reviews?page=${reviewPage}&limit=10`);
            setReviews(data.reviews || []);
            setTotalReviews(data.totalReviews || 0);
            setAverageRating(data.averageRating || 0);

            // Find user's own review
            if (isAuthenticated && user) {
                const myReview = data.reviews?.find(r => r.userId?._id === user._id);
                setUserReview(myReview || null);
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleAddToCart = () => {
        // ✅ Check auth from Redux state (which now persists via localStorage)
        if (!isAuthenticated || !user) {
            // Save current page as return URL for post-login redirect
            navigate("/login", {
                state: { from: { pathname: `/book/${id}` } }
            });
            return;
        }

        dispatch(addToCart({ book, quantity: 1 }));
        setMessage({ type: "success", text: `"${book.title}" added to cart! 🛒` });
        setTimeout(() => setMessage({ type: "", text: "" }), 2500);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate("/login", { state: { from: { pathname: `/book/${id}` } } });
            return;
        }

        try {
            if (editingReviewId) {
                // Update existing review
                const data = await api(`/review/${editingReviewId}`, {
                    method: "PATCH",
                    body: reviewData,
                });
                setMessage({ type: "success", text: "Review updated successfully! ✨" });
                setEditingReviewId(null);
            } else {
                // Create new review
                const data = await api(`/book/${id}/review`, {
                    method: "POST",
                    body: reviewData,
                });
                setMessage({ type: "success", text: "Review added successfully! 🎉" });
                setUserReview(data.review);
            }

            setShowReviewForm(false);
            setReviewData({ rating: 5, comment: "" });
            fetchReviews(); // Refresh reviews
            fetchBookDetails(); // Refresh book rating
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (err) {
            console.error("Review error:", err);
            setMessage({ type: "error", text: err.message || "Failed to submit review" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    const handleEditReview = (review) => {
        setReviewData({ rating: review.rating, comment: review.comment });
        setEditingReviewId(review._id);
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await api(`/review/${reviewId}`, { method: "DELETE" });
            setMessage({ type: "success", text: "Review deleted successfully" });
            if (userReview?._id === reviewId) setUserReview(null);
            fetchReviews();
            fetchBookDetails();
            setTimeout(() => setMessage({ type: "", text: "" }), 2500);
        } catch (err) {
            console.error("Delete review error:", err);
            setMessage({ type: "error", text: "Failed to delete review" });
            setTimeout(() => setMessage({ type: "", text: "" }), 2500);
        }
    };

    const renderStars = (rating, interactive = false, size = "w-4 h-4") => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? "button" : "button"}
                        disabled={!interactive}
                        onClick={() => interactive && setReviewData({ ...reviewData, rating: star })}
                        className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
                    >
                        <FaStar
                            className={`${size} ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center pt-24">
                <div className="text-center">
                    <FaSpinner className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen grid place-items-center pt-24 px-4">
                <div className="text-center">
                    <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h1>
                    <p className="text-gray-600 mb-6">The book you're looking for doesn't exist</p>
                    <Link to="/home" className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                        <FaArrowLeft className="mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Toast Message */}
                {message.text && (
                    <div className={`alert fixed top-24 right-4 z-50 max-w-md ${message.type === "success"
                        ? "alert-success bg-green-100 text-green-800 border border-green-300"
                        : "alert-error bg-red-100 text-red-800 border border-red-300"
                        }`}>
                        {message.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Back Button */}
                <Link
                    to="/home"
                    className="btn btn-ghost mb-6 text-gray-600 hover:text-emerald-600"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Browse
                </Link>

                {/* Book Details Section */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Book Image */}
                    <div className="card bg-white shadow-xl rounded-2xl overflow-hidden">
                        <figure className="relative">
                            <img
                                src={book.imageUrl || "https://via.placeholder.com/400x600"}
                                alt={book.title}
                                className="w-full h-[500px] object-cover"
                            />
                            {book.stock < 10 && book.stock > 0 && (
                                <span className="absolute top-4 left-4 badge badge-warning text-sm">
                                    Only {book.stock} left in stock
                                </span>
                            )}
                            {book.stock === 0 && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">Out of Stock</span>
                                </div>
                            )}
                        </figure>
                    </div>

                    {/* Book Info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-emerald-600 font-medium mb-2 capitalize">
                                {book.category}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {book.title}
                            </h1>
                            <p className="text-lg text-gray-600">by {book.author}</p>
                        </div>

                        {/* Rating
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {renderStars(Math.round(book.rating || 0))}
                                <span className="text-2xl font-bold text-gray-900">
                                    {book.rating?.toFixed(1) || "New"}
                                </span>
                            </div>
                            <span className="text-gray-500">
                                ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                            </span>
                        </div> */}

                        {/* Price */}
                        <div className="text-4xl font-bold text-emerald-600">
                            ₹{book.price}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {book.description || "No description available for this book."}
                            </p>
                        </div>

                        {/* Stock Info */}
                        <div className="flex items-center gap-2 text-gray-600">
                            <FaTruck className="text-emerald-600" />
                            <span>
                                {book.stock > 0 ? "In Stock" : "Currently Unavailable"}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={book.stock === 0}
                                className="btn bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white font-medium px-8 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <FaShoppingCart className="mr-2" />
                                {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
                            </button>
                            <button className="btn btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white">
                                <FaHeart className="mr-2" />
                                Wishlist
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <FaTruck className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                                <p className="text-xs text-gray-600">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <FaUndo className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                                <p className="text-xs text-gray-600">30-Day Returns</p>
                            </div>
                            <div className="text-center">
                                <FaShieldAlt className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                                <p className="text-xs text-gray-600">Secure Payment</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="card bg-white shadow-xl rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                            <div className="flex items-center gap-2 mt-1">
                                {renderStars(Math.round(averageRating))}
                                <span className="text-gray-600">
                                    {averageRating.toFixed(1)} out of 5 ({totalReviews} reviews)
                                </span>
                            </div>
                        </div>
                        {isAuthenticated && !userReview && (
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                            >
                                <FaStar className="mr-2" />
                                Write a Review
                            </button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h3 className="font-bold text-lg mb-4">
                                {editingReviewId ? "Edit Your Review" : "Share Your Thoughts"}
                            </h3>
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">Your Rating</span>
                                    </label>
                                    {renderStars(reviewData.rating, true, "w-6 h-6")}
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">Your Review</span>
                                    </label>
                                    <textarea
                                        value={reviewData.comment}
                                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                        placeholder="What did you think about this book? (optional)"
                                        className="textarea textarea-bordered w-full bg-white text-gray-900 min-h-24"
                                        rows="4"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                                    >
                                        {editingReviewId ? "Update Review" : "Submit Review"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReviewForm(false);
                                            setEditingReviewId(null);
                                            setReviewData({ rating: 5, comment: "" });
                                        }}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* User's Existing Review */}
                    {userReview && !showReviewForm && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-emerald-800">Your Review</span>
                                    {renderStars(userReview.rating, false, "w-3 h-3")}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditReview(userReview)}
                                        className="btn btn-xs btn-ghost text-emerald-600"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(userReview._id)}
                                        className="btn btn-xs btn-ghost text-red-500"
                                    >
                                        <FaTrash className="mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                            {userReview.comment && (
                                <p className="text-sm text-gray-700">{userReview.comment}</p>
                            )}
                        </div>
                    )}

                    {/* Reviews List */}
                    {reviewsLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-8">
                            <FaUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No reviews yet</p>
                            {isAuthenticated && (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="btn btn-sm btn-outline border-emerald-500 text-emerald-600 mt-3"
                                >
                                    Be the first to review
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                                {review.userId?.firstName?.[0] || "U"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {review.userId?.firstName} {review.userId?.lastName}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {renderStars(review.rating, false, "w-3 h-3")}
                                                    <span className="text-xs text-gray-500">
                                                        <FaCalendar className="inline mr-1" />
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Edit/Delete for own review */}
                                        {isAuthenticated && user && review.userId?._id === user._id && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleEditReview(review)}
                                                    className="btn btn-xs btn-ghost text-emerald-600"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="btn btn-xs btn-ghost text-red-500"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {review.comment && (
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {/* Pagination */}
                            {totalReviews > 10 && (
                                <div className="flex justify-center gap-2 pt-6">
                                    <button
                                        onClick={() => setReviewPage(Math.max(1, reviewPage - 1))}
                                        disabled={reviewPage === 1}
                                        className="btn btn-sm btn-ghost disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="btn btn-sm btn-ghost">
                                        Page {reviewPage}
                                    </span>
                                    <button
                                        onClick={() => setReviewPage(reviewPage + 1)}
                                        disabled={reviewPage * 10 >= totalReviews}
                                        className="btn btn-sm btn-ghost disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}