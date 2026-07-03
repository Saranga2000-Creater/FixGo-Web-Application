import { useEffect, useState } from "react";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";

function Avatar({ initials, color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "22", color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 600, fontSize: size * 0.33, flexShrink: 0,
      border: `1.5px solid ${color}44`
    }}>
      {initials}
    </div>
  );
}

// Maps each status to a badge color and to the next status in the lifecycle
const STATUS_STYLES = {
  "Confirmed":   { bg: "#DBEAFE", color: "#2563EB" },
  "In Progress": { bg: "#FEF3C7", color: "#D97706" },
  "Completed":   { bg: "#DCFCE7", color: "#16A34A" },
};

const NEXT_STATUS = {
  "Confirmed": "In Progress",
  "In Progress": "Completed",
};

const NEXT_STATUS_LABEL = {
  "Confirmed": "Start Repair",
  "In Progress": "Mark Completed",
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function generateMapsUrl(lat, lng) {
  if (!lat || !lng) return "";
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function generateWhatsAppLink(repair) {
  // 1. Clean the driver's phone number (remove +, spaces, hyphens)
  const cleanPhone = repair.dispatched_driver_phone?.replace(/[^0-9]/g, "") || "";
  
  if (!cleanPhone) {
    alert("No driver phone number saved for this dispatch.");
    return "#";
  }

  // 2. Generate the Maps URL
  const mapsUrl = generateMapsUrl(repair.customer_lat, repair.customer_lng);
  
  // 3. Build the Ticket string
  let message = `🚨 *TOW DISPATCH*\n\n`;
  message += `*Customer:* ${repair.customer_name}\n`;
  message += `*Phone:* ${repair.customer_phone}\n`;
  message += `*Vehicle:* ${repair.vehicle_brand} (${repair.vehicle_color})\n\n`;
  
  if (repair.pickup_landmark) {
    message += `*Landmark:* ${repair.pickup_landmark}\n`;
  }
  
  message += `📍 *Navigate to Customer:*\n${mapsUrl}`;

  // 4. URL-Encode the message and build the final wa.me link
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function ActiveRepairs() {
  const [activeRepairs, setActiveRepairs] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("jwt_token");

  fetch("http://localhost:8000/api/getActiveRepairs.php", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("API DATA:", data);

      if (data.success) {
        setActiveRepairs(data.data);
      }
    })
    .catch(console.error);
}, []);
  const handleChangeStatus = async (requestId, currentStatus) => {
    const nextStatus = NEXT_STATUS[currentStatus];
    if (!nextStatus) return;
    setUpdatingId(requestId);

    try {
 const token = localStorage.getItem("jwt_token");

const res = await fetch(
  "http://localhost:8000/api/updateStatus.php",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      request_id: requestId,
      new_status: nextStatus,
    }),
  }
);

      const data = await res.json();

      if (res.ok) {
        if (nextStatus === "Completed") {
          // Completed jobs belong in Service History, not here — remove immediately
          setActiveRepairs((prev) => prev.filter((r) => r.id !== requestId));
        } else {
          setActiveRepairs((prev) =>
            prev.map((r) =>
              r.id === requestId ? { ...r, status: nextStatus } : r
            )
          );
        }
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating the status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          Active Repairs
        </h1>
        <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>
          Track all ongoing repair jobs.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          placeholder="Search customer, vehicle, or repair..."
          style={{
            flex: 1,
            padding: "14px 20px",
            borderRadius: 14,
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            fontSize: 15,
            outline: "none",
          }}
        />

        <button
          style={{
            background: "#16A34A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 14,
            padding: "0 24px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Filter
        </button>
      </div>

      <div style={{
        background: "#FFFFFF",
        borderRadius: 18,
        border: "1px solid #E7EFE8",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}>

        {/* Header - Updated grid columns to give Action column more space */}
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #F3F4F6",
          display: "grid",
          gridTemplateColumns: "2.3fr 2fr 2fr 1.5fr 1.5fr",
          gap: 12
        }}>
          {["Customer", "Vehicle", "Service", "Status", "Action"].map(h => (
            <span key={h} style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {activeRepairs.map((r, i) => {
          const statusStyle = STATUS_STYLES[r.status] || { bg: "#F3F4F6", color: "#6B7280" };
          const nextLabel = NEXT_STATUS_LABEL[r.status];
          const isUpdating = updatingId === r.id;

          return (
            <div key={r.id} style={{
              padding: "16px 20px",
              borderBottom: i < activeRepairs.length - 1 ? "1px solid #F9FAFB" : "none",
              display: "grid",
              gridTemplateColumns: "2.3fr 2fr 2fr 1.5fr 1.5fr", // Matching header grid columns
              gap: 12, alignItems: "center"
            }}>
              {/* Customer */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={getInitials(r.customer_name)} color="#16A34A" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
                    {r.customer_name}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {r.customer_phone}
                  </div>
                </div>
              </div>

              {/* Vehicle */}
              <div>
                <div style={{ fontSize: 14, color: "#374151" }}>{r.vehicle_brand}</div>
                <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>{r.vehicle_color}</div>
              </div>

              {/* Service */}
              <div>
                <div style={{ fontSize: 14, color: "#374151" }}>{r.issue_category}</div>
              </div>

              {/* Status Badge */}
              <span
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 6,
                  width: "130px",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: statusStyle.color,
                  }}
                />
                {r.status}
              </span>

              {/* Action Column - Wrapped completely in a Flex Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                
                {/* 1. Main Action Button */}
                {nextLabel ? (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleChangeStatus(r.id, r.status)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 10,
                      border: "1px solid #D1D5DB",
                      background: isUpdating ? "#F3F4F6" : "#FFFFFF",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: isUpdating ? "not-allowed" : "pointer",
                      width: "100%", // Forces it to span the column neatly
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (isUpdating) return;
                      e.currentTarget.style.background = "#16A34A";
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.borderColor = "#16A34A";
                    }}
                    onMouseLeave={(e) => {
                      if (isUpdating) return;
                      e.currentTarget.style.background = "#FFFFFF";
                      e.currentTarget.style.color = "#374151";
                      e.currentTarget.style.borderColor = "#D1D5DB";
                    }}
                  >
                    {isUpdating ? "Updating..." : nextLabel}
                  </button>
                ) : (
                  <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600, padding: "10px 0" }}>
                    Completed
                  </span>
                )}

                {/* 2. Dispatch Utilities (Stacked neatly under the main button) */}
                {r.requires_tow == 1 && r.status === "Confirmed" && (
                  <div style={{ display: "flex", gap: 6, width: "100%" }}>
                    
                    {/* Map Button */}
                    <a
                      href={generateMapsUrl(r.customer_lat, r.customer_lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Navigate to Customer"
                      style={{
                        flex: 1, 
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                        padding: "6px 0", borderRadius: 8,
                        background: "#E0F2FE", color: "#0369A1", 
                        textDecoration: "none", fontSize: 12, fontWeight: 600,
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#BAE6FD"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#E0F2FE"}
                    >
                      <FaMapMarkerAlt size={14} /> Map
                    </a>

                    {/* WhatsApp Button */}
                    <a
                      href={generateWhatsAppLink(r)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Text Driver Details"
                      style={{
                        flex: 1, 
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                        padding: "6px 0", borderRadius: 8,
                        background: "#DCFCE7", color: "#15803D",
                        textDecoration: "none", fontSize: 12, fontWeight: 600,
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#BBF7D0"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#DCFCE7"}
                    >
                      <FaWhatsapp size={16} /> Driver
                    </a>

                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ padding: "14px 20px", textAlign: "center" }}>
          <button style={{
            padding: "10px 32px", borderRadius: 10,
            border: "1.5px solid #16A34A", color: "#16A34A",
            background: "transparent", fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}>View all active repairs</button>
        </div>
      </div>
    </div>
  );
}

export default ActiveRepairs;


