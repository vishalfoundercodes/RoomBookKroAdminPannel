import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = "https://root.roombookkro.com/api/placeorder";

export default function PlaceBookingModal({
  open,
  onClose,
  users,
  refreshHistory,
}) {
  const [form, setForm] = useState({
    userId: "",
    residencyId: "",
    roomId: "",
    nor: 1,
    checkInDate: "",
    checkOutDate: "",
    totalAmount: "",
    nog: "",
    bookingFor: "",
    discount: "",
    finalAmount: "",
    cupponCode: "",
    paymentMethod: "0",
    paymentStatus: 1,
    isChildren: 0,
    childrenNumber: 0,
    description: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(API_URL, {
        ...form,
        orderId: `ORD-${Date.now()}`,
      });

      toast.success("Booking placed successfully ✅");
      refreshHistory();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to place booking");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-4">Place Booking</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* User Dropdown */}
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>

          <input
            name="residencyId"
            placeholder="Residency ID"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="roomId"
            placeholder="Room ID"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="nor"
            placeholder="No. of Rooms"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            name="checkInDate"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="checkOutDate"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="totalAmount"
            placeholder="Total Amount"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="discount"
            placeholder="Discount"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="finalAmount"
            placeholder="Final Amount"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="bookingFor"
            placeholder="Booking For"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="nog"
            placeholder="Guests"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="cupponCode"
            placeholder="Coupon Code"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
