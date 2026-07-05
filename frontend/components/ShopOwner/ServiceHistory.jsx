import { useEffect, useState } from "react";

const COLORS = {
  primary: "#15803D",
  text: "#0F172A",
  textMuted: "#64748B",
  border: "#E5E9F0",
  surface: "#FFFFFF",
  page: "#F8FAFC",
};

function Avatar({ initials, color, size = 32 }) {
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

const AVATAR_COLORS = ["#7C3AED", "#059669", "#2563EB", "#16A34A", "#EF4444", "#D97706"];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function colorForId(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ServiceHistory({ shopCategory }) {
  const [history, setHistory] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    console.error("No JWT token found.");
    return;
  }

  fetch("http://localhost:8000/api/getServiceHistory.php", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }
      return res.json();
    })
    .then((data) => {
      console.log("API DATA:", data);

      if (data.success) {
        setHistory(data.data);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}, []);
  

console.log("History state:", history);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          Service History
        </h1>
        <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>
          All completed service records.
        </p>
      </div>

      <div style={{
        background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
        overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Customer", "Vehicle", "Service Provided", "Confirmed On", "Completed On", "Action"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 12, fontWeight: 600, color: "#6B7280",
                    borderBottom: "1px solid #F3F4F6"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "24px 16px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
                    No completed services yet.
                  </td>
                </tr>
              )}
              {history.map((r, i) => (
                <tr key={r.id} style={{
                  borderBottom: i < history.length - 1 ? "1px solid #F9FAFB" : "none"
                }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={getInitials(r.customer_name)} color={colorForId(r.id)} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{r.customer_name}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>{r.customer_phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, color: "#374151" }}>{r.vehicle_brand}</div>
                    <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>{r.vehicle_color}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "#374151" }}>{r.issue_category}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#6B7280" }}>{formatDate(r.confirmed_at)}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#6B7280" }}>{formatDate(r.completed_at)}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <button
                      onClick={() => setSelectedRequest(r)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        border: "1px solid #D1D5DB",
                        background: "#FFFFFF",
                        color: "#374151",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        minWidth: "120px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#16A34A";
                        e.currentTarget.style.color = "#FFFFFF";
                        e.currentTarget.style.borderColor = "#16A34A";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#FFFFFF";
                        e.currentTarget.style.color = "#374151";
                        e.currentTarget.style.borderColor = "#D1D5DB";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "14px 20px", textAlign: "center" }}>
          <button style={{
            padding: "10px 32px", borderRadius: 10,
            border: "1.5px solid #16A34A", color: "#16A34A",
            background: "transparent", fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}>View all past services</button>
        </div>
      </div>

      {/* Service Request Details Modal — same as Service Requests page */}
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

              {shopCategory === "Service Centers" && (
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    Appointment
                  </div>

                  <div
                    style={{
                      fontSize: 16.5,
                      color: COLORS.text,
                      marginTop: 2,
                    }}
                  >
                    {selectedRequest.preferred_date
                      ? `${selectedRequest.preferred_date} • ${selectedRequest.preferred_time}`
                      : "Not specified"}
                  </div>
                </div>
              )}

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
                src={`http://localhost:8000/${selectedRequest.photo}`}
                alt="Problem"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginTop: 6,
                  border: `1px solid ${COLORS.border}`,
                }}
              />
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
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
        </div>
      )}
    </div>
  );
}

export default ServiceHistory;
