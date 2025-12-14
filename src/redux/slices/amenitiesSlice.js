// src/redux/slices/amenitities.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = "https://root.roombookkro.com/api";
// 🔹 Fetch booking/order history
export const fetchPropertitesAmenities = createAsyncThunk(
  "history/fetchPropertitesAmenities",
  async (_, { rejectWithValue }) => {
    console.log("🟡 [fetchOrderHistory] called with userId:", userId);
    try {
      const response = await axios.get(`${baseUrl}/get-amenities/property`);
      console.log("Property Amenities updated", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch order history"
      );
    }
  }
);

export const fetchRoomAmenities = createAsyncThunk(
  "history/fetchRoomAmenities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/get-amenities/room`);
      console.log("response facility", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch order history"
      );
    }
  }
);

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState: {
    loading: false,
    propertyAmenities: [], // 👈 historyData → propertyAmenities
    roomAmenities: [], // 👈 new
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Property Amenities
      .addCase(fetchPropertitesAmenities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertitesAmenities.fulfilled, (state, action) => {
        state.loading = false;
        state.propertyAmenities = action.payload?.data || [];
      })
      .addCase(fetchPropertitesAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Room Amenities
      .addCase(fetchRoomAmenities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomAmenities.fulfilled, (state, action) => {
        state.loading = false;
        state.roomAmenities = action.payload?.data || [];
      })
      .addCase(fetchRoomAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default amenitiesSlice.reducer;
