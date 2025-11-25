{/*  */}

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
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
  Globe,
  Home,
} from "lucide-react";
import Card from "../../reusable_components/Card";
import StatCard from "../../reusable_components/StatCard";
import PieChartComponent from "../../reusable_components/PieChart";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProperty,
  addProperty,
  deleteProperty,
  editProperty,
} from "../../redux/slices/propertySlice";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import Loader from "../Loader/Loader";
import commisionIcon from "../../../src/assets/commision.png";
import verifyIcon from "../../../src/assets/verify.png";
import ViewProperty from "./viewProperty";
const AddProperty = ({ onClose, onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState("");
    const [manualLocation, setManualLocation] = useState(false);
    // Inside your PropertyPage component, add state for upload progress
    const [uploadProgress, setUploadProgress] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [cityQuery, setCityQuery] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [isUploading, setIsUploading] = useState(false);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser.userId;
    const userType = storedUser.user_type;
      const dispatch = useDispatch();
      const {
        data: properties,
        loading,
        error,
      } = useSelector((state) => state.property);
    
      useEffect(() => {
        dispatch(fetchProperty());
      }, [dispatch]);

      const [newProperty, setNewProperty] = useState({
        userId,
        userType,
        name: "",
        type: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        lat: 0,
        lng: 0,
        mainImage: null,
        images: [],
        commision: 0,
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
        rating: 5,
        availableRooms: 0,
        isAvailable: true,
      });

      const handleCitySearch = async (e) => {
        e.preventDefault();
        if (!cityQuery.trim()) return;
    
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            cityQuery
          )}&addressdetails=1&limit=5&countrycodes=in`
        );
        const data = await res.json();
        setCityResults(data);
      };
    
      const handleAreaSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim() || !selectedCity) return;
    
        const fullQuery = `${searchQuery}, ${selectedCity.display_name}`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullQuery
          )}&addressdetails=1&limit=10`
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
              L.marker([lat, lon])
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
    
      const handleRoomImages = (e, i) => {
        const files = Array.from(e.target.files);
        const updated = [...newProperty.rooms];
        updated[i].images = [...(updated[i].images || []), ...files];
        setNewProperty({ ...newProperty, rooms: updated });
      };
    
      const handlePropertyImages = (e) => {
        const files = Array.from(e.target.files);
        setNewProperty((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...files],
        }));
      };
    
      const handleAmenityChange = (index, field, value) => {
        const updatedAmenities = [...newProperty.amenities];
        updatedAmenities[index][field] = value;
        setNewProperty({ ...newProperty, amenities: updatedAmenities });
      };
    
      const handleAddAmenity = () => {
        setNewProperty({
          ...newProperty,
          amenities: [...newProperty.amenities, { name: "", icon: null }],
        });
      };
    
      const handleRemoveAmenity = (index) => {
        const updatedAmenities = newProperty.amenities.filter(
          (_, i) => i !== index
        );
        setNewProperty({ ...newProperty, amenities: updatedAmenities });
      };

        const handleAddProperty = async () => {
          try {
            // Validation
            if (
              !newProperty.name ||
              !newProperty.type ||
              !newProperty.address ||
              !newProperty.city
            ) {
              toast.error("Please fill all required fields!");
              return;
            }
      
            if (!newProperty.mainImage) {
              toast.error("Main image is required!");
              return;
            }
      
            if (newProperty.rooms.length === 0) {
              toast.error("Please add at least one room!");
              return;
            }
            setIsUploading(true);
            setUploadProgress(0);
      
            const formData = new FormData();
      
            // Basic info
            formData.append("userId", String(newProperty.userId));
            formData.append("userType", String(newProperty.userType));
            formData.append("name", newProperty.name);
            formData.append("type", newProperty.type);
            formData.append("address", newProperty.address);
            formData.append("city", newProperty.city);
            formData.append("state", newProperty.state);
            formData.append("pincode", newProperty.pincode);
            formData.append("description", newProperty.description);
            formData.append("contactNumber", newProperty.contactNumber);
            formData.append("email", newProperty.email);
            formData.append("website", newProperty.website || "");
            formData.append("owner", newProperty.owner);
            formData.append("role", "Owner");
            formData.append("discount", newProperty.discount || 0);
            formData.append("tax", newProperty.tax || 0);
            formData.append("oldMrp", newProperty.oldMrp || 0);
            formData.append("commision", newProperty.commision || 0);
      
            // Price based on type
            if (newProperty.type === "hotel") {
              formData.append("pricePerNight", newProperty.pricePerNight || 0);
              formData.append("pricePerMonth", 0);
              formData.append("depositAmount", 0);
            } else {
              formData.append("pricePerMonth", newProperty.pricePerMonth || 0);
              formData.append("depositAmount", newProperty.depositAmount || 0);
              formData.append("pricePerNight", 0);
            }
      
            // Coordinates as JSON string
            formData.append(
              "coordinates",
              JSON.stringify({
                lat: newProperty.lat || 0,
                lng: newProperty.lng || 0,
              })
            );
      
            // ✅ MAIN IMAGE - This is critical!
            if (newProperty.mainImage instanceof File) {
              formData.append(
                "mainImage",
                newProperty.mainImage,
                newProperty.mainImage.name
              );
            } else {
              toast.error("Main image must be a valid file!");
              return;
            }
      
            // Property Gallery Images
            if (newProperty.images && newProperty.images.length > 0) {
              newProperty.images.forEach((img) => {
                if (img instanceof File) {
                  formData.append("images", img, img.name);
                }
              });
            }
      
            // Property-level amenities
            const amenityNames = newProperty.amenities
              .map((a) => a.name)
              .filter((n) => n && n.trim())
              .join(",");
      
            if (amenityNames) {
              formData.append("amenitiesMainName", amenityNames);
      
              // Amenity icons
              newProperty.amenities.forEach((a) => {
                if (a.icon instanceof File) {
                  formData.append("amenitiesMainIcon", a.icon, a.icon.name);
                }
              });
            }
      
            // Rooms data - Arrays for multiple rooms
            const roomTypes = [];
            const furnishedTypes = [];
            const occupancies = [];
            const prices = [];
            const availableUnits = [];
            const pricePerDayArr = [];
      
            newProperty.rooms.forEach((room, i) => {
              roomTypes.push(room.roomType);
              furnishedTypes.push(room.furnished);
              occupancies.push(room.occupancy);
              prices.push(room.price);
              availableUnits.push(room.availableUnits || room.units || 0);
      
              // For hotels, use room price as pricePerDay
              if (newProperty.type === "hotel") {
                pricePerDayArr.push(room.price);
              }
      
              // Room images
              if (room.images && room.images.length > 0) {
                room.images.forEach((img) => {
                  if (img instanceof File) {
                    formData.append(`roomImages[${i}]`, img, img.name);
                  }
                });
                formData.append(`roomImagesCount[${i}]`, room.images.length);
              } else {
                formData.append(`roomImagesCount[${i}]`, 0);
              }
      
              // Room amenities
              const roomAmenityNames = room.amenities
                ?.map((a) => a.name)
                .filter((n) => n && n.trim())
                .join(",");
      
              if (roomAmenityNames) {
                formData.append(`amenities.name[${i}]`, roomAmenityNames);
      
                // Room amenity icons
                let iconCount = 0;
                room.amenities?.forEach((a) => {
                  if (a.icon instanceof File) {
                    formData.append(`amenities.icon[${i}]`, a.icon, a.icon.name);
                    iconCount++;
                  }
                });
                formData.append(`roomAmenitiesCount[${i}]`, iconCount);
              } else {
                formData.append(`roomAmenitiesCount[${i}]`, 0);
              }
      
              // Room availability
              formData.append("isAvailable", "true");
            });
      
            // Append room arrays
            roomTypes.forEach((rt) => formData.append("roomType", rt));
            furnishedTypes.forEach((f) => formData.append("furnished", f));
            occupancies.forEach((o) => formData.append("occupancy", o));
            prices.forEach((p) => formData.append("price", p));
            availableUnits.forEach((au) => formData.append("availableUnits", au));
      
            if (newProperty.type === "hotel" && pricePerDayArr.length > 0) {
              pricePerDayArr.forEach((ppd) => formData.append("pricePerDay", ppd));
            }
      
            // Rules as JSON
            if (Array.isArray(newProperty.rules) && newProperty.rules.length > 0) {
              const filteredRules = newProperty.rules.filter((r) => r && r.trim());
              if (filteredRules.length > 0) {
                formData.append("rules", JSON.stringify(filteredRules));
              }
            }
      
            // Debug log
            console.log("✅ Final FormData:");
            for (const [key, value] of formData.entries()) {
              if (value instanceof File) {
                console.log(`${key}: File ->`, {
                  name: value.name,
                  type: value.type,
                  size: `${value.size} bytes`,
                });
              } else {
                console.log(`${key}: ${typeof value} ->`, value);
              }
            }
      
            // Send request
            await dispatch(addProperty(formData))
              .unwrap()
              .then(() => {
                setShowAddModal(false);
                onClose();
                // Reset form
                setNewProperty({
                  userId,
                  userType,
                  name: "",
                  type: "",
                  address: "",
                  city: "",
                  state: "",
                  pincode: "",
                  lat: 0,
                  lng: 0,
                  mainImage: null,
                  images: [],
                  commision: 0,
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
                  rating: 5,
                  availableRooms: 0,
                  isAvailable: true,
                });
              })
              .catch((err) => {
                toast.error(err?.message || "Failed to add property");
                console.error("❌ Error adding property:", err);
              });
      
            dispatch(fetchProperty());
          } catch (err) {
            console.error("❌ Error adding property:", err);
            toast.error(err?.message || err || "Failed to add property");
          } finally {
            setIsUploading(false);
            setUploadProgress(0);
          }
        };
      
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
                units: 0,
                amenities: [],
                images: [],
              },
            ],
          }));
        };

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

          if (isUploading) {
            return <Loader />;
          }

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto scrollbar-hide">
          <div className="bg-white rounded-lg w-full max-w-5xl mx-4 my-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Add New Property</h2>
                <button
                  onClick={() => onClose()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter property name"
                      value={newProperty.name}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, name: e.target.value })
                      }
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Property Type *
                    </label>
                    <select
                      value={newProperty.type}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, type: e.target.value })
                      }
                      className="border rounded px-3 py-2 w-full"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="pg">PG</option>
                      <option value="hotel">Hotel</option>
                      <option value="apartment">Apartment</option>
                    </select>
                  </div>
                </div>

                {/* Address Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Address *</label>
                    <input
                      type="text"
                      placeholder="Enter address"
                      value={newProperty.address}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          address: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">City *</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={newProperty.city}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, city: e.target.value })
                      }
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                </div>

                {/* State & Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">State *</label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      value={newProperty.state}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          state: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Pincode *</label>
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      value={newProperty.pincode}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          pincode: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                </div>

                {/* Coordinates Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-lg font-semibold mb-3">
                    📍 Property Location *
                  </label>

                  <div className="flex gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUploading(true);
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const { latitude, longitude } = position.coords;
                              setNewProperty((prev) => ({
                                ...prev,
                                lat: latitude,
                                lng: longitude,
                              }));
                              setIsUploading(false);
                              toast.success(
                                "✅ Current location added successfully!"
                              );
                            },
                            () =>
                              toast.warn(
                                "⚠️ Please allow location access or try manual selection."
                              )
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-1">Latitude</label>
                      <input
                        type="number"
                        value={newProperty.lat}
                        readOnly
                        className="border rounded px-3 py-2 w-full bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        value={newProperty.lng}
                        readOnly
                        className="border rounded px-3 py-2 w-full bg-gray-100"
                      />
                    </div>
                  </div>

                  {manualLocation && (
                    <div className="mt-4 bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold">
                          Select Property Location
                        </h2>
                        <button
                          onClick={() => setManualLocation(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>

                      <form
                        onSubmit={handleCitySearch}
                        className="flex gap-2 mb-3"
                      >
                        <input
                          type="text"
                          value={cityQuery}
                          onChange={(e) => setCityQuery(e.target.value)}
                          placeholder="Search city (e.g. Kanpur)"
                          className="border rounded px-3 py-2 w-full"
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Search
                        </button>
                      </form>

                      {cityResults.length > 0 && (
                        <ul className="bg-gray-50 border rounded mb-3 max-h-40 overflow-auto">
                          {cityResults.map((c, i) => (
                            <li
                              key={i}
                              className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                                selectedCity?.display_name === c.display_name
                                  ? "bg-blue-100 font-semibold"
                                  : ""
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

                      {selectedCity && (
                        <form
                          onSubmit={handleAreaSearch}
                          className="flex gap-2 mb-3"
                        >
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search areas within ${
                              selectedCity.display_name.split(",")[0]
                            }`}
                            className="border rounded px-3 py-2 w-full"
                          />
                          <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded"
                          >
                            Search
                          </button>
                        </form>
                      )}

                      <div
                        id="map"
                        className="h-96 w-full rounded-md border"
                      ></div>

                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          onClick={() => setManualLocation(false)}
                          className="px-4 py-2 bg-gray-300 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setNewProperty({
                              ...newProperty,
                              lat: selectedCoords.lat,
                              lng: selectedCoords.lng,
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
                    <label className="block font-medium mb-1">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter owner name"
                      value={newProperty.owner}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          owner: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter contact number"
                      value={newProperty.contactNumber}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          contactNumber: e.target.value,
                        })
                      }
                      maxLength={10}
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={newProperty.email}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          email: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Website (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter website URL"
                    value={newProperty.website}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        website: e.target.value,
                      })
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>

                {/* Main Image */}
                <div>
                  <label className="block font-medium mb-1">Main Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewProperty((prev) => ({
                          ...prev,
                          mainImage: file,
                        }));
                      }
                    }}
                    className="border rounded px-3 py-2 w-full"
                    required
                  />
                  {newProperty.mainImage && (
                    <img
                      src={URL.createObjectURL(newProperty.mainImage)}
                      alt="Preview"
                      className="mt-2 h-24 w-24 object-cover rounded"
                    />
                  )}
                </div>

                {/* Property Images */}
                <div>
                  <label className="block font-medium mb-1">
                    Property Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePropertyImages}
                    className="border rounded px-3 py-2 w-full"
                  />
                  {newProperty.images?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {newProperty.images.map((file, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(file)}
                          alt={`preview-${idx}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Commission (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter monthly price"
                    value={newProperty.commision}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        commision: parseInt(e.target.value) || 0,
                      })
                    }
                    className="border rounded px-3 py-2 w-full"
                    required
                  />
                </div>
                {/* Conditional Price Fields */}
                {newProperty.type === "hotel" && (
                  <div>
                    <label className="block font-medium mb-1">
                      Price per Night (₹) *
                    </label>
                    <input
                      type="number"
                      placeholder="Enter nightly price"
                      value={newProperty.pricePerNight}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          pricePerNight: parseInt(e.target.value) || 0,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                )}

                {(newProperty.type === "pg" ||
                  newProperty.type === "apartment") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-1">
                        Price per Month (₹) *
                      </label>
                      <input
                        type="number"
                        placeholder="Enter monthly price"
                        value={newProperty.pricePerMonth}
                        onChange={(e) =>
                          setNewProperty({
                            ...newProperty,
                            pricePerMonth: parseInt(e.target.value) || 0,
                          })
                        }
                        className="border rounded px-3 py-2 w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        Deposit Amount (₹) *
                      </label>
                      <input
                        type="number"
                        placeholder="Enter deposit amount"
                        value={newProperty.depositAmount}
                        onChange={(e) =>
                          setNewProperty({
                            ...newProperty,
                            depositAmount: parseInt(e.target.value) || 0,
                          })
                        }
                        className="border rounded px-3 py-2 w-full"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Discount / Rating / Tax */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter discount percentage"
                      value={newProperty.discount}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          discount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Old MRP (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter old price"
                      value={newProperty.oldMrp}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          oldMrp: parseFloat(e.target.value) || 0,
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
                          tax: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>

                {/* Amenities & Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Amenities
                    </label>

                    {newProperty.amenities.map((amenity, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <input
                          type="text"
                          placeholder="Amenity Name"
                          value={amenity.name}
                          onChange={(e) =>
                            handleAmenityChange(index, "name", e.target.value)
                          }
                          className="border px-3 py-2 rounded w-1/2"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleAmenityChange(index, "icon", file);
                            }
                          }}
                          className="border px-3 py-2 rounded w-1/2"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddAmenity}
                      className="text-blue-600 hover:underline text-sm mt-2"
                    >
                      + Add Amenity
                    </button>
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
                          rules: e.target.value.split(",").map((r) => r.trim()),
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>

                {/* Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block font-medium mb-1">
                      Available Rooms
                    </label>
                    <input
                      type="number"
                      placeholder="Enter available rooms"
                      value={newProperty.availableRooms}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          availableRooms: parseInt(e.target.value) || 0,
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
                      setNewProperty({
                        ...newProperty,
                        description: e.target.value,
                      })
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
                      type="button"
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
                        type="button"
                        className="absolute top-2 right-2 text-red-500"
                      >
                        ✕
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium mb-1">
                            Room Type *
                          </label>
                          <select
                            value={room.roomType}
                            onChange={(e) => {
                              const updated = [...newProperty.rooms];
                              updated[i].roomType = e.target.value;
                              setNewProperty({
                                ...newProperty,
                                rooms: updated,
                              });
                            }}
                            className="border rounded px-3 py-2 w-full"
                            required
                          >
                            <option value="">Select Room Type</option>
                            <option value="suite">Suite</option>
                            <option value="1bhk">1BHK</option>
                            <option value="quad">Quad</option>
                            <option value="triple">Triple Room</option>
                            <option value="double">Double Room</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-medium mb-1">
                            Furnishing *
                          </label>
                          <select
                            value={room.furnished}
                            onChange={(e) => {
                              const updated = [...newProperty.rooms];
                              updated[i].furnished = e.target.value;
                              setNewProperty({
                                ...newProperty,
                                rooms: updated,
                              });
                            }}
                            className="border rounded px-3 py-2 w-full"
                            required
                          >
                            <option value="">Select</option>
                            <option value="furnished">Furnished</option>
                            <option value="semi-furnished">
                              Semi-Furnished
                            </option>
                            <option value="unfurnished">Unfurnished</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-medium mb-1">
                            Number of Available Units *
                          </label>
                          <input
                            type="number"
                            placeholder="Enter available units"
                            value={room.units || ""}
                            onChange={(e) => {
                              const updated = [...newProperty.rooms];
                              updated[i].units = parseInt(e.target.value) || 0;
                              updated[i].availableUnits =
                                parseInt(e.target.value) || 0;
                              setNewProperty({
                                ...newProperty,
                                rooms: updated,
                              });
                            }}
                            className="border rounded px-3 py-2 w-full"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-medium mb-1">
                            Occupancy *
                          </label>
                          <input
                            type="number"
                            placeholder="Enter occupancy limit"
                            value={room.occupancy || ""}
                            onChange={(e) => {
                              const updated = [...newProperty.rooms];
                              updated[i].occupancy =
                                parseInt(e.target.value) || 0;
                              setNewProperty({
                                ...newProperty,
                                rooms: updated,
                              });
                            }}
                            className="border rounded px-3 py-2 w-full"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-medium mb-1">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            placeholder="Enter room price"
                            value={room.price || ""}
                            onChange={(e) => {
                              const updated = [...newProperty.rooms];
                              updated[i].price = parseInt(e.target.value) || 0;
                              setNewProperty({
                                ...newProperty,
                                rooms: updated,
                              });
                            }}
                            className="border rounded px-3 py-2 w-full"
                            required
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block font-medium mb-1">
                            Room Images
                          </label>
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
                                  src={URL.createObjectURL(img)}
                                  alt={`room-${idx}`}
                                  className="h-16 w-16 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="col-span-2 space-y-4 mt-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Room Amenities
                          </label>

                          {room.amenities?.map((a, index) => (
                            <div
                              key={index}
                              className="flex gap-3 items-center"
                            >
                              <input
                                type="text"
                                placeholder="Amenity Name"
                                value={a.name}
                                onChange={(e) => {
                                  const updated = [...newProperty.rooms];
                                  updated[i].amenities[index].name =
                                    e.target.value;
                                  setNewProperty({
                                    ...newProperty,
                                    rooms: updated,
                                  });
                                }}
                                className="border px-3 py-2 rounded w-1/2"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const updated = [...newProperty.rooms];
                                    updated[i].amenities[index].icon = file;
                                    setNewProperty({
                                      ...newProperty,
                                      rooms: updated,
                                    });
                                  }
                                }}
                                className="border px-3 py-2 rounded w-1/2"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...newProperty.rooms];
                                  updated[i].amenities.splice(index, 1);
                                  setNewProperty({
                                    ...newProperty,
                                    rooms: updated,
                                  });
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...newProperty.rooms];
                              if (!updated[i].amenities) {
                                updated[i].amenities = [];
                              }
                              updated[i].amenities.push({
                                name: "",
                                icon: null,
                              });
                              setNewProperty({
                                ...newProperty,
                                rooms: updated,
                              });
                            }}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            + Add Amenity
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => onClose()}
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProperty}
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default AddProperty;