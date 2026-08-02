import { useState, useEffect } from "react";
import { api } from "../../src/services/api";
import AdminSidebar from "./AdminSidebar";
import Dashboard from "./Dashboard";
import VerificationQueue from "./VerificationQueue";
import Moderation from "./Moderation";
import Revenue from "./Revenue";
import Settings from "./Settings";

function AdminControlDashboard() {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [verificationCount, setVerificationCount] = useState(0);

    const loadCounts = async () => {
        try {
            const [payRes, shopRes] = await Promise.allSettled([
                api.get("admin/getPendingVerifications.php"),
                api.get("getPendingShops.php")
            ]);
            
            const payCount = payRes.status === "fulfilled" ? (payRes.value.data?.length || 0) : 0;
            const shopCount = shopRes.status === "fulfilled" ? (shopRes.value.data?.length || 0) : 0;
            
            setVerificationCount(payCount + shopCount);
        } catch (err) {
            console.error("Failed to fetch notification counts", err);
        }
    };

    useEffect(() => {
        loadCounts();
        // Refresh periodically or when visiting the verification page
        if (currentPage === "verification") {
            loadCounts();
        }
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-[#F4F8F5] text-gray-900 font-sans">
            {/* ── SIDEBAR ── fixed, always visible ── */}
            <AdminSidebar 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                verificationCount={verificationCount}
            />

            {/* ── MAIN CONTENT ── offset by sidebar width and navbar height ── */}
            <main className="ml-[240px] min-h-[calc(100vh-65px)] p-6 box-border">
                <div className="max-w-[1180px] mx-auto">
                    {currentPage === "dashboard"    && <Dashboard />}
                    {currentPage === "verification" && <VerificationQueue />}
                    {currentPage === "moderation"   && <Moderation />}
                    {currentPage === "revenue"      && <Revenue />}
                    {currentPage === "settings"     && <Settings />}
                </div>
            </main>
        </div>
    );
}

export default AdminControlDashboard;
