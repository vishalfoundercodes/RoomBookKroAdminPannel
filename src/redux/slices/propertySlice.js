import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://admin.roombookkro.com/api";

// Async thunk to fetch property
export const fetchProperty = createAsyncThunk(
  "property/fetchProperty",
  async (userId = null) => {
    const res = await axios.post(`${baseUrl}/getproperty?userId=${userId}`);
    // console.log("API proo response:", res.data); 
    return res.data;
  }
);

/* =====================================================
   ✅ ADD PROPERTY
===================================================== */
export const addProperty = createAsyncThunk(
  "property/addProperty",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseUrl}/addproperty`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
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
        state.data = action.payload?.property || action.payload?.data || [];
      })
      .addCase(fetchProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

          /* === ADD PROPERTY === */
      .addCase(addProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Property added successfully!";
        // Optionally push new property into existing data
        if (action.payload?.property) {
          state.data.push(action.payload.property);
        }
      })
      .addCase(addProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add property.";
      });
  },
});

export default propertySlice.reducer;
