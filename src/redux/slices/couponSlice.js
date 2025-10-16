// src/slices/couponSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
// import { fetchCoupons } from "./couponListSlice"; // optional: if you have a list fetch slice

const baseUrl = "https://admin.roombookkro.com/api";

// ✅ Create Coupon Thunk
export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(`${baseUrl}/create`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("API Response:", res);

    //   if (res?.data?.status === 200 ) {
      if (res?.data?.status === true ) {
        toast.success(res?.data?.message || "Coupon created successfully!");
        // optional: refresh list
        // if (dispatch && fetchCoupons) dispatch(fetchCoupons());
      } else {
        toast.error(res?.data?.message || "Coupon creation failed");
      }

      return res.data;
    } catch (error) {
      toast.error("Error creating coupon");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getAllCoupons = createAsyncThunk(
  "coupon/getAllCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseUrl}/getAllCoupon`);

      if (res?.data?.cupponCode) {
        return res.data.cupponCode;
      } else {
        toast.error("No coupons found!");
        return [];
      }
    } catch (error) {
      toast.error("Error fetching coupons");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupon: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCoupon: (state) => {
      state.coupon = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload?.coupon || null;
        state.success = true;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
        // ✅ get all coupons
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload || [];
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;
