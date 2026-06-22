import { useState, useEffect } from "react";
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

function SidebarLink({ active = false, icon, label, badge, onClick }) {
    const cls = `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        active
            ? "border-l-4 border-[#16a34a] bg-[#f0fdf4] font-medium text-[#16a34a]"
            : "text-slate-700 hover:bg-slate-50"
    }`;

    return (
        <button onClick={onClick} className={cls}>
            <FontAwesomeIcon icon={icon} className={active ? "text-[#16a34a]" : "text-slate-500"} />
            <span>{label}</span>
            {badge && (
                <span className="ml-auto rounded-full bg-[#16a34a] px-2 py-0.5 text-xs font-semibold text-white">
                    {badge}
                </span>
            )}
        </button>
    );
}

function CustomerSidebar({ currentPage, setCurrentPage, onLogout }) {
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        fetch("http://localhost:8000/api/getCustomerProfile.php", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => res.json())
            .then((data) => { if (data.success) setCustomer(data); })
            .catch(() => {});
    }, []);

    const avatarSrc = customer?.profilePhoto
        ? customer.profilePhoto
        : `https://ui-avatars.com/api/?background=16a34a&color=fff&name=${encodeURIComponent(customer?.name || "Customer")}`;

    return (
        <aside
            className="hidden w-[260px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col"
            style={{ position: "sticky", top: 0, height: "100vh", overflowY: "auto", flexShrink: 0 }}
        >
            <div className="px-4 py-5">

                {/* Profile card */}
                <div className="rounded-[28px] border border-slate-200 bg-white px-4 py-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <img
                            src={avatarSrc}
                            alt={customer?.name || "Customer"}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-[#16a34a]/20"
                        />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                {customer?.name || "..."}
                            </p>
                            <p className="text-xs text-slate-500">Customer</p>
                            <div className="mt-1 flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
                                <span className="text-xs text-[#16a34a] font-medium">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav — no font-mono */}
                <nav className="mt-6 space-y-1">
                    <SidebarLink active={currentPage === "dashboard"}     icon={faCarSide} label="Dashboard"         onClick={() => setCurrentPage("dashboard")} />
                    <SidebarLink active={currentPage === "profile"}       icon={faUser}    label="My Profile"        onClick={() => setCurrentPage("profile")} />
                    <SidebarLink active={currentPage === "repair"}        icon={faCar}     label="Repair Status"     onClick={() => setCurrentPage("repair")} />
                    <SidebarLink active={currentPage === "history"}       icon={faClock}   label="Service History"   onClick={() => setCurrentPage("history")} />
                    <SidebarLink active={currentPage === "reviews"}       icon={faStar}    label="Reviews & Ratings" onClick={() => setCurrentPage("reviews")} />
                    <SidebarLink active={currentPage === "notifications"} icon={faBell}    label="Notifications"     onClick={() => setCurrentPage("notifications")} />
                    <SidebarLink active={currentPage === "settings"}      icon={faGear}    label="Settings"          onClick={() => setCurrentPage("settings")} />
                </nav>
            </div>

            {/* Logout */}
            <div className="mt-auto px-4 pb-5">
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                    <FontAwesomeIcon icon={faArrowRight} className="rotate-180 text-slate-500" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default CustomerSidebar;