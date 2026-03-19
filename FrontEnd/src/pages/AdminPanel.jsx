import { useState } from "react";
import { api } from "../utils/api";
import { FaUpload, FaImage, FaBook, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

export default function AdminPanel() {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        price: "",
        category: "fiction",
        stock: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const categories = [
        "fiction", "non-fiction", "education", "technology", "self-help", "biography", "others"
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "Please select a valid image file" });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: "error", text: "Image size should be less than 5MB" });
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        setMessage({ type: "", text: "" });
    };

    const uploadImage = async () => {
        if (!imageFile) return null;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const response = await api("/upload", {
                method: "POST",
                body: formData,
                headers: {}, // Don't set Content-Type, let browser set it with boundary
            });

            return response.imageUrl;
        } catch (err) {
            throw new Error(`Image upload failed: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const createBook = async (imageUrl) => {
        const bookData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            imageUrl,
        };

        const response = await api("/book", {
            method: "POST",
            body: bookData,
        });

        return response.book;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setSubmitting(true);

        try {
            // Validate form
            if (!formData.title || !formData.author || !formData.price || !formData.stock) {
                throw new Error("Please fill in all required fields");
            }

            // Upload image first
            const imageUrl = await uploadImage();
            if (!imageUrl) {
                throw new Error("Please select an image for the book");
            }

            // Create book entry
            await createBook(imageUrl);

            // Success
            setMessage({ type: "success", text: "Book added successfully! 🎉" });

            // Reset form
            setFormData({
                title: "", author: "", description: "", price: "", category: "fiction", stock: ""
            });
            setImageFile(null);
            setImagePreview(null);

        } catch (err) {
            setMessage({ type: "error", text: err.message || "Failed to add book" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-gray-600 mt-1">Add new books to your bookstore catalog</p>
                </div>

                {/* Status Message */}
                {message.text && (
                    <div className={`alert mb-6 ${message.type === "success"
                        ? "alert-success bg-green-50 text-green-800 border border-green-200"
                        : "alert-error bg-red-50 text-red-800 border border-red-200"
                        }`}>
                        {message.type === "success" ? <FaCheck /> : <FaTimes />}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Form Card */}
                <div className="card bg-white shadow-xl rounded-2xl">
                    <div className="card-body p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Image Upload Section */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Book Cover Image *</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-h-64 mx-auto rounded-lg shadow-md object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 btn btn-xs btn-error btn-circle"
                                            >
                                                <FaTimes className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                    <FaImage className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-700">Click to upload image</p>
                                                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                {uploading && (
                                    <div className="flex items-center gap-2 mt-3 text-emerald-600">
                                        <FaSpinner className="animate-spin" />
                                        <span className="text-sm">Uploading image...</span>
                                    </div>
                                )}
                            </div>

                            {/* Title & Author */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium text-gray-700">Book Title *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter book title"
                                        className="input input-bordered bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium text-gray-700">Author *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        placeholder="Enter author name"
                                        className="input input-bordered bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Description</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of the book..."
                                    className="textarea textarea-bordered bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 min-h-24"
                                    rows="3"
                                />
                            </div>

                            {/* Price & Stock */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium text-gray-700">Price ($) *</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="29.99"
                                        min="0"
                                        step="0.01"
                                        className="input input-bordered bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium text-gray-700">Stock Quantity *</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="50"
                                        min="0"
                                        className="input input-bordered bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Category *</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="select select-bordered bg-white text-gray-900 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting || uploading || !imageFile}
                                className="btn bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white font-medium py-3 w-full hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {submitting ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Adding Book...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload className="mr-2" />
                                        Add Book to Store
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Helper Tips */}
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                        <FaBook className="w-4 h-4" />
                        Tips for Adding Books
                    </h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                        <li>• Use high-quality cover images (recommended: 600x900px)</li>
                        <li>• Write clear, compelling descriptions to attract readers</li>
                        <li>• Set accurate stock levels to avoid overselling</li>
                        <li>• Choose the most relevant category for better discoverability</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}