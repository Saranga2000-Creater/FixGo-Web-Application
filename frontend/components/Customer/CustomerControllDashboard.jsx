import { useState } from "react";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import RepairStatus from "./RepairStatus";
import ServiceHistory from "./ServiceHistory";
import ReviewsRatings from "./ReviewsRatings";
import Notification, { useUnreadCount } from "./Notification";
import Settings from "./Settings";
import CustomerSidebar from "./CustomerSidebar";

function getCustomerIdFromToken() {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const id = payload.user_id || payload.id || null;
        return id ? String(id) : null;
    } catch {
        return null;
    }
}

function CustomerControllDashboard() {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const customerId = getCustomerIdFromToken();
    const unreadCount = useUnreadCount(customerId);

    return (
        <div style={{
            minHeight: "100vh",
            background: "#F4F8F5",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            color: "#111827",
        }}>
            <CustomerSidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                unreadCount={unreadCount}
            />

            <main style={{
                marginLeft: 240,
                minHeight: "calc(100vh - 65px)",
                padding: "24px",
                boxSizing: "border-box",
            }}>
                <div style={{ maxWidth: 1180, margin: "0 auto" }}>
                    {currentPage === "dashboard" && (
                        <Dashboard
                            customerId={customerId}
                            onNavigate={setCurrentPage}
                        />
                    )}
                    {currentPage === "profile"       && <Profile        customerId={customerId} />}
                    {currentPage === "repair"        && <RepairStatus   customerId={customerId} />}
                    {currentPage === "history"       && <ServiceHistory customerId={customerId} />}
                    {currentPage === "reviews"       && <ReviewsRatings customerId={customerId} />}
                    {currentPage === "notifications" && <Notification   customerId={customerId} />}
                    {currentPage === "settings"      && <Settings       customerId={customerId} />}
                </div>
            </main>
        </div>
    );
}

export default CustomerControllDashboard;