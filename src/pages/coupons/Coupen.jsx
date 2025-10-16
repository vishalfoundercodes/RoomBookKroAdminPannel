import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Copy, Lock, Users, Infinity } from "lucide-react";
import { createCoupon,getAllCoupons  } from "../../redux/slices/couponSlice"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CouponManagement() {
  const dispatch = useDispatch();
  const { loading, coupons = [], success, error } = useSelector((state) => state.coupon);
 

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);


  console.log("coupons",coupons);
//   const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    couponType: "private",
    type: "fixed",
    value: "",
    minOrderAmount: "",
    expiryInMinutes: "",
    maxUses: "",
    description: "",
    assignedTo: "", 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.value || !formData.minOrderAmount ) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.couponType !== "evergreen" && !formData.expiryInMinutes) {
      alert("Please enter expiry time");
      return;
    }

    if (formData.couponType === "limited" && !formData.maxUses) {
      alert("Please enter maximum uses");
      return;
    }

  
    const payload = {
  couponType: formData.couponType,
  type: formData.type,
  value: parseFloat(formData.value),
  minOrderAmount: parseFloat(formData.minOrderAmount),
  expiryInMinutes:
    formData.couponType === "evergreen"
      ? null
      : parseInt(formData.expiryInMinutes),
  maxUses:
    formData.couponType === "limited"
      ? parseInt(formData.maxUses)
      : null,
  createdBy: "1",
  createdByType: 1,
  description: formData.description,
  ...(formData.couponType === "private" && {
    assignedTo: formData.assignedTo, 
  }),
};


//    console.log("Form Data Sent:", formData);
//    console.log("payload Data Sent:", payload);
    dispatch(createCoupon(payload));

    // Add locally for UI preview (optional)
    // const localCoupon = {
    //   id: Date.now(),
    //   ...payload,
    //   createdAt: new Date().toISOString(),
    //   currentUses: 0,
    // };
    // setCoupons((prev) => [localCoupon, ...prev]);

    // Reset form
    setShowForm(false);
    setFormData({
      couponType: "private",
      type: "fixed",
      value: "",
      minOrderAmount: "",
      expiryInMinutes: "",
      maxUses: "",
      description: "",
    });
  };

//   const deleteCoupon = (id) => {
//     setCoupons((prev) => prev.filter((c) => c.id !== id));
//   };

  const copyCouponJSON = (coupon) => {
    const payload = {
      couponType: coupon.couponType,
      type: coupon.type,
      value: coupon.value,
      CODE: coupon.code,
      minOrderAmount: coupon.minOrderAmount,
      expiryInMinutes: coupon.expiryInMinutes,
      maxUses: coupon.maxUses,
      createdBy: coupon.createdBy,
      createdByType: coupon.createdByType,
      description: coupon.description,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success("Coupon copied Successful");
  };

  const getExpiryTime = (coupon) => {
    if (coupon.couponType === "evergreen") return "Never";
    const expiry = new Date(
      new Date(coupon.createdAt).getTime() +
        coupon.expiryInMinutes * 60000
    );
    return expiry.toLocaleString();
  };

  const getCouponIcon = (type) => {
    switch (type) {
      case "private":
        return <Lock className="w-5 h-5" />;
      case "limited":
        return <Users className="w-5 h-5" />;
      case "evergreen":
        return <Infinity className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getCouponColor = (type) => {
    switch (type) {
      case "private":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "limited":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "evergreen":
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Coupon Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage discount coupons
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Coupon
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">New Coupon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Type *
                </label>
                <select
                  name="couponType"
                  value={formData.couponType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="private">Private Coupon</option>
                  <option value="limited">Limited User Coupon</option>
                  <option value="evergreen">Evergreen Coupon</option>
                </select>
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value * {formData.type === "percentage" && "(%)"}
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder={
                    formData.type === "fixed" ? "e.g., 500" : "e.g., 10"
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                />
              </div>

              {formData.couponType === "private" && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Assigned To (User ID) *
    </label>
    <input
      type="text"
      name="assignedTo"
      value={formData.assignedTo}
      onChange={handleInputChange}
      placeholder="Enter User ID who can use this coupon"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    />
  </div>
)}

              {/* Minimum Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Amount *
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                />
              </div>

              {/* Expiry Time */}
              {formData.couponType !== "evergreen" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Time (minutes) *
                  </label>
                  <input
                    type="number"
                    name="expiryInMinutes"
                    value={formData.expiryInMinutes}
                    onChange={handleInputChange}
                    placeholder="e.g., 2880 (2 days)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              )}

              {/* Max Uses */}
              {formData.couponType === "limited" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Uses *
                  </label>
                  <input
                    type="number"
                    name="maxUses"
                    value={formData.maxUses}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              )}

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Flat 500 rupees off on minimum order 1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {loading ? "Creating..." : "Create Coupon"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Coupon List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              All Coupons ({coupons.length})
            </h2>
          </div>

          {coupons.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <div className="text-gray-400 mb-3">
                <Plus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No coupons yet
              </h3>
              <p className="text-gray-600">
                Create your first coupon to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getCouponColor(
                        coupon.couponType
                      )}`}
                    >
                      {getCouponIcon(coupon.couponType)}
                      <span className="capitalize">
                        {coupon.couponType}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyCouponJSON(coupon)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Copy JSON"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {/* <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button> */}
                    </div>
                  </div>

                  {/* <p className="text-gray-700 mb-4 text-sm">
                    {coupon.description}
                  </p> */}
                 
                  <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                      <span className="text-gray-600">Coupon:</span>
                      <span className="font-medium text-gray-900">
                        {coupon.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-gray-900">
                        {coupon.type === "fixed"
                          ? `₹${coupon.value}`
                          : `${coupon.value}%`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Order:</span>
                      <span className="font-medium text-gray-900">
                        ₹{coupon.minOrderAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Used By:</span>
                      {/* <span className="font-medium text-gray-900">
                        {coupon.usedBy}
                      </span> */}
                      <span className="font-medium text-gray-900">
                        {coupon.usedBy.join(', ')}
                        </span>

                    </div>
                    {coupon.couponType === "limited" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Usage:</span>
                        <span className="font-medium text-gray-900">
                          {coupon.currentUses} / {coupon.maxUses}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-medium text-gray-900">
                        {getExpiryTime(coupon)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(
                          coupon.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
