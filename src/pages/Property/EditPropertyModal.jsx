import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProperty, fetchProperty } from "../../redux/slices/propertySlice";
import { toast } from "react-toastify";

export default function EditPropertyModal({ show, onClose, propertyId }) {
  const dispatch = useDispatch();
  const { data: properties, loading, error } = useSelector((state) => state.property);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pricePerNight: "",
    contactNumber: "",
    email: "",
    website: "",
    owner: "",
    description: "",
  });

  // 🏠 Load property data on mount or when propertyId changes
  useEffect(() => {
    if (propertyId) {
      dispatch(fetchProperty()).then(() => {
        const prop = properties.find((p) => p.id === propertyId);
        if (prop) setFormData(prop);
      });
    }
  }, [propertyId, dispatch, properties]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    dispatch(editProperty({ id: propertyId, payload: formData }))
      .unwrap()
      .then(() => onClose())
      .catch((err) => console.error(err));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Property</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Property Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="pricePerNight"
            placeholder="Price per Night"
            value={formData.pricePerNight}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="website"
            placeholder="Website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="owner"
            placeholder="Owner"
            value={formData.owner}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
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
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
