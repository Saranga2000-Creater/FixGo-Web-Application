// ============================================================
// FILE: Notification.jsx
// PURPOSE: Notifications page — tabbed list of alerts & updates.
//
// 👉 API: GET /api/customer/notifications?filter=all   (initial load)
// 👉 API: GET /api/customer/notifications?filter=unread (on tab switch)
// 👉 API: GET /api/customer/notifications/counts
//         Response: { all, unread, repair, appt, offers, system }
// 👉 API: POST /api/customer/notifications/mark-all-read
// 👉 API: POST /api/reviews { repairId, rating, comment }
//         → called from "Review & Rate" button
// ============================================================

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faBell,
	faCalendarDays,
	faCar,
	faCheck,
	faCircleCheck,
	faStar,
	faTag,
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

// ── NOTIF_TABS static data ────────────────────────────────────
// 👉 API: count values → GET /api/customer/notifications/counts
const NOTIF_TABS = [
	{ key: "all",    label: "All",             count: 3 },
	{ key: "unread", label: "Unread",          count: 3 },
	{ key: "repair", label: "Repair Updates",  count: 2 },
	{ key: "appt",   label: "Appointments",    count: 1 },
	{ key: "offers", label: "Offers",          count: 0 },
	{ key: "system", label: "System",          count: 0 },
];

// ── NOTIFICATIONS static data ─────────────────────────────────
// 👉 API: Replace with data from GET /api/customer/notifications
const NOTIFICATIONS = [
	{
		id: 1,
		icon: faCar,
		iconBg: "bg-[#fff4ee]",
		iconColor: "text-[#ff6b1a]",
		title: "Repair status updated",
		desc: "Your repair request FXG-001 has been accepted by Advanced Auto Service Center.",
		tag: "Repair ID: FXG-001",
		tagBg: "bg-slate-100 text-slate-600",
		time: "Today, 10:28 AM",
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
		titleBadge: "Completed",
		desc: "Great news! Your vehicle repair (FXG-001) has been completed and is ready for pickup.",
		tag: null,
		time: "Yesterday, 04:45 PM",
		unread: true,
		extra: "review",
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

// ── Notification (page) ───────────────────────────────────────
function Notification() {
	// 👉 API: When activeTab changes, re-fetch with new filter
	const [activeTab, setActiveTab] = useState("all");

	// Client-side filtering — remove once backend sends pre-filtered data
	const filtered = NOTIFICATIONS.filter((n) => {
		if (activeTab === "all")    return true;
		if (activeTab === "unread") return n.unread;
		if (activeTab === "repair") return n.icon === faCar || n.icon === faCircleCheck;
		if (activeTab === "appt")   return n.icon === faCalendarDays || n.icon === faBell;
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

			{/* Tabs + Mark all as read */}
			<section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap gap-2">
					{/* 👉 API: tab.count from GET /api/customer/notifications/counts */}
					{NOTIF_TABS.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
								activeTab === tab.key
									? "border-[#ff6b1a] bg-[#fff4ee] text-[#ff6b1a]"
									: "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
							}`}
						>
							{tab.label} ({tab.count})
						</button>
					))}
				</div>
				{/* 👉 API: POST /api/customer/notifications/mark-all-read */}
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
									{/* Icon */}
									<div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${notif.iconBg}`}>
										<FontAwesomeIcon icon={notif.icon} className={`text-xl ${notif.iconColor}`} />
									</div>
									<div className="flex-1 min-w-0">
										{/* Title + optional badge */}
										<div className="flex flex-wrap items-center gap-2">
											<p className="text-sm font-semibold text-slate-900">{notif.title}</p>
											{notif.titleBadge && (
												<span className="rounded-full bg-[#edf9f0] px-3 py-0.5 text-xs font-medium text-[#16a34a]">
													{notif.titleBadge}
												</span>
											)}
										</div>
										{/* Description */}
										<p className="mt-1 text-sm text-slate-600">{notif.desc}</p>
										{/* Optional tag */}
										{notif.tag && (
											<span className={`mt-2 inline-block rounded-lg px-3 py-1 text-xs font-medium ${notif.tagBg}`}>
												{notif.tag}
											</span>
										)}
										{/* Review & Rate prompt — shown for completed repairs
										    👉 API: POST /api/reviews { repairId, rating, comment } */}
										{notif.extra === "review" && (
											<div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 bg-[#f5edff]/40 px-4 py-3">
												<div className="flex items-center gap-3">
													<FontAwesomeIcon icon={faStar} className="text-[#a855f7]" />
													<div>
														<p className="text-sm font-semibold text-slate-900">We&apos;d love to hear about your experience!</p>
														<p className="text-xs text-slate-500">Your feedback helps us improve our services.</p>
													</div>
												</div>
												<button className="ml-4 flex shrink-0 items-center gap-2 rounded-xl bg-[#a855f7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9333ea]">
													<FontAwesomeIcon icon={faStar} className="text-xs" />
													Review & Rate
													<FontAwesomeIcon icon={faArrowRight} className="text-xs" />
												</button>
											</div>
										)}
									</div>
									{/* Timestamp + unread dot */}
									<div className="flex shrink-0 flex-col items-end gap-2">
										{/* 👉 API: Replace with formatted notif.createdAt */}
										<span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
										{/* 👉 API: notif.unread from backend */}
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

export default Notification;
