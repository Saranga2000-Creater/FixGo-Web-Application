// ============================================================
// FILE: ServiceHistory.jsx
// PURPOSE: Service History page — vehicle summary + past repair records.
//
// 👉 API: GET /api/customer/service-history?filter=alltime
//         When filter changes → re-fetch with new query param
// 👉 API: GET /api/customer/vehicle
//         → vehicleName, vehiclePlate, year, color, vin, mileage, imageUrl
// 👉 API: "View Details" → GET /api/repairs/:id
// ============================================================

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faCalendarDays,
	faChevronDown,
	faClipboardList,
	faMapPin,
	faOilCan,
	faRotate,
	faWrench,
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

// ── ACCENT_STYLES ─────────────────────────────────────────────
const ACCENT_STYLES = {
	green:  { bg: "bg-[#edf9f0]", text: "text-[#16a34a]", btn: "border-[#16a34a] text-[#16a34a] hover:bg-[#edf9f0]", dot: "bg-[#16a34a]", badge: "bg-[#edf9f0] text-[#16a34a]" },
	blue:   { bg: "bg-[#edf3ff]", text: "text-[#2563eb]", btn: "border-[#2563eb] text-[#2563eb] hover:bg-[#edf3ff]", dot: "bg-[#2563eb]", badge: "bg-[#edf3ff] text-[#2563eb]" },
	orange: { bg: "bg-[#fff4ee]", text: "text-[#ff6b1a]", btn: "border-[#ff6b1a] text-[#ff6b1a] hover:bg-[#fff4ee]", dot: "bg-[#ff6b1a]", badge: "bg-[#fff4ee] text-[#ff6b1a]" },
	violet: { bg: "bg-[#f5edff]", text: "text-[#a855f7]", btn: "border-[#a855f7] text-[#a855f7] hover:bg-[#f5edff]", dot: "bg-[#a855f7]", badge: "bg-[#f5edff] text-[#a855f7]" },
	yellow: { bg: "bg-[#fffbeb]", text: "text-[#d97706]", btn: "border-[#d97706] text-[#d97706] hover:bg-[#fffbeb]", dot: "bg-[#d97706]", badge: "bg-[#fffbeb] text-[#d97706]" },
};

// ── SERVICE_RECORDS static data ───────────────────────────────
// 👉 API: Replace with data from GET /api/customer/service-history
const SERVICE_RECORDS = [
	{ id: 1, title: "Engine Overheating",    date: "May 25, 2026", time: "10:30 AM", shop: "Advanced Auto Service Center", status: "Completed", icon: faWrench,       accent: "green" },
	{ id: 2, title: "Brake Pad Replacement", date: "Mar 12, 2026", time: "02:15 PM", shop: "QuickFix Auto Care",           status: "Completed", icon: faClipboardList, accent: "blue" },
	{ id: 3, title: "Oil Change & Filter",   date: "Jan 18, 2026", time: "11:00 AM", shop: "Advanced Auto Service Center", status: "Completed", icon: faOilCan,        accent: "orange" },
	{ id: 4, title: "General Checkup",       date: "Nov 05, 2025", time: "09:30 AM", shop: "AutoCare Plus",                status: "Completed", icon: faClipboardList, accent: "violet" },
	{ id: 5, title: "Tyre Rotation",         date: "Aug 20, 2025", time: "04:00 PM", shop: "QuickFix Auto Care",           status: "Completed", icon: faRotate,        accent: "yellow" },
];

// ── ServiceHistory (page) ─────────────────────────────────────
function ServiceHistory() {
	// 👉 API: When filter changes, re-fetch with GET /api/customer/service-history?filter=...
	const [filter, setFilter] = useState("All Time");

	return (
		<div className="space-y-5">
			<section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Service History</h1>
					<p className="mt-2 text-sm text-slate-500">View your past vehicle services and repair details.</p>
				</div>
				{/* Filter dropdown
				    👉 API: On change → GET /api/customer/service-history?filter=last3months */}
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
			    👉 API: GET /api/customer/vehicle */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
				<div className="flex items-center gap-5">
					{/* 👉 API: Replace src with vehicle.imageUrl */}
					<img
						src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=200&q=80"
						alt="Toyota Prius"
						className="h-20 w-32 rounded-xl object-cover"
					/>
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
			    👉 API: Replace SERVICE_RECORDS with API data and .map() */}
			<section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
				{SERVICE_RECORDS.map((record, idx) => {
					const a = ACCENT_STYLES[record.accent];
					const isLast = idx === SERVICE_RECORDS.length - 1;
					return (
						<div key={record.id} className={`flex items-center gap-4 px-6 py-5 ${!isLast ? "border-b border-slate-100" : ""}`}>
							{/* Timeline dot */}
							<div className="flex flex-col items-center self-stretch">
								<div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${a.dot}`} />
								{!isLast && <div className="mt-1 w-px flex-1 bg-slate-100" />}
							</div>
							{/* Icon */}
							<div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${a.bg}`}>
								<FontAwesomeIcon icon={record.icon} className={`text-xl ${a.text}`} />
							</div>
							{/* Info */}
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
							{/* View Details button
							    👉 API: GET /api/repairs/:record.id */}
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

export default ServiceHistory;
