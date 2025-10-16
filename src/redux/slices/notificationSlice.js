import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = "https://admin.roombookkro.com/api";

// ✅ Get notifications (all or specific user)
export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async ({ userId }, { rejectWithValue }) => {
    try {
    //   console.log("🔍 Fetching notifications for user_id:", userId);

      const res = await axios.post(`${baseUrl}/notification`, { userId });
    //   console.log("📦 API Response:", res);

      const isSuccess =
        res?.status === 200 &&
        (res.data?.status === true ||
          res.data?.status === 200 ||
          res.data?.status === "200");

      if (isSuccess && Array.isArray(res.data?.data)) {
        return res.data.data;
      } else {
        const msg = res?.data?.message || "Failed to fetch notifications";
        toast.error(msg);
        return rejectWithValue(msg);
      }
    } catch (error) {
    //   console.error("❌ getNotifications error:", error);
      toast.error("Error fetching notifications");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Send notification
export const sendNotification = createAsyncThunk(
  "notification/sendNotification",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
    //   console.log("🚀 Sending notification:", payload);
      const res = await axios.post(`${baseUrl}/sendnotification`, payload);
    //   console.log("📨 Send Response:", res);

      const isSuccess =
        res?.status === 201 ||
        res?.data?.status === 200 ||
        res?.data?.status === "200" ||
        res?.data?.status === true;

      if (isSuccess) {
        toast.success(res?.data?.message || "Notification sent successfully!");
        // 🔁 Refresh notifications for the same user
        dispatch(getNotifications({ user_id: payload.userId }));
        return res.data;
      } else {
        const msg = res?.data?.message || "Failed to send notification";
        toast.error(msg);
        return rejectWithValue(msg);
      }
    } catch (error) {
    //   console.error("❌ sendNotification error:", error);
      toast.error("Error sending notification");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get notifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload || [];
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send notification
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
