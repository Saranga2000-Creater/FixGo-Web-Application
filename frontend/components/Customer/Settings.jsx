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
} from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

// ── PageFooter ────────────────────────────────────────────────
function PageFooter() {
    return (
        <footer className="flex flex-col gap-2 py-1 text-xs text-[#274c3a]/50 font-mono md:flex-row md:items-center md:justify-between">
            <p>© 2026 FixGo. All rights reserved.</p>
            <p>Version 1.0.0</p>
        </footer>
    );
}

// ── SettingsRow ───────────────────────────────────────────────
function SettingsRow({ icon, label, meta }) {
    return (
        <button className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-[#16a34a]/5">
            <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={icon} className="w-4 text-[#16a34a]/50" />
                <span className="text-sm font-mono text-[#274c3a]">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                {meta && <span className="text-sm font-mono text-[#274c3a]/40">{meta}</span>}
                <FontAwesomeIcon icon={faChevronRight} className="text-xs text-[#16a34a]/40" />
            </div>
        </button>
    );
}

// ── Settings (page) ───────────────────────────────────────────
function Settings() {
    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-[28px] font-semibold tracking-tight text-[#14532d]">Settings</h1>
                <p className="mt-2 text-sm font-mono text-[#274c3a]/60">Manage your account, preferences and app settings.</p>
            </section>

            {/* ── Account Settings ── */}
            <section className="overflow-hidden rounded-[28px] border border-[#d1e7d7] bg-white shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                <div className="flex flex-col sm:flex-row">
                    <div className="flex items-center gap-5 border-b border-[#d1e7d7]/60 px-6 py-6 sm:w-[280px] sm:shrink-0 sm:border-b-0 sm:border-r sm:border-r-[#d1e7d7]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#16a34a]/10">
                            <FontAwesomeIcon icon={faUser} className="text-2xl text-[#16a34a]" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-[#14532d]">Account Settings</p>
                            <p className="mt-1 text-xs font-mono text-[#274c3a]/60">Manage your personal information and account details.</p>
                        </div>
                    </div>
                    <div className="flex-1 divide-y divide-[#d1e7d7]/60">
                        <SettingsRow icon={faUser}   label="Edit Profile" />
                        <SettingsRow icon={faMapPin} label="Addresses" />
                        <SettingsRow icon={faLock}   label="Change Password" />
                    </div>
                </div>
            </section>

            {/* ── Security ── */}
            <section className="overflow-hidden rounded-[28px] border border-[#d1e7d7] bg-white shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                <div className="flex flex-col sm:flex-row">
                    <div className="flex items-center gap-5 border-b border-[#d1e7d7]/60 px-6 py-6 sm:w-[280px] sm:shrink-0 sm:border-b-0 sm:border-r sm:border-r-[#d1e7d7]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563eb]/10">
                            <FontAwesomeIcon icon={faShieldHalved} className="text-2xl text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-[#14532d]">Security</p>
                            <p className="mt-1 text-xs font-mono text-[#274c3a]/60">Manage your account security and login settings.</p>
                        </div>
                    </div>
                    <div className="flex-1 divide-y divide-[#d1e7d7]/60">
                        <SettingsRow icon={faLock} label="Password Update" />
                    </div>
                </div>
            </section>

            {/* ── App Settings ── */}
            <section className="overflow-hidden rounded-[28px] border border-[#d1e7d7] bg-white shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                <div className="flex flex-col sm:flex-row">
                    <div className="flex items-center gap-5 border-b border-[#d1e7d7]/60 px-6 py-6 sm:w-[280px] sm:shrink-0 sm:border-b-0 sm:border-r sm:border-r-[#d1e7d7]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d97706]/10">
                            <FontAwesomeIcon icon={faMobile} className="text-2xl text-[#d97706]" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-[#14532d]">App Settings</p>
                            <p className="mt-1 text-xs font-mono text-[#274c3a]/60">Manage app behavior and data.</p>
                        </div>
                    </div>
                    <div className="flex-1 divide-y divide-[#d1e7d7]/60">
                        <SettingsRow icon={faShield}     label="Privacy Policy" />
                        <SettingsRow icon={faFileLines}  label="Terms & Conditions" />
                        <SettingsRow icon={faCircleInfo} label="About FixGo" meta="Version 1.0.0" />
                    </div>
                </div>
            </section>

            <PageFooter />
        </div>
    );
}

export default Settings;