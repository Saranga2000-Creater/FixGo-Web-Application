import { useEffect, useState, useRef } from "react";
import { api, UPLOADS_URL } from "../../src/services/api";

const VEHICLE_CAT_OPTIONS = [
  "3 Wheelers & Bikes",
  "4 Wheelers",
  "Commercial Vehicles"
];

const COMMON_CATEGORIES = [
  "Mechanical",
  "Electrical",
  "Maintenance",
  "Detailing",
  "Parts Supply",
  "Towing",
  "General"
];

function Stars({ count, max = 5 }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < count ? "text-amber-500" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ShopProfile() {
  const [shopData, setShopData] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'hours' | 'gallery' | 'tow' | 'services'

  const isGarage = shopData?.categories?.toLowerCase().includes("garage") || false;
  const hasTowService = shopData ? Number(shopData.carriageService) === 1 : false;

  // Tow Truck state
  const [towDetails, setTowDetails] = useState(null);
  const [towLoading, setTowLoading] = useState(false);
  const [showTowForm, setShowTowForm] = useState(false);
  const [towSaving, setTowSaving] = useState(false);
  const [towError, setTowError] = useState("");
  const [towForm, setTowForm] = useState({
    driverName: "", driverPhone: "", truckBrand: "", truckColor: "", truckPlate: "",
  });

  // Profile Picture state
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const profilePhotoInputRef = useRef(null);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedImagesToDelete, setSelectedImagesToDelete] = useState([]);
  const [deletingGallery, setDeletingGallery] = useState(false);
  const fileInputRef = useRef(null);

  // Business Information state
  const [isEditingBusinessInfo, setIsEditingBusinessInfo] = useState(false);
  const [businessSaving, setBusinessSaving] = useState(false);
  const [businessError, setBusinessError] = useState("");
  const [businessForm, setBusinessForm] = useState({
    name: "", owner: "", phone: "", address: "", brn: "", description: "",
    openTime: "08:00", closeTime: "18:00", satCloseTime: "14:00", isAvailable: 1, vehicleCategories: []
  });

  // Operating Hours Edit state
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [satClosed, setSatClosed] = useState(false);
  const [sunClosed, setSunClosed] = useState(true);

  // Services Offered state
  const [shopServices, setShopServices] = useState([]);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [servicesSaving, setServicesSaving] = useState(false);
  const [newService, setNewService] = useState({
    category: "Mechanical",
    service_name: "",
    starting_price: "",
    duration: ""
  });

  useEffect(() => {
    api.get("getShopProfile.php")
      .then(data => {
        if (data.success) {
          setShopData(data.data);
        } else {
          console.error(data.message);
        }
      })
      .catch(err => {
        console.error("Error loading shop profile:", err);
      });

    // Fetch Gallery
    api.get("shop/getGalleryImages.php")
      .then(res => {
        if (res?.success && Array.isArray(res.data)) {
          setGalleryImages(res.data);
        }
      })
      .catch(err => console.error("Gallery fetch error:", err));

    // Fetch Services
    api.get("shop/getShopServices.php")
      .then(res => {
        if (res?.success && Array.isArray(res.data)) {
          setShopServices(res.data);
        }
      })
      .catch(err => console.error("Services fetch error:", err));
  }, []);

  useEffect(() => {
    if (!shopData) return;
    setTowLoading(true);
    api.get("getTowTruckDetails.php")
      .then(data => {
        if (data.success) {
          setTowDetails(data.data);
          setTowForm({
            driverName: data.data.default_driver_name || "",
            driverPhone: data.data.default_driver_phone || "",
            truckBrand: data.data.default_truck_brand || "",
            truckColor: data.data.default_truck_color || "",
            truckPlate: data.data.tow_truck_plate || "",
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setTowLoading(false));
  }, [shopData, hasTowService]);

  // Populate Business Form state when shopData is loaded
  useEffect(() => {
    if (shopData) {
      const vCats = shopData.vehicleCategories 
        ? shopData.vehicleCategories.split(',').map(s => s.trim()) 
        : [];
      setBusinessForm({
        name: shopData.name || "",
        owner: shopData.owner || "",
        phone: shopData.contactNumber || "",
        address: shopData.address || "",
        brn: shopData.BRN || "",
        description: shopData.description || "",
        openTime: shopData.openTime || "08:00:00",
        closeTime: shopData.closeTime || "18:00:00",
        satCloseTime: "14:00:00",
        isAvailable: shopData.isAvailable !== undefined ? Number(shopData.isAvailable) : 1,
        vehicleCategories: vCats
      });
    }
  }, [shopData]);

  // Format HH:MM 24hr time to 12hr AM/PM string
  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;
    const hour = parseInt(parts[0], 10);
    const min = parts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${min} ${ampm}`;
  };

  // Profile Photo Handler
  const handleUploadProfilePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile photo must be under 5MB.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid image format. Allowed formats: PNG, JPG, JPEG, WEBP.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setUploadingProfilePhoto(true);

    try {
      const res = await api.post("shop/uploadProfileImage.php", formData);
      if (res.success && res.profileImageURL) {
        setShopData(prev => ({ ...prev, profileImageURL: res.profileImageURL }));
      } else {
        alert(res.message || "Failed to update profile photo.");
      }
    } catch (err) {
      alert(err.message || "Error updating profile photo.");
    } finally {
      setUploadingProfilePhoto(false);
      if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = "";
    }
  };

  // Gallery Handlers
  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (galleryImages.length >= 4) {
      alert("Maximum of 4 gallery images allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Workshop photo must be under 5MB.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid image format. Allowed formats: PNG, JPG, JPEG, WEBP.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setUploadingGallery(true);

    try {
      const res = await api.post("shop/uploadGalleryImage.php", formData);
      if (res.success && res.data) {
        setGalleryImages(prev => [res.data, ...prev]);
      } else {
        alert(res.message || "Failed to upload image.");
      }
    } catch (err) {
      alert(err.message || "Error uploading gallery image.");
    } finally {
      setUploadingGallery(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleToggleSelectImage = (imageId) => {
    setSelectedImagesToDelete(prev =>
      prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]
    );
  };

  const handleConfirmBatchDelete = async () => {
    if (selectedImagesToDelete.length === 0) return;
    setDeletingGallery(true);

    try {
      for (const id of selectedImagesToDelete) {
        await api.post("shop/deleteGalleryImage.php", { image_id: id });
      }
      setGalleryImages(prev => prev.filter(img => !selectedImagesToDelete.includes(img.id)));
      setSelectedImagesToDelete([]);
      setIsDeleteMode(false);
    } catch (err) {
      alert(err.message || "Error deleting gallery images.");
    } finally {
      setDeletingGallery(false);
    }
  };

  // Business Info Handlers
  const handleBusinessFormChange = (e) => {
    setBusinessForm({ ...businessForm, [e.target.name]: e.target.value });
  };

  const handleVehicleCatToggle = (catName) => {
    const current = businessForm.vehicleCategories;
    if (current.includes(catName)) {
      setBusinessForm({ ...businessForm, vehicleCategories: current.filter(c => c !== catName) });
    } else {
      setBusinessForm({ ...businessForm, vehicleCategories: [...current, catName] });
    }
  };

  const handleToggleAvailability = async (newVal) => {
    const updatedForm = { ...businessForm, isAvailable: newVal };
    setBusinessForm(updatedForm);
    try {
      const res = await api.post("shop/updateBusinessInfo.php", updatedForm);
      if (res.success) {
        setShopData(prev => ({ ...prev, isAvailable: newVal }));
      }
    } catch (err) {
      console.error("Error toggling shop availability:", err);
    }
  };

  const handleSaveBusinessInfo = async () => {
    setBusinessError("");
    if (!businessForm.name.trim() || !businessForm.owner.trim() || !businessForm.phone.trim()) {
      setBusinessError("Shop Name, Owner, and Phone are required.");
      return;
    }

    if (!/^(?:\+94\d{9}|0\d{9})$/.test(businessForm.phone.trim())) {
      setBusinessError("Invalid phone format. Valid formats: +94123456789 or 0123456789.");
      return;
    }

    setBusinessSaving(true);
    try {
      const res = await api.post("shop/updateBusinessInfo.php", businessForm);
      if (res.success) {
        setShopData({
          ...shopData,
          name: businessForm.name,
          owner: businessForm.owner,
          contactNumber: businessForm.phone,
          description: businessForm.description,
          openTime: businessForm.openTime,
          closeTime: businessForm.closeTime,
          isAvailable: businessForm.isAvailable,
          vehicleCategories: businessForm.vehicleCategories.join(', ')
        });
        setIsEditingBusinessInfo(false);
        setIsEditingHours(false);
      } else {
        setBusinessError(res.message || "Failed to save business information.");
      }
    } catch (err) {
      setBusinessError(err.message || "Error saving business information.");
    } finally {
      setBusinessSaving(false);
    }
  };

  // Host-Ready Custom Service Entry Handlers (API-First Sync)
  const handleAddCustomService = async () => {
    if (!newService.service_name.trim()) {
      alert("Please enter a Service Name.");
      return;
    }

    const entry = {
      category: newService.category.trim() || "General",
      service_name: newService.service_name.trim(),
      starting_price: newService.starting_price.trim() || "Varies",
      duration: newService.duration.trim() || "Varies"
    };

    const targetServices = Array.isArray(shopServices) ? [...shopServices, entry] : [entry];
    setServicesSaving(true);

    try {
      const res = await api.post("shop/updateServices.php", { services: targetServices });
      if (res?.success) {
        setShopServices(targetServices);
        setNewService({ category: "Mechanical", service_name: "", starting_price: "", duration: "" });
      } else {
        alert(res?.message || "Failed to add service.");
      }
    } catch (err) {
      alert(err.message || "Error adding service.");
    } finally {
      setServicesSaving(false);
    }
  };

  const handleRemoveService = async (index) => {
    const targetServices = Array.isArray(shopServices) ? shopServices.filter((_, i) => i !== index) : [];
    setServicesSaving(true);

    try {
      const res = await api.post("shop/updateServices.php", { services: targetServices });
      if (res?.success) {
        setShopServices(targetServices);
      } else {
        alert(res?.message || "Failed to delete service.");
      }
    } catch (err) {
      alert(err.message || "Error deleting service.");
    } finally {
      setServicesSaving(false);
    }
  };

  const handleSaveServices = async () => {
    setServicesSaving(true);
    let targetServices = Array.isArray(shopServices) ? [...shopServices] : [];
    if (newService.service_name.trim()) {
      targetServices.push({
        category: newService.category.trim() || "General",
        service_name: newService.service_name.trim(),
        starting_price: newService.starting_price.trim() || "Varies",
        duration: newService.duration.trim() || "Varies"
      });
    }
    try {
      const res = await api.post("shop/updateServices.php", { services: targetServices });
      if (res?.success) {
        setShopServices(targetServices);
        setNewService({ category: "Mechanical", service_name: "", starting_price: "", duration: "" });
        setIsEditingServices(false);
      } else {
        alert(res?.message || "Failed to update services.");
      }
    } catch (err) {
      alert(err.message || "Error saving services.");
    } finally {
      setServicesSaving(false);
    }
  };

  const handleTowFormChange = (e) => {
    setTowForm({ ...towForm, [e.target.name]: e.target.value });
  };

  const handleTowSave = () => {
    setTowError("");
    for (const field of ["driverName", "driverPhone", "truckBrand", "truckColor", "truckPlate"]) {
      if (!towForm[field]?.trim()) {
        setTowError("Please fill in all fields.");
        return;
      }
    }

    setTowSaving(true);
    api.post("updateShopTowTruckDetails.php", { ...towForm })
      .then(data => {
        if (data.success) {
          setTowDetails({
            default_driver_name: towForm.driverName,
            default_driver_phone: towForm.driverPhone,
            default_truck_brand: towForm.truckBrand,
            default_truck_color: towForm.truckColor,
            tow_truck_plate: towForm.tow_truck_plate,
          });
          setShopData({ ...shopData, carriageService: 1 });
          setShowTowForm(false);
        } else {
          setTowError(data.message || "Failed to save tow truck details.");
        }
      })
      .catch(err => {
        console.error("Error saving tow truck details:", err);
        setTowError("Something went wrong. Please try again.");
      })
      .finally(() => setTowSaving(false));
  };

  const handleGoToShop = () => {
    if (shopData?.id) {
      window.location.href = `/shop/${shopData.id}`;
    }
  };

  if (!shopData) {
    return <div className="p-6 text-slate-500 font-medium">Loading shop profile...</div>;
  }

  const isCurrentlyOpen = Number(shopData.isAvailable) === 1;

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-6">
      
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 m-0 tracking-tight">
          Shop Profile
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Manage your shop information and public profile.
        </p>
      </div>

      {/* Top Shop Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Photo Avatar with Edit Badge */}
          <div className="relative w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 group border-4 border-white shadow-md">
            <input
              type="file"
              ref={profilePhotoInputRef}
              onChange={handleUploadProfilePhoto}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
            <img
              src={
                shopData?.profileImageURL
                  ? `${UPLOADS_URL}/${shopData.profileImageURL}`
                  : "/default-shop.png"
              }
              alt="Shop Logo"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => profilePhotoInputRef.current?.click()}
              disabled={uploadingProfilePhoto}
              title="Change Profile Photo"
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-transform active:scale-95"
            >
              {uploadingProfilePhoto ? "..." : "📷"}
            </button>
          </div>

          <div className="text-center md:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h2 className="text-2xl font-extrabold text-slate-900 m-0">
                {shopData.name}
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full py-0.5 px-3 text-xs font-semibold inline-flex items-center gap-1">
                ✓ Verified
              </span>

              {/* Shop Availability Badge */}
              <button
                type="button"
                onClick={() => handleToggleAvailability(isCurrentlyOpen ? 0 : 1)}
                title="Click to toggle shop availability"
                className={`py-0.5 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  isCurrentlyOpen
                    ? "bg-emerald-100/90 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                    : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                }`}
              >
                <span>{isCurrentlyOpen ? "🟢 OPEN" : "🔴 CLOSED"}</span>
              </button>
            </div>
            
            <p className="text-sm font-semibold text-slate-600 m-0">
              {shopData.categories || "Service Center"}
            </p>
            
            <div className="text-xs font-medium text-slate-500 flex items-center justify-center md:justify-start gap-1">
              <span className="text-emerald-600">📍</span> {shopData.address}
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-1.5 pt-1">
              <Stars count={Math.round(Number(shopData.averageRating || 0))} />
              <span className="text-xs font-bold text-slate-800">
                {Number(shopData.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-xs font-medium text-slate-500">
                ({shopData.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Go to My Shop Button */}
        <button
          type="button"
          onClick={handleGoToShop}
          className="py-2.5 px-5 rounded-xl border border-emerald-600 bg-white text-emerald-700 font-semibold text-xs cursor-pointer hover:bg-emerald-50 flex items-center gap-2 transition-all shadow-2xs shrink-0"
        >
          <span>👁️</span> Go to My Shop ↗
        </button>
      </div>

      {/* 5-Tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`py-2.5 px-4 rounded-xl border font-semibold text-xs cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === "info"
              ? "bg-emerald-50 text-emerald-700 border-emerald-600 shadow-2xs"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>ℹ️</span> Shop Information
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hours")}
          className={`py-2.5 px-4 rounded-xl border font-semibold text-xs cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === "hours"
              ? "bg-emerald-50 text-emerald-700 border-emerald-600 shadow-2xs"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>⏰</span> Opening Hours
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`py-2.5 px-4 rounded-xl border font-semibold text-xs cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === "gallery"
              ? "bg-emerald-50 text-emerald-700 border-emerald-600 shadow-2xs"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>🖼️</span> Shop Gallery
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tow")}
          className={`py-2.5 px-4 rounded-xl border font-semibold text-xs cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === "tow"
              ? "bg-emerald-50 text-emerald-700 border-emerald-600 shadow-2xs"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>🚛</span> Transportation Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={`py-2.5 px-4 rounded-xl border font-semibold text-xs cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === "services"
              ? "bg-emerald-50 text-emerald-700 border-emerald-600 shadow-2xs"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>🔧</span> Services Offered
        </button>
      </div>

      {/* Tab Panel Content */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm min-h-[350px]">
        
        {/* ========================================== */}
        {/* TAB 1: Shop Information                    */}
        {/* ========================================== */}
        {activeTab === "info" && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900 m-0">
                Shop Information
              </h3>
              {!isEditingBusinessInfo ? (
                <button
                  type="button"
                  onClick={() => setIsEditingBusinessInfo(true)}
                  className="py-2 px-4 rounded-xl border border-emerald-600 bg-white text-emerald-700 font-semibold text-xs cursor-pointer hover:bg-emerald-50 flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <span>✏️</span> Edit Information
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingBusinessInfo(false)}
                  className="py-2 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>

            {!isEditingBusinessInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                {/* Left Key-Value List */}
                <div className="space-y-3.5 divide-y divide-slate-100">
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <span>🏪</span> Shop Name
                    </span>
                    <span className="text-slate-900 font-bold">{shopData.name}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <span>🏷️</span> Category
                    </span>
                    <span className="text-slate-900 font-bold">{shopData.categories || "Garages"}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <span>👤</span> Owner
                    </span>
                    <span className="text-slate-900 font-bold">{shopData.owner}</span>
                  </div>

                  <div className="flex items-start justify-between pt-2">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <span>🚗</span> Vehicle Categories
                    </span>
                    <span className="text-slate-900 font-bold text-right max-w-[60%] leading-relaxed">
                      {shopData.vehicleCategories || "3 Wheelers & Bikes, 4 Wheelers, Commercial Vehicles"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <span>✉️</span> Email (Read-Only)
                    </span>
                    <span className="text-slate-900 font-bold">{shopData.email}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <span>📞</span> Phone
                    </span>
                    <span className="text-slate-900 font-bold">{shopData.contactNumber}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <span>📍</span> Address (Read-Only)
                    </span>
                    <span className="text-slate-900 font-bold">{shopData.address}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <span>📋</span> Reg. No. (Read-Only)
                    </span>
                    <span className="text-slate-900 font-bold">{shopData.BRN || "Not Available"}</span>
                  </div>
                </div>

                {/* Right Key-Value List */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-semibold flex items-center gap-2">
                      <span>🛠️</span> Carriage Service
                    </span>
                    <span className={`font-bold py-0.5 px-3 rounded-full text-xs ${
                      shopData.carriageService ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}>
                      {shopData.carriageService ? "Available" : "Not Available"}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-slate-600 font-semibold block flex items-center gap-2">
                      <span>📝</span> Description
                    </span>
                    <p className="text-slate-700 leading-relaxed text-xs m-0">
                      {shopData.description || "We provide high-quality vehicle repair and maintenance services with experienced technicians and modern equipment. Your vehicle's safety and performance are our top priority."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Business Info Form */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Shop Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={businessForm.name}
                      onChange={handleBusinessFormChange}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Owner *</label>
                    <input
                      type="text"
                      name="owner"
                      value={businessForm.owner}
                      onChange={handleBusinessFormChange}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="py-1">
                    <span className="text-xs text-slate-500 font-semibold block">Category (Read-Only)</span>
                    <span className="text-xs text-slate-800 font-medium">{shopData.categories || "Garages"}</span>
                  </div>

                  <div className="py-1">
                    <span className="text-xs text-slate-500 font-semibold block">Email (Read-Only)</span>
                    <span className="text-xs text-slate-800 font-medium">{shopData.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Phone *</label>
                    <input
                      type="text"
                      name="phone"
                      value={businessForm.phone}
                      onChange={handleBusinessFormChange}
                      placeholder="e.g. +94123456789 or 0123456789"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>

                  <div className="py-1">
                    <span className="text-xs text-slate-500 font-semibold block">Reg. No. (BRN) (Read-Only)</span>
                    <span className="text-xs text-slate-800 font-medium">{shopData.BRN || "Not Available"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Address (Read-Only)</span>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800">
                    {shopData.address}
                  </div>
                </div>

                {/* Editable Description Textarea */}
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Shop Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={businessForm.description}
                    onChange={handleBusinessFormChange}
                    placeholder="Describe your shop services, technicians, and equipment..."
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Supported Vehicle Categories</label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {VEHICLE_CAT_OPTIONS.map(vCat => (
                      <label key={vCat} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={businessForm.vehicleCategories.includes(vCat)}
                          onChange={() => handleVehicleCatToggle(vCat)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        {vCat}
                      </label>
                    ))}
                  </div>
                </div>

                {businessError && <p className="text-red-600 text-xs font-semibold">{businessError}</p>}

                <button
                  type="button"
                  onClick={handleSaveBusinessInfo}
                  disabled={businessSaving}
                  className="mt-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs cursor-pointer hover:bg-emerald-700 shadow-2xs"
                >
                  {businessSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: Opening Hours                       */}
        {/* ========================================== */}
        {activeTab === "hours" && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 m-0 flex items-center gap-2">
                  <span>⏰</span> Operating Hours
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">Current Availability:</span>
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(isCurrentlyOpen ? 0 : 1)}
                    className={`py-0.5 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isCurrentlyOpen
                        ? "bg-emerald-100/90 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                        : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                    }`}
                  >
                    {isCurrentlyOpen ? "🟢 OPEN FOR BUSINESS" : "🔴 CLOSED FOR BUSINESS"}
                  </button>
                </div>
              </div>

              {!isEditingHours ? (
                <button
                  type="button"
                  onClick={() => setIsEditingHours(true)}
                  className="py-2 px-4 rounded-xl border border-emerald-600 bg-white text-emerald-700 font-semibold text-xs cursor-pointer hover:bg-emerald-50 flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <span>✏️</span> Edit Hours
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingHours(false)}
                  className="py-2 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>

            {!isEditingHours ? (
              <div className="divide-y divide-slate-100 text-sm max-w-2xl">
                <div className="py-3.5 flex justify-between items-center">
                  <span className="font-semibold text-slate-800">Monday - Friday</span>
                  <span className="font-bold text-slate-900">
                    {formatTime(shopData.openTime)} - {formatTime(shopData.closeTime)}
                  </span>
                </div>

                <div className="py-3.5 flex justify-between items-center">
                  <span className="font-semibold text-slate-800">Saturday</span>
                  <span className={`font-bold ${satClosed ? "text-red-600" : "text-slate-900"}`}>
                    {satClosed ? "Closed" : `${formatTime(shopData.openTime)} - ${formatTime(businessForm.satCloseTime)}`}
                  </span>
                </div>

                <div className="py-3.5 flex justify-between items-center">
                  <span className="font-semibold text-slate-800">Sunday</span>
                  <span className={`font-bold ${sunClosed ? "text-red-600" : "text-slate-900"}`}>
                    {sunClosed ? "Closed" : `${formatTime(shopData.openTime)} - 2:00 PM`}
                  </span>
                </div>
              </div>
            ) : (
              /* Per-day Hours Edit Form */
              <div className="max-w-xl space-y-6">
                
                {/* Mon - Fri */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <span className="font-bold text-xs text-slate-900 block">Monday - Friday Hours</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold block mb-1">Open Time</label>
                      <input
                        type="time"
                        name="openTime"
                        value={businessForm.openTime}
                        onChange={handleBusinessFormChange}
                        className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold block mb-1">Close Time</label>
                      <input
                        type="time"
                        name="closeTime"
                        value={businessForm.closeTime}
                        onChange={handleBusinessFormChange}
                        className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Saturday */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900">Saturday Hours</span>
                    <button
                      type="button"
                      onClick={() => setSatClosed(!satClosed)}
                      className={`py-1 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        satClosed ? "bg-red-100 text-red-700 border-red-300" : "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      {satClosed ? "Mark Open" : "Mark Closed"}
                    </button>
                  </div>
                  {!satClosed ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Open Time</label>
                        <input
                          type="time"
                          value={businessForm.openTime}
                          onChange={(e) => setBusinessForm({ ...businessForm, openTime: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Close Time</label>
                        <input
                          type="time"
                          name="satCloseTime"
                          value={businessForm.satCloseTime}
                          onChange={(e) => setBusinessForm({ ...businessForm, satCloseTime: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-red-600 font-medium m-0">Saturday marked as Closed.</p>
                  )}
                </div>

                {/* Sunday */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900">Sunday Hours</span>
                    <button
                      type="button"
                      onClick={() => setSunClosed(!sunClosed)}
                      className={`py-1 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        sunClosed ? "bg-red-100 text-red-700 border-red-300" : "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      {sunClosed ? "Mark Open" : "Mark Closed"}
                    </button>
                  </div>
                  {!sunClosed ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Open Time</label>
                        <input
                          type="time"
                          value={businessForm.openTime}
                          onChange={(e) => setBusinessForm({ ...businessForm, openTime: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Close Time</label>
                        <input
                          type="time"
                          value="14:00"
                          readOnly
                          className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-100 text-slate-500 box-border"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-red-600 font-medium m-0">Sunday marked as Closed.</p>
                  )}
                </div>

                {businessError && <p className="text-red-600 text-xs font-semibold">{businessError}</p>}

                <button
                  type="button"
                  onClick={handleSaveBusinessInfo}
                  disabled={businessSaving}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs cursor-pointer hover:bg-emerald-700 shadow-2xs"
                >
                  {businessSaving ? "Saving..." : "Save Operating Hours"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: Shop Gallery                        */}
        {/* ========================================== */}
        {activeTab === "gallery" && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900 m-0 flex items-center gap-2">
                <span>🖼️</span> Shop Gallery <span className="text-xs font-normal text-slate-500">({galleryImages.length}/4)</span>
                {uploadingGallery && <span className="text-xs text-emerald-600 font-semibold ml-1">(Uploading...)</span>}
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadImage}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingGallery || galleryImages.length >= 4}
                  title={galleryImages.length >= 4 ? "Maximum 4 images allowed" : "Add Image"}
                  className={`py-2 px-4 rounded-xl border font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs ${
                    galleryImages.length >= 4
                      ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                      : "border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  + Add Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteMode(!isDeleteMode);
                    setSelectedImagesToDelete([]);
                  }}
                  title={isDeleteMode ? "Cancel Removing" : "Remove Images"}
                  className={`py-2 px-4 rounded-xl font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-all ${
                    isDeleteMode
                      ? "bg-slate-200 text-slate-700 border border-slate-300"
                      : "border border-red-500 bg-white text-red-600 hover:bg-red-50"
                  }`}
                >
                  {isDeleteMode ? "Cancel" : "− Remove Images"}
                </button>
              </div>
            </div>

            {/* Restored Multi-Select Thumbnail Grid UI */}
            {galleryImages.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {galleryImages.map((img) => {
                    const isSelected = selectedImagesToDelete.includes(img.id);
                    return (
                      <div
                        key={img.id}
                        onClick={() => isDeleteMode && handleToggleSelectImage(img.id)}
                        className={`relative h-44 rounded-2xl overflow-hidden border bg-slate-50 transition-all ${
                          isDeleteMode ? "cursor-pointer" : ""
                        } ${
                          isSelected
                            ? "ring-2 ring-red-500 border-red-500 shadow-md"
                            : "border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        <img
                          src={`${UPLOADS_URL}/${img.url}`}
                          alt="Gallery Photo"
                          className="w-full h-full object-cover"
                        />
                        {isDeleteMode && (
                          <div className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                            isSelected ? "bg-red-600 text-white" : "bg-black/40 text-white/80 border border-white"
                          }`}>
                            {isSelected ? "✓" : "○"}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Dashed Add Photo Card */}
                  {galleryImages.length < 4 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="h-44 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 flex flex-col items-center justify-center cursor-pointer transition-all text-slate-500 hover:text-emerald-700"
                    >
                      <span className="text-2xl font-bold mb-1">+</span>
                      <span className="text-xs font-semibold">Add Photo</span>
                    </div>
                  )}
                </div>

                {isDeleteMode && (
                  <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between">
                    <span className="text-xs text-red-700 font-medium">
                      {selectedImagesToDelete.length} selected for deletion
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmBatchDelete}
                        disabled={deletingGallery || selectedImagesToDelete.length === 0}
                        className={`py-1.5 px-4 rounded-xl text-xs font-bold text-white border-none ${
                          selectedImagesToDelete.length === 0 || deletingGallery
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 cursor-pointer shadow-2xs"
                        }`}
                      >
                        {deletingGallery ? "Deleting..." : `Confirm Remove (${selectedImagesToDelete.length})`}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDeleteMode(false);
                          setSelectedImagesToDelete([]);
                        }}
                        className="py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                No gallery photos added yet. Click + Add Photo to upload images.
              </div>
            )}

            <p className="text-xs font-medium text-slate-500 m-0">
              Recommended size: 1200 x 800 pixels. Max 5MB per image.
            </p>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: Transportation Details (Tow Truck)  */}
        {/* ========================================== */}
        {activeTab === "tow" && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900 m-0 flex items-center gap-2">
                <span>🚛</span> Tow Truck & Transportation Details
              </h3>
            </div>

            {!hasTowService && !showTowForm && (
              <div className="max-w-md py-4">
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Do you provide tow truck or vehicle carriage services for customers in breakdown situations?
                </p>
                <button
                  onClick={() => setShowTowForm(true)}
                  className="py-2.5 px-5 rounded-xl border-none bg-emerald-600 text-white font-semibold text-xs cursor-pointer hover:bg-emerald-700 transition shadow-2xs"
                >
                  Yes, I provide tow service
                </button>
              </div>
            )}

            {hasTowService && !showTowForm && (
              <div className="max-w-2xl">
                {towLoading ? (
                  <p className="text-xs text-slate-500">Loading tow truck details...</p>
                ) : towDetails ? (
                  <>
                    <div className="divide-y divide-slate-100 text-xs">
                      {[
                        ["Driver Name", towDetails.default_driver_name],
                        ["Driver Phone", towDetails.default_driver_phone],
                        ["Truck Brand", towDetails.default_truck_brand],
                        ["Truck Color", towDetails.default_truck_color],
                        ["Plate Number", towDetails.tow_truck_plate],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-3">
                          <span className="text-slate-500 font-medium">{k}</span>
                          <span className="text-slate-900 font-bold">{v || "—"}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowTowForm(true)}
                      className="mt-6 py-2.5 px-5 rounded-xl border border-slate-300 text-slate-700 bg-white font-semibold text-xs cursor-pointer hover:bg-slate-50"
                    >
                      Edit Tow Truck Details
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">No tow truck details found.</p>
                )}
              </div>
            )}

            {showTowForm && (
              <div className="max-w-md space-y-3">
                {[
                  ["driverName", "Driver Name", "e.g. John Doe"],
                  ["driverPhone", "Driver Phone", "e.g. +94 77 123 4567"],
                  ["truckBrand", "Truck Brand", "e.g. Isuzu, Toyota"],
                  ["truckColor", "Truck Color", "e.g. White, Blue"],
                  ["truckPlate", "Plate Number", "e.g. WP GA-1234"],
                ].map(([name, label, placeholder]) => (
                  <div key={name}>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={towForm[name]}
                      onChange={handleTowFormChange}
                      placeholder={placeholder}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>
                ))}

                {towError && <p className="text-red-600 text-xs font-semibold">{towError}</p>}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleTowSave}
                    disabled={towSaving}
                    className={`flex-1 py-2.5 rounded-xl border-none bg-emerald-600 text-white font-semibold text-xs ${
                      towSaving ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-emerald-700 shadow-2xs"
                    }`}
                  >
                    {towSaving ? "Saving..." : "Save Details"}
                  </button>
                  <button
                    onClick={() => { setShowTowForm(false); setTowError(""); }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: Services Offered                     */}
        {/* ========================================== */}
        {activeTab === "services" && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900 m-0 flex items-center gap-2">
                <span>🔧</span> Services Offered
              </h3>
            </div>

            {!isEditingServices ? (
              <>
                {shopServices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {shopServices.map((s, idx) => (
                      <div key={idx} className="p-4 border border-slate-200/70 rounded-xl bg-slate-50/60 flex justify-between items-center hover:border-emerald-200 transition-colors">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200/50">
                            {s.category || "General"}
                          </span>
                          <div className="font-bold text-sm text-slate-900 mt-1.5">{s.service_name || s.name}</div>
                          <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                            <span>⏱️</span> {s.duration}
                          </div>
                        </div>
                        <div className="font-bold text-xs text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                          {s.starting_price || s.price}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic mb-4">No custom services added yet.</p>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingServices(true)}
                  className="mt-6 py-2.5 px-6 rounded-xl border-[1.5px] border-emerald-600 text-emerald-700 bg-white font-semibold text-xs cursor-pointer hover:bg-emerald-50 transition-colors shadow-2xs"
                >
                  + Add / Edit Services
                </button>
              </>
            ) : (
              <div>
                <p className="text-xs text-slate-500 mb-4 font-medium">Manage custom services for your workshop:</p>

                {/* Added Services List */}
                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-1">
                  {shopServices.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="font-extrabold text-emerald-700 mr-2">[{s.category || "General"}]</span>
                        <span className="font-semibold text-slate-900">{s.service_name || s.name}</span>
                        <span className="text-slate-500 ml-2">({s.starting_price || s.price} • {s.duration})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        disabled={servicesSaving}
                        className="text-red-600 hover:text-red-800 font-bold border-none bg-transparent cursor-pointer text-xs flex items-center gap-1"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                  {shopServices.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No services in your list. Fill out below to add your first service.</p>
                  )}
                </div>

                {/* Add Custom Service Form */}
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-3 mb-6">
                  <div className="font-bold text-xs text-emerald-900 flex items-center gap-1">
                    <span>+</span> Add New Custom Service
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Category *</label>
                      <input
                        type="text"
                        list="category-suggestions"
                        placeholder="e.g. Mechanical, Electrical"
                        value={newService.category}
                        onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                      />
                      <datalist id="category-suggestions">
                        {COMMON_CATEGORIES.map(cat => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Service Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Full Engine Tune-up"
                        value={newService.service_name}
                        onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Starting Price</label>
                      <input
                        type="text"
                        placeholder="e.g. Rs. 8,500"
                        value={newService.starting_price}
                        onChange={(e) => setNewService({ ...newService, starting_price: e.target.value })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 Hours"
                        value={newService.duration}
                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCustomService}
                    disabled={servicesSaving}
                    className={`w-full py-2.5 text-white font-bold text-xs rounded-xl border-none shadow-2xs transition-colors ${
                      servicesSaving ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                    }`}
                  >
                    {servicesSaving ? "Saving..." : "+ Add Service to List"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSaveServices}
                    disabled={servicesSaving}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs cursor-pointer hover:bg-emerald-700 shadow-2xs"
                  >
                    {servicesSaving ? "Saving..." : "Save All Services"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingServices(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default ShopProfile;
