

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "https://admin.roombookkro.com/api";
// ---------------
// ✅ Thunks
// ---------------

// POST /addbanner
// export const addBanner = createAsyncThunk(
//   "images/addBanner",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(`${API_URL}/addbanner`, payload);
//       console.log("resadd banenr :",res)
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

export const addBanner = createAsyncThunk(
  "images/addBanner",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/addbanner`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ res add banner:", res);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addOnboardPage = createAsyncThunk(
  "images/addOnboardPage",
  async (payload, { rejectWithValue }) => {
    try {
      // Payload expected as { title, description, imageUrl (base64 string) }
      const res = await axios.post(`${API_URL}/addonboardpage`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ addOnboardPage response:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error adding onboard page:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// GET /getbanner
export const getBanners = createAsyncThunk(
  "images/getBanners",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/getbanner`);
        //  console.log("res get  banenr :",res)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// GET /banners/title/home
export const getHomeBanners = createAsyncThunk(
  "images/getHomeBanners",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/banners/title/home`);
      // console.log("res home page  banenr :", res);
      // ✅ Return the inner array only
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// GET /getonboardpage
export const getOnboardPages = createAsyncThunk(
  "images/getOnboardPages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/getonboardpage`);
        //  console.log("res get on  board page  :",res)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ deleteBannerImage thunk (safe version)
export const deleteBannerImage = createAsyncThunk(
  "images/deleteBannerImage",
  async (titleId, { rejectWithValue }) => {
    try {
      // Try DELETE first
      const res = await axios
        .delete(`${API_URL}/banner/${titleId}/image/null`)
        .catch(async (err) => {
          // If DELETE not supported, fallback to POST
          console.warn("DELETE failed, trying POST...");
          return await axios.post(`${API_URL}/banner/${titleId}/image/null`);
        });

      console.log("✅ Banner deleted:", res.data);
      
      return res.data;
    } catch (err) {
      console.error("❌ Error deleting banner:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ---------------
// ✅ Slice
// ---------------
const addImageSlice = createSlice({
  name: "images",
  initialState: {
    banners: [],
    onboardPages: [],
     homeBanners: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Add Banner ---
      // .addCase(addBanner.pending, (state) => {
      //   state.loading = true;
      //   state.success = false;
      // })
      // .addCase(addBanner.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.success = true;
      //   state.banners.push(action.payload);
      // })
      // .addCase(addBanner.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })
      .addCase(addBanner.pending, (state) => {
  state.loading = true;
})
.addCase(addBanner.fulfilled, (state, action) => {
  state.loading = false;
  state.success = true;
  state.error = null;
  // Optionally push new banners to UI directly:
  state.banners = [...state.banners, action.payload];
})
.addCase(addBanner.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


      // --- Add Onboard Page ---
      .addCase(addOnboardPage.pending, (state) => {
        state.loading = true;
      })
   .addCase(addOnboardPage.fulfilled, (state, action) => {
  state.loading = false;
  if (!Array.isArray(state.onboardPages)) {
    state.onboardPages = [];
  }
  if (action.payload?.status === 200) {
    // console.log("✅ Onboard page added successfully");
  } else {
    state.onboardPages.push(action.payload);
  }
})

      .addCase(addOnboardPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Get Banners ---
      .addCase(getBanners.pending, (state) => {
        state.loading = true;
      })
        .addCase(getBanners.fulfilled, (state, action) => {
  state.loading = false;
  // ✅ Handle nested structure safely
  if (Array.isArray(action.payload?.data)) {
    state.banners = action.payload.data;
  } else {
    state.banners = [];
  }
})
      .addCase(getBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Get Home Banners ---
      .addCase(getHomeBanners.pending, (state) => {
        state.loading = true;
      })
    .addCase(getHomeBanners.fulfilled, (state, action) => {
  state.loading = false;
  state.homeBanners = action.payload || [];
})

//       .addCase(getHomeBanners.fulfilled, (state, action) => {
//   state.loading = false;
//   state.homeBanners = action.payload?.data || [];
// })

      .addCase(getHomeBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Get Onboard Pages ---
      .addCase(getOnboardPages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOnboardPages.fulfilled, (state, action) => {
        state.loading = false;
        state.onboardPages = action.payload;
      })
      .addCase(getOnboardPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Delete Banner Image ---
      .addCase(deleteBannerImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBannerImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Optional: Remove deleted banner from local state
        state.banners = state.banners.filter(
          (b) => b.id !== action.meta.arg
        );
      })
      .addCase(deleteBannerImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatus } = addImageSlice.actions;
export default addImageSlice.reducer;
