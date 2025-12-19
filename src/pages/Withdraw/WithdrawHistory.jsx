// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Loader from "../Loader/Loader";

// export default function WithdrawHistory() {
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [note, setNote] = useState("");
//   const [actionLoading, setActionLoading] = useState(null);

//   // 🔹 Fetch withdrawals
//   const fetchWithdrawals = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         "https://root.roombookkro.com/api/admin/withdrawals"
//       );
//       setWithdrawals(res.data?.data?.withdrawals || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load withdrawals");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWithdrawals();
//   }, []);

//   // 🔹 Approve / Reject
//   const handleAction = async (orderId, action) => {
//     if (!note) {
//       alert("Admin note is required");
//       return;
//     }

//     try {
//       setActionLoading(orderId);

//       await axios.put(
//         `https://root.roombookkro.com/api/admin/withdraw/${orderId}`,
//         {
//           action,
//           adminNote: note,
//         }
//       );

//       alert(`Withdrawal ${action} successfully`);
//       setNote("");
//       fetchWithdrawals();
//     } catch (err) {
//       console.error(err);
//       alert("Action failed");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   if (loading) return(<Loader/>);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Withdraw History</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">User</th>
//               <th className="p-2 border">Order ID</th>
//               <th className="p-2 border">Amount</th>
//               <th className="p-2 border">Bank</th>
//               <th className="p-2 border">Status</th>
//               <th className="p-2 border">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {withdrawals.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center p-4">
//                   No withdrawals found
//                 </td>
//               </tr>
//             )}

//             {withdrawals.map((w) => (
//               <tr key={w._id} className="text-center">
//                 <td className="p-2 border">
//                   <div className="font-semibold">{w.userDetails?.name}</div>
//                   <div className="text-sm text-gray-500">
//                     {w.userDetails?.email}
//                   </div>
//                 </td>

//                 <td className="p-2 border">{w.orderId}</td>

//                 <td className="p-2 border">₹{w.amount}</td>

//                 <td className="p-2 border text-sm">
//                   <div>{w.bankDetails?.bankName}</div>
//                   <div>{w.bankDetails?.accountNumber}</div>
//                   <div>{w.bankDetails?.ifscCode}</div>
//                 </td>

//                 <td className="p-2 border">
//                   <span
//                     className={`px-2 py-1 rounded text-white text-sm ${
//                       w.paymentStatus === "PENDING"
//                         ? "bg-yellow-500"
//                         : w.paymentStatus === "SUCCESS"
//                         ? "bg-green-600"
//                         : "bg-red-600"
//                     }`}
//                   >
//                     {w.paymentStatus}
//                   </span>
//                 </td>

//                 <td className="p-2 border">
//                   {w.paymentStatus === "PENDING" ? (
//                     <div className="flex flex-col gap-2">
//                       <input
//                         type="text"
//                         placeholder="Admin note"
//                         value={note}
//                         onChange={(e) => setNote(e.target.value)}
//                         className="border p-1 text-sm"
//                       />

//                       <select
//                         className="border p-1 text-sm"
//                         defaultValue=""
//                         onChange={(e) =>
//                           handleAction(w.orderId, e.target.value)
//                         }
//                         disabled={actionLoading === w.orderId}
//                       >
//                         <option value="" disabled>
//                           Select Action
//                         </option>
//                         <option value="APPROVE">Approve</option>
//                         <option value="REJECT">Reject</option>
//                       </select>
//                     </div>
//                   ) : (
//                     <span className="text-gray-500 text-sm">Processed</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaRupeeSign,
  FaUniversity,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

export default function WithdrawHistory() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [notes, setNotes] = useState({});

  // Fetch withdrawals
  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://root.roombookkro.com/api/admin/withdrawals"
      );
      console.log(res.data?.data?.withdrawals);
      setWithdrawals(res.data?.data?.withdrawals || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async (orderId, action, noteValue) => {
    if (!noteValue) return toast.warn(`Admin note is required.`);

    try {
      setActionLoading(orderId);
      console.log(noteValue);
      await axios.put(
        `https://root.roombookkro.com/api/admin/withdraw/${orderId}`,
        { action, adminNote: noteValue }
      );
      setNotes({ ...notes, [orderId]: "" });
      fetchWithdrawals();
    } catch (err) {
      alert("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = withdrawals.filter((w) => {
    const matchSearch =
      w.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      w.userDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
      w.userDetails?.email?.toLowerCase().includes(search.toLowerCase()) ||
      w.bankDetails?.accountNumber
        ?.toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "ALL" || w.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalAmount = withdrawals.reduce(
    (sum, w) => sum + Number(w.amount || 0),
    0
  );
  const totalSuccess = withdrawals.filter(
    (w) => w.paymentStatus === "SUCCESS"
  ).length;
  const totalPending = withdrawals.filter(
    (w) => w.paymentStatus === "PENDING"
  ).length;
  const totalFailed = withdrawals.filter(
    (w) => w.paymentStatus === "REJECTED"
  ).length;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold">Withdraw History</h1>
          <p className="opacity-90 text-sm">Manage user withdrawals</p>
        </div>
        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Amount"
            value={`₹${totalAmount}`}
            color="blue"
          />
          <StatCard label="Approved" value={totalSuccess} color="green" />
          <StatCard label="Pending" value={totalPending} color="yellow" />
          <StatCard label="Rejected" value={totalFailed} color="red" />
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name, email, order ID, account number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 cursor-pointer"
          >
            <option value="ALL" className="cursor-pointer">
              All Status
            </option>
            <option value="PENDING" className="cursor-pointer">
              Pending
            </option>
            <option value="SUCCESS" className="cursor-pointer">
              Approved
            </option>
            <option value="REJECTED" className="cursor-pointer">
              Rejected
            </option>
          </select>
        </div>

        {/* TABLE DESKTOP */}
        <div className=" bg-white rounded-2xl shadow lg:overflow-hidden overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-left">Bank</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No withdrawals found
                  </td>
                </tr>
              )}
              {filtered.map((w, i) => (
                <tr
                  key={w._id}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">
                      {w.userDetails?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {w.userDetails?.email}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-indigo-600 font-medium">
                    {w.orderId}
                  </td>

                  <td className="px-6 py-4 text-right font-semibold text-green-700 flex justify-end items-center gap-1">
                    <FaRupeeSign /> {w.amount}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{w.bankDetails?.bankName}</div>
                    <div>{w.bankDetails?.accountNumber}</div>
                    <div>{w.bankDetails?.ifscCode}</div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={w.paymentStatus} />
                  </td>

                  <td className="px-6 py-4 text-center">
                    {w.paymentStatus === "PENDING" ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="Admin note"
                          //   value={note}
                          //   onChange={(e) => setNote(e.target.value)}
                          value={notes[w.orderId] || ""}
                          onChange={(e) =>
                            setNotes({ ...notes, [w.orderId]: e.target.value })
                          }
                          className="border rounded-lg px-2 py-1 text-xs"
                        />
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() =>
                              handleAction(
                                w.orderId,
                                "APPROVE",
                                notes[w.orderId]
                              )
                            }
                            disabled={actionLoading === w.orderId}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleAction(
                                w.orderId,
                                "REJECT",
                                notes[w.orderId]
                              )
                            }
                            disabled={actionLoading === w.orderId}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-gray-500 text-xs">
                            Processed
                          </p>
                          <p className="text-gray-500 text-xs">
                            {w.adminNote}
                          </p>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Components */
const StatusBadge = ({ status }) => {
  if (status === "SUCCESS")
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
        <FaCheckCircle /> Approved
      </span>
    );
  if (status === "PENDING")
    return (
      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
        <FaClock /> Pending
      </span>
    );
  return (
    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
      <FaTimesCircle /> Rejected
    </span>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: "from-blue-400 to-blue-600 text-white",
    green: "from-green-400 to-green-600 text-white",
    yellow: "from-yellow-400 to-yellow-600 text-white",
    red: "from-red-400 to-red-600 text-white",
  };
  return (
    <div
      className={`bg-gradient-to-r ${colors[color]} p-4 rounded-2xl shadow flex flex-col`}
    >
      <p className="text-lg opacity-90">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
};
