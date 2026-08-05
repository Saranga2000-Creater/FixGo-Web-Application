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
    name: "", owner: "", phone: "", address: "", brn: "",
    openTime: "08:00", closeTime: "18:00", vehicleCategories: []
  });

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
        openTime: shopData.openTime || "08:00:00",
        closeTime: shopData.closeTime || "18:00:00",
        vehicleCategories: vCats
      });
    }
  }, [shopData]);

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

  const handleSaveBusinessInfo = async () => {
    setBusinessError("");
    if (!businessForm.name.trim() || !businessForm.owner.trim() || !businessForm.phone.trim() || !businessForm.address.trim()) {
      setBusinessError("Shop Name, Owner, Phone, and Address are required.");
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
          address: businessForm.address,
          BRN: businessForm.brn,
          openTime: businessForm.openTime,
          closeTime: businessForm.closeTime,
          vehicleCategories: businessForm.vehicleCategories.join(', ')
        });
        setIsEditingBusinessInfo(false);
      } else {
        setBusinessError(res.message || "Failed to save business information.");
      }
    } catch (err) {
      setBusinessError(err.message || "Error saving business information.");
    } finally {
      setBusinessSaving(false);
    }
  };

  // Custom Service Entry Handlers
  const handleAddCustomService = () => {
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

    setShopServices(prev => Array.isArray(prev) ? [...prev, entry] : [entry]);
    setNewService({ category: "Mechanical", service_name: "", starting_price: "", duration: "" });
  };

  const handleRemoveService = (index) => {
    setShopServices(prev => Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []);
  };

  const handleSaveServices = async () => {
    setServicesSaving(true);
    let finalServices = Array.isArray(shopServices) ? [...shopServices] : [];
    if (newService.service_name.trim()) {
      finalServices.push({
        category: newService.category.trim() || "General",
        service_name: newService.service_name.trim(),
        starting_price: newService.starting_price.trim() || "Varies",
        duration: newService.duration.trim() || "Varies"
      });
      setShopServices(finalServices);
      setNewService({ category: "Mechanical", service_name: "", starting_price: "", duration: "" });
    }
    try {
      const res = await api.post("shop/updateServices.php", { services: finalServices });
      if (res.success) {
        setIsEditingServices(false);
      } else {
        alert(res.message || "Failed to update services.");
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
            tow_truck_plate: towForm.truckPlate,
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

  const BUSINESS_INFO = [
    ["Shop Name", shopData.name],
    ["Owner", shopData.owner],
    ["Category", shopData.categories || "Not Assigned"],
    ["Vehicle Categories", shopData.vehicleCategories || "Not Assigned"],
    ["Carriage Service", shopData.carriageService ? "Available" : "Not Available"],
    ["Email", shopData.email],
    ["Phone", shopData.contactNumber],
    ["Address", shopData.address],
    ["Reg. No.", shopData.BRN || "Not Available"],
    ["Hours", `${shopData.openTime} - ${shopData.closeTime}`]
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 m-0 tracking-tight">
          Shop Profile
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Manage your workshop details, gallery images, services, and business settings.
        </p>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Shop Info & Tow Truck Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Shop Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <span>🏬</span> Shop Information
            </h3>
            <div className="flex gap-4 mb-4">
              {/* Profile Photo Avatar with Hover Edit Overlay */}
              <div className="relative w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center text-3xl overflow-hidden shrink-0 group border border-slate-200 shadow-2xs">
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
                  alt="Shop"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => profilePhotoInputRef.current?.click()}
                  disabled={uploadingProfilePhoto}
                  title="Change Profile Photo"
                  className="absolute inset-0 bg-slate-900/60 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                >
                  {uploadingProfilePhoto ? "..." : "📷 Edit"}
                </button>
              </div>
              <div>
                <div className="font-bold text-lg text-slate-900">
                  {shopData.name}
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full py-0.5 px-2.5 text-xs font-semibold inline-block mt-1">
                  ✓ Verified Shop
                </span>
                <div className="text-[13px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <span>📍</span> {shopData.address}
                </div>
                <div className="mt-1.5 flex items-center">
                  <Stars count={Math.round(Number(shopData.averageRating || 0))} />
                  <span className="text-[13px] text-slate-700 ml-1.5 font-semibold">
                    {Number(shopData.averageRating || 0).toFixed(1)} ({shopData.reviewCount || 0} Reviews)
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 m-0 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              {shopData.description || "No description provided."}
            </p>

            {/* Shop Gallery */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-[13.5px] text-slate-900 m-0 flex items-center gap-1.5">
                  🖼️ Gallery <span className="text-xs font-normal text-slate-500">({galleryImages.length}/4)</span>
                  {uploadingGallery && <span className="text-xs text-emerald-600 font-semibold ml-1">(Uploading...)</span>}
                </h4>
                <div className="flex gap-1.5">
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
                    className={`w-7 h-7 rounded-lg border-none font-bold text-[15px] cursor-pointer flex items-center justify-center leading-none ${
                      galleryImages.length >= 4
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                    }`}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleteMode(!isDeleteMode);
                      setSelectedImagesToDelete([]);
                    }}
                    title={isDeleteMode ? "Cancel Removing" : "Remove Images"}
                    className={`w-7 h-7 rounded-lg font-bold text-sm cursor-pointer flex items-center justify-center leading-none ${
                      isDeleteMode
                        ? "bg-slate-200 text-slate-700 border border-slate-300"
                        : "border border-red-500 bg-white text-red-600 hover:bg-red-50"
                    }`}
                  >
                    −
                  </button>
                </div>
              </div>

              {galleryImages.length > 0 ? (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {galleryImages.map((img) => {
                      const isSelected = selectedImagesToDelete.includes(img.id);
                      return (
                        <div
                          key={img.id}
                          onClick={() => isDeleteMode && handleToggleSelectImage(img.id)}
                          className={`relative w-16 h-16 rounded-[10px] overflow-hidden border bg-slate-50 shrink-0 transition-all ${
                            isDeleteMode ? "cursor-pointer" : ""
                          } ${
                            isSelected
                              ? "ring-2 ring-red-500 border-red-500"
                              : "border-slate-200"
                          }`}
                        >
                          <img
                            src={`${UPLOADS_URL}/${img.url}`}
                            alt="Gallery"
                            className="w-full h-full object-cover"
                          />
                          {isDeleteMode && (
                            <div className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isSelected ? "bg-red-600 text-white" : "bg-black/40 text-white/80 border border-white"
                            }`}>
                              {isSelected ? "✓" : "○"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {isDeleteMode && (
                    <div className="mt-3 p-2.5 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between">
                      <span className="text-xs text-red-700 font-medium">
                        {selectedImagesToDelete.length} selected
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleConfirmBatchDelete}
                          disabled={deletingGallery || selectedImagesToDelete.length === 0}
                          className={`py-1 px-3 rounded-lg text-xs font-bold text-white border-none ${
                            selectedImagesToDelete.length === 0 || deletingGallery
                              ? "bg-red-300 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700 cursor-pointer shadow-2xs"
                          }`}
                        >
                          {deletingGallery ? "Deleting..." : "Confirm Remove"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDeleteMode(false);
                            setSelectedImagesToDelete([]);
                          }}
                          className="py-1 px-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                  No gallery photos added yet. Click + to add.
                </div>
              )}
            </div>

            {/* Go to my Shop */}
            <button
              onClick={handleGoToShop}
              className="mt-5 w-full py-2.5 rounded-xl border-none bg-emerald-600 text-white font-semibold text-sm cursor-pointer flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition shadow-2xs"
            >
              🔗 Go to my Public Shop Page
            </button>
          </div>

          {/* Tow Truck Details Card (If Garage) */}
          {isGarage && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
                <span>🚛</span> Tow Truck Details
              </h3>

              {!hasTowService && !showTowForm && (
                <div>
                  <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
                    Do you provide tow truck or vehicle carriage services?
                  </p>
                  <button
                    onClick={() => setShowTowForm(true)}
                    className="w-full py-2.5 px-4 rounded-xl border-none bg-emerald-600 text-white font-semibold text-xs cursor-pointer hover:bg-emerald-700 transition shadow-2xs"
                  >
                    Yes, I provide tow service
                  </button>
                </div>
              )}

              {hasTowService && !showTowForm && (
                <div>
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
                          <div key={k} className="flex justify-between py-2">
                            <span className="text-slate-500">{k}</span>
                            <span className="text-slate-900 font-semibold">{v || "—"}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowTowForm(true)}
                        className="mt-4 w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white font-semibold text-xs cursor-pointer hover:bg-slate-50"
                      >
                        Edit Tow Details
                      </button>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500">No tow truck details found.</p>
                  )}
                </div>
              )}

              {showTowForm && (
                <div>
                  {[
                    ["driverName", "Driver Name", "e.g. John Doe"],
                    ["driverPhone", "Driver Phone", "e.g. +94 77 123 4567"],
                    ["truckBrand", "Truck Brand", "e.g. Isuzu, Toyota"],
                    ["truckColor", "Truck Color", "e.g. White, Blue"],
                    ["truckPlate", "Plate Number", "e.g. WP GA-1234"],
                  ].map(([name, label, placeholder]) => (
                    <div key={name} className="mb-3">
                      <label className="text-[11px] text-slate-600 font-semibold block mb-1">{label}</label>
                      <input
                        type="text"
                        name={name}
                        value={towForm[name]}
                        onChange={handleTowFormChange}
                        placeholder={placeholder}
                        className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                      />
                    </div>
                  ))}

                  {towError && <p className="text-red-600 text-xs mb-2.5 font-semibold">{towError}</p>}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleTowSave}
                      disabled={towSaving}
                      className={`flex-1 py-2 rounded-xl border-none bg-emerald-600 text-white font-semibold text-xs ${
                        towSaving ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-emerald-700 shadow-2xs"
                      }`}
                    >
                      {towSaving ? "Saving..." : "Save Details"}
                    </button>
                    <button
                      onClick={() => { setShowTowForm(false); setTowError(""); }}
                      className="flex-1 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs cursor-pointer hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Business Info & Services Offered */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Business Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-900 m-0 flex items-center gap-2">
                <span>📋</span> Business Information
              </h3>
              {!isEditingBusinessInfo ? (
                <button
                  type="button"
                  onClick={() => setIsEditingBusinessInfo(true)}
                  className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer border-none bg-transparent"
                >
                  ✏️ Edit Info
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingBusinessInfo(false)}
                  className="text-xs text-slate-500 font-semibold hover:underline cursor-pointer border-none bg-transparent"
                >
                  Cancel
                </button>
              )}
            </div>

            {!isEditingBusinessInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 divide-y divide-slate-100 md:divide-y-0 text-xs">
                {BUSINESS_INFO.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2 border-b border-slate-100"
                  >
                    <span className="text-slate-500 font-medium">{k}</span>
                    <span className="text-slate-900 font-semibold text-right max-w-[55%]">{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Shop Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={businessForm.name}
                      onChange={handleBusinessFormChange}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Owner *</label>
                    <input
                      type="text"
                      name="owner"
                      value={businessForm.owner}
                      onChange={handleBusinessFormChange}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="py-1">
                    <span className="text-xs text-slate-500 font-semibold block">Category (Read-Only)</span>
                    <span className="text-xs text-slate-800 font-medium">{shopData.categories || "Not Assigned"}</span>
                  </div>

                  <div className="py-1">
                    <span className="text-xs text-slate-500 font-semibold block">Email (Read-Only)</span>
                    <span className="text-xs text-slate-800 font-medium">{shopData.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Phone *</label>
                    <input
                      type="text"
                      name="phone"
                      value={businessForm.phone}
                      onChange={handleBusinessFormChange}
                      placeholder="e.g. +94123456789 or 0123456789"
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Reg. No. (BRN)</label>
                    <input
                      type="text"
                      name="brn"
                      value={businessForm.brn}
                      onChange={handleBusinessFormChange}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={businessForm.address}
                    onChange={handleBusinessFormChange}
                    className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Open Time</label>
                    <input
                      type="time"
                      name="openTime"
                      value={businessForm.openTime}
                      onChange={handleBusinessFormChange}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Close Time</label>
                    <input
                      type="time"
                      name="closeTime"
                      value={businessForm.closeTime}
                      onChange={handleBusinessFormChange}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Supported Vehicle Categories</label>
                  <div className="flex flex-wrap gap-3 mt-1.5">
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

          {/* Services Offered Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-900 m-0 flex items-center gap-2">
                <span>🔧</span> Services Offered
              </h3>
            </div>

            {!isEditingServices ? (
              <>
                {shopServices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {shopServices.map((s, idx) => (
                      <div key={idx} className="p-3.5 border border-slate-200/70 rounded-xl bg-slate-50/60 flex justify-between items-center hover:border-emerald-200 transition-colors">
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
                  className="mt-4 w-full py-2.5 rounded-xl border-[1.5px] border-emerald-600 text-emerald-700 bg-white font-semibold text-sm cursor-pointer hover:bg-emerald-50 transition-colors shadow-2xs"
                >
                  + Add / Edit Services
                </button>
              </>
            ) : (
              <div>
                <p className="text-xs text-slate-500 mb-3 font-medium">Manage custom services for your workshop:</p>

                {/* Added Services List */}
                <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
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
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-3 mb-4">
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
                        className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
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
                        className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
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
                        className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 Hours"
                        value={newService.duration}
                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                        className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCustomService}
                    className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 cursor-pointer border-none shadow-2xs transition-colors"
                  >
                    + Add Service to List
                  </button>
                </div>

                <div className="flex gap-2">
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

        </div>
      </div>
    </div>
  );
}

export default ShopProfile;
