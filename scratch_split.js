const fs = require('fs');

const file = fs.readFileSync('frontend/components/Admin/Revenue.jsx', 'utf8');
const lines = file.split('\n');

const slice = (start, end) => lines.slice(start - 1, end).join('\n');

// RevenueConstants.js
const constants = `export const ACCENT_STYLES = {
  green:  { iconBg: "bg-green-50",  iconColor: "text-green-600",  metaColor: "text-green-600" },
  blue:   { iconBg: "bg-[#EDF3FF]", iconColor: "text-blue-600",   metaColor: "text-blue-600" },
  orange: { iconBg: "bg-[#FFF4EE]", iconColor: "text-[#FF6B1A]",  metaColor: "text-[#FF6B1A]" },
};

export const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const STATUS_STYLES = {
  Paid:                   "bg-green-50 text-green-600",
  Dispatched:             "bg-blue-50 text-blue-600",
  "Verification Pending": "bg-amber-50 text-amber-600",
  Overdue:                "bg-red-100 text-red-600",
  Draft:                  "bg-gray-100 text-gray-500",
  Ignored:                "bg-slate-100 text-slate-500",
};

export const LINE_COLORS = { Garages: "#16a34a", "Service Centers": "#2563eb", "Spare Parts": "#f97316" };

export const HEALTH_CFG = [
  { key: "Paid",                 label: "Paid",      fill: "#16a34a", text: "text-green-600",  bar: "bg-green-500",  pulse: false },
  { key: "Dispatched",           label: "Dispatched",fill: "#2563eb", text: "text-blue-600",   bar: "bg-blue-500",   pulse: false },
  { key: "Verification Pending", label: "Pending",   fill: "#d97706", text: "text-amber-600", bar: "bg-amber-400",  pulse: true  },
  { key: "Overdue",              label: "Overdue",   fill: "#dc2626", text: "text-red-600",   bar: "bg-red-500",   pulse: true  },
];
`;
fs.writeFileSync('frontend/components/Admin/Revenue/RevenueConstants.js', constants);

// RevenueShared.jsx
const shared = `import React from "react";

export function SkeletonCard() {
${slice(58, 69)}
}

export function SkeletonChart() {
${slice(73, 82)}
}

export function PageCard({ title, action, children }) {
${slice(86, 96)}
}

export function PageHeading({ title, sub }) {
${slice(100, 105)}
}
`;
fs.writeFileSync('frontend/components/Admin/Revenue/RevenueShared.jsx', shared);

// AdminSummaryCard.jsx
const summaryCard = `import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import { ACCENT_STYLES } from "./RevenueConstants";

${slice(23, 55)}
export default AdminSummaryCard;
`;
fs.writeFileSync('frontend/components/Admin/Revenue/AdminSummaryCard.jsx', summaryCard);

// RevenueCharts.jsx
const charts = `import React, { useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartTooltip,
  PieChart, Pie, Cell
} from "recharts";
import { MONTH_NAMES, LINE_COLORS, HEALTH_CFG } from "./RevenueConstants";

${slice(144, 148)}

${slice(150, 170)}

${slice(172, 220)}

${slice(229, 298)}

export { RevenueBarChart, CollectionHealth };
`;
fs.writeFileSync('frontend/components/Admin/Revenue/RevenueCharts.jsx', charts);

// BillingActions.jsx
const billingActions = `import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faSpinner, faCheckCircle, faXmark, faFileInvoiceDollar, faLock } from "@fortawesome/free-solid-svg-icons";
import { api } from "../../../src/services/api";
import toast from "react-hot-toast";
import { PageCard } from "./RevenueShared";
import { MONTH_NAMES } from "./RevenueConstants";

${slice(302, 328)}

${slice(330, 368)}

${slice(372, 501)}

export default BillingActions;
`;
fs.writeFileSync('frontend/components/Admin/Revenue/BillingActions.jsx', billingActions);

// InvoiceLedgerTable.jsx
const invoiceTable = `import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faSpinner, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { api } from "../../../src/services/api";
import toast from "react-hot-toast";
import { PageCard } from "./RevenueShared";
import { MONTH_NAMES, STATUS_STYLES } from "./RevenueConstants";

${slice(505, 505)}

${slice(507, 718)}

export default InvoiceLedgerTable;
`;
fs.writeFileSync('frontend/components/Admin/Revenue/InvoiceLedgerTable.jsx', invoiceTable);

// Revenue.jsx
const revenue = `import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMoneyBillWave, faChartLine, faStore } from "@fortawesome/free-solid-svg-icons";
import { api } from "../../src/services/api";
import toast from "react-hot-toast";

import { PageHeading, SkeletonCard, SkeletonChart } from "./Revenue/RevenueShared";
import AdminSummaryCard from "./Revenue/AdminSummaryCard";
import { RevenueBarChart, CollectionHealth } from "./Revenue/RevenueCharts";
import BillingActions from "./Revenue/BillingActions";
import InvoiceLedgerTable from "./Revenue/InvoiceLedgerTable";
import { MONTH_NAMES } from "./Revenue/RevenueConstants";

${slice(722, 835)}
`;
fs.writeFileSync('frontend/components/Admin/Revenue.jsx', revenue);

console.log('Successfully split Revenue.jsx into components and constants');
