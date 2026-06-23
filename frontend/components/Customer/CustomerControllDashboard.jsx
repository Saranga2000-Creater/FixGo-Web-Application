import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import RepairStatus from "./RepairStatus";
import ServiceHistory from "./ServiceHistory";
import ReviewsRatings from "./ReviewsRatings";
import Notification from "./Notification";
import Settings from "./Settings";
import CustomerSidebar from "./CustomerSidebar";

// Helper: decode JWT payload without a library
function getCustomerIdFromToken() {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user_id || payload.id || null;
    } catch {
        return null;
    }
}

function CustomerControllDashboard() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState("dashboard");

    const customerId = getCustomerIdFromToken();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                background: "#F4F8F5",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
            }}
        >
            {/* Main Content Area */}
            <div style={{ display: "flex", flex: 1 }}>
                <CustomerSidebar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    onLogout={() => {
                        localStorage.clear();
                        navigate("/");
                    }}
                />

                <main
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "16px 24px",
                        boxSizing: "border-box",
                        background: "#F4F8F5",
                    }}
                >
                    <div
                        style={{
                            maxWidth: 1180,
                            width: "100%",
                            margin: "0 auto",
                        }}
                    >
                        {currentPage === "dashboard"     && <Dashboard      customerId={customerId} />}
                        {currentPage === "profile"       && <Profile         customerId={customerId} />}
                        {currentPage === "repair"        && <RepairStatus    customerId={customerId} />}
                        {currentPage === "history"       && <ServiceHistory  customerId={customerId} />}
                        {currentPage === "reviews"       && <ReviewsRatings  customerId={customerId} />}
                        {currentPage === "notifications" && <Notification    customerId={customerId} />}
                        {currentPage === "settings"      && <Settings        customerId={customerId} />}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CustomerControllDashboard;
