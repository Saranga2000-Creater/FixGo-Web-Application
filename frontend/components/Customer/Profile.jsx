// ============================================================
// FILE: Profile.jsx
// PURPOSE: My Profile page — personal info, addresses, security.
//
// 👉 API: GET /api/customer/profile
//         Response: { name, email, phone, dateOfBirth, gender,
//                     language, avatarUrl, memberSince,
//                     averageRating, reviewCount, totalRepairs,
//                     completedRepairs, upcomingAppointments }
// 👉 API: GET    /api/customer/addresses
// 👉 API: POST   /api/customer/addresses
// 👉 API: PUT    /api/customer/addresses/:id
// 👉 API: DELETE /api/customer/addresses/:id
// 👉 API: GET    /api/customer/security-info
//         → lastLogin, loginDeviceCount
// ============================================================

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarDays,
	faCar,
	faChevronRight,
	faCircleCheck,
	faEnvelope,
	faLock,
	faMapPin,
	faPhone,
	faPlus,
	faStar,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

// ── PageFooter ────────────────────────────────────────────────
function PageFooter() {
	return (
		<footer className="flex flex-col gap-2 py-1 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
			<p>© 2026 FixGo. All rights reserved.</p>
			<p>Version 1.0.0</p>
		</footer>
	);
}

// ── StatsCard ─────────────────────────────────────────────────
function StatsCard({ icon, title, value, color }) {
	const s = {
		orange: { bg: "bg-[#fff4ee]", text: "text-[#ff6b1a]" },
		green:  { bg: "bg-[#edf9f0]", text: "text-[#16a34a]" },
		blue:   { bg: "bg-[#edf3ff]", text: "text-[#2563eb]" },
		violet: { bg: "bg-[#f5edff]", text: "text-[#a855f7]" },
	};
	return (
		<div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
			<div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${s[color].bg}`}>
				<FontAwesomeIcon icon={icon} className={`text-base ${s[color].text}`} />
			</div>
			<div>
				<p className="text-xs text-slate-500">{title}</p>
				<p className="text-xl font-semibold text-slate-900">{value}</p>
			</div>
		</div>
	);
}

// ── InfoRow ───────────────────────────────────────────────────
function InfoRow({ label, value }) {
	return (
		<div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
			<p className="text-sm text-slate-500">{label}</p>
			<p className="text-sm font-medium text-slate-900">{value}</p>
		</div>
	);
}

// ── SecurityRow ───────────────────────────────────────────────
function SecurityRow({ label, value, hasArrow = false }) {
	return (
		<div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
			<p className="text-sm text-slate-700">{label}</p>
			<div className="flex items-center gap-2">
				<p className="text-sm font-medium text-slate-900">{value}</p>
				{hasArrow && <FontAwesomeIcon icon={faChevronRight} className="text-xs text-slate-400" />}
			</div>
		</div>
	);
}

// ── Profile (page) ────────────────────────────────────────────
function Profile() {
	return (
		<div className="space-y-5">
			<section>
				<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">My Profile</h1>
				<p className="mt-2 text-sm text-slate-500">Manage your personal information, addresses and preferences.</p>
			</section>

			{/* ── Profile header card ── */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 md:flex-row md:items-start">
					<div className="flex flex-1 items-start gap-6">
						{/* 👉 API: Replace src with profile.avatarUrl */}
						<img
							src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
							alt="Irushi An."
							className="h-28 w-28 shrink-0 rounded-full object-cover"
						/>
						<div>
							<div className="flex flex-wrap items-center gap-3">
								{/* 👉 API: Replace with profile.name */}
								<h2 className="text-2xl font-semibold text-slate-900">Irushi An.</h2>
								<span className="rounded-full bg-[#fff4ee] px-3 py-1 text-xs font-medium text-[#ff6b1a]">Customer</span>
							</div>
							{/* 👉 API: Replace with profile.memberSince */}
							<p className="mt-1 text-sm text-slate-500">Member since May 10, 2026</p>
							<div className="mt-3 space-y-2 text-sm text-slate-600">
								{/* 👉 API: Replace with profile.email, profile.phone, profile.dateOfBirth */}
								<div className="flex items-center gap-2"><FontAwesomeIcon icon={faEnvelope} className="w-4 text-slate-400" /><span>irushi.an@example.com</span></div>
								<div className="flex items-center gap-2"><FontAwesomeIcon icon={faPhone}   className="w-4 text-slate-400" /><span>+94 77 123 4567</span></div>
								<div className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendarDays} className="w-4 text-slate-400" /><span>May 10, 1995</span></div>
							</div>
						</div>
					</div>

					{/* Account overview */}
					<div className="rounded-[18px] bg-[#fff9f6] p-5 md:w-[420px]">
						<h3 className="text-sm font-semibold text-slate-900">Account Overview</h3>
						<div className="mt-4 grid grid-cols-2 gap-3">
							{/* 👉 API: Replace values with profile.totalRepairs, etc. */}
							<StatsCard icon={faCar}          title="Total Repairs"          value="8"  color="orange" />
							<StatsCard icon={faCircleCheck}  title="Completed Repairs"      value="5"  color="green" />
							<StatsCard icon={faCalendarDays} title="Upcoming Appointments"  value="1"  color="blue" />
							<StatsCard icon={faStar}         title="Reviews Given"          value="12" color="violet" />
						</div>
					</div>
				</div>
			</section>

			{/* ── Personal Info + Addresses ── */}
			<section className="grid gap-4 md:grid-cols-2">

				{/* Personal Information */}
				<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faUser} className="text-slate-500" />
						<h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
					</div>
					<div className="mt-5 space-y-4">
						{/* 👉 API: Replace each value with profile.fieldName */}
						<InfoRow label="Full Name"          value="Irushi An." />
						<InfoRow label="Email Address"      value="irushi.an@example.com" />
						<InfoRow label="Phone Number"       value="+94 77 123 4567" />
						<InfoRow label="Date of Birth"      value="May 10, 1995" />
						<InfoRow label="Gender"             value="Female" />
						<InfoRow label="Preferred Language" value="English" />
					</div>
				</div>

				{/* Addresses */}
				<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FontAwesomeIcon icon={faMapPin} className="text-slate-500" />
							<h3 className="text-base font-semibold text-slate-900">Addresses</h3>
						</div>
						{/* 👉 API: POST /api/customer/addresses */}
						<button className="flex items-center gap-1 text-sm font-medium text-[#ff6b1a] hover:underline">
							<FontAwesomeIcon icon={faPlus} className="text-xs" /> Add New Address
						</button>
					</div>
					<div className="mt-5">
						{/* 👉 API: Replace with .map() over addresses from GET /api/customer/addresses */}
						<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
							<span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Default</span>
							<p className="mt-2 text-sm font-semibold text-slate-900">Home</p>
							<p className="mt-1 text-sm text-slate-600">No. 123, Park Road,<br />Colombo 07,<br />Sri Lanka.</p>
							<p className="mt-2 text-sm text-slate-600">
								<FontAwesomeIcon icon={faPhone} className="mr-2 text-slate-500" />+94 77 123 4567
							</p>
							<div className="mt-4 flex gap-2">
								{/* 👉 API: PUT /api/customer/addresses/:id */}
								<button className="text-sm font-medium text-[#ff6b1a] hover:underline">Edit</button>
								<span className="text-slate-300">·</span>
								{/* 👉 API: DELETE /api/customer/addresses/:id */}
								<button className="text-sm font-medium text-red-600 hover:underline">Delete</button>
							</div>
						</div>
					</div>
					{/* 👉 API: POST /api/customer/addresses */}
					<button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-3 text-sm font-medium text-[#ff6b1a] hover:bg-slate-50">
						<FontAwesomeIcon icon={faPlus} className="text-xs" /> Add New Address
					</button>
				</div>
			</section>

			{/* ── Security ── */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex items-center gap-2">
					<FontAwesomeIcon icon={faLock} className="text-slate-500" />
					<h3 className="text-base font-semibold text-slate-900">Security</h3>
				</div>
				<div className="mt-5 space-y-3">
					{/* 👉 API: lastLogin from GET /api/customer/security-info */}
					<SecurityRow label="Password"      value="••••••••••" />
					<SecurityRow label="Last Login"    value="May 25, 2026, 10:30 AM" />
					<SecurityRow label="Login Devices" value="2 Devices" hasArrow />
				</div>
			</section>

			<PageFooter />
		</div>
	);
}

export default Profile;
