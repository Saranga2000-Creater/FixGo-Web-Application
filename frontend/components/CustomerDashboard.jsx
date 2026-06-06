// ============================================================
// FILE: Customer.jsx
// PURPOSE: Customer dashboard UI for the FixGo app.
// This file contains ALL the pages a logged-in customer sees.
// Each "View" function = one page in the dashboard.
//
// BACKEND DEVELOPER NOTES:
// - Replace all hardcoded data (names, repair records, etc.)
//   with real API calls to your backend.
// - Look for comments marked with 👉 API: to know exactly
//   where to plug in your backend endpoints.
// ============================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faBell,
	faCalendarCheck,
	faCalendarDays,
	faCar,
	faCarSide,
	faChevronDown,
	faChevronRight,
	faCircleCheck,
	faCircleInfo,
	faClock,
	faCommentDots,
	faEnvelope,
	faGear,
	faLock,
	faMagnifyingGlass,
	faMapPin,
	faOilCan,
	faPhone,
	faPlus,
	faStar,
	faTag,
	faUser,
	faPaperPlane,
	faWrench,
	faClipboardList,
	faFlag,
	faShieldHalved,
	faRotate,
	faCheck,
	faShield,
	faMobile,
	faCircleInfo as faInfo,
	faFileLines,
} from "@fortawesome/free-solid-svg-icons";

// ============================================================
// MAIN COMPONENT: Customer
// This is the root layout — it holds the sidebar + main area.
// It uses "currentPage" state to decide which page to show.
//
// 👉 API: On load, fetch the logged-in user's profile info
//         to display name, avatar, and rating in the sidebar.
//         Endpoint suggestion: GET /api/customer/profile
// ============================================================
function Customer() {
	// "currentPage" controls which view/page is currently visible
	const [currentPage, setCurrentPage] = useState("dashboard");

	return (
		<div style={{ position: "fixed", top: "64px", left: 0, right: 0, bottom: 0, display: "flex", background: "#f6f7fb", color: "#0f172a" }}>
			<div className="flex w-full h-full overflow-hidden">

				{/* ── SIDEBAR ──────────────────────────────────────────
				    Shows user info (avatar, name, role, rating) and
				    navigation links to each page.
				    👉 API: GET /api/customer/profile
				         → name, avatar, rating, review count
				─────────────────────────────────────────────────── */}
				<aside className="hidden w-[260px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col overflow-y-auto">
					<div className="px-4 py-5">

						{/* User profile card in sidebar */}
						<div className="rounded-[28px] border border-slate-200 bg-white px-4 py-5 shadow-sm">
							<div className="flex items-center gap-3">
								{/* 👉 API: Replace src with customer.avatarUrl from your API */}
								<img
									src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"
									alt="Irushi An."
									className="h-12 w-12 rounded-full object-cover"
								/>
								<div>
									{/* 👉 API: Replace with customer.name */}
									<p className="text-sm font-semibold text-slate-900">Irushi An.</p>
									<p className="text-xs text-slate-500">Customer</p>
									<div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
										{/* 👉 API: Replace with customer.averageRating and customer.reviewCount */}
										<span className="font-semibold text-[#ff6b1a]">4.8</span>
										<span className="text-amber-400">★</span>
										<span>(12 reviews)</span>
									</div>
								</div>
							</div>
						</div>

						{/* Navigation menu — each item switches the visible page */}
						<nav className="mt-6 space-y-1 text-sm">
							<SidebarLink active={currentPage === "dashboard"} icon={faCarSide} label="Dashboard" onClick={() => setCurrentPage("dashboard")} />
							<SidebarLink active={currentPage === "profile"} icon={faUser} label="My Profile" onClick={() => setCurrentPage("profile")} />
							<SidebarLink active={currentPage === "repair"} icon={faCar} label="Repair Status" onClick={() => setCurrentPage("repair")} />
							<SidebarLink active={currentPage === "history"} icon={faClock} label="Service History" onClick={() => setCurrentPage("history")} />
							<SidebarLink active={currentPage === "reviews"} icon={faStar} label="Reviews & Ratings" onClick={() => setCurrentPage("reviews")} />
							{/* 👉 API: badge="3" → replace with real unread notification count
							         Endpoint: GET /api/customer/notifications/unread-count */}
							<SidebarLink active={currentPage === "notifications"} icon={faBell} label="Notifications" badge="3" onClick={() => setCurrentPage("notifications")} />
							<SidebarLink active={currentPage === "settings"} icon={faGear} label="Settings" onClick={() => setCurrentPage("settings")} />
						</nav>
					</div>

					{/* Logout button at the bottom of the sidebar
					    👉 API: Call POST /api/auth/logout on click,
					         then redirect to the login page */}
					<div className="mt-auto px-4 pb-5">
						<button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50">
							<FontAwesomeIcon icon={faArrowRight} className="rotate-180 text-slate-500" />
							<span>Logout</span>
						</button>
					</div>
				</aside>

				{/* ── MAIN CONTENT AREA ────────────────────────────────
				    Renders the currently active page/view based on
				    the "currentPage" state set by the sidebar links.
				─────────────────────────────────────────────────── */}
				<main className="flex-1 overflow-y-auto">
					<div className="px-4 py-5 md:px-6 lg:px-8">
						<div className="mx-auto max-w-[1180px]">
							{currentPage === "dashboard" && <DashboardView />}
							{currentPage === "profile" && <ProfileView />}
							{currentPage === "repair" && <RepairStatusView />}
							{currentPage === "history" && <ServiceHistoryView />}
							{currentPage === "reviews" && <ReviewsView />}
							{currentPage === "notifications" && <NotificationsView />}
							{currentPage === "settings" && <SettingsView />}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────
	 PAGE: SETTINGS
	 Shows three settings sections: Account, Security, App Settings.
	 Currently all items are static links (no real actions).
	 👉 API: Each row's action will call a different endpoint:
				- "Edit Profile"      → navigate to profile edit form
				- "Addresses"         → GET /api/customer/addresses
				- "Change Password"   → POST /api/customer/change-password
				- "Password Update"   → POST /api/customer/change-password
				- "Privacy Policy"    → GET /api/pages/privacy-policy  (or static page)
				- "Terms & Conditions"→ GET /api/pages/terms           (or static page)
				- "About FixGo"       → static, no API needed
───────────────────────────────────────────────────────────────── */
function SettingsView() {
	return (
		<div className="space-y-5">
			<section>
				<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Settings</h1>
				<p className="mt-2 text-sm text-slate-500">Manage your account, preferences and app settings.</p>
			</section>

			{/* ── Account Settings Section ── */}
			<section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
				<div className="flex flex-col sm:flex-row">
					{/* Left panel — section title & icon */}
					<div className="flex items-center gap-5 border-b border-slate-100 px-6 py-6 sm:w-[280px] sm:shrink-0 sm:border-b-0 sm:border-r">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4ee]">
							<FontAwesomeIcon icon={faUser} className="text-2xl text-[#ff6b1a]" />
						</div>
						<div>
							<p className="text-base font-semibold text-slate-900">Account Settings</p>
							<p className="mt-1 text-xs text-slate-500">Manage your personal information and account details.</p>
						</div>
					</div>
					{/* Right panel — clickable setting rows */}
					<div className="flex-1 divide-y divide-slate-100">
						<SettingsRow icon={faUser} label="Edit Profile" />
						<SettingsRow icon={faMapPin} label="Addresses" />
						<SettingsRow icon={faLock} label="Change Password" isLast />
					</div>
				</div>
			</section>

			{/* ── Security Section ── */}
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
						<SettingsRow icon={faLock} label="Password Update" isLast />
					</div>
				</div>
			</section>

			{/* ── App Settings Section ── */}
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
						<SettingsRow icon={faShield} label="Privacy Policy" />
						<SettingsRow icon={faFileLines} label="Terms & Conditions" />
						{/* meta="Version 1.0.0" is static — no API needed */}
						<SettingsRow icon={faCircleInfo} label="About FixGo" meta="Version 1.0.0" isLast />
					</div>
				</div>
			</section>

			<PageFooter />
		</div>
	);
}

// ── SettingsRow: reusable clickable row inside a settings section
// Each row has an icon, label, optional meta text, and a chevron arrow.
// 👉 API: Add an onClick handler to each row to trigger the relevant action.
function SettingsRow({ icon, label, meta, isLast }) {
	return (
		<button className={`flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-slate-50 ${isLast ? "" : ""}`}>
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

/* ─────────────────────────────────────────────────────────────────
	 PAGE: DASHBOARD
	 The first page a customer sees after login.
	 Shows a greeting, summary stats, and the footer.
	 👉 API: GET /api/customer/dashboard-summary
				Response should include:
				{
					activeRepairs: 2,
					completedRepairs: 5,
					upcomingAppointments: 1,
					unreadNotifications: 3
				}
───────────────────────────────────────────────────────────────── */
function DashboardView() {
	return (
		<div className="space-y-5">

			{/* Header: greeting text + current date display */}
			<section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					{/* 👉 API: Replace "Irushi" with the logged-in customer's first name */}
					<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Good evening, Irushi! 👋</h1>
					<p className="mt-2 text-sm text-slate-500">Here&apos;s what&apos;s happening with your vehicle services.</p>
				</div>
				{/* 👉 API: Replace "May 25, 2026" with today's date from JavaScript: new Date().toLocaleDateString() */}
				<div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
					<span>May 25, 2026</span>
					<FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
				</div>
			</section>

			{/* Summary cards — 4 key stats for the customer
			    👉 API: Each count value comes from GET /api/customer/dashboard-summary */}
			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{/* count="2" → replace with dashboardData.activeRepairs */}
				<SummaryCard accent="orange" icon={faCircleInfo} title="Active Repairs" count="2" linkText="View details" />
				{/* count="5" → replace with dashboardData.completedRepairs */}
				<SummaryCard accent="green" icon={faCircleCheck} title="Completed Repairs" count="5" linkText="View history" />
				{/* count="1" → replace with dashboardData.upcomingAppointments */}
				<SummaryCard accent="blue" icon={faCalendarCheck} title="Upcoming Appointments" count="1" linkText="View calendar" />
				{/* count="3" → replace with dashboardData.unreadNotifications */}
				<SummaryCard accent="violet" icon={faBell} title="Notifications" count="3" linkText="View all" />
			</section>

			<PageFooter />
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────
	 PAGE: MY PROFILE
	 Shows the customer's personal info, addresses, and security info.
	 👉 API: GET /api/customer/profile
				Response should include:
				{
					name, email, phone, dateOfBirth, gender, language,
					avatarUrl, memberSince, averageRating, reviewCount,
					totalRepairs, completedRepairs, upcomingAppointments
				}
	 👉 API: GET /api/customer/addresses
				Response: array of address objects
	 👉 API: POST /api/customer/addresses         (add new address)
	 👉 API: PUT  /api/customer/addresses/:id     (edit address)
	 👉 API: DELETE /api/customer/addresses/:id   (delete address)
───────────────────────────────────────────────────────────────── */
function ProfileView() {
	return (
		<div className="space-y-5">
			<section>
				<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">My Profile</h1>
				<p className="mt-2 text-sm text-slate-500">Manage your personal information, addresses and preferences.</p>
			</section>

			{/* ── Profile header card: avatar, name, contact info, stats ── */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 md:flex-row md:items-start">
					<div className="flex flex-1 items-start gap-6">
						{/* 👉 API: Replace src with profile.avatarUrl */}
						<img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt="Irushi An." className="h-28 w-28 shrink-0 rounded-full object-cover" />
						<div>
							<div className="flex flex-wrap items-center gap-3">
								{/* 👉 API: Replace with profile.name */}
								<h2 className="text-2xl font-semibold text-slate-900">Irushi An.</h2>
								<span className="rounded-full bg-[#fff4ee] px-3 py-1 text-xs font-medium text-[#ff6b1a]">Customer</span>
							</div>
							{/* 👉 API: Replace with profile.memberSince (formatted date) */}
							<p className="mt-1 text-sm text-slate-500">Member since May 10, 2026</p>
							<div className="mt-3 space-y-2 text-sm text-slate-600">
								{/* 👉 API: Replace all values below with profile.email, profile.phone, profile.dateOfBirth */}
								<div className="flex items-center gap-2"><FontAwesomeIcon icon={faEnvelope} className="w-4 text-slate-400" /><span>irushi.an@example.com</span></div>
								<div className="flex items-center gap-2"><FontAwesomeIcon icon={faPhone} className="w-4 text-slate-400" /><span>+94 77 123 4567</span></div>
								<div className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendarDays} className="w-4 text-slate-400" /><span>May 10, 1995</span></div>
							</div>
						</div>
					</div>

					{/* Account overview mini-stats
					    👉 API: values come from GET /api/customer/profile */}
					<div className="rounded-[18px] bg-[#fff9f6] p-5 md:w-[420px]">
						<h3 className="text-sm font-semibold text-slate-900">Account Overview</h3>
						<div className="mt-4 grid grid-cols-2 gap-3">
							{/* 👉 API: Replace value with profile.totalRepairs */}
							<StatsCard icon={faCar} title="Total Repairs" value="8" color="orange" />
							{/* 👉 API: Replace value with profile.completedRepairs */}
							<StatsCard icon={faCircleCheck} title="Completed Repairs" value="5" color="green" />
							{/* 👉 API: Replace value with profile.upcomingAppointments */}
							<StatsCard icon={faCalendarDays} title="Upcoming Appointments" value="1" color="blue" />
							{/* 👉 API: Replace value with profile.reviewCount */}
							<StatsCard icon={faStar} title="Reviews Given" value="12" color="violet" />
						</div>
					</div>
				</div>
			</section>

			{/* ── Personal Info + Addresses side by side ── */}
			<section className="grid gap-4 md:grid-cols-2">

				{/* Personal Information card — read-only display
				    👉 API: All values come from GET /api/customer/profile */}
				<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex items-center gap-2"><FontAwesomeIcon icon={faUser} className="text-slate-500" /><h3 className="text-base font-semibold text-slate-900">Personal Information</h3></div>
					<div className="mt-5 space-y-4">
						{/* 👉 API: Replace each value with profile.fieldName */}
						<InfoRow label="Full Name" value="Irushi An." />
						<InfoRow label="Email Address" value="irushi.an@example.com" />
						<InfoRow label="Phone Number" value="+94 77 123 4567" />
						<InfoRow label="Date of Birth" value="May 10, 1995" />
						<InfoRow label="Gender" value="Female" />
						<InfoRow label="Preferred Language" value="English" />
					</div>
				</div>

				{/* Addresses card
				    👉 API: GET /api/customer/addresses → render each address in a card
				    👉 API: POST /api/customer/addresses on "Add New Address" click
				    👉 API: PUT  /api/customer/addresses/:id on "Edit" click
				    👉 API: DELETE /api/customer/addresses/:id on "Delete" click */}
				<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2"><FontAwesomeIcon icon={faMapPin} className="text-slate-500" /><h3 className="text-base font-semibold text-slate-900">Addresses</h3></div>
						<button className="flex items-center gap-1 text-sm font-medium text-[#ff6b1a] hover:underline"><FontAwesomeIcon icon={faPlus} className="text-xs" /> Add New Address</button>
					</div>
					<div className="mt-5">
						{/* This is one hardcoded address — replace with a .map() over addresses from the API */}
						<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
							<span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Default</span>
							<p className="mt-2 text-sm font-semibold text-slate-900">Home</p>
							<p className="mt-1 text-sm text-slate-600">No. 123, Park Road,<br />Colombo 07,<br />Sri Lanka.</p>
							<p className="mt-2 text-sm text-slate-600"><FontAwesomeIcon icon={faPhone} className="mr-2 text-slate-500" />+94 77 123 4567</p>
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

			{/* ── Security info card ──
			    👉 API: GET /api/customer/security-info
			         → lastLogin (datetime), loginDeviceCount
			    👉 API: GET /api/customer/devices → list of logged-in devices */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex items-center gap-2"><FontAwesomeIcon icon={faLock} className="text-slate-500" /><h3 className="text-base font-semibold text-slate-900">Security</h3></div>
				<div className="mt-5 space-y-3">
					{/* 👉 API: "••••••••••" is always masked — no API needed for display */}
					<SecurityRow label="Password" value="••••••••••" />
					{/* 👉 API: Replace with securityInfo.lastLogin */}
					<SecurityRow label="Last Login" value="May 25, 2026, 10:30 AM" />
					{/* 👉 API: Replace with securityInfo.loginDeviceCount + " Devices" */}
					<SecurityRow label="Login Devices" value="2 Devices" hasArrow />
				</div>
			</section>

			<PageFooter />
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────
	 STATIC DATA: REPAIR STEPS
	 Defines the 5 stages of a repair request lifecycle.
	 The "status" field controls how each step looks:
		 "done"    → green with checkmark
		 "active"  → orange (currently in progress)
		 "pending" → grey (not started yet)
	 👉 API: This array should be built dynamically from:
				GET /api/repairs/:repairId/status
				Response: { currentStep: "repairing", steps: [...] }
───────────────────────────────────────────────────────────────── */
const STEPS = [
	{ key: "sent", icon: faPaperPlane, label: "Request Sent", date: "May 25, 2026", time: "09:15 AM", desc: "Your repair request has been sent successfully.", status: "done" },
	{ key: "accepted", icon: faCircleCheck, label: "Accepted", date: "May 25, 2026", time: "10:28 AM", desc: "Your request has been accepted by Advance Auto Service.", status: "done" },
	{ key: "repairing", icon: faWrench, label: "Repairing", date: "May 25, 2026", time: "11:40 AM", desc: "Your vehicle is currently being repaired.", status: "active" },
	{ key: "quality", icon: faClipboardList, label: "Quality Check", date: null, time: null, desc: "Your vehicle is under quality check before completion.", status: "pending" },
	{ key: "completed", icon: faFlag, label: "Completed", date: null, time: null, desc: "Your repair has been completed and your vehicle is ready.", status: "pending" },
];

/* ─────────────────────────────────────────────────────────────────
	 PAGE: REPAIR STATUS
	 Shows the current repair request's progress as a step tracker.
	 👉 API: GET /api/customer/repairs/active
				(or GET /api/repairs/:repairId for a specific repair)
				Response should include:
				{
					requestId, vehicleName, vehiclePlate, vehicleImageUrl,
					serviceType, requestedAt,
					steps: [{ key, label, date, time, status }],
					details: { serviceRequested, workshop, estimatedCompletion }
				}
───────────────────────────────────────────────────────────────── */
function RepairStatusView() {
	return (
		<div className="space-y-5">
			<section>
				<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Repair Status</h1>
				<p className="mt-2 text-sm text-slate-500">Track the progress of your repair request in real-time.</p>
			</section>

			{/* Vehicle info card
			    👉 API: Replace all values with repair.vehicle* and repair.requestedAt */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-5">
						{/* 👉 API: Replace src with repair.vehicleImageUrl */}
						<img src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=160&q=80" alt="Toyota Prius" className="h-20 w-28 rounded-xl object-cover" />
						<div>
							{/* 👉 API: Replace with repair.vehicleName + " – " + repair.vehiclePlate */}
							<p className="text-lg font-semibold text-slate-900">Toyota Prius – ABC-1234</p>
							{/* 👉 API: Replace with repair.serviceType */}
							<p className="mt-1 text-sm text-slate-600">Service: <span className="font-semibold text-slate-900">Engine Overheating</span></p>
							{/* 👉 API: Replace with repair.requestId */}
							<p className="mt-1 text-sm text-slate-600">Request ID: <span className="font-semibold text-slate-900">FXG-001</span></p>
						</div>
					</div>
					<div className="text-right text-sm text-slate-500">
						<p>Requested on</p>
						{/* 👉 API: Replace with formatted repair.requestedAt */}
						<p className="mt-1 font-semibold text-slate-900">May 25, 2026 • 09:15 AM</p>
					</div>
				</div>
			</section>

			{/* Step tracker — visual progress bar with 5 stages
			    👉 API: Map over repair.steps array instead of the static STEPS constant */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="overflow-x-auto">
					<div className="flex min-w-[620px] items-start justify-between">
						{STEPS.map((step, idx) => (
							<div key={step.key} className="flex flex-1 flex-col items-center">
								{/* Connector line between steps — orange if previous step is done */}
								<div className="relative flex w-full items-center justify-center">
									{idx > 0 && <div className={`absolute right-1/2 top-1/2 h-[3px] w-full -translate-y-1/2 ${STEPS[idx - 1].status === "done" || step.status === "active" ? "bg-[#ff6b1a]" : "bg-slate-200"}`} />}
									<div className="relative z-10">
										{/* Step icon circle — color depends on status */}
										{step.status === "done" && <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#16a34a] bg-[#edf9f0]"><FontAwesomeIcon icon={step.icon} className="text-xl text-[#16a34a]" /></div>}
										{step.status === "active" && <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#ff6b1a] bg-[#fff4ee]"><FontAwesomeIcon icon={step.icon} className="text-xl text-[#ff6b1a]" /></div>}
										{step.status === "pending" && <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-200 bg-white"><FontAwesomeIcon icon={step.icon} className="text-xl text-slate-300" /></div>}
										{/* Green checkmark badge on completed steps */}
										{step.status === "done" && <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#16a34a] text-[10px] text-white">✓</span>}
									</div>
								</div>
								{/* Step label and timestamp */}
								<div className="mt-4 w-full px-1 text-center">
									<p className="text-sm font-semibold text-slate-900">{step.label}</p>
									{/* 👉 API: step.date and step.time come from the backend (null if not reached yet) */}
									{step.date
										? <><p className="mt-1 text-xs text-slate-500">{step.date}</p><p className="text-xs text-slate-500">{step.time}</p></>
										: <p className="mt-1 text-xs tracking-widest text-slate-300">- - - - - -</p>
									}
									<p className="mt-2 text-xs leading-4 text-slate-500">{step.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				{/* Reassurance banner — static, no API needed */}
				<div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf9f0]"><FontAwesomeIcon icon={faShieldHalved} className="text-[#16a34a]" /></div>
					<div><p className="text-sm font-semibold text-slate-900">Sit back and relax!</p><p className="text-sm text-slate-500">We&apos;ll keep you updated at every step of the way.</p></div>
				</div>
			</section>

			{/* Repair details summary
			    👉 API: Values come from repair.details object */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<h3 className="text-base font-semibold text-slate-900">Repair Details</h3>
				<div className="mt-5 space-y-4">
					{/* 👉 API: Replace values with repair.details.serviceRequested, .workshop, .estimatedCompletion */}
					<RepairDetailRow label="Service Requested" value="Engine Overheating" />
					<RepairDetailRow label="Workshop" value="Advanced Auto Service Center" />
					<RepairDetailRow label="Estimated Completion" value="May 25, 2026 • 05:00 PM" />
				</div>
			</section>

			<PageFooter />
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────
	 STATIC DATA: SERVICE RECORDS
	 Hardcoded list of past service/repair records.
	 👉 API: Replace with data from GET /api/customer/service-history
				Query params: ?filter=all|last3months|last6months|thisyear
				Response: array of service record objects
───────────────────────────────────────────────────────────────── */
const SERVICE_RECORDS = [
	{ id: 1, title: "Engine Overheating", date: "May 25, 2026", time: "10:30 AM", shop: "Advanced Auto Service Center", status: "Completed", icon: faWrench, accent: "green" },
	{ id: 2, title: "Brake Pad Replacement", date: "Mar 12, 2026", time: "02:15 PM", shop: "QuickFix Auto Care", status: "Completed", icon: faClipboardList, accent: "blue" },
	{ id: 3, title: "Oil Change & Filter", date: "Jan 18, 2026", time: "11:00 AM", shop: "Advanced Auto Service Center", status: "Completed", icon: faOilCan, accent: "orange" },
	{ id: 4, title: "General Checkup", date: "Nov 05, 2025", time: "09:30 AM", shop: "AutoCare Plus", status: "Completed", icon: faClipboardList, accent: "violet" },
	{ id: 5, title: "Tyre Rotation", date: "Aug 20, 2025", time: "04:00 PM", shop: "QuickFix Auto Care", status: "Completed", icon: faRotate, accent: "yellow" },
];

// Color/style map for each accent color used in service history and reviews
// No API needed — this is purely a UI styling helper
const ACCENT_STYLES = {
	green: { bg: "bg-[#edf9f0]", text: "text-[#16a34a]", btn: "border-[#16a34a] text-[#16a34a] hover:bg-[#edf9f0]", dot: "bg-[#16a34a]", badge: "bg-[#edf9f0] text-[#16a34a]" },
	blue: { bg: "bg-[#edf3ff]", text: "text-[#2563eb]", btn: "border-[#2563eb] text-[#2563eb] hover:bg-[#edf3ff]", dot: "bg-[#2563eb]", badge: "bg-[#edf3ff] text-[#2563eb]" },
	orange: { bg: "bg-[#fff4ee]", text: "text-[#ff6b1a]", btn: "border-[#ff6b1a] text-[#ff6b1a] hover:bg-[#fff4ee]", dot: "bg-[#ff6b1a]", badge: "bg-[#fff4ee] text-[#ff6b1a]" },
	violet: { bg: "bg-[#f5edff]", text: "text-[#a855f7]", btn: "border-[#a855f7] text-[#a855f7] hover:bg-[#f5edff]", dot: "bg-[#a855f7]", badge: "bg-[#f5edff] text-[#a855f7]" },
	yellow: { bg: "bg-[#fffbeb]", text: "text-[#d97706]", btn: "border-[#d97706] text-[#d97706] hover:bg-[#fffbeb]", dot: "bg-[#d97706]", badge: "bg-[#fffbeb] text-[#d97706]" },
};

/* ─────────────────────────────────────────────────────────────────
	 PAGE: SERVICE HISTORY
	 Lists all past repairs/services for the customer.
	 Has a time-range filter dropdown.
	 👉 API: GET /api/customer/service-history?filter=alltime
				When filter changes → re-fetch with new query param
	 👉 API: GET /api/customer/vehicle
				→ vehicleName, vehiclePlate, year, color, vin, mileage, imageUrl
	 👉 API: "View Details" button → GET /api/repairs/:id
───────────────────────────────────────────────────────────────── */
function ServiceHistoryView() {
	// "filter" controls which time range is selected in the dropdown
	// 👉 API: When filter changes, re-fetch service history with the new filter
	const [filter, setFilter] = useState("All Time");

	return (
		<div className="space-y-5">
			<section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Service History</h1>
					<p className="mt-2 text-sm text-slate-500">View your past vehicle services and repair details.</p>
				</div>
				{/* Filter dropdown — triggers a new API call when changed
				    👉 API: On change → GET /api/customer/service-history?filter=last3months (etc.) */}
				<div className="flex items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
					<FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
					<select value={filter} onChange={(e) => setFilter(e.target.value)} className="appearance-none bg-transparent pr-5 text-sm text-slate-700 focus:outline-none">
						<option>All Time</option>
						<option>Last 3 Months</option>
						<option>Last 6 Months</option>
						<option>This Year</option>
					</select>
					<FontAwesomeIcon icon={faChevronDown} className="pointer-events-none -ml-4 text-xs text-slate-400" />
				</div>
			</section>

			{/* Vehicle summary card
			    👉 API: GET /api/customer/vehicle → replace all hardcoded values */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
				<div className="flex items-center gap-5">
					{/* 👉 API: Replace src with vehicle.imageUrl */}
					<img src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=200&q=80" alt="Toyota Prius" className="h-20 w-32 rounded-xl object-cover" />
					<div>
						{/* 👉 API: Replace with vehicle.name + " - " + vehicle.plate */}
						<p className="text-lg font-semibold text-slate-900">Toyota Prius - ABC-1234</p>
						<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
							{/* 👉 API: Replace with vehicle.year, vehicle.color, vehicle.vin */}
							<span>Year: 2016</span><span className="text-slate-300">|</span>
							<span>Color: White</span><span className="text-slate-300">|</span>
							<span>VIN: JTDKBRFU0G3523611</span>
						</div>
						{/* 👉 API: Replace with vehicle.mileage */}
						<p className="mt-1 text-sm text-slate-500">Mileage: 48,560 km</p>
					</div>
				</div>
			</section>

			{/* Service records list
			    👉 API: Replace SERVICE_RECORDS with API data and map over it */}
			<section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
				{SERVICE_RECORDS.map((record, idx) => {
					const a = ACCENT_STYLES[record.accent];
					const isLast = idx === SERVICE_RECORDS.length - 1;
					return (
						<div key={record.id} className={`flex items-center gap-4 px-6 py-5 ${!isLast ? "border-b border-slate-100" : ""}`}>
							{/* Timeline dot + connector line */}
							<div className="flex flex-col items-center self-stretch">
								<div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${a.dot}`} />
								{!isLast && <div className="mt-1 w-px flex-1 bg-slate-100" />}
							</div>
							{/* Service icon */}
							<div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${a.bg}`}>
								<FontAwesomeIcon icon={record.icon} className={`text-xl ${a.text}`} />
							</div>
							{/* Service title, status badge, date, shop */}
							<div className="flex-1 min-w-0">
								<div className="flex flex-wrap items-center gap-2">
									<p className="text-sm font-semibold text-slate-900">{record.title}</p>
									<span className={`rounded-full px-3 py-0.5 text-xs font-medium ${a.badge}`}>{record.status}</span>
								</div>
								<div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
									<span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />{record.date} • {record.time}</span>
									<span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faMapPin} className="text-slate-400" />{record.shop}</span>
								</div>
							</div>
							{/* "View Details" button
							    👉 API: GET /api/repairs/:record.id → show repair detail modal or page */}
							<button className={`shrink-0 flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${a.btn}`}>
								View Details <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
							</button>
						</div>
					);
				})}
			</section>

			<PageFooter />
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────
	 STATIC DATA: RATING BREAKDOWN
	 Shows distribution of star ratings (5★ down to 1★).
	 👉 API: GET /api/customer/reviews/summary
				Response: { averageRating, totalReviews, breakdown: [{stars, count, pct}] }
───────────────────────────────────────────────────────────────── */
const RATING_BREAKDOWN = [
	{ stars: 5, count: 8, pct: 67 },
	{ stars: 4, count: 3, pct: 25 },
	{ stars: 3, count: 1, pct: 8 },
	{ stars: 2, count: 0, pct: 0 },
	{ stars: 1, count: 0, pct: 0 },
];

/* ─────────────────────────────────────────────────────────────────
	 STATIC DATA: MY REVIEWS
	 Hardcoded list of reviews the customer has written.
	 👉 API: GET /api/customer/reviews
				Query params: ?filter=alltime|last3months|last6months|thisyear
				Response: array of review objects
───────────────────────────────────────────────────────────────── */
const MY_REVIEWS = [
	{ id: 1, title: "Engine Overheating", shop: "Advanced Auto Service Center", date: "May 25, 2026", rating: 5.0, comment: "Excellent service! The team was professional and fixed the issue quickly. Very satisfied.", icon: faWrench, accent: "orange" },
	{ id: 2, title: "Brake Pad Replacement", shop: "QuickFix Auto Care", date: "Mar 12, 2026", rating: 4.5, comment: "Good service and on-time delivery.\nStaff is polite.", icon: faClipboardList, accent: "blue" },
	{ id: 3, title: "Oil Change & Filter", shop: "Advanced Auto Service Center", date: "Jan 18, 2026", rating: 5.0, comment: "Very happy with the service quality.\nHighly recommend!", icon: faOilCan, accent: "orange" },
	{ id: 4, title: "General Checkup", shop: "AutoCare Plus", date: "Nov 05, 2025", rating: 4.0, comment: "Nice experience overall.\nWill use FixGo again.", icon: faClipboardList, accent: "violet" },
];

// StarDisplay: renders 5 stars, filled based on the rating value
// Used in both the rating summary and individual review rows
// No API needed — purely a display component
function StarDisplay({ rating, size = "sm" }) {
	const sizeClass = size === "lg" ? "text-2xl" : "text-base";
	return (
		<div className="flex items-center gap-0.5">
			{[1, 2, 3, 4, 5].map((s) => (
				<span key={s} className={`${sizeClass} ${rating >= s || (rating >= s - 0.5 && rating < s) ? "text-amber-400" : "text-slate-200"}`}>★</span>
			))}
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────
	 PAGE: REVIEWS & RATINGS
	 Shows the customer's overall rating summary and their review list.
	 👉 API: GET /api/customer/reviews/summary → averageRating, totalReviews, breakdown
	 👉 API: GET /api/customer/reviews?filter=alltime → list of reviews
───────────────────────────────────────────────────────────────── */
function ReviewsView() {
	// 👉 API: When filter changes, re-fetch reviews with the new filter value
	const [filter, setFilter] = useState("All Time");

	return (
		<div className="space-y-5">
			<section>
				<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Reviews & Ratings</h1>
				<p className="mt-2 text-sm text-slate-500">See your reviews and ratings for past services.</p>
			</section>

			{/* Rating summary card: average score + star breakdown + total count
			    👉 API: All values from GET /api/customer/reviews/summary */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 md:flex-row md:items-center">
					{/* Average rating display */}
					<div className="flex flex-col items-center justify-center md:w-48">
						{/* 👉 API: Replace "4.8" with reviewSummary.averageRating */}
						<p className="text-6xl font-bold text-slate-900">4.8</p>
						<StarDisplay rating={4.8} size="lg" />
						{/* 👉 API: Replace "12" with reviewSummary.totalReviews */}
						<p className="mt-2 text-sm text-slate-500">Based on 12 reviews</p>
					</div>

					{/* Star breakdown bars (5★ to 1★)
					    👉 API: Map over reviewSummary.breakdown instead of RATING_BREAKDOWN */}
					<div className="flex-1 space-y-2">
						{RATING_BREAKDOWN.map((row) => (
							<div key={row.stars} className="flex items-center gap-3">
								<span className="w-12 shrink-0 text-sm text-slate-600">{row.stars} {row.stars === 1 ? "Star" : "Stars"}</span>
								<div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-2.5">
									{/* bar width is a percentage — comes from the API */}
									<div className="h-full rounded-full bg-[#ff6b1a]" style={{ width: `${row.pct}%` }} />
								</div>
								<span className="w-4 shrink-0 text-right text-sm text-slate-700">{row.count}</span>
								<span className="w-10 shrink-0 text-right text-sm text-slate-400">({row.pct}%)</span>
							</div>
						))}
					</div>

					{/* Total review count display */}
					<div className="flex flex-col items-center justify-center gap-2 md:w-36">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5edff]">
							<FontAwesomeIcon icon={faCommentDots} className="text-2xl text-[#a855f7]" />
						</div>
						{/* 👉 API: Replace "12" with reviewSummary.totalReviews */}
						<p className="text-4xl font-bold text-slate-900">12</p>
						<p className="text-sm text-slate-500">Total Reviews</p>
					</div>
				</div>
			</section>

			{/* Individual reviews list
			    👉 API: Replace MY_REVIEWS with data from GET /api/customer/reviews */}
			<section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
				{/* Filter header */}
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
					<h2 className="text-base font-semibold text-slate-900">My Reviews</h2>
					{/* 👉 API: On change → GET /api/customer/reviews?filter=last3months (etc.) */}
					<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
						<FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
						<select value={filter} onChange={(e) => setFilter(e.target.value)} className="appearance-none bg-transparent pr-4 text-sm text-slate-700 focus:outline-none">
							<option>All Time</option>
							<option>Last 3 Months</option>
							<option>Last 6 Months</option>
							<option>This Year</option>
						</select>
						<FontAwesomeIcon icon={faChevronDown} className="pointer-events-none -ml-3 text-xs text-slate-400" />
					</div>
				</div>

				{/* Each review row: icon | service info | star rating | comment */}
				{MY_REVIEWS.map((review, idx) => {
					const a = ACCENT_STYLES[review.accent];
					const isLast = idx === MY_REVIEWS.length - 1;
					return (
						<div key={review.id} className={`grid grid-cols-[auto_1fr_auto_1fr] items-start gap-0 ${!isLast ? "border-b border-slate-100" : ""}`}>
							{/* Service icon */}
							<div className="flex items-center px-6 py-5">
								<div className={`flex h-14 w-14 items-center justify-center rounded-full ${a.bg}`}>
									<FontAwesomeIcon icon={review.icon} className={`text-xl ${a.text}`} />
								</div>
							</div>
							{/* Service name, shop, date */}
							<div className="flex flex-col justify-center border-r border-slate-100 py-5 pr-6">
								{/* 👉 API: Replace with review.serviceTitle, review.shopName, review.date */}
								<p className="text-sm font-semibold text-slate-900">{review.title}</p>
								<p className="mt-0.5 text-xs text-slate-500">{review.shop}</p>
								<div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
									<FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
									<span>{review.date}</span>
								</div>
							</div>
							{/* Star rating number + visual stars */}
							<div className="flex flex-col items-center justify-center px-8 py-5 border-r border-slate-100">
								{/* 👉 API: Replace with review.rating */}
								<p className="text-2xl font-bold text-slate-900">{review.rating.toFixed(1)}</p>
								<StarDisplay rating={review.rating} />
							</div>
							{/* Written comment */}
							<div className="flex items-center py-5 pr-6 pl-6">
								{/* 👉 API: Replace with review.comment */}
								<p className="text-sm leading-5 text-slate-600 whitespace-pre-line">{review.comment}</p>
							</div>
						</div>
					);
				})}
			</section>

			<PageFooter />
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────
	 STATIC DATA: NOTIFICATION TABS
	 Filter tabs shown above the notifications list.
	 The "count" values should come from the API.
	 👉 API: GET /api/customer/notifications/counts
				Response: { all, unread, repair, appt, offers, system }
───────────────────────────────────────────────────────────────── */
const NOTIF_TABS = [
	{ key: "all", label: "All", count: 3 },
	{ key: "unread", label: "Unread", count: 3 },
	{ key: "repair", label: "Repair Updates", count: 2 },
	{ key: "appt", label: "Appointments", count: 1 },
	{ key: "offers", label: "Offers", count: 0 },
	{ key: "system", label: "System", count: 0 },
];

/* ─────────────────────────────────────────────────────────────────
	 STATIC DATA: NOTIFICATIONS LIST
	 Hardcoded list of notification objects.
	 Each notification has: icon, title, description, timestamp, unread flag.
	 👉 API: GET /api/customer/notifications
				Query params: ?filter=all|unread|repair|appt|offers|system
				Response: array of notification objects
	 👉 API: POST /api/customer/notifications/mark-all-read
				→ called when "Mark all as read" button is clicked
───────────────────────────────────────────────────────────────── */
const NOTIFICATIONS = [
	{
		id: 1,
		icon: faCar,
		iconBg: "bg-[#fff4ee]",
		iconColor: "text-[#ff6b1a]",
		title: "Repair status updated",
		desc: "Your repair request FXG-001 has been accepted by Advanced Auto Service Center.",
		tag: "Repair ID: FXG-001",   // 👉 API: tag = notification.relatedId (e.g. repair ID)
		tagBg: "bg-slate-100 text-slate-600",
		time: "Today, 10:28 AM",     // 👉 API: formatted from notification.createdAt
		unread: true,
		extra: null,
	},
	{
		id: 2,
		icon: faCalendarDays,
		iconBg: "bg-[#edf3ff]",
		iconColor: "text-[#2563eb]",
		title: "Upcoming appointment",
		desc: "Your appointment is confirmed for May 27, 2026 at 09:30 AM.",
		tag: null,
		time: "Today, 09:00 AM",
		unread: true,
		extra: null,
	},
	{
		id: 3,
		icon: faCircleCheck,
		iconBg: "bg-[#edf9f0]",
		iconColor: "text-[#16a34a]",
		title: "Repair completed",
		titleBadge: "Completed",     // shown as a green pill badge next to the title
		desc: "Great news! Your vehicle repair (FXG-001) has been completed and is ready for pickup.",
		tag: null,
		time: "Yesterday, 04:45 PM",
		unread: true,
		extra: "review",             // "review" triggers the "Rate & Review" prompt below the notification
	},
	{
		id: 4,
		icon: faBell,
		iconBg: "bg-[#fffbeb]",
		iconColor: "text-[#d97706]",
		title: "Appointment reminder",
		desc: "Reminder: You have an appointment tomorrow at 09:30 AM.",
		tag: null,
		time: "May 24, 2026, 09:00 AM",
		unread: false,
		extra: null,
	},
	{
		id: 5,
		icon: faTag,
		iconBg: "bg-[#fff4ee]",
		iconColor: "text-[#ff6b1a]",
		title: "Special offer for you!",
		desc: "Get 15% off on your next service. Offer valid till May 31, 2026.",
		tag: null,
		time: "May 20, 2026, 02:30 PM",
		unread: false,
		extra: null,
	},
];

/* ─────────────────────────────────────────────────────────────────
	 PAGE: NOTIFICATIONS
	 Shows a tabbed list of notifications filtered by category.
	 👉 API: GET /api/customer/notifications?filter=all (initial load)
	 👉 API: GET /api/customer/notifications?filter=unread (on tab switch)
	 👉 API: POST /api/customer/notifications/mark-all-read
───────────────────────────────────────────────────────────────── */
function NotificationsView() {
	// "activeTab" tracks which filter tab is selected
	// 👉 API: When activeTab changes, re-fetch notifications with the new filter
	const [activeTab, setActiveTab] = useState("all");

	// Client-side filtering of the static NOTIFICATIONS array
	// 👉 API: Remove this filter logic once you fetch pre-filtered data from the backend
	const filtered = NOTIFICATIONS.filter((n) => {
		if (activeTab === "all") return true;
		if (activeTab === "unread") return n.unread;
		if (activeTab === "repair") return n.icon === faCar || n.icon === faCircleCheck;
		if (activeTab === "appt") return n.icon === faCalendarDays || n.icon === faBell;
		if (activeTab === "offers") return n.icon === faTag;
		if (activeTab === "system") return false;
		return true;
	});

	return (
		<div className="space-y-5">
			<section>
				<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Notifications</h1>
				<p className="mt-2 text-sm text-slate-500">Stay updated with the latest updates and alerts.</p>
			</section>

			{/* Tab filter row + "Mark all as read" button */}
			<section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap gap-2">
					{/* 👉 API: tab.count values come from GET /api/customer/notifications/counts */}
					{NOTIF_TABS.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${activeTab === tab.key
								? "border-[#ff6b1a] bg-[#fff4ee] text-[#ff6b1a]"
								: "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
								}`}
						>
							{tab.label} ({tab.count})
						</button>
					))}
				</div>
				{/* 👉 API: POST /api/customer/notifications/mark-all-read on click,
				         then refresh the notifications list */}
				<button className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
					<FontAwesomeIcon icon={faCheck} className="text-xs text-slate-500" />
					Mark all as read
				</button>
			</section>

			{/* Notifications list */}
			<section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
				{filtered.length === 0 ? (
					<div className="px-6 py-12 text-center text-sm text-slate-400">No notifications in this category.</div>
				) : (
					filtered.map((notif, idx) => {
						const isLast = idx === filtered.length - 1;
						return (
							<div key={notif.id} className={`px-6 py-5 ${!isLast ? "border-b border-slate-100" : ""}`}>
								<div className="flex items-start gap-4">
									{/* Notification icon */}
									<div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${notif.iconBg}`}>
										<FontAwesomeIcon icon={notif.icon} className={`text-xl ${notif.iconColor}`} />
									</div>
									<div className="flex-1 min-w-0">
										{/* Title + optional badge (e.g. "Completed") */}
										<div className="flex flex-wrap items-center gap-2">
											<p className="text-sm font-semibold text-slate-900">{notif.title}</p>
											{notif.titleBadge && (
												<span className="rounded-full bg-[#edf9f0] px-3 py-0.5 text-xs font-medium text-[#16a34a]">
													{notif.titleBadge}
												</span>
											)}
										</div>
										{/* Description text */}
										<p className="mt-1 text-sm text-slate-600">{notif.desc}</p>
										{/* Optional tag (e.g. "Repair ID: FXG-001") */}
										{notif.tag && (
											<span className={`mt-2 inline-block rounded-lg px-3 py-1 text-xs font-medium ${notif.tagBg}`}>
												{notif.tag}
											</span>
										)}
										{/* "Review & Rate" prompt — shown only for completed repairs
										    👉 API: "Review & Rate" button → navigate to review form
										         POST /api/reviews with repairId, rating, comment */}
										{notif.extra === "review" && (
											<div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 bg-[#f5edff]/40 px-4 py-3">
												<div className="flex items-center gap-3">
													<FontAwesomeIcon icon={faStar} className="text-[#a855f7]" />
													<div>
														<p className="text-sm font-semibold text-slate-900">We&apos;d love to hear about your experience!</p>
														<p className="text-xs text-slate-500">Your feedback helps us improve our services.</p>
													</div>
												</div>
												{/* 👉 API: POST /api/reviews { repairId, rating, comment } */}
												<button className="ml-4 flex shrink-0 items-center gap-2 rounded-xl bg-[#a855f7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9333ea]">
													<FontAwesomeIcon icon={faStar} className="text-xs" />
													Review & Rate
													<FontAwesomeIcon icon={faArrowRight} className="text-xs" />
												</button>
											</div>
										)}
									</div>
									{/* Timestamp + unread dot indicator */}
									<div className="flex shrink-0 flex-col items-end gap-2">
										{/* 👉 API: Replace with formatted notif.createdAt */}
										<span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
										{/* Orange dot = unread, grey dot = read
										    👉 API: notif.unread comes from the backend */}
										<span className={`h-2.5 w-2.5 rounded-full ${notif.unread ? "bg-[#ff6b1a]" : "bg-slate-200"}`} />
									</div>
								</div>
							</div>
						);
					})
				)}
			</section>

			<PageFooter />
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────
	 SHARED / REUSABLE COMPONENTS
	 These are small building blocks used across multiple pages.
	 None of them need direct API calls — they receive data as props.
───────────────────────────────────────────────────────────────── */

// SidebarLink: a single nav item in the left sidebar
// Props: active (bool), icon, label, badge (optional count), onClick
function SidebarLink({ active = false, icon, label, badge, onClick }) {
	const cls = `flex items-center gap-3 rounded-xl px-4 py-3 transition ${active ? "border-l-4 border-[#ff6b1a] bg-[#fff4ee] font-medium text-[#ff6b1a]" : "text-slate-700 hover:bg-slate-50"
		}`;
	if (onClick !== undefined) {
		return (
			<button onClick={onClick} className={cls}>
				<FontAwesomeIcon icon={icon} className={active ? "text-[#ff6b1a]" : "text-slate-500"} />
				<span>{label}</span>
				{badge && <span className="ml-auto rounded-full bg-[#ff6b1a] px-2 py-0.5 text-xs font-semibold text-white">{badge}</span>}
			</button>
		);
	}
	return (
		<Link to="/services" className={cls}>
			<FontAwesomeIcon icon={icon} className={active ? "text-[#ff6b1a]" : "text-slate-500"} />
			<span>{label}</span>
			{badge && <span className="ml-auto rounded-full bg-[#ff6b1a] px-2 py-0.5 text-xs font-semibold text-white">{badge}</span>}
		</Link>
	);
}

// SummaryCard: one of the 4 stat cards on the dashboard
// Props: accent (color), icon, title, count, linkText
// 👉 API: "count" prop should be dynamic from GET /api/customer/dashboard-summary
function SummaryCard({ accent, icon, title, count, linkText }) {
	const s = {
		orange: { iconWrap: "bg-[#fff4ee] text-[#ff6b1a]", link: "text-[#ff6b1a]" },
		green: { iconWrap: "bg-[#edf9f0] text-[#16a34a]", link: "text-[#16a34a]" },
		blue: { iconWrap: "bg-[#edf3ff] text-[#2563eb]", link: "text-[#2563eb]" },
		violet: { iconWrap: "bg-[#f5edff] text-[#a855f7]", link: "text-[#a855f7]" },
	};
	return (
		<article className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
			<div className="flex items-start gap-4">
				<div className={`flex h-16 w-16 items-center justify-center rounded-full ${s[accent].iconWrap}`}>
					<FontAwesomeIcon icon={icon} className="text-2xl" />
				</div>
				<div className="min-w-0">
					<p className="text-sm text-slate-500">{title}</p>
					<p className="mt-1 text-3xl font-semibold text-slate-900">{count}</p>
					<Link to="/services" className={`mt-2 inline-flex items-center gap-2 text-sm font-medium ${s[accent].link}`}>
						{linkText} <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
					</Link>
				</div>
			</div>
		</article>
	);
}

// ActionCard: quick action button card (used in the old Quick Actions section — kept for reuse)
// Props: accent, icon, title, desc
function ActionCard({ accent, icon, title, desc }) {
	const s = { orange: "bg-[#fff4ee] text-[#ff6b1a]", green: "bg-[#edf9f0] text-[#16a34a]", blue: "bg-[#edf3ff] text-[#2563eb]", violet: "bg-[#f5edff] text-[#a855f7]" };
	return (
		<article className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 transition hover:shadow-sm">
			<div className={`flex h-12 w-12 items-center justify-center rounded-full ${s[accent]}`}>
				<FontAwesomeIcon icon={icon} className="text-xl" />
			</div>
			<p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
			<p className="mt-1 text-sm leading-5 text-slate-500">{desc}</p>
			<button className="mt-5 ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100">
				<FontAwesomeIcon icon={faArrowRight} />
			</button>
		</article>
	);
}

// StatsCard: mini stat card in the Profile page Account Overview
// Props: icon, title, value, color
// 👉 API: "value" should come from GET /api/customer/profile
function StatsCard({ icon, title, value, color }) {
	const s = {
		orange: { bg: "bg-[#fff4ee]", text: "text-[#ff6b1a]" },
		green: { bg: "bg-[#edf9f0]", text: "text-[#16a34a]" },
		blue: { bg: "bg-[#edf3ff]", text: "text-[#2563eb]" },
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

// InfoRow: a label + value row used in the Personal Information card
// No API needed — receives data as props
function InfoRow({ label, value }) {
	return (
		<div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
			<p className="text-sm text-slate-500">{label}</p>
			<p className="text-sm font-medium text-slate-900">{value}</p>
		</div>
	);
}

// SecurityRow: a row in the Security card on the Profile page
// No API needed — receives data as props
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

// RepairDetailRow: a label + value row in the Repair Details section
// No API needed — receives data as props
function RepairDetailRow({ label, value }) {
	return (
		<div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
			<p className="text-sm font-semibold text-slate-700">{label}</p>
			<p className="text-sm text-slate-900">{value}</p>
		</div>
	);
}

// PageFooter: simple copyright + version footer shown on every page
// No API needed — static content
function PageFooter() {
	return (
		<footer className="flex flex-col gap-2 py-1 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
			<p>© 2026 FixGo. All rights reserved.</p>
			<p>Version 1.0.0</p>
		</footer>
	);
}

export default Customer;
