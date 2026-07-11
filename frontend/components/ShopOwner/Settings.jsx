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
      className={`w-11 h-6 rounded-xl cursor-pointer relative transition-colors duration-200 shrink-0 ${
        on ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-[18px] h-[18px] rounded-full bg-white absolute top-[3px] transition-[left] duration-200 ${
          on ? "left-[23px]" : "left-[3px]"
        }`}
      />
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Settings</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your account, shop preferences and system settings.
          </p>
        </div>
        <button className="py-2.5 px-6 rounded-[10px] border-none bg-green-600 text-white font-bold text-sm cursor-pointer">
          Save Changes
        </button>
      </div>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {/* Shop Information */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <h3 className="font-bold text-base text-gray-900 mb-5">
            Shop Information
          </h3>
          {SHOP_FIELDS.map(([label, val]) => (
            <div key={label} className="mb-3.5">
              <label className="text-xs text-gray-500 block mb-1">
                {label}
              </label>
              <input
                defaultValue={val}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 box-border outline-none"
              />
            </div>
          ))}
          <div className="mb-3.5">
            <label className="text-xs text-gray-500 block mb-1">
              Shop Description
            </label>
            <textarea
              defaultValue="We provide high quality vehicle repair and maintenance services with experienced technicians and modern equipment."
              rows={3}
              className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 resize-y box-border"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          {/* Notification Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <h3 className="font-bold text-base text-gray-900 mb-4">
              Notification Settings
            </h3>
            {NOTIF_OPTIONS.map(([key, title, desc]) => (
              <div
                key={key}
                className="flex justify-between items-center py-3 border-b border-gray-50"
              >
                <div>
                  <div className="font-semibold text-sm text-gray-900">{title}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
                <Toggle on={notifs[key]} onToggle={() => toggleNotif(key)} />
              </div>
            ))}
          </div>

          {/* Account & Security */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <h3 className="font-bold text-base text-gray-900 mb-4">
              Account & Security
            </h3>
            {["Current Password", "New Password", "Confirm New Password"].map((label) => (
              <div key={label} className="mb-3.5">
                <label className="text-xs text-gray-500 block mb-1">
                  {label}
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••"
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm box-border outline-none"
                />
              </div>
            ))}
            <button className="w-full py-2.5 rounded-[10px] border-none bg-green-600 text-white font-bold text-sm cursor-pointer">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

