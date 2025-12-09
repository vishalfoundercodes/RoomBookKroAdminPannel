
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://root.roombookkro.com/api";

export const fetchRevenue = createAsyncThunk(
  "revenue/fetchRevenue",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${baseUrl}/getRevenue`
      );
      console.log("revenue:", res?.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch revenue data"
      );
    }
  }
);
export const fetchVendorRevenue = createAsyncThunk(
  "revenue/fetchRevenue",
  async ({userId}, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${baseUrl}/getvendorRevenue?vendorId=${userId}`
      );
      console.log("revenue:", res?.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch revenue data"
      );
    }
  }
);


const revenueSlice = createSlice({
  name: "revenue",
  initialState: {
    loading: false,
    revenueData: null,     // full API data
    revenueList: [],       // only list
    totalCommission: 0,
    revenueCount: 0,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueData = action.payload;
        state.revenueList = action.payload.revenueList || [];
        state.totalCommission = action.payload.totalCommission || 0;
        state.revenueCount = action.payload.revenueCount || 0;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default revenueSlice.reducer;


