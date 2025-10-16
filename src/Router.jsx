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
// import SingleProductPage from "./reusable_components/SingleProductPage";
// import PrivacyPolicy from "./pages/privacy/privacy";
// import Wishlist from "./pages/Wishlist/Wishlist";
// import MyAccount from "./pages/auth/MyAccount";
// import ProtectedRoutes from "./pages/auth/ProtectedRoutes";
// import GuestRoute from "./pages/auth/GuestRoute";
// import Profile from "./components/Profile";
// import Orders from "./pages/orders/Order";
// import Cart from "./pages/cart/Cart";
// import CheckoutPage from "./pages/checkout/Checkout";
// import Category from "./pages/category/Category";
// import ComingSoon from "./reusable_components/ComingSoon";
// import AddBilling from "./pages/test/BillingForm";
// import AddressSection from "./pages/checkout/AddressSection";



export const Router = createBrowserRouter([
   {
          path: "/login",
          element: <Login />
      },
  {
    path: "/",
    element: <Layout />,
    
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/property",
        element: <PropertyPage />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/subscription",
        element: <Subscription />,
      },
      {
        path: "/coupon",
        element: <CouponManagement />,
      },
      {
        path: "/history",
        element: <History />,
      },

     
      //   {
      //     path: "/wishlist",
      //     element:<ProtectedRoutes> <Wishlist /></ProtectedRoutes>
      // },
      //  {
      //     path: "/register",
      //     element:<GuestRoute><MyAccount /></GuestRoute>
      // },
      // {
      //     path: "/profile",
      //     element:<ProtectedRoutes> <Profile /></ProtectedRoutes>
      // },
      //  {
      //     path: "/orders",
      //     element:<ProtectedRoutes><Orders /> </ProtectedRoutes>
      // },
      // {
      //     path: "/cart",
      //     element:<ProtectedRoutes><Cart /> </ProtectedRoutes>
      // },
      // {
      //     path: "/checkout",
      //     element: <ProtectedRoutes><CheckoutPage /></ProtectedRoutes>
      // },
      //  {
      //     path: "/allproduct",
      //     element: <Category />
      // },
      //  {
      //     path: "/allproduct",
      //     element: <Category />
      // },
      // {
      //     path: "/therapists/:title",
      //     element: <SelectedTherapists />
      // },
      // {
      //     path: "/notifications",
      //     element: <ComingSoon />
      // },
      // {
      //     path: "/contact",
      //     element: <ComingSoon />
      // },
      // {
      //     path: "/help",
      //     element: <ComingSoon />
      // },
      // {
      //     path: "/aboutus",
      //     element: <ComingSoon />
      // },
      // {
      //     path: "/terms",
      //     element: <ComingSoon />
      // },
      // {
      //     path: "/check",
      //     element: <AddBilling />
      // },
      // {
      //     path: "/check2",
      //     element: <AddressSection />
      // },
      // {
      //     path: "/faqs",
      //     element: <Faqs />
      // },
      // {
      //     path: "/pricing",
      //     element: <Pricing />
      // },
      // {
      //     path: "/privacypolicy",
      //     element: <Privacy_Policy />
      // },
      // {
      //     path: "/refundpolicy",
      //     element: <Refund_policy />
      // },
      // {
      //     path: "/login",
      //     element: <Login />
      // },
      // {
      //     path: "/register",
      //     element: <Register />
      // },
    ],
  },
]);