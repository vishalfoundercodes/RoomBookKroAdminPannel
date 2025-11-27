import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Home,
  CalendarDays,
  Wallet,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory, updatePaymentStatus } from "../../redux/slices/historySlice";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import StatCard from "../../reusable_components/StatCard";

export default function History() {
  const dispatch = useDispatch();
  const { loading, historyData, error } = useSelector((state) => state.history);
  const [activeTab, setActiveTab] = useState("paymentStatus");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [userId, setUserId] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [bookingSubTab, setBookingSubTab] = useState("currentStay");
  const [paymentSubTab, setPaymentSubTab] = useState("pending");
const [filteredData, setFilteredData] = useState(null);



  useEffect(() => {
    dispatch(fetchOrderHistory({ userId: "all" }));
    setHasSearched(true);
  }, [dispatch]);

  const handleSearch = () => {
    if (searchUserId.trim()) {
      setUserId(searchUserId);
      dispatch(fetchOrderHistory({ userId: searchUserId }));
      setHasSearched(true);
    }
  };

  const handleShowAll = () => {
    setUserId("");
    setSearchUserId("");
    dispatch(fetchOrderHistory({ userId: "all" }));
    setHasSearched(true);
  };

const handlePaymentUpdate = async (orderId, userId, newPaymentStatus) => {
  try {
    const res = await dispatch(
      updatePaymentStatus({ orderId, userId, newPaymentStatus })
    ).unwrap();

    // ✅ Fix: Only show text from API response
    const message =
      res?.msg ||
      res?.message ||
      (newPaymentStatus === 1
        ? "Payment Accepted ✅"
        : "Payment Rejected ❌");

    if (res?.status === 200 || res?.success) {
      toast.success(message);
      // Refresh data after successful update
      dispatch(fetchOrderHistory({ userId }));
    } else {
      toast.error(message || "Failed to update payment status");
    }
  } catch (err) {
    console.error("❌ Error in handlePaymentUpdate:", err);
    toast.error("Something went wrong while updating the transaction");
  }
};


  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
      case 1:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
      case 2:
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
      case 0:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    if (status === 0 || status === "pending") return "Pending";
    if (status === 1 || status === "completed") return "Completed";
    if (status === 2 || status === "rejected") return "Rejected";
    return status;
  };

  const getStatusColor = (status) => {
    if (status === 0 || status === "pending") return "bg-yellow-50 border-yellow-200";
    if (status === 1 || status === "completed") return "bg-green-50 border-green-200";
    if (status === 2 || status === "rejected") return "bg-red-50 border-red-200";
    return "bg-gray-50";
  };

  const BookingCard = ({ booking }) => {
    const isExpanded = expandedBooking === booking._id;
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    return (
      <div
        className={`border rounded-lg p-4 transition hover:shadow-md ${getStatusColor(
          booking.paymentStatus || booking.status
        )}`}
        onClick={() => setExpandedBooking(isExpanded ? null : booking._id)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(booking.paymentStatus || booking.status)}
              <h3 className="font-semibold text-lg">{booking.residencyName}</h3>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Order ID: {booking.orderId}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {getStatusLabel(booking.paymentStatus || booking.status)}
            </p>
            <p className="text-lg font-bold text-gray-900">₹{booking.finalAmount}</p>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{checkInDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{nights} nights</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{booking.nor} room{booking.nor > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span>Discount: ₹{booking.discount}</span>
          </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">User ID:</span>
              <span className="font-medium">{booking.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guest Count:</span>
              <span className="font-medium">{booking.nog} guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Booking For:</span>
              <span className="font-medium capitalize">{booking.bookingFor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base Amount:</span>
              <span className="font-medium">₹{booking.totalAmount}</span>
            </div>

            {/* Accept/Reject Buttons */}
            {booking.paymentStatus === 0 && (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handlePaymentUpdate(booking, 1)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handlePaymentUpdate(booking, 2)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!historyData) return;

    const search = searchUserId.toLowerCase().trim();

    if (search === "") {
      setFilteredData(historyData);
      return;
    }

    const filterBookings = (arr = []) =>
      arr.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search)
        )
      );

    setFilteredData({
      paymentStatusWise: {
        pending: filterBookings(historyData.paymentStatusWise?.pending),
        completed: filterBookings(historyData.paymentStatusWise?.completed),
        rejected: filterBookings(historyData.paymentStatusWise?.rejected),
      },
      timeWise: {
        currentStay: filterBookings(historyData.timeWise?.currentStay),
        upcoming: filterBookings(historyData.timeWise?.upcoming),
        past: filterBookings(historyData.timeWise?.past),
        cancelled: filterBookings(historyData.timeWise?.cancelled),
      },
    });
  }, [searchUserId, historyData]);

const totalBookings =
  (historyData?.timeWise?.upcoming?.length || 0) +
  (historyData?.timeWise?.currentStay?.length || 0) +
  (historyData?.timeWise?.past?.length || 0) +
  (historyData?.timeWise?.cancelled?.length || 0);

const totalPayments =
  (historyData?.paymentStatusWise?.pending?.length || 0) +
  (historyData?.paymentStatusWise?.completed?.length || 0) +
  (historyData?.paymentStatusWise?.rejected?.length || 0);


  if (loading) return <Loader />;

  if (error && hasSearched)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );

  if (!historyData)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No booking history found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Booking History
          </h1>
          <p className="text-gray-600">View and manage all your bookings</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {/* Payment Status Wise */}
          
          <StatCard
            title="Total Payments"
            value={totalPayments.toString()}
            change=""
            icon={Wallet}
            color="yellow"
          />
          <StatCard
            title="Total Booking"
            value={totalBookings.toString()}
            change=""
            icon={CalendarDays}
            color="yellow"
          />
          <StatCard
            title="Pending Payments"
            value={historyData.paymentStatusWise?.pending?.length || 0}
            change=""
            icon={AlertCircle}
            color="yellow"
          />
          <StatCard
            title="Completed Payments"
            value={historyData.paymentStatusWise?.completed?.length || 0}
            change=""
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Rejected Payments"
            value={historyData.paymentStatusWise?.rejected?.length || 0}
            change=""
            icon={XCircle}
            color="red"
          />
          {/* Time Wise */}
          <StatCard
            title="Current Stay"
            value={historyData.timeWise?.currentStay?.length || 0}
            change=""
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Upcoming Bookings"
            value={historyData.timeWise?.upcoming?.length || 0}
            change=""
            icon={Calendar}
            color="purple"
          />
          <StatCard
            title="Past Bookings"
            value={historyData.timeWise?.past?.length || 0}
            change=""
            icon={Home}
            color="gray"
          />
          <StatCard
            title="Cancelled Bookings"
            value={historyData.timeWise?.cancelled?.length || 0}
            change=""
            icon={XCircle}
            color="orange"
          />
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID, User ID, Name..."
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("paymentStatus")}
            className={`px-4 py-2 font-medium ${
              activeTab === "paymentStatus"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Payment Status
          </button>
          <button
            onClick={() => setActiveTab("timeWise")}
            className={`px-4 py-2 font-medium ${
              activeTab === "timeWise"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Booking Status
          </button>
        </div>

        {/* Data Lists */}
        {activeTab === "paymentStatus" && historyData?.paymentStatusWise && (
          <div>
            {/* Sub Tabs */}
            <div className="flex gap-3 mb-6 border-b pb-2">
              {[
                { key: "pending", label: "Pending" },
                { key: "completed", label: "Completed" },
                { key: "rejected", label: "Rejected" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPaymentSubTab(tab.key)}
                  className={`px-4 py-1.5 rounded-md font-medium transition ${
                    paymentSubTab === tab.key
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub Tab Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 capitalize">
                {getStatusIcon(paymentSubTab)}
                {paymentSubTab} (
                {historyData?.paymentStatusWise?.[paymentSubTab]?.length || 0})
              </h2>

              <div className="space-y-3">
                {historyData?.paymentStatusWise?.[paymentSubTab]?.length ? (
                  filteredData?.paymentStatusWise?.[paymentSubTab]?.map(
                    (booking) => (
                      <BookingCard key={booking._id} booking={booking} />
                    )
                  )
                ) : (
                  <p className="text-gray-500">No {paymentSubTab} bookings</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* {activeTab === "timeWise" && (
          <div className="space-y-8">
            {["currentStay", "upcoming", "past"].map((key) => (
              <div key={key}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 capitalize">
                  <Clock className="w-6 h-6 text-blue-500" />
                  {key.replace(/([A-Z])/g, " $1").trim()} ({historyData.timeWise?.[key]?.length || 0})
                </h2>
                <div className="space-y-3">
                  {historyData.timeWise?.[key]?.length ? (
                    historyData.timeWise[key].map((booking) => (
                      <BookingCard key={booking._id} booking={booking} />
                    ))
                  ) : (
                    <p className="text-gray-500">No {key} bookings</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )} */}
        {activeTab === "timeWise" && (
          <div>
            {/* Sub Tabs */}
            <div className="flex gap-3 mb-6 border-b pb-2">
              {[
                { key: "currentStay", label: "Current Stay" },
                { key: "upcoming", label: "Upcoming" },
                { key: "past", label: "Past" },
                { key: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setBookingSubTab(tab.key)}
                  className={`px-4 py-1.5 rounded-md font-medium transition ${
                    bookingSubTab === tab.key
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub Tab Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 capitalize">
                <Clock className="w-6 h-6 text-blue-500" />
                {bookingSubTab.replace(/([A-Z])/g, " $1").trim()}(
                {historyData.timeWise?.[bookingSubTab]?.length || 0})
              </h2>

              <div className="space-y-3">
                {historyData.timeWise?.[bookingSubTab]?.length ? (
                  filteredData.timeWise[bookingSubTab].map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))
                ) : (
                  <p className="text-gray-500">No {bookingSubTab} bookings</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
