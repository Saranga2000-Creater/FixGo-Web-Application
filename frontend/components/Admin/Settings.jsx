import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faGear,
    faBell,
    faShieldHalved,
    faFileLines,
    faStore,
    faClipboardList,
    faRotate,
    faFlag,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// Page title + subtitle block
function PageHeading({ title, sub }) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 m-0">{title}</h1>
            {sub && <p className="text-gray-500 mt-1.5 text-sm mb-0">{sub}</p>}
        </div>
    );
}

// Main Settings page: renders a list of setting groups
function Settings() {

    const sections = [
        {
            icon: faUser,
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
            title: "Admin Account",
            subtitle: "Manage admin profile and access.",
            rows: [
                { icon: faUser,         label: "Edit Profile" },
                { icon: faShieldHalved, label: "Change Password" },
                { icon: faFileLines,    label: "Activity Log" },
            ],
        },
        {
            icon: faGear,
            iconBg: "bg-[#EDF3FF]",
            iconColor: "text-blue-600",
            title: "System Settings",
            subtitle: "Platform-level configuration.",
            rows: [
                { icon: faStore,         label: "Commission Rates" },
                { icon: faClipboardList, label: "Verification Rules" },
                { icon: faRotate,        label: "API & Integrations" },
            ],
        },
        {
            icon: faBell,
            iconBg: "bg-[#FFF4EE]",
            iconColor: "text-[#FF6B1A]",
            title: "Notifications",
            subtitle: "Alert and notification preferences.",
            rows: [
                { icon: faBell, label: "Email Alerts" },
                { icon: faFlag, label: "Moderation Alerts" },
            ],
        },
    ];

    return (
        <div className="flex flex-col gap-5">
            <PageHeading title="Settings" sub="Manage system configuration and admin preferences." />

            {/* One block per section, built from the `sections` array above */}
            {sections.map((sec) => (
                <div
                    key={sec.title}
                    className="bg-white border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden flex"
                >

                    {/* Left side: section icon, title, and description */}
                    <div className="w-[260px] shrink-0 border-r border-gray-100 flex items-center gap-4 py-6 px-5">
                        <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 ${sec.iconBg}`}>
                            <FontAwesomeIcon icon={sec.icon} className={`text-2xl ${sec.iconColor}`} />
                        </div>
                        <div>
                            <div className="text-[15px] font-bold text-gray-900">{sec.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{sec.subtitle}</div>
                        </div>
                    </div>

                    {/* Right side: clickable rows for this section (not wired to routes yet) */}
                    <div className="flex-1">
                        {sec.rows.map((row) => (
                            <button
                                key={row.label}
                                className="w-full flex items-center justify-between py-4 px-5 bg-transparent border-none border-b border-gray-100 cursor-pointer font-sans hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={row.icon} className="text-gray-400 w-4" />
                                    <span className="text-sm text-gray-700">{row.label}</span>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} className="text-[11px] text-gray-400" />
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Settings;
