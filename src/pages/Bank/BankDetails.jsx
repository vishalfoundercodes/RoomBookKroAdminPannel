import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  User,
  Landmark,
  CheckCircle,
  Clock,
  Pencil,
  Trash2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
// import StatCard from "../../reusable_components/StatCard";
import Loader from "../Loader/Loader";
import ConfirmModal from "../../reusable_components/ConfirmationModel";


// 🔘 Reusable Icon Button
// const IconBtn = ({ onClick, icon: Icon, color = "gray", title }) => (
//   <button
//     onClick={onClick}
//     title={title}
//     className={`p-2 rounded-xl bg-${color}-100 text-${color}-700 
//       hover:bg-${color}-200 transition flex items-center justify-center`}
//   >
//     <Icon size={16} />
//   </button>
// );
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`bg-${color}-50 p-5 rounded-2xl shadow flex items-center gap-4`}
  >
    <Icon className={`w-8 h-8 text-${color}-600`} />
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
    </div>
  </div>
);

const IconBtn = ({ onClick, icon: Icon, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-xl bg-${color}-100 text-${color}-700 hover:bg-${color}-200 transition`}
  >
    <Icon size={16} />
  </button>
);

export default function BankDetails() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editBank, setEditBank] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteBankId, setDeleteBankId] = useState(null);

  const ITEMS_PER_PAGE = 5;
const totalAccounts = banks.length;
const verifiedAccounts = banks.filter((b) => b.isVerified).length;
const pendingAccounts = totalAccounts - verifiedAccounts;
const filteredBanks = banks.filter((b) => {
  const searchText =
    b.userDetails?.name?.toLowerCase() +
    b.userDetails?.email?.toLowerCase() +
    b.bankName?.toLowerCase() +
    b.accountHolderName?.toLowerCase();

  const matchSearch = searchText.includes(search.toLowerCase());

  const matchStatus =
    statusFilter === "ALL"
      ? true
      : statusFilter === "VERIFIED"
      ? b.isVerified
      : !b.isVerified;

  return matchSearch && matchStatus;
});

const totalPages = Math.ceil(filteredBanks.length / ITEMS_PER_PAGE);

const paginatedBanks = filteredBanks.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);


  const users = localStorage.getItem("user"); // 👈 apna admin id yaha set karo

  const ADMIN_ID = users.userId;
  // 🔹 Fetch bank details
  const fetchBanks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://root.roombookkro.com/api/admin/allbankdetails"
      );
      setBanks(res.data?.data?.bankDetails || []);
    } catch (err) {
      alert("Failed to load bank details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // 🔹 Verify / Unverify bank
  const handleVerify = async (bankId, isVerified) => {
    try {
      await axios.patch(
        `https://root.roombookkro.com/api/admin/verify/${bankId}`,
        {
          adminId: ADMIN_ID,
          isVerified: !isVerified,
        }
      );
      fetchBanks();
    } catch (err) {
        console.error(err)
      alert("Verification failed");
    }
  };

  // 🔹 Delete bank
  const handleDelete = async (bankId) => {
    try {
     const res= await axios.delete(
        `https://root.roombookkro.com/api/bank/delete/${bankId}`
      );
      console.log("res",res)
      fetchBanks();
    } catch (err) {
        console.log(err)
      alert("Delete failed");
    }
  };

  // 🔹 Set default
  const handleSetDefault = async (bankId) => {
    try {
      const res=await axios.patch(
        `https://root.roombookkro.com/api/set-default/${bankId}`
      );
      console.log(res)
      console.log("message:", res?.data?.message);
      toast.success(res?.data?.message);
      fetchBanks();
    } catch (err) {
      alert("Failed to set default");
    }
  };

  // 🔹 Update bank
  const handleUpdate = async () => {
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
      setEditBank(null);
      fetchBanks();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <Loader />;
return (
  <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    {/* HEADER */}
    <div className="flex items-center gap-3 mb-8">
      <Landmark className="w-8 h-8 text-indigo-600" />
      <h2 className="text-3xl font-bold text-gray-800">
        Bank Details Management
      </h2>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      <StatCard
        title="Total Accounts"
        value={totalAccounts}
        icon={User}
        color="indigo"
      />
      <StatCard
        title="Verified"
        value={verifiedAccounts}
        icon={CheckCircle}
        color="green"
      />
      <StatCard
        title="Pending"
        value={pendingAccounts}
        icon={Clock}
        color="yellow"
      />
    </div>

    {/* FILTERS */}
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        placeholder="🔍 Search user / bank / account holder"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="border rounded-xl px-4 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-indigo-400"
      />

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="border rounded-xl px-4 py-2 w-full sm:w-48 focus:ring-2 focus:ring-indigo-400"
      >
        <option value="ALL">All Status</option>
        <option value="VERIFIED">Verified</option>
        <option value="PENDING">Pending</option>
      </select>
    </div>

    {/* DESKTOP TABLE */}
    <div className=" bg-white rounded-2xl shadow-lg overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-indigo-50 text-gray-700 text-sm">
          <tr>
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-left">Bank</th>
            <th className="p-4 text-left">Account</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredBanks.map((b) => (
            <tr
              key={b._id}
              className="border-t hover:bg-indigo-50/40 transition"
            >
              <td className="p-4">
                <div className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  {b.userDetails?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {b.userDetails?.email}
                </div>
              </td>

              <td className="p-4">
                <div className="font-medium">{b.bankName}</div>
                <div className="text-xs text-gray-500">{b.branchName}</div>
              </td>

              <td className="p-4 text-sm">
                <div>Name-{b.accountHolderName}</div>
                <div className="text-gray-500">Account No-{b.accountNumber}</div>
                <div className="text-gray-500">IFSC-{b.ifscCode}</div>
              </td>

              <td className="p-4 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    b.isVerified ? "bg-green-600" : "bg-yellow-500"
                  }`}
                >
                  {b.isVerified ? (
                    <ShieldCheck size={14} />
                  ) : (
                    <Clock size={14} />
                  )}
                  {b.isVerified ? "VERIFIED" : "PENDING"}
                </span>
              </td>

              <td className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  <IconBtn
                    onClick={() => handleVerify(b.bankId, b.isVerified)}
                    color="indigo"
                    icon={ShieldCheck}
                  />
                  <IconBtn
                    onClick={() => setEditBank(b)}
                    color="yellow"
                    icon={Pencil}
                  />
                  <IconBtn
                    onClick={() => { console.log("bank:",b)
                      setDeleteBankId(b.bankId);
                    }}
                    color="red"
                    icon={Trash2}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* EDIT MODAL */}
    {editBank && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-scaleIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Bank Details</h3>
            <button onClick={() => setEditBank(null)}>
              <XCircle className="text-gray-400 hover:text-red-500" />
            </button>
          </div>

          {[
            "accountHolderName",
            "accountNumber",
            "ifscCode",
            "bankName",
            "branchName",
            "accountType",
          ].map((field) => (
            <input
              key={field}
              value={editBank[field]}
              onChange={(e) =>
                setEditBank({ ...editBank, [field]: e.target.value })
              }
              className="border rounded-xl p-2 mb-3 w-full text-sm focus:ring-2 focus:ring-indigo-400"
              placeholder={field}
            />
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setEditBank(null)}
              className="px-4 py-2 rounded-xl bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-xl bg-green-600 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
    <ConfirmModal
      open={!!deleteBankId}
      title="Delete Bank Account"
      message="Are you sure you want to delete this bank account? This action cannot be undone."
      onCancel={() => setDeleteBankId(null)}
      onConfirm={async () => {
        await handleDelete(deleteBankId);
        setDeleteBankId(null); // modal close
      }}
    />
  </div>
);

}
