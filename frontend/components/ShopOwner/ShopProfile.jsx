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
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < count ? "#F59E0B" : "#D1D5DB", fontSize: 14 }}>★</span>
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
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          Shop Profile
        </h1>
        <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>
          Manage your shop information and preferences.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20
      }}>
        {/* Shop Info Card */}
        <div style={{
          background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
          padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 16 }}>
            Shop Information
          </h3>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 12, background: "#1F2937",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32
            }}>
              <img
    src={
      shopData?.profileImageURL
        ? `http://localhost:8000/${shopData.profileImageURL}`
        : "/default-shop.png"
    }
    alt="Shop"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>
  {shopData.name}
</div>
              <span style={{
                background: "#DCFCE7", color: "#15803D", borderRadius: 20,
                padding: "3px 12px", fontSize: 12, fontWeight: 600
              }}>✓ Verified Shop</span>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>
              📍 {shopData.address}
              </div>
              <div style={{ marginTop: 6 }}>
                <Stars count={5} />
                <span style={{ fontSize: 13, color: "#374151", marginLeft: 6 }}>
                  4.8 (128 Reviews)
                </span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>
           {shopData.description} 
          </p>
        </div>

        {/* Business Info Card */}
        <div style={{
          background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
          padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 16 }}>
            Business Information
          </h3>
          {BUSINESS_INFO.map(([k, v]) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between",
              padding: "8px 0", borderBottom: "1px solid #F9FAFB", fontSize: 13
            }}>
              <span style={{ color: "#6B7280" }}>{k}</span>
              <span style={{ color: "#111827", fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Services Offered */}
        <div style={{
          background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
          padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 16 }}>
            Services Offered
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SERVICES.map(s => (
              <div key={s} style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, color: "#374151"
              }}>
                <span style={{ color: "#059669", fontSize: 16 }}>✓</span>
                {s}
              </div>
            ))}
          </div>
          <button style={{
            marginTop: 16, width: "100%", padding: "10px",
            borderRadius: 10, border: "1.5px solid #16A34A",
            color: "#16A34A", background: "transparent",
            fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}>+ Add / Remove Services</button>
        </div>

        {/* Additional Info */}
        <div style={{
          background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
          padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 16 }}>
            Additional Information
          </h3>
          {[
            ["✅ Verified Shop",        "Your shop is verified and visible to all customers."],
            ["📅 Member Since",         "Joined on March 15, 2024"],
            ["📊 Total Completed Jobs", "156 Jobs Completed"],
          ].map(([title, desc]) => (
            <div key={title} style={{ padding: "10px 0", borderBottom: "1px solid #F9FAFB" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{title}</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Shop Gallery */}
<div
  style={{
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #F3F4F6",
    padding: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  }}
>
  <h3
    style={{
      fontWeight: 700,
      fontSize: 16,
      color: "#111827",
      marginBottom: 16,
    }}
  >
    Shop Gallery
  </h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 12,
      marginBottom: 18,
    }}
  >
    {[1, 2, 3, 4].map((img) => (
      <div
        key={img}
        style={{
          height: 120,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          background: "#F9FAFB",
        }}
      >
        <img
          src={`/gallery/image${img}.jpg`}
          alt="Gallery"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    ))}
  </div>

  <div
    style={{
      display: "flex",
      gap: 10,
    }}
  >
    <button
      style={{
        flex: 1,
        padding: "10px",
        background: "#16A34A",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      + Add Images
    </button>

    <button
      style={{
        flex: 1,
        padding: "10px",
        background: "#fff",
        color: "#DC2626",
        border: "1px solid #DC2626",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      Remove Images
    </button>
  </div>
</div>

{isGarage && (
  <div style={{
    background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
    padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
  }}>
    <h3 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 16 }}>
      Tow Truck Details
    </h3>

    {!hasTowService && !showTowForm && (
      <div>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 14 }}>
          Do you provide tow truck / vehicle carriage services?
        </p>
        <button onClick={() => setShowTowForm(true)} style={{
          padding: "10px 16px", borderRadius: 10, border: "none",
          background: "#16A34A", color: "#fff", fontWeight: 600,
          fontSize: 14, cursor: "pointer"
        }}>
          Yes, I provide this service
        </button>
      </div>
    )}

    {hasTowService && !showTowForm && (
      <div>
        {towLoading ? (
          <p style={{ fontSize: 13, color: "#6B7280" }}>Loading tow truck details...</p>
        ) : towDetails ? (
          <>
            {[
              ["Driver Name", towDetails.default_driver_name],
              ["Driver Phone", towDetails.default_driver_phone],
              ["Truck Brand", towDetails.default_truck_brand],
              ["Truck Color", towDetails.default_truck_color],
              ["Plate Number", towDetails.tow_truck_plate],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0", borderBottom: "1px solid #F9FAFB", fontSize: 13
              }}>
                <span style={{ color: "#6B7280" }}>{k}</span>
                <span style={{ color: "#111827", fontWeight: 500 }}>{v || "—"}</span>
              </div>
            ))}
            <button onClick={() => setShowTowForm(true)} style={{
              marginTop: 16, width: "100%", padding: "10px",
              borderRadius: 10, border: "1.5px solid #16A34A",
              color: "#16A34A", background: "transparent",
              fontWeight: 600, fontSize: 14, cursor: "pointer"
            }}>
              Edit Tow Truck Details
            </button>
          </>
        ) : (
          <p style={{ fontSize: 13, color: "#6B7280" }}>No tow truck details found.</p>
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
          <div key={name} style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{label}</label>
            <input
              type="text" name={name} value={towForm[name]}
              onChange={handleTowFormChange} placeholder={placeholder}
              style={{
                width: "100%", padding: "8px 10px", marginTop: 4,
                borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13,
                boxSizing: "border-box"
              }}
            />
          </div>
        ))}

        {towError && <p style={{ color: "#DC2626", fontSize: 12, marginBottom: 10 }}>{towError}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={handleTowSave} disabled={towSaving} style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none",
            background: "#16A34A", color: "#fff", fontWeight: 600,
            fontSize: 14, cursor: towSaving ? "not-allowed" : "pointer",
            opacity: towSaving ? 0.7 : 1
          }}>
            {towSaving ? "Saving..." : "Save Details"}
          </button>
          <button onClick={() => { setShowTowForm(false); setTowError(""); }} style={{
            flex: 1, padding: "10px", borderRadius: 10,
            border: "1px solid #D1D5DB", background: "#fff",
            color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}>
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
