// ============================================================
// FILE: CustomerControllDashboard.jsx
// PURPOSE: Root layout — holds the sidebar + main content area.
//          Controls which page is currently visible via "currentPage" state.
//
// 👉 API: On load, fetch the logged-in user's profile info
//         to display name, avatar, and rating in the sidebar.
//         Endpoint suggestion: GET /api/customer/profile
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faBell,
	faCar,
	faCarSide,
	faClock,
	faGear,
	faStar,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

import Dashboard from "./Dashboard";
import Profile from "./Profile";
import RepairStatus from "./RepairStatus";
import ServiceHistory from "./ServiceHistory";
import ReviewsRatings from "./ReviewsRatings";
import Notification from "./Notification";
import Settings from "./Settings";
import CustomerSidebar from "./CustomerSidebar";

// ============================================================
// MAIN COMPONENT: CustomerControllDashboard
// ============================================================
function CustomerControllDashboard() {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState("dashboard");

	return (
		<div style={{ position: "fixed", top: "64px", left: 0, right: 0, bottom: 0, display: "flex", background: "#f6f7fb", color: "#0f172a" }}>
			<div className="flex w-full h-full overflow-hidden">

				{/* ── SIDEBAR ── */}
				<CustomerSidebar
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					onLogout={() => {
						sessionStorage.clear();
						navigate("/");
					}}
				/>

				{/* ── MAIN CONTENT AREA ── */}
				<main className="flex-1 overflow-y-auto">
					<div className="px-4 py-5 md:px-6 lg:px-8">
						<div className="mx-auto max-w-[1180px]">
							{currentPage === "dashboard"      && <Dashboard />}
							{currentPage === "profile"        && <Profile />}
							{currentPage === "repair"         && <RepairStatus />}
							{currentPage === "history"        && <ServiceHistory />}
							{currentPage === "reviews"        && <ReviewsRatings />}
							{currentPage === "notifications"  && <Notification />}
							{currentPage === "settings"       && <Settings />}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default CustomerControllDashboard;
