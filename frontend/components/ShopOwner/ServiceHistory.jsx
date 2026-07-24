import { useEffect, useState } from "react";
import { api, UPLOADS_URL } from "../../src/services/api";


function Avatar({ initials, color, size = 32 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold shrink-0 border"
      style={{
        width: size,
        height: size,
        background: color + "22",
        color,
        fontSize: size * 0.33,
        borderColor: color + "44",
      }}
    >
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
    api.get("getServiceHistory.php")
      .then((data) => {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 m-0">
          Service History
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          All completed service records.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50">
                {["Customer", "Vehicle", "Service Provided", "Confirmed On", "Completed On", "Action"].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-xs font-semibold text-gray-500 border-b border-gray-100"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-gray-400 text-sm">
                    No completed services yet.
                  </td>
                </tr>
              )}
              {history.map((r, i) => (
                <tr
                  key={r.id}
                  className={i < history.length - 1 ? "border-b border-gray-50" : ""}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={getInitials(r.customer_name)} color={colorForId(r.id)} />
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{r.customer_name}</div>
                        <div className="text-xs text-gray-500">{r.customer_phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-sm text-gray-700">{r.vehicle_brand}</div>
                    <div className="text-xs text-green-600 font-semibold">{r.vehicle_color}</div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-700">{r.issue_category}</td>
                  <td className="py-3.5 px-4 text-[13px] text-gray-500">{formatDate(r.confirmed_at)}</td>
                  <td className="py-3.5 px-4 text-[13px] text-gray-500">{formatDate(r.completed_at)}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => setSelectedRequest(r)}
                      className="py-2.5 px-4.5 rounded-[10px] border border-gray-300 bg-white text-gray-700 font-semibold text-[13px] cursor-pointer min-w-[120px] transition-all duration-200 ease-in-out hover:bg-green-600 hover:text-white hover:border-green-600 hover:-translate-y-0.5"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-3.5 px-5 text-center">
          <button className="py-2.5 px-8 rounded-[10px] border-[1.5px] border-green-600 text-green-600 bg-transparent font-semibold text-sm cursor-pointer">
            View all past services
          </button>
        </div>
      </div>

      {/* Service Request Details Modal — same as Service Requests page */}
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
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-[10px] text-[15px] text-slate-900 leading-relaxed">
                  {selectedRequest.description}
                </div>
              </div>
            </div>

            {selectedRequest.photo && (
              <img
                src={`${UPLOADS_URL}/${selectedRequest.photo}`}
                alt="Problem"
                className="w-full rounded-xl mt-1.5 border border-slate-200"
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
    </div>
  );
}

export default ServiceHistory;
