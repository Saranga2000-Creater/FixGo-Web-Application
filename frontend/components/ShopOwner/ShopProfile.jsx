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
      </div>
    </div>
  );
}

export default ShopProfile;
