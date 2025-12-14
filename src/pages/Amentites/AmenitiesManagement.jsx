import React, { useState, useEffect } from "react";
import {
  Upload,
  Trash2,
  Plus,
  AlertCircle,
  Edit2,
  Save,
  X,
} from "lucide-react";

export default function AmenitiesManagement() {
  const [activeTab, setActiveTab] = useState("property");
  const [propertyAmenities, setPropertyAmenities] = useState([]);
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [newAmenity, setNewAmenity] = useState({
    name: "",
    icon: null,
    iconPreview: "",
  });

  // Fetch amenities on mount and tab change
  useEffect(() => {
    fetchAmenities();
  }, [activeTab]);

  const fetchAmenities = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint =
        activeTab === "property"
          ? "https://root.roombookkro.com/api/get-amenities/property"
          : "https://root.roombookkro.com/api/get-amenities/room";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: "Bearer YOUR_TOKEN_HERE", // Replace with actual token
        },
      });

      const data = await response.json();

      if (data.data) {
        if (activeTab === "property") {
          setPropertyAmenities(data.data);
        } else {
          setRoomAmenities(data.data);
        }
      }
    } catch (err) {
      setError("Failed to fetch amenities: " + err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAmenity((prev) => ({
        ...prev,
        icon: file,
        iconPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleAddAmenity = async () => {
    setError("");

    if (!newAmenity.name.trim()) {
      setError("Please enter amenity name");
      return;
    }

    if (!newAmenity.icon) {
      setError("Please upload an icon");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", newAmenity.name);
      formData.append("icon", newAmenity.icon);

      const endpoint =
        activeTab === "property"
          ? "https://root.roombookkro.com/api/add-amenity/property"
          : "https://root.roombookkro.com/api/add-amenity/room";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: "Bearer YOUR_TOKEN_HERE", // Replace with actual token
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setNewAmenity({ name: "", icon: null, iconPreview: "" });
        fetchAmenities();
      } else {
        setError(data.message || "Failed to add amenity");
      }
    } catch (err) {
      setError("Failed to add amenity: " + err.message);
      console.error("Add error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAmenity = async (id) => {
    if (!confirm("Are you sure you want to delete this amenity?")) return;

    try {
      setLoading(true);

      const endpoint =
        activeTab === "property"
          ? `https://root.roombookkro.com/api/delete-amenity/property/${id}`
          : `https://root.roombookkro.com/api/delete-amenity/room/${id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer YOUR_TOKEN_HERE", // Replace with actual token
        },
      });

      if (response.ok) {
        fetchAmenities();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete amenity");
      }
    } catch (err) {
      setError("Failed to delete amenity: " + err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentAmenities =
    activeTab === "property" ? propertyAmenities : roomAmenities;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Amenities Management
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Manage property and room amenities
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-slate-200 overflow-x-auto">
          {[
            { id: "property", label: "Property Amenities" },
            { id: "room", label: "Room Amenities" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Left: Amenities List */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 flex items-center justify-between">
                <span>Current Amenities</span>
                <span className="text-sm font-normal text-slate-500">
                  {currentAmenities.length} items
                </span>
              </h2>

              {loading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              )}

              <div className="space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
                {!loading && currentAmenities.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Upload size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm sm:text-base">
                      No amenities added yet
                    </p>
                  </div>
                )}

                {currentAmenities.map((amenity) => (
                  <div
                    key={amenity._id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-green-500 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={amenity.icon}
                          alt={amenity.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">
                          {amenity.name}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 truncate">
                          ID: {amenity._id}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAmenity(amenity._id)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      disabled={loading}
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Add Form */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Plus size={18} className="sm:w-5 sm:h-5 text-indigo-600" />
                Add New Amenity
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle
                    size={18}
                    className="text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs sm:text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Amenity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Restaurant, WiFi, Laundry"
                    value={newAmenity.name}
                    onChange={(e) =>
                      setNewAmenity((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm"
                  />
                </div>

                {/* Icon Upload */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Icon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    onChange={handleFileChange}
                    className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />

                  {newAmenity.iconPreview && (
                    <div className="mt-3 relative">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={newAmenity.iconPreview}
                          alt="Preview"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setNewAmenity((prev) => ({
                            ...prev,
                            icon: null,
                            iconPreview: "",
                          }))
                        }
                        className="absolute top-0 right-1/2 transform translate-x-12 sm:translate-x-16 bg-white shadow-md hover:bg-red-500 hover:text-white rounded-full p-1.5 text-xs transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleAddAmenity}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg"
                >
                  <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {loading ? "Adding..." : "Add Amenity"}
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-xs sm:text-sm text-indigo-800">
                  <strong>Note:</strong> Icons should be in PNG, JPG, or SVG
                  format. Recommended size: 512x512px for best quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
