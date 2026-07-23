import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faUsers, faShieldHalved, faArrowRight, faArrowTrendUp, faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";

// Mock/sample data for the moderation alert feed.
const MODERATION_ALERTS = [
    { id: 1, type: "REVIEW REPORT", time: "2 mins ago",  desc: '"The shop overcharged me and the mechanic was rude..."', user: "Saman P.", shop: "Elite Auto",   actions: ["Dismiss Review", "Ignore"] },
    { id: 2, type: "PROFILE FLAG",  time: "45 mins ago", desc: 'Suspected duplicate profile for "Vantage Service Center".', user: null, shop: null,            actions: ["Investigate"] },
    { id: 3, type: "FRAUD SIGNAL",  time: "2 hours ago", desc: "Unusual surge in 5-star ratings (50 reviews in 10 mins) for Shop ID #2214.", user: null, shop: null, actions: ["Audit Logs"] },
    { id: 4, type: "REVIEW REPORT", time: "3 hours ago", desc: '"Parts were substandard. Will not return."', user: "Nimal K.", shop: "QuickFix Auto", actions: ["Dismiss Review", "Ignore"] },
];

// Maps each accent name to its matching background/icon/text Tailwind classes
const ACCENT_STYLES = {
    green:  { iconBg: "bg-green-50",  iconColor: "text-green-600",  metaColor: "text-green-600" },
    orange: { iconBg: "bg-[#FFF4EE]", iconColor: "text-[#FF6B1A]",  metaColor: "text-[#FF6B1A]" },
    violet: { iconBg: "bg-[#F5EDFF]", iconColor: "text-purple-500", metaColor: "text-purple-500" },
};

// Reusable stat card used for the 3 top summary numbers
function AdminSummaryCard({ accent, icon, title, count, meta, metaPositive }) {
    const s = ACCENT_STYLES[accent]; // pick colors matching this card's accent
    return (
        <div className="bg-white rounded-[18px] border border-gray-200 py-5 px-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-start gap-4">
                {/* Icon circle */}
                <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 ${s.iconBg}`}>
                    <FontAwesomeIcon icon={icon} className={`text-xl ${s.iconColor}`} />
                </div>
                {/* Title, big number, and trend line */}
                <div>
                    <p className="text-[13px] text-gray-500 m-0">{title}</p>
                    <p className="text-[28px] font-bold text-gray-900 my-1">{count}</p>
                    {meta && (
                        <p className={`text-xs font-semibold m-0 flex items-center gap-1 ${s.metaColor}`}>
                            <FontAwesomeIcon icon={metaPositive ? faArrowTrendUp : faArrowTrendDown} className="text-[10px]" />
                            {meta}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Generic white card wrapper with an optional header title.
// Used here to wrap the "All Moderation Alerts" list.
function PageCard({ title, children }) {
    return (
        <div className="bg-white rounded-[18px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
            {title && (
                <div className="py-4 px-6 border-b border-gray-100">
                    <h2 className="text-[15px] font-bold text-gray-900 m-0">{title}</h2>
                </div>
            )}
            {children}
        </div>
    );
}

// Simple page title + subtitle block, shown at the top of the page.
function PageHeading({ title, sub }) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 m-0">{title}</h1>
            {sub && <p className="text-gray-500 mt-1.5 text-sm mb-0">{sub}</p>}
        </div>
    );
}

// Maps each alert type to its badge/border Tailwind classes; falls back to gray if type is unknown
const ALERT_TYPE_STYLES = {
    "REVIEW REPORT": { badge: "text-[#FF6B1A] bg-[#FFF4EE]", border: "border-l-4 border-l-[#FF6B1A]" },
    "PROFILE FLAG":  { badge: "text-blue-600 bg-[#EDF3FF]",  border: "border-l-4 border-l-transparent" },
    "FRAUD SIGNAL":  { badge: "text-purple-500 bg-[#F5EDFF]", border: "border-l-4 border-l-transparent" },
};
const DEFAULT_ALERT_TYPE_STYLE = { badge: "text-gray-500 bg-gray-100", border: "border-l-4 border-l-transparent" };

// Renders one row in the moderation alert feed.
function ModerationAlertCard({ alert }) {
    const ts = ALERT_TYPE_STYLES[alert.type] || DEFAULT_ALERT_TYPE_STYLE;
    return (
        <div className={`py-4 px-6 border-b border-gray-100 ${ts.border}`}>
            {/* Type badge + timestamp */}
            <div className="flex items-center gap-2 mb-1.5">
                <span className={`rounded-full py-0.5 px-2.5 text-[11px] font-bold ${ts.badge}`}>{alert.type}</span>
                <span className="text-[11px] text-gray-500">{alert.time}</span>
            </div>

            {/* Alert description text */}
            <p className="text-[13px] text-gray-700 m-0">{alert.desc}</p>

            {/* Only shown for alerts tied to a specific user/shop (e.g. review reports) */}
            {alert.user && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    {/* Avatar circle using the user's first initial */}
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {alert.user[0]}
                    </div>
                    <span>User: {alert.user}</span>
                    {alert.shop && (
                        <>
                            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                            <span className="text-green-600 font-semibold">{alert.shop}</span>
                        </>
                    )}
                </div>
            )}

            {/* Action buttons (e.g. Dismiss Review, Investigate, Audit Logs) */}
            <div className="mt-2.5 flex gap-4">
                {alert.actions.map((action) => (
                    <button
                        key={action}
                        className={`bg-transparent border-none cursor-pointer p-0 text-xs font-semibold font-sans ${
                            action === "Dismiss Review" || action === "Investigate" || action === "Audit Logs"
                                ? "text-green-600"
                                : "text-gray-500"
                        }`}
                    >
                        {action}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Main Moderation page: shows 3 summary cards
function Moderation() {
    return (
        <div className="flex flex-col gap-5">
            {/* Page title */}
            <PageHeading title="Moderation" sub="Reported content, fraud signals, and profile flags." />

            {/* Top summary stats */}
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                <AdminSummaryCard accent="orange" icon={faFlag}         title="Review Reports" count="3" meta="Needs action"        metaPositive={false} />
                <AdminSummaryCard accent="violet" icon={faUsers}        title="Profile Flags"  count="2" meta="Duplicate profiles"  metaPositive={false} />
                <AdminSummaryCard accent="green"  icon={faShieldHalved} title="Fraud Signals"  count="1" meta="Rating manipulation" metaPositive={false} />
            </div>

            {/* Full alert feed, one card per moderation item */}
            <PageCard title="All Moderation Alerts">
                <div className="flex flex-col">
                    {MODERATION_ALERTS.map((alert) => (
                        <ModerationAlertCard key={alert.id} alert={alert} />
                    ))}
                </div>
            </PageCard>
        </div>
    );
}

export default Moderation;
