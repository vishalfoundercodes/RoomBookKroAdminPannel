import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProperty, editPropertyFormData, fetchProperty } from "../../redux/slices/propertySlice";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { X } from "lucide-react";

export default function EditPropertyModal({
  show,
  onClose,
  propertyId,
  selectedUser,
}) {
  const dispatch = useDispatch();
  const {
    data: properties,
    loading,
    error,
  } = useSelector((state) => state.property);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userId = storedUser.userId;
  const userType = storedUser.user_type;

const emptyState = {
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
  commision: 0, // ← number
  pricePerMonth: 0, // ← number
  pricePerNight: 0, // ← number
  depositAmount: 0, // ← number
  discount: 0, // ← number
  oldMrp: 0, // ← number
  tax: 0, // ← number
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
};

  const [form, setForm] = useState(emptyState);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // helper to find property from redux by id variations
  const findPropertyById = (id, list) => {
    if (!list || !id) return null;
    return (
      list.find((p) => p.residencyId === id) ||
      list.find((p) => p._id === id) ||
      list.find((p) => p.id === id) ||
      null
    );
  };

  // Prefill form if selectedUser prop provided or propertyId given
  useEffect(() => {
    let prop = null;
    if (selectedUser) {
      prop = selectedUser;
    } else if (propertyId && properties) {
      prop = findPropertyById(propertyId, properties);
    }

    if (prop) {
      const coords = prop.coordinates ||
        prop.coords || { lat: prop.lat || 0, lng: prop.lng || 0 };
      setForm((prev) => ({
        ...prev,
        userId: prop.userId || prev.userId,
        userType: prop.userType || prev.userType,
        name: prop.name || "",
        type: prop.type || "",
        address: prop.address || "",
        city: prop.city || "",
        state: prop.state || "",
        pincode: prop.pincode || "",
        lat: coords.lat || 0,
        lng: coords.lng || 0,
        mainImage: prop.mainImage || prop.mainImageUrl || null,
        images: prop.images || prop.propertyImages || [],

        // Convert all numeric values to strings
        commision: prop.commision || 0, // ← number
        pricePerMonth: prop.pricePerMonth || 0, // ← number
        pricePerNight: prop.pricePerNight || 0, // ← number
        depositAmount: prop.depositAmount || 0, // ← number
        discount: prop.discount || 0, // ← number
        oldMrp: prop.oldMrp || 0, // ← number
        tax: prop.tax || 0,

        rooms: Array.isArray(prop.rooms)
          ? prop.rooms.map((r) => ({ ...r }))
          : [],
        amenities: Array.isArray(prop.amenities)
          ? prop.amenities.map((a) => ({ ...a }))
          : [],
        rules: Array.isArray(prop.rules) ? prop.rules.map((r) => r) : [],
        contactNumber: prop.contactNumber || "",
        email: prop.email || "",
        website: prop.website || "",
        owner: prop.owner || "",
        description: prop.description || "",
        rating: prop.rating || 5,
        availableRooms: prop.availableRooms || 0,
        isAvailable:
          typeof prop.isAvailable === "boolean" ? prop.isAvailable : true,
      }));
    }
  }, [selectedUser, propertyId, properties]);

  useEffect(() => {
    // If propertyId provided but properties not loaded, fetch
    if (
      !selectedUser &&
      propertyId &&
      (!properties || properties.length === 0)
    ) {
      dispatch(fetchProperty());
    }
  }, [dispatch, propertyId, properties, selectedUser]);

  if (!show) return null;
  if (isUploading) return <Loader />;

  // ---------- handlers ----------
const handleSimpleChange = (e) => {
  const { name, value, type } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
  }));
};

const handleNumberChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: value === "" ? "" : Number(value),
  }));
};

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  };



  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Original File object store karega
    setForm((prev) => ({
      ...prev,
      mainImage: file,
    }));
  };


  const handlePropertyImages = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...files],
    }));
  };

  const handleRoomImages = (e, idx) => {
    const files = Array.from(e.target.files || []);
    const updated = [...form.rooms];
    updated[idx] = {
      ...updated[idx],
      images: [...(updated[idx].images || []), ...files],
    };
    setForm((prev) => ({ ...prev, rooms: updated }));
  };

  const handleAddRoom = () => {
    setForm((prev) => ({
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

  const handleAddAmenity = () => {
    setForm((prev) => ({
      ...prev,
      amenities: [...(prev.amenities || []), { name: "", icon: null }],
    }));
  };

  const handleAmenityChange = (index, field, value) => {
    const updated = [...(form.amenities || [])];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, amenities: updated }));
  };

  const handleRemoveAmenity = (index) => {
    const updated = (form.amenities || []).filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, amenities: updated }));
  };

  const handleRemoveImageAtIndex = (idx) => {
    const updated = [...(form.images || [])];
    updated.splice(idx, 1);
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const handleRemoveRoom = (idx) => {
    const updated = [...(form.rooms || [])];
    updated.splice(idx, 1);
    setForm((prev) => ({ ...prev, rooms: updated }));
  };

  const handleRoomAmenityAdd = (roomIdx) => {
    const updated = [...form.rooms];
    if (!updated[roomIdx].amenities) updated[roomIdx].amenities = [];
    updated[roomIdx].amenities.push({ name: "", icon: null });
    setForm((prev) => ({ ...prev, rooms: updated }));
  };



  const handleRoomAmenityRemove = (roomIdx, amenIdx) => {
    const updated = [...form.rooms];
    updated[roomIdx].amenities.splice(amenIdx, 1);
    setForm((prev) => ({ ...prev, rooms: updated }));
  };

  // ---------- submit ----------
  const handleSubmit = async () => {
    try {
      // basic validations (name/address/coords are readonly so we only check existence)
      if (!form.name || !form.address) {
        toast.error("Missing property identity fields.");
        return;
      }
      if (!form.mainImage) {
        toast.error("Main image required.");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      const fd = new FormData();

      // Identity fields (readonly but include them)
      fd.append("userId", String(form.userId || userId));
      fd.append("userType", String(form.userType || userType));
      fd.append("name", form.name || "");
      fd.append("address", form.address || "");
      fd.append("city", form.city || "");
      fd.append("state", form.state || "");
      fd.append("pincode", form.pincode || "");
      fd.append("description", form.description || "");
      fd.append("contactNumber", form.contactNumber || "");
      fd.append("email", form.email || "");
      fd.append("website", form.website || "");
      fd.append("owner", form.owner || "");
      fd.append("role", "Owner");
      fd.append("discount", form.discount || 0);
      fd.append("tax", form.tax || 0);
      fd.append("oldMrp", form.oldMrp || 0);
      fd.append("commision", form.commision || 0);
      fd.append("mainImage", form.mainImage);


      // Price logic
      if (form.type === "hotel") {
        fd.append("pricePerNight", Number(form.pricePerNight) || 0);
        fd.append("pricePerMonth", 0);
        fd.append("depositAmount", 0);
      } else {
        fd.append("pricePerMonth", form.pricePerMonth || 0);
        fd.append("depositAmount", form.depositAmount || 0);
        fd.append("pricePerNight", 0);
      }

      // coordinates included but readonly
      fd.append(
        "coordinates",
        JSON.stringify({
          lat: form.lat || 0,
          lng: form.lng || 0,
        })
      );

      // main image (if file object provided use it, else existing URL string is preserved by backend if you choose)
      // if (form.mainImage instanceof File) {
      //   fd.append("mainImage", form.mainImage, form.mainImage.name);
      // } else if (typeof form.mainImage === "string") {
      //   // if backend supports replacing via url or expects no change, don't append file
      //   // Append a field to indicate existing image string (optional, remove if backend doesn't need it)
      //   fd.append("mainImageUrl", form.mainImage);
      // }

      // images
      if (form.images && form.images.length > 0) {
        form.images.forEach((img) => {
          if (img instanceof File) fd.append("images", img, img.name);
          else if (typeof img === "string") fd.append("imagesUrl", img);
        });
      }

      // amenities
      const amenityNames = (form.amenities || [])
        .map((a) => a.name)
        .filter(Boolean)
        .join(",");
      if (amenityNames) {
        fd.append("amenitiesMainName", amenityNames);
        form.amenities.forEach((a) => {
          if (a.icon instanceof File)
            fd.append("amenitiesMainIcon", a.icon, a.icon.name);
        });
      }

      // rooms arrays
      // ✅ ROOM ARRAYS
      const roomTypes = [];
      const furnishedTypes = [];
      const occupancies = [];
      const prices = [];
      const availableUnits = [];

      form.rooms.forEach((room, i) => {
        roomTypes.push(room.roomType || "");
        furnishedTypes.push(room.furnished || "");
        occupancies.push(room.occupancy || 0);
        prices.push(room.price || 0);
        availableUnits.push(room.availableUnits || room.units || 0);

        // ✅ ROOM-SPECIFIC pricePerDay (WITH INDEX)
        // if (form.type === "hotel" && room.roomPricePerDay) {
        //   fd.append(`roomPricePerDay[${i}]`, Number(room.roomPricePerDay) || 0);
        // }

        // Room images handling...
        if (room.images && room.images.length > 0) {
          room.images.forEach((img) => {
            if (img instanceof File) {
              fd.append(`roomImages[${i}]`, img, img.name);
            } else if (typeof img === "string") {
              fd.append(`roomImagesUrl[${i}]`, img);
            }
          });
          fd.append(`roomImagesCount[${i}]`, room.images.length);
        } else {
          fd.append(`roomImagesCount[${i}]`, 0);
        }

        // Room amenities handling...
        const roomAmenityNames = (room.amenities || [])
          .map((a) => a.name)
          .filter(Boolean)
          .join(",");
        if (roomAmenityNames) {
          fd.append(`amenities.name[${i}]`, roomAmenityNames);
          let iconCount = 0;
          room.amenities.forEach((a) => {
            if (a.icon instanceof File) {
              fd.append(`amenities.icon[${i}]`, a.icon, a.icon.name);
              iconCount++;
            } else if (typeof a.icon === "string") {
              fd.append(`amenities.iconUrl[${i}]`, a.icon);
            }
          });
          fd.append(`roomAmenitiesCount[${i}]`, iconCount);
        } else {
          fd.append(`roomAmenitiesCount[${i}]`, 0);
        }
      });

      // Append room arrays
      roomTypes.forEach((rt) => fd.append("roomType", rt));
      furnishedTypes.forEach((f) => fd.append("furnished", f));
      occupancies.forEach((o) => fd.append("occupancy", o));
      prices.forEach((p) => fd.append("price", p));
      availableUnits.forEach((au) => fd.append("availableUnits", au));
      // if (form.type === "hotel" && pricePerDayArr.length > 0) {
      //   pricePerDayArr.forEach((ppd) => fd.append("pricePerDay", ppd));
      // }

      // rules
      if (Array.isArray(form.rules) && form.rules.length > 0) {
        const filteredRules = form.rules.filter((r) => r && r.trim());
        if (filteredRules.length > 0)
          fd.append("rules", JSON.stringify(filteredRules));
      }

      // debug (optional)
      // for (const [k, v] of fd.entries()) console.log(k, v);
      // DEBUG LOG — print full FormData before API call
      console.log("🔵 FINAL FORMDATA BEFORE API CALL:");
      for (const [key, value] of fd.entries()) {
        if (value instanceof File) {
          console.log(`${key}: FILE →`, value);
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.log("🔵 END OF FORMDATA LOG -----------------------");

      // dispatch edit action
      const idToSend =
        (selectedUser &&
          (selectedUser.residencyId || selectedUser._id || selectedUser.id)) ||
        propertyId;
      await dispatch(editPropertyFormData({ id: idToSend, payload: fd }))
        .unwrap()
        .then(() => {
          dispatch(fetchProperty());
          onClose();
        })
        .catch((err) => {
          console.error("Edit failed:", err);
        });
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ---------- small sub-components for clean markup ----------
  const Input = memo(
    ({
      label,
      name,
      value,
      onChange,
      type = "text",
      readOnly = false,
      placeholder = "",
      ...rest
    }) => (
      <div>
        {label && (
          <label className="block font-medium mb-1 text-sm text-gray-700">
            {label}
          </label>
        )}
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`border rounded px-3 py-2 w-full ${
            readOnly ? "bg-gray-100" : ""
          }`}
          {...rest}
        />
      </div>
    )
  );

  const FilePreview = ({
    fileOrUrl,
    alt = "preview",
    className = "h-24 w-24 object-cover rounded",
  }) => {
    if (!fileOrUrl) return null;
    if (fileOrUrl instanceof File) {
      return (
        <img
          src={URL.createObjectURL(fileOrUrl)}
          alt={alt}
          className={className}
        />
      );
    }
    if (typeof fileOrUrl === "string") {
      return <img src={fileOrUrl} alt={alt} className={className} />;
    }
    return null;
  };

  // ---------- UI ----------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto scrollbar-hide">
      <div className="bg-white rounded-lg w-full max-w-5xl mx-4 my-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Edit Property</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* NOTE: Name / Address / Coordinates are READONLY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Property Name"
                name="name"
                value={form.name}
                readOnly
              />
              <Input
                label="Type"
                name="type"
                value={form.type}
                readOnly
                onChange={handleSimpleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Address"
                name="address"
                value={form.address}
                readOnly
              />
              <Input
                label="City"
                name="city"
                value={form.city}
                readOnly
                onChange={handleSimpleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="State"
                name="state"
                value={form.state}
                readOnly
                onChange={handleSimpleChange}
              />
              <Input
                label="Pincode"
                name="pincode"
                value={form.pincode}
                readOnly
                onChange={handleSimpleChange}
              />
              <div>
                <label className="block font-medium mb-1 text-sm text-gray-700">
                  Coordinates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="lat"
                    value={form.lat}
                    readOnly
                    className="border rounded px-3 py-2 w-full bg-gray-100"
                  />
                  <input
                    type="number"
                    name="lng"
                    value={form.lng}
                    readOnly
                    className="border rounded px-3 py-2 w-full bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Main + Gallery */}
            <div>
              <label className="block font-medium mb-1">Main Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="border rounded px-3 py-2 w-full"
              />

              {form.mainImage && (
                <div className="mt-2 relative inline-block">
                  <FilePreview fileOrUrl={form.mainImage} />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, mainImage: "" })}
                    className="absolute -top-1 -right-1 bg-transparent rounded-full p-1 text-red-500 "
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Property Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePropertyImages}
                className="border rounded px-3 py-2 w-full"
              />
              <div className="mt-2 flex gap-2 flex-wrap">
                {(form.images || []).map((img, idx) => (
                  <div key={idx} className="relative">
                    <FilePreview fileOrUrl={img} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImageAtIndex(idx)}
                      className="absolute -top-1 -right-1 bg-transparent rounded-full p-0.5 text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.type === "hotel" ? (
                <div>
                  <label className="block font-medium mb-1 text-sm text-gray-700">
                    Price per Night (₹)
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={form.pricePerNight || ""}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        pricePerNight: parseInt(e.target.value) || 0,
                      }));
                    }}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-medium mb-1 text-sm text-gray-700">
                      Price per Month (₹)
                    </label>
                    <input
                      type="number"
                      name="pricePerMonth"
                      value={form.pricePerMonth || ""}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          pricePerMonth: parseInt(e.target.value) || 0,
                        }));
                      }}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-sm text-gray-700">
                      Deposit (₹)
                    </label>
                    <input
                      name="depositAmount"
                      type="number"
                      value={form.depositAmount || ""}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          depositAmount: parseInt(e.target.value) || 0,
                        }));
                      }}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1 text-sm text-gray-700">
                  Commission (₹)
                </label>
                <input
                  type="number"
                  name="commision"
                  value={form.commision || ""}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      commision: parseInt(e.target.value) || 0,
                    }));
                  }}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={form.discount || ""}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      discount: parseInt(e.target.value) || 0,
                    }));
                  }}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm text-gray-700">
                  Tax (%)
                </label>
                <input
                  type="number"
                  name="tax"
                  value={form.tax || ""}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      tax: parseInt(e.target.value) || 0,
                    }));
                  }}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1 text-sm text-gray-700">
                  Owner Name
                </label>
                <input
                  name="owner"
                  value={form.owner}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      owner: e.target.value,
                    }));
                  }}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm text-gray-700">
                  Contact Number
                </label>
                <input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      contactNumber: e.target.value,
                    }));
                  }}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  }}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Website</label>
              <input
                name="website"
                value={form.website}
                onChange={handleSimpleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleSimpleChange}
                rows={3}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            {/* Amenities & Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Amenities</label>
                {(form.amenities || []).map((am, i) => (
                  <div key={i} className="flex gap-3 items-center mb-2">
                    <input
                      type="text"
                      value={am.name}
                      onChange={(e) =>
                        handleAmenityChange(i, "name", e.target.value)
                      }
                      placeholder="Amenity name"
                      className="border px-3 py-2 rounded w-1/2"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleAmenityChange(i, "icon", e.target.files?.[0])
                      }
                      accept="image/*"
                      className="border px-3 py-2 rounded w-1/2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(i)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Add Amenity
                </button>
              </div>

              <div>
                <label className="block font-medium mb-1">Rules</label>
                <input
                  type="text"
                  value={(form.rules || []).join(", ")}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      rules: e.target.value.split(",").map((r) => r.trim()),
                    }))
                  }
                  placeholder="No smoking, No pets"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>

            {/* Rooms */}
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

              {(form.rooms || []).map((room, ri) => (
                <div
                  key={ri}
                  className="border rounded-md p-3 mb-3 bg-gray-50 relative"
                >
                  <button
                    onClick={() => handleRemoveRoom(ri)}
                    type="button"
                    className="absolute top-2 right-2 text-red-500"
                  >
                    ✕
                  </button>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">
                        Room Type
                      </label>
                      <select
                        value={room.roomType}
                        onChange={(e) => {
                          const updated = [...form.rooms];
                          updated[ri].roomType = e.target.value;
                          setForm((prev) => ({ ...prev, rooms: updated }));
                        }}
                        className="border rounded px-3 py-2 w-full"
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
                        Furnishing
                      </label>
                      <select
                        value={room.furnished}
                        onChange={(e) => {
                          const updated = [...form.rooms];
                          updated[ri].furnished = e.target.value;
                          setForm((prev) => ({ ...prev, rooms: updated }));
                        }}
                        className="border rounded px-3 py-2 w-full"
                      >
                        <option value="">Select</option>
                        <option value="furnished">Furnished</option>
                        <option value="semi-furnished">Semi-Furnished</option>
                        <option value="unfurnished">Unfurnished</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        Available Units
                      </label>
                      <input
                        type="number"
                        value={room.availableUnits || room.units || ""}
                        onChange={(e) => {
                          const updated = [...form.rooms];
                          updated[ri].availableUnits =
                            parseInt(e.target.value) || 0;
                          updated[ri].units = parseInt(e.target.value) || 0;
                          setForm((prev) => ({ ...prev, rooms: updated }));
                        }}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        Occupancy
                      </label>
                      <input
                        type="number"
                        value={room.occupancy || ""}
                        onChange={(e) => {
                          const updated = [...form.rooms];
                          updated[ri].occupancy = parseInt(e.target.value) || 0;
                          setForm((prev) => ({ ...prev, rooms: updated }));
                        }}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={room.price || ""}
                        onChange={(e) => {
                          const updated = [...form.rooms];
                          updated[ri].price = parseInt(e.target.value) || 0;
                          setForm((prev) => ({ ...prev, rooms: updated }));
                        }}
                        className="border rounded px-3 py-2 w-full"
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
                        onChange={(e) => handleRoomImages(e, ri)}
                        className="border rounded px-3 py-2 w-full"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(room.images || []).map((rimg, idx) => (
                          <img
                            key={idx}
                            src={
                              rimg instanceof File
                                ? URL.createObjectURL(rimg)
                                : rimg
                            }
                            alt={`room-${idx}`}
                            className="h-16 w-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2 space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Room Amenities
                      </label>
                      {(room.amenities || []).map((a, ai) => (
                        <div key={ai} className="flex gap-3 items-center">
                          <input
                            type="text"
                            value={a.name}
                            onChange={(e) => {
                              const updated = [...form.rooms];
                              updated[ri].amenities[ai].name = e.target.value;
                              setForm((prev) => ({ ...prev, rooms: updated }));
                            }}
                            placeholder="Amenity Name"
                            className="border px-3 py-2 rounded w-1/2"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const updated = [...form.rooms];
                                updated[ri].amenities[ai].icon = file;
                                setForm((prev) => ({
                                  ...prev,
                                  rooms: updated,
                                }));
                              }
                            }}
                            className="border px-3 py-2 rounded w-1/2"
                          />
                          <button
                            type="button"
                            onClick={() => handleRoomAmenityRemove(ri, ai)}
                            className="text-red-500"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleRoomAmenityAdd(ri)}
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

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
