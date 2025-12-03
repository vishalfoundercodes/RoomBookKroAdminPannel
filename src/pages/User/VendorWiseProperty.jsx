import React, { useEffect, useState } from 'react';
import { Users, Search, Plus, Download, Upload, Edit, Trash2, Mail, Phone, MapPin, Calendar, UserCheck, UserX, Eye, X, Globe, Home, Building, Building2, Hotel, ShieldCheck } from 'lucide-react';
import Card from '../../reusable_components/Card';
import StatCard from '../../reusable_components/StatCard';
import PieChartComponent from '../../reusable_components/PieChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperty, addProperty, deleteProperty,editProperty, fetchVendorProperty } from '../../redux/slices/propertySlice';
import { toast } from 'react-toastify';
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import Loader from '../Loader/Loader';
import commisionIcon from "../../../src/assets/commision.png"
import verifyIcon from "../../../src/assets/verify.png";
import ViewProperty from "../Property/viewProperty";
import AddProperty from "../Property/AddProperty";
import EditPropertyModal from '../Property/EditPropertyModal';
import CustomVerificationDropdown from '../Property/CustomVerify';
import CustomPropertyTypeDropdown from "../Property/CustomPropertyDropDown";
import CustomAvailabilityDropdown from '../Property/CustomAvailableDropdown';
import { useLocation, useNavigate } from "react-router-dom";
  import { useParams } from "react-router-dom";
import NewStatCard from './Newstate';

const PropertyPage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [manualLocation, setManualLocation] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState({ lat: 0, lng: 0 });

  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.property);

  const [properties, setProperties] = useState([]);
  const [propertiesDetails, setPropertiesDetails] = useState(null);
  const [revenueDetaiils, setRevenueDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPropertyStatus, setFilterPropertyStatus] = useState("All");
  const [verificationStatus, setFilterVerificationStatus] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const vendorWiseProperty = location.state?.vendorProperty || [];
  const vendorPropertyRevenue = location.state?.vendorPropertyRevenue || [];
  const vendorName = location.state?.vendorName;
  const vendorImage = location.state?.vendorImage;
  const vendorId = location.state?.vendorId;

  const { vendorId: vendorParamId } = useParams();
  // useEffect(() => {
  //   console.log("property get 1:", vendorWiseProperty);
  //   console.log("property get revenue:", vendorPropertyRevenue);
  //   console.log("property get 2:", vendorWiseProperty?.data);
  //   if (vendorWiseProperty?.data.length > 0) {
  //     console.log("property get 3:", vendorWiseProperty?.data);
  //     setProperties(vendorWiseProperty?.data);
  //     setPropertiesDetails(vendorWiseProperty)
  //     setRevenueDetails(vendorPropertyRevenue);
  //     console.log("vendor revenue:", vendorWiseProperty?.totalVendorRevenue);
  //   } else {
  //     // fallback if direct access without state
  //     dispatch(fetchProperty()).then((res) => {
  //       setProperties(res.payload || []);
  //     });
  //   }
  // }, []);
  useEffect(() => {
    const stateData = vendorWiseProperty?.data;

    // Case 1 — Coming from previous page
    if (Array.isArray(stateData) && stateData.length > 0) {
      setProperties(vendorWiseProperty.data);
      setPropertiesDetails(vendorWiseProperty);
      setRevenueDetails(vendorPropertyRevenue);
      return;
    }

    // Case 2 — Refresh OR direct URL load
    if (vendorParamId) {
      dispatch(fetchVendorProperty({ userId: vendorParamId })).then((res) => {
        setProperties(res.payload?.data || []);
        setPropertiesDetails(res.payload);
      });

      dispatch(fetchVendorRevenue({ userId: vendorParamId })).then((res) => {
        setRevenueDetails(res.payload || null);
      });

      return;
    }

    // Case 3 — No ID at all → fallback
    dispatch(fetchProperty()).then((res) => {
      setProperties(res.payload || []);
    });
  }, []);

  useEffect(() => {
    if (manualLocation) {
      import("leaflet").then((L) => {
        if (window._manualMap) {
          window._manualMap.remove();
        }

        const map = L.map("map").setView(
          [selectedCoords.lat, selectedCoords.lng],
          5
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        let marker = L.marker([selectedCoords.lat, selectedCoords.lng]).addTo(
          map
        );

        map.on("click", (e) => {
          const { lat, lng } = e.latlng;
          setSelectedCoords({ lat, lng });
          if (marker) map.removeLayer(marker);
          marker = L.marker([lat, lng]).addTo(map);
        });

        window._manualMap = map;
        window._manualMarker = marker;
      });
    }
  }, [manualLocation]);

  const filteredProperty = Array.isArray(properties)
    ? properties.filter((user) => {
        const matchesSearch =
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          filterStatus === "All" ||
          (filterStatus === "Active" && user.isAvailable === true) ||
          (filterStatus === "Inactive" && user.isAvailable === false);

        const matchesPropertyType =
          filterPropertyStatus === "All" ||
          user.type?.toLowerCase() == filterPropertyStatus.toLowerCase();

        const matchesPropertyVerification =
          verificationStatus === "All" ||
          (verificationStatus === "true" && user.verifyProperty === true) ||
          (verificationStatus === "false" && user.verifyProperty === false);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPropertyType &&
          matchesPropertyVerification
        );
      })
    : [];

  const totalProperty = propertiesDetails?.propertyCount || 0;
  const vendorRevenue = revenueDetaiils?.totalVendorRevenue || 0;
  const activeProperty =
    filteredProperty?.filter((u) => u.isAvailable === true).length || 0;
  const inactiveProperty =
    filteredProperty?.filter((u) => u.isAvailable === false).length || 0;
  const verifyPropertyCount =
    filteredProperty?.filter((u) => u.verifyProperty === true).length || 0;
  const notVerifyPropertyCount =
    filteredProperty?.filter((u) => u.verifyProperty === false).length || 0;
  const pgCount = filteredProperty?.filter((u) => u.type === "pg").length || 0;
  const hotelCount =
    filteredProperty?.filter((u) => u.type == "hotel" || u.type == "Hotel")
      .length || 0;
  const AppartmentCount =
    filteredProperty?.filter((u) => u.type == "appartment").length || 0;
  const dormitaryCount =
    filteredProperty?.filter((u) => u.type == "dormitary").length || 0;

  const PropertytatusData = [
    { name: "Available", value: activeProperty, color: "#10b981" },
    { name: "Unavailable", value: inactiveProperty, color: "#ef4444" },
  ];

  const PropertyVerifiction = [
    { name: "Verify", value: verifyPropertyCount, color: "#10b981" },
    { name: "Unverify", value: notVerifyPropertyCount, color: "#ef4444" },
  ];

  const handleDeleteUser = async (id, userId) => {
    if (!id) {
      toast.error("Invalid property ID!");
      return;
    }

    dispatch(deleteProperty(id))
      .unwrap()
      .then(() => {
        toast.success("Property deleted successfully!");
      })
      .catch((error) => {
        console.error("Delete Error:", error);
        toast.error("Failed to delete property!");
      });
    const response = await dispatch(fetchVendorProperty({ userId }));

    // 🔥 Update properties state with latest fetched data
    if (response?.payload?.data) {
      console.log("response after success:", response?.payload?.data);
      setProperties(response.payload.data);
    }
  };

  // ---------------date convert from UTC to IST----------------
  const formatToIST = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleAvailabilityChange = async (id, value, userId) => {
    try {
      setIsUploading(true);
      const payload = {
        residenceId: id,
        isAvailable: value === "true",
      };

      await dispatch(editProperty({ id, payload }));
      const response = await dispatch(fetchVendorProperty({ userId }));

      // 🔥 Update properties state with latest fetched data
      if (response?.payload?.data) {
        console.log("response after success:", response?.payload?.data);
        setProperties(response.payload.data);
      }
    } catch (error) {
      console.error("❌ Error updating availability:", error);
      toast.error("Failed to update availability");
    } finally {
      setIsUploading(false);
    }
  };

  const [editCommissionId, setEditCommissionId] = useState(null);
  const [editVerifyIconId, setEditVerifyIconId] = useState(null);
  const [verifyProperty, setVerifyProperty] = useState(null);
  const [commissionValue, setCommissionValue] = useState("");

  const handleverifyPropertyChange = async (id, value, userId) => {
    try {
      setIsUploading(true);
      const payload = {
        residenceId: id,
        verifyProperty: value === "true",
      };

      await dispatch(editProperty({ id, payload }));
      const response = await dispatch(fetchVendorProperty({ userId }));

      // 🔥 Update properties state with latest fetched data
      if (response?.payload?.data) {
        console.log("response after success:", response?.payload?.data);
        setProperties(response.payload.data);
      }
    } catch (error) {
      console.error("❌ Error updating availability:", error);
      toast.error("Failed to update availability");
    } finally {
      setIsUploading(false);
    }
  };
  const handleCommissionChange = async (id, value, userId) => {
    try {
      const payload = {
        residenceId: id,
        commision: Number(value),
      };
      await dispatch(editProperty({ id, payload }));
      const response = await dispatch(fetchVendorProperty({ userId }));

      // 🔥 Update properties state with latest fetched data
      if (response?.payload?.data) {
        console.log("response after success:", response?.payload?.data);
        setProperties(response.payload.data);
      }
    } catch {
      toast.error("Invalid commission value");
      return;
    }
  };

  const renderAmenityOrRule = (item) => {
    if (typeof item === "string") {
      return item;
    } else if (typeof item === "object" && item !== null) {
      return item.name || JSON.stringify(item);
    }
    return String(item);
  };

  // VendorWiseProperty.jsx me ye function add karo

  // Calculate revenue for each property based on residencyId
  const getPropertyRevenue = (residencyId) => {
    if (!vendorPropertyRevenue?.revenueList) return 0;

    return vendorPropertyRevenue.revenueList
      .filter((revenue) => revenue.residencyId === residencyId)
      .reduce((total, revenue) => total + (revenue.vendorRevenue || 0), 0);
  };

  // Format revenue in Indian currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // VendorWiseProperty.jsx me ye state add karo (existing states ke saath)
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPropertyBookings, setSelectedPropertyBookings] = useState([]);
  const [selectedPropertyName, setSelectedPropertyName] = useState("");

  // Booking details modal open karne ka function
  const handleBookingClick = (property) => {
    const bookings =
      vendorPropertyRevenue?.revenueList?.filter(
        (r) => r.residencyId === property.residencyId
      ) || [];

    if (bookings.length > 0) {
      setSelectedPropertyBookings(bookings);
      setSelectedPropertyName(property.name);
      setShowBookingModal(true);
    }
  };

  // Date format function
  const formatBookingDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights;
  };

  if (isUploading || loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-4 rounded-[15px]">
      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className=" mb-2 cursor-pointer" onClick={() => navigate(-1)}>
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="8" fill="#2563EB" />
                <path
                  d="M28 31.202L26.2153 33L16.4945 23.2009C16.3378 23.0439 16.2134 22.8572 16.1285 22.6515C16.0437 22.4459 16 22.2253 16 22.0025C16 21.7798 16.0437 21.5592 16.1285 21.3536C16.2134 21.1479 16.3378 20.9612 16.4945 20.8042L26.2153 11L27.9983 12.798L18.8746 22L28 31.202Z"
                  fill="white"
                />
              </svg>
            </div>
            <img
              src={vendorImage}
              alt="profile image"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-fill shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 -mt-1">
                {vendorName}'s Property
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor all Property in your system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {/* <StatCard
          title="Total Property"
          value={totalProperty.toString()}
          change="+12 this month"
          changeType="positive"
          icon={Home}
          color="blue"
          route="/vendor/property"
        />

        <StatCard
          title="Available Property"
          value={activeProperty.toString()}
          change={`${
            totalProperty > 0
              ? ((activeProperty / totalProperty) * 100).toFixed(1)
              : 0
          }% available`}
          changeType="positive"
          icon={UserCheck}
          color="green"
        />

        <StatCard
          title="Not Available Property"
          value={inactiveProperty.toString()}
          change="Unavailable currently"
          changeType="negative"
          icon={UserX}
          color="red"
        />

        <StatCard
          title="Not Verified Property"
          value={notVerifyPropertyCount.toString()}
          change="Verification pending"
          changeType="warning"
          icon={ShieldCheck}
          color="yellow"
        />

        <StatCard
          title="Verified Property"
          value={verifyPropertyCount.toString()}
          change="Verified successfully"
          changeType="positive"
          icon={ShieldCheck}
          color="green"
        />

        <StatCard
          title="Hotel Property"
          value={hotelCount.toString()}
          change="Hotel listings"
          changeType="neutral"
          icon={Hotel}
          color="purple"
        />

        <StatCard
          title="PG Property"
          value={pgCount.toString()}
          change="PG listings"
          changeType="neutral"
          icon={Building2}
          color="indigo"
        />

        <StatCard
          title="Apartment Property"
          value={AppartmentCount.toString()}
          change="Apartment listings"
          changeType="neutral"
          icon={Building}
          color="cyan"
        />

        <StatCard
          title="Dormitory Property"
          value={dormitaryCount.toString()}
          change="Dorm listings"
          changeType="neutral"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Total Revenue"
          value={vendorRevenue.toString()}
          change="Dorm listings"
          changeType="neutral"
          icon={Users}
          color="teal"
          route="/vendor/property"
        /> */}
        <NewStatCard
          title="Total Property"
          value={totalProperty}
          icon={Home}
          // route="/vendor/property"
          gradient="from-blue-700 to-cyan-500"
        />

        <NewStatCard
          title="Available Property"
          value={activeProperty}
          icon={UserCheck}
          gradient="from-green-700 to-lime-500"
        />

        <NewStatCard
          title="Not Available Property"
          value={inactiveProperty}
          icon={UserX}
          gradient="from-red-700 to-orange-500"
        />

        <NewStatCard
          title="Not Verified Property"
          value={notVerifyPropertyCount}
          icon={ShieldCheck}
          gradient="from-yellow-600 to-amber-400"
        />

        <NewStatCard
          title="Verified Property"
          value={verifyPropertyCount}
          icon={ShieldCheck}
          gradient="from-emerald-700 to-green-500"
        />

        <NewStatCard
          title="Hotel Property"
          value={hotelCount}
          icon={Hotel}
          gradient="from-purple-700 to-pink-500"
        />

        <NewStatCard
          title="PG Property"
          value={pgCount}
          icon={Building2}
          gradient="from-indigo-700 to-violet-500"
        />

        <NewStatCard
          title="Apartment Property"
          value={AppartmentCount}
          icon={Building}
          gradient="from-cyan-700 to-blue-400"
        />

        <NewStatCard
          title="Dormitory Property"
          value={dormitaryCount}
          icon={Users}
          gradient="from-teal-700 to-emerald-500"
        />

        <NewStatCard
          title="Total Revenue"
          value={vendorRevenue}
          icon={Users}
          // route="/vendor/property"
          gradient="from-rose-700 to-pink-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
        <PieChartComponent
          title="Property Status Distribution"
          data={PropertytatusData}
          height={300}
        />
        <PieChartComponent
          title="Property Verification Distribution"
          data={PropertyVerifiction}
          height={300}
        />
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Property by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <CustomVerificationDropdown
            value={verificationStatus}
            onChange={setFilterVerificationStatus}
          />
          <CustomPropertyTypeDropdown
            value={filterPropertyStatus}
            onChange={setFilterPropertyStatus}
          />
          <CustomAvailabilityDropdown
            value={filterStatus}
            onChange={setFilterStatus}
          />
        </div>
      </Card>

      {/* Property Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 whitespace-nowrap">
                <th className="text-left py-3 px-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Property name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Property type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Contact
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Register Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Commission
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Verify
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Rating
                </th>
                {/* 👇 New Revenue Column */}
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Vendor Revenue
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProperty?.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-black">
                        <Phone className="w-4 h-4 text-violet-800" />
                        {user.contactNumber}
                      </div>
                      <div className="flex items-center gap-1 text-black mt-1">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        {user.city}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={user.isAvailable ? "true" : "false"}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          user.residencyId,
                          e.target.value,
                          user.userId
                        )
                      }
                      className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                        user.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <option
                        value="true"
                        className="text-green-800 bg-white cursor-pointer"
                      >
                        Available
                      </option>
                      <option
                        value="false"
                        className="text-red-800 bg-white cursor-pointer"
                      >
                        Not Available
                      </option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-sm text-black">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-8 h-8 text-cyan-400" />
                      {formatToIST(user.createdAt)}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-sm text-gray-600">
                    {editCommissionId === user.residencyId ? (
                      // ---------- Edit Mode ----------
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="border border-gray-300 rounded px-2 py-1 w-20 text-sm focus:outline-none"
                          value={commissionValue}
                          onChange={(e) => setCommissionValue(e.target.value)}
                          autoFocus
                        />

                        {/* Save Button */}
                        <button
                          onClick={() => {
                            handleCommissionChange(
                              user.residencyId,
                              commissionValue
                            );
                            setEditCommissionId(null);
                          }}
                          className="text-green-600 text-xs font-semibold"
                        >
                          Save
                        </button>

                        {/* Cancel Button */}
                        <button
                          onClick={() => setEditCommissionId(null)}
                          className="text-red-600 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      // ---------- View Mode ----------
                      <div className="flex items-center gap-2">
                        <img src={commisionIcon} className="w-4 h-4" />

                        <span>{user.commision || 0}</span>

                        <button
                          onClick={() => {
                            setEditCommissionId(user.residencyId);
                            setCommissionValue(user.commision);
                          }}
                          className="text-blue-500 text-xs underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>

                  {/* -----------verify---------------- */}
                  <td className="py-3 px-4">
                    {/* <img src={verifyIcon} alt="" className="w-4 h-4" /> */}
                    <select
                      value={user.verifyProperty ? "true" : "false"}
                      onChange={(e) =>
                        handleverifyPropertyChange(
                          user.residencyId,
                          e.target.value,
                          user.userId
                        )
                      }
                      className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                        user.verifyProperty
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <option
                        value="true"
                        className="text-green-800 bg-white cursor-pointer"
                      >
                        Verified
                      </option>
                      <option
                        value="false"
                        className="text-red-800 bg-white cursor-pointer"
                      >
                        Not verified
                      </option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-sm text-black flex items-center gap-1">
                    {user.rating}
                    <span className="text-yellow-500">★</span>
                  </td>
                  {/* 👇 New Revenue Cell */}
                  {/* 👇 Updated Revenue Cell - Now Clickable */}
                  <td className="py-3 px-4">
                    <div
                      className={`flex flex-col ${
                        vendorPropertyRevenue?.revenueList?.filter(
                          (r) => r.residencyId === user.residencyId
                        ).length > 0
                          ? "cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
                          : ""
                      }`}
                      onClick={() => handleBookingClick(user)}
                    >
                      <span className="font-semibold text-green-600">
                        {formatCurrency(getPropertyRevenue(user.residencyId))}
                      </span>
                      <span className="text-xs text-black flex items-center gap-1">
                        {vendorPropertyRevenue?.revenueList?.filter(
                          (r) => r.residencyId === user.residencyId
                        ).length || 0}{" "}
                        bookings
                        {vendorPropertyRevenue?.revenueList?.filter(
                          (r) => r.residencyId === user.residencyId
                        ).length > 0 && (
                          <Eye className="w-4 h-4 text-blue-500" />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          console.log("hotel details:", user);
                          setShowViewModal(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View User"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteUser(user.residencyId, user.userId)
                        }
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

        {filteredProperty?.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500 font-medium">No Property found</h3>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </Card>

      {/* Add Property Modal */}
      {showAddModal && (
        <AddProperty
          onClose={() => setShowAddModal(false)}
          onSuccess={() => fetchProperties()}
        />
      )}

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <ViewProperty
          show={showViewModal}
          onClose={() => setShowViewModal(false)}
          onEdit={() => {
            setShowViewModal(false);
            setShowEditModal(true);
          }}
          selectedUser={selectedUser}
          renderAmenityOrRule={renderAmenityOrRule}
        />
      )}
      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <EditPropertyModal
          show={showEditModal}
          selectedUser={selectedUser}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Booking Details Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Booking Details
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedPropertyName} - {selectedPropertyBookings.length}{" "}
                  Bookings
                </p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-blue-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-4">
                {selectedPropertyBookings.map((booking, index) => (
                  <div
                    key={booking._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1 space-y-3">
                        {/* Booking Number & Order ID */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                            Booking #{index + 1}
                          </span>
                          <span className="text-gray-600 text-sm font-mono">
                            {booking.orderId}
                          </span>
                        </div>

                        {/* Guest Name */}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            Guest: {booking.bookingFor}
                          </span>
                        </div>

                        {/* Check-in & Check-out */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-green-500" />
                            <div>
                              <span className="text-gray-500">Check-in:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {formatBookingDate(booking.checkInDate)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-red-500" />
                            <div>
                              <span className="text-gray-500">Check-out:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {formatBookingDate(booking.checkOutDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Nights */}
                        <div className="flex items-center gap-2 text-sm">
                          <Hotel className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-600">
                            {calculateNights(
                              booking.checkInDate,
                              booking.checkOutDate
                            )}{" "}
                            Nights
                          </span>
                        </div>

                        {/* Booking Date */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          Booked on: {formatToIST(booking.createdAt)}
                        </div>
                      </div>

                      {/* Right Section - Payment Info */}
                      <div className="lg:border-l lg:pl-6 space-y-3 lg:min-w-[250px]">
                        {/* Payment Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.paymentStatus === 1
                                ? "bg-green-100 text-green-800"
                                : booking.paymentStatus === 0
                                ? "bg-green-100 text-green-800"
                                : booking.paymentStatus === 2
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {booking.paymentStatus === 1
                              ? "Paid"
                              : booking.paymentStatus === 0
                              ? "Pending"
                              : booking.paymentStatus === 2
                              ? "Canceled"
                              : "Unknown"}
                          </span>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium text-gray-900">
                            {booking.paymentMethod === 1
                              ? "Online"
                              : "Pay at property"}
                          </span>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(booking.finalAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Commission ({booking.commision}%):
                            </span>
                            <span className="font-medium text-red-600">
                              - {formatCurrency(booking.commisionAmount)}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between">
                              <span className="text-sm font-semibold text-gray-900">
                                Your Revenue:
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(booking.vendorRevenue)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary at Bottom */}
              <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedPropertyBookings.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        selectedPropertyBookings.reduce(
                          (sum, b) => sum + b.finalAmount,
                          0
                        )
                      )}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        selectedPropertyBookings.reduce(
                          (sum, b) => sum + b.vendorRevenue,
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;