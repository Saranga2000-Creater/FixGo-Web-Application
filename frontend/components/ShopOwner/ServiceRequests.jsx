const RECENT_REQUESTS = [
  {
    id: 1, initials: "SJ", color: "#7C3AED", name: "Sanduni J.",
    vehicle: "Toyota Prius", plate: "ABC-1234",
    service: "Engine Overheating", date: "Today", time: "10:30 AM"
  },
  {
    id: 2, initials: "NC", color: "#059669", name: "Nimal C.",
    vehicle: "Suzuki Alto", plate: "CAB-5678",
    service: "Brake Pad Replacement", date: "Today", time: "09:15 AM"
  },
  {
    id: 3, initials: "KP", color: "#2563EB", name: "Kavindu P.",
    vehicle: "Honda Fit", plate: "KX-7788",
    service: "Oil Change", date: "Yesterday", time: "04:45 PM"
  },
  {
    id: 4, initials: "MG", color: "#16A34A", name: "Madushan G.",
    vehicle: "Tata Lorry", plate: "WP-LM-8945",
    service: "Clutch Repair", date: "Yesterday", time: "02:20 PM"
  },
];

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
        {RECENT_REQUESTS.map((r, i) => (
          <div key={r.id} style={{
            padding: "16px 20px",
            borderBottom: i < RECENT_REQUESTS.length - 1 ? "1px solid #F9FAFB" : "none",
            display: "grid",
            gridTemplateColumns: "2fr 2fr 2fr 1.5fr 1.5fr",
            gap: 12, alignItems: "center"
          }}>
            {/* Customer */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar initials={r.initials} color={r.color} />
              <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{r.name}</span>
            </div>

            {/* Vehicle */}
            <div>
              <div style={{ fontSize: 14, color: "#374151" }}>{r.vehicle}</div>
              <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>{r.plate}</div>
            </div>

            {/* Service */}
            <div style={{ fontSize: 14, color: "#374151" }}>{r.service}</div>

            {/* Date */}
            <div style={{ fontSize: 13, color: "#6B7280" }}>
              <div>{r.date}</div>
              <div>{r.time}</div>
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
        ))}

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
