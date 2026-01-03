// // import React,{useEffect} from 'react'
// // import { fetchOrderHistory } from '../../redux/slices/historySlice';
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { useDispatch } from 'react-redux';

// // export default function CustomerWiseBooking() {
// //  const location = useLocation();
// //    const dispatch = useDispatch();
// //   const userId = location.state?.userId || [];
// // useEffect(() => {
// //     dispatch(fetchOrderHistory({ userId }));

// //   }, [dispatch]);
// //     return (
// //     <div>
// //       Customer booking
// //     </div>
// //   )
// // }

// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   DollarSign,
//   Users,
//   MapPin,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Search,
//   Home,
//   CalendarDays,
//   Wallet,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchOrderHistory,
//   updatePaymentStatus,
// } from "../../redux/slices/historySlice";
// import Loader from "../Loader/Loader";
// import { toast } from "react-toastify";
// import StatCard from "../../reusable_components/StatCard";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function UserBankDetails() {
//   const dispatch = useDispatch();
//   const { loading, historyData, error } = useSelector((state) => state.history);
//   const [activeTab, setActiveTab] = useState("paymentStatus");
//   const [expandedBooking, setExpandedBooking] = useState(null);
//   //   const [userId, setUserId] = useState("");
//   const [searchUserId, setSearchUserId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [bookingSubTab, setBookingSubTab] = useState("currentStay");
//   const [paymentSubTab, setPaymentSubTab] = useState("pending");
//   const [filteredData, setFilteredData] = useState(null);
//   const [cutomerName, setCustomerName] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const userId = location.state?.userId || [];
//   const userName = location.state?.userName || "";
//   const customerImage = location.state?.userImage || "";
//   useEffect(() => {
//     setCustomerName(location.state?.userName);
//     dispatch(fetchOrderHistory({ userId }));
//     setHasSearched(true);
//   }, [dispatch]);

//   const handlePaymentUpdate = async (orderId, userId, newPaymentStatus) => {
//     try {
//       const res = await dispatch(
//         updatePaymentStatus({ orderId, userId, newPaymentStatus })
//       ).unwrap();

//       // ✅ Fix: Only show text from API response
//       const message =
//         res?.msg ||
//         res?.message ||
//         (newPaymentStatus === 1
//           ? "Payment Accepted ✅"
//           : "Payment Rejected ❌");

//       if (res?.status === 200 || res?.success) {
//         toast.success(message);
//         // Refresh data after successful update
//         dispatch(fetchOrderHistory({ userId }));
//       } else {
//         toast.error(message || "Failed to update payment status");
//       }
//     } catch (err) {
//       console.error("❌ Error in handlePaymentUpdate:", err);
//       toast.error("Something went wrong while updating the transaction");
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "completed":
//       case 1:
//         return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case "rejected":
//       case 2:
//         return <XCircle className="w-5 h-5 text-red-500" />;
//       case "pending":
//       case 0:
//         return <AlertCircle className="w-5 h-5 text-yellow-500" />;
//       default:
//         return null;
//     }
//   };

//   const getStatusLabel = (status) => {
//     if (status === 0 || status === "pending") return "Pending";
//     if (status === 1 || status === "completed") return "Completed";
//     if (status === 2 || status === "rejected") return "Rejected";
//     return status;
//   };

//   const getStatusColor = (status) => {
//     if (status === 0 || status === "pending")
//       return "bg-yellow-50 border-yellow-200";
//     if (status === 1 || status === "completed")
//       return "bg-green-50 border-green-200";
//     if (status === 2 || status === "rejected")
//       return "bg-red-50 border-red-200";
//     return "bg-gray-50";
//   };

//   const BookingCard = ({ booking }) => {
//     const isExpanded = expandedBooking === booking._id;
//     const checkInDate = new Date(booking.checkInDate);
//     const checkOutDate = new Date(booking.checkOutDate);
//     const nights = Math.ceil(
//       (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
//     );

//     return (
//       <div
//         className={`border rounded-lg p-4 transition hover:shadow-md ${getStatusColor(
//           booking.paymentStatus || booking.status
//         )}`}
//         onClick={() => setExpandedBooking(isExpanded ? null : booking._id)}
//       >
//         <div className="flex justify-between items-start">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               {getStatusIcon(booking.paymentStatus || booking.status)}
//               <h3 className="font-semibold text-lg">{booking.residencyName}</h3>
//             </div>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <MapPin className="w-4 h-4" />
//               Order ID: {booking.orderId}
//             </p>
//           </div>

//           <div className="text-right">
//             <p className="text-sm font-medium text-gray-700">
//               {getStatusLabel(booking.paymentStatus || booking.status)}
//             </p>
//             <p className="text-lg font-bold text-gray-900">
//               ₹{booking.finalAmount}
//             </p>
//           </div>
//         </div>

//         {/* Booking Summary */}
//         <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t">
//           <div className="flex items-center gap-2 text-sm">
//             <Calendar className="w-4 h-4 text-gray-500" />
//             <span>{checkInDate.toLocaleDateString()}</span>
//           </div>
//           <div className="flex items-center gap-2 text-sm">
//             <Clock className="w-4 h-4 text-gray-500" />
//             <span>{nights} nights</span>
//           </div>
//           <div className="flex items-center gap-2 text-sm">
//             <Users className="w-4 h-4 text-gray-500" />
//             <span>
//               {booking.nor} room{booking.nor > 1 ? "s" : ""}
//             </span>
//           </div>
//           <div className="flex items-center gap-2 text-sm">
//             <DollarSign className="w-4 h-4 text-gray-500" />
//             <span>Discount: ₹{booking.discount}</span>
//           </div>
//         </div>

//         {/* Expandable Details */}
//         {isExpanded && (
//           <div className="mt-4 pt-4 border-t space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">User ID:</span>
//               <span className="font-medium">{booking.userId}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Guest Count:</span>
//               <span className="font-medium">{booking.nog} guests</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Booking For:</span>
//               <span className="font-medium capitalize">
//                 {booking.bookingFor}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Base Amount:</span>
//               <span className="font-medium">₹{booking.totalAmount}</span>
//             </div>

//             {/* Accept/Reject Buttons */}
//             {booking.paymentStatus === 0 && (
//               <div className="flex justify-end gap-2 mt-4">
//                 <button
//                   onClick={() => handlePaymentUpdate(booking, 1)}
//                   className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handlePaymentUpdate(booking, 2)}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   Reject
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   useEffect(() => {
//     if (!historyData) return;

//     const search = searchUserId.toLowerCase().trim();

//     if (search === "") {
//       setFilteredData(historyData);
//       return;
//     }

//     const filterBookings = (arr = []) =>
//       arr.filter((item) =>
//         Object.values(item).some((value) =>
//           String(value).toLowerCase().includes(search)
//         )
//       );

//     setFilteredData({
//       paymentStatusWise: {
//         pending: filterBookings(historyData.paymentStatusWise?.pending),
//         completed: filterBookings(historyData.paymentStatusWise?.completed),
//         rejected: filterBookings(historyData.paymentStatusWise?.rejected),
//       },
//       timeWise: {
//         currentStay: filterBookings(historyData.timeWise?.currentStay),
//         upcoming: filterBookings(historyData.timeWise?.upcoming),
//         past: filterBookings(historyData.timeWise?.past),
//         cancelled: filterBookings(historyData.timeWise?.cancelled),
//       },
//     });
//   }, [searchUserId, historyData]);

//   const totalBookings =
//     (historyData?.timeWise?.upcoming?.length || 0) +
//     (historyData?.timeWise?.currentStay?.length || 0) +
//     (historyData?.timeWise?.past?.length || 0) +
//     (historyData?.timeWise?.cancelled?.length || 0);

//   const totalPayments =
//     (historyData?.paymentStatusWise?.pending?.length || 0) +
//     (historyData?.paymentStatusWise?.completed?.length || 0) +
//     (historyData?.paymentStatusWise?.rejected?.length || 0);

//   if (loading) return <Loader />;

//   if (error && hasSearched)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-red-600">{error}</p>
//       </div>
//     );

//   if (!historyData)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-600">No booking history found.</p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 mt-4 rounded-xl">
//       <div className=" px-4 py-8">
//         {/* Header */}
//         {/* <div className="flex mb-2">
//           <div className=" mb-2 cursor-pointer" onClick={() => navigate(-1)}>
//             <svg
//               width="44"
//               height="44"
//               viewBox="0 0 44 44"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <rect width="44" height="44" rx="8" fill="#2563EB" />
//               <path
//                 d="M28 31.202L26.2153 33L16.4945 23.2009C16.3378 23.0439 16.2134 22.8572 16.1285 22.6515C16.0437 22.4459 16 22.2253 16 22.0025C16 21.7798 16.0437 21.5592 16.1285 21.3536C16.2134 21.1479 16.3378 20.9612 16.4945 20.8042L26.2153 11L27.9983 12.798L18.8746 22L28 31.202Z"
//                 fill="white"
//               />
//             </svg>
//           </div>
//           <img
//             src={customerImage}
//             alt="profile image"
//             className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-fill shadow-md"
//           />
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">
//               {cutomerName}'s Booking History
//             </h1>
//             <p className="text-gray-600">View and manage all your bookings</p>
//           </div>
//         </div> */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
//           {/* Back Button */}
//           <div
//             className="cursor-pointer flex-shrink-0"
//             onClick={() => navigate(-1)}
//           >
//             <svg
//               width="44"
//               height="44"
//               viewBox="0 0 44 44"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-10 h-10 sm:w-11 sm:h-11"
//             >
//               <rect width="44" height="44" rx="8" fill="#2563EB" />
//               <path
//                 d="M28 31.202L26.2153 33L16.4945 23.2009C16.3378 23.0439 16.2134 22.8572 16.1285 22.6515C16.0437 22.4459 16 22.2253 16 22.0025C16 21.7798 16.0437 21.5592 16.1285 21.3536C16.2134 21.1479 16.3378 20.9612 16.4945 20.8042L26.2153 11L27.9983 12.798L18.8746 22L28 31.202Z"
//                 fill="white"
//               />
//             </svg>
//           </div>

//           {/* Profile Image */}
//           <img
//             src={customerImage}
//             alt="profile image"
//             className="
//       w-20 h-20 
//       sm:w-24 sm:h-24 
//       md:w-28 md:h-28 
//       rounded-full 
//       object-cover 
//       shadow-md 
//       flex-shrink-0
//     "
//           />

//           {/* Text Content */}
//           <div className="flex flex-col">
//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">
//               {cutomerName}'s Bank details
//             </h1>
//             <p className="text-gray-600 text-sm sm:text-base">
//               View and manage all your bookings
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
//           {/* Payment Status Wise */}

//           <StatCard
//             title="Total Payments"
//             value={totalPayments.toString()}
//             change=""
//             icon={Wallet}
//             color="yellow"
//           />
//           <StatCard
//             title="Total Booking"
//             value={totalBookings.toString()}
//             change=""
//             icon={CalendarDays}
//             color="yellow"
//           />
//           <StatCard
//             title="Pending Payments"
//             value={historyData.paymentStatusWise?.pending?.length || 0}
//             change=""
//             icon={AlertCircle}
//             color="yellow"
//           />
//           <StatCard
//             title="Completed Payments"
//             value={historyData.paymentStatusWise?.completed?.length || 0}
//             change=""
//             icon={CheckCircle}
//             color="green"
//           />
//           <StatCard
//             title="Rejected Payments"
//             value={historyData.paymentStatusWise?.rejected?.length || 0}
//             change=""
//             icon={XCircle}
//             color="red"
//           />
//           {/* Time Wise */}
//           <StatCard
//             title="Current Stay"
//             value={historyData.timeWise?.currentStay?.length || 0}
//             change=""
//             icon={Clock}
//             color="blue"
//           />
//           <StatCard
//             title="Upcoming Bookings"
//             value={historyData.timeWise?.upcoming?.length || 0}
//             change=""
//             icon={Calendar}
//             color="purple"
//           />
//           <StatCard
//             title="Past Bookings"
//             value={historyData.timeWise?.past?.length || 0}
//             change=""
//             icon={Home}
//             color="gray"
//           />
//           <StatCard
//             title="Cancelled Bookings"
//             value={historyData.timeWise?.cancelled?.length || 0}
//             change=""
//             icon={XCircle}
//             color="orange"
//           />
//         </div>

//         {/* Search */}
//         <div className="mb-6">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search by Order ID, User ID, Name..."
//               value={searchUserId}
//               onChange={(e) => setSearchUserId(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//             />
//             <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-6 border-b">
//           <button
//             onClick={() => setActiveTab("paymentStatus")}
//             className={`px-4 py-2 font-medium ${
//               activeTab === "paymentStatus"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-600"
//             }`}
//           >
//             Payment Status
//           </button>
//           <button
//             onClick={() => setActiveTab("timeWise")}
//             className={`px-4 py-2 font-medium ${
//               activeTab === "timeWise"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-600"
//             }`}
//           >
//             Booking Status
//           </button>
//         </div>

//         {/* Data Lists */}
//         {activeTab === "paymentStatus" && historyData?.paymentStatusWise && (
//           <div>
//             {/* Sub Tabs */}
//             <div className="flex gap-3 mb-6 border-b pb-2">
//               {[
//                 { key: "pending", label: "Pending" },
//                 { key: "completed", label: "Completed" },
//                 { key: "rejected", label: "Rejected" },
//               ].map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setPaymentSubTab(tab.key)}
//                   className={`px-4 py-1.5 rounded-md font-medium transition ${
//                     paymentSubTab === tab.key
//                       ? "bg-blue-600 text-white shadow"
//                       : "text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Sub Tab Content */}
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 capitalize">
//                 {getStatusIcon(paymentSubTab)}
//                 {paymentSubTab} (
//                 {historyData?.paymentStatusWise?.[paymentSubTab]?.length || 0})
//               </h2>

//               <div className="space-y-3">
//                 {historyData?.paymentStatusWise?.[paymentSubTab]?.length ? (
//                   filteredData?.paymentStatusWise?.[paymentSubTab]?.map(
//                     (booking) => (
//                       <BookingCard key={booking._id} booking={booking} />
//                     )
//                   )
//                 ) : (
//                   <p className="text-gray-500">No {paymentSubTab} bookings</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* {activeTab === "timeWise" && (
//           <div className="space-y-8">
//             {["currentStay", "upcoming", "past"].map((key) => (
//               <div key={key}>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 capitalize">
//                   <Clock className="w-6 h-6 text-blue-500" />
//                   {key.replace(/([A-Z])/g, " $1").trim()} ({historyData.timeWise?.[key]?.length || 0})
//                 </h2>
//                 <div className="space-y-3">
//                   {historyData.timeWise?.[key]?.length ? (
//                     historyData.timeWise[key].map((booking) => (
//                       <BookingCard key={booking._id} booking={booking} />
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No {key} bookings</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )} */}
//         {activeTab === "timeWise" && (
//           <div>
//             {/* Sub Tabs */}
//             <div className="flex gap-3 mb-6 border-b pb-2">
//               {[
//                 { key: "currentStay", label: "Current Stay" },
//                 { key: "upcoming", label: "Upcoming" },
//                 { key: "past", label: "Past" },
//                 { key: "cancelled", label: "Cancelled" },
//               ].map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setBookingSubTab(tab.key)}
//                   className={`px-4 py-1.5 rounded-md font-medium transition ${
//                     bookingSubTab === tab.key
//                       ? "bg-blue-600 text-white shadow"
//                       : "text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Sub Tab Content */}
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 capitalize">
//                 <Clock className="w-6 h-6 text-blue-500" />
//                 {bookingSubTab.replace(/([A-Z])/g, " $1").trim()}(
//                 {historyData.timeWise?.[bookingSubTab]?.length || 0})
//               </h2>

//               <div className="space-y-3">
//                 {historyData.timeWise?.[bookingSubTab]?.length ? (
//                   filteredData.timeWise[bookingSubTab].map((booking) => (
//                     <BookingCard key={booking._id} booking={booking} />
//                   ))
//                 ) : (
//                   <p className="text-gray-500">No {bookingSubTab} bookings</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Star, ArrowLeft, Banknote } from "lucide-react";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import ConfirmModal from "../../reusable_components/ConfirmationModel";
import defaultProfile from "../../assets/default-profile.png";

export default function UserBankDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [editBank, setEditBank] = useState(null);
  const [deleteBankId, setDeleteBankId] = useState(null);

  const userId = location.state?.userId;
  const userName = location.state?.userName;
  const userImage = location.state?.userImage;

  const [loading, setLoading] = useState(false);
  const [bankData, setBankData] = useState(null);

      const fetchBankDetails = async () => {
        try {
          setLoading(true);
           if (!userId) return;
          const res = await axios.get(
            `https://root.roombookkro.com/api/bankdetails/user/${userId}`
          );
          setBankData(res.data.data);
        } catch (err) {
          toast.error("Failed to fetch bank details");
        } finally {
          setLoading(false);
        }
      };
  useEffect(() => {
   
    fetchBankDetails();
  }, [userId]);
  // 🔹 Update bank
  const handleUpdate = async () => {
    if (!editBank?.bankId) return;

    try {
      await axios.put(
        `https://root.roombookkro.com/api/bank/update/${editBank.bankId}`,
        {
          accountHolderName: editBank.accountHolderName,
          accountNumber: editBank.accountNumber,
          ifscCode: editBank.ifscCode,
          bankName: editBank.bankName,
          branchName: editBank.branchName,
          accountType: editBank.accountType,
          isDefault: editBank.isDefault,
        }
      );

      toast.success("Bank details updated successfully");
      setEditBank(null);
      fetchBankDetails(); // 🔄 refresh list
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // 🔹 Delete bank
  const handleDelete = async (bankId) => {
    if (!bankId) return;

    try {
      await axios.delete(
        `https://root.roombookkro.com/api/bank/delete/${bankId}`
      );

      toast.success("Bank deleted successfully");
      fetchBankDetails(); // 🔄 refresh
    } catch (err) {
        fetchBankDetails();
      console.error(err);
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  if (!bankData)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No bank details found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <ArrowLeft size={20} />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <img
              src={userImage || defaultProfile}
              alt="user"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {userName}'s Bank Details
              </h1>
              <p className="text-sm text-gray-500">
                Total Accounts: {bankData.totalAccounts}
              </p>
            </div>
          </div>
        </div>

        {/* ================= BANK CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bankData.bankDetails.map((bank) => (
            <div
              key={bank._id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              {/* Top */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {bank.accountHolderName}
                    </h3>
                    <p className="text-sm text-gray-500">{bank.bankName}</p>
                  </div>

                  {bank.isDefault && (
                    <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      <Star size={14} /> Default
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account No</span>
                    <span className="font-medium">
                      ****{bank.accountNumber.slice(-4)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">IFSC</span>
                    <span className="font-medium">{bank.ifscCode}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Type</span>
                    <span className="font-medium">{bank.accountType}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Branch</span>
                    <span className="font-medium">{bank.branchName}</span>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="flex justify-between items-center mt-5 pt-4 border-t">
                {/* <span
                  className={`flex items-center gap-1 text-sm ${
                    bank.isVerified ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {bank.isVerified ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {bank.isVerified ? "Verified" : "Not Verified"}
                </span>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    bank.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {bank.isActive ? "Active" : "Inactive"}
                </span> */}
                <div className="flex justify-end gap-3 mt-4">
                  {/* Edit */}
                  <button
                    onClick={() => setEditBank(bank)}
                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteBankId(bank.bankId)}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= EMPTY STATE ================= */}
        {bankData.bankDetails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Banknote size={48} />
            <p className="mt-3">No bank accounts available</p>
          </div>
        )}
      </div>
      {editBank && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8">
            {/* 🔹 Header */}
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Edit Bank Details
            </h2>

            <div className="space-y-4">
              {/* Account Holder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={editBank.accountHolderName || ""}
                  onChange={(e) =>
                    setEditBank({
                      ...editBank,
                      accountHolderName: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={editBank.accountNumber || ""}
                  onChange={(e) =>
                    setEditBank({
                      ...editBank,
                      accountNumber: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={editBank.ifscCode || ""}
                  onChange={(e) =>
                    setEditBank({
                      ...editBank,
                      ifscCode: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2 uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={editBank.bankName || ""}
                  onChange={(e) =>
                    setEditBank({
                      ...editBank,
                      bankName: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Branch Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={editBank.branchName || ""}
                  onChange={(e) =>
                    setEditBank({
                      ...editBank,
                      branchName: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Account Type
                </label>
                <select
                  value={editBank.accountType || ""}
                  onChange={(e) =>
                    setEditBank({
                      ...editBank,
                      accountType: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Account Type</option>
                  <option value="SAVINGS">Saving</option>
                  <option value="CURRENT">Current</option>
                </select>
              </div>

              {/* Default Account */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!editBank.isDefault}
                  onChange={(e) =>
                    setEditBank({
                      ...editBank,
                      isDefault: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Set as default bank
                </span>
              </div>
            </div>

            {/* 🔹 Footer Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setEditBank(null)}
                className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Update Bank
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteBankId && (
        <ConfirmModal
          open={!!deleteBankId}
          title="Delete Bank Account"
          message="Are you sure you want to delete this bank account? This action cannot be undone."
          onCancel={() => setDeleteBankId(null)}
          onConfirm={async () => {
            await handleDelete(deleteBankId);
            setDeleteBankId(null);
          }}
        />
      )}
    </div>
  );
}
