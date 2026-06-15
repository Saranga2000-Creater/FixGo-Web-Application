import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faBell,
    faCalendarCheck,
    faCalendarDays,
    faCircleCheck,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

// ── PageFooter ────────────────────────────────────────────────
function PageFooter() {
    return (
        <footer className="flex flex-col gap-2 py-1 text-xs text-[#274c3a]/50 md:flex-row md:items-center md:justify-between font-mono">
            <p>© 2026 FixGo. All rights reserved.</p>
            <p>Version 1.0.0</p>
        </footer>
    );
}

// ── SummaryCard ───────────────────────────────────────────────
//  API: "count" prop should be dynamic from GET /api/customer/dashboard-summary
function SummaryCard({ accent, icon, title, count, linkText }) {
    const s = {
        green:  { iconWrap: "bg-[#16a34a]/10 text-[#16a34a]",  link: "text-[#16a34a]",  border: "border-[#d1e7d7]" },
        teal:   { iconWrap: "bg-[#0d9488]/10 text-[#0d9488]",  link: "text-[#0d9488]",  border: "border-[#99f6e4]/60" },
        blue:   { iconWrap: "bg-[#2563eb]/10 text-[#2563eb]",  link: "text-[#2563eb]",  border: "border-[#bfdbfe]/60" },
        violet: { iconWrap: "bg-[#a855f7]/10 text-[#a855f7]",  link: "text-[#a855f7]",  border: "border-[#e9d5ff]/60" },
    };
    return (
        <article className={`rounded-[18px] border ${s[accent].border} bg-white p-4 shadow-[0_4px_12px_rgb(22,163,74,0.06)]`}>
            <div className="flex items-start gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${s[accent].iconWrap}`}>
                    <FontAwesomeIcon icon={icon} className="text-2xl" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-mono text-[#274c3a]/70">{title}</p>
                    <p className="mt-1 text-3xl font-semibold text-[#14532d]">{count}</p>
                    <Link to="/services" className={`mt-2 inline-flex items-center gap-2 text-sm font-mono font-medium ${s[accent].link}`}>
                        {linkText} <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

// ── Dashboard (page) ──────────────────────────────────────────
function Dashboard() {
    return (
        <div className="space-y-5">

            {/* Header */}
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    {/* API: Replace "Irushi" with the logged-in customer's first name */}
                    <h1 className="text-[28px] font-semibold tracking-tight text-[#14532d]">Good evening, Irushi! 👋</h1>
                    <p className="mt-2 text-sm font-mono text-[#274c3a]/60">Here&apos;s what&apos;s happening with your vehicle services.</p>
                </div>
                {/* API: Replace with new Date().toLocaleDateString() */}
                <div className="flex items-center gap-3 self-start rounded-2xl border border-[#d1e7d7] bg-white px-4 py-3 text-sm text-[#274c3a] shadow-[0_4px_12px_rgb(22,163,74,0.06)] font-mono">
                    <span>May 25, 2026</span>
                    <FontAwesomeIcon icon={faCalendarDays} className="text-[#16a34a]/50" />
                </div>
            </section>

            {/* Summary cards
                API: Each count value comes from GET /api/customer/dashboard-summary */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {/* API: Replace "2" with dashboardData.activeRepairs */}
                <SummaryCard accent="green"  icon={faCircleInfo}    title="Active Repairs"        count="2" linkText="View details" />
                {/* API: Replace "5" with dashboardData.completedRepairs */}
                <SummaryCard accent="teal"   icon={faCircleCheck}   title="Completed Repairs"     count="5" linkText="View history" />
                {/* API: Replace "1" with dashboardData.upcomingAppointments */}
                <SummaryCard accent="blue"   icon={faCalendarCheck} title="Upcoming Appointments" count="1" linkText="View calendar" />
                {/* API: Replace "3" with dashboardData.unreadNotifications */}
                <SummaryCard accent="violet" icon={faBell}          title="Notifications"         count="3" linkText="View all" />
            </section>

            <PageFooter />
        </div>
    );
}

export default Dashboard;