import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Dashboard from "./Dashboard";
import VerificationQueue from "./VerificationQueue";
import Moderation from "./Moderation";
import Revenue from "./Revenue";
import Settings from "./Settings";

function AdminControlDashboard() {
    const [currentPage, setCurrentPage] = useState("dashboard");

    return (
        <div className="min-h-screen bg-[#F4F8F5] text-gray-900 font-sans">
            {/* ── SIDEBAR ── fixed, always visible ── */}
            <AdminSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

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
