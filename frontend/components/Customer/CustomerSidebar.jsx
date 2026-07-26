import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faCar, faCarSide, faClock, faGear, faStar, faUser,
} from "@fortawesome/free-solid-svg-icons";
import { api, UPLOADS_URL } from "../../src/services/api";


function SidebarLink({ active = false, icon, label, badge, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] border-0 cursor-pointer text-sm text-left transition-all duration-150 ease-in-out
                ${active
                    ? "border-l-4 border-l-green-600 bg-green-50 text-green-600 font-bold"
                    : "border-l-4 border-l-transparent bg-transparent text-gray-700 font-medium hover:bg-gray-100"
                }`}
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
            <FontAwesomeIcon icon={icon} className={`text-base ${active ? "text-green-600" : "text-gray-500"}`} />
            <span className="flex-1">{label}</span>
            {badge > 0 && (
                <span className="bg-green-600 text-white rounded-full text-[11px] font-bold py-0.5 px-[7px] min-w-[20px] text-center leading-normal animate-pulse-custom">
                    {badge > 99 ? "99+" : badge}
                </span>
            )}
        </button>
    );
}

function CustomerSidebar({ currentPage, setCurrentPage, unreadCount = 0 }) {
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        api.get("getCustomerProfile.php")
            .then(data => { if (data.success) setCustomer(data); })
            .catch(() => {});
    }, []);


    // Strip out quotes and old IPs
    const cleanProfilePhoto = customer?.profilePhoto ? customer.profilePhoto.replace(/['"]/g, '') : null;
    let avatarSrc = `https://ui-avatars.com/api/?background=16a34a&color=fff&name=${encodeURIComponent(customer?.name || "Customer")}`;

    if (cleanProfilePhoto) {
        if (cleanProfilePhoto.startsWith("http")) {
            try {
                const urlObj = new URL(cleanProfilePhoto);
                avatarSrc = `${UPLOADS_URL}${urlObj.pathname}`;
            } catch (error) {
                avatarSrc = cleanProfilePhoto;
            }
        } else {
            avatarSrc = `${UPLOADS_URL}/${cleanProfilePhoto.replace(/^\//, '')}`;
        }
    }

    return (
        <>
            <style>{`
                @keyframes pulse-custom {
                    0%, 100% { transform: scale(1); }
                    50%       { transform: scale(1.15); }
                }
                .animate-pulse-custom {
                    animation: pulse-custom 2s infinite;
                }
            `}</style>
            <aside
                className="w-60 flex flex-col bg-white border-r border-gray-100 fixed top-[65px] left-0 z-50 overflow-y-auto"
                style={{ height: "calc(100vh - 65px)", boxShadow: "4px 0 24px rgba(0,0,0,0.08)" }}
            >
                <div className="py-5 px-4 pb-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-900 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <img src={avatarSrc} alt={customer?.name || "Customer"} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                        <div
                            className="font-bold text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                            {customer?.name || "Customer"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">Customer</div>
                        <div className="flex items-center gap-[5px] mt-[3px]">
                            <span className="w-[7px] h-[7px] rounded-full bg-green-600 inline-block" />
                            <span className="text-[11px] text-green-600 font-semibold">Active</span>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 py-3 px-2 overflow-y-auto">
                    <SidebarLink active={currentPage === "dashboard"}     icon={faCarSide} label="Dashboard"         onClick={() => setCurrentPage("dashboard")} />
                    <SidebarLink active={currentPage === "profile"}       icon={faUser}    label="My Profile"        onClick={() => setCurrentPage("profile")} />
                    <SidebarLink active={currentPage === "repair"}        icon={faCar}     label="Repair Status"     onClick={() => setCurrentPage("repair")} />
                    <SidebarLink active={currentPage === "history"}       icon={faClock}   label="Service History"   onClick={() => setCurrentPage("history")} />
                    <SidebarLink active={currentPage === "reviews"}       icon={faStar}    label="Reviews & Ratings" onClick={() => setCurrentPage("reviews")} />
                    <SidebarLink
                        active={currentPage === "notifications"}
                        icon={faBell}
                        label="Notifications"
                        badge={unreadCount}
                        onClick={() => setCurrentPage("notifications")}
                    />
                    <SidebarLink active={currentPage === "settings"} icon={faGear} label="Settings" onClick={() => setCurrentPage("settings")} />
                </nav>
            </aside>
        </>
    );
}

export default CustomerSidebar;