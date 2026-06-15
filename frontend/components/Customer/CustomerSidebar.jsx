// ============================================================
// FILE: CustomerSidebar.jsx
// PURPOSE: Left sidebar — shows user avatar, name, rating,
//          and navigation links to each page.
//
// Props:
//   currentPage   (string)   – currently active page key
//   setCurrentPage (fn)      – switches the active page
//   onLogout      (fn)       – called when Logout is clicked
//
// 👉 API: GET /api/customer/profile
//         → name, avatarUrl, averageRating, reviewCount
// ============================================================

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faBell,
	faCar,
	faCarSide,
	faClock,
	faGear,
	faStar,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

// ── SidebarLink: single nav item ──────────────────────────────
function SidebarLink({ active = false, icon, label, badge, onClick }) {
	const cls = `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
		active
			? "border-l-4 border-[#ff6b1a] bg-[#fff4ee] font-medium text-[#ff6b1a]"
			: "text-slate-700 hover:bg-slate-50"
	}`;

	return (
		<button onClick={onClick} className={cls}>
			<FontAwesomeIcon icon={icon} className={active ? "text-[#ff6b1a]" : "text-slate-500"} />
			<span>{label}</span>
			{badge && (
				<span className="ml-auto rounded-full bg-[#ff6b1a] px-2 py-0.5 text-xs font-semibold text-white">
					{badge}
				</span>
			)}
		</button>
	);
}

// ── CustomerSidebar ───────────────────────────────────────────
function CustomerSidebar({ currentPage, setCurrentPage, onLogout }) {
	return (
		<aside className="hidden w-[260px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col overflow-y-auto">
			<div className="px-4 py-5">

				{/* User profile card */}
				<div className="rounded-[28px] border border-slate-200 bg-white px-4 py-5 shadow-sm">
					<div className="flex items-center gap-3">
						{/* 👉 API: Replace src with customer.avatarUrl */}
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

				{/* Navigation */}
				<nav className="mt-6 space-y-1 text-sm">
					<SidebarLink active={currentPage === "dashboard"}     icon={faCarSide} label="Dashboard"        onClick={() => setCurrentPage("dashboard")} />
					<SidebarLink active={currentPage === "profile"}       icon={faUser}    label="My Profile"       onClick={() => setCurrentPage("profile")} />
					<SidebarLink active={currentPage === "repair"}        icon={faCar}     label="Repair Status"    onClick={() => setCurrentPage("repair")} />
					<SidebarLink active={currentPage === "history"}       icon={faClock}   label="Service History"  onClick={() => setCurrentPage("history")} />
					<SidebarLink active={currentPage === "reviews"}       icon={faStar}    label="Reviews & Ratings" onClick={() => setCurrentPage("reviews")} />
					{/* 👉 API: badge="3" → replace with real unread count from GET /api/customer/notifications/unread-count */}
					<SidebarLink active={currentPage === "notifications"} icon={faBell}    label="Notifications"    badge="3" onClick={() => setCurrentPage("notifications")} />
					<SidebarLink active={currentPage === "settings"}      icon={faGear}    label="Settings"         onClick={() => setCurrentPage("settings")} />
				</nav>
			</div>

			{/* Logout */}
			<div className="mt-auto px-4 pb-5">
				<button
					onClick={onLogout}
					className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
				>
					<FontAwesomeIcon icon={faArrowRight} className="rotate-180 text-slate-500" />
					<span>Logout</span>
				</button>
			</div>
		</aside>
	);
}

export default CustomerSidebar;
