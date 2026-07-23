import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStore,
    faShieldHalved,
    faMoneyBillWave,
    faCircleExclamation,
    faArrowTrendUp,
    faArrowTrendDown,
    faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

// Maps each accent name to its matching background/icon/text Tailwind classes
const ACCENT_STYLES = {
    green:  { iconBg: "bg-green-50",     iconColor: "text-green-600",  metaColor: "text-green-600" },
    orange: { iconBg: "bg-[#FFF4EE]",    iconColor: "text-[#FF6B1A]",  metaColor: "text-[#FF6B1A]" },
    blue:   { iconBg: "bg-[#EDF3FF]",    iconColor: "text-blue-600",   metaColor: "text-blue-600" },
    violet: { iconBg: "bg-[#F5EDFF]",    iconColor: "text-purple-500", metaColor: "text-purple-500" },
};

// Reusable card component for the 4 summary metrics on the dashboard
function AdminSummaryCard({ accent, icon, title, count, meta, metaPositive }) {
    const s = ACCENT_STYLES[accent]; // pick the color set for this card

    return (
        <div className="bg-white rounded-[18px] border border-gray-200 py-5 px-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-[250ms] ease-in-out cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-4">
                {/* Icon circle */}
                <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 ${s.iconBg}`}>
                    <FontAwesomeIcon icon={icon} className={`text-xl ${s.iconColor}`} />
                </div>
                {/* Text block: title, big number, and trend meta line */}
                <div>
                    <p className="text-[13px] text-gray-500 m-0">{title}</p>
                    <p className="text-[28px] font-bold text-gray-900 my-1">{count}</p>
                    {meta && (
                        <p className={`text-xs font-semibold m-0 flex items-center gap-1 ${s.metaColor}`}>
                            {/* Shows up-arrow or down-arrow depending on metaPositive */}
                            <FontAwesomeIcon icon={metaPositive ? faArrowTrendUp : faArrowTrendDown} className="text-[10px]" />
                            {meta}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Main Dashboard page: landing page admins see first when they click "Dashboard".
function Dashboard() {
    return (
        <div className="flex flex-col gap-5">

            {/* Header: page title, subtitle, and today's date badge */}
            <div className="bg-gradient-to-b from-[#EEF7F0] to-white rounded-[18px] p-6 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex justify-between items-center">
                <div>
                    <h1 className="text-[28px] font-bold text-gray-900 m-0">Dashboard</h1>
                    <p className="text-gray-500 mt-1.5 mb-0 text-sm">System overview and key metrics at a glance.</p>
                </div>
                {/* Auto-generates today's date, no need to update manually */}
                <div className="text-sm font-semibold text-gray-700 bg-white py-2.5 px-4 rounded-xl border border-gray-200 flex items-center gap-2">
                    {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                </div>
            </div>

            {/* Summary Cards: the 4 key metrics, laid out in a responsive grid
                (wraps to fewer columns automatically on smaller screens) */}
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                <AdminSummaryCard accent="green"  icon={faStore}             title="Active Shops"        count="10"         meta="+12% this week" metaPositive />
                <AdminSummaryCard accent="orange" icon={faShieldHalved}      title="Verification Queue"  count="3"          meta="High Priority"  metaPositive={false} />
                <AdminSummaryCard accent="blue"   icon={faMoneyBillWave}     title="Gross Revenue (MTD)" count="LKR 42,000" meta="Live"           metaPositive />
                <AdminSummaryCard accent="violet" icon={faCircleExclamation} title="Active Alerts"       count="2"          meta="System Normal"  metaPositive />
            </div>
        </div>
    );
}

export default Dashboard;
