import { useEffect, useState } from "react";


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

function ServiceRequests() {
   const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost/project/FixGo-Web-Application/backend/api/getServiceRequests.php?shop_id=2"
      );

      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          Service Requests
        </h1>
        <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>
          Review and respond to incoming service requests.
        </p>
      </div>
      <div
  style={{
    display: "flex",
    gap: 12,
    marginBottom: 20,
  }}
>
  <input
    placeholder="Search customer, vehicle, or service..."
    style={{
      flex: 1,
      padding: "12px 16px",
      borderRadius: 12,
      border: "1px solid #E5E7EB",
      background: "#FFFFFF",
      fontSize: 14,
      outline: "none",
    }}
  />

  <button
    style={{
      background: "#16A34A",
      color: "#FFFFFF",
      border: "none",
      borderRadius: 12,
      padding: "0 20px",
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
        {/* Table Header */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #F9FAFB",
          display: "grid",
          gridTemplateColumns: "2fr 2fr 2fr 1.5fr 1.5fr",
          gap: 12
        }}>
          {["Customer", "Vehicle", "Service", "Date", "Action"].map(h => (
            <span key={h} style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
{requests.length === 0 ? (
  <div
    style={{
      padding: "30px",
      textAlign: "center",
      color: "#6B7280",
    }}
  >
    No service requests found
  </div>
) : (
  requests.map((r, i) => (
    <div
      key={r.id}
      style={{
        padding: "16px 20px",
        borderBottom:
          i < requests.length - 1
            ? "1px solid #F9FAFB"
            : "none",
        display: "grid",
        gridTemplateColumns: "2fr 2fr 2fr 1.5fr 1.5fr",
        gap: 12,
        alignItems: "center",
      }}
    >
      {/* Customer */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar
          initials={r.customer_name?.substring(0, 2).toUpperCase()}
          color="#16A34A"
        />
        <span
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "#111827",
          }}
        >
          {r.customer_name}
        </span>
      </div>

      {/* Vehicle */}
      <div>
        <div style={{ fontSize: 14, color: "#374151" }}>
          {r.vehicle_brand}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#16A34A",
            fontWeight: 600,
          }}
        >
          {r.vehicle_color}
        </div>
      </div>

      {/* Service */}
      <div style={{ fontSize: 14, color: "#374151" }}>
        {r.issue_category}
      </div>

      {/* Date */}
      <div style={{ fontSize: 13, color: "#6B7280" }}>
        <div>{r.preferred_date}</div>
        <div>{r.preferred_time}</div>
      </div>

      {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
  style={{
    padding: "8px 16px",
    borderRadius: 10,
    border: "none",
    background: "#16A34A",
    color: "#FFFFFF",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  }}
>
  Accept
</button>
<button
  style={{
    padding: "8px 16px",
    borderRadius: 10,
    border: "1px solid #EF4444",
    color: "#EF4444",
    background: "#FFFFFF",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  }}
>
  Decline
</button>
            </div>
          </div>
  ))
        )}

        {/* Footer */}
        <div style={{ padding: "14px 20px", textAlign: "center" }}>
          <button style={{
            padding: "10px 32px", borderRadius: 10,
            border: "1.5px solid #16A34A", color: "#16A34A",
            background: "transparent", fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}>View all requests</button>
        </div>
      </div>
    </div>
  );
}

export default ServiceRequests;
