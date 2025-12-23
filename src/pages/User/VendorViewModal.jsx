import React,{useState} from "react";
import { X, Edit, Phone, Mail, Calendar, Wallet, IdCard, MapPin, Landmark, Building, Home } from "lucide-react";
import { fetchVendorProperty } from "../../redux/slices/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchVendorRevenue } from "../../redux/slices/revenueSlice";
import { FaUniversity } from "react-icons/fa";
import defaultProfile from "../../assets/default-profile.png";


const VendorViewModal = ({
  show,
  setShowViewModal,
  isEditing,
  setIsEditing,
  formData,
  handleChange,
  handleImageChange,
  handleSubmit,
  selectedUser,
}) => {

  console.log("data:",formData)
  if (!show) return null;
const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: users, loading: usersLoading } = useSelector(
    (state) => state.users
  );

const handleSeeProperty = async () => {
  const vendorProperty = await dispatch(
    fetchVendorProperty({ userId: selectedUser.userId })
  ).unwrap();

  const vendorPropertyRevenue = await dispatch(
    fetchVendorRevenue({ userId: selectedUser.userId })
  ).unwrap();

  console.log("vendor property:", vendorProperty);

  if (vendorProperty?.data?.length > 0) {
    navigate("/vendor/property", {
      state: {
        vendorProperty,
        vendorId: selectedUser.userId,
        vendorPropertyRevenue,
        vendorName: selectedUser.name,
        vendorImage: selectedUser.userImage,
      },
    });
  } else {
    toast.warn("No property Register");
  }
};



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50 scrollbar-hide">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl animate-scaleIn overflow-hidden scrollbar-hide">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {isEditing ? "Edit Vendor" : "Vendor Details"}
          </h2>

          <button
            onClick={() => {
              setIsEditing(false);
              setShowViewModal(false);
            }}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 max-h-[50vh] overflow-y-auto scrollbar-hide">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={
                  formData.userImagePreview ||
                  formData.userImage ||
                  selectedUser.userImage ||
                  defaultProfile
                }
                alt="profile image"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-fill shadow-md"
              />

              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  placeholder="update profile image"
                  className="absolute top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 opacity-0 cursor-pointer"
                />
              )}
            </div>

            {/* Name + Email */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  placeholder="Update name"
                  className="border w-full rounded-lg px-3 py-2 text-lg"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedUser.name || formData.name}
                </h3>
              )}

              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  placeholder="Update email"
                  className="border w-full rounded-lg px-3 py-2 mt-2"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <p classname="text-gray-600 text-sm sm:text-base">
                  {selectedUser.email || formData.email}
                </p>
              )}

              {/* Optional Badge */}
              <span
                className={`inline-block mt-3 text-white  px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedUser.isVerified ? "bg-green-700" : "bg-red-700"
                }`}
              >
                {selectedUser.isVerified ? "Verified User" : "Not Verified"}
              </span>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Contact */}
            <div className="p-4 rounded-xl bg-gray-50 border shadow-sm">
              <h4 className="font-semibold flex items-center gap-2 text-gray-900 mb-3">
                <Phone className="w-4 h-4 text-blue-600" />
                Contact Info
              </h4>

              <div className="space-y-2 text-sm">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-500 w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="contact"
                      placeholder="Update contact"
                      className="border rounded px-2 py-1 w-full"
                      value={formData.contact}
                      // onChange={handleChange}
                      onChange={(e) => {
                        if (e.target.value.length <= 10) {
                          handleChange(e);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  ) : (
                    <span>{selectedUser.phone || formData.contact}</span>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-500 w-4 h-4" />
                  <span>{selectedUser.email || formData.email}</span>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="p-4 rounded-xl bg-gray-50 border shadow-sm">
              <h4 className="font-semibold flex items-center gap-2 text-gray-900 mb-3">
                <Wallet className="w-4 h-4 text-green-600" />
                Account Details
              </h4>

              <div className="space-y-2 text-sm">
                {/* DOB */}
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-500 w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="date"
                      name="DOB"
                      placeholder="Update DOB"
                      value={formData.DOB || ""}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span>DOB:- {selectedUser.DOB || formData.DOB}</span>
                  )}
                </div>

                {/* Wallet */}
                <div className="flex items-center gap-3">
                  <Wallet className="text-gray-500 w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="Number"
                      name="walletBalance"
                      placeholder="Update Wallet"
                      className="border rounded px-2 py-1 w-full"
                      // value={formData.vendorRevenue}
                      value={formData.walletBalance ?? ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <span>
                      Wallet:- ₹
                      {selectedUser.walletBalance ||
                        formData.vendorRevenue ||
                        formData.walletBalance ||
                        0}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ID DETAILS */}
            <div className="p-4 rounded-xl bg-gray-50 border shadow-sm">
              <h4 className="font-semibold flex items-center gap-2 text-gray-900 mb-3">
                <IdCard className="w-4 h-4 text-purple-600" />
                Important Details
              </h4>

              <div className="space-y-2 text-sm">
                {/* Aadhar */}
                <div className="flex items-center gap-3">
                  <IdCard className="text-gray-500 w-4 h-4" />
                  {isEditing ? (
                    // <input
                    // type="Number"
                    //   name="adharNumber"
                    //   placeholder="Update adhar number"
                    //   className="border rounded px-2 py-1 w-full"
                    //   value={formData.adharNumber}
                    //   onChange={handleChange}
                    // />
                    <input
                      type="number"
                      name="adharNumber"
                      placeholder="Update Aadhaar number"
                      className="border rounded px-2 py-1 w-full"
                      value={formData.adharNumber}
                      onChange={(e) => {
                        if (e.target.value.length <= 12) {
                          handleChange(e);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  ) : (
                    <span>
                      Adhar No.:-{" "}
                      {selectedUser.adharNumber || formData.adharNumber}
                    </span>
                  )}
                </div>

                {/* PAN */}
                <div className="flex items-center gap-3">
                  <IdCard className="text-gray-500 w-4 h-4" />
                  {isEditing ? (
                    <input
                      name="panNumber"
                      placeholder="Update pan number"
                      className="border rounded px-2 py-1 w-full"
                      value={formData.panNumber}
                      onChange={handleChange}
                    />
                  ) : (
                    <span>
                      Pan No. :- {selectedUser.panNumber || formData.panNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Document Images */}
          {/* <div className="flex gap-3 overflow-x-auto py-3">
            {[
              formData.adharImage?.front || selectedUser.adharImage?.front,
              formData.adharImage?.back || selectedUser.adharImage?.back,
              formData.panImage || selectedUser.panImage,
            ].map(
              (img, i) =>
                img && (
                  <img
                    key={i}
                    src={img}
                    className="w-24 h-24 rounded-lg border shadow-md object-cover flex-shrink-0"
                  />
                )
            )}
          </div> */}
          {/* Document Images */}
          {/* <div className="flex gap-3 overflow-x-auto py-3">
            {[
              formData.adharImage?.front || selectedUser.adharImage?.front,
              formData.adharImage?.back || selectedUser.adharImage?.back,
              formData.panImage || selectedUser.panImage,
            ].map(
              (img, i) =>
                img && (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setPreviewImage(img)}
                    className="w-24 h-24 rounded-lg border shadow-md object-cover flex-shrink-0 cursor-pointer hover:scale-105 transition"
                  />
                )
            )}
          </div> */}
          <div className="flex gap-3 overflow-x-auto py-3">
            {[
              {
                img:
                  formData.adharImage?.front || selectedUser.adharImage?.front,
                label: "Aadhar Front",
              },
              {
                img: formData.adharImage?.back || selectedUser.adharImage?.back,
                label: "Aadhar Back",
              },
              {
                img: formData.panImage || selectedUser.panImage,
                label: "PAN Card",
              },
            ].map(
              (item, i) =>
                item.img && (
                  <div
                    key={i}
                    className="relative w-24 flex-shrink-0 cursor-pointer"
                    onClick={() => setPreviewImage(item.img)}
                  >
                    {/* LABEL */}
                    <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-2 py-[2px] rounded">
                      {item.label}
                    </span>

                    {/* IMAGE */}
                    <img
                      src={item.img}
                      className="w-24 h-24 rounded-lg border shadow-md object-cover hover:scale-105 transition"
                    />
                  </div>
                )
            )}
          </div>

          {previewImage && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
              onClick={() => setPreviewImage(null)}
            >
              <img
                src={previewImage}
                className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
              />
              <button
                className="absolute top-5 right-5 text-white bg-black/50 p-2 rounded-full"
                onClick={() => setPreviewImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 justify-end gap-3 p-5 border-t bg-gray-50">
          <button
            onClick={() => {
              setIsEditing(false);
              setShowViewModal(false);
            }}
            className="px-4 py-2 rounded-lg border bg-red-700 hover:bg-red-800 text-white"
          >
            Close
          </button>

          {isEditing ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md"
            >
              Save Changes
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 shadow-md flex items-center gap-2 justify-center"
              >
                <Edit className="w-4 h-4" />
                Edit User
              </button>
              <button
                onClick={() => {
                  navigate(`/bankDetailsUserWise`, {
                    state: {
                      userId: selectedUser.userId,
                      userName: selectedUser.name,
                      userImage: selectedUser.userImage,
                    },
                  });
                  console.log("userImage", selectedUser.name);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2 justify-center"
              >
                <FaUniversity className="w-4 h-4" />
                Bank Details
              </button>
              <button
                onClick={handleSeeProperty}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md flex items-center gap-2 justify-center"
              >
                <Home className="w-4 h-4" />
                See property
              </button>
            </>
          )}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VendorViewModal;
