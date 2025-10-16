// src/redux/slices/historySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 POST API to fetch booking history (for all or specific user)
export const fetchOrderHistory = createAsyncThunk(
  "history/fetchOrderHistory",
  async ({ userId }, { rejectWithValue }) => {
     console.log("🟡 [fetchOrderHistory] called with userId:", userId);
    try {
      const response = await axios.post("https://admin.roombookkro.com/api/orderHistory", {
        userId,
      });
      console.log("response history",response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch order history");
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    loading: false,
    historyData: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historyData = action.payload.data || null;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default historySlice.reducer;
