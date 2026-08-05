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
    const [profileModalState, setProfileModalState] = useState(null);
    const [selectedNotifId, setSelectedNotifId] = useState(null);

    //  Keep your existing variables
    const unreadCount = useUnreadCount();


    useEffect(() => {
        if (location.state?.navigateTo === "repair") {
            setCurrentPage("repair");
            setTargetRequestId(location.state?.requestId || null);

            // Clear the state so revisiting /services doesn't re-trigger this
            navigate(location.pathname, { replace: true, state: {} });
        } else if (location.state?.targetPage) {
            setCurrentPage(location.state.targetPage);
            setSelectedNotifId(location.state.selectedNotifId || null);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.navigateTo, location.state?.targetPage]);

    useEffect(() => {
        const handler = (e) => {
            if (e.detail?.tab === "repair-status" || e.detail?.tab === "repair") {
                setCurrentPage("repair");
            } else if (e.detail?.tab) {
                setCurrentPage(e.detail.tab);
                if (e.detail.tab === "notifications" && e.detail.selectedNotifId) {
                    setSelectedNotifId(e.detail.selectedNotifId);
                }
            }
        };
        window.addEventListener("fixgo_navigate", handler);
        return () => window.removeEventListener("fixgo_navigate", handler);
    }, []);

    // When user manually clicks a sidebar link or navigates from settings
    const handlePageChange = (page, options = {}) => {
        if (page !== "repair") setTargetRequestId(null);
        if (page === "profile" && options?.action) {
            setProfileModalState({ open: true, tab: options.action === "password" ? "password" : "info" });
        } else if (page !== "profile") {
            setProfileModalState(null);
        }
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-[#F4F8F5] text-[#111827]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            <CustomerSidebar
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
                unreadCount={unreadCount}
            />

            <main className="ml-[240px] min-h-[calc(100vh-65px)] p-6 box-border">
                <div className="max-w-[1180px] mx-auto">
                    {currentPage === "dashboard" && (
                        <Dashboard onNavigate={handlePageChange} />
                    )}
                    {currentPage === "profile" && (
                        <Profile
                            initialModalOpen={profileModalState?.open || false}
                            initialTab={profileModalState?.tab || "info"}
                        />
                    )}
                    {currentPage === "repair" && <RepairStatus targetRequestId={targetRequestId} />}
                    {currentPage === "history" && <ServiceHistory />}
                    {currentPage === "reviews" && <ReviewsRatings />}
                    {currentPage === "notifications" && (
                        <Notification 
                            initialSelectedId={selectedNotifId} 
                            onClearSelection={() => setSelectedNotifId(null)} 
                        />
                    )}
                    {currentPage === "settings" && <Settings onNavigate={handlePageChange} />}
                </div>
            </main>
        </div>
    );
}

export default CustomerControllDashboard;