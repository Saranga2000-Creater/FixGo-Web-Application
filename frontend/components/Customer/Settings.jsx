// ============================================================
// FILE: Settings.jsx
// PURPOSE: Settings page — Account, Security, and App Settings sections.
//
// 👉 API: "Edit Profile"       → navigate to profile edit form
// 👉 API: "Addresses"          → GET /api/customer/addresses
// 👉 API: "Change Password"    → POST /api/customer/change-password
// 👉 API: "Password Update"    → POST /api/customer/change-password
// 👉 API: "Privacy Policy"     → GET /api/pages/privacy-policy (or static page)
// 👉 API: "Terms & Conditions" → GET /api/pages/terms          (or static page)
// 👉 API: "About FixGo"        → static, no API needed
// ============================================================

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
		<footer className="flex flex-col gap-2 py-1 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
			<p>© 2026 FixGo. All rights reserved.</p>
			<p>Version 1.0.0</p>
		</footer>
	);
}

// ── SettingsRow ───────────────────────────────────────────────
// Reusable clickable row inside a settings section.
// 👉 API: Add an onClick handler to each row to trigger the relevant action.
function SettingsRow({ icon, label, meta }) {
	return (
		<button className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-slate-50">
			<div className="flex items-center gap-3">
				<FontAwesomeIcon icon={icon} className="w-4 text-slate-400" />
				<span className="text-sm text-slate-700">{label}</span>
			</div>
			<div className="flex items-center gap-3">
				{meta && <span className="text-sm text-slate-400">{meta}</span>}
				<FontAwesomeIcon icon={faChevronRight} className="text-xs text-slate-400" />
			</div>
		</button>
	);
}

// ── Settings (page) ───────────────────────────────────────────
function Settings() {
	return (
		<div className="space-y-5">
			<section>
				<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Settings</h1>
				<p className="mt-2 text-sm text-slate-500">Manage your account, preferences and app settings.</p>
			</section>

			{/* ── Account Settings ── */}
			<section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
				<div className="flex flex-col sm:flex-row">
					<div className="flex items-center gap-5 border-b border-slate-100 px-6 py-6 sm:w-[280px] sm:shrink-0 sm:border-b-0 sm:border-r">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4ee]">
							<FontAwesomeIcon icon={faUser} className="text-2xl text-[#ff6b1a]" />
						</div>
						<div>
							<p className="text-base font-semibold text-slate-900">Account Settings</p>
							<p className="mt-1 text-xs text-slate-500">Manage your personal information and account details.</p>
						</div>
					</div>
					<div className="flex-1 divide-y divide-slate-100">
						<SettingsRow icon={faUser}   label="Edit Profile" />
						<SettingsRow icon={faMapPin} label="Addresses" />
						<SettingsRow icon={faLock}   label="Change Password" />
					</div>
				</div>
			</section>

			{/* ── Security ── */}
			<section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
				<div className="flex flex-col sm:flex-row">
					<div className="flex items-center gap-5 border-b border-slate-100 px-6 py-6 sm:w-[280px] sm:shrink-0 sm:border-b-0 sm:border-r">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf3ff]">
							<FontAwesomeIcon icon={faShieldHalved} className="text-2xl text-[#2563eb]" />
						</div>
						<div>
							<p className="text-base font-semibold text-slate-900">Security</p>
							<p className="mt-1 text-xs text-slate-500">Manage your account security and login settings.</p>
						</div>
					</div>
					<div className="flex-1 divide-y divide-slate-100">
						<SettingsRow icon={faLock} label="Password Update" />
					</div>
				</div>
			</section>

			{/* ── App Settings ── */}
			<section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
				<div className="flex flex-col sm:flex-row">
					<div className="flex items-center gap-5 border-b border-slate-100 px-6 py-6 sm:w-[280px] sm:shrink-0 sm:border-b-0 sm:border-r">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fffbeb]">
							<FontAwesomeIcon icon={faMobile} className="text-2xl text-[#d97706]" />
						</div>
						<div>
							<p className="text-base font-semibold text-slate-900">App Settings</p>
							<p className="mt-1 text-xs text-slate-500">Manage app behavior and data.</p>
						</div>
					</div>
					<div className="flex-1 divide-y divide-slate-100">
						<SettingsRow icon={faShield}     label="Privacy Policy" />
						<SettingsRow icon={faFileLines}  label="Terms & Conditions" />
						{/* meta="Version 1.0.0" is static — no API needed */}
						<SettingsRow icon={faCircleInfo} label="About FixGo" meta="Version 1.0.0" />
					</div>
				</div>
			</section>

			<PageFooter />
		</div>
	);
}

export default Settings;
