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
            ? "border-l-4 border-[#16a34a] bg-[#16a34a]/10 font-medium text-[#16a34a]"
            : "text-[#274c3a] hover:bg-[#16a34a]/5"
    }`;

    return (
        <button onClick={onClick} className={cls}>
            <FontAwesomeIcon icon={icon} className={active ? "text-[#16a34a]" : "text-[#274c3a]/60"} />
            <span>{label}</span>
            {badge && (
                <span className="ml-auto rounded-full bg-[#16a34a] px-2 py-0.5 text-xs font-semibold text-white">
                    {badge}
                </span>
            )}
        </button>
    );
}

// ── CustomerSidebar ───────────────────────────────────────────
function CustomerSidebar({ currentPage, setCurrentPage, onLogout }) {
    return (
        <aside className="hidden w-[260px] shrink-0 border-r border-[#d1e7d7] bg-white lg:flex lg:flex-col overflow-y-auto">
            <div className="px-4 py-5">

                {/* User profile card */}
                <div className="rounded-[28px] border border-[#d1e7d7] bg-white px-4 py-5 shadow-[0_4px_12px_rgb(22,163,74,0.08)]">
                    <div className="flex items-center gap-3">
                        {/* 👉 API: Replace src with customer.avatarUrl */}
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"
                            alt="Irushi An."
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-[#16a34a]/20"
                        />
                        <div>
                            {/* 👉 API: Replace with customer.name */}
                            <p className="text-sm font-semibold text-[#14532d]">Irushi An.</p>
                            <p className="text-xs text-[#274c3a]/60">Customer</p>
                            <div className="mt-1 flex items-center gap-1 text-xs text-[#274c3a]/60">
                                {/* 👉 API: Replace with customer.averageRating and customer.reviewCount */}
                                <span className="font-semibold text-[#16a34a]">4.8</span>
                                <span className="text-amber-400">★</span>
                                <span>(12 reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-6 space-y-1 text-sm font-mono">
                    <SidebarLink active={currentPage === "dashboard"}     icon={faCarSide} label="Dashboard"         onClick={() => setCurrentPage("dashboard")} />
                    <SidebarLink active={currentPage === "profile"}       icon={faUser}    label="My Profile"        onClick={() => setCurrentPage("profile")} />
                    <SidebarLink active={currentPage === "repair"}        icon={faCar}     label="Repair Status"     onClick={() => setCurrentPage("repair")} />
                    <SidebarLink active={currentPage === "history"}       icon={faClock}   label="Service History"   onClick={() => setCurrentPage("history")} />
                    <SidebarLink active={currentPage === "reviews"}       icon={faStar}    label="Reviews & Ratings" onClick={() => setCurrentPage("reviews")} />
                    {/* API: badge="3" → replace with real unread count from GET /api/customer/notifications/unread-count */}
                    <SidebarLink active={currentPage === "notifications"} icon={faBell}    label="Notifications"     badge="3" onClick={() => setCurrentPage("notifications")} />
                    <SidebarLink active={currentPage === "settings"}      icon={faGear}    label="Settings"          onClick={() => setCurrentPage("settings")} />
                </nav>
            </div>

            {/* Logout */}
            <div className="mt-auto px-4 pb-5">
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[#274c3a] transition hover:bg-[#16a34a]/5 font-mono text-sm"
                >
                    <FontAwesomeIcon icon={faArrowRight} className="rotate-180 text-[#274c3a]/60" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default CustomerSidebar;