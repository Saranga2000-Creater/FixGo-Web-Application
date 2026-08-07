import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faGear, faShieldHalved,
  faStore, faChevronRight,
  faSave, faSpinner, faMoneyBillWave,
  faShieldAlt, faFileLines, faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "../../src/services/api";
import toast from "react-hot-toast";

function PageHeading({ title, sub }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 m-0">{title}</h1>
      {sub && <p className="text-gray-500 mt-1.5 text-sm mb-0">{sub}</p>}
    </div>
  );
}

// ── Billing Rates Modal ────────────────────────────────────────────────────

function BillingRatesModal({ onClose }) {
  const [rates, setRates]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("admin/getBillingRates.php");
        setRates(res.data);
        setForm(res.data);
      } catch {
        toast.error("Failed to load billing rates.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("admin/updateBillingRates.php", form);
      toast.success("Billing rates updated successfully.");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save rates.");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, fieldKey, desc }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      {desc && <p className="text-[11px] text-gray-400 mb-1.5">{desc}</p>}
      <div className="flex items-center border border-gray-200 rounded-[10px] overflow-hidden focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-50 transition-all">
        <span className="px-3 py-2.5 text-xs font-bold text-gray-500 bg-gray-50 border-r border-gray-200">LKR</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form[fieldKey] ?? ""}
          onChange={e => setForm(prev => ({ ...prev, [fieldKey]: e.target.value }))}
          className="flex-1 py-2.5 px-3 text-sm outline-none bg-white"
        />
      </div>
    </div>
  );

  const DaysField = ({ label, fieldKey }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-[10px] overflow-hidden focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-50 transition-all">
        <input
          type="number"
          min="1"
          max="60"
          value={form[fieldKey] ?? ""}
          onChange={e => setForm(prev => ({ ...prev, [fieldKey]: e.target.value }))}
          className="flex-1 py-2.5 px-3 text-sm outline-none bg-white"
        />
        <span className="px-3 py-2.5 text-xs font-bold text-gray-500 bg-gray-50 border-l border-gray-200">days</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]" onClick={onClose}>
      <div className="bg-white rounded-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-xl mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 m-0">Billing Rates</h2>
            <p className="text-xs text-gray-500 m-0">Changes apply to future invoice cycles only.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-gray-400">
            <FontAwesomeIcon icon={faSpinner} spin className="text-3xl" />
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-6">
            {/* Per-request fees */}
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Per-Request Fees</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Garage Fee" fieldKey="garagePerRequestFee" desc="Per completed service request" />
                <Field label="Service Center Fee" fieldKey="serviceCenterPerRequestFee" desc="Per completed service request" />
              </div>
            </div>

            {/* Monthly flat fee */}
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Monthly Flat Fee</p>
              <Field label="Spare Parts Shop Monthly Fee" fieldKey="sparePartsMonthlyFee" desc="Fixed monthly subscription regardless of requests" />
            </div>

            {/* Grace periods */}
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Grace Periods (days before Overdue)</p>
              <div className="grid grid-cols-3 gap-4">
                <DaysField label="Garages" fieldKey="garageGracePeriodDays" />
                <DaysField label="Service Centers" fieldKey="serviceCenterGracePeriodDays" />
                <DaysField label="Spare Parts" fieldKey="sparePartsGracePeriodDays" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-[10px] text-sm font-semibold cursor-pointer bg-white hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-[10px] bg-green-600 text-white text-sm font-bold border-none cursor-pointer hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
                {saving ? "Saving…" : "Save Rates"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Settings Component ─────────────────────────────────────────────────

function Settings() {
  const [showRatesModal, setShowRatesModal] = useState(false);

  const sections = [
    {
      icon: faUser,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      title: "Admin Account",
      subtitle: "Manage admin profile and access.",
      rows: [
        { icon: faUser,         label: "Edit Email",      onClick: null },
        { icon: faShieldHalved, label: "Change Password", onClick: null },
      ],
    },
    {
      icon: faGear,
      iconBg: "bg-[#EDF3FF]",
      iconColor: "text-blue-600",
      title: "System Settings",
      subtitle: "Platform-level configuration.",
      rows: [
        { icon: faMoneyBillWave,  label: "Billing Rates",      onClick: () => setShowRatesModal(true) },
        { icon: faStore,          label: "Commission Rates",   onClick: null },
      ],
    },
    {
      icon: faGear,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      title: "App Settings",
      subtitle: "Manage app behavior and data.",
      rows: [
        { icon: faShieldAlt,   label: "Privacy Policy",     onClick: null },
        { icon: faFileLines,   label: "Terms & Conditions", onClick: null },
        { icon: faCircleInfo,  label: "About FixGo",        onClick: null, trailing: "Version 1.0.0" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="Settings" sub="Manage system configuration and admin preferences." />

      {sections.map((sec) => (
        <div
          key={sec.title}
          className="bg-white border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden flex"
        >
          <div className="w-[260px] shrink-0 border-r border-gray-100 flex items-center gap-4 py-6 px-5">
            <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 ${sec.iconBg}`}>
              <FontAwesomeIcon icon={sec.icon} className={`text-2xl ${sec.iconColor}`} />
            </div>
            <div>
              <div className="text-[15px] font-bold text-gray-900">{sec.title}</div>
              <div className="text-xs text-gray-500 mt-1">{sec.subtitle}</div>
            </div>
          </div>

          <div className="flex-1">
            {sec.rows.map((row, i) => (
              <button
                key={row.label}
                onClick={row.onClick || undefined}
                className={`w-full flex items-center justify-between py-4 px-5 bg-transparent border-none cursor-pointer font-sans hover:bg-gray-50 ${
                  i < sec.rows.length - 1 ? "border-b border-gray-100" : ""
                } ${row.onClick ? "hover:bg-green-50/40" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={row.icon} className="text-gray-400 w-4" />
                  <span className="text-sm text-gray-700">{row.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {row.trailing && (
                    <span className="text-xs text-gray-400">{row.trailing}</span>
                  )}
                  <FontAwesomeIcon icon={faChevronRight} className="text-[11px] text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {showRatesModal && <BillingRatesModal onClose={() => setShowRatesModal(false)} />}
    </div>
  );
}

export default Settings;