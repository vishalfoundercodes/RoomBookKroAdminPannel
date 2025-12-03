// Users.jsx - Comprehensive user management page
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  Eye,
  X,
  Save,
  UserPlus,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  UserRound,
  Store,
  UserMinus,
  Send,
  Bell
} from 'lucide-react';
import  Card from '../../reusable_components/Card';
import  StatCard  from '../../reusable_components/StatCard';
import   DataTable from '../../reusable_components/DataTable';

import BarChartComponent from '../../reusable_components/BarChart';
import PieChartComponent from '../../reusable_components/PieChart';
import {apis} from '../../../utilities/apis';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import { signupUser } from "../../redux/slices/authSlice";
import { profileUpdate, profileDelete } from "../../redux/slices/profileSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { SiAutoprefixer } from 'react-icons/si';
import CustomDropdown from './CustomDropDown';
import StatusDropdown from './StatusDropdown';
import Loader from '../Loader/Loader';
import DOBDatePicker from './DOBDatePicker';
const UsersPage = () => {
    const navigate = useNavigate();
    const [dob, setDob] = useState("");
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector(
    (state) => state.profile
  );
  const { data: users, loading: usersLoading } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "2",
    location: "",
  });

  const formatDOB = (dob) => {
    if (!dob) return "";

    // Format 1 -> YYYY-MM-DD (valid)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return dob;
    }

    // Format 2 -> DD/MM/YYYY (convert to YYYY-MM-DD)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      const [dd, mm, yyyy] = dob.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }

    // Last fallback → avoid crash
    const d = new Date(dob);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };


    const onlyTypeOneUsers = users?.filter((u) => u.user_type == 2) || [];
  // Filter and search logic
 const filteredUsers = onlyTypeOneUsers.filter((user) => {
   const userDOB = formatDOB(user.DOB); // safe parsing

   const matchesDOB = dob === "" || userDOB === dob;

   const matchesSearch =
     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase());

   const matchesStatus =
     filterStatus === "All" || user.userStatus == filterStatus;

   const matchesRole = filterRole === "All" || user.user_type == filterRole;

   return matchesSearch && matchesStatus && matchesRole && matchesDOB;
 });


  // Statistics calculations
  // const totalUsers = users.length;
  const totalUsers = users.filter(
    (u) => u.user_type == "1" || u.user_type == "2"
  ).length;
  const activeUsers = users.filter((u) =>u.user_type == "2" && u.userStatus == "1").length;
  const pendingUsers = users.filter((u) => u.userStatus === "Pending").length;
  const inactiveUsers = users.filter(
    (u) => u.user_type == "2" && u.userStatus == "0"
  ).length;
const veryfiedVendor = users.filter(
  (u) => u.user_type === "1" && u.isVerified == "1"
).length;

const notVeryfiedVendor = users.filter(
  (u) => u.user_type === "1" && u.isVerified == "0"
).length;
const totalCustomer = users.filter(
  (u) => u.user_type === "2").length;
const totalVendor = users.filter(
  (u) => u.user_type === "1").length;
const activeVendor = users.filter(
  (u) => u.user_type == "1" && u.userStatus == "1"
).length;
const inActiveVendor = users.filter(
  (u) => u.user_type == "1" && u.userStatus == "0"
).length;


  // Chart data
  const userStatusData = [
    { name: "Active", value: activeUsers, color: "#10b981" },
    // { name: "Pending", value: pendingUsers, color: "#f59e0b" },
    { name: "Inactive", value: inactiveUsers, color: "#ef4444" },
  ];

  const Admin =users.filter((u)=>u.user_type==="0").length
  const vendor =users.filter((u)=>u.user_type==="1").length
  const Customer =users.filter((u)=>u.user_type==="2").length

  const userTypeData = [
    { name: "Admin", value: Admin, color: "#10b981" },
    { name: "vendor", value: vendor, color: "#f59e0b" },
    { name: "Customer", value: Customer, color: "#ef4444" },
  ];

  const userRoleData = [
    { name: "Jan", Admin: Admin, Manager: vendor, User: Customer },
    { name: "Feb", Admin: 6, Manager: 10, User: 52 },
    { name: "Mar", Admin: 7, Manager: 12, User: 58 },
    { name: "Apr", Admin: 8, Manager: 15, User: 65 },
    { name: "May", Admin: 9, Manager: 18, User: 72 },
    { name: "Jun", Admin: 10, Manager: 20, User: 80 },
  ];

  // Status color helper

  const getStatusdata = (status) => {
    const roles = {
      0: { label: "Inactive", color: "bg-purple-100 text-purple-800" },
      1: { label: "Active", color: "bg-blue-100 text-blue-800" },
    };
    return (
      roles[status] || {
        label: "Unknown",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };


  // Role color helper

  // Handle user actions
  const handleAddUser = () => {
    // prepare payload as per API
    const payload = {
      action: "signup",
      name: newUser.name,
      email: newUser.email,
      password: newUser.password, // ✅ need to add password field in form
      user_type: newUser.role, // ✅ map role to number: 0,1,2
      phone: newUser.phone,
      DOB: newUser.dob, // ✅ need to add DOB field in form
    };

    console.log("Payload to send:", payload);
    // ✅ Dispatch redux thunk
    dispatch(signupUser(payload));
    dispatch(fetchUsers());

    // reset form + close modal
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "2", // default User
      location: "",
      password: "",
      dob: "",
    });
    setShowAddModal(false);
  };

  const handleDeleteUser = (userId) => {
    console.log(userId)
    dispatch(profileDelete(userId));
  };

  const handleStatusChange = (userId, newStatus) => {
    console.log(userId, newStatus);
    const payload = {
      userStatus: newStatus,
    };

    dispatch(profileUpdate({ userId, payload }));
  };
  const handleVerificationChange = (userId, newStatus) => {
    console.log(userId, newStatus);
    const payload = {
      isVerified: newStatus,
    };
    console.log("payload:",payload)
    dispatch(profileUpdate({ userId, payload }));
  };

  const handleBulkAction = (action) => {
    if (action === "delete") {
      setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    } else if (action === "activate") {
      setUsers(
        users.map((u) =>
          selectedUsers.includes(u.id) ? { ...u, status: "Active" } : u
        )
      );
      setSelectedUsers([]);
    }
  };
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...selectedUser });

  // input change handle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // image change handle - Convert to Base64 or keep as URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file);

      // Convert file to Base64 for backend
      const reader = new FileReader();
     reader.onloadend = () => {
       setFormData((prev) => ({
         ...prev,
         userImage: reader.result, // ✅ Base64 string
         userImagePreview: previewUrl, // For display
       }));
     };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Create regular JSON payload (NOT FormData since backend expects JSON)
    const payload = {
      name: formData.name ?? selectedUser.name,
      email: formData.email ?? selectedUser.email,
      phone: formData.contact ?? selectedUser.phone,
      gender: formData.gender ?? selectedUser.gender,
      maritalStatus: formData.maritalStatus ?? selectedUser.maritalStatus,
      walletBalance: formData.walletBalance ?? selectedUser.walletBalance,
      occupation: formData.occupation ?? selectedUser.occupation,
    };

    // Only include userImage if it was changed
    if (formData.userImage && formData.userImage !== selectedUser.userImage) {
      payload.userImage = formData.userImage; // Base64 string or URL
    }

    console.log("Payload =>", payload);

    const userId = selectedUser.userId;
    dispatch(profileUpdate({ userId, payload }));

    setIsEditing(false);
    setShowViewModal(false);
  };

  useEffect(() => {
    if (success) {
      setFormData({}); // formData clear
    }
  }, [success]);

  // Update the image display in your modal to use userImagePreview
const handleSendNotification = (user) => {
    // Navigate to Notification page with userId as param or state
    navigate(`/notification/${user}`); // Option 1: via URL param
    // OR
    // navigate("/notification", { state: { user } }); // Option 2: via state
  };

  // --- Birth Month Chart Data (from DOB field) ---
const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const barColors = [
  "#3b82f6", // Jan - Blue
  "#10b981", // Feb - Green
  "#f59e0b", // Mar - Amber
  "#ef4444", // Apr - Red
  "#8b5cf6", // May - Purple
  "#06b6d4", // Jun - Cyan
  "#ec4899", // Jul - Pink
  "#22c55e", // Aug - Lime
  "#eab308", // Sep - Yellow
  "#0ea5e9", // Oct - Sky
  "#6366f1", // Nov - Indigo
  "#14b8a6", // Dec - Teal
];


const parseDOB = (dobString) => {
  if (!dobString) return null;

  // Supports "DD-MM-YYYY" or "DD/MM/YYYY"
  const parts = dobString.includes("-")
    ? dobString.split("-")
    : dobString.split("/");

  if (parts.length !== 3) return null;

  const [day, month, year] = parts;

  return new Date(`${year}-${month}-${day}`); // Convert -> YYYY-MM-DD
};


// Count users by their birth month
const birthMonthCount = Array(12).fill(0);

users.forEach((u) => {
  const date = parseDOB(u.DOB);
  if (!date || isNaN(date)) return;

  const m = date.getMonth(); // 0-11
  birthMonthCount[m] += 1;
});


// Convert to chart-friendly format
const birthMonthData = monthNames.map((m, i) => ({
  name: m,
  value: birthMonthCount[i],
}));



      const location = useLocation();
      const [highlight, setHighlight] = useState("");
      useEffect(() => {
        if (location.state?.highlight) {
          setHighlight(location.state.highlight);

          const timer = setTimeout(() => {
            setHighlight("");
          }, 1200);

          return () => clearTimeout(timer);
        }
      }, [location.state]);



    if (usersLoading || loading) {
      return <Loader />;
    }

  return (
    <div className="flex-1 p-2 overflow-x-hidden">
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                Customer Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Manage and monitor all users in your system
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {/* Total Users */}
          {/* <StatCard
            title="Total Users"
            value={totalUsers.toString()}
            change="+12 this month"
            changeType="positive"
            icon={Users}
            color="blue"
          /> */}

          {/* Total Customers */}
          {/* <StatCard
            title="Total Customers"
            value={totalCustomer.toString()}
            change="Customer base growing steadily"
            changeType="positive"
            icon={UserRound}
            color="green"
          /> */}
          <div
            className={`transition-all duration-300 
    ${highlight == "Total Customers" ? "animate-bounce" : ""}
  `}
          >
            <div
              className="
      p-4 sm:p-6 
      bg-gradient-to-r from-blue-500 to-purple-600
      rounded-xl sm:rounded-2xl 
      shadow-lg text-white 
      flex items-center justify-between 
      cursor-pointer
    "
            >
              <div>
                <p className="text-xs sm:text-sm opacity-80">Total Customers</p>
                <h2 className="text-sm sm:text-3xl font-bold mt-1">
                  {totalCustomer}
                </h2>
              </div>

              <UserRound className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
            </div>
          </div>

          {/* Active Customers */}
          {/* <StatCard
            title="Active Customers"
            value={activeUsers.toString()}
            change={`${((activeUsers / totalUsers) * 100).toFixed(
              1
            )}% active users`}
            changeType="positive"
            icon={UserCheck}
            color="green"
          /> */}
          <div
            className={`transition-all duration-300 
    ${highlight == "Active Customers" ? "animate-bounce" : ""}
  `}
          >
            <div
              className="
      p-4 sm:p-6 
      bg-gradient-to-r from-green-500 to-emerald-600
      rounded-xl sm:rounded-2xl 
      shadow-lg text-white 
      flex items-center justify-between 
      cursor-pointer
    "
            >
              <div>
                <p className="text-xs sm:text-sm opacity-80">
                  Active Customers
                </p>
                <h2 className="text-sm sm:text-3xl font-bold mt-1">
                  {activeUsers}
                </h2>
              </div>

              <UserCheck className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
            </div>
          </div>

          {/* Inactive Customers */}
          {/* <StatCard
            title="Inactive Customers"
            value={inactiveUsers.toString()}
            change="Re-engagement recommended"
            changeType="negative"
            icon={UserMinus}
            color="red"
          /> */}
          <div
            className={`transition-all duration-300 
    ${highlight == "Inactive Customers" ? "animate-bounce" : ""}
  `}
          >
            <div
              className="
      p-4 sm:p-6 
      bg-gradient-to-r from-gray-600 to-red-500
      rounded-xl sm:rounded-2xl 
      shadow-lg text-white 
      flex items-center justify-between 
      cursor-pointer
    "
            >
              <div>
                <p className="text-xs sm:text-sm opacity-80">
                  Inactive Customers
                </p>
                <h2 className="text-sm sm:text-3xl font-bold mt-1">
                  {inactiveUsers}
                </h2>
              </div>

              <UserMinus className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
          <PieChartComponent
            title="User Status Distribution"
            data={userStatusData}
            height={250}
          />
          <div className="lg:col-span-1">
            <BarChartComponent
              title="Birth Month Distribution"
              data={birthMonthData}
              bars={[
                {
                  dataKey: "value",
                  name: "Births",
                  colors: barColors, // <-- IMPORTANT
                },
              ]}
              height={280}
            />
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <StatusDropdown
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
              {/* <CustomDropdown
              value={filterRole}
              onChange={(val) => setFilterRole(val)}
            /> */}

              <DOBDatePicker value={dob} onChange={setDob} />
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-blue-700">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("activate")}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map((u) => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Customer Id
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    notification
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    DOB
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== user.id)
                            );
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {user.userId}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      /> */}
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-black">
                          <Phone className="w-4 h-4 text-violet-800" />
                          {user.phone}
                        </div>
                        {/* <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        {user.location}
                      </div> */}
                      </div>
                    </td>
                    {/* <td className="py-3 px-4 cursor-pointer">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getRoleData(user.user_type).color
                        }`}
                      >
                        {getRoleData(user.user_type).label}
                      </span>
                    </td> */}
                    <td>
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleSendNotification(user.userId)}
                          className="flex items-center justify-center w-10 h-10 rounded-full 
                 bg-green-400 backdrop-blur-sm text-white shadow-lg 
                 hover:bg-blue-500 hover:scale-110 hover:shadow-xl 
                 transition-all duration-200"
                        >
                          <Bell className="w-5 h-5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={user.userStatus}
                        onChange={(e) =>
                          handleStatusChange(user.userId, e.target.value)
                        }
                        className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                          getStatusdata(user.userStatus).color
                        }
`}
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </td>
                    {/* <td className="py-3 px-4">
                      <select
                        disabled={user.user_type !== "1"}
                        value={user.isVerified}
                        onChange={(e) =>
                          handleVerificationChange(user.userId, e.target.value)
                        }
                        className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                          getVeryfydata(user.isVerified).color
                        }
                          ${
                            user.user_type != "1"
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer"
                          }
`}
                      >
                        <option value="true">Veryfied</option>
                        <option value="false">Not Veryfied</option>
                      </select>
                    </td> */}
                    <td className="py-3 px-4 text-sm text-black">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        {user.DOB}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowViewModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="View User"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button> */}
                        <button
                          onClick={() => handleDeleteUser(user.userId)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-500 font-medium">No users found</h3>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </Card>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add New Customer
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newUser.password || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={newUser.dob || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, dob: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={newUser.phone}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="hidden">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="2">User</option>
                      <option value="1">Vendor</option>
                      <option value="0">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newUser.location}
                      onChange={(e) =>
                        setNewUser({ ...newUser, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Add Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View User Modal */}
        {showViewModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-3">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? "Edit User" : "User Details"}
                </h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setShowViewModal(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-8">
                {/* Profile */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative">
                    <img
                      src={
                        formData.userImagePreview ||
                        formData.userImage ||
                        selectedUser.userImage
                      }
                      alt={formData.name}
                      className="w-24 h-24 rounded-full object-cover border shadow"
                    />
                    {isEditing && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute top-0 left-0 w-24 h-24 opacity-0 cursor-pointer"
                      />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="text-xl font-semibold border rounded-lg px-3 py-2 w-full"
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="text-gray-600 border rounded-lg px-3 py-2 w-full"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {selectedUser.name}
                        </h3>
                        <p className="text-gray-600">{selectedUser.email}</p>
                      </>
                    )}
                  </div>
                </div>

                <hr />

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Contact */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      {/* Phone */}
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="border rounded-lg px-3 py-2 w-full"
                          />
                        ) : (
                          <span>{selectedUser.phone}</span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedUser.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Account */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Account Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      {/* DOB */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="date"
                            name="DOB"
                            value={formData.DOB || ""}
                            onChange={handleChange}
                            className="border rounded-lg px-3 py-2 w-full"
                          />
                        ) : (
                          <span>DOB: {selectedUser.DOB}</span>
                        )}
                      </div>

                      {/* Wallet */}
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="number"
                            name="walletBalance"
                            value={formData.walletBalance}
                            onChange={handleChange}
                            className="border rounded-lg px-3 py-2 w-full"
                          />
                        ) : (
                          <span>
                            Wallet Balance: {selectedUser.walletBalance}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 py-4 border-t flex flex-wrap gap-3 justify-end">
                {/* Close */}
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setShowViewModal(false);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>

                {/* Edit / Save */}
                {isEditing ? (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm"
                  >
                    Save Changes
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit User
                    </button>
                    {/* New Button → See All Bookings */}
                    <button
                      onClick={() => {
                        navigate(`/customer/booking`, {
                          state: {
                            userId: selectedUser.userId,
                            userName: selectedUser.name,
                            userImage: selectedUser.userImage,
                          },
                        });
                        console.log("userImage", selectedUser.name);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      See All Bookings
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;