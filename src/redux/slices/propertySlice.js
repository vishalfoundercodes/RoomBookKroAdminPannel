import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = "https://root.roombookkro.com/api";

// Create axios instance with default timeout
const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 180000, // 2 minutes timeout for file uploads
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Async thunk to fetch property
export const fetchProperty = createAsyncThunk(
  "property/fetchProperty",
  async (userId = null) => {
    const res = await axios.post(`${baseUrl}/getproperty?userId=${userId}`);
    console.log("API proo response:", res.data); 
    return res.data;
  }
);
// Async thunk to fetch property vendor wise
export const fetchVendorProperty = createAsyncThunk(
  "property/fetchProperty",
  async ({userId}) => {
    const res = await axios.get(
      `${baseUrl}/getvendorproperty?userId=${userId}`
    );
    console.log("API vendor response:", res.data); 
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
      console.log("🚀 Starting property upload...");

      // Log FormData contents for debugging
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File -> ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const res = await axiosInstance.post("/addproperty", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Add upload progress tracking
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
        // Increase timeout for this specific request if needed
        timeout: 180000, // 3 minutes
      });

      console.log("✅ Property added successfully:", res.data);

      if (res.status === 201 || res.status === 200) {
        toast.success(res.data?.message || "Property added successfully!");
      }

      return res.data;
    } catch (err) {
      console.error("❌ Add Property Error:", err);

      // Handle different error types
      if (err.code === "ECONNABORTED") {
        toast.error(
          "Request timeout! Please check your internet connection and try again."
        );
        return rejectWithValue("Request timeout - please try again");
      }

      if (err.response) {
        // Server responded with error
        console.error("Server Error Response:", err.response.data);
        toast.error(err.response.data?.message || "Failed to add property!");
        return rejectWithValue(err.response.data);
      } else if (err.request) {
        // Request made but no response
        console.error("No response received:", err.request);
        toast.error("No response from server. Please check your connection.");
        return rejectWithValue("No response from server");
      } else {
        // Error setting up request
        console.error("Error setting up request:", err.message);
        toast.error("Failed to send request!");
        return rejectWithValue(err.message);
      }
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

      const res = await axiosInstance.put(
        `${baseUrl}/property/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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

// export const editPropertyFormData = createAsyncThunk(
//   "property/editProperty",
//   async ({ id, payload }, { rejectWithValue }) => {
//     try {
//       console.log("📝 Edit Payload 2:", payload);
//       console.log("📝 Edit id:", id);
//       if(!payload || !(payload instanceof FormData)){
//         throw new Error("Payload must be a FormData instance");
//       }
//       const res = await axios.patch(`${baseUrl}/propertyEdit/${id}`, payload, {
//         headers: { "Content-Type": "application/json" },
//       });
//       console.log("✅ Edit Property Response:", res.data);

//       toast.success("Property updated successfully!");
//       return res.data;
//     } catch (err) {
//       console.error("❌ Edit Property Error:", err);
//       toast.error(err.response.data.message||"Failed to update property!");
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );


// In your propertySlice.js
export const editPropertyFormData = createAsyncThunk(
  "property/editPropertyFormData",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/updateproperty/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("edit data:",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
/* =====================================================
   ✅ DELETE PROPERTY
===================================================== */
export const deleteProperty = createAsyncThunk(
  "property/deleteProperty",
  async (residencyId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${baseUrl}/deleteproperty/${residencyId}`);
      console.log("🗑️ Delete Property Response:", res.data);

      // toast.success("Property deleted successfully!");
      return residencyId; // Return deleted ID to update local state
    } catch (err) {
      console.error("❌ Delete Property Error:", err);
      toast.error("Failed to delete property!");
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
    successMessage: null,
    uploadProgress: 0,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
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
        state.uploadProgress = 0;
      })
      .addCase(addProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Property added successfully!";
        state.uploadProgress = 100;
        // Optionally push new property into existing data
        if (action.payload?.property) {
          state.data.push(action.payload.property);
        } else if (action.payload?.data) {
          state.data.push(action.payload.data);
        }
      })
      .addCase(addProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add property.";
        state.uploadProgress = 0;
      })

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
      })

      /* === DELETE === */
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Property deleted successfully!";
        state.data = state.data.filter(
          (prop) => prop.residencyId !== action.payload
        );
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete property.";
      });
  },
});

// export default propertySlice.reducer;
export const { clearMessages, setUploadProgress } = propertySlice.actions;
export default propertySlice.reducer;
