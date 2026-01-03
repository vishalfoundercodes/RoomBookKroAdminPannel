import React from "react";

import {
  Home,
  Users,
  ShoppingCart,
  BarChart,
  FileText,
  Settings,
  Star,
  Heart,
  Gem,
  Leaf,
  X,
  CreditCard,
  Bell,
  Building,
  icons,
  HistoryIcon,
  BarChart3,
  LineChart,
  PieChart,
  IndianRupee,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { BiPhotoAlbum, BiSliderAlt } from "react-icons/bi";
import { MdOutlineAccountBalanceWallet, MdOutlineHomeWork, MdOutlineLocalAtm } from "react-icons/md";
import { AiOutlineAppstore, AiOutlineBank } from "react-icons/ai";

// Sidebar Component
export const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", to: "/" },
    { icon: Users, label: "Customers", to: "/users" },
    { icon: Users, label: "Vendors", to: "/vendor" },
    { icon: Building, label: "Property", to: "/property" },
    // // { icon: ShoppingCart, label: "Orders", to: "#" },
    // { icon: BarChart, label: "Analytics", to: "analytics" },
    // { icon: FileText, label: "Reports", to: "reports" },
    { icon: BarChart3, label: "Revenue", to: "/revenue" },
    { icon: HistoryIcon, label: "Booking History ", to: "history" },
    { icon: CreditCard, label: "coupon ", to: "coupon" },

    // { icon: icons, label: "Subscription Plans", to: "subscription" },
    // // { icon: Star, label: "Tarot Reading", to: "#" },
    // // { icon: Heart, label: "Love Compatibility", to: "#" },
    // // { icon: Gem, label: "Crystal Reading", to: "#" },
    // // { icon: Leaf, label: "Palm Reading", to: "#" },
    // // Add more to test scroll
    { icon: Bell, label: "Notifications", to: "/Notification" },
    // { icon: Bell, label: "Revenue", to: "/revenue" },

    // { icon: LineChart, label: "Revenue", to: "/revenue" },
    // { icon: PieChart, label: "Revenue", to: "/revenue" },
    // { icon: IndianRupee, label: "Revenue", to: "/revenue" },

    { icon: BiSliderAlt, label: "Options", to: "/options" },
    {
      icon: MdOutlineAccountBalanceWallet,
      label: "Deposit History",
      to: "/depositHistory",
    },
    {
      icon: MdOutlineLocalAtm,
      label: "Withdraw histroy",
      to: "/withdrawHistory",
    },
    { icon: AiOutlineBank, label: "Bank details", to: "/bankDetails" },
    { icon: BiPhotoAlbum, label: "Add Images Page", to: "/addimagepage" },
    { icon: AiOutlineAppstore, label: "Facility", to: "/amenitiespage" },
    // // { icon: Star, label: "Extra Item 2", to: "#" },
    // // { icon: Star, label: "Extra Item 3", to: "#" },
    // // { icon: Star, label: "Extra Item 4", to: "#" },
    // // { icon: Star, label: "Extra Item 5", to: "#" },
    //   { icon: Settings, label: "Settings", to: "settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white w-64 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {/* <h2 className="text-xl font-bold">Admin Panel</h2> */}
          
          <img
            src="/logo.png"
            className="w-12 h-12 border-2 border-green-600 rounded-full"
            alt="Logo"
          />
          <h2 className="text-lg lg:text-xl font-bold whitespace-nowrap"> Room Book Kro </h2>
          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu with Scroll */}
        <nav className="mt-4 h-[calc(100%-80px)] overflow-y-auto scrollbar-hide ">
          <ul className="space-y-2 px-4 pb-6">
            {menuItems.map((item, index) => (
              <li key={index}>
                                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                      isActive ? "bg-gray-700 font-semibold text-green-400" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>

              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
