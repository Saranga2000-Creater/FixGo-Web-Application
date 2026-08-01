import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays, faMoneyBillWave, faChartLine, faStore,
  faDownload, faArrowTrendUp, faSpinner, faTriangleExclamation,
  faFileInvoiceDollar, faClock, faCheckCircle, faFilter, faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "../../src/services/api";
import toast from "react-hot-toast";

const ACCENT_STYLES = {
  green:  { iconBg: "bg-green-50",  iconColor: "text-green-600",  metaColor: "text-green-600" },
  blue:   { iconBg: "bg-[#EDF3FF]", iconColor: "text-blue-600",   metaColor: "text-blue-600" },
  orange: { iconBg: "bg-[#FFF4EE]", iconColor: "text-[#FF6B1A]",  metaColor: "text-[#FF6B1A]" },
};

function AdminSummaryCard({ accent, icon, title, count, meta }) {
  const s = ACCENT_STYLES[accent];
  return (
    <div className="bg-white rounded-[18px] border border-gray-200 py-5 px-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-start gap-4">
        <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 ${s.iconBg}`}>
          <FontAwesomeIcon icon={icon} className={`text-xl ${s.iconColor}`} />
        </div>
        <div>
          <p className="text-[13px] text-gray-500 m-0">{title}</p>
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

// Simple bar chart using pure divs (no extra lib needed)
function RevenueBarChart({ data }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => (d.garages || 0) + (d.serviceCenters || 0) + (d.spareParts || 0)), 1);

  return (
    <div className="px-6 pt-4 pb-6">
      <div className="flex items-end gap-2 h-[140px]">
        {data.slice(-12).map((d, i) => {
          const total = (d.garages || 0) + (d.serviceCenters || 0) + (d.spareParts || 0);
          const pct = (total / maxVal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
                <div
                  className="w-full rounded-t-[4px] bg-gradient-to-t from-green-600 to-green-400 transition-all duration-500"
                  style={{ height: `${pct}%`, minHeight: total > 0 ? "4px" : "0" }}
                  title={`LKR ${total.toLocaleString()}`}
                />
              </div>
              <span className="text-[9px] text-gray-400 font-medium">{MONTH_NAMES[Number(d.month)]}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 justify-center flex-wrap">
        {[["from-green-600 to-green-400", "Garages"], ["from-blue-600 to-blue-400", "Service Centers"], ["from-orange-500 to-orange-300", "Spare Parts"]].map(([g, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm bg-gradient-to-br ${g}`} />
            <span className="text-[11px] text-gray-500">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Collection Health Pill Row
function CollectionHealth({ health }) {
  const items = [
    { key: "Paid",                   label: "Paid",       color: "bg-green-100 text-green-700" },
    { key: "Dispatched",             label: "Dispatched", color: "bg-blue-100 text-blue-700"  },
    { key: "Verification Pending",   label: "Pending",    color: "bg-amber-100 text-amber-700" },
    { key: "Overdue",                label: "Overdue",    color: "bg-red-100 text-red-700"    },
  ];
  return (
    <div className="flex flex-wrap gap-3 px-6 py-4">
      {items.map(({ key, label, color }) => {
        const d = health[key];
        if (!d) return null;
        return (
          <div key={key} className={`rounded-[10px] px-4 py-3 ${color}`}>
            <p className="text-xs font-bold m-0">{label}</p>
            <p className="text-lg font-extrabold m-0">{d.count}</p>
            <p className="text-[11px] m-0 opacity-80">LKR {Number(d.amount).toLocaleString()}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── Billing Action Panel ────────────────────────────────────────────────────

function BillingActions({ analytics }) {
  const [year, setYear]   = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState("");
  const [drafts, setDrafts]   = useState([]);

  const run = async (action) => {
    setLoading(action);
    try {
      if (action === "generate") {
        const res = await api.post("admin/generateDraftInvoices.php", { year, month });
        toast.success(`${res.invoicesCreated} draft invoice(s) generated.`);
        loadDrafts();
      } else if (action === "dispatch") {
        const res = await api.post("admin/dispatchInvoices.php", { year, month });
        toast.success(`${res.dispatched} invoice(s) dispatched. ${res.emailsSent} email(s) sent.`);
        loadDrafts();
      }
    } catch (err) {
      toast.error(err.message || "Action failed.");
    } finally {
      setLoading("");
    }
  };

  const loadDrafts = async () => {
    try {
      const res = await api.get("admin/getDraftInvoices.php", { year, month });
      setDrafts(res.data || []);
    } catch { /* silent */ }
  };

  useEffect(() => { loadDrafts(); }, [year, month]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years  = [new Date().getFullYear() - 1, new Date().getFullYear()];

  const hasDrafts    = drafts.some(d => d.invoiceStatus === "Draft");
  const hasDispatched = drafts.some(d => d.invoiceStatus !== "Draft");

  return (
    <PageCard title="Billing Cycle Actions">
      <div className="px-6 py-4 flex flex-wrap items-end gap-4">
        {/* Period selectors */}
        <div className="flex gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Year</label>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="border border-gray-200 rounded-[10px] py-2.5 px-3 text-sm outline-none bg-white"
            >
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Month</label>
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="border border-gray-200 rounded-[10px] py-2.5 px-3 text-sm outline-none bg-white"
            >
              {months.map(m => <option key={m} value={m}>{MONTH_NAMES[m]}</option>)}
            </select>
          </div>
        </div>

        {/* Generate Drafts */}
        <button
          disabled={!!loading || hasDispatched}
          onClick={() => run("generate")}
          className="py-2.5 px-5 rounded-[10px] bg-blue-600 text-white text-sm font-bold border-none cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading === "generate" ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faFileInvoiceDollar} />}
          Generate Drafts
        </button>

        {/* Preview drafts count */}
        {hasDrafts && (
          <div className="text-sm text-blue-600 font-semibold">
            {drafts.filter(d => d.invoiceStatus === "Draft").length} draft(s) ready to dispatch
          </div>
        )}

        {/* Dispatch */}
        <button
          disabled={!!loading || !hasDrafts}
          onClick={() => run("dispatch")}
          className="py-2.5 px-5 rounded-[10px] bg-green-600 text-white text-sm font-bold border-none cursor-pointer hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading === "dispatch" ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faCheckCircle} />}
          Dispatch Invoices
        </button>
      </div>

      {/* Draft preview table */}
      {drafts.length > 0 && (
        <>
          <div className="border-t border-gray-100">
            <div className="grid gap-4 py-2.5 px-6 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] [grid-template-columns:2fr_1fr_1fr_1fr]">
              {["Shop", "Category", "Requests", "Amount"].map(c => <span key={c}>{c}</span>)}
            </div>
            {drafts.map((d, idx) => (
              <div key={d.id} className={`grid gap-4 items-center py-3 px-6 [grid-template-columns:2fr_1fr_1fr_1fr] ${idx < drafts.length - 1 ? "border-b border-gray-100" : ""}`}>
                <p className="text-[13px] font-semibold text-gray-900 m-0">{d.shopName}</p>
                <p className="text-[12px] text-gray-500 m-0">{d.shopCategory}</p>
                <p className="text-[13px] text-gray-700 m-0">{d.completedRequests}</p>
                <p className="text-[13px] font-bold text-gray-900 m-0">
                  LKR {Number(d.totalAmount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </PageCard>
  );
}

// ── Invoice Ledger Table ──────────────────────────────────────────────────

function InvoiceLedgerTable() {
  const [invoices, setInvoices] = useState([]);
  const [loading,  setLoading]  = useState(false);

  // Filters
  const thisYear  = new Date().getFullYear();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear,   setFilterYear]   = useState("");
  const [filterMonth,  setFilterMonth]  = useState("");

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

  useEffect(() => { load(); }, [filterStatus, filterYear, filterMonth]);

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
  const statuses = ["", "Draft", "Dispatched", "Verification Pending", "Paid", "Overdue"];

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
      <div className="flex flex-wrap gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
          <FontAwesomeIcon icon={faFilter} /> Filters
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-[8px] py-1.5 px-3 text-sm outline-none bg-white text-gray-700"
        >
          <option value="">All Statuses</option>
          {statuses.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterYear}
          onChange={e => setFilterYear(e.target.value)}
          className="border border-gray-200 rounded-[8px] py-1.5 px-3 text-sm outline-none bg-white text-gray-700"
        >
          <option value="">All Years</option>
          {years.filter(Boolean).map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
          className="border border-gray-200 rounded-[8px] py-1.5 px-3 text-sm outline-none bg-white text-gray-700"
        >
          <option value="">All Months</option>
          {months.filter(Boolean).map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        {(filterStatus || filterYear || filterMonth) && (
          <button
            onClick={() => { setFilterStatus(""); setFilterYear(""); setFilterMonth(""); }}
            className="text-xs text-gray-500 underline cursor-pointer border-none bg-transparent"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{invoices.length} record(s)</span>
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
        invoices.map((inv, idx) => {
          const initials = (inv.shopName || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
          return (
            <div
              key={inv.id}
              className={`grid gap-3 items-center py-3.5 px-6 [grid-template-columns:2.5fr_1fr_1fr_1fr_1fr_1fr] ${
                idx < invoices.length - 1 ? "border-b border-gray-100" : ""
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
              <span className={`inline-block rounded-full py-1 px-2.5 text-xs font-semibold ${STATUS_STYLES[inv.invoiceStatus] || ""}` }>
                {inv.invoiceStatus}
              </span>
            </div>
          );
        })
      )}
    </PageCard>
  );
}

// ── Main Revenue Component ──────────────────────────────────────────────────

function Revenue() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

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

  const kpis = analytics?.kpis || {};

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <PageHeading title="Revenue & Ledger" sub="Monthly billing and commission tracking across all shops." />
        <button
          onClick={load}
          className="flex items-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <FontAwesomeIcon icon={faClock} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl" />
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <AdminSummaryCard
              accent="green" icon={faMoneyBillWave}
              title="Projected Revenue (This Month)"
              count={`LKR ${Number(kpis.projectedRevenue || 0).toLocaleString()}`}
            />
            <AdminSummaryCard
              accent="blue" icon={faChartLine}
              title="Monthly Recurring Revenue (MRR)"
              count={`LKR ${Number(kpis.mrr || 0).toLocaleString()}`}
              meta="Spare parts shops flat fee"
            />
            <AdminSummaryCard
              accent="orange" icon={faStore}
              title="Active Shops"
              count={kpis.activeShops || 0}
              meta="Billed this cycle"
            />
          </div>

          {/* Revenue bar chart */}
          <PageCard title="Revenue Trend (Last 12 Months)">
            <RevenueBarChart data={analytics?.revenueChart} />
          </PageCard>

          {/* Collection health */}
          <PageCard title="Collection Health">
            <CollectionHealth health={analytics?.collectionHealth || {}} />
          </PageCard>

          {/* Billing action panel */}
          <BillingActions analytics={analytics} />

          {/* Full invoice ledger */}
          <InvoiceLedgerTable />
        </>
      )}
    </div>
  );
}

export default Revenue;
