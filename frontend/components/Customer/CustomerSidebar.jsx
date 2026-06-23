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
    return (
        <button
            onClick={onClick}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: active ? "#F0FDF4" : "transparent",
                color: active ? "#16A34A" : "#374151",
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                textAlign: "left",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                transition: "background 0.2s",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F4F8F5"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
        >
            <span style={{
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                color: active ? "#16A34A" : "#6B7280",
            }}>
                <FontAwesomeIcon icon={icon} />
            </span>
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
                <span style={{
                    background: "#16A34A",
                    color: "#fff",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 7px",
                    minWidth: 20,
                    textAlign: "center",
                    lineHeight: 1.5,
                }}>
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
        <aside style={{
            width: 240,
            height: "calc(100vh - 50px)",
            background: "#FFFFFF",
            borderRight: "1px solid #F3F4F6",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            boxShadow: "4px 0 24px rgba(0,0,0,0.10)",
        }}>

            {/* Profile header */}
            <div style={{
                padding: "20px 16px 16px",
                borderBottom: "1px solid #F3F4F6",
                display: "flex",
                alignItems: "center",
                gap: 12,
            }}>
                <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#1F2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                }}>
                    <img
                        src={avatarSrc}
                        alt={customer?.name || "Customer"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                        {customer?.name || "Customer"}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>Customer</div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
                <SidebarLink active={currentPage === "dashboard"}     icon={faCarSide} label="Dashboard"         onClick={() => setCurrentPage("dashboard")} />
                <SidebarLink active={currentPage === "profile"}       icon={faUser}    label="My Profile"        onClick={() => setCurrentPage("profile")} />
                <SidebarLink active={currentPage === "repair"}        icon={faCar}     label="Repair Status"     onClick={() => setCurrentPage("repair")} />
                <SidebarLink active={currentPage === "history"}       icon={faClock}   label="Service History"   onClick={() => setCurrentPage("history")} />
                <SidebarLink active={currentPage === "reviews"}       icon={faStar}    label="Reviews & Ratings" onClick={() => setCurrentPage("reviews")} />
                <SidebarLink active={currentPage === "notifications"} icon={faBell}    label="Notifications"     onClick={() => setCurrentPage("notifications")} />
                <SidebarLink active={currentPage === "settings"}      icon={faGear}    label="Settings"          onClick={() => setCurrentPage("settings")} />
            </nav>

            {/* Logout */}
            <div style={{ padding: "12px 8px", borderTop: "1px solid #F3F4F6" }}>
                <button
                    onClick={onLogout}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        background: "transparent",
                        color: "#6B7280",
                        fontWeight: 500,
                        fontSize: 14,
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F4F8F5"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    <FontAwesomeIcon
                        icon={faArrowRight}
                        style={{ transform: "rotate(180deg)", fontSize: 16 }}
                    />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}

export default CustomerSidebar;
