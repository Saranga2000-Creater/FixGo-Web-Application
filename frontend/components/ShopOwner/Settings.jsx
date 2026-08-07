import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../src/services/api";

// Simple inline icon components
function IconShield({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}

function IconSmartphone({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  );
}


function IconLock({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconFileText({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function IconInfo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </svg>
  );
}

function IconChevronRight({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const SECURITY_ITEMS = [
  { icon: IconLock, label: "Password Update" },
];

const APP_SETTINGS_ITEMS = [
  { icon: IconFileText, label: "Terms & Conditions" },
  { icon: IconInfo, label: "About FixGo", trailing: "Version 1.0.0" },
];

function SettingsSection({ icon: Icon, iconBg, iconColor, title, description, items, onItemClick }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 md:[grid-template-columns:280px_1fr] items-stretch">
      {/* Left info panel */}
      <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <h3 className="font-bold text-base text-gray-900 mb-1.5">{title}</h3>
        <p className="text-sm text-gray-500 leading-snug m-0">{description}</p>
      </div>

      {/* Right list panel */}
      <div>
        {items.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onItemClick?.(item.label)}
            className={`w-full flex items-center justify-between px-5 py-4 bg-transparent border-0 text-left cursor-pointer hover:bg-gray-50 transition-colors ${
              i !== items.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <span className="flex items-center gap-3">
              <item.icon className="w-[18px] h-[18px] text-emerald-600" />
              <span className="text-sm font-semibold text-gray-900">{item.label}</span>
            </span>
            <span className="flex items-center gap-2">
              {item.trailing && (
                <span className="text-xs text-gray-400">{item.trailing}</span>
              )}
              <IconChevronRight className="w-4 h-4 text-gray-300" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null); // 'password' | null

  // Password form state
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });

  const handleItemClick = (label) => {
    if (label === "Password Update") {
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwdMsg({ type: "", text: "" });
      setActiveModal("password");
    } else if (label === "Terms & Conditions") {
      navigate("/terms-conditions");
    } else {
      alert(`${label} - Coming soon.`);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: "", text: "" });

    const currentPassword = pwdForm.currentPassword.trim();
    const newPassword = pwdForm.newPassword.trim();
    const confirmPassword = pwdForm.confirmPassword.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdMsg({ type: "error", text: "All password fields are required." });
      return;
    }

    if (newPassword.length < 6) {
      setPwdMsg({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "New password and confirm password do not match." });
      return;
    }

    setPwdLoading(true);
    try {
      const res = await api.post("shop/updatePassword.php", {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
        confirmPassword: pwdForm.confirmPassword
      });
      if (res?.success) {
        setPwdMsg({ type: "success", text: res.message || "Password updated successfully!" });
        setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setActiveModal(null);
          setPwdMsg({ type: "", text: "" });
        }, 1800);
      } else {
        setPwdMsg({ type: "error", text: res?.message || "Failed to update password." });
      }
    } catch (err) {
      setPwdMsg({ type: "error", text: err.message || "Current password is incorrect." });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Settings</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your account security, shop preferences and system settings.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <SettingsSection
          icon={IconShield}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          title="Security"
          description="Manage your account security and login settings."
          items={SECURITY_ITEMS}
          onItemClick={handleItemClick}
        />
        <SettingsSection
          icon={IconSmartphone}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
          title="App Settings"
          description="Manage app behavior and system info."
          items={APP_SETTINGS_ITEMS}
          onItemClick={handleItemClick}
        />
      </div>


      {/* Password Update Modal */}
      {activeModal === "password" && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 m-0 flex items-center gap-2">
                <IconLock className="w-5 h-5 text-emerald-600" />
                Update Password
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg border-none bg-transparent cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={pwdForm.currentPassword}
                  onChange={(e) => {
                    setPwdForm({ ...pwdForm, currentPassword: e.target.value });
                    if (pwdMsg.text) setPwdMsg({ type: "", text: "" });
                  }}
                  placeholder="Enter current password"
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  value={pwdForm.newPassword}
                  onChange={(e) => {
                    setPwdForm({ ...pwdForm, newPassword: e.target.value });
                    if (pwdMsg.text) setPwdMsg({ type: "", text: "" });
                  }}
                  placeholder="At least 6 characters"
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={pwdForm.confirmPassword}
                  onChange={(e) => {
                    setPwdForm({ ...pwdForm, confirmPassword: e.target.value });
                    if (pwdMsg.text) setPwdMsg({ type: "", text: "" });
                  }}
                  placeholder="Re-enter new password"
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 box-border"
                />
              </div>

              {pwdMsg.text && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  pwdMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {pwdMsg.text}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className={`flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs border-none shadow-2xs ${
                    pwdLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-700 cursor-pointer"
                  }`}
                >
                  {pwdLoading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
