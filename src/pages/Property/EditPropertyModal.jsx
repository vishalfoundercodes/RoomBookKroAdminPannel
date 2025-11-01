import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProperty, fetchProperty } from "../../redux/slices/propertySlice";
import { toast } from "react-toastify";

export default function EditPropertyModal({ show, onClose, propertyId }) {
  // console.log("prpperty id",propertyId)
  const dispatch = useDispatch();
  const { data: properties, loading, error } = useSelector(
    (state) => state.property
  );

  const [formData, setFormData] = useState({
    userId: "",
    userType: "",
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

  // ✅ Fetch & prefill data
  useEffect(() => {
    console.log("propertyId",propertyId);
    if (propertyId) {
      dispatch(fetchProperty()).then((res) => {
        const prop =
          res.payload?.find((p) => p.id === propertyId) ||
          properties.find((p) => p.id === propertyId);

        if (prop) {
          setFormData({
            ...formData,
            ...prop,
            coordinates: prop.coordinates || { lat: 0, lng: 0 },
            rooms: prop.rooms || [],
            amenities: prop.amenities || [],
            rules: prop.rules || [],
            images: prop.images || [],
            reviews: prop.reviews || [],
          });
        }
      });
    }
    // eslint-disable-next-line
  }, [propertyId, dispatch]);

  // ✅ Handle simple field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // ✅ Handle coordinate updates
  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      coordinates: { ...prev.coordinates, [name]: Number(value) },
    }));
  };

  // ✅ Submit edited data
  const handleSubmit = () => {
    dispatch(editProperty({ id: propertyId, payload: formData }))
      .unwrap()
      .then(() => {
        toast.success("✅ Property updated successfully!");
        dispatch(fetchProperty()); // refresh list immediately
        onClose();
      })
      .catch((err) => {
        console.error(err);
        toast.error("❌ Failed to update property!");
      });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl my-10 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Edit Property Details
        </h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {/* 🏡 Basic Info */}
          <div>
            <label className="block font-medium mb-1">Property Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Property Name"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Type</label>
            <input
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Type (e.g. PG, Hotel)"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium mb-1">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Pincode</label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* 🌍 Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Latitude</label>
              <input
                type="number"
                name="lat"
                value={formData.coordinates.lat}
                onChange={handleCoordinateChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Longitude</label>
              <input
                type="number"
                name="lng"
                value={formData.coordinates.lng}
                onChange={handleCoordinateChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* 💰 Price Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Price per Night</label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Price per Month</label>
              <input
                type="number"
                name="pricePerMonth"
                value={formData.pricePerMonth}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium mb-1">Deposit</label>
              <input
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Tax (%)</label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* 📞 Contact Info */}
          <div>
            <label className="block font-medium mb-1">Contact Number</label>
            <input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Phone"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Website</label>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Website URL"
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Owner Name</label>
            <input
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="Owner Name"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {/* 🧾 Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Write about the property..."
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {/* 🏷️ Amenities & Rules */}
          <div>
            <label className="block font-medium mb-1">Amenities</label>
            <input
              name="amenities"
              value={formData.amenities.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amenities: e.target.value
                    .split(",")
                    .map((a) => a.trim())
                    .filter((a) => a),
                })
              }
              placeholder="Comma separated (e.g. WiFi, AC, Parking)"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Rules</label>
            <input
              name="rules"
              value={formData.rules.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rules: e.target.value
                    .split(",")
                    .map((r) => r.trim())
                    .filter((r) => r),
                })
              }
              placeholder="Comma separated (e.g. No Smoking, No Pets)"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Property
          </button>
        </div>
      </div>
    </div>
  );
}
