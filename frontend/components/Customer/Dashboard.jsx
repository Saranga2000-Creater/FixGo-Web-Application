import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faBell,
    faCalendarCheck,
    faCalendarDays,
    faCircleCheck,
    faCircleInfo,
    faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";

function SummaryCard({ accent, icon, title, count, linkText, linkTo }) {
    const s = {
        green:  { iconWrap: "bg-[#edf9f0] text-[#16a34a]", link: "text-[#16a34a]" },
        orange: { iconWrap: "bg-[#fff4ee] text-[#ff6b1a]", link: "text-[#ff6b1a]" },
        blue:   { iconWrap: "bg-[#edf3ff] text-[#2563eb]", link: "text-[#2563eb]" },
        violet: { iconWrap: "bg-[#f5edff] text-[#a855f7]", link: "text-[#a855f7]" },
    };
    return (
        <article className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${s[accent].iconWrap}`}>
                    <FontAwesomeIcon icon={icon} className="text-2xl" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="mt-1 text-3xl font-semibold text-slate-900">{count}</p>
                    <Link
                        to={linkTo ?? "/services"}
                        className={`mt-2 inline-flex items-center gap-1.5 text-sm font-medium ${s[accent].link}`}
                    >
                        {linkText} <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

function Dashboard() {
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        fetch("http://localhost:8000/api/getCustomerProfile.php", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setFirstName(data.name.split(" ")[0]);
            })
            .catch(() => {});
    }, []);

    const today = new Date().toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });

    return (
        <div className="space-y-5">

            {/* ── Header ── */}
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">
                        {getGreeting()}{firstName ? `, ${firstName}` : ""}! 👋
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Here&apos;s what&apos;s happening with your vehicle services.
                    </p>
                </div>
                <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                    <span>{today}</span>
                    <FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
                </div>
            </section>

            {/* ── Summary Cards ── */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryCard accent="green"  icon={faCircleInfo}    title="Active Repairs"        count="0" linkText="View details"  linkTo="/repair"        />
                <SummaryCard accent="blue"   icon={faCircleCheck}   title="Completed Repairs"     count="0" linkText="View history"  linkTo="/history"       />
                <SummaryCard accent="orange" icon={faCalendarCheck} title="Upcoming Appointments" count="0" linkText="View calendar" linkTo="/repair"        />
                <SummaryCard accent="violet" icon={faBell}          title="Notifications"         count="0" linkText="View all"      linkTo="/notifications" />
            </section>

        </div>
    );
}

export default Dashboard;