// src/redux/slices/historySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// 🔹 Fetch booking/order history
export const fetchOrderHistory = createAsyncThunk(
  "history/fetchOrderHistory",
  async ({ userId }, { rejectWithValue }) => {
    console.log("🟡 [fetchOrderHistory] called with userId:", userId);
    try {
      const response = await axios.post(
        "https://admin.roombookkro.com/api/orderHistory",
        { userId }
      );
      console.log("response history", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch order history"
      );
    }
  }
);

// 🔹 Update payment status (Accept / Reject)
export const updatePaymentStatus = createAsyncThunk(
  "history/updatePaymentStatus",
  async ({ orderId, userId, newPaymentStatus }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://admin.roombookkro.com/api/manageTransaction",
        {
          orderId,
          userId,
          newPaymentStatus, // 0 = Pending, 1 = Accepted, 2 = Rejected
        }
      );
      toast.success("✅ Payment status updated successfully!");
      return { orderId, newPaymentStatus, ...res.data };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to update payment status"
      );
      return rejectWithValue(error.response?.data);
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    loading: false,
    historyData: null,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Order History
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
      })

      // 🔹 Update Payment Status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // ✅ Update the paymentStatus locally in historyData
        if (state.historyData && Array.isArray(state.historyData)) {
          state.historyData = state.historyData.map((order) =>
            order.orderId === action.payload.orderId
              ? { ...order, paymentStatus: action.payload.newPaymentStatus }
              : order
          );
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update payment status";
      });
  },
});

export default historySlice.reducer;
