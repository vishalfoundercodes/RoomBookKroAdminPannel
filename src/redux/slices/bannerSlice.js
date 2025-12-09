import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://root.roombookkro.com/api";

// Async thunk to fetch banner
export const fetchBanner = createAsyncThunk("banner/fetchBanner", async () => {
  const res = await axios.get(`${baseUrl}/getbanner`);
  return res.data;
});

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.banner || [];
      })
      .addCase(fetchBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bannerSlice.reducer;
