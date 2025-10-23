import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = "https://admin.roombookkro.com/api";

// Async thunk to fetch property
export const fetchProperty = createAsyncThunk(
  "property/fetchProperty",
  async (userId = null) => {
    const res = await axios.post(`${baseUrl}/getproperty?userId=${userId}`);
    console.log("API proo response:", res.data); 
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
        console.log("add property :", res); 
        if(res.status === 201){
          toast.success(res?.message);
        }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =====================================================
   ✅ EDIT PROPERTY
===================================================== */
export const editProperty = createAsyncThunk(
  "property/editProperty",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      console.log("📝 Edit Payload:", payload);

      const res = await axios.post(`${baseUrl}/property/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ Edit Property Response:", res.data);

      toast.success("Property updated successfully!");
      return res.data;
    } catch (err) {
      console.error("❌ Edit Property Error:", err);
      toast.error("Failed to update property!");
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
      })
      // edit property 
//       // --- Edit Property ---
// .addCase(editProperty.pending, (state) => {
//   state.loading = true;
// })
// .addCase(editProperty.fulfilled, (state, action) => {
//   state.loading = false;
//   state.success = true;
//   // Optional: update in local state if you have properties stored
//   const updated = action.payload;
//   state.banners = state.banners.map((b) =>
//     b.id === updated.id ? updated : b
//   );
// })
// .addCase(editProperty.rejected, (state, action) => {
//   state.loading = false;
//   state.error = action.payload;
// });
      /* === EDIT PROPERTY === */
      .addCase(editProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Property updated successfully!";

        // ✅ Optional: update in local state
        const updated = action.payload;
        state.data = state.data.map((prop) =>
          prop.id === updated.id ? updated : prop
        );
      })
      .addCase(editProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update property.";
      });
  },
});

export default propertySlice.reducer;
