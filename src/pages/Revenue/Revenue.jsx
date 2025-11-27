import { useDispatch, useSelector } from "react-redux";
import { useEffect,useState } from "react";
import { fetchRevenue } from "../../redux/slices/revenueSlice";
import {
  TrendingUp,
  Wallet,
  Coins,
  CreditCard,
  ChevronDown,
  Check,
} from "lucide-react";
import PrettyDropdown from "./Dropdown";
import RevenueChart from "./RevenueChart";
import RevenuePie from "./RevenuePiChart";
import Loader from "../Loader/Loader";


const Revenue = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPayment, setFilterPayment] = useState("All");
    const [filterDate, setFilterDate] = useState("");
    const [filterQuickDate, setFilterQuickDate] = useState("All");
    const [checkInFilter, setCheckInFilter] = useState("");
    const [checkOutFilter, setCheckOutFilter] = useState("");


     const dispatch = useDispatch();
     const { revenueList, totalCommission, revenueCount, loading } =
       useSelector((state) => state.revenue);

     useEffect(() => {
       dispatch(fetchRevenue());
     }, [dispatch]);

     const applyQuickDateFilter = (item) => {
       if (filterQuickDate === "All") return true;

       const created = new Date(item.createdAt);
       const today = new Date();
       const yesterday = new Date();
       yesterday.setDate(today.getDate() - 1);

       const last30 = new Date();
       last30.setDate(today.getDate() - 30);

       switch (filterQuickDate) {
         case "Today":
           return created.toDateString() === today.toDateString();

         case "Yesterday":
           return created.toDateString() === yesterday.toDateString();

         case "Last30":
           return created >= last30;

         default:
           return true;
       }
     };

const filteredRevenue = revenueList?.filter((item) => {
  // SEARCH
  const searchMatch =
    item?.bookingFor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.orderId?.toString().includes(searchTerm) ||
    item?.finalAmount?.toString().includes(searchTerm) ||
    item?.vendorRevenue?.toString().includes(searchTerm);

  // PAYMENT FILTER
  const paymentMatch =
    filterPayment === "All" ||
    (filterPayment === "Paid" && item?.paymentStatus === 1) ||
    (filterPayment === "Unpaid" && item?.paymentStatus === 0);

  // DATE RANGE FILTER (Check-In / Check-Out)
  const checkIn = checkInFilter ? new Date(checkInFilter) : null;
  const checkOut = checkOutFilter ? new Date(checkOutFilter) : null;
  const bookingCheckIn = new Date(item.checkInDate);
  const bookingCheckOut = new Date(item.checkOutDate);

  const dateRangeMatch =
    (!checkIn || bookingCheckIn >= checkIn) &&
    (!checkOut || bookingCheckOut <= checkOut);

  // QUICK DATE FILTER
  const quickDateMatch = applyQuickDateFilter(item);

  return searchMatch && paymentMatch && dateRangeMatch && quickDateMatch;
});

  const totalVendorRevenue = revenueList.reduce(
    (total, item) => total + (item.vendorRevenue || 0),
    0
  );

  const totalFinalAmount = revenueList.reduce(
    (total, item) => total + (item.finalAmount || 0),
    0
  );

 
   if ( loading) {
     return <Loader />;
   }
    return (
      // <div className="p-4 md:p-6 w-full bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Revenue Overview
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Revenue Count */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg text-white flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs sm:text-sm opacity-80">
                Total Revenue Count
              </p>
              <h2 className="text-xl sm:text-3xl font-bold mt-1">
                {revenueCount}
              </h2>
            </div>
            <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
          </div>

          {/* Total Commission */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg text-white flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs sm:text-sm opacity-80">Total Commission</p>
              <h2 className="text-xl sm:text-3xl font-bold mt-1">
                ₹{totalCommission}
              </h2>
            </div>
            <Wallet className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
          </div>

          {/* Vendor Revenue */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg text-white flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs sm:text-sm opacity-80">Vendor Earnings</p>
              <h2 className="text-xl sm:text-3xl font-bold mt-1">
                ₹{totalVendorRevenue}
              </h2>
            </div>
            <Coins className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
          </div>

          {/* Final Amount */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg text-white flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs sm:text-sm opacity-80">
                Total Booking Amount
              </p>
              <h2 className="text-xl sm:text-3xl font-bold mt-1">
                ₹{totalFinalAmount}
              </h2>
            </div>
            <CreditCard className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Revenue Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-4 border">
            <RevenueChart revenueList={revenueList} />
          </div>

          {/* Revenue Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-4 border">
            <RevenuePie revenueList={revenueList} />
          </div>
        </div>

        {/* Filters Box */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-md border mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            🔍 Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Search</label>
              <input
                type="text"
                placeholder="Booking name, Order ID..."
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Payment Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Payment Status</label>
              <PrettyDropdown
                value={filterPayment}
                onChange={setFilterPayment}
                options={[
                  { value: "All", label: "All Payments" },
                  { value: "Paid", label: "Paid" },
                  { value: "Unpaid", label: "Unpaid" },
                ]}
              />
            </div>

            {/* Created Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Created Date</label>
              <input
                type="date"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            {/* Check-In Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Check-In From</label>
              <input
                type="date"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50"
                value={checkInFilter}
                onChange={(e) => setCheckInFilter(e.target.value)}
              />
            </div>

            {/* Check-Out Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Check-Out To</label>
              <input
                type="date"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50"
                value={checkOutFilter}
                onChange={(e) => setCheckOutFilter(e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Quick Filters</label>
              <PrettyDropdown
                value={filterQuickDate}
                onChange={setFilterQuickDate}
                options={[
                  { value: "All", label: "All Records" },
                  { value: "Today", label: "Today" },
                  { value: "Yesterday", label: "Yesterday" },
                  { value: "Last30", label: "Last 30 Days" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Revenue Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                {[
                  "Booking For",
                  "Check-In",
                  "Check-Out",
                  "Commission %",
                  "Commission Amt",
                  "Vendor Revenue",
                  "Final Amount",
                  "Payment",
                  "Order ID",
                  "Created At",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-4 px-5 text-center text-gray-700 font-semibold uppercase tracking-wide text-xs"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-gray-500">
                    Loading Revenue...
                  </td>
                </tr>
              ) : filteredRevenue?.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-gray-500">
                    No Revenue Records Found
                  </td>
                </tr>
              ) : (
                filteredRevenue.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`border-b transition-all text-center ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50/60 hover:shadow-lg`}
                  >
                    <td className="py-4 px-5 font-medium text-gray-800">
                      {item.bookingFor}
                    </td>

                    <td className="py-4 px-5 text-gray-700">
                      {new Date(item.checkInDate).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-5 text-gray-700">
                      {new Date(item.checkOutDate).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-5 text-indigo-600 font-semibold">
                      {item.commision}%
                    </td>

                    <td className="py-4 px-5 text-blue-600 font-semibold">
                      ₹{item.commisionAmount}
                    </td>

                    <td className="py-4 px-5 text-green-600 font-semibold">
                      ₹{item.vendorRevenue}
                    </td>

                    <td className="py-4 px-5 text-purple-600 font-semibold">
                      ₹{item.finalAmount}
                    </td>

                    <td className="py-4 px-5">
                      {item.paymentStatus === 1 ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full shadow-sm">
                          Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full shadow-sm">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-gray-700 font-medium">
                      {item.orderId}
                    </td>

                    <td className="py-4 px-5 text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );


};

export default Revenue;
