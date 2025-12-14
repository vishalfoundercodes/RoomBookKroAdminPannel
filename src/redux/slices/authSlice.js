import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchUsers } from "./userSlice";
import { toast } from "react-toastify";

const baseUrl = "https://root.roombookkro.com/api";

// Signup Thunk
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(`${baseUrl}/authentication`, payload);
      if (res?.data?.status === 200) {
        toast.success("User added successfully");
        // dispatch(fetchUsers());
      } else {
        console.error("User creation failed:", res);
        toast.error("User not created");
      }
      return res?.data;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Login Thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("payload:",payload)
      const res = await axios.post(`${baseUrl}/authentication`, payload);
      console.log("resss data ", res.data);
      return res?.data; // { user, loginToken, message }
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ✅ Check Profile / Token validation
export const checkProfile = createAsyncThunk(
  "auth/checkProfile",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const userId = JSON.parse(localStorage.getItem("user"))?.userId;
      if (!userId) throw new Error("No user info found");

      const res = await axios.get(`${baseUrl}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
//  console.log("res profile",res);
      return res.data; // valid profile data
    } catch (error) {
      // If token is invalid, logout
      dispatch(logout());
      return rejectWithValue(error.response?.data || { message: "Session expired" });
    }
  }
);

const authenticationSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out Successful");
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.loginToken;
        localStorage.setItem("token", action.payload.loginToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Check Profile / Token validation
      .addCase(checkProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || state.user;
      })
      .addCase(checkProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Session expired";
      });
  },
});

export const { logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
