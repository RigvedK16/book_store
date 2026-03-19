import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCart = () => {
    try {
        const serialized = localStorage.getItem("bookstore_cart");
        return serialized ? JSON.parse(serialized) : [];
    } catch {
        return [];
    }
};

// Save cart to localStorage
const saveCart = (cart) => {
    try {
        localStorage.setItem("bookstore_cart", JSON.stringify(cart));
    } catch (err) {
        console.error("Failed to save cart:", err);
    }
};

const initialState = {
    items: loadCart(),
    totalItems: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { book, quantity = 1 } = action.payload;
            const existing = state.items.find((item) => item.bookId === book._id);

            if (existing) {
                existing.quantity += quantity;
                existing.subtotal = existing.quantity * book.price;
            } else {
                state.items.push({
                    bookId: book._id,
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    imageUrl: book.imageUrl,
                    quantity,
                    subtotal: quantity * book.price,
                    stock: book.stock,
                });
            }

            // Update totals
            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalPrice = state.items.reduce((sum, item) => sum + item.subtotal, 0);

            saveCart(state.items);
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter((item) => item.bookId !== action.payload);
            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalPrice = state.items.reduce((sum, item) => sum + item.subtotal, 0);
            saveCart(state.items);
        },

        updateQuantity: (state, action) => {
            const { bookId, quantity } = action.payload;
            const item = state.items.find((item) => item.bookId === bookId);

            if (item) {
                item.quantity = Math.max(1, Math.min(quantity, item.stock));
                item.subtotal = item.quantity * item.price;
            }

            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalPrice = state.items.reduce((sum, item) => sum + item.subtotal, 0);
            saveCart(state.items);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
            localStorage.removeItem("bookstore_cart");
        },

        // Sync cart from localStorage (on app load)
        syncCart: (state) => {
            const items = loadCart();
            state.items = items;
            state.totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, syncCart } = cartSlice.actions;
export default cartSlice.reducer;