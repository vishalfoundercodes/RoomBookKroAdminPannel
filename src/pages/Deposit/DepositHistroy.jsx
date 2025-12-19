// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaRupeeSign,
//   FaCheckCircle,
//   FaClock,
//   FaTimesCircle,
// } from "react-icons/fa";

// export default function DepositHistory() {
//   const [loading, setLoading] = useState(false);
//   const [transactions, setTransactions] = useState([]);

//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         "https://root.roombookkro.com/api/alltrancation"
//       );

//       if (res.data.status) {
//         setTransactions(res.data.data.transactions || []);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const getStatusBadge = (status) => {
//     if (status === "SUCCESS") {
//       return (
//         <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-semibold">
//           <FaCheckCircle /> SUCCESS
//         </span>
//       );
//     }
//     if (status === "PENDING") {
//       return (
//         <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs font-semibold">
//           <FaClock /> PENDING
//         </span>
//       );
//     }
//     return (
//       <span className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-xs font-semibold">
//         <FaTimesCircle /> FAILED
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-white">
//         <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* HEADER */}
//         <div className="bg-white rounded-xl shadow p-5 mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Deposit History</h1>
//         </div>

//         {/* DESKTOP TABLE */}
//         <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-gray-600">
//               <tr>
//                 <th className="px-5 py-3 text-left">User ID</th>
//                 <th className="px-5 py-3 text-left">User Name</th>
//                 <th className="px-5 py-3 text-left">Order ID</th>
//                 <th className="px-5 py-3 text-left">Amount</th>
//                 <th className="px-5 py-3 text-left">Status</th>
//                 <th className="px-5 py-3 text-left">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((tx) => (
//                 <tr key={tx._id} className="border-t hover:bg-gray-50">
//                   <td className="px-5 py-4 font-medium">{tx.userId}</td>
//                   <td className="px-5 py-4 font-medium">{tx.name}</td>
//                   <td className="px-5 py-4 text-gray-600">{tx.orderId}</td>
//                   <td className="px-5 py-4 font-semibold flex items-center gap-1">
//                     <FaRupeeSign />
//                     {tx.amount}
//                   </td>
//                   <td className="px-5 py-4">
//                     {getStatusBadge(tx.paymentStatus)}
//                   </td>
//                   <td className="px-5 py-4 text-gray-500">
//                     {new Date(tx.createdAt).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {transactions.length === 0 && (
//             <div className="p-6 text-center text-gray-500">
//               No transactions found
//             </div>
//           )}
//         </div>

//         {/* MOBILE CARDS */}
//         <div className="md:hidden space-y-4">
//           {transactions.map((tx) => (
//             <div key={tx._id} className="bg-white rounded-xl shadow p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-bold text-gray-800">
//                   User #{tx.userId}
//                 </span>
//                 {getStatusBadge(tx.paymentStatus)}
//               </div>

//               <p className="text-sm text-gray-600 mb-1">
//                 Order ID: {tx.orderId}
//               </p>

//               <p className="flex items-center gap-1 font-semibold mb-1">
//                 <FaRupeeSign />
//                 {tx.amount}
//               </p>

//               <p className="text-xs text-gray-500">
//                 {new Date(tx.createdAt).toLocaleString()}
//               </p>
//             </div>
//           ))}

//           {transactions.length === 0 && (
//             <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
//               No transactions found
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaWallet,
} from "react-icons/fa";
import Loader from "../Loader/Loader";

export default function DepositHistory() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://root.roombookkro.com/api/alltrancation"
      );
      if (res.data.status) {
        setTransactions(res.data.data.transactions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    // 🔍 Search: name, userId, orderId
    const matchSearch =
      tx?.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(tx.userId).includes(search) ||
      tx?.orderId?.toLowerCase().includes(search.toLowerCase());

    // 📌 Status filter
    const matchStatus =
      statusFilter === "ALL" || tx.paymentStatus === statusFilter;

    // 📅 Date filter
    const txDate = new Date(tx.createdAt).setHours(0, 0, 0, 0);
    const matchFrom = fromDate
      ? txDate >= new Date(fromDate).setHours(0, 0, 0, 0)
      : true;
    const matchTo = toDate
      ? txDate <= new Date(toDate).setHours(0, 0, 0, 0)
      : true;

    return matchSearch && matchStatus && matchFrom && matchTo;
  });


  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "SUCCESS")
      return (
        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-semibold">
          <FaCheckCircle /> SUCCESS
        </span>
      );
    if (status === "PENDING")
      return (
        <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-xs font-semibold">
          <FaClock /> PENDING
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-semibold">
        <FaTimesCircle /> FAILED
      </span>
    );
  };

  const totalAmount = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  if (loading) {
    return (
    <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow">
          <h1 className="text-2xl sm:text-3xl font-bold">Deposit History</h1>
          <p className="text-sm opacity-90 mt-1">
            Track all deposit transactions
          </p>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            icon={<FaWallet />}
            label="Total Deposits"
            value={`₹${totalAmount}`}
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            label="Success"
            value={
              transactions.filter((t) => t.paymentStatus === "SUCCESS").length
            }
            color="green"
          />
          <SummaryCard
            icon={<FaClock />}
            label="Pending"
            value={
              transactions.filter((t) => t.paymentStatus === "PENDING").length
            }
            color="yellow"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            label="Failed"
            value={
              transactions.filter((t) => t.paymentStatus === "FAILED").length
            }
            color="red"
          />
        </div>
        {/* 🔍 FILTERS */}
        <div className="bg-white rounded-2xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search name / user / order"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          {/* From Date */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* To Date */}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

             
        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">User</th>
                <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                <th className="px-6 py-4 text-left font-semibold">Amount</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((tx, index) => (
                <tr
                  key={tx._id}
                  className={`
            transition
            ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            hover:bg-blue-50
          `}
                >
                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{tx.name}</div>
                    <div className="text-xs text-gray-500">ID: {tx.userId}</div>
                  </td>

                  {/* ORDER */}
                  <td className="px-6 py-4 text-indigo-600 font-medium">
                    #{tx.orderId}
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-4 font-bold text-green-700 flex items-center gap-1">
                    <FaRupeeSign className="text-green-600" /> {tx.amount}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    {getStatusBadge(tx.paymentStatus)}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No transactions found
            </div>
          )}
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4">
          {filteredTransactions.map((tx) => (
            <div key={tx._id} className="bg-white rounded-2xl shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{tx.name}</p>
                  <p className="text-xs text-gray-500">ID: {tx.userId}</p>
                </div>
                {getStatusBadge(tx.paymentStatus)}
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Order</span>
                <span>{tx.orderId}</span>
              </div>

              <div className="flex justify-between items-center font-semibold mb-2">
                <span className="flex items-center gap-1">
                  <FaRupeeSign /> {tx.amount}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(tx.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* 🔹 Reusable summary card */
const SummaryCard = ({ icon, label, value, color = "blue" }) => (
  <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
    <div
      className={`h-10 w-10 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);


