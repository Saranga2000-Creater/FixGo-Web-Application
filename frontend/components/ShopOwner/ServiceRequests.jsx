import { useEffect, useState } from "react";

const COLORS = {
  primary: "#15803D",      // deeper, richer green (better contrast than #16A34A)
  primaryLight: "#16A34A",
  primarySoft: "#ECFDF3",
  primaryBorder: "#BBF7D0",
  danger: "#DC2626",
  dangerSoft: "#FEF2F2",
  dangerBorder: "#FECACA",
  text: "#0F172A",
  textMuted: "#64748B",
  textFaint: "#94A3B8",
  border: "#E5E9F0",
  surface: "#FFFFFF",
  page: "#F8FAFC",
};


function Avatar({ initials, color, size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color + "1A",
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.34,
        flexShrink: 0,
        border: `1.5px solid ${color}33`,
        letterSpacing: 0.2,
      }}
    >
      {initials}
    </div>
  );
}

function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const updateStatus = async (requestId, status) => {
  try {
    const token = localStorage.getItem("jwt_token");

const response = await fetch(
  "http://localhost/project/FixGo-Web-Application/backend/api/updateStatus.php",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      request_id: requestId,
      new_status: status,
      actor_id: parseInt(localStorage.getItem("shopId")),
      actor_role: "shop_owner"
    }),
  }
);

const data = await response.json();

console.log(data);

alert(data.message);

    fetchRequests();

  } catch (error) {
    console.error(error);
  }
};
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
   const shopId = localStorage.getItem("shopId");
  console.log("Current Shop ID:", shopId);

const response = await fetch(
  `http://localhost/project/FixGo-Web-Application/backend/api/getServiceRequests.php?shop_id=${shopId}`
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
    <div style={{ width: "100%", fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.text,
            margin: 0,
            letterSpacing: -0.3,
          }}
        >
          Service Requests
        </h1>
        <p
          style={{
            color: COLORS.textMuted,
            marginTop: 6,
            fontSize: 15.5,
            lineHeight: 1.5,
          }}
        >
          Review and respond to incoming service requests.
        </p>
      </div>

      {/* Search + Filter */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          placeholder="Search customer, vehicle, or service..."
          style={{
            flex: 1,
            padding: "13px 18px",
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.surface,
            fontSize: 15,
            color: COLORS.text,
            outline: "none",
            transition: "border-color 0.15s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.primaryLight)}
          onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
        />

        <button
          style={{
            background: COLORS.primary,
            color: "#FFFFFF",
            border: "none",
            borderRadius: 12,
            padding: "0 24px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#116530")}
          onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.primary)}
        >
          Filter
        </button>
      </div>

      {/* Table card */}
      <div
        style={{
          background: COLORS.surface,
          borderRadius: 18,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.04)",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${COLORS.border}`,
            background: COLORS.page,
            display: "grid",
            gridTemplateColumns: "2.2fr 1.5fr 1fr 1fr 1.5fr",
            gap: 8,
          }}
        >
          {["Customer & Vehicle", "Service", "Urgency", "Details", "Action"].map((h) => (
            <span
              key={h}
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: COLORS.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {requests.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              color: COLORS.textFaint,
              fontSize: 15,
            }}
          >
            No service requests found
          </div>
        ) : (
          requests.map((r, i) => (
            <div
              key={r.id}
              onMouseEnter={() => setHoveredRow(r.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                padding: "18px 24px",
                borderBottom: i < requests.length - 1 ? `1px solid ${COLORS.border}` : "none",
                display: "grid",
                gridTemplateColumns: "2.2fr 1.5fr 1fr 1fr 1.5fr",
                gap: 8,
                alignItems: "center",
                background: hoveredRow === r.id ? COLORS.page : "transparent",
                transition: "background 0.15s ease",
              }}
            >
              {/* Customer & Vehicle */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar
                  initials={r.customer_name?.substring(0, 2).toUpperCase()}
                  color={COLORS.primary}
                />

                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: COLORS.text,
                    }}
                  >
                    {r.customer_name}
                  </div>

                  <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 2 }}>
                    🚗 {r.vehicle_brand}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: COLORS.primary,
                      fontWeight: 600,
                      marginTop: 1,
                    }}
                  >
                    🎨 {r.vehicle_color}
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <div
                  style={{
                    fontSize: 15.5,
                    color: COLORS.text,
                    fontWeight: 500,
                  }}
                >
                  {r.issue_category}
                </div>

                {Number(r.requires_tow) === 1 && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "inline-block",
                      padding: "4px 9px",
                      borderRadius: 8,
                      background: COLORS.dangerSoft,
                      border: `1px solid ${COLORS.dangerBorder}`,
                      color: COLORS.danger,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    🚚 Tow Truck Required
                  </div>
                )}

                {r.pickup_landmark && Number(r.requires_tow) === 1 && (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12.5,
                      color: COLORS.textFaint,
                    }}
                  >
                    📍 {r.pickup_landmark}
                  </div>
                )}
              </div>

              {/* Urgency */}
              <div>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    background: r.urgency_level === "Urgent" ? COLORS.dangerSoft : COLORS.primarySoft,
                    border: `1px solid ${
                      r.urgency_level === "Urgent" ? COLORS.dangerBorder : COLORS.primaryBorder
                    }`,
                    color: r.urgency_level === "Urgent" ? COLORS.danger : COLORS.primary,
                  }}
                >
                  {r.urgency_level}
                </span>
              </div>

              {/* Details */}
              <div>
                <button
                  onClick={() => setSelectedRequest(r)}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 9,
                    border: `1px solid ${COLORS.primary}`,
                    background: COLORS.surface,
                    color: COLORS.primary,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.primarySoft)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.surface)}
                >
                  View Details
                </button>
              </div>

        {/* Actions */}
<div style={{ display: "flex", gap: 8 }}>
  {r.status === "Pending" ? (
    <>
      <button
        style={{
          padding: "9px 18px",
          borderRadius: 10,
          border: "none",
          background: COLORS.primary,
          color: "#FFFFFF",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#116530")}
        onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.primary)}
        onClick={() => updateStatus(r.id, "Accepted")}
      >
        Accept
      </button>

      <button
        style={{
          padding: "9px 18px",
          borderRadius: 10,
          border: `1px solid ${COLORS.dangerBorder}`,
          color: COLORS.danger,
          background: COLORS.surface,
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.dangerSoft)}
        onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.surface)}
        onClick={() => updateStatus(r.id, "Declined")}
      >
        Decline
      </button>
    </>
  ) :r.status === "Accepted" ? (
    <span
      style={{
        padding: "8px 14px",
        borderRadius: "999px",
        background: "#FEF3C7",
        color: "#92400E",
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      Waiting for customer confirmation
    </span>
  ) : (
    <span
      style={{
        padding: "8px 14px",
        borderRadius: "999px",
        background: "#FEE2E2",
        color: "#DC2626",
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {r.status}
    </span>
  )}
</div> 
  
            </div>
          ))
        )}

        {/* Footer */}
        <div style={{ padding: "16px 24px", textAlign: "center", borderTop: `1px solid ${COLORS.border}` }}>
          <button
            style={{
              padding: "11px 36px",
              borderRadius: 10,
              border: `1.5px solid ${COLORS.primary}`,
              color: COLORS.primary,
              background: "transparent",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.primarySoft)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            View all requests
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedRequest && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: COLORS.surface,
              width: 600,
              maxWidth: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 24px 48px rgba(15,23,42,0.25)",
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 20,
                fontSize: 21,
                fontWeight: 700,
                color: COLORS.text,
              }}
            >
              Service Request Details
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  Customer
                </div>
                <div style={{ fontSize: 16.5, color: COLORS.text, marginTop: 2 }}>
                  {selectedRequest.customer_name}
                </div>
              </div>

              <div>
  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.4 }}>
    Issue
  </div>
  <div style={{ fontSize: 16.5, color: COLORS.text, marginTop: 2 }}>
    {selectedRequest.issue_category}
  </div>
</div>

{/* Appointment Section */}
<div>
  <div
    style={{
      fontSize: 13,
      fontWeight: 600,
      color: COLORS.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.4
    }}
  >
    Appointment
  </div>

  <div
    style={{
      fontSize: 16.5,
      color: COLORS.text,
      marginTop: 2
    }}
  >
    {selectedRequest.preferred_date
      ? `${selectedRequest.preferred_date} • ${selectedRequest.preferred_time}`
      : "Not specified"}
  </div>
</div>

<div>
  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>
    Description
  </div>
                <div
                  style={{
                    background: COLORS.page,
                    border: `1px solid ${COLORS.border}`,
                    padding: 14,
                    borderRadius: 10,
                    fontSize: 15,
                    color: COLORS.text,
                    lineHeight: 1.6,
                  }}
                >
                  {selectedRequest.description}
                </div>
              </div>
            </div>

            {selectedRequest.photo && (
              <img
                src={`http://localhost/project/FixGo-Web-Application/backend/${selectedRequest.photo}`}
                alt="Problem"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginTop: 6,
                  border: `1px solid ${COLORS.border}`,
                }}
              />
            )}

            <button
              onClick={() => setSelectedRequest(null)}
              style={{
                marginTop: 24,
                padding: "11px 24px",
                background: COLORS.primary,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#116530")}
              onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.primary)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceRequests;

