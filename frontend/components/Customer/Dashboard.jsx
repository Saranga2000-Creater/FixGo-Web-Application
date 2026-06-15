// ============================================================
// FILE: Dashboard.jsx
// PURPOSE: Dashboard page — greeting, date, and 4 summary stat cards.
//
// 👉 API: GET /api/customer/dashboard-summary
//         Response: { activeRepairs, completedRepairs,
//                     upcomingAppointments, unreadNotifications }
// ============================================================

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faBell,
	faCalendarCheck,
	faCalendarDays,
	faCircleCheck,
	faCircleInfo,
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

// ── SummaryCard ───────────────────────────────────────────────
// 👉 API: "count" prop should be dynamic from GET /api/customer/dashboard-summary
function SummaryCard({ accent, icon, title, count, linkText }) {
	const s = {
		orange: { iconWrap: "bg-[#fff4ee] text-[#ff6b1a]", link: "text-[#ff6b1a]" },
		green:  { iconWrap: "bg-[#edf9f0] text-[#16a34a]", link: "text-[#16a34a]" },
		blue:   { iconWrap: "bg-[#edf3ff] text-[#2563eb]", link: "text-[#2563eb]" },
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

// ── Dashboard (page) ──────────────────────────────────────────
function Dashboard() {
	return (
		<div className="space-y-5">

			{/* Header */}
			<section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					{/* 👉 API: Replace "Irushi" with the logged-in customer's first name */}
					<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Good evening, Irushi! 👋</h1>
					<p className="mt-2 text-sm text-slate-500">Here&apos;s what&apos;s happening with your vehicle services.</p>
				</div>
				{/* 👉 API: Replace with new Date().toLocaleDateString() */}
				<div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
					<span>May 25, 2026</span>
					<FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
				</div>
			</section>

			{/* Summary cards
			    👉 API: Each count value comes from GET /api/customer/dashboard-summary */}
			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{/* 👉 API: Replace "2" with dashboardData.activeRepairs */}
				<SummaryCard accent="orange" icon={faCircleInfo}    title="Active Repairs"          count="2" linkText="View details" />
				{/* 👉 API: Replace "5" with dashboardData.completedRepairs */}
				<SummaryCard accent="green"  icon={faCircleCheck}   title="Completed Repairs"       count="5" linkText="View history" />
				{/* 👉 API: Replace "1" with dashboardData.upcomingAppointments */}
				<SummaryCard accent="blue"   icon={faCalendarCheck} title="Upcoming Appointments"   count="1" linkText="View calendar" />
				{/* 👉 API: Replace "3" with dashboardData.unreadNotifications */}
				<SummaryCard accent="violet" icon={faBell}          title="Notifications"           count="3" linkText="View all" />
			</section>

			<PageFooter />
		</div>
	);
}

export default Dashboard;
