import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays, faMoneyBillWave, faChartLine, faStore,
  faDownload, faArrowTrendUp, faSpinner, faTriangleExclamation,
  faFileInvoiceDollar, faClock, faCheckCircle, faFilter, faRefresh,
  faInfoCircle, faLock, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "../../src/services/api";
import toast from "react-hot-toast";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartTooltip,
  PieChart, Pie, Cell, Area, AreaChart,
} from "recharts";

const ACCENT_STYLES = {
  green:  { iconBg: "bg-green-50",  iconColor: "text-green-600",  metaColor: "text-green-600" },
  blue:   { iconBg: "bg-[#EDF3FF]", iconColor: "text-blue-600",   metaColor: "text-blue-600" },
  orange: { iconBg: "bg-[#FFF4EE]", iconColor: "text-[#FF6B1A]",  metaColor: "text-[#FF6B1A]" },
};

function AdminSummaryCard({ accent, icon, title, count, meta, tooltip }) {
  const s = ACCENT_STYLES[accent];
  return (
    <div className="bg-white rounded-[18px] border border-gray-200 py-5 px-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] cursor-default">
      <div className="flex items-start gap-4">
        <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 ${s.iconBg}`}>
          <FontAwesomeIcon icon={icon} className={`text-xl ${s.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] text-gray-500 m-0">{title}</p>
            {tooltip && (
              <div className="relative group">
                <FontAwesomeIcon icon={faInfoCircle} className="text-[11px] text-gray-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-56 bg-gray-900 text-white text-[11px] rounded-lg px-3 py-2 shadow-xl leading-relaxed pointer-events-none">
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            )}
          </div>
          <p className="text-[28px] font-bold text-gray-900 my-1">{count}</p>
          {meta && (
            <p className={`text-xs font-semibold m-0 flex items-center gap-1 ${s.metaColor}`}>
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
              {meta}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[18px] border border-gray-200 py-5 px-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-[52px] h-[52px] rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 pt-1">
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
          <div className="h-7 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-2.5 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="bg-white rounded-[18px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden animate-pulse">
      <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-48" />
      </div>
      <div className="px-6 py-6">
        <div className="h-[220px] bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

function PageCard({ title, action, children }) {
  return (
    <div className="bg-white rounded-[18px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
      {(title || action) && (
        <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
          {title && <h2 className="text-[15px] font-bold text-gray-900 m-0">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function PageHeading({ title, sub }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 m-0">{title}</h1>
      {sub && <p className="text-gray-500 mt-1.5 text-sm mb-0">{sub}</p>}
    </div>
  );
}

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_STYLES = {
  Paid:                   "bg-green-50 text-green-600",
  Dispatched:             "bg-blue-50 text-blue-600",
  "Verification Pending": "bg-amber-50 text-amber-600",
  Overdue:                "bg-red-100 text-red-600",
  Draft:                  "bg-gray-100 text-gray-500",
  Ignored:                "bg-slate-100 text-slate-500",
};

function InvoiceRow({ inv, isLast }) {
  const initials = (inv.shopName || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className={`grid gap-4 items-center py-3.5 px-6 [grid-template-columns:2fr_1fr_1fr_1fr_1fr] ${!isLast ? "border-b border-gray-100" : ""}`}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[11px] font-bold text-green-600 shrink-0">{initials}</div>
        <div>
          <p className="text-[13px] font-bold text-gray-900 m-0">{inv.shopName}</p>
          <p className="text-[11px] text-gray-400 m-0 font-mono">{inv.invoiceReference}</p>
        </div>
      </div>
      <p className="text-[13px] text-gray-700 m-0">{MONTH_NAMES[Number(inv.billingPeriodMonth)]} {inv.billingPeriodYear}</p>
      <p className="text-[13px] font-bold text-gray-900 m-0">
        LKR {Number(inv.totalAmount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
      </p>
      <p className="text-[13px] text-gray-700 m-0">{inv.completedRequests} req.</p>
      <span className={`inline-block rounded-full py-1 px-3 text-xs font-semibold ${STATUS_STYLES[inv.invoiceStatus] || ""}`}>
        {inv.invoiceStatus}
      </span>
    </div>
  );
}

const LINE_COLORS = { Garages: "#16a34a", "Service Centers": "#2563eb", "Spare Parts": "#f97316" };

function fmtY(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return v;
}

function CustomLineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-xl text-[12px] min-w-[170px]">
      <p className="font-bold mb-2 text-gray-300">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.stroke }} />
            {p.name}
          </span>
          <span className="font-semibold">LKR {Number(p.value).toLocaleString()}</span>
        </div>
      ))}
      <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-bold">
        <span>Total</span><span>LKR {Number(total).toLocaleString()}</span>
      </div>
    </div>
  );
}

function RevenueBarChart({ data }) {
  if (!data || data.length === 0) return null;
  const chartData = [...data].slice(0, 12).reverse().map(d => ({
    monthLabel: MONTH_NAMES[Number(d.month)],
    Garages: Number(d.garages || 0),
    "Service Centers": Number(d.serviceCenters || 0),
    "Spare Parts": Number(d.spareParts || 0),
  }));
  return (
    <div className="px-6 pt-2 pb-4">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {Object.entries(LINE_COLORS).map(([key, color]) => (
              <linearGradient key={key} id={`grad-${key.replace(/ /g, "-")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="monthLabel" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={fmtY} width={45} />
          <RechartTooltip content={<CustomLineTooltip />} cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} />
          {Object.entries(LINE_COLORS).map(([key, color]) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#grad-${key.replace(/ /g, "-")})`}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: "#fff" }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-5 justify-center flex-wrap mt-1">
        {Object.entries(LINE_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 inline-block rounded-full" style={{ background: color }} />
            <span className="text-[11px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const HEALTH_CFG = [
  { key: "Paid",                 label: "Paid",      fill: "#16a34a", text: "text-green-600",  bar: "bg-green-500",  pulse: false },
  { key: "Dispatched",           label: "Dispatched",fill: "#2563eb", text: "text-blue-600",   bar: "bg-blue-500",   pulse: false },
  { key: "Verification Pending", label: "Pending",   fill: "#d97706", text: "text-amber-600", bar: "bg-amber-400",  pulse: true  },
  { key: "Overdue",              label: "Overdue",   fill: "#dc2626", text: "text-red-600",   bar: "bg-red-500",   pulse: true  },
];

function CollectionHealth({ health, selectedMonth }) {
  const currentData = useMemo(() => {
     if (selectedMonth === "all") return health?.all_time || {};
     if (selectedMonth === "latest" && health?.months?.length > 0) return health.months[0].data;
     if (selectedMonth === "latest") return health?.all_time || {}; // fallback
     const m = health?.months?.find(m => m.label.startsWith(selectedMonth));
     return m ? m.data : {};
  }, [selectedMonth, health]);

  const rows = HEALTH_CFG.map(cfg => ({
    ...cfg,
    count:  Number(currentData[cfg.key]?.count  || 0),
    amount: Number(currentData[cfg.key]?.amount || 0),
  }));
  const total = rows.reduce((s, r) => s + r.count, 0);
  const pieData = total === 0
    ? [{ name: "Empty", value: 1, fill: "#e5e7eb" }]
    : rows.map(r => ({ name: r.label, value: r.count, fill: r.fill }));

  return (
    <div className="flex flex-col md:flex-row gap-6 px-6 py-5">
      {/* Donut */}
      <div className="flex items-center justify-center shrink-0">
        <PieChart width={180} height={180}>
          <Pie data={pieData} cx={90} cy={90} innerRadius={55} outerRadius={80}
            paddingAngle={total === 0 ? 0 : 3} dataKey="value" stroke="none">
            {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Pie>
          <RechartTooltip
            content={({ active, payload }) =>
              active && payload?.length && total > 0 ? (
                <div className="bg-gray-900 text-white rounded-lg px-3 py-2 text-xs shadow-xl">
                  <span className="font-bold">{payload[0].name}</span>: {payload[0].value}
                </div>
              ) : null
            }
          />
        </PieChart>
      </div>
      {/* 2×2 grid */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {rows.map(r => {
          const pct = total > 0 ? Math.round((r.count / total) * 100) : 0;
          const isUrgent = r.pulse && r.count > 0;
          return (
            <div key={r.key} className={`rounded-[12px] border p-3.5 ${
              r.key === "Overdue" && r.count > 0 ? "border-red-100 bg-red-50/30" : "border-gray-100 bg-gray-50/40"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  {isUrgent && (
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse inline-block`}
                      style={{ background: r.fill }} />
                  )}
                  {r.label}
                </span>
                <span className={`text-xs font-bold ${r.text}`}>{pct}%</span>
              </div>
              <p className={`text-2xl font-extrabold m-0 ${r.text}`}>{r.count}</p>
              <p className="text-[11px] text-gray-400 m-0 mb-2">LKR {r.amount.toLocaleString()}</p>
              <div className="h-1 rounded-full bg-gray-200 overflow-hidden">
                <div className={`h-1 rounded-full ${r.bar}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Modals ───────────────────────────────────────────────────────────────────

function ConfirmModal({ count, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500" />
          </div>
          <h3 className="text-[17px] font-bold text-gray-900 m-0">Confirm Dispatch</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          You are about to dispatch <span className="font-bold text-gray-900">{count}</span> invoice(s).
          Shop owners will receive email notifications and due dates will be locked in.
          <span className="block mt-1 text-red-500 font-semibold">This cannot be undone.</span>
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="py-2 px-5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold border-none cursor-pointer hover:bg-gray-200">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="py-2 px-5 rounded-xl bg-green-600 text-white text-sm font-bold border-none cursor-pointer hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faCheckCircle} />}
            Confirm Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}

function DraftReviewModal({ drafts, onClose, onDispatch }) {
  const total = drafts.reduce((s, d) => s + Number(d.totalAmount || 0), 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col" style={{ maxHeight: "80vh" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-[17px] font-bold text-gray-900 m-0">Review Drafts ({drafts.length})</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border-none cursor-pointer hover:bg-gray-200">
            <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-800 m-0 font-semibold">
            Total: LKR {total.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="grid gap-4 py-2.5 px-6 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] [grid-template-columns:2fr_1fr_1fr_1fr]">
            {["Shop", "Category", "Requests", "Amount"].map(c => <span key={c}>{c}</span>)}
          </div>
          {drafts.map((d, idx) => (
            <div key={d.id} className={`grid gap-4 items-center py-3 px-6 [grid-template-columns:2fr_1fr_1fr_1fr] ${idx < drafts.length - 1 ? "border-b border-gray-100" : ""}`}>
              <p className="text-[13px] font-semibold text-gray-900 m-0 truncate">{d.shopName}</p>
              <p className="text-[12px] text-gray-500 m-0">{d.categoryName}</p>
              <p className="text-[13px] text-gray-700 m-0">{d.completedRequests}</p>
              <p className="text-[13px] font-bold text-gray-900 m-0">LKR {Number(d.totalAmount).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="py-2 px-5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold border-none cursor-pointer hover:bg-gray-200">Close</button>
          <button onClick={onDispatch} className="py-2 px-5 rounded-xl bg-green-600 text-white text-sm font-bold border-none cursor-pointer hover:bg-green-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} /> Dispatch All
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Billing Action Panel ────────────────────────────────────────────────────

function BillingActions({ analytics, onRefresh }) {
  const [year, setYear]   = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState("");
  const [drafts, setDrafts]   = useState([]);
  const [showReview,  setShowReview]  = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadDrafts = async () => {
    try {
      const res = await api.get("admin/getDraftInvoices.php", { year, month });
      setDrafts(res.data || []);
    } catch { /* silent */ }
  };

  useEffect(() => { loadDrafts(); }, [year, month]);

  const doGenerate = async () => {
    setLoading("generate");
    try {
      const res = await api.post("admin/generateDraftInvoices.php", { year, month });
      toast.success(`${res.invoicesCreated} draft invoice(s) generated.`);
      loadDrafts();
      if (onRefresh) onRefresh();
    } catch (err) { toast.error(err.message || "Action failed."); }
    finally { setLoading(""); }
  };

  const doDispatch = async () => {
    setLoading("dispatch");
    try {
      const res = await api.post("admin/dispatchInvoices.php", { year, month });
      toast.success(`${res.dispatched} invoice(s) dispatched. ${res.emailsSent} email(s) sent.`);
      setShowConfirm(false); setShowReview(false);
      loadDrafts();
      if (onRefresh) onRefresh();
    } catch (err) { toast.error(err.message || "Action failed."); }
    finally { setLoading(""); }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years  = [new Date().getFullYear() - 1, new Date().getFullYear()];
  const draftList     = drafts.filter(d => d.invoiceStatus === "Draft");
  const hasDrafts     = draftList.length > 0;
  const hasDispatched = drafts.some(d => d.invoiceStatus !== "Draft");

  // Stepper state: 1=done, 2=active|done, 3=locked|active
  const step2Done   = hasDrafts || hasDispatched;
  const step3Active = hasDrafts;

  const StepDot = ({ n, done, active, locked }) => (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        done   ? "bg-green-100 text-green-600" :
        active ? "bg-blue-600 text-white" :
        locked ? "bg-gray-100 text-gray-400" : "bg-gray-100 text-gray-400"
      }`}>
        {done ? <FontAwesomeIcon icon={faCheckCircle} /> : locked ? <FontAwesomeIcon icon={faLock} className="text-[10px]" /> : n}
      </div>
      <span className={`text-xs font-semibold ${
        done ? "text-green-600" : active ? "text-blue-600" : "text-gray-400"
      }`}>{n === 1 ? "Select Period" : n === 2 ? "Generate Drafts" : "Dispatch"}</span>
    </div>
  );

  return (
    <>
      {showConfirm && (
        <ConfirmModal count={draftList.length} loading={loading === "dispatch"}
          onCancel={() => setShowConfirm(false)} onConfirm={doDispatch} />
      )}
      {showReview && (
        <DraftReviewModal drafts={draftList} onClose={() => setShowReview(false)}
          onDispatch={() => { setShowReview(false); setShowConfirm(true); }} />
      )}
      <PageCard title="Billing Cycle Actions">
        {/* Stepper */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-3 border-b border-gray-100">
          <StepDot n={1} done />
          <div className="flex-1 h-px bg-gray-200" />
          <StepDot n={2} done={hasDispatched} active={!hasDispatched} />
          <div className="flex-1 h-px bg-gray-200" />
          <StepDot n={3} done={hasDispatched} active={step3Active && !hasDispatched} locked={!step3Active && !hasDispatched} />
        </div>
        <div className="px-6 py-5 bg-gradient-to-br from-slate-50 to-blue-50/40 border-b border-gray-100">
          <div className="flex flex-wrap items-end gap-4">
            {/* Period selectors */}
            <div className="flex gap-3">
              <div>
                <label className="block text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">Year</label>
                <select value={year} onChange={e => setYear(Number(e.target.value))}
                  className="border-2 border-gray-200 focus:border-blue-400 rounded-xl py-2.5 px-4 text-sm font-semibold text-gray-800 outline-none bg-white shadow-sm transition-colors cursor-pointer">
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">Month</label>
                <select value={month} onChange={e => setMonth(Number(e.target.value))}
                  className="border-2 border-gray-200 focus:border-blue-400 rounded-xl py-2.5 px-4 text-sm font-semibold text-gray-800 outline-none bg-white shadow-sm transition-colors cursor-pointer">
                  {months.map(m => <option key={m} value={m}>{MONTH_NAMES[m]}</option>)}
                </select>
              </div>
            </div>
            {/* Divider */}
            <div className="w-px h-9 bg-gray-200 self-center hidden sm:block" />
            {/* Generate Drafts */}
            <button disabled={!!loading || hasDispatched} onClick={doGenerate}
              className="py-2.5 px-6 rounded-xl bg-blue-600 text-white text-sm font-bold border-none cursor-pointer hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all duration-150">
              {loading === "generate" ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faFileInvoiceDollar} />}
              Generate Drafts
            </button>
            {/* Review Drafts */}
            {hasDrafts && (
              <button onClick={() => setShowReview(true)}
                className="py-2.5 px-6 rounded-xl bg-white text-blue-700 text-sm font-bold border-2 border-blue-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 active:scale-95 flex items-center gap-2 shadow-sm transition-all duration-150">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-extrabold">{draftList.length}</span>
                Review Drafts
              </button>
            )}
            {/* Dispatch */}
            <button disabled={!!loading || !hasDrafts} onClick={() => setShowConfirm(true)}
              className="py-2.5 px-6 rounded-xl bg-green-600 text-white text-sm font-bold border-none cursor-pointer hover:bg-green-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_4px_14px_rgba(22,163,74,0.35)] transition-all duration-150">
              <FontAwesomeIcon icon={faCheckCircle} /> Dispatch Invoices
            </button>
          </div>
        </div>
      </PageCard>
    </>
  );
}

// ── Invoice Ledger Table ──────────────────────────────────────────────────

const PAGE_SIZE = 10;

function InvoiceLedgerTable({ refreshKey }) {
  const [invoices, setInvoices] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [page, setPage] = useState(1);

  // Filters
  const thisYear  = new Date().getFullYear();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear,   setFilterYear]   = useState(thisYear.toString());
  const [filterMonth,  setFilterMonth]  = useState((new Date().getMonth() + 1).toString());

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterYear)   params.year   = filterYear;
      if (filterMonth)  params.month  = filterMonth;
      const res = await api.get("admin/getAllInvoices.php", params);
      setInvoices(res.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); setPage(1); }, [filterStatus, filterYear, filterMonth, refreshKey]);

  // CSV export
  const exportCSV = () => {
    if (!invoices.length) return;
    const headers = ["Invoice Ref", "Shop", "Category", "Period", "Requests", "Rate (LKR)", "Amount (LKR)", "Status", "Due Date"];
    const rows = invoices.map(inv => [
      inv.invoiceReference,
      `"${inv.shopName}"`,
      inv.shopCategory,
      `${MONTH_NAMES[Number(inv.billingPeriodMonth)]} ${inv.billingPeriodYear}`,
      inv.completedRequests,
      Number(inv.rateSnapshot).toFixed(2),
      Number(inv.totalAmount).toFixed(2),
      inv.invoiceStatus,
      inv.dueDate || "",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `fixgo_ledger_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const months = ["", ...Array.from({ length: 12 }, (_, i) => MONTH_NAMES[i + 1])];
  const years  = ["", thisYear - 1, thisYear, thisYear + 1];
  const statuses = ["", "Draft", "Dispatched", "Verification Pending", "Paid", "Overdue", "Ignored"];

  return (
    <PageCard
      title="Invoice Ledger — All Shops"
      action={
        <button
          onClick={exportCSV}
          disabled={!invoices.length}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-[10px] border-none bg-gray-900 text-sm font-semibold text-white cursor-pointer hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FontAwesomeIcon icon={faDownload} className="text-[11px]" /> Export CSV
        </button>
      }
    >
      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-4 px-6 py-5 border-b border-gray-100 bg-gradient-to-br from-slate-50 to-gray-50/60">
        <div>
          <label className="block text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className={`border-2 rounded-xl py-2.5 px-4 text-sm font-semibold outline-none cursor-pointer shadow-sm transition-colors ${
              filterStatus ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-800"
            }`}
          >
            <option value="">All Statuses</option>
            {statuses.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">Year</label>
          <select
            value={filterYear}
            onChange={e => { setFilterYear(e.target.value); setPage(1); }}
            className={`border-2 rounded-xl py-2.5 px-4 text-sm font-semibold outline-none cursor-pointer shadow-sm transition-colors ${
              filterYear ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-800"
            }`}
          >
            <option value="">All Years</option>
            {years.filter(Boolean).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">Month</label>
          <select
            value={filterMonth}
            onChange={e => { setFilterMonth(e.target.value); setPage(1); }}
            className={`border-2 rounded-xl py-2.5 px-4 text-sm font-semibold outline-none cursor-pointer shadow-sm transition-colors ${
              filterMonth ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-800"
            }`}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{MONTH_NAMES[i + 1]}</option>
            ))}
          </select>
        </div>
        {(filterStatus || filterYear || filterMonth) && (
          <div className="self-end">
            <button
              onClick={() => { setFilterStatus(""); setFilterYear(""); setFilterMonth(""); setPage(1); }}
              className="py-2.5 px-5 rounded-xl border-2 border-red-200 bg-white text-red-500 text-sm font-bold cursor-pointer hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all duration-150 shadow-sm"
            >
              ✕ Clear
            </button>
          </div>
        )}
        <div className="ml-auto self-end">
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-[12px] font-bold rounded-full px-3.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
            {invoices.length} records
          </span>
        </div>
      </div>

      {/* Table header */}
      <div className="grid gap-3 py-2.5 px-6 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] [grid-template-columns:2.5fr_1fr_1fr_1fr_1fr_1fr]">
        {["Shop / Reference", "Period", "Category", "Requests", "Amount", "Status"].map(c => <span key={c}>{c}</span>)}
      </div>

      {/* Rows */}
      {loading ? (
        <div className="py-14 flex justify-center text-gray-400">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="py-14 flex flex-col items-center gap-2 text-gray-400">
          <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-3xl" />
          <p className="text-sm">No invoices found for the selected filters.</p>
        </div>
      ) : (
        <>
          {invoices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((inv, idx, arr) => {
            const initials = (inv.shopName || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
            const isUrgentStatus = inv.invoiceStatus === "Overdue" || inv.invoiceStatus === "Verification Pending";
            return (
              <div
                key={inv.id}
                className={`grid gap-3 items-center py-3.5 px-6 [grid-template-columns:2.5fr_1fr_1fr_1fr_1fr_1fr] ${
                  idx < arr.length - 1 ? "border-b border-gray-100" : ""
                } hover:bg-gray-50/60 transition-colors`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[11px] font-bold text-green-600 shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 m-0 truncate">{inv.shopName}</p>
                    <p className="text-[11px] text-gray-400 m-0 font-mono">{inv.invoiceReference}</p>
                  </div>
                </div>
                <p className="text-[13px] text-gray-700 m-0">
                  {MONTH_NAMES[Number(inv.billingPeriodMonth)]} {inv.billingPeriodYear}
                </p>
                <p className="text-[12px] text-gray-500 m-0">{inv.shopCategory}</p>
                <p className="text-[13px] text-gray-700 m-0">{inv.completedRequests}</p>
                <p className="text-[13px] font-bold text-gray-900 m-0">
                  LKR {Number(inv.totalAmount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                </p>
                <span className={`inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 text-xs font-semibold ${STATUS_STYLES[inv.invoiceStatus] || ""}` }>
                  {isUrgentStatus && (
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                      style={{ background: inv.invoiceStatus === "Overdue" ? "#dc2626" : "#d97706" }} />
                  )}
                  {inv.invoiceStatus}
                </span>
              </div>
            );
          })}
          {/* Pagination */}
          {invoices.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/40">
              <span className="text-xs text-gray-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, invoices.length)} of {invoices.length} records
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="py-1.5 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >Previous</button>
                <span className="text-xs text-gray-500 font-medium">Page {page} of {Math.ceil(invoices.length / PAGE_SIZE)}</span>
                <button
                  disabled={page >= Math.ceil(invoices.length / PAGE_SIZE)}
                  onClick={() => setPage(p => p + 1)}
                  className="py-1.5 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </PageCard>
  );
}

// ── Main Revenue Component ──────────────────────────────────────────────────

function Revenue() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [healthMonth, setHealthMonth] = useState("latest");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("admin/getAnalytics.php");
      setAnalytics(res.data);
    } catch {
      toast.error("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRefresh = () => {
    load();
    setRefreshKey(prev => prev + 1);
  };

  const kpis = analytics?.kpis || {};

  const calendarMonths = Array.from({ length: 12 }, (_, i) => MONTH_NAMES[i + 1]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <PageHeading title="Revenue & Ledger" sub="Monthly billing and commission tracking across all shops." />
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <FontAwesomeIcon icon={faClock} /> Refresh
        </button>
      </div>

      {loading ? (
        <>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
          <SkeletonChart />
          <SkeletonChart />
        </>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <AdminSummaryCard
              accent="green" icon={faMoneyBillWave}
              title="Projected Revenue (This Month)"
              count={`LKR ${Number(kpis.projectedRevenue || 0).toLocaleString()}`}
              tooltip="Based on completed requests this month × active category rates"
            />
            <AdminSummaryCard
              accent="blue" icon={faChartLine}
              title="Monthly Recurring Revenue (MRR)"
              count={`LKR ${Number(kpis.mrr || 0).toLocaleString()}`}
              meta="Spare parts shops flat fee"
              tooltip="Flat subscription fees from active Spare Part shops only"
            />
            <AdminSummaryCard
              accent="orange" icon={faStore}
              title="Active Shops"
              count={kpis.activeShops || 0}
              meta="Billed this cycle"
              tooltip="Verified shops currently listed on the platform"
            />

          </div>

          {/* Revenue bar chart */}
          <PageCard title="Revenue Trend (Last 12 Months)">
            <RevenueBarChart data={analytics?.revenueChart} />
          </PageCard>

          {/* Collection health */}
          <PageCard 
            title="Collection Health"
            action={
              <select 
                className="text-[13px] border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 text-gray-700 font-semibold cursor-pointer outline-none hover:bg-gray-100 transition-colors" 
                value={healthMonth} 
                onChange={e => setHealthMonth(e.target.value)}
              >
                 <option value="latest">Latest Month</option>
                 <option value="all">All Time</option>
                 {calendarMonths.map(m => (
                    <option key={m} value={m}>{m}</option>
                 ))}
              </select>
            }
          >
            <CollectionHealth health={analytics?.collectionHealth} selectedMonth={healthMonth} />
          </PageCard>

          {/* Billing action panel */}
          <BillingActions analytics={analytics} onRefresh={handleRefresh} />

          {/* Full invoice ledger */}
          <InvoiceLedgerTable refreshKey={refreshKey} />
        </>
      )}
    </div>
  );
}

export default Revenue;
