import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, Users, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "../../redux/slices/historySlice";

export default function History() {
  const dispatch = useDispatch();
  const { loading, historyData, error } = useSelector((state) => state.history);
  const [activeTab, setActiveTab] = useState("paymentStatus");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [userId, setUserId] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Fetch all bookings on initial load
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
        className={`border rounded-lg p-4 cursor-pointer transition hover:shadow-md ${getStatusColor(
          booking.paymentStatus || booking.status
        )}`}
        onClick={() => setExpandedBooking(isExpanded ? null : booking._id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
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
              <span className="text-gray-600">Coupon Code:</span>
              <span className="font-medium">{booking.cupponCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base Amount:</span>
              <span className="font-medium">₹{booking.totalAmount}</span>
            </div>
            {booking.isChildren && (
              <div className="flex justify-between">
                <span className="text-gray-600">Children:</span>
                <span className="font-medium">{booking.childrenNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">{checkOutDate.toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking history...</p>
        </div>
      </div>
    );
  }

  if (error && hasSearched) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={handleShowAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to All Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!historyData || (!historyData.paymentStatusWise && !historyData.timeWise)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No booking history found.</p>
          <button
            onClick={handleShowAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Show All Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking History</h1>
          <p className="text-gray-600">View and manage all your bookings</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter User ID to search..."
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Search
            </button>
            <button
              onClick={handleShowAll}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              All
            </button>
          </div>
        </div>

        {/* User Filter Info */}
        {userId && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              <span className="font-semibold">Showing bookings for User ID:</span> {userId}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("paymentStatus")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "paymentStatus"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Payment Status
          </button>
          <button
            onClick={() => setActiveTab("timeWise")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "timeWise"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Booking Status
          </button>
        </div>

        {/* Conditional Views */}
        {activeTab === "paymentStatus" && (
          <div className="space-y-8">
            {["pending", "completed", "rejected"].map((key) => (
              <div key={key}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 capitalize">
                  {getStatusIcon(key)}
                  {key} ({historyData.paymentStatusWise?.[key]?.length || 0})
                </h2>
                <div className="space-y-3">
                  {historyData.paymentStatusWise?.[key]?.length ? (
                    historyData.paymentStatusWise[key].map((booking) => (
                      <BookingCard key={booking._id} booking={booking} />
                    ))
                  ) : (
                    <p className="text-gray-500">No {key} bookings</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "timeWise" && (
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
        )}
      </div>
    </div>
  );
}