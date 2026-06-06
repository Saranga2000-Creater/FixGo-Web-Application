import { useState } from "react";

const SHOP_FIELDS = [
  ["Shop Name",       "Advanced Auto"],
  ["Shop Category",   "Service Center"],
  ["Email",           "info@advancedauto.lk"],
  ["Phone Number",    "+94 77 123 4567"],
  ["Address",         "Colombo 07, Ward Place, Colombo"],
  ["Business Reg. No.", "BRN-12345678"],
];

const NOTIF_OPTIONS = [
  ["requests", "New Service Requests",       "Get notified when a new request is received"],
  ["status",   "Request Status Updates",     "Get notified when status is updated"],
  ["messages", "Customer Messages",          "Get notified when customer sends a message"],
  ["reviews",  "Reviews & Ratings",          "Get notified when you receive a review"],
  ["promo",    "Promotions & Announcements", "Receive offers and updates from FixGo"],
];

function Toggle({ on, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? "#EA580C" : "#D1D5DB",
        cursor: "pointer", position: "relative",
        transition: "background 0.2s", flexShrink: 0
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3,
        left: on ? 23 : 3,
        transition: "left 0.2s"
      }} />
    </div>
  );
}

function Settings() {
  const [notifs, setNotifs] = useState({
    requests: true, status: true, messages: true, reviews: true, promo: false
  });

  const toggleNotif = (key) => setNotifs(n => ({ ...n, [key]: !n[key] }));

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Settings</h1>
          <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>
            Manage your account, shop preferences and system settings.
          </p>
        </div>
        <button style={{
          padding: "10px 24px", borderRadius: 10, border: "none",
          background: "#EA580C", color: "#fff",
          fontWeight: 700, fontSize: 14, cursor: "pointer"
        }}>💾 Save Changes</button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20
      }}>
        {/* Shop Information */}
        <div style={{
          background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
          padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 20 }}>
            Shop Information
          </h3>
          {SHOP_FIELDS.map(([label, val]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
                {label}
              </label>
              <input
                defaultValue={val}
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: 8,
                  border: "1px solid #E5E7EB", fontSize: 14, color: "#111827",
                  boxSizing: "border-box", outline: "none"
                }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
              Shop Description
            </label>
            <textarea
              defaultValue="We provide high quality vehicle repair and maintenance services with experienced technicians and modern equipment."
              rows={3}
              style={{
                width: "100%", padding: "9px 12px", borderRadius: 8,
                border: "1px solid #E5E7EB", fontSize: 14, color: "#111827",
                resize: "vertical", boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Notification Settings */}
          <div style={{
            background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
            padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 16 }}>
              Notification Settings
            </h3>
            {NOTIF_OPTIONS.map(([key, title, desc]) => (
              <div key={key} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "12px 0",
                borderBottom: "1px solid #F9FAFB"
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{desc}</div>
                </div>
                <Toggle on={notifs[key]} onToggle={() => toggleNotif(key)} />
              </div>
            ))}
          </div>

          {/* Account & Security */}
          <div style={{
            background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
            padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 16 }}>
              Account & Security
            </h3>
            {["Current Password", "New Password", "Confirm New Password"].map(label => (
              <div key={label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
                  {label}
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••"
                  style={{
                    width: "100%", padding: "9px 12px", borderRadius: 8,
                    border: "1px solid #E5E7EB", fontSize: 14,
                    boxSizing: "border-box", outline: "none"
                  }}
                />
              </div>
            ))}
            <button style={{
              width: "100%", padding: "11px", borderRadius: 10,
              border: "none", background: "#EA580C", color: "#fff",
              fontWeight: 700, fontSize: 14, cursor: "pointer"
            }}>Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
