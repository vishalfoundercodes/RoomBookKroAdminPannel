import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import  Home  from "./pages/home/Home";
import Notifications from "./pages/Notifications/Notifications";
import UsersPage from "./pages/User/Users";
import Analytics from "./pages/analytics/analytics";
import PropertyPage from "./pages/Property/Property";
import Settings from "./pages/Settings/Settings";
import Reports from "./pages/Reports/Reports";
import Subscription from "./pages/Subscription/Subscription";
import CouponManagement from "./pages/coupons/Coupen";
import Login from "./pages/home/Login";
import History from "./pages/History/History";
import ProtectedRoute from "./pages/home/ProtectedRoute";
import AddImagePage from "./pages/AddImagePage/AddImagePage";
import Revenue from "./pages/Revenue/Revenue";
import VendorPage from "./pages/User/Vendor";

export const Router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, // ✅ Protected Wrapper
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/notification", element: <Notifications /> },
          { path: "/notification/:id", element: <Notifications /> },
          { path: "/users", element: <UsersPage /> },
          { path: "/vendor", element: <VendorPage /> },
          { path: "/property", element: <PropertyPage /> },
          { path: "/analytics", element: <Analytics /> },
          { path: "/settings", element: <Settings /> },
          { path: "/reports", element: <Reports /> },
          { path: "/subscription", element: <Subscription /> },
          { path: "/coupon", element: <CouponManagement /> },
          { path: "/history", element: <History /> },
          { path: "/addimagepage", element: <AddImagePage /> },
          { path: "/revenue", element: <Revenue /> },
        ],
      },
    ],
  },
]);