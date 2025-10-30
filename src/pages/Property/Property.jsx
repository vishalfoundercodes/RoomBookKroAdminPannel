import React, { useEffect, useState } from 'react';
import {  Users,  Search,  Filter,  Plus,  Download,  Upload, MoreVertical, Edit, Trash2, Mail, Phone,MapPin,
  Calendar, UserCheck, UserX, Eye, X, Save, UserPlus, Globe, Home} from 'lucide-react';
import  Card from '../../reusable_components/Card';
import  StatCard  from '../../reusable_components/StatCard';
import   DataTable from '../../reusable_components/DataTable';

import BarChartComponent from '../../reusable_components/BarChart';
import PieChartComponent from '../../reusable_components/PieChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperty ,addProperty, editProperty, deleteProperty } from '../../redux/slices/propertySlice';
import EditPropertyModal from "./EditPropertyModal";
import { toast } from 'react-toastify';
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";


const PropertyPage = () => {
  // Get the stored user data
  const storedUser = JSON.parse(localStorage.getItem("user"));
const [manualLocation, setManualLocation] = useState(false);
const [selectedCoords, setSelectedCoords] = useState({ lat: 0, lng: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);


const [cityQuery, setCityQuery] = useState("");
const [cityResults, setCityResults] = useState([]);
const [selectedCity, setSelectedCity] = useState(null);

  const userId = storedUser.userId;
  const userType = storedUser.user_type;

  const dispatch = useDispatch();

  const { data: properties, loading, error } = useSelector(
    (state) => state.property
  );

  useEffect(() => {
    dispatch(fetchProperty());
  }, [dispatch]);

  // Utility: Convert file to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [Property, setProperty] = useState([]);

  const handleEdit = () => {
    const formData = new FormData();
    formData.append("name", "Updated Hotel Name");
    formData.append("location", "Mumbai");
    formData.append("image", selectedFile);

    dispatch(editProperty({ id: 4, payload: formData }))
      .unwrap()
      .then((res) => {
        console.log("✅ Property updated successfully:", res);
      })
      .catch((err) => {
        console.error("❌ Error updating property:", err);
      });
  };

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  console.log("selectdddd",selectedUser);

const [newProperty, setNewProperty] = useState({
  userId,
  userType,
  name: "",
  type: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  coordinates: { lat: 0, lng: 0 },
  mainImage: "",
  images: [],
  pricePerMonth: 0,
  depositAmount: 0,
  discount: 0,
  oldMrp: 0,
  tax: 0,
  rooms: [],
  amenities: [],
  rules: [],
  contactNumber: "",
  email: "",
  website: "",
  owner: "",
  description: "",
  rating: 5,
  availableRooms: 0,
  isAvailable: true,
  reviews: [],
});

const handleAddProperty = () => {
  // ✅ Build the clean payload exactly like Postman example
  const payload = {
    userId: String(newProperty.userId),
    userType: String(newProperty.userType),
    name: newProperty.name,
    type: newProperty.type,
    address: newProperty.address,
    city: newProperty.city,
    state: newProperty.state,
    pincode: newProperty.pincode,
    coordinates: {
      lat: parseFloat(newProperty.coordinates.lat) || 0,
      lng: parseFloat(newProperty.coordinates.lng) || 0,
    },
    mainImage: newProperty.mainImageBase64 || "",
    images: newProperty.images || [],
    pricePerMonth: parseFloat(newProperty.pricePerMonth) || 0,
    pricePerNight: parseFloat(newProperty.pricePerNight) || 0,
    depositAmount: parseFloat(newProperty.depositAmount) || 0,
    discount: parseFloat(newProperty.discount) || 0,
    oldMrp: parseFloat(newProperty.oldMrp) || 0,
    tax: parseFloat(newProperty.tax) || 0,
    rooms: newProperty.rooms.map((room) => ({
      roomType: room.roomType,
      furnished: room.furnished,
      occupancy: parseInt(room.occupancy) || 0,
      price: parseFloat(room.price) || 0,
      availableUnits: parseInt(room.availableUnits) || 0,
      amenities: room.amenities.map((a) => ({
        name: a.name,
        icon: a.icon || "",
      })),
      images: room.images || [],
    })),
    amenities: newProperty.amenities.map((a) => ({
      name: a.name,
      icon: a.icon || "default-icon.png", // ✅ always set valid icon
    })),
    rules: newProperty.rules,
    contactNumber: newProperty.contactNumber,
    email: newProperty.email,
    website: newProperty.website,
    rating: parseFloat(newProperty.rating) || 5,
    reviews: newProperty.reviews || [],
    availableRooms: parseInt(newProperty.availableRooms) || 0,
    owner: newProperty.owner,
    role: "Owner",
    description: newProperty.description,
    isAvailable: newProperty.isAvailable,
  };

  console.log("✅ Payload to send:", payload);

  dispatch(addProperty(payload))
    .unwrap()
    .then(() => {
      setShowAddModal(false);
      setNewProperty({
        userId,
        userType,
        name: "",
        type: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        coordinates: { lat: 0, lng: 0 },
        mainImage: "",
        images: [],
        pricePerMonth: 0,
        pricePerNight: 0,
        depositAmount: 0,
        discount: 0,
        oldMrp: 0,
        tax: 0,
        rooms: [],
        amenities: [],
        rules: [],
        contactNumber: "",
        email: "",
        website: "",
        owner: "",
        description: "",
        rating: 0,
        availableRooms: 0,
        isAvailable: true,
        reviews: [],
      });
    })
    .catch((err) => console.error("❌ Add property error:", err));
};

  // ✅ Add room inside property
  const handleAddRoom = () => {
    setNewProperty((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          roomType: "",
          furnished: "",
          occupancy: 0,
          price: 0,
          availableUnits: 0,
          depositAmount: 0,
          amenities: [],
          images: [],
        },
      ],
    }));
  };
useEffect(() => {
  if (manualLocation) {
    import("leaflet").then((L) => {
      // Initialize map only once
      if (window._manualMap) {
        window._manualMap.remove();
      }

      const map = L.map("map").setView([selectedCoords.lat, selectedCoords.lng], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      let marker = L.marker([selectedCoords.lat, selectedCoords.lng]).addTo(map);

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

// 🌆 City Search Handler
const handleCitySearch = async (e) => {
  e.preventDefault();
  if (!cityQuery.trim()) return;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityQuery)}&addressdetails=1&limit=5&countrycodes=in`
  );
  const data = await res.json();
  setCityResults(data);
};

// 📍 Area/Point Search within selected city
const handleAreaSearch = async (e) => {
  e.preventDefault();
  if (!searchQuery.trim() || !selectedCity) return;

  const fullQuery = `${searchQuery}, ${selectedCity.display_name}`;
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&addressdetails=1&limit=10`
  );
  const data = await res.json();
  setSearchResults(data);

  if (data.length > 0) {
    import("leaflet").then((L) => {
      const map = window._manualMap;
      if (!map) return;

      if (window._markerGroup) map.removeLayer(window._markerGroup);
      const group = L.layerGroup().addTo(map);
      window._markerGroup = group;

      data.forEach((place) => {
        const { lat, lon, display_name } = place;
        const m = L.marker([lat, lon])
          .addTo(group)
          .bindPopup(display_name)
          .on("click", () => {
            setSelectedCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
            map.setView([lat, lon], 15);
          });
      });

      const bounds = L.latLngBounds(data.map((p) => [p.lat, p.lon]));
      map.fitBounds(bounds);
    });
  }
};
  // ✅ Handle room image upload
  const handleRoomImages = (e, i) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        })
    );



    Promise.all(readers).then((base64Images) => {
      const updated = [...newProperty.rooms];
      updated[i].images = [...updated[i].images, ...base64Images];
      setNewProperty({ ...newProperty, rooms: updated });
    });
  };

  // Filter and search logic
  const filteredProperty = properties?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || properties?.isAvailable === filterStatus;

    const matchesRole = filterRole === "All" || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Statistics calculations
  const totalProperty = properties?.length || 0;
  const activeProperty = properties?.filter(u => u.isAvailable === true).length || 0;
  const inactiveProperty = properties?.filter(u => u.isAvailable === false).length || 0;

  // Chart data
  const PropertytatusData = [
    { name: 'Active', value: activeProperty, color: '#10b981' },
    { name: 'Inactive', value: inactiveProperty, color: '#ef4444' }
  ];

      // Handle multiple property images
const handlePropertyImages = (e) => {
  const files = Array.from(e.target.files);

  Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  ).then((base64Images) => {
    setNewProperty((prev) => ({
      ...prev,
      images: [...prev.images, ...base64Images],
    }));
  });
};
  // Status color helper
  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Inactive': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Role color helper
  const getRoleColor = (role) => {
    const colors = {
      'Admin': 'bg-purple-100 text-purple-800',
      'Manager': 'bg-blue-100 text-blue-800',
      'User': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteUser = (id) => {
    if (!id) {
      toast.error("Invalid property ID!");
      return;
    }

    dispatch(deleteProperty(id))
      .unwrap()
      .then(() => {
        toast.success("Property deleted successfully!");
        setProperty(properties?.filter(u => u.id !== userId));
      })
      .catch((error) => {
        console.error("Delete Error:", error);
        toast.error("Failed to delete property!");
      });
  };

  const handleAvailabilityChange = (id, isAvailable) => {
    // Implement availability change logic here
    console.log("Changing availability for:", id, isAvailable);
  };

  const handleStatusChange = (userId, newStatus) => {
    setProperty(properties?.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleBulkAction = (action) => {
    if (action === 'delete') {
      setProperty(properties?.filter(u => !selectedProperty.includes(u.id)));
      setSelectedProperty([]);
    } else if (action === 'activate') {
      setProperty(properties?.map(u => selectedProperty.includes(u.id) ? { ...u, status: 'Active' } : u));
      setSelectedProperty([]);
    }
  };

  // Helper function to safely render amenities/rules
  const renderAmenityOrRule = (item) => {
    if (typeof item === 'string') {
      return item;
    } else if (typeof item === 'object' && item !== null) {
      return item.name || JSON.stringify(item);
    }
    return String(item);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all Property in your system</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Property"
          value={totalProperty.toString()}
          change="+12 this month"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Available Property"
          value={activeProperty.toString()}
          change={`${totalProperty > 0 ? ((activeProperty / totalProperty) * 100).toFixed(1) : 0}%`}
          changeType="positive"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Not Available Property"
          value={inactiveProperty.toString()}
          change="Need attention"
          changeType="negative"
          icon={UserX}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
        <PieChartComponent 
          title=" Property Status Distribution"
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
        </div>

        {selectedProperty.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-blue-700">{selectedProperty.length} user(s) selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Property Table */}
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
                        setSelectedProperty(filteredProperty.map(u => u.id));
                      } else {
                        setSelectedProperty([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Property name </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Register Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperty?.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProperty.includes(user.residencyId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProperty([...selectedProperty, user.residencyId]);
                        } else {
                          setSelectedProperty(selectedProperty.filter(id => id !== user.residencyId));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
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
                      value={user.isAvailable ? "Available" : "Not Available"}
                      onChange={(e) => handleAvailabilityChange(user._id, e.target.value === "Available")}
                      className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                        user.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      <option value="Available">Available</option>
                      <option value="Not Available">Not Available</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {user.createdAt}
                    </div>
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
                          setShowViewModal(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View User"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <EditPropertyModal
                        show={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        // propertyId={user.residencyId}
                        propertyId={selectedUser}
                      />
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
            <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Card>

      {/* Add Property Modal */}
{showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-white rounded-lg w-full max-w-5xl mx-4">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Property</h2>
          <button
            onClick={() => setShowAddModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Property Name</label>
              <input
                type="text"
                placeholder="Enter property name"
                value={newProperty.name}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, name: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Property Type</label>
              <select
                value={newProperty.type}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, type: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select Type</option>
                <option value="pg">PG</option>
                <option value="hotel">Hotel</option>
                <option value="appartment">Apartment</option>
              </select>
            </div>
          </div>

          {/* Address Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Address</label>
              <input
                type="text"
                placeholder="Enter address"
                value={newProperty.address}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, address: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">City</label>
              <input
                type="text"
                placeholder="Enter city"
                value={newProperty.city}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, city: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* State & Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">State</label>
              <input
                type="text"
                placeholder="Enter state"
                value={newProperty.state}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, state: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Pincode</label>
              <input
                type="text"
                placeholder="Enter pincode"
                value={newProperty.pincode}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, pincode: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* Coordinates */}
       {/* Coordinates Section */}
<div className="border rounded-lg p-4 bg-gray-50">
      <label className="block text-lg font-semibold mb-3">📍 Property Location</label>

      {/* Buttons */}
      <div className="flex gap-3 mb-3">
        <button
          type="button"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  setNewProperty((prev) => ({
                    ...prev,
                    coordinates: { lat: latitude, lng: longitude },
                  }));
                  alert("✅ Current location added successfully!");
                },
                () => alert("⚠️ Please allow location access or try manual selection.")
              );
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Use Current Location
        </button>

        <button
          type="button"
          onClick={() => setManualLocation(true)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          Choose Location Manually
        </button>
      </div>

      {/* Display chosen coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Latitude</label>
          <input
            type="number"
            value={newProperty.coordinates.lat}
            readOnly
            className="border rounded px-3 py-2 w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Longitude</label>
          <input
            type="number"
            value={newProperty.coordinates.lng}
            readOnly
            className="border rounded px-3 py-2 w-full bg-gray-100"
          />
        </div>
      </div>

      {/* Manual Location Modal */}
      {manualLocation && (
      <div className="bg-white rounded-lg w-full max-w-3xl p-4">
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-lg font-semibold">Select Property Location</h2>
    <button onClick={() => setManualLocation(false)} className="text-gray-500 hover:text-gray-700">✕</button>
  </div>

  {/* Step 1: Search City */}
  <form onSubmit={handleCitySearch} className="flex gap-2 mb-3">
    <input
      type="text"
      value={cityQuery}
      onChange={(e) => setCityQuery(e.target.value)}
      placeholder="Search city (e.g. Kanpur)"
      className="border rounded px-3 py-2 w-full"
    />
    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
  </form>

  {/* City Results */}
  {cityResults.length > 0 && (
    <ul className="bg-gray-50 border rounded mb-3 max-h-40 overflow-auto">
      {cityResults.map((c, i) => (
        <li
          key={i}
          className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
            selectedCity?.display_name === c.display_name ? "bg-blue-100 font-semibold" : ""
          }`}
          onClick={() => {
            setSelectedCity(c);
            import("leaflet").then((L) => {
              const map = window._manualMap;
              if (map) {
                map.setView([c.lat, c.lon], 11);
              }
            });
          }}
        >
          {c.display_name}
        </li>
      ))}
    </ul>
  )}

  {/* Step 2: Search Area within City */}
  {selectedCity && (
    <>
      <form onSubmit={handleAreaSearch} className="flex gap-2 mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search areas within ${selectedCity.display_name.split(",")[0]}`}
          className="border rounded px-3 py-2 w-full"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Search</button>
      </form>
    </>
  )}

  {/* Map */}
  <div id="map" className="h-96 w-full rounded-md border"></div>

  <div className="flex justify-end gap-3 mt-4">
    <button onClick={() => setManualLocation(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
    <button
      onClick={() => {
        setNewProperty({
          ...newProperty,
          coordinates: { lat: selectedCoords.lat, lng: selectedCoords.lng },
        });
        setManualLocation(false);
      }}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Save Location
    </button>
  </div>
</div>

      )}
    </div>
  



          {/* Contact & Owner Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Owner Name</label>
              <input
                type="text"
                placeholder="Enter owner name"
                value={newProperty.owner}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, owner: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Contact Number</label>
              <input
                type="text"
                placeholder="Enter contact number"
                value={newProperty.contactNumber}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    contactNumber: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={newProperty.email}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, email: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Website (optional)</label>
            <input
              type="text"
              placeholder="Enter website URL"
              value={newProperty.website}
              onChange={(e) =>
                setNewProperty({ ...newProperty, website: e.target.value })
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block font-medium mb-1">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNewProperty({
                      ...newProperty,
                      mainImage: file,
                      mainImageBase64: reader.result,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="border rounded px-3 py-2 w-full"
            />
            {newProperty.mainImageBase64 && (
              <img
                src={newProperty.mainImageBase64}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded"
              />
            )}
          </div>

          {/* Property Images */}
          <div>
            <label className="block font-medium mb-1">Property Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePropertyImages}
              className="border rounded px-3 py-2 w-full"
            />
            {newProperty.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newProperty.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`property-${idx}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Conditional Price Fields */}
          {newProperty.type === "hotel" && (
            <div>
              <label className="block font-medium mb-1">Price per Night (₹)</label>
              <input
                type="number"
                placeholder="Enter nightly price"
                value={newProperty.pricePerNight}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    pricePerNight: parseInt(e.target.value),
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          )}

          {(newProperty.type === "pg" || newProperty.type === "apartment") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Price per Month (₹)</label>
                <input
                  type="number"
                  placeholder="Enter monthly price"
                  value={newProperty.pricePerMonth}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      pricePerMonth: parseInt(e.target.value),
                    })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Deposit Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter deposit amount"
                  value={newProperty.depositAmount}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      depositAmount: parseInt(e.target.value),
                    })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>
          )}

          {/* Discount / Rating / Tax */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Discount (%)</label>
              <input
                type="number"
                placeholder="Enter discount percentage"
                value={newProperty.discount}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    discount: parseFloat(e.target.value),
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Old MRP (₹)</label>
              <input
                type="number"
                placeholder="Enter old price"
                value={newProperty.oldMrp}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    oldMrp: parseFloat(e.target.value),
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Tax (%)</label>
              <input
                type="number"
                placeholder="Enter tax rate"
                value={newProperty.tax}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    tax: parseFloat(e.target.value),
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* Amenities & Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Amenities</label>
              <input
                type="text"
                placeholder="e.g. WiFi, Parking, Laundry"
                value={newProperty.amenities.map((a) => a.name).join(", ")}
                onChange={(e) => {
                  const names = e.target.value.split(",").map((name) => ({
                    name: name.trim(),
                    icon: "default-icon.png",
                  }));
                  setNewProperty({ ...newProperty, amenities: names });
                }}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Rules</label>
              <input
                type="text"
                placeholder="e.g. No smoking, No pets"
                value={newProperty.rules.join(", ")}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    rules: e.target.value.split(","),
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block font-medium mb-1">Available Rooms</label>
              <input
                type="number"
                placeholder="Enter available rooms"
                value={newProperty.availableRooms}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    availableRooms: parseInt(e.target.value),
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <label className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                checked={newProperty.isAvailable}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    isAvailable: e.target.checked,
                  })
                }
              />
              <span>Available for Booking</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              placeholder="Write a brief description of the property"
              value={newProperty.description}
              onChange={(e) =>
                setNewProperty({ ...newProperty, description: e.target.value })
              }
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>

          {/* Rooms Section */}
          <div className="mt-4 border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Rooms</h3>
              <button
                onClick={handleAddRoom}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
              >
                + Add Room
              </button>
            </div>

            {newProperty.rooms.map((room, i) => (
              <div
                key={i}
                className="border rounded-md p-3 mb-3 bg-gray-50 relative"
              >
                <button
                  onClick={() => {
                    const updated = [...newProperty.rooms];
                    updated.splice(i, 1);
                    setNewProperty({ ...newProperty, rooms: updated });
                  }}
                  className="absolute top-2 right-2 text-red-500"
                >
                  ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div>
  <label className="block font-medium mb-1">Room Type</label>
  <select
    value={room.roomType}
    onChange={(e) => {
      const updated = [...newProperty.rooms];
      updated[i].roomType = e.target.value;
      setNewProperty({ ...newProperty, rooms: updated });
    }}
    className="border rounded px-3 py-2 w-full"
  >
    <option value="">Select Room Type</option>
    <option value="suite">Suite</option>
    <option value="1bhk">1BHK</option>
    {/* <option value="2bhk">2BHK</option> */}
    {/* <option value="deluxe">Deluxe</option> */}
    {/* <option value="single">Single Room</option> */}
    {/* <option value="double">Double Room</option> */}
  </select>
</div>


                  <div>
                    <label className="block font-medium mb-1">Furnishing</label>
                    <select
                      value={room.furnished}
                      onChange={(e) => {
                        const updated = [...newProperty.rooms];
                        updated[i].furnished = e.target.value;
                        setNewProperty({ ...newProperty, rooms: updated });
                      }}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option value="">Select</option>
                      <option value="furnished">Furnished</option>
                      <option value="semi-frunished">Semi-Furnished</option>
                      <option value="unfurnished">Unfurnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Occupancy</label>
                    <input
                      type="number"
                      placeholder="Enter occupancy limit"
                      value={room.occupancy || ""}
                      onChange={(e) => {
                        const updated = [...newProperty.rooms];
                        updated[i].occupancy = parseInt(e.target.value);
                        setNewProperty({ ...newProperty, rooms: updated });
                      }}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Enter room price"
                      value={room.price || ""}
                      onChange={(e) => {
                        const updated = [...newProperty.rooms];
                        updated[i].price = parseInt(e.target.value);
                        setNewProperty({ ...newProperty, rooms: updated });
                      }}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>

                  {/* Room Images */}
                  <div>
                    <label className="block font-medium mb-1">Room Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleRoomImages(e, i)}
                      className="border rounded px-3 py-2 w-full"
                    />
                    {room.images?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {room.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`room-${idx}`}
                            className="h-16 w-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setShowAddModal(false)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAddProperty}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Property
          </button>
        </div>
      </div>
    </div>
  </div>
)}



      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 my-10 shadow-lg">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Property Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
                {/* <EditPropertyModal
                        show={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        propertyId={selectedUser.residencyId}
                      /> */}

              {/* Basic Info */}
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <img
                  src={selectedUser.mainImage}
                  alt={selectedUser.name}
                  className="w-full sm:w-56 h-40 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedUser.type?.toUpperCase() || "PROPERTY"}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        selectedUser.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedUser.isAvailable ? "Available" : "Unavailable"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                      ⭐ {selectedUser.rating || 0} / 5
                    </span>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                      ₹{selectedUser.pricePerNight} / night
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact + Location */}
              <div className="grid sm:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedUser.contactNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${selectedUser.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedUser.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {selectedUser.address}, {selectedUser.city},{" "}
                        {selectedUser.state} - {selectedUser.pincode}
                      </span>
                    </div>
                    {selectedUser.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a
                          href={selectedUser.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Property Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        Added on:{" "}
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span>Available Rooms: {selectedUser.availableRooms}</span>
                    </div>
                    {selectedUser.coordinates && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>
                          Lat: {selectedUser.coordinates.lat}, Lng:{" "}
                          {selectedUser.coordinates.lng}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities and Rules */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amenities */}
                {selectedUser.amenities?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {selectedUser.amenities.map((a, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-gray-800">
                          {renderAmenityOrRule(a)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rules */}
                {selectedUser.rules?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Property Rules</h4>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {selectedUser.rules.map((r, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-gray-800">
                          {renderAmenityOrRule(r)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery */}
              {selectedUser.images && selectedUser.images.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-3">Gallery</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedUser.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Image ${i + 1}`}
                        className="w-full h-32 object-cover rounded-lg hover:scale-105 transition"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms */}
              {selectedUser.rooms && selectedUser.rooms.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-3">Room Details</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    {selectedUser.rooms.map((room, i) => (
                      <div
                        key={i}
                        className="border p-3 rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between"
                      >
                        <div>
                          <p className="font-medium capitalize">
                            {room.roomType} Room ({room.furnished})
                          </p>
                          <p>Occupancy: {room.occupancy}</p>
                          <p>Price: ₹{room.pricePerMonth || room.price}</p>
                          <p>
                            Amenities:{" "}
                            {room.amenities && Array.isArray(room.amenities)
                              ? room.amenities.map(renderAmenityOrRule).join(", ")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-10 justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setShowEditModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;