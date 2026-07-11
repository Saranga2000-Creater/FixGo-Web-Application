import { useEffect, useState } from "react";


const SERVICES = [
  "General Service & Maintenance",
  "Engine Repair",
  "Brake Service",
  "Transmission Repair",
  "Electrical System",
  "AC Service",
  "Suspension & Steering",
  "Diagnostics",
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

const [towDetails, setTowDetails] = useState(null);
const [towLoading, setTowLoading] = useState(false);
const [showTowForm, setShowTowForm] = useState(false);
const [towSaving, setTowSaving] = useState(false);
const [towError, setTowError] = useState("");
const [towForm, setTowForm] = useState({
  driverName: "", driverPhone: "", truckBrand: "", truckColor: "", truckPlate: "",
});

useEffect(() => {
  if (!shopData) return;

  const token = localStorage.getItem("jwt_token");
  setTowLoading(true);

  fetch("http://localhost:8000/api/getTowTruckDetails.php", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
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

  const token = localStorage.getItem("jwt_token");
  setTowSaving(true);

  fetch("http://localhost:8000/api/updateShopTowTruckDetails.php", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
  ...towForm,
}),
  })
    .then(res => res.json())
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

useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
        console.error("Token not found");
        return;
    }

    fetch("http://localhost:8000/api/getShopProfile.php", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(res => res.json())
        .then(data => {
            console.log("Shop Data:", data);

            if (data.success) {
                setShopData(data.data);
                console.log(shopData);
            } else {
                console.error(data.message);
            }
        })
        .catch(err => {
            console.error("Error loading shop profile:", err);
        });

}, []);
  if (!shopData) {
    return <div>Loading shop profile...</div>;
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 m-0">
          Shop Profile
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage your shop information and preferences.
        </p>
      </div>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {/* Shop Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <h3 className="font-bold text-base text-gray-900 mb-4">
            Shop Information
          </h3>
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl bg-gray-800 flex items-center justify-center text-3xl overflow-hidden">
              <img
                src={
                  shopData?.profileImageURL
                    ? `http://localhost:8000/${shopData.profileImageURL}`
                    : "/default-shop.png"
                }
                alt="Shop"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">
                {shopData.name}
              </div>
              <span className="bg-green-100 text-green-700 rounded-full py-0.5 px-3 text-xs font-semibold">
                ✓ Verified Shop
              </span>
              <div className="text-[13px] text-gray-500 mt-1.5">
                📍 {shopData.address}
              </div>
              <div className="mt-1.5">
                <Stars count={5} />
                <span className="text-[13px] text-gray-700 ml-1.5">
                  4.8 (128 Reviews)
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-700 m-0">
            {shopData.description}
          </p>

          {/* Shop Gallery — condensed strip */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-[13.5px] text-gray-900 m-0">
                Shop Gallery
              </h4>
              <div className="flex gap-1.5">
                <button
                  title="Add Images"
                  className="w-7 h-7 rounded-lg border-none bg-green-600 text-white font-bold text-[15px] cursor-pointer flex items-center justify-center leading-none"
                >
                  +
                </button>
                <button
                  title="Remove Images"
                  className="w-7 h-7 rounded-lg border border-red-600 bg-white text-red-600 font-bold text-sm cursor-pointer flex items-center justify-center leading-none"
                >
                  −
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {[1, 2, 3, 4].map((img) => (
                <div
                  key={img}
                  className="w-16 h-16 rounded-[10px] overflow-hidden border border-gray-200 bg-gray-50 shrink-0"
                >
                  <img
                    src={`/gallery/image${img}.jpg`}
                    alt="Gallery"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Go to my Shop */}
          <button
            onClick={handleGoToShop}
            className="mt-5 w-full py-2.5 rounded-[10px] border-none bg-green-600 text-white font-semibold text-sm cursor-pointer flex items-center justify-center gap-1.5"
          >
            🔗 Go to my Shop
          </button>
        </div>

        {/* Business Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <h3 className="font-bold text-base text-gray-900 mb-4">
            Business Information
          </h3>
          {BUSINESS_INFO.map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between py-2 border-b border-gray-50 text-[13px]"
            >
              <span className="text-gray-500">{k}</span>
              <span className="text-gray-900 font-medium text-right max-w-[55%]">{v}</span>
            </div>
          ))}
        </div>

        {/* Services Offered */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <h3 className="font-bold text-base text-gray-900 mb-4">
            Services Offered
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {SERVICES.map((s) => (
              <div key={s} className="flex items-center gap-2 text-[13px] text-gray-700">
                <span className="text-emerald-600 text-base">✓</span>
                {s}
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 rounded-[10px] border-[1.5px] border-green-600 text-green-600 bg-transparent font-semibold text-sm cursor-pointer">
            + Add / Remove Services
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <h3 className="font-bold text-base text-gray-900 mb-4">
            Additional Information
          </h3>
          {[
            ["✅ Verified Shop", "Your shop is verified and visible to all customers."],
            ["📅 Member Since", "Joined on March 15, 2024"],
            ["📊 Total Completed Jobs", "156 Jobs Completed"],
          ].map(([title, desc]) => (
            <div key={title} className="py-2.5 border-b border-gray-50">
              <div className="font-semibold text-[13px] text-gray-900">{title}</div>
              <div className="text-[13px] text-gray-500 mt-0.5">{desc}</div>
            </div>
          ))}
        </div>

        {isGarage && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <h3 className="font-bold text-base text-gray-900 mb-4">
              Tow Truck Details
            </h3>

            {!hasTowService && !showTowForm && (
              <div>
                <p className="text-[13px] text-gray-500 mb-3.5">
                  Do you provide tow truck / vehicle carriage services?
                </p>
                <button
                  onClick={() => setShowTowForm(true)}
                  className="py-2.5 px-4 rounded-[10px] border-none bg-green-600 text-white font-semibold text-sm cursor-pointer"
                >
                  Yes, I provide this service
                </button>
              </div>
            )}

            {hasTowService && !showTowForm && (
              <div>
                {towLoading ? (
                  <p className="text-[13px] text-gray-500">Loading tow truck details...</p>
                ) : towDetails ? (
                  <>
                    {[
                      ["Driver Name", towDetails.default_driver_name],
                      ["Driver Phone", towDetails.default_driver_phone],
                      ["Truck Brand", towDetails.default_truck_brand],
                      ["Truck Color", towDetails.default_truck_color],
                      ["Plate Number", towDetails.tow_truck_plate],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between py-2 border-b border-gray-50 text-[13px]"
                      >
                        <span className="text-gray-500">{k}</span>
                        <span className="text-gray-900 font-medium">{v || "—"}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => setShowTowForm(true)}
                      className="mt-4 w-full py-2.5 rounded-[10px] border-[1.5px] border-green-600 text-green-600 bg-transparent font-semibold text-sm cursor-pointer"
                    >
                      Edit Tow Truck Details
                    </button>
                  </>
                ) : (
                  <p className="text-[13px] text-gray-500">No tow truck details found.</p>
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
                  <div key={name} className="mb-2.5">
                    <label className="text-xs text-gray-500 font-semibold">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={towForm[name]}
                      onChange={handleTowFormChange}
                      placeholder={placeholder}
                      className="w-full py-2 px-2.5 mt-1 rounded-lg border border-gray-300 text-[13px] box-border"
                    />
                  </div>
                ))}

                {towError && <p className="text-red-600 text-xs mb-2.5">{towError}</p>}

                <div className="flex gap-2.5 mt-2.5">
                  <button
                    onClick={handleTowSave}
                    disabled={towSaving}
                    className={`flex-1 py-2.5 rounded-[10px] border-none bg-green-600 text-white font-semibold text-sm ${
                      towSaving ? "cursor-not-allowed opacity-70" : "cursor-pointer opacity-100"
                    }`}
                  >
                    {towSaving ? "Saving..." : "Save Details"}
                  </button>
                  <button
                    onClick={() => { setShowTowForm(false); setTowError(""); }}
                    className="flex-1 py-2.5 rounded-[10px] border border-gray-300 bg-white text-gray-700 font-semibold text-sm cursor-pointer"
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
