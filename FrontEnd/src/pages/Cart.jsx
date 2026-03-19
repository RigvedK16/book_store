import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft,
    FaCheck, FaSpinner, FaCreditCard
} from "react-icons/fa";
import { api } from "../utils/api";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";

export default function Cart() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { items, totalItems, totalPrice } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [checkingOut, setCheckingOut] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: { pathname: "/cart" } } });
        }
    }, [isAuthenticated, navigate]);

    const handleQuantityChange = (bookId, currentQty, stock, delta) => {
        const newQty = Math.max(1, Math.min(currentQty + delta, stock));
        dispatch(updateQuantity({ bookId, quantity: newQty }));
    };

    const handleRemove = (bookId) => {
        dispatch(removeFromCart(bookId));
        setMessage({ type: "success", text: "Item removed from cart" });
        setTimeout(() => setMessage({ type: "", text: "" }), 2000);
    };

    const handleCheckout = async () => {
        if (items.length === 0) return;

        // ADD THIS to debug
        console.log("Cart items:", JSON.stringify(items, null, 2));
        console.log("Token in storage:", localStorage.getItem("token"));

        setCheckingOut(true);
        setMessage({ type: "", text: "" });

        try {
            // Process each cart item as a separate booking
            // (Backend creates one booking per book - can be enhanced for bulk)
            for (const item of items) {
                await api(`/book/${item.bookId}`, {
                    method: "POST",
                    body: { quantity: item.quantity },
                });
            }

            // Success!
            setMessage({ type: "success", text: `Order placed successfully! 🎉` });
            dispatch(clearCart());

            // Redirect to home/orders after delay
            setTimeout(() => {
                navigate("/home");
            }, 2000);

        } catch (err) {
            console.error("Checkout error:", err);
            setMessage({
                type: "error",
                text: err.message || "Checkout failed. Please try again."
            });
        } finally {
            setCheckingOut(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen grid place-items-center pt-24">
                <div className="text-center">
                    <FaShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Please sign in to view your cart</p>
                    <Link to="/login" className="btn btn-primary bg-emerald-500 border-none">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/home" className="btn btn-ghost">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="text-gray-600">{totalItems} item{totalItems !== 1 ? 's' : ''} • ₹{totalPrice.toFixed(2)}</p>
                    </div>
                </div>

                {/* Status Message */}
                {message.text && (
                    <div className={`alert mb-6 ${message.type === "success"
                        ? "alert-success bg-green-50 text-green-800 border border-green-200"
                        : "alert-error bg-red-50 text-red-800 border border-red-200"
                        }`}>
                        {message.type === "success" ? <FaCheck /> : <FaTrash />}
                        <span>{message.text}</span>
                    </div>
                )}

                {items.length === 0 ? (
                    /* Empty Cart */
                    <div className="card bg-white shadow-xl rounded-2xl p-8 text-center">
                        <FaShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Looks like you haven't added any books yet</p>
                        <Link to="/home" className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    /* Cart Items + Summary */
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.bookId} className="card bg-white shadow-md rounded-xl overflow-hidden">
                                    <div className="card-body p-4 flex flex-col sm:flex-row gap-4">
                                        {/* Book Image */}
                                        <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                                            <img
                                                src={item.imageUrl || "https://via.placeholder.com/200x300"}
                                                alt={item.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Book Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.title}</h3>
                                                <p className="text-sm text-gray-600">by {item.author}</p>
                                                <p className="text-sm text-emerald-600 font-medium mt-1">₹{item.price}</p>

                                                {/* Stock Warning */}
                                                {item.quantity >= item.stock && item.stock > 0 && (
                                                    <p className="text-xs text-amber-600 mt-1">
                                                        ⚠️ Maximum available stock reached
                                                    </p>
                                                )}
                                            </div>

                                            {/* Quantity Controls + Remove */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.bookId, item.quantity, item.stock, -1)}
                                                        className="btn btn-sm btn-outline border-gray-300 w-8 h-8 p-0"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <FaMinus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.bookId, item.quantity, item.stock, 1)}
                                                        className="btn btn-sm btn-outline border-gray-300 w-8 h-8 p-0"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        <FaPlus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemove(item.bookId)}
                                                    className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
                                                    title="Remove item"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                                            <span className="font-bold text-lg text-emerald-600">
                                                ₹{item.subtotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Clear Cart Button */}
                            <button
                                onClick={() => {
                                    if (window.confirm("Remove all items from cart?")) {
                                        dispatch(clearCart());
                                    }
                                }}
                                className="btn btn-ghost text-red-500 hover:bg-red-50"
                            >
                                <FaTrash className="mr-2" />
                                Clear Cart
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card bg-white shadow-xl rounded-2xl sticky top-24">
                                <div className="card-body p-6">
                                    <h3 className="font-bold text-xl text-gray-900 mb-4">Order Summary</h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal ({totalItems} items)</span>
                                            <span>₹{totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span className="text-emerald-600">Free</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax</span>
                                            <span>₹{(totalPrice * 0.12).toFixed(2)}</span>
                                        </div>
                                        <hr className="border-gray-200" />
                                        <div className="flex justify-between font-bold text-lg text-gray-900">
                                            <span>Total</span>
                                            <span className="text-emerald-600">₹{(totalPrice * 1.12).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={checkingOut || items.length === 0}
                                        className="btn bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white font-medium py-3 w-full hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {checkingOut ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <FaCreditCard className="mr-2" />
                                                Checkout • ₹{(totalPrice * 1.12).toFixed(2)}
                                            </>
                                        )}
                                    </button>

                                    {/* Trust Badges */}
                                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">🔒 Secure</span>
                                        <span className="flex items-center gap-1">🚚 Free Shipping</span>
                                        <span className="flex items-center gap-1">↩️ Easy Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}