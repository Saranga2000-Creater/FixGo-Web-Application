import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";  // add useNavigate
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import RepairStatus from "./RepairStatus";
import ServiceHistory from "./ServiceHistory";
import ReviewsRatings from "./ReviewsRatings";
import Notification, { useUnreadCount } from "./Notification";
import Settings from "./Settings";
import CustomerSidebar from "./CustomerSidebar";


function CustomerControllDashboard() {
    //  Initialize hooks first (React requirement)
    const location = useLocation();
    const navigate = useNavigate();

    //  Combine both state variables
    const [currentPage, setCurrentPage] = useState(location.state?.targetPage || "dashboard");
    const [targetRequestId, setTargetRequestId] = useState(null);

    //  Keep your existing variables
    const unreadCount = useUnreadCount();
    

    useEffect(() => {
        if (location.state?.navigateTo === "repair") {
            setCurrentPage("repair");
            setTargetRequestId(location.state?.requestId || null);

            // Clear the state so revisiting /services doesn't re-trigger this
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.navigateTo]);

    useEffect(() => {
        const handler = (e) => {
            if (e.detail?.tab === "repair-status") {
                setCurrentPage("repair");
            }
        };
        window.addEventListener("fixgo_navigate", handler);
        return () => window.removeEventListener("fixgo_navigate", handler);
    }, []);

    // When user manually clicks a sidebar link, clear the deep-link target
    const handlePageChange = (page) => {
        if (page !== "repair") setTargetRequestId(null);
        setCurrentPage(page);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#F4F8F5",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            color: "#111827",
        }}>
            <CustomerSidebar
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
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
                        <Dashboard onNavigate={handlePageChange} />
                    )}
                    {currentPage === "profile"       && <Profile/>}
                    {currentPage === "repair"        && <RepairStatus targetRequestId={targetRequestId} />}
                    {currentPage === "history"       && <ServiceHistory/>}
                    {currentPage === "reviews"       && <ReviewsRatings />}
                    {currentPage === "notifications" && <Notification/>}
                    {currentPage === "settings"      && <Settings/>}
                </div>
            </main>
        </div>
    );
}

export default CustomerControllDashboard;