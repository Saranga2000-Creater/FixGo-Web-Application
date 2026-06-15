// ============================================================
// FILE: RepairStatus.jsx
// PURPOSE: Repair Status page — vehicle info, step tracker, details.
//
// 👉 API: GET /api/customer/repairs/active
//         Response: { requestId, vehicleName, vehiclePlate,
//                     vehicleImageUrl, serviceType, requestedAt,
//                     steps: [{ key, label, date, time, status }],
//                     details: { serviceRequested, workshop, estimatedCompletion } }
// ============================================================

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircleCheck,
	faClipboardList,
	faFlag,
	faPaperPlane,
	faShieldHalved,
	faWrench,
} from "@fortawesome/free-solid-svg-icons";

// ── PageFooter ────────────────────────────────────────────────
function PageFooter() {
	return (
		<footer className="flex flex-col gap-2 py-1 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
			<p>© 2026 FixGo. All rights reserved.</p>
			<p>Version 1.0.0</p>
		</footer>
	);
}

// ── RepairDetailRow ───────────────────────────────────────────
function RepairDetailRow({ label, value }) {
	return (
		<div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
			<p className="text-sm font-semibold text-slate-700">{label}</p>
			<p className="text-sm text-slate-900">{value}</p>
		</div>
	);
}

// ── STEPS static data ─────────────────────────────────────────
// 👉 API: Replace with repair.steps from GET /api/customer/repairs/active
const STEPS = [
	{ key: "sent",      icon: faPaperPlane,   label: "Request Sent",  date: "May 25, 2026", time: "09:15 AM", desc: "Your repair request has been sent successfully.",                           status: "done" },
	{ key: "accepted",  icon: faCircleCheck,  label: "Accepted",      date: "May 25, 2026", time: "10:28 AM", desc: "Your request has been accepted by Advance Auto Service.",                   status: "done" },
	{ key: "repairing", icon: faWrench,       label: "Repairing",     date: "May 25, 2026", time: "11:40 AM", desc: "Your vehicle is currently being repaired.",                                 status: "active" },
	{ key: "quality",   icon: faClipboardList,label: "Quality Check", date: null,           time: null,       desc: "Your vehicle is under quality check before completion.",                    status: "pending" },
	{ key: "completed", icon: faFlag,         label: "Completed",     date: null,           time: null,       desc: "Your repair has been completed and your vehicle is ready.",                 status: "pending" },
];

// ── RepairStatus (page) ───────────────────────────────────────
function RepairStatus() {
	return (
		<div className="space-y-5">
			<section>
				<h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Repair Status</h1>
				<p className="mt-2 text-sm text-slate-500">Track the progress of your repair request in real-time.</p>
			</section>

			{/* Vehicle info card
			    👉 API: Replace all values with repair.vehicle* and repair.requestedAt */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-5">
						{/* 👉 API: Replace src with repair.vehicleImageUrl */}
						<img
							src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=160&q=80"
							alt="Toyota Prius"
							className="h-20 w-28 rounded-xl object-cover"
						/>
						<div>
							{/* 👉 API: Replace with repair.vehicleName + " – " + repair.vehiclePlate */}
							<p className="text-lg font-semibold text-slate-900">Toyota Prius – ABC-1234</p>
							{/* 👉 API: Replace with repair.serviceType */}
							<p className="mt-1 text-sm text-slate-600">Service: <span className="font-semibold text-slate-900">Engine Overheating</span></p>
							{/* 👉 API: Replace with repair.requestId */}
							<p className="mt-1 text-sm text-slate-600">Request ID: <span className="font-semibold text-slate-900">FXG-001</span></p>
						</div>
					</div>
					<div className="text-right text-sm text-slate-500">
						<p>Requested on</p>
						{/* 👉 API: Replace with formatted repair.requestedAt */}
						<p className="mt-1 font-semibold text-slate-900">May 25, 2026 • 09:15 AM</p>
					</div>
				</div>
			</section>

			{/* Step tracker
			    👉 API: Map over repair.steps instead of static STEPS */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="overflow-x-auto">
					<div className="flex min-w-[620px] items-start justify-between">
						{STEPS.map((step, idx) => (
							<div key={step.key} className="flex flex-1 flex-col items-center">
								<div className="relative flex w-full items-center justify-center">
									{idx > 0 && (
										<div className={`absolute right-1/2 top-1/2 h-[3px] w-full -translate-y-1/2 ${
											STEPS[idx - 1].status === "done" || step.status === "active"
												? "bg-[#ff6b1a]"
												: "bg-slate-200"
										}`} />
									)}
									<div className="relative z-10">
										{step.status === "done"    && <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#16a34a] bg-[#edf9f0]"><FontAwesomeIcon icon={step.icon} className="text-xl text-[#16a34a]" /></div>}
										{step.status === "active"  && <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#ff6b1a] bg-[#fff4ee]"><FontAwesomeIcon icon={step.icon} className="text-xl text-[#ff6b1a]" /></div>}
										{step.status === "pending" && <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-200 bg-white"><FontAwesomeIcon icon={step.icon} className="text-xl text-slate-300" /></div>}
										{step.status === "done" && (
											<span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#16a34a] text-[10px] text-white">✓</span>
										)}
									</div>
								</div>
								<div className="mt-4 w-full px-1 text-center">
									<p className="text-sm font-semibold text-slate-900">{step.label}</p>
									{/* 👉 API: step.date and step.time come from the backend (null if not reached yet) */}
									{step.date
										? <><p className="mt-1 text-xs text-slate-500">{step.date}</p><p className="text-xs text-slate-500">{step.time}</p></>
										: <p className="mt-1 text-xs tracking-widest text-slate-300">- - - - - -</p>
									}
									<p className="mt-2 text-xs leading-4 text-slate-500">{step.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Reassurance banner */}
				<div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf9f0]">
						<FontAwesomeIcon icon={faShieldHalved} className="text-[#16a34a]" />
					</div>
					<div>
						<p className="text-sm font-semibold text-slate-900">Sit back and relax!</p>
						<p className="text-sm text-slate-500">We&apos;ll keep you updated at every step of the way.</p>
					</div>
				</div>
			</section>

			{/* Repair details
			    👉 API: Values come from repair.details */}
			<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
				<h3 className="text-base font-semibold text-slate-900">Repair Details</h3>
				<div className="mt-5 space-y-4">
					{/* 👉 API: Replace with repair.details.serviceRequested, .workshop, .estimatedCompletion */}
					<RepairDetailRow label="Service Requested"    value="Engine Overheating" />
					<RepairDetailRow label="Workshop"             value="Advanced Auto Service Center" />
					<RepairDetailRow label="Estimated Completion" value="May 25, 2026 • 05:00 PM" />
				</div>
			</section>

			<PageFooter />
		</div>
	);
}

export default RepairStatus;
