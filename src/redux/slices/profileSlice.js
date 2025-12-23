// src/slices/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchUsers } from "./userSlice";

const baseUrl = "http://localhost:3000/api";

// ✅ Profile Update Thunk
export const profileUpdate = createAsyncThunk(
  "profile/profileUpdate",
  async ({ userId, payload }, { rejectWithValue, dispatch }) => {
    console.log("userId",userId)
    try {
      const res = await axios.post(`${baseUrl}/profile/${userId}`, payload, {
        // headers: { "Content-Type": "multipart/form-data" },
        headers: { "Content-Type": "application/json" },
        // important!
      });
      // console पर response log
      // console.log("API Response:", res);

      // success toast
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message);
        dispatch(fetchUsers());
      }
      else{
        toast.error("User updation failed")
      }

      return res.data;
    } catch (error) {
      console.error("error",error)
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// delete profile
export const profileDelete = createAsyncThunk(
  "profile/profileDelete",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`${baseUrl}/profile/${userId}`);
      // console.log("API Response:", res);

      // success toast
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message);
        dispatch(fetchUsers());
      }
      else{
        toast.error("User updation failed")
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearProfile: (state) => {
      state.user = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(profileUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = true;
      })
      .addCase(profileUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // delete profile
      .addCase(profileDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(profileDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = true;
      })
      .addCase(profileDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
