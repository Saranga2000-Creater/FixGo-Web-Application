import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faPalette,
  faTruck,
  faLocationDot,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { api, UPLOADS_URL } from "../../src/services/api";

function Avatar({ initials, color, size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color + "1A",
        color,
        fontSize: size * 0.34,
        borderColor: color + "33",
      }}
      className="rounded-full flex items-center justify-center font-bold shrink-0 border-[1.5px] tracking-[0.2px]"
    >
      {initials}
    </div>
  );
}

function TowField({ label, value, onChange, type = "text", placeholder, disabled, min }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold text-slate-500 uppercase tracking-[0.4px]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        min={min}
        className="py-2.5 px-3.5 rounded-[10px] border border-[#E5E9F0] text-[15px] text-slate-900 outline-none bg-slate-50 focus:border-blue-600"
      />
    </label>
  );
}

function ServiceRequests({ shopCategory, shopCoordinates, fetchRequestCount }) {
  const [activeTab, setActiveTab] = useState("new"); // "new" | "missed" | "declined"

  const [requests, setRequests] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);
  const [declinedLoaded, setDeclinedLoaded] = useState(false);
  const [missedRequests, setMissedRequests] = useState([]);
  const [missedLoaded, setMissedLoaded] = useState(false);

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

  // Fetch the missed list lazily
  useEffect(() => {
    if (activeTab === "missed" && !missedLoaded) {
      fetchMissedRequests();
    }
  }, [activeTab, missedLoaded]);

  const updateStatus = async (requestId, status) => {
    try {
      const data = await api.post("shared/updateStatus.php", {
        request_id: requestId,
        new_status: status,
      });

      // No popup for Accept or Decline — both have their own UI feedback
      if (status !== "Accepted" && status !== "Declined") {
        alert(data.message);
      }

      fetchRequests();
      fetchRequestCount();
      window.dispatchEvent(new Event("fixgo_unread_changed"));

      if (status === "Declined" && declinedLoaded) {
        fetchDeclinedRequests();
      }

    } catch (error) {
      console.error(error);
      if (error.message) {
        alert(error.message);
      }
    }
  };

  const fetchRequests = async () => {
    try {
      const data = await api.get("shop/getServiceRequests.php");
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeclinedRequests = async () => {
    try {
      const data = await api.get("shop/getDeclinedRequests.php");
      if (data.success) {
        setDeclinedRequests(data.data);
        setDeclinedLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMissedRequests = async () => {
    try {
      const data = await api.get("shop/getMissedRequests.php");
      if (data.success) {
        setMissedRequests(data.data);
        setMissedLoaded(true);
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
    try {
      const data = await api.get("shop/getTowTruckDetails.php");
      if (data.success) {
        setTowTruck({
          ...data.data,
          promised_eta: requestData?.promised_eta || "",
        });
        setShowTowModal(true);

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
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Could not load tow truck details.");
    }
  };

  const saveTowTruckDetails = async () => {
    if (parseInt(towTruck.promised_eta) < minEta) {
      setEtaError(`ETA cannot be less than the calculated drive time (${minEta} mins).`);
      return;
    }
    try {
      const data = await api.post("shop/updateTowTruckDetails.php", {
        request_id: requestPendingTow.id,
        driver_name: towTruck.default_driver_name,
        driver_phone: towTruck.default_driver_phone,
        truck_brand: towTruck.default_truck_brand,
        truck_color: towTruck.default_truck_color,
        truck_plate: towTruck.tow_truck_plate,
        promised_eta: towTruck.promised_eta,
      });
      if (data.success) {
        alert("Tow truck details updated.");
        setShowTowModal(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to save tow truck details.");
    }
  };

  const confirmTowAndAccept = async () => {
    if (parseInt(towTruck.promised_eta) < minEta) {
      setEtaError(`ETA cannot be less than the calculated drive time (${minEta} mins).`);
      return;
    }
    try {
      const data = await api.post("shop/updateTowTruckDetails.php", {
        request_id: requestPendingTow.id,
        driver_name: towTruck.default_driver_name,
        driver_phone: towTruck.default_driver_phone,
        truck_brand: towTruck.default_truck_brand,
        truck_color: towTruck.default_truck_color,
        truck_plate: towTruck.tow_truck_plate,
        promised_eta: towTruck.promised_eta,
      });
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

  const visibleRequests = activeTab === "new" ? requests : (activeTab === "missed" ? missedRequests : declinedRequests);

  return (
    <div className="w-full font-[inherit]">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[22px] font-bold text-slate-900 m-0 tracking-[-0.3px]">
          Service Requests
        </h1>
        <p className="text-slate-500 mt-1.5 text-[15.5px] leading-normal">
          Review and respond to incoming service requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: "new", label: "Service Requests" },
          { key: "missed", label: "Missed Opportunities" },
          { key: "declined", label: "Declined Requests" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2.5 px-5 rounded-[10px] border-[1.5px] font-semibold text-[14.5px] cursor-pointer transition-all duration-150 ease-in-out ${
                isActive
                  ? "border-green-700 bg-[#ECFDF3] text-green-700"
                  : "border-[#E5E9F0] bg-white text-slate-500"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-[18px] border border-[#E5E9F0] overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]">
        {/* Table Header */}
        <div
          className={`py-4 px-6 border-b border-[#E5E9F0] bg-slate-50 grid gap-2 ${
            activeTab === "new"
              ? "[grid-template-columns:2.2fr_1.5fr_1fr_1fr_1.5fr]"
              : "[grid-template-columns:2.2fr_1.5fr_1fr_2fr]"
          }`}
        >
          {(activeTab === "new"
            ? ["Customer & Vehicle", "Service", "Urgency", "Details", "Action"]
            : ["Customer & Vehicle", "Service", "Urgency", "Reason"]
          ).map((h) => (
            <span
              key={h}
              className="text-[12.5px] font-bold text-slate-500 uppercase tracking-[0.5px]"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {visibleRequests.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-[14.5px]">
            {activeTab === "new" ? "No service requests found" : (activeTab === "missed" ? "No missed opportunities" : "No declined requests")}
          </div>
        ) : (
          visibleRequests.map((r, i) => (
            <div
              key={r.id}
              onMouseEnter={() => setHoveredRow(r.id)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`py-4.5 px-6 grid gap-2 items-center transition-colors duration-150 ease-in-out ${
                i < visibleRequests.length - 1 ? "border-b border-[#E5E9F0]" : ""
              } ${
                activeTab === "new"
                  ? "[grid-template-columns:2.2fr_1.5fr_1fr_1fr_1.5fr]"
                  : "[grid-template-columns:2.2fr_1.5fr_1fr_2fr]"
              } ${hoveredRow === r.id ? "bg-slate-50" : "bg-transparent"}`}
            >
              {/* Customer & Vehicle */}
              <div className="flex items-center gap-3.5">
                <Avatar
                  initials={r.customer_name?.substring(0, 2).toUpperCase()}
                  color={activeTab === "new" ? "#15803D" : "#94A3B8"}
                />

                <div>
                  <div className="font-semibold text-base text-slate-900">
                    {r.customer_name}
                  </div>

                  <div className="text-sm text-slate-500 mt-0.5">
                    <FontAwesomeIcon icon={faCar} className="mr-1 text-slate-400" /> {r.vehicle_brand}
                  </div>

                  <div
                    className={`text-[13px] font-semibold mt-px ${
                      activeTab === "new" ? "text-green-700" : "text-slate-400"
                    }`}
                  >
                    <FontAwesomeIcon icon={faPalette} className="mr-1 opacity-80" /> {r.vehicle_color}
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <div className="text-[15.5px] text-slate-900 font-medium">
                  {r.issue_category}
                </div>

                {activeTab === "new" && Number(r.requires_tow) === 1 && (
                  <div className="mt-2 inline-block py-1 px-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                    <FontAwesomeIcon icon={faTruck} className="mr-1.5" /> Tow Truck Required
                  </div>
                )}

                {activeTab === "new" && r.pickup_landmark && Number(r.requires_tow) === 1 && (
                  <div className="mt-1.5 text-[12.5px] text-slate-400">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-1 text-slate-400" /> {r.pickup_landmark}
                  </div>
                )}
              </div>

              {/* Urgency */}
              <div>
                <span
                  className={`py-1.5 px-3 rounded-full text-[13px] font-semibold border ${
                    r.urgency_level === "Urgent"
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-[#ECFDF3] border-[#BBF7D0] text-green-700"
                  }`}
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
                      className="py-2 px-3.5 rounded-[9px] border border-green-700 bg-white text-green-700 font-semibold text-sm cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[#ECFDF3]"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {r.status === "Pending" ? (
                      <>
                        <button
                          className="py-2 px-4.5 rounded-[10px] border-none bg-green-700 text-white font-semibold text-sm cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[#116530]"
                          onClick={() => handleAcceptClick(r)}
                        >
                          Accept
                        </button>

                        <button
                          className="py-2 px-4.5 rounded-[10px] border border-red-200 text-red-600 bg-white font-semibold text-sm cursor-pointer transition-colors duration-150 ease-in-out hover:bg-red-50"
                          onClick={() => handleDeclineClick(r)}
                        >
                          Decline
                        </button>
                      </>
                    ) : r.status === "Accepted" ? (
                      <span className="py-2 px-3.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[13px]">
                        Waiting for customer confirmation
                      </span>
                    ) : (
                      <span className="py-2 px-3.5 rounded-full bg-red-100 text-red-600 font-semibold text-[13px]">
                        {r.status}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                /* Declined tab — show reason instead of action buttons */
                <div className="text-sm text-slate-500 leading-normal">
                  {r.cancellation_reason || "No reason provided"}
                </div>
              )}
            </div>
          ))
        )}

        {/* Footer */}
        <div className="py-4 px-6 text-center border-t border-[#E5E9F0]">
          <button className="py-2.5 px-9 rounded-[10px] border-[1.5px] border-green-700 text-green-700 bg-transparent font-semibold text-[15px] cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[#ECFDF3]">
            View all requests
          </button>
        </div>
      </div>

      {/* Service Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/55 flex justify-center items-center z-[999] p-5">
          <div className="bg-white w-[600px] max-w-full max-h-[85vh] overflow-y-auto rounded-[20px] p-7 shadow-[0_24px_48px_rgba(15,23,42,0.25)]">
            <h2 className="m-0 mb-5 text-xl font-bold text-slate-900">
              Service Request Details
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              <div>
                <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-[0.4px]">
                  Customer
                </div>
                <div className="text-[16.5px] text-slate-900 mt-0.5">
                  {selectedRequest.customer_name}
                </div>
              </div>

              <div>
                <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-[0.4px]">
                  Issue
                </div>
                <div className="text-[16.5px] text-slate-900 mt-0.5">
                  {selectedRequest.issue_category}
                </div>
              </div>

              {shopCategory === "Service Centers" && (
                <div>
                  <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-[0.4px]">
                    Appointment
                  </div>

                  <div className="text-[16.5px] text-slate-900 mt-0.5">
                    {selectedRequest.preferred_date
                      ? `${selectedRequest.preferred_date} • ${selectedRequest.preferred_time}`
                      : "Not specified"}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-[0.4px] mb-1.5">
                  Description
                </div>
                <div className="bg-slate-50 border border-[#E5E9F0] p-3.5 rounded-[10px] text-[15px] text-slate-900 leading-relaxed">
                  {selectedRequest.description}
                </div>
              </div>
            </div>

            {selectedRequest.photo && (
              <img
                src={`${UPLOADS_URL}/${selectedRequest.photo}`}
                alt="Problem"
                className="w-full rounded-xl mt-1.5 border border-[#E5E9F0]"
              />
            )}

            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="py-2.5 px-6 bg-green-700 text-white border-none rounded-[10px] font-semibold text-[15px] cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[#116530]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Confirmation Modal */}
      {requestPendingDecline && (
        <div className="fixed inset-0 bg-slate-900/55 flex justify-center items-center z-[1000] p-5">
          <div className="bg-white w-[420px] max-w-full rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(15,23,42,0.25)]">
            {/* Header */}
            <div className="pt-5.5 px-6.5 pb-1 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-red-50 border border-red-200 flex items-center justify-center text-[19px] shrink-0 text-red-600">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <div>
                <h2 className="m-0 text-[17.5px] font-bold text-slate-900">
                  Decline this request?
                </h2>
                <p className="m-0 mt-1.5 text-sm text-slate-500 leading-normal">
                  {requestPendingDecline.customer_name
                    ? `${requestPendingDecline.customer_name}'s request will be moved to Declined and they'll be notified. This action can't be undone.`
                    : "This request will be moved to Declined and the customer will be notified. This action can't be undone."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-5 px-6.5 pb-6 flex justify-end gap-2.5">
              <button
                onClick={() => setRequestPendingDecline(null)}
                disabled={isDeclining}
                className={`py-2.5 px-5 rounded-[10px] border border-[#E5E9F0] bg-white text-slate-500 font-semibold text-[14.5px] hover:bg-slate-50 ${
                  isDeclining ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={confirmDecline}
                disabled={isDeclining}
                className={`py-2.5 px-5.5 rounded-[10px] border-none bg-red-600 text-white font-semibold text-[14.5px] hover:bg-[#B91C1C] ${
                  isDeclining ? "cursor-not-allowed opacity-70" : "cursor-pointer opacity-100"
                }`}
              >
                {isDeclining ? "Declining..." : "Yes, Decline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tow Truck Details Modal */}
      {showTowModal && towTruck && (
        <div className="fixed inset-0 bg-slate-900/55 flex justify-center items-center z-[1000] p-5">
          <div className="bg-white w-[480px] max-w-full rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(15,23,42,0.25)]">
            {/* Header */}
            <div className="py-5 px-7 border-b border-[#E5E9F0] flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-blue-100 flex items-center justify-center text-lg shrink-0 text-blue-600">
                <FontAwesomeIcon icon={faTruck} />
              </div>
              <div>
                <h2 className="m-0 text-lg font-bold text-slate-900">
                  Tow Truck Details
                </h2>
                <p className="m-0 text-[13.5px] text-slate-500 mt-0.5">
                  {isAcceptFlow
                    ? "Confirm dispatch info to accept this request"
                    : "Dispatch info for this pickup"}
                </p>
              </div>
            </div>

            {/* Fields */}
            <div className="py-6 px-7 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3.5">
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

              <div className="grid grid-cols-2 gap-3.5">
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
              <div className="mx-7 mb-5 py-3 px-4 bg-red-50 border border-red-200 rounded-[10px] text-red-600 text-[14.5px] font-medium flex items-center gap-2.5 animate-[fadeIn_0.2s_ease]">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-lg" />
                {etaError}
              </div>
            )}

            {/* Footer */}
            <div className="py-4 px-7 border-t border-[#E5E9F0] flex justify-end gap-2.5 bg-slate-50">
              <button
                onClick={() => {
                  setShowTowModal(false);
                  setIsAcceptFlow(false);
                  setEtaError("");
                }}
                className="py-2.5 px-5 rounded-[10px] border border-[#E5E9F0] bg-white text-slate-500 font-semibold text-[14.5px] cursor-pointer hover:bg-slate-50"
              >
                Cancel
              </button>

              {isAcceptFlow ? (
                <button
                  onClick={confirmTowAndAccept}
                  className="py-2.5 px-5.5 rounded-[10px] border-none bg-green-700 text-white font-semibold text-[14.5px] cursor-pointer hover:bg-[#116530]"
                >
                  Confirm
                </button>
              ) : (
                <button
                  onClick={saveTowTruckDetails}
                  className="py-2.5 px-5.5 rounded-[10px] border-none bg-blue-600 text-white font-semibold text-[14.5px] cursor-pointer hover:bg-blue-700"
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



