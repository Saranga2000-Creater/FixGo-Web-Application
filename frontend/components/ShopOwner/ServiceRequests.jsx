import { useEffect, useState } from "react";

const COLORS = {
  primary: "#15803D",
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

function TowField({ label, value, onChange, type = "text", placeholder, disabled , min}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          color: COLORS.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        min={min}
        style={{
          padding: "11px 14px",
          borderRadius: 10,
          border: `1px solid ${COLORS.border}`,
          fontSize: 15,
          color: COLORS.text,
          outline: "none",
          background: COLORS.page,
        }}
        onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
        onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
      />
    </label>
  );
}

function ServiceRequests({ shopCategory, shopCoordinates, fetchRequestCount }) {
  const [activeTab, setActiveTab] = useState("new"); // "new" | "declined"

  const [requests, setRequests] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);
  const [declinedLoaded, setDeclinedLoaded] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestPendingTow, setRequestPendingTow] = useState(null);
  const [showTowModal, setShowTowModal] = useState(false);
  const [isAcceptFlow, setIsAcceptFlow] = useState(false);
  const [towTruck, setTowTruck] = useState({
    default_driver_name: "",
    default_driver_phone: "",
    default_truck_brand: "",
    default_truck_color: "",
    tow_truck_plate: "",
    promised_eta: "",
  });
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isCalculatingEta, setIsCalculatingEta] = useState(false);
  const [minEta, setMinEta] = useState(0);
  const [etaError, setEtaError] = useState("");

  // Decline confirmation
  const [requestPendingDecline, setRequestPendingDecline] = useState(null);
  const [isDeclining, setIsDeclining] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch the declined list lazily, the first time that tab is opened
  useEffect(() => {
    if (activeTab === "declined" && !declinedLoaded) {
      fetchDeclinedRequests();
    }
  }, [activeTab, declinedLoaded]);

  const updateStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(
        "http://localhost:8000/api/updateStatus.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            request_id: requestId,
            new_status: status,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      // No popup for Accept or Decline — both have their own UI feedback
      if (status !== "Accepted" && status !== "Declined") {
        alert(data.message);
      }

      fetchRequests();
      fetchRequestCount();

      // Keep the Declined tab fresh too, in case it's already been loaded
      if (status === "Declined" && declinedLoaded) {
        fetchDeclinedRequests();
      }

    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(
        "http://localhost:8000/api/getServiceRequests.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeclinedRequests = async () => {
    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(
        "http://localhost:8000/api/getDeclinedRequests.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setDeclinedRequests(data.data);
        setDeclinedLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptClick = (r) => {
    if (Number(r.requires_tow) === 1) {
      // THE FIX: Use the new dedicated state, NOT setSelectedRequest
      setRequestPendingTow(r); 
      setIsAcceptFlow(true);
      openTowTruckModal(r, true); 
    } else {
      updateStatus(r.id, "Accepted");
    }
  };

  const handleDeclineClick = (r) => {
    setRequestPendingDecline(r);
  };

  const confirmDecline = async () => {
    if (!requestPendingDecline) return;
    setIsDeclining(true);
    try {
      await updateStatus(requestPendingDecline.id, "Declined");
    } finally {
      setIsDeclining(false);
      setRequestPendingDecline(null);
    }
  };

  // THE FIX: Accept 'isAccepting' as a parameter
  const openTowTruckModal = async (requestData, isAccepting = false) => {
    const token = localStorage.getItem("jwt_token");

    // 1. Fetch default Tow Truck info from YOUR backend
    const res = await fetch("http://localhost:8000/api/getTowTruckDetails.php", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    if (data.success) {
      // 2. Open the modal with whatever data we currently have
      setTowTruck({
        ...data.data,
        promised_eta: requestData?.promised_eta || "",
      });
      setShowTowModal(true);

      // 3. SILENTLY FETCH ETA FROM GOOGLE
      // THE FIX: Use 'isAccepting' and add optional chaining (?.) to shopCoordinates
      if (isAccepting && shopCoordinates?.lat && requestData.customer_lat && requestData.customer_lng) {
        setIsCalculatingEta(true); 

        try {
          const googleRes = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
              "X-Goog-FieldMask": "routes.duration", 
            },
            body: JSON.stringify({
              origin: { location: { latLng: { latitude: shopCoordinates.lat, longitude: shopCoordinates.lng } } },
              destination: { location: { latLng: { latitude: requestData.customer_lat, longitude: requestData.customer_lng } } },
              travelMode: "DRIVE",
            }),
          });

          const googleData = await googleRes.json();

          if (googleData.routes && googleData.routes.length > 0) {
            const seconds = parseInt(googleData.routes[0].duration.replace("s", ""));
            const calculatedMinutes = Math.ceil(seconds / 60);

            setTowTruck((prev) => ({ ...prev, promised_eta: calculatedMinutes }));
            setMinEta(calculatedMinutes);
          }
        } catch (error) {
          console.error("Failed to calculate ETA via Google:", error);
        } finally {
          setIsCalculatingEta(false); 
        }
      }
    }
  };

  const saveTowTruckDetails = async () => {

    if (parseInt(towTruck.promised_eta) < minEta) {
      setEtaError(`ETA cannot be less than the calculated drive time (${minEta} mins).`);
      return; // Stop the function instantly
    }
    const token = localStorage.getItem("jwt_token");

    const res = await fetch(
      "http://localhost:8000/api/updateTowTruckDetails.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          request_id: requestPendingTow.id,

          driver_name: towTruck.default_driver_name,
          driver_phone: towTruck.default_driver_phone,
          truck_brand: towTruck.default_truck_brand,
          truck_color: towTruck.default_truck_color,
          truck_plate: towTruck.tow_truck_plate,
          promised_eta: towTruck.promised_eta,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Tow truck details updated.");
      setShowTowModal(false);
    } else {
      alert(data.message);
    }
  };

  const confirmTowAndAccept = async () => {

    if (parseInt(towTruck.promised_eta) < minEta) {
      setEtaError(`ETA cannot be less than the calculated drive time (${minEta} mins).`);
      return; // Stop the function instantly
    }
    try {
      const token = localStorage.getItem("jwt_token");

      const res = await fetch(
        "http://localhost:8000/api/updateTowTruckDetails.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            request_id: requestPendingTow.id,

            driver_name: towTruck.default_driver_name,
            driver_phone: towTruck.default_driver_phone,
            truck_brand: towTruck.default_truck_brand,
            truck_color: towTruck.default_truck_color,
            truck_plate: towTruck.tow_truck_plate,
            promised_eta: towTruck.promised_eta,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        await updateStatus(requestPendingTow.id, "Accepted");
        setShowTowModal(false);
        setIsAcceptFlow(false);
        setRequestPendingTow(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const visibleRequests = activeTab === "new" ? requests : declinedRequests;

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

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { key: "new", label: "Service Requests" },
          { key: "declined", label: "Declined Requests" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: `1.5px solid ${isActive ? COLORS.primary : COLORS.border}`,
                background: isActive ? COLORS.primarySoft : COLORS.surface,
                color: isActive ? COLORS.primary : COLORS.textMuted,
                fontWeight: 600,
                fontSize: 14.5,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          );
        })}
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
            gridTemplateColumns:
              activeTab === "new"
                ? "2.2fr 1.5fr 1fr 1fr 1.5fr"
                : "2.2fr 1.5fr 1fr 2fr",
            gap: 8,
          }}
        >
          {(activeTab === "new"
            ? ["Customer & Vehicle", "Service", "Urgency", "Details", "Action"]
            : ["Customer & Vehicle", "Service", "Urgency", "Reason"]
          ).map((h) => (
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
        {visibleRequests.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              color: COLORS.textFaint,
              fontSize: 15,
            }}
          >
            {activeTab === "new" ? "No service requests found" : "No declined requests"}
          </div>
        ) : (
          visibleRequests.map((r, i) => (
            <div
              key={r.id}
              onMouseEnter={() => setHoveredRow(r.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                padding: "18px 24px",
                borderBottom:
                  i < visibleRequests.length - 1 ? `1px solid ${COLORS.border}` : "none",
                display: "grid",
                gridTemplateColumns:
                  activeTab === "new"
                    ? "2.2fr 1.5fr 1fr 1fr 1.5fr"
                    : "2.2fr 1.5fr 1fr 2fr",
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
                  color={activeTab === "new" ? COLORS.primary : COLORS.textFaint}
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
                      color: activeTab === "new" ? COLORS.primary : COLORS.textFaint,
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

                {activeTab === "new" && Number(r.requires_tow) === 1 && (
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

                {activeTab === "new" && r.pickup_landmark && Number(r.requires_tow) === 1 && (
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

              {activeTab === "new" ? (
                <>
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
                          onClick={() => handleAcceptClick(r)}
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
                          onClick={() => handleDeclineClick(r)}
                        >
                          Decline
                        </button>
                      </>
                    ) : r.status === "Accepted" ? (
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
                </>
              ) : (
                /* Declined tab — show reason instead of action buttons */
                <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.5 }}>
                  {r.cancellation_reason || "No reason provided"}
                </div>
              )}
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

      {/* Service Request Details Modal */}
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

      {/* Decline Confirmation Modal */}
      {requestPendingDecline && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: COLORS.surface,
              width: 420,
              maxWidth: "100%",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 24px 48px rgba(15,23,42,0.25)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "22px 26px 4px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: COLORS.dangerSoft,
                  border: `1px solid ${COLORS.dangerBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 19,
                  flexShrink: 0,
                }}
              >
                ⚠️
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 17.5, fontWeight: 700, color: COLORS.text }}>
                  Decline this request?
                </h2>
                <p style={{ margin: 0, marginTop: 6, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.5 }}>
                  {requestPendingDecline.customer_name
                    ? `${requestPendingDecline.customer_name}'s request will be moved to Declined and they'll be notified. This action can't be undone.`
                    : "This request will be moved to Declined and the customer will be notified. This action can't be undone."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "20px 26px 24px",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                onClick={() => setRequestPendingDecline(null)}
                disabled={isDeclining}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.surface,
                  color: COLORS.textMuted,
                  fontWeight: 600,
                  fontSize: 14.5,
                  cursor: isDeclining ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => !isDeclining && (e.currentTarget.style.background = COLORS.page)}
                onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.surface)}
              >
                Cancel
              </button>

              <button
                onClick={confirmDecline}
                disabled={isDeclining}
                style={{
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "none",
                  background: COLORS.danger,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14.5,
                  cursor: isDeclining ? "not-allowed" : "pointer",
                  opacity: isDeclining ? 0.7 : 1,
                }}
                onMouseEnter={(e) => !isDeclining && (e.currentTarget.style.background = "#B91C1C")}
                onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.danger)}
              >
                {isDeclining ? "Declining..." : "Yes, Decline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tow Truck Details Modal */}
      {showTowModal && towTruck && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: COLORS.surface,
              width: 480,
              maxWidth: "100%",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 24px 48px rgba(15,23,42,0.25)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 28px",
                borderBottom: `1px solid ${COLORS.border}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "#DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                🚚
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>
                  Tow Truck Details
                </h2>
                <p style={{ margin: 0, fontSize: 13.5, color: COLORS.textMuted, marginTop: 2 }}>
                  {isAcceptFlow
                    ? "Confirm dispatch info to accept this request"
                    : "Dispatch info for this pickup"}
                </p>
              </div>
            </div>

            {/* Fields */}
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <TowField
                  label="Driver Name"
                  value={towTruck.default_driver_name}
                  onChange={(e) =>
                    setTowTruck({ ...towTruck, default_driver_name: e.target.value })
                  }
                />
                <TowField
                  label="Driver Phone"
                  value={towTruck.default_driver_phone}
                  onChange={(e) =>
                    setTowTruck({ ...towTruck, default_driver_phone: e.target.value })
                  }
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <TowField
                  label="Truck Brand"
                  value={towTruck.default_truck_brand}
                  onChange={(e) =>
                    setTowTruck({ ...towTruck, default_truck_brand: e.target.value })
                  }
                />
                <TowField
                  label="Truck Color"
                  value={towTruck.default_truck_color}
                  onChange={(e) =>
                    setTowTruck({ ...towTruck, default_truck_color: e.target.value })
                  }
                />
              </div>

              <TowField
                label="Truck Plate"
                value={towTruck.tow_truck_plate}
                onChange={(e) =>
                  setTowTruck({ ...towTruck, tow_truck_plate: e.target.value })
                }
              />

              <TowField
                label="Promised ETA (minutes)"
                type="number"
                // THE FIX: Dynamic UI feedback based on our new loading state
                placeholder={isCalculatingEta ? "Calculating Route..." : "e.g. 25"}
                value={isCalculatingEta ? "" : towTruck.promised_eta}
                disabled={isCalculatingEta} // Lock the input so they can't type while loading
                min={minEta}
                onChange={(e) => {
                  setTowTruck({ ...towTruck, promised_eta: e.target.value });
                  // THE FIX 3: Clear the error the moment they start typing again
                  if (etaError) setEtaError(""); 
                }}
              />
            </div>
            
            {/* THE FIX 4: The Inline Warning Box */}
            {etaError && (
              <div
                style={{
                  margin: "0 28px 20px 28px",
                  padding: "12px 16px",
                  background: COLORS.dangerSoft,
                  border: `1px solid ${COLORS.dangerBorder}`,
                  borderRadius: 10,
                  color: COLORS.danger,
                  fontSize: 14.5,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  animation: "fadeIn 0.2s ease", // Gives it a nice pop
                }}
              >
                <span style={{ fontSize: 18 }}>⚠️</span>
                {etaError}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                padding: "16px 28px",
                borderTop: `1px solid ${COLORS.border}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                background: COLORS.page,
              }}
            >
              <button
                onClick={() => {
                  setShowTowModal(false);
                  setIsAcceptFlow(false);
                  setEtaError("");
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.surface,
                  color: COLORS.textMuted,
                  fontWeight: 600,
                  fontSize: 14.5,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.page)}
                onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.surface)}
              >
                Cancel
              </button>

              {isAcceptFlow ? (
                <button
                  onClick={confirmTowAndAccept}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 10,
                    border: "none",
                    background: COLORS.primary,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14.5,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#116530")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.primary)}
                >
                  Confirm
                </button>
              ) : (
                <button
                  onClick={saveTowTruckDetails}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 10,
                    border: "none",
                    background: "#2563EB",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14.5,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceRequests;


