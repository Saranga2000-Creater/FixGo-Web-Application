import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faFileLines,
    faLock,
    faMapPin,
    faMobile,
    faShield,
    faShieldHalved,
    faUser,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

const FONT = "'Segoe UI', system-ui, sans-serif";

function SettingsRow({ icon, label, meta }) {
    return (
        <button
            className="flex w-full items-center justify-between py-4 px-6 bg-transparent border-none cursor-pointer text-left transition-colors duration-150 hover:bg-[rgba(22,163,74,0.08)]"
            style={{ fontFamily: FONT }}
        >
            <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={icon} className="w-4" style={{ color: "#16A34A80" }} />
                <span className="text-[13px] font-semibold text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2.5">
                {meta && <span className="text-[13px] text-gray-400">{meta}</span>}
                <FontAwesomeIcon icon={faChevronRight} className="text-[11px]" style={{ color: "#16A34A66" }} />
            </div>
        </button>
    );
}

function SettingsSection({ iconBg, iconColor, icon, title, description, children }) {
    return (
        <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden flex flex-wrap">
            {/* Left panel */}
            <div className="flex items-center gap-5 p-6 border-r border-gray-100 w-[260px] flex-shrink-0 box-border">
                <div
                    className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: iconBg }}
                >
                    <FontAwesomeIcon icon={icon} className="text-[22px]" style={{ color: iconColor }} />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 m-0">{title}</p>
                    <p className="text-xs text-gray-500 mt-1 mb-0 leading-relaxed">{description}</p>
                </div>
            </div>

            {/* Right rows */}
            <div className="flex-1 min-w-[200px] flex flex-col">
                {children}
            </div>
        </div>
    );
}

function Settings() {
    return (
        <div className="flex flex-col gap-5" style={{ fontFamily: FONT }}>

            {/* ── Page heading ── */}
            <div
                className="rounded-[18px] p-6 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
                style={{ background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)" }}
            >
                <h1 className="text-[28px] font-bold text-gray-900 m-0">Settings</h1>
                <p className="text-gray-500 mt-1.5 mb-0 text-sm">
                    Manage your account, preferences and app settings.
                </p>
            </div>

            {/* ── Account Settings ── */}
            <SettingsSection
                icon={faUser}
                iconBg="rgba(22,163,74,0.08)"
                iconColor="#16A34A"
                title="Account Settings"
                description="Manage your personal information and account details."
            >
                <SettingsRow icon={faUser}   label="Edit Profile" />
                <div className="border-t border-gray-100">
                    <SettingsRow icon={faMapPin} label="Addresses" />
                </div>
                <div className="border-t border-gray-100">
                    <SettingsRow icon={faLock}   label="Change Password" />
                </div>
            </SettingsSection>

            {/* ── Security ── */}
            <SettingsSection
                icon={faShieldHalved}
                iconBg="rgba(37,99,235,0.10)"
                iconColor="#2563EB"
                title="Security"
                description="Manage your account security and login settings."
            >
                <SettingsRow icon={faLock} label="Password Update" />
            </SettingsSection>

            {/* ── App Settings ── */}
            <SettingsSection
                icon={faMobile}
                iconBg="rgba(217,119,6,0.10)"
                iconColor="#D97706"
                title="App Settings"
                description="Manage app behavior and data."
            >
                <SettingsRow icon={faShield}     label="Privacy Policy" />
                <div className="border-t border-gray-100">
                    <SettingsRow icon={faFileLines}  label="Terms & Conditions" />
                </div>
                <div className="border-t border-gray-100">
                    <SettingsRow icon={faCircleInfo} label="About FixGo" meta="Version 1.0.0" />
                </div>
            </SettingsSection>

        </div>
    );
}

export default Settings;