import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://admin.roombookkro.com/api";

// Async thunk to fetch property
export const fetchProperty = createAsyncThunk(
  "property/fetchProperty",
  async (userId = null) => {
    const res = await axios.get(`${baseUrl}/getproperty?userId=${userId}`);
    return res.data;
  }
);

const propertySlice = createSlice({
  name: "property",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.property || [];
      })
      .addCase(fetchProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default propertySlice.reducer;
