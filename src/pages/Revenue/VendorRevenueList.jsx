// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers } from "../../redux/slices/userSlice";
// import { Eye } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { fetchVendorProperty } from "../../redux/slices/propertySlice";
// import { fetchVendorRevenue } from "../../redux/slices/revenueSlice";

// export default function VendorRevenueList() {
//   // const [selectedUser,setSelectedUser]=useState(null)
//   const dispatch = useDispatch();
//   const navigate=useNavigate()

//   const { data: users, loading: usersLoading } = useSelector(
//     (state) => state.users
//   );

//   const handleSeeProperty = async (selectedUser) => {
//     const vendorProperty = await dispatch(
//       fetchVendorProperty({ userId: selectedUser.userId })
//     ).unwrap();

//     const vendorPropertyRevenue = await dispatch(
//       fetchVendorRevenue({ userId: selectedUser.userId })
//     ).unwrap();

//     console.log("vendor property:", vendorProperty);

//     if (vendorProperty?.data?.length > 0) {
//       navigate("/vendor/property", {
//         state: {
//           vendorProperty,
//           vendorId: selectedUser.userId,
//           vendorPropertyRevenue,
//           vendorName: selectedUser.name,
//           vendorImage: selectedUser.userImage,
//         },
//       });
//     } else {
//       toast.warn("No property Register");
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const onlyTypeOneUsers = users?.filter((u) => u.user_type == "1" || u.user_type=="0") || [];

//   const totalVendors = onlyTypeOneUsers.length;

//   const totalRevenue = onlyTypeOneUsers.reduce(
//     (sum, v) => sum + (v.vendorRevenue || 0),
//     0
//   );

//   return (
//     <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
//       {/* TITLE */}
//       <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
//         Vendor Revenue Overview
//       </h1>

//       {/* LOADING */}
//       {usersLoading && (
//         <p className="text-gray-600 text-lg">Loading vendors...</p>
//       )}

//       {/* TOP CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//         {/* TOTAL VENDORS */}
//         <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition">
//           <p className="text-gray-600 text-lg font-medium">Total Vendors</p>
//           <h2 className="text-4xl font-extrabold text-blue-600 mt-2">
//             {totalVendors}
//           </h2>
//         </div>

//         {/* TOTAL REVENUE */}
//         <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition">
//           <p className="text-gray-600 text-lg font-medium">
//             Total Vendor Revenue
//           </p>
//           <h2 className="text-4xl font-extrabold text-green-600 mt-2">
//             ₹{totalRevenue.toLocaleString()}
//           </h2>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="text-left p-4 font-semibold text-gray-700">
//                 Name
//               </th>
//               <th className="text-left p-4 font-semibold text-gray-700">
//                 Revenue
//               </th>
//               <th className="text-center p-4 font-semibold text-gray-700">
//                 See the details
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {onlyTypeOneUsers.map((vendor) => (
//               <tr
//                 key={vendor._id}
//                 className="border-b hover:bg-gray-50 transition"
//               >
//                 <td className="p-4 font-medium text-gray-900">{vendor.name}</td>

//                 <td className="p-4 text-green-600 font-semibold">
//                   ₹{vendor.vendorRevenue?.toLocaleString() || 0}
//                 </td>

//                 <td className="p-4 text-center">
//                   <button
//                     onClick={
//                       () => handleSeeProperty(vendor)
//                       // (window.location.href = `/vendor/${vendor.userId}`)
//                     }
//                     className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
//                   >
//                     <Eye size={20} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {onlyTypeOneUsers.length === 0 && (
//           <p className="p-6 text-center text-gray-500">No vendors found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchVendorProperty } from "../../redux/slices/propertySlice";
import { fetchVendorRevenue } from "../../redux/slices/revenueSlice";
import PrettyDropdown from "./Dropdown"; // <- adjust path
import { toast } from "react-toastify";

export default function VendorRevenueList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: users, loading: usersLoading } = useSelector(
    (state) => state.users
  );

  const [typeFilter, setTypeFilter] = useState("all");
  const [revenueFilter, setRevenueFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // FILTER LOGIC
  let filteredUsers =
    users?.filter((u) => u.user_type === "1" || u.user_type === "0") || [];

  // Type filter
  if (typeFilter !== "all") {
    filteredUsers = filteredUsers.filter((u) => u.user_type === typeFilter);
  }

  // Revenue filter
  if (revenueFilter !== "all") {
    if (revenueFilter === "low") {
      filteredUsers = filteredUsers.filter(
        (u) => (u.vendorRevenue || 0) < 5000
      );
    } else if (revenueFilter === "mid") {
      filteredUsers = filteredUsers.filter(
        (u) => (u.vendorRevenue || 0) >= 5000 && (u.vendorRevenue || 0) <= 20000
      );
    } else if (revenueFilter === "high") {
      filteredUsers = filteredUsers.filter(
        (u) => (u.vendorRevenue || 0) > 20000
      );
    }
  }

  // Search filter
  if (search.trim()) {
    filteredUsers = filteredUsers.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const handleSeeProperty = async (vendor) => {
    const vendorProperty = await dispatch(
      fetchVendorProperty({ userId: vendor.userId })
    ).unwrap();

    const vendorPropertyRevenue = await dispatch(
      fetchVendorRevenue({ userId: vendor.userId })
    ).unwrap();

    if (vendorProperty?.data?.length > 0) {
      navigate("/vendor/property", {
        state: {
          vendorProperty,
          vendorId: vendor.userId,
          vendorPropertyRevenue,
          vendorName: vendor.name,
          vendorImage: vendor.userImage,
        },
      });
    } else {
      toast.warn("No property registered");
    }
  };

  const totalVendors = filteredUsers.length;
  const totalRevenue = filteredUsers.reduce(
    (sum, v) => sum + (v.vendorRevenue || 0),
    0
  );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Vendor Revenue Overview
      </h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Vendor Type Filter */}
        <PrettyDropdown
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "All Types" },
            { value: "1", label: "Type 1 Vendors" },
            { value: "0", label: "Type 0 Vendors" },
          ]}
          width="w-full"
        />

        {/* Revenue Filter */}
        <PrettyDropdown
          value={revenueFilter}
          onChange={setRevenueFilter}
          options={[
            { value: "all", label: "All Revenue Ranges" },
            { value: "low", label: "< ₹5,000" },
            { value: "mid", label: "₹5,000 - ₹20,000" },
            { value: "high", label: "> ₹20,000" },
          ]}
          width="w-full"
        />

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search vendor name..."
          className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
          <p className="text-gray-600 text-lg font-medium">Total Vendors</p>
          <h2 className="text-4xl font-extrabold text-blue-600 mt-2">
            {totalVendors}
          </h2>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
          <p className="text-gray-600 text-lg font-medium">
            Total Vendor Revenue
          </p>
          <h2 className="text-4xl font-extrabold text-green-600 mt-2">
            ₹{totalRevenue.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">
                Revenue
              </th>
              <th className="text-center p-4 font-semibold text-gray-700">
                See Details
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((vendor) => (
              <tr key={vendor._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{vendor.name}</td>

                <td className="p-4 text-green-600 font-semibold">
                  ₹{vendor.vendorRevenue?.toLocaleString() || 0}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => handleSeeProperty(vendor)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="p-6 text-center text-gray-500">No vendors found.</p>
        )}
      </div>
    </div>
  );
}
