import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import propertyReducer from "./slices/propertySlice";
import bannerReducer from "./slices/bannerSlice";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import couponReducer from "./slices/couponSlice";
import notificationReducer from "./slices/notificationSlice";
import historyReducer from "./slices/historySlice";
import addImageReducer from "./slices/addImageSlice";
import  revenueReducer   from "./slices/revenueSlice";
import amenitiesReducer from "./slices/amenitiesSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    property: propertyReducer,
    banner: bannerReducer,
    auth: authReducer,
    profile: profileReducer,
    coupon: couponReducer,
    notification: notificationReducer,
    history: historyReducer,
    images: addImageReducer,
    revenue: revenueReducer,
    amenities: amenitiesReducer,
  },
});

export default store;
