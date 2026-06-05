import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faBars,
	faBell,
	faCalendarCheck,
	faCalendarDays,
	faCar,
	faCarSide,
	faChevronDown,
	faCircleCheck,
	faCircleInfo,
	faClock,
	faGear,
	faMagnifyingGlass,
	faPlus,
	faStar,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

function Customer() {
	return (
		<div className="min-h-screen bg-[#f6f7fb] text-slate-900">
			<div className="flex min-h-screen flex-col lg:flex-row">
				<aside className="hidden w-[260px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
					<div className="px-4 py-5">
						<div className="rounded-[28px] border border-slate-200 bg-white px-4 py-5 shadow-sm">
							<div className="flex items-center gap-3">
								<img
									src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"
									alt="Irushi An."
									className="h-12 w-12 rounded-full object-cover"
								/>
								<div>
									<p className="text-sm font-semibold text-slate-900">Irushi An.</p>
									<p className="text-xs text-slate-500">Customer</p>
									<div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
										<span className="font-semibold text-[#ff6b1a]">4.8</span>
										<span className="text-amber-400">★</span>
										<span>(12 reviews)</span>
									</div>
								</div>
							</div>
						</div>

						<nav className="mt-6 space-y-1 text-sm">
							<SidebarLink active icon={faCarSide} label="Dashboard" />
							<SidebarLink icon={faUser} label="My Profile" />
							<SidebarLink icon={faCar} label="Repair Status" />
							<SidebarLink icon={faClock} label="Service History" />
							<SidebarLink icon={faStar} label="Reviews & Ratings" />
							<SidebarLink icon={faBell} label="Notifications" badge="3" />
							<SidebarLink icon={faGear} label="Settings" />
						</nav>
					</div>

					<div className="mt-auto px-4 pb-5">
						<button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50">
							<FontAwesomeIcon icon={faArrowRight} className="rotate-180 text-slate-500" />
							<span>Logout</span>
						</button>
					</div>
				</aside>

				<main className="flex-1">
					<div className="px-4 py-5 md:px-6 lg:px-8">
						<div className="mx-auto max-w-[1180px] space-y-5">
							<section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
								<div>
									<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Good evening, Irushi! 👋</h1>
									<p className="mt-2 text-sm text-slate-500">Here&apos;s what&apos;s happening with your vehicle services.</p>
								</div>

								<div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
									<span>May 25, 2026</span>
									<FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
								</div>
							</section>

							<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								<SummaryCard accent="orange" icon={faCircleInfo} title="Active Repairs" count="2" linkText="View details" />
								<SummaryCard accent="green" icon={faCircleCheck} title="Completed Repairs" count="5" linkText="View history" />
								<SummaryCard accent="blue" icon={faCalendarCheck} title="Upcoming Appointments" count="1" linkText="View calendar" />
								<SummaryCard accent="violet" icon={faBell} title="Notifications" count="3" linkText="View all" />
							</section>

							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
								<h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
								<div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
									<ActionCard accent="orange" icon={faPlus} title="Request New Service" desc="Send a new repair request to a nearby shop." />
									<ActionCard accent="green" icon={faMagnifyingGlass} title="Find Nearby Shops" desc="Search and discover trusted service providers." />
									<ActionCard accent="blue" icon={faCalendarDays} title="My Appointments" desc="View your upcoming appointments." />
									<ActionCard accent="violet" icon={faStar} title="My Reviews" desc="View and manage your reviews." />
								</div>
							</section>

							<footer className="flex flex-col gap-2 py-1 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
								<p>© 2026 FixGo. All rights reserved.</p>
								<p>Version 1.0.0</p>
							</footer>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

function SidebarLink({ active = false, icon, label, badge }) {
	return (
		<Link
			to="/services"
			className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${active
				? "border-l-4 border-[#ff6b1a] bg-[#fff4ee] font-medium text-[#ff6b1a]"
				: "text-slate-700 hover:bg-slate-50"
				}`}
		>
			<FontAwesomeIcon icon={icon} className={active ? "text-[#ff6b1a]" : "text-slate-500"} />
			<span>{label}</span>
			{badge ? <span className="ml-auto rounded-full bg-[#ff6b1a] px-2 py-0.5 text-xs font-semibold text-white">{badge}</span> : null}
		</Link>
	);
}

function SummaryCard({ accent, icon, title, count, linkText }) {
	const styles = {
		orange: { iconWrap: "bg-[#fff4ee] text-[#ff6b1a]", link: "text-[#ff6b1a]" },
		green: { iconWrap: "bg-[#edf9f0] text-[#16a34a]", link: "text-[#16a34a]" },
		blue: { iconWrap: "bg-[#edf3ff] text-[#2563eb]", link: "text-[#2563eb]" },
		violet: { iconWrap: "bg-[#f5edff] text-[#a855f7]", link: "text-[#a855f7]" },
	};

	return (
		<article className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
			<div className="flex items-start gap-4">
				<div className={`flex h-16 w-16 items-center justify-center rounded-full ${styles[accent].iconWrap}`}>
					<FontAwesomeIcon icon={icon} className="text-2xl" />
				</div>
				<div className="min-w-0">
					<p className="text-sm text-slate-500">{title}</p>
					<p className="mt-1 text-3xl font-semibold text-slate-900">{count}</p>
					<Link to="/services" className={`mt-2 inline-flex items-center gap-2 text-sm font-medium ${styles[accent].link}`}>
						{linkText} <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
					</Link>
				</div>
			</div>
		</article>
	);
}

function ActionCard({ accent, icon, title, desc }) {
	const styles = {
		orange: "bg-[#fff4ee] text-[#ff6b1a]",
		green: "bg-[#edf9f0] text-[#16a34a]",
		blue: "bg-[#edf3ff] text-[#2563eb]",
		violet: "bg-[#f5edff] text-[#a855f7]",
	};

	return (
		<article className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 transition hover:shadow-sm">
			<div className={`flex h-12 w-12 items-center justify-center rounded-full ${styles[accent]}`}>
				<FontAwesomeIcon icon={icon} className="text-xl" />
			</div>
			<p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
			<p className="mt-1 text-sm leading-5 text-slate-500">{desc}</p>
			<button className="mt-5 ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100">
				<FontAwesomeIcon icon={faArrowRight} />
			</button>
		</article>
	);
}

export default Customer;
