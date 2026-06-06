const HISTORY = [
  {
    id: 1, initials: "SJ", color: "#7C3AED", name: "Sanduni J.",
    vehicle: "Toyota Prius", plate: "ABC-1234",
    service: "Engine Diagnostic",
    dateService: "May 20, 2026", dateComplete: "May 21, 2026",
    assigned: "Nuwan Perera"
  },
  {
    id: 2, initials: "NC", color: "#059669", name: "Nimal C.",
    vehicle: "Suzuki Alto", plate: "CAB-5678",
    service: "Brake Pad Replacement",
    dateService: "May 15, 2026", dateComplete: "May 15, 2026",
    assigned: "Ruwan Silva"
  },
  {
    id: 3, initials: "KP", color: "#2563EB", name: "Kavindu P.",
    vehicle: "Honda Fit", plate: "KX-7788",
    service: "Oil Change",
    dateService: "May 12, 2026", dateComplete: "May 12, 2026",
    assigned: "Chamika Dias"
  },
  {
    id: 4, initials: "MG", color: "#D97706", name: "Madushan G.",
    vehicle: "Tata Lorry", plate: "WP-LM-8945",
    service: "Clutch Repair",
    dateService: "May 12, 2026", dateComplete: "May 12, 2026",
    assigned: "Saman Abey."
  },
  {
    id: 5, initials: "AS", color: "#EF4444", name: "Amila S.",
    vehicle: "Nissan March", plate: "KU-3344",
    service: "AC Not Cooling",
    dateService: "May 10, 2026", dateComplete: "May 12, 2026",
    assigned: "Nuwan Perera"
  },
];

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

function ServiceHistory() {
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
                {["Customer", "Vehicle", "Service Provided", "Date of Service", "Completion Date", "Assigned To", "Action"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 12, fontWeight: 600, color: "#6B7280",
                    borderBottom: "1px solid #F3F4F6"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((r, i) => (
                <tr key={r.id} style={{
                  borderBottom: i < HISTORY.length - 1 ? "1px solid #F9FAFB" : "none"
                }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={r.initials} color={r.color} />
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, color: "#374151" }}>{r.vehicle}</div>
                    <div style={{ fontSize: 12, color: "#EA580C", fontWeight: 600 }}>{r.plate}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "#374151" }}>{r.service}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#6B7280" }}>{r.dateService}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#6B7280" }}>{r.dateComplete}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.assigned}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <button style={{
                      padding: "6px 14px", borderRadius: 8,
                      border: "1.5px solid #E5E7EB", color: "#374151",
                      background: "transparent", fontWeight: 600,
                      fontSize: 12, cursor: "pointer"
                    }}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "14px 20px", textAlign: "center" }}>
          <button style={{
            padding: "10px 32px", borderRadius: 10,
            border: "1.5px solid #EA580C", color: "#EA580C",
            background: "transparent", fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}>View all past services</button>
        </div>
      </div>
    </div>
  );
}

export default ServiceHistory;
