import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart, FaSearch, FaFilter } from "react-icons/fa";
import { api } from "../utils/api";

export default function Books() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

    const categories = ["fiction", "non-fiction", "education", "technology", "self-help", "biography", "others"];

    useEffect(() => {
        fetchBooks();
    }, [selectedCategory]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            let url = "/books";
            if (selectedCategory) {
                // Filter client-side or add category filter to backend
            }
            const data = await api(url);
            setBooks(data.books || []);
        } catch (err) {
            console.error("Error fetching books:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchBooks();
            return;
        }
        try {
            const data = await api(`/books/search?query=${searchQuery}`);
            setBooks(data.books || []);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSearchParams(category ? { category } : {});
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Browse Books</h1>
                    <p className="text-gray-600">Discover your next favorite read from our collection</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input input-bordered flex-1"
                            />
                            <button type="submit" className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                                <FaSearch />
                            </button>
                        </form>
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-500" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryClick(e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="card bg-white shadow-md animate-pulse">
                                <div className="h-64 bg-gray-200 rounded-t-xl"></div>
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
                ) : books.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No books found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div key={book._id} className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <figure className="relative overflow-hidden">
                                    <img
                                        src={book.imageUrl || "https://via.placeholder.com/400x600"}
                                        alt={book.title}
                                        className="w-full h-64 object-cover"
                                    />
                                    {book.stock < 10 && book.stock > 0 && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                            Low Stock
                                        </div>
                                    )}
                                    {book.stock === 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">Out of Stock</span>
                                        </div>
                                    )}
                                </figure>
                                <div className="card-body p-4">
                                    <div className="text-xs text-emerald-600 font-medium mb-1 capitalize">{book.category}</div>
                                    <h3 className="card-title text-lg font-bold mb-1 line-clamp-1">{book.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                                    <div className="flex items-center gap-1 mb-3">
                                        <FaStar className="text-yellow-500" />
                                        <span className="text-sm font-medium">{book.rating || "New"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-emerald-600">${book.price}</span>
                                        <Link
                                            to={`/book/${book._id}`}
                                            className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                                        >
                                            <FaShoppingCart className="mr-1" />
                                            {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}