const ACTIVE_REPAIRS = [
  {
    id: 1, initials: "SJ", color: "#7C3AED", name: "Sanduni J.",
    vehicle: "Toyota Prius", plate: "ABC-1234",
    service: "Engine Overheating", status: "In Progress",
    statusColor: "#F59E0B", statusBg: "#FEF3C7",
    assigned: "Nuwan Perera", expected: "May 26, 02:00 PM"
  },
  {
    id: 2, initials: "NC", color: "#059669", name: "Nimal C.",
    vehicle: "Suzuki Alto", plate: "CAB-5678",
    service: "Brake Pad Replacement", status: "In Progress",
    statusColor: "#F59E0B", statusBg: "#FEF3C7",
    assigned: "Ruwan Silva", expected: "May 25, 05:00 PM"
  },
  {
    id: 3, initials: "KP", color: "#2563EB", name: "Kavindu P.",
    vehicle: "Honda Fit", plate: "KX-7788",
    service: "Oil Change", status: "Pending Parts",
    statusColor: "#6366F1", statusBg: "#EEF2FF",
    assigned: "Chamika Dias", expected: "May 26, 11:00 AM"
  },
  {
    id: 4, initials: "MG", color: "#D97706", name: "Madushan G.",
    vehicle: "Tata Lorry", plate: "WP-LM-8945",
    service: "Clutch Repair", status: "In Progress",
    statusColor: "#F59E0B", statusBg: "#FEF3C7",
    assigned: "Saman Abey.", expected: "May 27, 03:00 PM"
  },
  {
    id: 5, initials: "AS", color: "#EF4444", name: "Amila S.",
    vehicle: "Nissan March", plate: "KU-3344",
    service: "AC Not Cooling", status: "Diagnosis",
    statusColor: "#8B5CF6", statusBg: "#F5F3FF",
    assigned: "Nuwan Perera", expected: "May 25, 04:00 PM"
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

function ActiveRepairs() {
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
        
        {/* Header */}
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #F3F4F6",
          display: "grid",
          gridTemplateColumns: "2fr 2fr 2fr 1.5fr 1.5fr 1fr",
          gap: 12
        }}>
          {["Customer", "Vehicle", "Service", "Status", "Expected", "Action"].map(h => (
            <span key={h} style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>{h}</span>
          ))}
          
        </div>
        

        {/* Rows */}
        {ACTIVE_REPAIRS.map((r, i) => (
          <div key={r.id} style={{
            padding: "16px 20px",
            borderBottom: i < ACTIVE_REPAIRS.length - 1 ? "1px solid #F9FAFB" : "none",
            display: "grid",
            gridTemplateColumns: "2fr 2fr 2fr 1.5fr 1.5fr 1fr",
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
            <div>
              <div style={{ fontSize: 14, color: "#374151" }}>{r.service}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>→ {r.assigned}</div>
            </div>

            {/* Status Badge */}
            <span
  style={{
    background: r.statusBg,
    color: r.statusColor,
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
      background: r.statusColor,
    }}
  />
  {r.status}
</span>

            {/* Expected */}
            <div style={{ fontSize: 12, color: "#6B7280" }}>{r.expected}</div>
{/* Action */}
<button
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
          </div>
        ))}

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
