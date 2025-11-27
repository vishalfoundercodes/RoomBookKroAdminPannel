import React from "react";
import { X, Save } from "lucide-react";

const VendorAddModal = ({ show, onClose, onSubmit, newUser, setNewUser }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md mx-4 transform animate-scaleIn">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b">
            <h2 className="text-2xl font-semibold text-gray-900">
              Add New Vendor
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/60 shadow-sm"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                required
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/60 shadow-sm"
                placeholder="Enter email address"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={newUser.password || ""}
                required
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/60 shadow-sm"
                placeholder="Enter password"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={newUser.dob || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, dob: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/60 shadow-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/60 shadow-sm"
                placeholder="Enter phone number"
              />
            </div>

            {/* Hidden Inputs */}
            <div className="hidden">
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                <option value="2">User</option>
                <option value="1">Vendor</option>
                <option value="0">Admin</option>
              </select>
            </div>

            <div className="hidden">
              <input
                type="text"
                value={newUser.location}
                onChange={(e) =>
                  setNewUser({ ...newUser, location: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAddModal;
