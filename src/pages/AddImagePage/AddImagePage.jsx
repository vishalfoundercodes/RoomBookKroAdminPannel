import React, { useState, useEffect } from "react";
import { Upload, Trash2, Plus, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBanner,
  addOnboardPage,
  getBanners,
  getHomeBanners,
  getOnboardPages,
  deleteBannerImage,
} from "../../redux/slices/addImageSlice";

export default function AddImagePage() {
  const dispatch = useDispatch();
  const { banners, onboardPages, loading, error: apiError } = useSelector(
    (state) => state.images
  );

  const [activeTab, setActiveTab] = useState("banners");
  const [newImage, setNewImage] = useState({
    url: "",
    alt: "",
    title: "",
    description: "",
    pageId: "",
  });
  const [error, setError] = useState("");

  // 🟢 Load initial data
  useEffect(() => {
    dispatch(getBanners());
    dispatch(getOnboardPages());
    dispatch(getHomeBanners());
  }, [dispatch]);

  // 🔹 Add Image Handler
const handleAddImage = async () => {
  setError("");

  if (!newImage.file && !newImage.url) {
    setError("Please upload an image or enter an image URL");
    return;
  }

  try {
    let formData = new FormData();

    if (activeTab === "banners") {
      formData.append("title", "Promotion Banners");
      if (newImage.file) formData.append("images", newImage.file);
      if (newImage.alt) formData.append("alt", newImage.alt);

      await dispatch(addBanner(formData)).unwrap();
    } 
    else if (activeTab === "home") {
      formData.append("title", "Home Banners");
      if (newImage.file) formData.append("images", newImage.file);
      formData.append("alt", "Homepage Banner");

      await dispatch(addBanner(formData)).unwrap();
    } 
    else if (activeTab === "onboarding") {
      formData.append("title", newImage.title);
      formData.append("description", newImage.description);
      if (newImage.file) formData.append("image", newImage.file);
      if (newImage.pageId) formData.append("pageId", newImage.pageId);

      await dispatch(addOnboardPage(formData)).unwrap();
    }

    setNewImage({
      url: "",
      alt: "",
      title: "",
      description: "",
      pageId: "",
      file: null,
      previewUrl: "",
    });

    dispatch(getBanners());
    dispatch(getOnboardPages());
  } catch (err) {
    console.error(err);
    setError("Failed to upload image. Please try again.");
  }
};


  // 🔹 Delete Image Handler
  const handleDeleteImage = async (id, type) => {
    try {
      if (type === "banners") {
        await dispatch(deleteBannerImage(id)).unwrap();
        dispatch(getBanners());
      } else if (type === "onboarding") {
        // For onboarding, backend delete endpoint would differ
        console.warn("Implement /deleteOnboardPage API for onboarding");
      }
    } catch (err) {
      setError("Failed to delete image");
    }
  };


  const pageTypeOptions = [
    { value: 2, label: "Appartment" },
    { value: 3, label: "PG" },
    { value: 4, label: "Hotel" },
  ];
// 🧠 Local derived data
const bannerImages = banners || [];          // All banners
const onboardImages = onboardPages || [];    // Onboarding pages
const homeBannerImages = banners || [];      // Home banners (from getHomeBanners)

// 🧾 Debugging logs
console.log("🏠 All Banners:", bannerImages);
console.log("🚀 Onboard Page Images:", onboardImages);
console.log("🎯 Home Banners:", homeBannerImages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Image Management
          </h1>
          <p className="text-slate-600">
            Manage banners, homepage, and onboarding images
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          {[
            { id: "banners", label: "Banner Images" },
            { id: "home", label: "Homepage Images" },
            { id: "onboarding", label: "Onboarding Images" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Image List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Current Images
              </h2>

              {loading && (
                <p className="text-blue-500 text-sm mb-2">Loading images...</p>
              )}
              {apiError && (
                <p className="text-red-500 text-sm mb-2">
                  Error: {apiError.message || apiError}
                </p>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {/* --- Banners --- */}
             {activeTab === "banners" &&
  Array.isArray(bannerImages) &&
  bannerImages.map((banner) => (
    <div key={banner.titleId} className="mb-6">
      {/* Banner Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        {banner.title}
      </h2>

      {/* Individual Images */}
      {Array.isArray(banner.images) && banner.images.length > 0 ? (
        banner.images.map((img, i) => (
          <div
            key={img.imageId || i}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 mb-2"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img
                src={img.url}
                alt={img.alt}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 truncate">
                  {img.alt || "Banner"}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {(img.url || "").substring(0, 50)}...
                </p>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteImage(banner.titleId, img.imageId)}
              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No images found for this banner.</p>
      )}
    </div>
  ))}


                {/* --- Onboarding --- */}
                {activeTab === "onboarding" &&
                  onboardImages.map((img) => (
                    <div
                      key={img._id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <img
                          src={img.imageUrl}
                          alt={img.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">
                            {img.title}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {img.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteImage(img._id, "onboarding")}
                        className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                {/* --- Empty State --- */}
                {((activeTab === "banners" && bannerImages.length === 0) ||
                  (activeTab === "onboarding" && onboardImages.length === 0)) &&
                  !loading && (
                    <div className="text-center py-8 text-slate-500">
                      <Upload
                        size={32}
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p>No images added yet</p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Right Side: Add Image Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
  <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
    <Plus size={20} /> Add Image
  </h2>

  {error && (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
      <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-700">{error}</p>
    </div>
  )}

  <div className="space-y-4">
    {/* ✅ Image Upload Input */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Upload Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setNewImage({ ...newImage, file }); // store file object
            const previewUrl = URL.createObjectURL(file);
            setNewImage((prev) => ({ ...prev, previewUrl }));
          }
        }}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {newImage.previewUrl && (
        <div className="mt-3">
          <img
            src={newImage.previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>

    {/* OR keep Image URL input as optional */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Image URL (optional)
      </label>
      <input
        type="text"
        placeholder="https://..."
        value={newImage.url}
        onChange={(e) =>
          setNewImage({ ...newImage, url: e.target.value })
        }
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {activeTab === "banners" && (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Alt Text
        </label>
        <input
          type="text"
          placeholder="e.g., Hotel Banner"
          value={newImage.alt}
          onChange={(e) =>
            setNewImage({ ...newImage, alt: e.target.value })
          }
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    )}

    {activeTab === "onboarding" && (
      <>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Title
          </label>
          <input
            type="text"
            placeholder="e.g., Apartment"
            value={newImage.title}
            onChange={(e) =>
              setNewImage({ ...newImage, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="e.g., it is an apartment"
            value={newImage.description}
            onChange={(e) =>
              setNewImage({ ...newImage, description: e.target.value })
            }
            rows="3"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Page Type
          </label>
          <select
            value={newImage.pageId}
            onChange={(e) =>
              setNewImage({ ...newImage, pageId: e.target.value })
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select page type</option>
            {pageTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </>
    )}

    <button
      onClick={handleAddImage}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      <Upload size={18} /> {loading ? "Saving..." : "Add Image"}
    </button>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}
