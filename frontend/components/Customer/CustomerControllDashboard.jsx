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
import { Footer } from "../../components/Footer";

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
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f0f7f2", color: "#0f172a" }}>

            <div style={{ display: "flex", flex: 1 }}>

                <CustomerSidebar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    onLogout={() => { localStorage.clear(); navigate("/"); }}
                />

                <main style={{ flex: 1, overflowY: "auto" }}>
                    <div className="px-4 py-5 md:px-6 lg:px-8">
                        <div className="mx-auto max-w-[1180px] w-full">
                            {currentPage === "dashboard"     && <Dashboard      customerId={customerId} />}
                            {currentPage === "profile"       && <Profile         customerId={customerId} />}
                            {currentPage === "repair"        && <RepairStatus    customerId={customerId} />}
                            {currentPage === "history"       && <ServiceHistory  customerId={customerId} />}
                            {currentPage === "reviews"       && <ReviewsRatings  customerId={customerId} />}
                            {currentPage === "notifications" && <Notification    customerId={customerId} />}
                            {currentPage === "settings"      && <Settings        customerId={customerId} />}
                        </div>
                    </div>
                </main>

            </div>

            <Footer />

        </div>
    );
}

export default CustomerControllDashboard;