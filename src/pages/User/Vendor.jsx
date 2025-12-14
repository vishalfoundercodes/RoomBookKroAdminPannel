// Users.jsx - Comprehensive user management page
import React, { useEffect, useState } from "react";
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
  Bell,
  IdCard,
  CreditCard,
  Landmark,
  Stamp,
  BookUser,
  TrendingUp,
} from "lucide-react";
import Card from "../../reusable_components/Card";
import StatCard from "../../reusable_components/StatCard";
import DataTable from "../../reusable_components/DataTable";

import BarChartComponent from "../../reusable_components/BarChart";
import PieChartComponent from "../../reusable_components/PieChart";
import { apis } from "../../../utilities/apis";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import { signupUser } from "../../redux/slices/authSlice";
import { profileUpdate, profileDelete } from "../../redux/slices/profileSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { SiAutoprefixer } from "react-icons/si";
import CustomDropdown from "./CustomDropDown";
import StatusDropdown from "./StatusDropdown";
import Loader from "../Loader/Loader";
import DOBDatePicker from "./DOBDatePicker";
import VendorViewModal from "./VendorViewModal";
import VendorAddModal from "./VendorAddModal";
const VendorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

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
  const [dob, setDob] = useState("");

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "1",
    location: "",
    adharNumber: "",
    panNumber: "",
    adharFront: "",
    adharBack: "",
    panImage: "",
    fcmToken:"fA9uHmp4QWEREXAMPLE67890:APA91bE8LkPpEXAMPLEY0Gk7R1JhZ9tEXAMPLEXqnDSfjQOCa3mF4f8jY2hP9JqT2Lk5rAfUwBsEXAMPLE",
  });

  const onlyTypeOneUsers = users?.filter((u) => u.user_type == 1) || [];

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
  // Filter and search logic
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
  const activeUsers = users.filter(
    (u) => u.user_type == "2" && u.userStatus == "1"
  ).length;
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
  const totalCustomer = users.filter((u) => u.user_type === "2").length;
  const totalVendor = users.filter((u) => u.user_type === "1").length;
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

  const verifyVendorCount = users.filter((u) => u.isVerified === true).length;
  const unverifyVendorCount = users.filter(
    (u) => u.isVerified === false
  ).length;

  const vendorVerify = [
    { name: "Verified Vendor", value: verifyVendorCount, color: "#10b981" },
    { name: "UnVerified Vendor", value: unverifyVendorCount, color: "#f59e0b" },
  ];



  // Status color helper
  const getStatusColor = (status) => {
    const colors = {
      0: "bg-red-100 text-red-800",
      1: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

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
  const getVeryfydata = (status) => {
    const roles = {
      false: { label: "Inactive", color: "bg-purple-100 text-purple-800" },
      true: { label: "Active", color: "bg-blue-100 text-blue-800" },
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
  const handleAddUser = async() => {
    // prepare payload as per API
    try {
      setSubmitting(true);
      const payload = {
        action: "signup",
        name: newUser.name,
        email: newUser.email,
        password: newUser.password, // ✅ need to add password field in form
        user_type: "1", // ✅ map role to number: 0,1,2
        phone: newUser.phone,
        DOB: newUser.dob, // ✅ need to add DOB field in form
        adharNumber: newUser.adharNumber,
        panNumber: newUser.panNumber,
        adharFront: newUser.adharFront,
        adharBack: newUser.adharBack,
        panImage: newUser.panImage,
        fcmToken: newUser.fcmToken,
      };

      console.log("Payload to send:", payload);
      // ✅ Dispatch redux thunk
      // await dispatch(signupUser(payload));
      // await dispatch(fetchUsers());
      // ✅ 1. signup complete hone ka wait
      await dispatch(signupUser(payload)).unwrap();

      // ✅ 2. users fetch hone ka wait
      await dispatch(fetchUsers()).unwrap();

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
    } catch (error) {
      console.error("Add user failed:", error);
    }finally{
        setSubmitting(false);
    }
  };

  const handleDeleteUser = (userId) => {
    console.log(userId);
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
    console.log("payload:", payload);
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
  // In your JSX:
  // <img
  //   src={formData.userImagePreview || formData.userImage || selectedUser.userImage}
  //   alt={formData.name}
  //   className="w-20 h-20 rounded-full object-cover"
  // />
  const handleSendNotification = (user) => {
    // Navigate to Notification page with userId as param or state
    navigate(`/notification/${user}`); // Option 1: via URL param
    // OR
    // navigate("/notification", { state: { user } }); // Option 2: via state
  };

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

  if (usersLoading || loading || submitting) {
    return <Loader />;
  }

return (
  <div className="flex-1 overflow-hidden mt-4 rounded-xl">
    {" "}
    {/* p-2 remove kiya, overflow-hidden add kiya */}
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header - Same */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
              Vendor Management
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
              Add Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {/* <div
          className={` ${
            highlight == "Total Vendors" ? "animate-bounce bg-yellow-100" : ""
          }`}
        >
          <StatCard
            title="Total Vendors"
            value={totalVendor.toString()}
            change="Vendor network expanding"
            changeType="positive"
            icon={Store}
            color="#E3F2FD"
          />
        </div> */}
        <div
          className={`transition-all duration-300 
    ${highlight == "Total Vendors" ? "animate-bounce" : ""}
  `}
        >
          <div
            className="
      p-4 sm:p-6 
      bg-gradient-to-r from-blue-500 to-blue-600 
      rounded-xl sm:rounded-2xl 
      shadow-lg text-white 
      flex items-center justify-between 
      cursor-pointer
    "
          >
            {/* LEFT SIDE CONTENT */}
            <div>
              <p className="text-xs sm:text-sm opacity-80">Total Vendors</p>
              <h2 className="text-sm sm:text-3xl font-bold mt-1">
                {totalVendor}
              </h2>
            </div>

            {/* ICON */}
            <Store className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
          </div>
        </div>

        {/* <StatCard
          title="Verified Vendors"
          value={veryfiedVendor.toString()}
          change="Trusted & verified vendors"
          changeType="positive"
          icon={ShieldCheck}
          color="green"
        /> */}

        <div
          className={`transition-all duration-300 
    ${highlight == "Verified Vendors" ? "animate-bounce" : ""}
  `}
        >
          {" "}
          <div
            className={`
    p-4 sm:p-6 
    bg-gradient-to-r from-green-500 to-emerald-600
    rounded-xl sm:rounded-2xl 
    shadow-lg text-white 
    flex items-center justify-between 
    cursor-pointer
  `}
          >
            <div>
              <p className="text-xs sm:text-sm opacity-80">Verified Vendors</p>
              <h2 className="text-sm sm:text-3xl font-bold mt-1">
                {veryfiedVendor}
              </h2>
            </div>

            <ShieldCheck className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
          </div>
        </div>

        {/* <StatCard
          title="Unverified Vendors"
          value={notVeryfiedVendor.toString()}
          change="Verification required"
          changeType="negative"
          icon={ShieldAlert}
          color="red"
        /> */}

        <div
          className={`transition-all duration-300 
    ${highlight == "Unverified Vendors" ? "animate-bounce" : ""}
  `}
        >
          <div
            className={`
    p-4 sm:p-6 
    bg-gradient-to-r from-red-500 to-orange-600
    rounded-xl sm:rounded-2xl 
    shadow-lg text-white 
    flex items-center justify-between 
    cursor-pointer
  `}
          >
            <div>
              <p className="text-xs sm:text-sm opacity-80">
                Unverified Vendors
              </p>
              <h2 className="text-sm sm:text-3xl font-bold mt-1">
                {notVeryfiedVendor}
              </h2>
            </div>

            <ShieldAlert className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
          </div>
        </div>

        {/* <StatCard
          title="Active Vendors"
          value={activeVendor.toString()}
          change="Vendors actively serving"
          changeType="positive"
          icon={Store}
          color="green"
        /> */}

        <div
          className={`transition-all duration-300 
    ${highlight == "Active Vendors" ? "animate-bounce" : ""}
  `}
        >
          {" "}
          <div
            className={`
    p-4 sm:p-6 
    bg-gradient-to-r from-purple-500 to-indigo-600
    rounded-xl sm:rounded-2xl 
    shadow-lg text-white 
    flex items-center justify-between 
    cursor-pointer
  `}
          >
            <div>
              <p className="text-xs sm:text-sm opacity-80">Active Vendors</p>
              <h2 className="text-sm sm:text-3xl font-bold mt-1">
                {activeVendor}
              </h2>
            </div>

            <Store className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
          </div>
        </div>

        {/* <StatCard
          title="Inactive Vendors"
          value={inActiveVendor.toString()}
          change="Vendor not active currently"
          changeType="negative"
          icon={SiAutoprefixer}
          color="red"
        /> */}

        <div
          className={`transition-all duration-300 
    ${highlight == "Inactive Vendors" ? "animate-bounce" : ""}
  `}
        >
          <div
            className={`
    p-4 sm:p-6 
    bg-gradient-to-r from-gray-500 to-blue-500
    rounded-xl sm:rounded-2xl 
    shadow-lg text-white 
    flex items-center justify-between 
    cursor-pointer
  `}
          >
            <div>
              <p className="text-xs sm:text-sm opacity-80">Inactive Vendors</p>
              <h2 className="text-sm sm:text-3xl font-bold mt-1">
                {inActiveVendor}
              </h2>
            </div>

            <SiAutoprefixer className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
        <PieChartComponent
          title="Vendor Status Distribution"
          data={userStatusData}
          height={250}
        />
        <div className="lg:col-span-1">
          <PieChartComponent
            title="Vendor Growth by verification"
            data={vendorVerify}
            height={250}
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
          <StatusDropdown
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
          <CustomDropdown
            value={filterRole}
            onChange={(val) => setFilterRole(val)}
          />
          <DOBDatePicker value={dob} onChange={setDob} />
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

      {/* Users Table - MAIN FIX */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                {/* <th className="text-left py-3 px-4 whitespace-nowrap">
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
                </th> */}
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Vendor Id
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Vendor
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Contact
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Notification
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Adhar Number
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Pan Number
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Verify Vendor
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Vendor Revenue
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  DOB
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
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
                  {/* <td className="py-3 px-4 whitespace-nowrap">
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
                  </td> */}
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {user.userId}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
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
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-black">
                        <Phone className="w-4 h-4 text-violet-800" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleSendNotification(user.userId)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-400 backdrop-blur-sm text-white shadow-lg hover:bg-blue-500 hover:scale-110 hover:shadow-xl transition-all duration-200"
                      >
                        <Bell className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-black">
                        <IdCard className="w-5 h-5 text-blue-800" />
                        {user.adharNumber}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-black">
                        <BookUser className="w-5 h-5 text-orange-700" />
                        {user.panNumber}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <select
                      value={user.userStatus}
                      onChange={(e) =>
                        handleStatusChange(user.userId, e.target.value)
                      }
                      className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                        getStatusdata(user.userStatus).color
                      }`}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <select
                      disabled={user.user_type !== "1"}
                      value={user.isVerified}
                      onChange={(e) =>
                        handleVerificationChange(user.userId, e.target.value)
                      }
                      className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                        getVeryfydata(user.isVerified).color
                      } ${
                        user.user_type != "1"
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                    >
                      <option value="true">Verified</option>
                      <option value="false">Not Verified</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm text-black whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      {user.vendorRevenue}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-black whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      {user.DOB}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
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
        <VendorAddModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
          newUser={newUser}
          setNewUser={setNewUser}
        />
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <VendorViewModal
          show={showViewModal}
          setShowViewModal={setShowViewModal}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          formData={formData}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          selectedUser={selectedUser}
        />
      )}
    </div>
  </div>
);
};

export default VendorPage