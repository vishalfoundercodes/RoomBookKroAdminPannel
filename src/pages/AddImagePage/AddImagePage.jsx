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
import { toast } from "react-toastify";

export default function AddImagePage() {
  const dispatch = useDispatch();
  const { banners, onboardPages,homeBanners, loading, error: apiError } = useSelector(
    (state) => state.images
  );

  const [activeTab, setActiveTab] = useState("banners");
  const [newImage, setNewImage] = useState({
    url: "",
    alt: "",
    title: "",
    description: "",
    // pageId: "",
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

  // ✅ Validation: Ensure files are selected
  if (!newImage.files || newImage.files.length === 0) {
    setError("Please upload at least one image file.");
    return;
  }

  try {
    // Helper function to convert image to Base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    // =====================================================
    // 🔹 BANNERS / HOME
    // =====================================================
    if (activeTab === "banners" || activeTab === "home") {
      const payload = {
        title: activeTab === "banners" ? "Promotion Banners" : "Home Banners",
        images: [],
      };

      // Convert each file to base64
      for (const file of newImage.files) {
        const base64String = await toBase64(file);
        payload.images.push({
          url: base64String, // ✅ field name is imageUrl
          // alt: file.name || "Banner Image",
        });
      }

      console.log("🧾 Final Banner/Home Payload:", payload);
    const res=  await dispatch(addBanner(payload)).unwrap();
    if(res.status===200){
 toast.success(res?.message ||
  res?.data?.message ||
  "Banner added successfully!");
    }
  

    }

    // =====================================================
    // 🔹 ONBOARDING
    // =====================================================
else if (activeTab === "onboarding") {
  let base64String = "";
  if (newImage.files?.length > 0) {
    base64String = await toBase64(newImage.files[0]);
  }

  const payload = {
    title: newImage.title,
    description: newImage.description,
    imageUrl: base64String,
  };

  console.log("🧾 Final Onboarding Payload:", payload);
 const res= await dispatch(addOnboardPage(payload)).unwrap();
    if(res.status===200){
 toast.success(res?.message ||
  res?.data?.message ||
  "Banner added successfully!");
    }
}


    // =====================================================
    // ✅ Reset Form + Refresh Data
    // =====================================================
    setNewImage({
      url: "",
      alt: "",
      title: "",
      description: "",
      // pageId: "",
      files: [],
      previews: [],
    });

    dispatch(getBanners());
    dispatch(getHomeBanners());
    dispatch(getOnboardPages());
  } catch (err) {
    console.error("❌ Upload Failed:", err);
    setError("Failed to upload image. Please try again.");
  }
};




const handleDeleteImage = async (id, type) => {
  console.log(" Deleting image id:", id);

  try {
    if (activeTab === "banners" || activeTab === "home") {
      await dispatch(deleteBannerImage(id)).unwrap();
      toast.success("Image deleted successfully! ");
      // Refresh data after delete
      dispatch(getBanners());
      dispatch(getHomeBanners());
    } 
    else if (activeTab === "onboarding") {
      console.warn("⚠️ Implement /deleteOnboardPage API for onboarding");
      toast.error("Onboarding image delete not yet implemented.");
    }
  } catch (err) {
    console.error("❌ Delete failed:", err);
    toast.error("Failed to delete image. Please try again.");
  }
};



  const pageTypeOptions = [
    { value: 2, label: "Appartment" },
    { value: 3, label: "PG" },
    { value: 4, label: "Hotel" },
  ];
// 🧠 Local derived data
const bannerImages = banners || [];          // All banners
// const onboardImages = onboardPages || [];
const onboardImages = onboardPages?.data || [];    // Onboarding pages
const homeBannerImages = homeBanners || [];      // Home banners (from getHomeBanners)

// 🧾 Debugging logs
// console.log("🏠 All Banners:", bannerImages);
// console.log("🚀 Onboard Page Images:", onboardImages);
// console.log("🎯 Home Banners:", homeBannerImages);

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
  bannerImages.map((banner, idx) => (
    <div key={banner.titleId || `banner-${idx}`} className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        {banner.title}
      </h2>

      {Array.isArray(banner.images) && banner.images.length > 0 ? (
        banner.images.map((img, i) => (
          <div
            key={`${banner.titleId || idx}-img-${img.imageId || i}`}
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

{activeTab === "home" &&
  homeBanners.map((banner) => (
    <div
      key={banner._id}
      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 mb-2"
    >
      {/* Banner Left Section */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          src={banner.imageUrl || banner.url}
          alt={banner.title}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900">{banner.title}</p>
          <p className="text-sm text-slate-500 truncate">
            {banner.description}
          </p>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => handleDeleteImage(banner._id, "home")}
        className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
      >
        <Trash2 size={18} />
      </button>
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

  {/* ⚠️ Error Message */}
  {error && (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
      <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-700">{error}</p>
    </div>
  )}

  <div className="space-y-4">
    {/* 🖼️ Upload Multiple Images */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Upload Images
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files);
          if (files.length > 0) {
            const previews = files.map((file) => ({
              file,
              previewUrl: URL.createObjectURL(file),
            }));
            setNewImage((prev) => ({
              ...prev,
              files,
              previews,
            }));
          }
        }}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {/* 🖼️ Preview */}
      {newImage.previews?.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {newImage.previews.map((img, i) => (
            <div
              key={i}
              className="relative border rounded-lg overflow-hidden group"
            >
              <img
                src={img.previewUrl}
                alt={`Preview ${i + 1}`}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = newImage.previews.filter((_, idx) => idx !== i);
                  setNewImage((prev) => ({
                    ...prev,
                    previews: updated,
                    files: updated.map((x) => x.file),
                  }));
                }}
                className="absolute top-1 right-1 bg-white/70 hover:bg-red-500 hover:text-white rounded-full p-1 text-xs transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* 🏷️ Banner Title (Promotion/Home) */}
    {(activeTab === "banners" || activeTab === "home") && (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Banner Title
        </label>
        <input
          type="text"
          placeholder="e.g., Promotional Offer, Festive Sale, etc."
          value={newImage.title}
          onChange={(e) =>
            setNewImage((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    )}

    {/* 🖋️ Alt Text */}
    {(activeTab === "banners" || activeTab === "home") && (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Alt Text
        </label>
        <input
          type="text"
          placeholder="e.g., Hotel Banner, PG Banner, etc."
          value={newImage.alt}
          onChange={(e) =>
            setNewImage((prev) => ({ ...prev, alt: e.target.value }))
          }
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    )}

    {/* 📄 Onboarding Fields */}
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
              setNewImage((prev) => ({ ...prev, title: e.target.value }))
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
              setNewImage((prev) => ({ ...prev, description: e.target.value }))
            }
            rows="3"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Page Type
          </label>
          <select
            value={newImage.pageId}
            onChange={(e) =>
              setNewImage((prev) => ({ ...prev, pageId: e.target.value }))
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
        </div> */}
      </>
    )}

    {/* 📤 Submit */}
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
