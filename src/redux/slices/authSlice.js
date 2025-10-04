// src/slices/authenticationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchUsers } from "./userSlice";
import { toast } from "react-toastify";

const baseUrl = "https://admin.roombookkro.com/api";

// ✅ Signup Thunk
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue , dispatch}) => {
    try {
      const res = await axios.post(`${baseUrl}/authentication`, payload);
      // console.log(res?.data?.status);
      if (res?.data?.status===200){
        toast.success("User added successfully")
        dispatch(fetchUsers());
      } else{
        toast.error("User not creating")
      }
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Login Thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseUrl}/authentication`, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authenticationSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // signup cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // server se aaya user data
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
