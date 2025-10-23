
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
  Globe,
  Home
} from 'lucide-react';
import  Card from '../../reusable_components/Card';
import  StatCard  from '../../reusable_components/StatCard';
import   DataTable from '../../reusable_components/DataTable';

import BarChartComponent from '../../reusable_components/BarChart';
import PieChartComponent from '../../reusable_components/PieChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperty ,addProperty, editProperty } from '../../redux/slices/propertySlice';
import EditPropertyModal from "./EditPropertyModal";
const PropertyPage = () => {
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

  // if (loading) return <p>Loading properties...</p>;
  // if (error) return <p>Error: {error}</p>;

  // console.log("property data :",properties);
  


  const [Property, setProperty] = useState([
    // {
    //   id: 1,
    //   name: "John Doe",
    //   email: "john.doe@example.com",
    //   phone: "+1 (555) 123-4567",
    //   role: "Admin",
    //   status: "Active",
    //   location: "New York, USA",
    //   joinDate: "2023-01-15",
    //   lastLogin: "2024-01-15 10:30 AM",
    //   avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format"
    // },
   
    
   
  ]);

    const handleEdit = () => {
    const formData = new FormData();
    formData.append("name", "Updated Hotel Name");
    formData.append("location", "Mumbai");
    formData.append("image", selectedFile); // if file input present

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


  const [newProperty, setNewProperty] = useState({
  userId: "1",
  userType: "1",
  name: "",
  type: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  coordinates: { lat: 0, lng: 0 },
  mainImage: "",
  images: [],
  pricePerNight: 0,
  rooms: [],
    //    rooms: [
    // {
    //   "roomType": "suite",
    //   "furnished": "furnished",
    //   "occupancy": 4,
    //     "pricePerMonth":11000,
    //   "depositAmount":22000,
    //   "amenities": ["AC", "TV", "Attached Bathroom","Kitechen","Grocery"],
    //   "availableUnits": 3,
    //   "images": [
    //     "https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/579890916.jpg?k=d1b853e1d1cc0d54793a75e6b9c45dff50e70954d385a79db6790744c3398383&o=&s=1024",
    //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA2A"
    //   ]}]
    // ,
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
});


const handleAddProperty = () => {
  console.log("Payload to send:", newProperty);
  dispatch(addProperty(newProperty))
    .unwrap()
    .then(() => {
      setShowAddModal(false);
      // Optionally reset form
      setNewProperty({
        userId: "1",
        userType: "1",
        name: "",
        type: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        coordinates: { lat: 0, lng: 0 },
        mainImage: "",
        images: [],
        pricePerNight: 0,
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
      });
    })
    
    .catch((err) => console.error("Add property error:", err));
};

  // New user form state
  // const [newUser, setNewUser] = useState({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   role: "User",
  //   location: ""
  // });

//   const handleAddProperty = () => {
//   console.log("Payload to send:", newProperty); // Check payload in console

//   dispatch(addProperty(newProperty))
//     .unwrap()
//     .then(() => {
//       setShowAddModal(false);
//       // Reset form
//       setNewProperty({
//         userId: "1",
//         userType: "1",
//         name: "",
//         type: "",
//         address: "",
//         city: "",
//         state: "",
//         pincode: "",
//         coordinates: { lat: 0, lng: 0 },
//         mainImage: "",
//         images: [],
//         pricePerNight: 0,
//         rooms: [],
//         amenities: [],
//         rules: [],
//         contactNumber: "",
//         email: "",
//         website: "",
//         owner: "",
//         description: "",
//         rating: 0,
//         availableRooms: 0,
//         isAvailable: true,
//       });
//     })
//     .catch((err) => console.error("Add property error:", err));
// };

  // Filter and search logic
  
  
  const filteredProperty = properties?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());



    const matchesStatus = filterStatus === "All" || properties?.isAvailable === filterStatus;

    const matchesRole = filterRole === "All" || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  
  // Statistics calculations
  const totalProperty = properties?.length;
  // const activeProperty = properties?.filter(u => u.status === "Active").length;
  const activeProperty = properties?.filter(u => u.isAvailable === true).length;
  // const pendingProperty = properties?.filter(u => u.status === "Pending").length;
  // const inactiveProperty = properties?.filter(u => u.status === "Inactive").length;
  const inactiveProperty = properties?.filter(u => u.isAvailable === false).length;
  // console.log("filteredProperty",filteredProperty);
  // console.log("totalProperty",totalProperty);
  // console.log("activeProperty",activeProperty);

  // console.log("inactiveProperty",inactiveProperty);
  
  // Chart data
  const PropertytatusData = [
    { name: 'Active', value: activeProperty, color: '#10b981' },
    // { name: 'Pending', value: pendingProperty, color: '#f59e0b' },
    { name: 'Inactive', value: inactiveProperty, color: '#ef4444' }
  ];

  const userRoleData = [
    { name: 'Jan', Admin: 5, Manager: 8, User: 45 },
    { name: 'Feb', Admin: 6, Manager: 10, User: 52 },
    { name: 'Mar', Admin: 7, Manager: 12, User: 58 },
    { name: 'Apr', Admin: 8, Manager: 15, User: 65 },
    { name: 'May', Admin: 9, Manager: 18, User: 72 },
    { name: 'Jun', Admin: 10, Manager: 20, User: 80 }
  ];

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

  // Handle user actions
  // const handleAddUser = () => {
  //   const user = {
  //     id: Property.length + 1,
  //     ...newUser,
  //     status: "Pending",
  //     joinDate: new Date().toISOString().split('T')[0],
  //     lastLogin: "Never",
  //     avatar: `https://ui-avatars.com/api/?name=${newUser.name}&size=32&background=random`
  //   };
  //   setProperty([...Property, user]);
  //   setNewUser({ name: "", email: "", phone: "", role: "User", location: "" });
  //   setShowAddModal(false);
  // };

  const handleDeleteUser = (userId) => {
    setProperty(properties?.filter(u => u.id !== userId));
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
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              Import
            </button>
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
          change={`${((activeProperty / totalProperty) * 100).toFixed(1)}%`}
          changeType="positive"
          icon={UserCheck}
          color="green"
        />
        {/* <StatCard
          title="Pending Property"
          value={pendingProperty.toString()}
          change="Awaiting approval"
          icon={UserPlus}
          color="yellow"
        /> */}
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
        {/* <div className="lg:col-span-1">
          <BarChartComponent 
            title="Property Growth by Role"
            data={userRoleData}
            bars={[
              { dataKey: "Admin", fill: "#8b5cf6", name: "Admin" },
              { dataKey: "Manager", fill: "#3b82f6", name: "Manager" },
              { dataKey: "User", fill: "#10b981", name: "User" }
            ]}
            height={250}
          />
        </div> */}
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
            {/* <option value="Pending">Pending</option> */}
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
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th> */}
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Register Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperty.map((user) => (
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
                      {/* <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      /> */}
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
            
                  {/* <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td> */}
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
                               <EditPropertyModal
                              show={showEditModal}
                              onClose={() => setShowEditModal(false)}
                              propertyId={user.id}
                            />
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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

        {filteredProperty.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500 font-medium">No users found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Card>

  {/* Add Property Modal */}
{showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-white rounded-lg w-full max-w-3xl mx-4">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Property</h2>
          <button
            onClick={() => setShowAddModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
            <input
              type="text"
              value={newProperty.name}
              onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter property name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newProperty.type}
              onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="appartment">Apartment</option>
              <option value="hotel">Hotel</option>
              {/* <option value="villa">Villa</option> */}
              <option value="pg">PG</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={newProperty.address}
                onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={newProperty.city}
                onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={newProperty.state}
                onChange={(e) => setNewProperty({ ...newProperty, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                value={newProperty.pincode}
                onChange={(e) => setNewProperty({ ...newProperty, pincode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pincode"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                value={newProperty.coordinates.lat}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    coordinates: { ...newProperty.coordinates, lat: parseFloat(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Latitude"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                value={newProperty.coordinates.lng}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    coordinates: { ...newProperty.coordinates, lng: parseFloat(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Longitude"
              />
            </div>
          </div>

                      {/* Main Image */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Create a local URL to preview (or you can upload to server)
                      const url = URL.createObjectURL(file);
                      setNewProperty({ ...newProperty, mainImage: url });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {newProperty.mainImage && (
                  <img
                    src={newProperty.mainImage}
                    alt="Main"
                    className="mt-2 w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div> */}

              {/* Other Images */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const urls = files.map((file) => URL.createObjectURL(file));
                    setNewProperty({ ...newProperty, images: urls });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProperty.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`img-${i}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div> */}



{/* Main Image */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Main Image
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (file) {
        const base64 = await toBase64(file);
        setNewProperty({ ...newProperty, mainImage: base64 });
      }
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {newProperty.mainImage && (
    <img
      src={newProperty.mainImage}
      alt="Main"
      className="mt-2 w-32 h-32 object-cover rounded-md"
    />
  )}
</div>

{/* Other Images */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Other Images
  </label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={async (e) => {
      const files = Array.from(e.target.files);
      const base64Images = await Promise.all(
        files.map((file) => toBase64(file))
      );
      setNewProperty({ ...newProperty, images: base64Images });
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <div className="flex flex-wrap gap-2 mt-2">
    {newProperty.images.map((img, i) => (
      <img
        key={i}
        src={img}
        alt={`img-${i}`}
        className="w-20 h-20 object-cover rounded-md"
      />
    ))}
  </div>
</div>



          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night</label>
            <input
              type="number"
              value={newProperty.pricePerNight}
              onChange={(e) =>
                setNewProperty({ ...newProperty, pricePerNight: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price per night"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
            <input
              type="text"
              value={newProperty.amenities.join(",")}
              onChange={(e) =>
                setNewProperty({ ...newProperty, amenities: e.target.value.split(",") })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="WiFi, Parking, Lift, Gym"
            />
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rules (comma separated)</label>
            <input
              type="text"
              value={newProperty.rules.join(",")}
              onChange={(e) =>
                setNewProperty({ ...newProperty, rules: e.target.value.split(",") })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="No smoking, No pets"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                value={newProperty.contactNumber}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, contactNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newProperty.email}
                onChange={(e) => setNewProperty({ ...newProperty, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="text"
              value={newProperty.website}
              onChange={(e) => setNewProperty({ ...newProperty, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
            <input
              type="text"
              value={newProperty.owner}
              onChange={(e) => setNewProperty({ ...newProperty, owner: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Owner name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newProperty.description}
              onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter property description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                value={newProperty.rating}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, rating: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter rating"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Rooms</label>
              <input
                type="number"
                value={newProperty.availableRooms}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, availableRooms: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
              <select
                value={newProperty.isAvailable}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, isAvailable: e.target.value === "true" })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
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
            onClick={handleAddProperty} // call your addProperty dispatch
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    {showViewModal && selectedUser && (
  // <div className="fixed  mt-2 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
   <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto">

   <div className="bg-white rounded-lg w-full max-w-4xl mx-4 my-10 shadow-lg">

      <div className="p-6 ">
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

    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Amenities */}
  {selectedUser.amenities?.length > 0 && (
    <div>
      <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
      <div className="flex flex-wrap gap-2 text-sm">
        {selectedUser.amenities.map((a, i) => (
          <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-gray-800">{a}</span>
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
          <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-gray-800">{r}</span>
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
                    <p>Price: ₹{room.price}</p>
                    <p>
                      Amenities:{" "}
                      {room.amenities && room.amenities.join(", ")}
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

      {/* <EditPropertyModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        propertyId={property.id}
      /> */}

    </div>
  );
};

export default PropertyPage;