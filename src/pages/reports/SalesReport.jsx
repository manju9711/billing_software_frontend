import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Receipt,
  Download,
  Filter,
  X,
  FileDown,
  TrendingUp,
} from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ─── Inject Styles ─────────────────────────────────────────── */
function useStyles() {
  useEffect(() => {
    const id = "reports-styles-v2";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      .rp * { box-sizing: border-box; }
      @keyframes rp-in {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: none; }
      }
      @keyframes fadeSlide {
        from { opacity: 0; transform: translateY(-8px); }
        to   { opacity: 1; transform: none; }
      }
      .rp-row { transition: background .15s; cursor: pointer; font-size:12px; }
      .rp-row:hover td { background: #f5f7ff !important; }
      .rp-view-btn { transition: all .18s; }
      .rp-pg-btn  { transition: all .18s; }
      .rp-pg-btn:hover:not(:disabled) { background: #e0e7ff !important; color: #4338ca !important; }
      .rp-search:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.1) !important; }
      .rp-card   { animation: rp-in .4s ease both; }
      .filter-panel { animation: fadeSlide .25s ease both; }
      .rp-filter-input:focus {
        border-color: #6366f1 !important;
        box-shadow: 0 0 0 3px rgba(99,102,241,.08) !important;
        outline: none;
      }
      .rp-dl-btn:hover { opacity: .88; transform: translateY(-1px); }
      .rp-dl-btn { transition: all .18s; }
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
}

/* ─── Constants ──────────────────────────────────────────────── */
const FONT  = "'Plus Jakarta Sans', sans-serif";
const INDIGO = "#4338ca";

const PAYMENT_METHODS = ["all", "cash", "online", "upi", "credit"];
const PAYMENT_STATUSES = ["all", "paid", "not_paid", "overdue"];

const STATUS_LABEL = {
  all: "All Status",
  paid: "Paid",
  not_paid: "Not Paid",
  overdue: "Overdue",
};
const METHOD_LABEL = {
  all: "All Methods",
  cash: "Cash",
  online: "Online",
  upi: "UPI",
  credit: "Credit",
};

/* ─── Summary Card ───────────────────────────────────────────── */
function SummaryCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e0e7ff",
      borderRadius: 16,
      padding: "14px 20px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      minWidth: 170,
      flex: 1,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b" }}>{value}</div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Reports() {
  useStyles();
  const navigate = useNavigate();

  /* state */
  const [invoices,    setInvoices]    = useState([]);
  const [summary,     setSummary]     = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [search,      setSearch]      = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter,  setShowFilter]  = useState(false);

  /* filter fields */
  const [fromDate,       setFromDate]       = useState("");
  const [toDate,         setToDate]         = useState("");
  const [paymentMethod,  setPaymentMethod]  = useState("all");
  const [paymentStatus,  setPaymentStatus]  = useState("all");
  const [customerFilter, setCustomerFilter] = useState("");

  /* applied badge count */
  const appliedCount = [
    fromDate || toDate,
    paymentMethod !== "all",
    paymentStatus !== "all",
    customerFilter,
  ].filter(Boolean).length;

  const recordsPerPage = 10;

  /* ── fetch ── */
  const fetchFiltered = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.company_id) return;
      const res = await api.post("/invoice/get_filtered_invoices.php", {
        company_id:     user.company_id,
        from_date:      filters.fromDate      ?? fromDate,
        to_date:        filters.toDate        ?? toDate,
        payment_method: filters.paymentMethod ?? paymentMethod,
        payment_status: filters.paymentStatus ?? paymentStatus,
        customer_name:  filters.customerFilter ?? customerFilter,
      });
      if (res.data.status) {
        setInvoices(res.data.data);
        setSummary(res.data.summary);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, paymentMethod, paymentStatus, customerFilter]);

  /* initial load — fetch all */
  useEffect(() => { fetchFiltered(); }, []); // eslint-disable-line

  /* ── search (client-side within filtered results) ── */
  const filtered = invoices.filter(inv =>
    inv.invoice_no?.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer_phone?.includes(search)
  );

  /* ── pagination ── */
  const totalPages   = Math.ceil(filtered.length / recordsPerPage);
  const indexOfFirst = (currentPage - 1) * recordsPerPage;
  const current      = filtered.slice(indexOfFirst, indexOfFirst + recordsPerPage);
  const pages        = Array.from({ length: totalPages }, (_, i) => i + 1);
  const goTo         = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  /* ── apply filter ── */
  const applyFilter = () => {
    fetchFiltered();
  };

  /* ── reset filter ── */
  const resetFilter = () => {
    setFromDate("");
    setToDate("");
    setPaymentMethod("all");
    setPaymentStatus("all");
    setCustomerFilter("");
    fetchFiltered({
      fromDate: "", toDate: "",
      paymentMethod: "all", paymentStatus: "all", customerFilter: "",
    });
   
  };

  /* ── Excel download ── */
  const downloadExcel = (rows, label) => {
    if (!rows.length) { alert("No data to export"); return; }
    // const excelData = rows.map((inv, i) => ({
    //   "S.No":                i + 1,
    //   "Invoice No":          inv.invoice_no,
    //   "Customer Name":       inv.customer_name,
    //   "Phone":               inv.customer_phone,
    //   "Invoice Generated By": inv.cashier_name || "-",
    //   "Payment Method":      inv.payment_method,
    //   "Payment Status":      inv.payment_status,
    //   "Total Amount":        `₹${Number(inv.total_amount).toLocaleString()}`,
    //   "Paid Amount":         `₹${Number(inv.paid_amount).toLocaleString()}`,
    //   "Balance Amount":      `₹${Number(inv.balance_amount).toLocaleString()}`,
    //   "Date":                inv.created_at,
    // }));
    const excelData = rows.map((inv, i) => ({
  "S.No": i + 1,
  "Invoice No": inv.invoice_no,
  "Customer Name": inv.customer_name,
  "Phone": inv.customer_phone,
  "GST Number": inv.gstin || "-",
  "Invoice Generated By": inv.cashier_name || "-",
  "Payment Method": inv.payment_method,
  "Payment Status": inv.payment_status,
  "Total Amount": `₹${Number(inv.total_amount).toLocaleString()}`,
  "Paid Amount": `₹${Number(inv.paid_amount).toLocaleString()}`,
  "Balance Amount": `₹${Number(inv.balance_amount).toLocaleString()}`,
  "Date": inv.created_at,
}));
    const ws = XLSX.utils.json_to_sheet(excelData);
    // ws["!cols"] = [
    //   { wch: 6 }, { wch: 20 }, { wch: 28 }, { wch: 16 },
    //   { wch: 22 }, { wch: 16 }, { wch: 16 },
    //   { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 22 },
    // ];

    ws["!cols"] = [
  { wch: 6 },   // S.No
  { wch: 20 },  // Invoice No
  { wch: 28 },  // Customer
  { wch: 16 },  // Phone
  { wch: 22 },  // GST Number
  { wch: 22 },  // Generated By
  { wch: 16 },  // Method
  { wch: 16 },  // Status
  { wch: 16 },  // Total
  { wch: 16 },  // Paid
  { wch: 16 },  // Balance
  { wch: 22 },  // Date
];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice Report");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `invoice_report_${label}.xlsx`
    );
  };

  /* ── PDF download ── */
  const downloadPDF = (rows, label) => {
    if (!rows.length) { alert("No data to export"); return; }
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.setTextColor(67, 56, 202);
    doc.text("Invoice Report", 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}   |   Filter: ${label}`, 14, 23);

    autoTable(doc, {
      startY: 28,
      head: [[
        "#", "Invoice No", "Customer", "Phone",
        "Method", "Status", "Total", "Paid", "Balance", "Date"
      ]],
      body: rows.map((inv, i) => [
        i + 1,
        inv.invoice_no,
        inv.customer_name,
        inv.customer_phone,
        inv.payment_method,
        inv.payment_status,
        `₹${Number(inv.total_amount).toLocaleString()}`,
        `₹${Number(inv.paid_amount).toLocaleString()}`,
        `₹${Number(inv.balance_amount).toLocaleString()}`,
        inv.created_at?.split(" ")[0] || "",
      ]),
      headStyles: {
        fillColor: [67, 56, 202],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [238, 242, 255] },
      styles: { cellPadding: 3 },
    });

    /* Summary footer */
    const finalY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(9);
    doc.setTextColor(67, 56, 202);
    doc.text(
      `Total: ${rows.length} invoices  |  ` +
      `Amount: ₹${rows.reduce((s, r) => s + Number(r.total_amount), 0).toLocaleString()}  |  ` +
      `Paid: ₹${rows.reduce((s, r) => s + Number(r.paid_amount), 0).toLocaleString()}  |  ` +
      `Pending: ₹${rows.reduce((s, r) => s + Number(r.balance_amount), 0).toLocaleString()}`,
      14, finalY
    );

    doc.save(`invoice_report_${label}.pdf`);
  };

  /* ── build filter label for filename ── */
  const filterLabel = () => {
    const parts = [];
    if (fromDate) parts.push(`from_${fromDate}`);
    if (toDate)   parts.push(`to_${toDate}`);
    if (paymentMethod !== "all") parts.push(paymentMethod);
    if (paymentStatus !== "all") parts.push(paymentStatus);
    return parts.length ? parts.join("_") : "all";
  };

  /* ── styles ── */
  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e0e7ff",
    borderRadius: 10,
    fontSize: 12,
    fontFamily: FONT,
    background: "#fff",
    color: "#1e1b4b",
  };

  const selectStyle = { ...inputStyle, cursor: "pointer" };

  const btnPrimary = {
    background: INDIGO,
    border: "none",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT,
    display: "flex",
    alignItems: "center",
    gap: 7,
  };

  /* ── payment method badge color ── */
  const methodBadge = (m) => {
    const map = {
      cash:   { bg: "#dcfce7", color: "#15803d" },
      online: { bg: "#dbeafe", color: "#1d4ed8" },
      upi:    { bg: "#f3e8ff", color: "#7e22ce" },
      credit: { bg: "#fef3c7", color: "#b45309" },
    };
    return map[m?.toLowerCase()] || { bg: "#fee2e2", color: "#dc2626" };
  };

 const statusBadge = (s) => {
  const map = {
    paid:     { bg: "#dcfce7", color: "#15803d" },
    not_paid: { bg: "#fee2e2", color: "#dc2626" },
    overdue:  { bg: "#fef3c7", color: "#b45309" },
  };

  return map[s?.toLowerCase()] || {
    bg: "#f1f5f9",
    color: "#64748b",
  };
};

  /* ── render ── */
  return (
    <div className="rp" style={{ fontFamily: FONT, padding: "22px 26px" }}>

      {/* ── HEADER ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20, flexWrap: "wrap", gap: 14,
      }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 22 }}>🧾</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1e1b4b" }}>
              Invoice Reports
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
              Advanced filter — search, download PDF & Excel
            </p>
          </div>
        </div>

        {/* Download buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="rp-dl-btn"
            onClick={() => downloadExcel(filtered, filterLabel())}
            style={{ ...btnPrimary, background: "#16a34a" }}
          >
            <Download size={14} /> Excel
          </button>
          <button
            className="rp-dl-btn"
            onClick={() => downloadPDF(filtered, filterLabel())}
            style={{ ...btnPrimary, background: "#dc2626" }}
          >
            <FileDown size={14} /> PDF
          </button>
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      {summary && (
        <div style={{
          display: "flex", gap: 12,
          flexWrap: "wrap", marginBottom: 20,
        }}>
          <SummaryCard
            label="Total Invoices"
            value={summary.total_invoices}
            color="#4338ca"
            icon={<Receipt size={18} color="#4338ca" />}
          />
          <SummaryCard
            label="Total Amount"
            value={`₹${Number(summary.total_amount).toLocaleString()}`}
            color="#0891b2"
            icon={<TrendingUp size={18} color="#0891b2" />}
          />
          <SummaryCard
            label="Total Paid"
            value={`₹${Number(summary.total_paid).toLocaleString()}`}
            color="#16a34a"
            icon={<TrendingUp size={18} color="#16a34a" />}
          />
          <SummaryCard
            label="Total Pending"
            value={`₹${Number(summary.total_pending).toLocaleString()}`}
            color="#dc2626"
            icon={<TrendingUp size={18} color="#dc2626" />}
          />
        </div>
      )}

      {/* ── SEARCH + FILTER ROW ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>

        {/* search */}
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} color="#6366f1" style={{
            position: "absolute", left: 14,
            top: "50%", transform: "translateY(-50%)",
          }} />
          <input
            className="rp-search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by invoice no, customer, phone…"
            style={{
              width: "100%", padding: "11px 14px 11px 40px",
              background: "#fff", border: "1.5px solid #e0e7ff",
              borderRadius: 12, fontSize: 12, outline: "none", fontFamily: FONT,
            }}
          />
        </div>

        {/* filter toggle */}
        <button
          onClick={() => setShowFilter(v => !v)}
          style={{
            ...btnPrimary,
            background: showFilter ? INDIGO : "#eef2ff",
            color: showFilter ? "#fff" : INDIGO,
            position: "relative",
          }}
        >
          <Filter size={14} />
          Filter
          {appliedCount > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -6,
              background: "#dc2626", color: "#fff",
              borderRadius: "50%", width: 18, height: 18,
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 10, fontWeight: 800,
            }}>{appliedCount}</span>
          )}
        </button>

        {/* reset */}
        {appliedCount > 0 && (
          <button
            onClick={resetFilter}
            style={{
              ...btnPrimary,
              background: "#fee2e2",
              color: "#dc2626",
            }}
          >
            <X size={13} /> Reset
          </button>
        )}
      </div>

      {/* ── FILTER PANEL ── */}
      {showFilter && (
        <div className="filter-panel" style={{
          background: "#fff",
          border: "1.5px solid #e0e7ff",
          borderRadius: 18,
          padding: "20px 22px",
          marginBottom: 18,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 14,
        }}>

          {/* From Date */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#4338ca", display: "block", marginBottom: 6 }}>
              From Date
            </label>
            <input
              type="date"
              className="rp-filter-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* To Date */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#4338ca", display: "block", marginBottom: 6 }}>
              To Date
            </label>
            <input
              type="date"
              className="rp-filter-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Payment Method */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#4338ca", display: "block", marginBottom: 6 }}>
              Payment Method
            </label>
            <select
              className="rp-filter-input"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={selectStyle}
            >
              {PAYMENT_METHODS.map(m => (
                <option key={m} value={m}>{METHOD_LABEL[m]}</option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#4338ca", display: "block", marginBottom: 6 }}>
              Payment Status
            </label>
            <select
              className="rp-filter-input"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              style={selectStyle}
            >
              {PAYMENT_STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#4338ca", display: "block", marginBottom: 6 }}>
              Customer Name
            </label>
            <input
              type="text"
              className="rp-filter-input"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              placeholder="Search customer…"
              style={inputStyle}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={applyFilter} style={{ ...btnPrimary, justifyContent: "center" }}>
              Apply Filter
            </button>
            <button
              onClick={resetFilter}
              style={{
                ...btnPrimary,
                background: "#f1f5f9", color: "#64748b",
                justifyContent: "center",
              }}
            >
              Reset All
            </button>
          </div>

        </div>
      )}

      {/* ── TABLE ── */}
      <div className="rp-card" style={{
        background: "#fff", borderRadius: 20,
        border: "1.5px solid #e0e7ff", overflow: "hidden",
      }}>
        <div style={{ height: 4, background: "linear-gradient(90deg,#4338ca,#6366f1,#818cf8)" }} />

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>

            <thead>
              <tr style={{ background: "#eef2ff" }}>
                {["#", "Invoice No", "Customer", "Phone", "Amount", "Paid", "Balance", "Method", "Status", "By", "Action"].map((h, i) => (
                  <th key={i} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 700, color: INDIGO,
                    borderBottom: "1px solid #dbeafe", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}>
                    Loading…
                  </td>
                </tr>
              ) : current.length > 0 ? current.map((inv, i) => {
                const mb = methodBadge(inv.payment_method);
                const sb = statusBadge(inv.payment_status);
                return (
                  <tr key={i} className="rp-row" onClick={() => navigate(`/invoice/${inv.invoice_no}`)}>

                    <td style={{ padding: "13px 16px" }}>{indexOfFirst + i + 1}</td>

                    {/* Invoice No */}
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 9,
                          background: "#eef2ff", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}>
                          <Receipt size={13} color={INDIGO} />
                        </div>
                        <span style={{ fontWeight: 700, color: INDIGO }}>{inv.invoice_no}</span>
                      </div>
                    </td>

                    <td style={{ padding: "13px 16px" }}>{inv.customer_name}</td>
                    <td style={{ padding: "13px 16px", color: "#6b7280" }}>{inv.customer_phone}</td>

                    {/* Amount */}
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: "#1e1b4b" }}>
                      ₹{Number(inv.total_amount).toLocaleString()}
                    </td>

                    {/* Paid */}
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: "#16a34a" }}>
                      ₹{Number(inv.paid_amount).toLocaleString()}
                    </td>

                    {/* Balance */}
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: Number(inv.balance_amount) > 0 ? "#dc2626" : "#9ca3af" }}>
                      ₹{Number(inv.balance_amount).toLocaleString()}
                    </td>

                    {/* Method badge */}
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{
                        padding: "5px 11px", borderRadius: 20, fontSize: 11,
                        fontWeight: 700, background: mb.bg, color: mb.color,
                      }}>
                        {inv.payment_method || "-"}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{
                        padding: "5px 11px", borderRadius: 20, fontSize: 11,
                        fontWeight: 700, background: sb.bg, color: sb.color,
                      }}>
                        {STATUS_LABEL[inv.payment_status] || inv.payment_status}
                      </span>
                    </td>

                    <td style={{ padding: "13px 16px", color: "#6b7280" }}>
                      {inv.cashier_name || "-"}
                    </td>

                    {/* Action */}
                    <td style={{ padding: "13px 16px" }}>
                      <button
                        className="rp-view-btn"
                        onClick={(e) => { e.stopPropagation(); navigate(`/invoice/${inv.invoice_no}`); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: "#eef2ff", border: "1px solid #c7d2fe",
                          color: INDIGO, borderRadius: 10, padding: "7px 14px",
                          cursor: "pointer", fontWeight: 600, fontSize: 12,
                          fontFamily: FONT,
                        }}
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>

                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={11} style={{ padding: 50, textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <FileText size={32} color="#c7d2fe" />
                      <span style={{ color: "#9ca3af" }}>No invoices found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginTop: 18,
        }}>
          <button
            className="rp-pg-btn"
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", background: "#fff",
              border: "1px solid #dbeafe", borderRadius: 10, cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            <ChevronLeft size={15} /> Prev
          </button>

          <div style={{ display: "flex", gap: 6 }}>
            {pages.map((p) => (
              <button key={p} onClick={() => goTo(p)} className="rp-pg-btn" style={{
                width: 36, height: 36, borderRadius: 10,
                border: "1px solid #dbeafe",
                background: currentPage === p ? INDIGO : "#fff",
                color: currentPage === p ? "#fff" : INDIGO,
                fontWeight: 700, cursor: "pointer", fontFamily: FONT,
              }}>{p}</button>
            ))}
          </div>

          <button
            className="rp-pg-btn"
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", background: "#fff",
              border: "1px solid #dbeafe", borderRadius: 10, cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}