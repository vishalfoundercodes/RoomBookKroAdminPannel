import React, { useEffect, useState } from "react";
import { Send, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotifications,
  sendNotification,
} from "../../redux/slices/notificationSlice";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
export default function Notifications() {
   const { id } = useParams();
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notification);

  const [activeTab, setActiveTab] = useState("create");
  const [userId, setUserId] = useState("all");
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    type: "general",
    code: "",
    discountType: "fixed",
    discountValue: "",
    minOrderAmount: "",
    expiresAt: "",
  });

    useEffect(() => {
    if (id) {
      setUserId(id);
    } else {
      setUserId("all"); // default if no ID in params
    }
  }, [id]);
  // ✅ Fetch notifications based on userId, only when viewing
  useEffect(() => {
    if (activeTab !== "view") return;

    const trimmedId = userId.trim();
    const fetchId = trimmedId === "" ? "all" : trimmedId;
    dispatch(getNotifications({ userId: fetchId }));
  }, [userId, activeTab, dispatch]);

  // ✅ Handle sending notification
  const handleSendNotification = (e) => {
    e.preventDefault();

    const payload = {
      userId: userId.trim() === "" ? "all" : userId.trim(),
      label: formData.label,
      description: formData.description,
      type: formData.type,
      ...(formData.type === "coupon" && {
        code: formData.code,
        discount_type: formData.discountType,
        discount_value: parseFloat(formData.discountValue) || 0,
        min_order_amount: parseFloat(formData.minOrderAmount) || 0,
        expires_at: formData.expiresAt,
      }),
    };

    dispatch(sendNotification(payload)).then(() => {
      setFormData({
        label: "",
        description: "",
        type: "general",
        code: "",
        discountType: "fixed",
        discountValue: "",
        minOrderAmount: "",
        expiresAt: "",
      });
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

if (loading) {
        return <Loader />;
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-800">
            Notification Manager
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "create"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Create Notification
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "view"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            View Notifications
          </button>
        </div>

        {/* Create Notification */}
        {activeTab === "create" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSendNotification} className="space-y-6">
              {/* Send To */}
              <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Send To User ID (leave empty for all users)
        </label>
        <input
          type="text"
          value={userId === "all" ? "" : userId}
          onChange={(e) =>
            setUserId(e.target.value.trim() === "" ? "all" : e.target.value)
          }
          placeholder="Enter User ID or leave blank for all"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

              {/* Label and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Label
                  </label>
                  <input
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Enter notification title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="general">General</option>
                    <option value="promotion">Promotion</option>
                    <option value="coupon">Coupon</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter message..."
                className="w-full border rounded-lg px-4 py-2"
              />

              {/* Coupon Fields */}
              {formData.type === "coupon" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="code"
                    placeholder="Coupon Code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="border rounded-lg px-4 py-2"
                  />
                  <input
                    name="discountValue"
                    placeholder="Discount Value"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    className="border rounded-lg px-4 py-2"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Notification
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* View Notifications */}
        {activeTab === "view" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Notifications for {userId === "all" ? "All Users" : `User ${userId}`}
              </h2>
              <input
                type="text"
                value={userId === "all" ? "" : userId}
                onChange={(e) =>
                  setUserId(e.target.value.trim() === "" ? "all" : e.target.value)
                }
                placeholder="Enter User ID or leave blank for all"
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            {loading ? (
              <div className="text-center">Loading...</div>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 text-center">No notifications found</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n, i) => (
                  <div key={i} className="border-b py-3">
                    <strong>{n.type}</strong> — {n.label} — {n.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
