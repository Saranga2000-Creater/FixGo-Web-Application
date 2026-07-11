import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Dashboard from "./Dashboard";
import VerificationQueue from "./VerificationQueue";
import Moderation from "./Moderation";
import Revenue from "./Revenue";
import Settings from "./Settings";

const T = {
    green:      "#16A34A",
    slate900:   "#111827",
    pageBg:     "#F4F8F5",
    font:       "'Segoe UI', system-ui, sans-serif",
};

function AdminControlDashboard() {
    const [currentPage, setCurrentPage] = useState("dashboard");

    return (
        <div style={{
            minHeight: "100vh",
            background: T.pageBg,
            color: T.slate900,
            fontFamily: T.font,
        }}>
            {/* ── SIDEBAR ── fixed, always visible ── */}
            <AdminSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

            {/* ── MAIN CONTENT ── offset by sidebar width and navbar height ── */}
            <main style={{ marginLeft: 240, minHeight: "calc(100vh - 65px)", padding: "24px", boxSizing: "border-box" }}>
                <div style={{ maxWidth: 1180, margin: "0 auto" }}>
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
