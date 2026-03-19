// // filepath: FrontEnd/src/redux/authSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// // Initial state for auth
// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
// };

// // Create auth slice with actions
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // Set loading state
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },
//     // Set user after successful login
//     setUser: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//       state.loading = false;
//       state.error = null;
//     },
//     // Clear user on logout
//     clearUser: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//       state.loading = false;
//       state.error = null;
//     },
//     // Set error message
//     setError: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//     },
//   },
// });

// export const { setLoading, setUser, clearUser, setError } = authSlice.actions;
// export default authSlice.reducer;

// filepath: FrontEnd/src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Load user from localStorage on app start
const loadUserFromStorage = () => {
  try {
    const serialized = localStorage.getItem("bookstore_user");
    return serialized ? JSON.parse(serialized) : null;
  } catch {
    return null;
  }
};

// ✅ Save user to localStorage
const saveUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem("bookstore_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("bookstore_user");
    }
  } catch (err) {
    console.error("Failed to save user to localStorage:", err);
  }
};

const storedUser = loadUserFromStorage();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      saveUserToStorage(action.payload); // ✅ Persist to localStorage
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      saveUserToStorage(null); // ✅ Clear from localStorage
      localStorage.removeItem("token");
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setUser, clearUser, setError } = authSlice.actions;
export default authSlice.reducer;