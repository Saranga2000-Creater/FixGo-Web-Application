import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell,
    faCar,
    faCarSide,
    faClock,
    faGear,
    faStar,
    faUser,
} from "@fortawesome/free-solid-svg-icons";

const T = {
    green:     "#16A34A",
    greenLight:"#F0FDF4",
    slate900:  "#111827",
    slate700:  "#374151",
    slate500:  "#6B7280",
    slate400:  "#9CA3AF",
    slate100:  "#F3F4F6",
    white:     "#FFFFFF",
    font:      "'Segoe UI', system-ui, sans-serif",
};

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
                borderLeft: active ? `4px solid ${T.green}` : "4px solid transparent",
                cursor: "pointer",
                background: active ? T.greenLight : "transparent",
                color: active ? T.green : T.slate700,
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                textAlign: "left",
                fontFamily: T.font,
                transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.slate100; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
        >
            <FontAwesomeIcon
                icon={icon}
                style={{ fontSize: 16, color: active ? T.green : T.slate500 }}
            />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
                <span style={{
                    background: T.green,
                    color: T.white,
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

function CustomerSidebar({ currentPage, setCurrentPage }) {
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
            display: "flex",
            flexDirection: "column",
            background: T.white,
            borderRight: `1px solid ${T.slate100}`,
            boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
            height: "calc(100vh - 65px)",
            position: "fixed",
            top: 65,
            left: 0,
            zIndex: 50,
            overflowY: "auto",
        }}>
            {/* Profile header */}
            <div style={{
                padding: "20px 16px 16px",
                borderBottom: `1px solid ${T.slate100}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
            }}>
                <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: T.slate900,
                    flexShrink: 0,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                        color: T.slate900,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                        {customer?.name || "Customer"}
                    </div>
                    <div style={{ fontSize: 12, color: T.slate500, marginTop: 2 }}>Customer</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, display: "inline-block" }} />
                        <span style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>Active</span>
                    </div>
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
        </aside>
    );
}

export default CustomerSidebar;
