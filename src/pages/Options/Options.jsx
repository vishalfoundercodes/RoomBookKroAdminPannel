import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaToggleOn,
  FaToggleOff,
  FaLayerGroup,
  FaCheckCircle,
  FaTimesCircle,
  FaRupeeSign,
} from "react-icons/fa";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Loader from "../Loader/Loader";


const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: "from-blue-400 to-blue-600 text-white",
    green: "from-green-400 to-green-600 text-white",
    yellow: "from-yellow-400 to-yellow-600 text-white",
    red: "from-red-400 to-red-600 text-white",
  };
  return (
    <div
      className={`bg-gradient-to-r ${colors[color]} p-4 rounded-2xl shadow flex flex-col`}
    >
      <p className="text-lg opacity-90">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
};

export default function Options() {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [allEnums, setAllEnums] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

  const [formData, setFormData] = useState({
    label: "",
    value: "",
    isActive: true,
  });

  const addOption = async () => {
    if (!formData.label) {
      toast.error("Label and Value are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        category: selectedCategory,
        label: formData.label,
        value: formData.label,
        isActive: formData.isActive,
      };

      await axios.post(
        "https://root.roombookkro.com/api/addenumoption",
        payload
      );

      toast.success("Option added successfully");
      setShowModal(false);
      setFormData({ label: "", value: "", isActive: true });
      fetchOptions(); // refresh enums
    } catch (err) {
      console.error(err);
      toast.error("Failed to add option");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch enums
  const fetchOptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://root.roombookkro.com/api/getenum?null"
      );

      if (res.data.status) {
        console.log("get enum:", res.data.data);
        setAllEnums(res.data.data);
        // toast.success("Options loaded successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load options");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Toggle status
  const toggleStatus = async (category, optionId, currentStatus) => {
    try {
      setLoading(true)
      setUpdating(optionId);
      const payload = {
        category: category,
        optionId: optionId,
        isActive: !currentStatus,
      };
      // console.log(payload)
      await axios.put("https://root.roombookkro.com/api/toggleenum", payload);

      setAllEnums((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((cat) => {
          if (updated[cat]?.options) {
            updated[cat].options = updated[cat].options.map((opt) =>
              opt.id === optionId ? { ...opt, isActive: !currentStatus } : opt
            );
          }
        });

        return updated;
      });

      toast.success(`${currentStatus ? "Disabled" : "Enabled"} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false)
      setUpdating(null);
    }
  };

  // 🔹 Count helper
  const getCounts = (options = []) => {
    const total = options.length;
    const active = options.filter((o) => o.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  };

  // const activeCategoryData = Object.values(allEnums).find(
  //   (cat) => cat.type === activeCategory
  // );
  const activeCategoryEntry = Object.entries(allEnums).find(
    ([_, cat]) => cat.type === activeCategory
  );

  const activeCategoryLabel = activeCategoryEntry?.[0]; // "Room Type"
  const activeCategoryData = activeCategoryEntry?.[1]; // { type, options }

  const filteredOptions =
    activeCategoryData?.options?.filter((opt) => {
      const matchSearch =
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        opt.value.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? opt.isActive
          : !opt.isActive;

      return matchSearch && matchStatus;
    }) || [];

  console.log("activeCategoryData", activeCategoryData);

  useEffect(() => {
    fetchOptions();
  }, []);

useEffect(() => {
  if (Object.keys(allEnums).length > 0 && activeCategory === null) {
    setActiveCategory(Object.values(allEnums)[0].type);
  }
}, [allEnums, activeCategory]);


  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="w-full mx-auto">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Enum Management</h1>
          <button
            onClick={fetchOptions}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* STATS */}
        {/* {activeCategoryData?.options && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Total Options"
              value={activeCategoryData.options.length}
              color="green"
            />
            <StatCard
              label="Active"
              value={
                activeCategoryData.options.filter((o) => o.isActive).length
              }
              color="green"
            />
            <StatCard
              label="Inactive"
              value={
                activeCategoryData.options.filter((o) => !o.isActive).length
              }
              color="green"
            />
          </div>
        )} */}

        {/* SEARCH & FILTER */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search option..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* CATEGORY TABS */}
        <div className="bg-white rounded-xl shadow mb-6 px-6">
          <div className="relative flex gap-8 border-b">
            {Object.entries(allEnums).map(([categoryLabel, category]) => (
              <button
                key={category.type}
                onClick={() => setActiveCategory(category.type)}
                className={`relative py-4 text-sm font-semibold transition-colors
          ${
            activeCategory === category.type
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }
        `}
              >
                {categoryLabel}

                {/* Animated Indicator */}
                {activeCategory === category.type && (
                  <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-blue-600 transition-all duration-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ENUM SECTIONS */}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Add Option ({selectedCategory})
              </h3>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Building"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. building"
                />
              </div> */}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <button
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className="text-3xl"
                >
                  {formData.isActive ? (
                    <FaToggleOn className="text-green-500" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addOption}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {activeCategoryData && (
        <div className="bg-white rounded-xl shadow p-3">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 gap-1">
            <h2 className="text-2xl font-bold flex items-center gap-1">
              <FaLayerGroup />
              {activeCategoryLabel}
            </h2>

            <button
              onClick={() => {
                setSelectedCategory(activeCategoryData.type);
                setShowModal(true);
              }}
              className="flex items-center gap-1 px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaPlus /> Add Option
            </button>
          </div>

          {/* PRICE RANGE */}
          {activeCategoryData.type === "priceRange" && (
            <div className="flex items-center gap-3 mb-6">
              <FaRupeeSign className="text-green-600 text-2xl" />
              <span className="text-xl font-semibold">
                ₹{activeCategoryData.range.min} – ₹
                {activeCategoryData.range.max}
              </span>
            </div>
          )}

          {/* OPTIONS */}
          {filteredOptions && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`rounded-xl border-2 shadow bg-white
              ${option.isActive ? "border-green-200" : "border-red-200"}
            `}
                >
                  <div
                    className={`h-2 rounded-t-xl
                ${option.isActive ? "bg-green-500" : "bg-red-500"}
              `}
                  />

                  <div className="p-5">
                    <h3 className="text-lg font-bold">{option.label}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Value: {option.value}
                    </p>

                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-medium
                    ${option.isActive ? "text-green-600" : "text-red-600"}
                  `}
                      >
                        {option.isActive ? "Active" : "Inactive"}
                      </span>

                      <button
                        onClick={() =>
                          toggleStatus(
                            activeCategoryData.type,
                            option.id,
                            option.isActive
                          )
                        }
                        className="text-3xl"
                      >
                        {option.isActive ? (
                          <FaToggleOn className="text-green-500" />
                        ) : (
                          <FaToggleOff className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
