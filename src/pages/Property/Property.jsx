import React, { useEffect, useState } from 'react';
import { Users, Search, Plus, Download, Upload, Edit, Trash2, Mail, Phone, MapPin, Calendar, UserCheck, UserX, Eye, X, Globe, Home, Building, Building2, Hotel, ShieldCheck } from 'lucide-react';
import Card from '../../reusable_components/Card';
import StatCard from '../../reusable_components/StatCard';
import PieChartComponent from '../../reusable_components/PieChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperty, addProperty, deleteProperty,editProperty } from '../../redux/slices/propertySlice';
import { toast } from 'react-toastify';
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import Loader from '../Loader/Loader';
import commisionIcon from "../../../src/assets/commision.png"
import verifyIcon from "../../../src/assets/verify.png";
import ViewProperty from "./viewProperty";
import AddProperty from './AddProperty';
import EditPropertyModal from './EditPropertyModal';
import CustomVerificationDropdown from './CustomVerify';
import CustomPropertyTypeDropdown from './CustomPropertyDropDown';
import CustomAvailabilityDropdown from './CustomAvailableDropdown';
import NewStatCard from '../User/Newstate';
import { useLocation } from 'react-router-dom';

const PropertyPage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [manualLocation, setManualLocation] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState({ lat: 0, lng: 0 });


  const [isUploading, setIsUploading] = useState(false);
  const location = useLocation();
  const highlight = location.state?.highlight;


  const dispatch = useDispatch();

  const {
    data: properties,
    loading,
    error,
  } = useSelector((state) => state.property);

  useEffect(() => {
    dispatch(fetchProperty());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPropertyStatus, setFilterPropertyStatus] = useState("All");
  const [verificationStatus, setFilterVerificationStatus] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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



  // const filteredProperty = properties?.filter((user) => {
  //   const matchesSearch =
  //     user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email?.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesStatus =
  //     filterStatus === "All" ||
  //     (filterStatus === "Active" && user.isAvailable === true) ||
  //     (filterStatus === "Inactive" && user.isAvailable === false)

  //   return matchesSearch && matchesStatus;
  // });

  const filteredProperty = properties?.filter((user) => {
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

    return matchesSearch && matchesPropertyVerification && matchesStatus && matchesPropertyType;
  });


  const totalProperty = filteredProperty?.length || 0;
  const activeProperty =
    filteredProperty?.filter((u) => u.isAvailable === true).length || 0;
  const inactiveProperty =
    filteredProperty?.filter((u) => u.isAvailable === false).length || 0;
  const verifyPropertyCount =
    filteredProperty?.filter((u) => u.verifyProperty === true).length || 0;
  const notVerifyPropertyCount =
    filteredProperty?.filter((u) => u.verifyProperty === false).length || 0;
  const pgCount =
    filteredProperty?.filter((u) => u.type === "pg").length || 0;
  const hotelCount =
    filteredProperty?.filter((u) => u.type == "hotel" || u.type=="Hotel").length || 0;
  const AppartmentCount =
    filteredProperty?.filter((u) => u.type == "appartment").length || 0;
  const dormitaryCount =
    filteredProperty?.filter((u) => u.type == "dormitary").length || 0;

  const PropertytatusData = [
    { name: "Active", value: activeProperty, color: "#10b981" },
    { name: "Inactive", value: inactiveProperty, color: "#ef4444" },
  ];


  const handleDeleteUser = (id) => {
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


const handleAvailabilityChange = async(id, value) => {
  try {
      setIsUploading(true);
      const payload = {
        residenceId: id,
        isAvailable: value === "true",
      };

      await dispatch(editProperty({ id, payload }));
      dispatch(fetchProperty());
  } catch (error) {
    console.error("❌ Error updating availability:", error);
    toast.error("Failed to update availability");
  }finally{
    setIsUploading(false);
  }

};

const [editCommissionId, setEditCommissionId] = useState(null);
const [editVerifyIconId, setEditVerifyIconId] = useState(null);
const [verifyProperty, setVerifyProperty] = useState(null);
const [commissionValue, setCommissionValue] = useState("");


const handleverifyPropertyChange = async (id, value) => {
  try {
    setIsUploading(true);
    const payload = {
      residenceId: id,
      verifyProperty: value === "true",
    };

    await dispatch(editProperty({ id, payload }));
    dispatch(fetchProperty());
  } catch (error) {
    console.error("❌ Error updating availability:", error);
    toast.error("Failed to update availability");
  } finally {
    setIsUploading(false);
  }
};
const handleCommissionChange = async(id, value) => {
  try{  
      const payload = {
        residenceId: id,
        commision: Number(value),
      };
      await dispatch(editProperty({ id, payload }));
      dispatch(fetchProperty());
  }catch{
    toast.error("Invalid commission value");
    return;
  }
}

  const renderAmenityOrRule = (item) => {
    if (typeof item === "string") {
      return item;
    } else if (typeof item === "object" && item !== null) {
      return item.name || JSON.stringify(item);
    }
    return String(item);
  };

  if (isUploading || loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Property Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all Property in your system
            </p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        {/* <StatCard
          title="Total Property"
          value={totalProperty.toString()}
          change="+12 this month"
          changeType="positive"
          icon={Home}
          color="blue"
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
        /> */}
        <NewStatCard
          title="Total Property"
          highlight={highlight}
          value={totalProperty.toString()}
          icon={Home}
          gradient="from-blue-700 to-cyan-500"
        />

        <NewStatCard
          title="Available Property"
          highlight={highlight}
          value={activeProperty.toString()}
          icon={UserCheck}
          gradient="from-green-700 to-lime-500"
        />

        <NewStatCard
          title="Not Available Property"
          highlight={highlight}
          value={inactiveProperty.toString()}
          icon={UserX}
          gradient="from-red-700 to-orange-500"
        />

        <NewStatCard
          title="Not Verified Property"
          highlight={highlight}
          value={notVerifyPropertyCount.toString()}
          icon={ShieldCheck}
          gradient="from-yellow-600 to-amber-400"
        />

        <NewStatCard
          title="Verified Property"
          highlight={highlight}
          value={verifyPropertyCount.toString()}
          icon={ShieldCheck}
          gradient="from-emerald-700 to-green-500"
        />

        <NewStatCard
          title="Hotel Property"
          highlight={highlight}
          value={hotelCount.toString()}
          icon={Hotel}
          gradient="from-purple-700 to-pink-500"
        />

        <NewStatCard
          title="PG Property"
          highlight={highlight}
          value={pgCount.toString()}
          icon={Building2}
          gradient="from-indigo-700 to-violet-500"
        />

        <NewStatCard
          title="Apartment Property"
          highlight={highlight}
          value={AppartmentCount.toString()}
          icon={Building}
          gradient="from-cyan-700 to-blue-400"
        />

        <NewStatCard
          title="Dormitory Property"
          highlight={highlight}
          value={dormitaryCount.toString()}
          icon={Users}
          gradient="from-teal-700 to-emerald-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
        <PieChartComponent
          title="Property Status Distribution"
          data={PropertytatusData}
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
              <tr className="border-b border-gray-200">
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
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-3 h-3" />
                        {user.contactNumber}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
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
                          e.target.value
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

                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
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
                    <img src={verifyIcon} alt="" className="w-4 h-4" />
                    <select
                      value={user.verifyProperty ? "true" : "false"}
                      onChange={(e) =>
                        handleverifyPropertyChange(
                          user.residencyId,
                          e.target.value
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

                  <td className="py-3 px-4 text-sm text-gray-600 flex items-center gap-1">
                    {user.rating}
                    <span className="text-yellow-500">★</span>
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
                        onClick={() => handleDeleteUser(user.residencyId)}
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
    </div>
  );
};

export default PropertyPage;