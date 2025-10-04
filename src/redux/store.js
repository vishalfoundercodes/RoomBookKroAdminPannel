import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import propertyReducer from "./slices/propertySlice";
import bannerReducer from "./slices/bannerSlice";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    property: propertyReducer,
    banner: bannerReducer,
    auth: authReducer,
    profile:profileReducer
  },
});

export default store;
