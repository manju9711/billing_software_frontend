// import { useEffect, useState, useCallback } from "react";
// import api from "../../services/api";

// import {
//   ChevronLeft,
//   ChevronRight,
//   Filter,
//   X,
//   Download,
//   FileDown,
//   AlertCircle,
//   Clock,
// } from "lucide-react";

// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// /* ─── Inject Styles ─────────────────────────────────────────── */
// function useStyles() {
//   useEffect(() => {
//     const id = "pending-styles-v2";
//     if (document.getElementById(id)) return;
//     const s = document.createElement("style");
//     s.id = id;
//     s.innerHTML = `
//       @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
//       * { box-sizing: border-box; }
//       @keyframes fadeSlide {
//         from { opacity:0; transform:translateY(-8px); }
//         to   { opacity:1; transform:none; }
//       }
//       .pp-filter-panel { animation: fadeSlide .25s ease both; }
//       .pp-filter-input:focus {
//         border-color: #6366f1 !important;
//         box-shadow: 0 0 0 3px rgba(99,102,241,.08) !important;
//         outline: none;
//       }
//       .pp-row:hover td { background: #f8fafc !important; }
//       .pp-dl-btn:hover { opacity:.88; transform:translateY(-1px); }
//       .pp-dl-btn { transition: all .18s; }
//     `;
//     document.head.appendChild(s);
//     return () => document.head.removeChild(s);
//   }, []);
// }

// /* ─── Constants ───────────────────────────────────────────────── */
// const FONT  = "'Plus Jakarta Sans', sans-serif";
// const INDIGO = "#4338ca";
// const PAYMENT_METHODS  = ["all", "cash", "online", "upi", "credit"];
// const PAYMENT_STATUSES = ["all", "not_paid", "partial"];
// const DUE_STATUSES     = ["all", "overdue", "upcoming"];

// const METHOD_LABEL = {
//   all: "All Methods", cash: "Cash", online: "Online", upi: "UPI", credit: "Credit",
// };
// const STATUS_LABEL = {
//   all: "All Status", not_paid: "Not Paid", partial: "Partial",
// };
// const DUE_LABEL = {
//   all: "All Due", overdue: "Overdue", upcoming: "Upcoming",
// };

// /* ─── Toast Hook ─────────────────────────────────────────────── */
// function useToast() {
//   const [toasts, setToasts] = useState([]);
//   const show = (type, msg) => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, type, msg }]);
//     setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
//   };
//   return { toasts, show };
// }

// function Toasts({ toasts }) {
//   return (
//     <div style={{
//       position: "fixed", top: 20, right: 20,
//       zIndex: 9999, display: "flex", flexDirection: "column", gap: 10,
//     }}>
//       {toasts.map(t => (
//         <div key={t.id} style={{
//           background: t.type === "success" ? "#16a34a" : "#dc2626",
//           color: "#fff", padding: "12px 18px",
//           borderRadius: 12, fontWeight: 600,
//           boxShadow: "0 8px 24px rgba(0,0,0,.12)",
//         }}>{t.msg}</div>
//       ))}
//     </div>
//   );
// }

// /* ─── Summary Card ───────────────────────────────────────────── */
// function SCard({ label, value, color, icon }) {
//   return (
//     <div style={{
//       background: "#fff", border: "1.5px solid #e0e7ff",
//       borderRadius: 16, padding: "14px 20px",
//       display: "flex", alignItems: "center", gap: 14,
//       minWidth: 160, flex: 1,
//     }}>
//       <div style={{
//         width: 38, height: 38, borderRadius: 11,
//         background: color + "18",
//         display: "flex", alignItems: "center", justifyContent: "center",
//       }}>{icon}</div>
//       <div>
//         <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{label}</div>
//         <div style={{ fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>{value}</div>
//       </div>
//     </div>
//   );
// }

// /* ─── Main ───────────────────────────────────────────────────── */
// export default function PaymentPending() {
//   useStyles();
//   const { toasts, show } = useToast();

//   const [data,        setData]        = useState([]);
//   const [summary,     setSummary]     = useState(null);
//   const [loading,     setLoading]     = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showFilter,  setShowFilter]  = useState(false);

//   /* filter fields */
//   const [fromDate,       setFromDate]       = useState("");
//   const [toDate,         setToDate]         = useState("");
//   const [paymentMethod,  setPaymentMethod]  = useState("all");
//   const [paymentStatus,  setPaymentStatus]  = useState("all");
//   const [customerFilter, setCustomerFilter] = useState("");
//   const [dueStatus,      setDueStatus]      = useState("all");

//   const recordsPerPage = 10;

//   /* badge count */
//   const appliedCount = [
//     fromDate || toDate,
//     paymentMethod !== "all",
//     paymentStatus !== "all",
//     customerFilter,
//     dueStatus !== "all",
//   ].filter(Boolean).length;

//   /* ── fetch ── */
//   const fetchData = useCallback(async (overrides = {}) => {
//     setLoading(true);
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user?.company_id) return;
//       const res = await api.post("/invoice/get_filtered_pending.php", {
//         company_id:     user.company_id,
//         from_date:      overrides.fromDate      ?? fromDate,
//         to_date:        overrides.toDate        ?? toDate,
//         payment_method: overrides.paymentMethod ?? paymentMethod,
//         payment_status: overrides.paymentStatus ?? paymentStatus,
//         customer_name:  overrides.customerFilter ?? customerFilter,
//         due_status:     overrides.dueStatus     ?? dueStatus,
//       });
//       if (res.data.status) {
//         setData(res.data.data);
//         setSummary(res.data.summary);
//         setCurrentPage(1);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [fromDate, toDate, paymentMethod, paymentStatus, customerFilter, dueStatus]);

//   useEffect(() => { fetchData(); }, []); // eslint-disable-line

//   /* ── date format ── */
//   const formatDate = (date) => {
//     if (!date) return "-";
//     return new Date(date.replace(" ", "T")).toLocaleDateString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//     });
//   };

//   /* ── WhatsApp ── */
//   const sendReminder = (phone, name, amount, dueDate) => {
//     const msg =
//       `Hi ${name},\n\nYour payment ₹${amount} is due on ${formatDate(dueDate)}.\n\nKindly pay on time. Thank you!`;
//     window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
//   };

//   /* ── mark paid ── */
//   const markPaid = async (invoice_no, pay_amount) => {
//     const res = await api.post("/invoice/mark_as_paid.php", { invoice_no, pay_amount });
//     if (res.data.status) {
//       show("success", res.data.message);
//       fetchData();
//     } else {
//       show("error", res.data.message || "Failed");
//     }
//   };

//   /* ── apply / reset filter ── */
//   const applyFilter = () => { fetchData(); };
//   const resetFilter = () => {
//     const defaults = {
//       fromDate: "", toDate: "",
//       paymentMethod: "all", paymentStatus: "all",
//       customerFilter: "", dueStatus: "all",
//     };
//     setFromDate(""); setToDate(""); setPaymentMethod("all");
//     setPaymentStatus("all"); setCustomerFilter(""); setDueStatus("all");
//     fetchData(defaults);
//   };

//   /* ── pagination ── */
//   const totalPages   = Math.ceil(data.length / recordsPerPage);
//   const indexOfFirst = (currentPage - 1) * recordsPerPage;
//   const currentData  = data.slice(indexOfFirst, indexOfFirst + recordsPerPage);
//   const pages        = Array.from({ length: totalPages }, (_, i) => i + 1);
//   const goTo         = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

//   /* ── filter label ── */
//   const filterLabel = () => {
//     const parts = [];
//     if (fromDate) parts.push(`from_${fromDate}`);
//     if (toDate)   parts.push(`to_${toDate}`);
//     if (paymentMethod !== "all") parts.push(paymentMethod);
//     if (paymentStatus !== "all") parts.push(paymentStatus);
//     if (dueStatus !== "all")     parts.push(dueStatus);
//     return parts.join("_") || "all";
//   };

//   /* ── Excel download ── */
//   const downloadExcel = () => {
//     if (!data.length) { alert("No data to export"); return; }
//     const rows = data.map((item, i) => ({
//       "S.No":           i + 1,
//       "Invoice No":     item.invoice_no,
//       "Customer":       item.customer_name,
//       "Phone":          item.customer_phone,
//       "Total":          `₹${Number(item.total_amount).toLocaleString()}`,
//       "Paid":           `₹${Number(item.paid_amount_total).toLocaleString()}`,
//       "Pending":        `₹${Number(item.balance_amount).toLocaleString()}`,
//       "Credit Limit":   `₹${Number(item.credit_limit).toLocaleString()}`,
//       "Method":         item.payment_method,
//       "Status":         item.payment_status,
//       "Due Date":       item.due_date ? formatDate(item.due_date) : "-",
//       "Overdue":        item.is_overdue ? "Yes" : "No",
//       "Invoice Date":   item.created_at,
//     }));
//     const ws = XLSX.utils.json_to_sheet(rows);
//     ws["!cols"] = [
//       { wch: 6 }, { wch: 20 }, { wch: 26 }, { wch: 14 },
//       { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 16 },
//       { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 20 },
//     ];
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Pending Payments");
//     const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(
//       new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
//       `pending_payments_${filterLabel()}.xlsx`
//     );
//   };

//   /* ── PDF download ── */
//   const downloadPDF = () => {
//     if (!data.length) { alert("No data to export"); return; }
//     const doc = new jsPDF({ orientation: "landscape" });
//     doc.setFontSize(14);
//     doc.setTextColor(67, 56, 202);
//     doc.text("Pending Payments Report", 14, 16);
//     doc.setFontSize(9);
//     doc.setTextColor(120, 120, 120);
//     doc.text(`Generated: ${new Date().toLocaleString("en-IN")}   |   Filter: ${filterLabel()}`, 14, 23);

//     autoTable(doc, {
//       startY: 28,
//       head: [["#", "Invoice", "Customer", "Phone", "Total", "Paid", "Pending", "Method", "Status", "Due Date", "Overdue"]],
//       body: data.map((item, i) => [
//         i + 1,
//         item.invoice_no,
//         item.customer_name,
//         item.customer_phone,
//         `₹${Number(item.total_amount).toLocaleString()}`,
//         `₹${Number(item.paid_amount_total).toLocaleString()}`,
//         `₹${Number(item.balance_amount).toLocaleString()}`,
//         item.payment_method,
//         item.payment_status,
//         item.due_date ? formatDate(item.due_date) : "-",
//         item.is_overdue ? "YES" : "No",
//       ]),
//       headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: "bold", fontSize: 8 },
//       bodyStyles: { fontSize: 8 },
//       alternateRowStyles: { fillColor: [238, 242, 255] },
//       didParseCell: (d) => {
//         if (d.section === "body" && d.column.index === 10) {
//           if (d.cell.raw === "YES") d.cell.styles.textColor = [220, 38, 38];
//         }
//       },
//       styles: { cellPadding: 3 },
//     });

//     const finalY = doc.lastAutoTable.finalY + 8;
//     doc.setFontSize(9);
//     doc.setTextColor(67, 56, 202);
//     doc.text(
//       `Total Records: ${data.length}  |  ` +
//       `Total Pending: ₹${data.reduce((s, r) => s + Number(r.balance_amount), 0).toLocaleString()}  |  ` +
//       `Overdue: ${data.filter(r => r.is_overdue).length} records`,
//       14, finalY
//     );
//     doc.save(`pending_payments_${filterLabel()}.pdf`);
//   };

//   /* ── shared input style ── */
//   const inputStyle = {
//     width: "100%", padding: "9px 12px",
//     border: "1.5px solid #e0e7ff", borderRadius: 10,
//     fontSize: 12, fontFamily: FONT,
//     background: "#fff", color: "#1e1b4b",
//   };

//   const btnPrimary = {
//     border: "none", color: "#fff",
//     padding: "10px 16px", borderRadius: 12,
//     fontSize: 12, fontWeight: 700,
//     cursor: "pointer", fontFamily: FONT,
//     display: "flex", alignItems: "center", gap: 7,
//   };

//   /* ── render ── */
//   return (
//     <>
//       <Toasts toasts={toasts} />
//       <div style={{ padding: 24, fontFamily: FONT, background: "#f8fafc", minHeight: "100vh" }}>

//         {/* HEADER */}
//         <div style={{
//           display: "flex", alignItems: "center",
//           justifyContent: "space-between", marginBottom: 20,
//           flexWrap: "wrap", gap: 14,
//         }}>
//           <div>
//             <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1e1b4b" }}>
//               💰 Pending Payments
//             </h2>
//             <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
//               Advanced filter — overdue tracking, PDF & Excel export
//             </p>
//           </div>

//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//             <button
//               className="pp-dl-btn"
//               onClick={downloadExcel}
//               style={{ ...btnPrimary, background: "#16a34a" }}
//             >
//               <Download size={14} /> Excel
//             </button>
//             <button
//               className="pp-dl-btn"
//               onClick={downloadPDF}
//               style={{ ...btnPrimary, background: "#dc2626" }}
//             >
//               <FileDown size={14} /> PDF
//             </button>
//           </div>
//         </div>

//         {/* SUMMARY CARDS */}
//         {summary && (
//           <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
//             <SCard
//               label="Total Pending"
//               value={`₹${Number(summary.total_pending).toLocaleString()}`}
//               color="#dc2626"
//               icon={<AlertCircle size={18} color="#dc2626" />}
//             />
//             <SCard
//               label="Overdue Amount"
//               value={`₹${Number(summary.total_overdue).toLocaleString()}`}
//               color="#d97706"
//               icon={<Clock size={18} color="#d97706" />}
//             />
//             <SCard
//               label="Overdue Records"
//               value={summary.overdue_count}
//               color="#7c3aed"
//               icon={<AlertCircle size={18} color="#7c3aed" />}
//             />
//             <SCard
//               label="Total Records"
//               value={summary.total_records}
//               color="#0891b2"
//               icon={<Clock size={18} color="#0891b2" />}
//             />
//           </div>
//         )}

//         {/* FILTER TOGGLE ROW */}
//         <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
//           <button
//             onClick={() => setShowFilter(v => !v)}
//             style={{
//               ...btnPrimary,
//               background: showFilter ? INDIGO : "#eef2ff",
//               color: showFilter ? "#fff" : INDIGO,
//               position: "relative",
//             }}
//           >
//             <Filter size={14} />
//             Filter
//             {appliedCount > 0 && (
//               <span style={{
//                 position: "absolute", top: -6, right: -6,
//                 background: "#dc2626", color: "#fff",
//                 borderRadius: "50%", width: 18, height: 18,
//                 display: "flex", alignItems: "center",
//                 justifyContent: "center", fontSize: 10, fontWeight: 800,
//               }}>{appliedCount}</span>
//             )}
//           </button>

//           {appliedCount > 0 && (
//             <button
//               onClick={resetFilter}
//               style={{ ...btnPrimary, background: "#fee2e2", color: "#dc2626" }}
//             >
//               <X size={13} /> Reset Filters
//             </button>
//           )}
//         </div>

//         {/* FILTER PANEL */}
//         {showFilter && (
//           <div className="pp-filter-panel" style={{
//             background: "#fff", border: "1.5px solid #e0e7ff",
//             borderRadius: 18, padding: "20px 22px", marginBottom: 18,
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
//             gap: 14,
//           }}>

//             {/* From Date */}
//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: INDIGO, display: "block", marginBottom: 6 }}>
//                 From Date
//               </label>
//               <input type="date" className="pp-filter-input"
//                 value={fromDate} onChange={e => setFromDate(e.target.value)} style={inputStyle} />
//             </div>

//             {/* To Date */}
//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: INDIGO, display: "block", marginBottom: 6 }}>
//                 To Date
//               </label>
//               <input type="date" className="pp-filter-input"
//                 value={toDate} onChange={e => setToDate(e.target.value)} style={inputStyle} />
//             </div>

//             {/* Payment Method */}
//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: INDIGO, display: "block", marginBottom: 6 }}>
//                 Payment Method
//               </label>
//               <select className="pp-filter-input"
//                 value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
//                 style={{ ...inputStyle, cursor: "pointer" }}>
//                 {PAYMENT_METHODS.map(m => <option key={m} value={m}>{METHOD_LABEL[m]}</option>)}
//               </select>
//             </div>

//             {/* Payment Status */}
//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: INDIGO, display: "block", marginBottom: 6 }}>
//                 Payment Status
//               </label>
//               <select className="pp-filter-input"
//                 value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}
//                 style={{ ...inputStyle, cursor: "pointer" }}>
//                 {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
//               </select>
//             </div>

//             {/* Due Status */}
//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: INDIGO, display: "block", marginBottom: 6 }}>
//                 Due Status
//               </label>
//               <select className="pp-filter-input"
//                 value={dueStatus} onChange={e => setDueStatus(e.target.value)}
//                 style={{ ...inputStyle, cursor: "pointer" }}>
//                 {DUE_STATUSES.map(d => <option key={d} value={d}>{DUE_LABEL[d]}</option>)}
//               </select>
//             </div>

//             {/* Customer Name */}
//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: INDIGO, display: "block", marginBottom: 6 }}>
//                 Customer Name
//               </label>
//               <input type="text" className="pp-filter-input"
//                 value={customerFilter}
//                 onChange={e => setCustomerFilter(e.target.value)}
//                 placeholder="Search customer…"
//                 style={inputStyle} />
//             </div>

//             {/* Buttons */}
//             <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8 }}>
//               <button onClick={applyFilter}
//                 style={{ ...btnPrimary, background: INDIGO, justifyContent: "center" }}>
//                 Apply Filter
//               </button>
//               <button onClick={resetFilter}
//                 style={{ ...btnPrimary, background: "#f1f5f9", color: "#64748b", justifyContent: "center" }}>
//                 Reset All
//               </button>
//             </div>

//           </div>
//         )}

//         {/* TABLE */}
//         <div style={{
//           background: "#fff", borderRadius: 18,
//           overflow: "hidden", border: "1px solid #e5e7eb",
//           boxShadow: "0 4px 14px rgba(0,0,0,.04)",
//         }}>
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1300 }}>

//               <thead>
//                 <tr style={{ background: "#eef2ff" }}>
//                   {["#", "Invoice", "Customer", "Phone", "Total", "Paid", "Pending",
//                     "Limit", "Due Date", "Status", "Reminder", "Action"].map((h, i) => (
//                     <th key={i} style={th}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr><td colSpan={12} style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
//                     Loading…
//                   </td></tr>
//                 ) : currentData.length === 0 ? (
//                   <tr><td colSpan={12} style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>
//                     No Pending Payments
//                   </td></tr>
//                 ) : currentData.map((item, i) => {

//                   const isOverdue  = item.is_overdue;
//                   const showRem    = item.payment_type === "credit"
//                     && Number(item.balance_amount) > 0
//                     && item.due_date;
//                   const returnAmt  = Number(item.pay_amount || 0) > Number(item.balance_amount)
//                     ? Number(item.pay_amount) - Number(item.balance_amount)
//                     : 0;

//                   return (
//                     <tr key={i} className="pp-row" style={{ borderBottom: "1px solid #f1f5f9", fontFamily: FONT }}>

//                       <td style={td}>{indexOfFirst + i + 1}</td>

//                       <td style={tdBlue}>{item.invoice_no}</td>

//                       <td style={td}>{item.customer_name}</td>

//                       <td style={tdLight}>{item.customer_phone}</td>

//                       <td style={td}>₹{Number(item.total_amount).toLocaleString()}</td>

//                       <td style={{ ...td, color: "#16a34a", fontWeight: 700 }}>
//                         ₹{Number(item.paid_amount_total).toLocaleString()}
//                       </td>

//                       <td style={{ ...td, color: "#dc2626", fontWeight: 700 }}>
//                         ₹{Number(item.balance_amount).toLocaleString()}
//                       </td>

//                       <td style={{ ...td, color: "#7c3aed", fontWeight: 700 }}>
//                         ₹{Number(item.credit_limit).toLocaleString()}
//                       </td>

//                       <td style={td}>{item.due_date ? formatDate(item.due_date) : "-"}</td>

//                       <td style={td}>
//                         <span style={{
//                           padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700,
//                           background: isOverdue ? "#fee2e2" : "#fef3c7",
//                           color: isOverdue ? "#dc2626" : "#d97706",
//                         }}>
//                           {isOverdue ? "Overdue" : "Pending"}
//                         </span>
//                       </td>

//                       <td style={td}>
//                         {showRem ? (
//                           <button
//                             onClick={() => sendReminder(item.customer_phone, item.customer_name, item.balance_amount, item.due_date)}
//                             style={{
//                               background: "#22c55e", color: "#fff", border: "none",
//                               padding: "8px 14px", borderRadius: 8,
//                               cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: FONT,
//                             }}
//                           >Send</button>
//                         ) : <span style={{ color: "#9ca3af" }}>—</span>}
//                       </td>

//                       <td style={td}>
//                         <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//                           <input
//                             type="number"
//                             placeholder="Enter amount"
//                             value={item.pay_amount || ""}
//                             onChange={(e) => {
//                               const updated = [...data];
//                               updated[indexOfFirst + i].pay_amount = e.target.value;
//                               setData(updated);
//                             }}
//                             style={{
//                               padding: "8px 10px", border: "1px solid #d1d5db",
//                               borderRadius: 8, width: 140,
//                               fontFamily: FONT, fontSize: 12,
//                             }}
//                           />
//                           {returnAmt > 0 && (
//                             <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626" }}>
//                               Return ₹{returnAmt.toLocaleString()}
//                             </div>
//                           )}
//                           <button
//                             onClick={() => {
//                               if (!item.pay_amount || Number(item.pay_amount) <= 0) {
//                                 show("error", "Please enter payment amount");
//                                 return;
//                               }
//                               markPaid(item.invoice_no, item.pay_amount);
//                             }}
//                             style={{
//                               background: "#16a34a", color: "#fff", border: "none",
//                               padding: "8px 12px", borderRadius: 8,
//                               cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: FONT,
//                             }}
//                           >Confirm Paid</button>
//                         </div>
//                       </td>

//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
//             <button
//               onClick={() => goTo(currentPage - 1)}
//               disabled={currentPage === 1}
//               style={pgBtn}
//             >
//               <ChevronLeft size={15} /> Prev
//             </button>

//             <div style={{ display: "flex", gap: 6 }}>
//               {pages.map((p) => (
//                 <button key={p} onClick={() => goTo(p)} style={{
//                   width: 36, height: 36, borderRadius: 10,
//                   border: "1px solid #dbeafe",
//                   background: currentPage === p ? INDIGO : "#fff",
//                   color: currentPage === p ? "#fff" : INDIGO,
//                   fontWeight: 700, cursor: "pointer", fontFamily: FONT,
//                 }}>{p}</button>
//               ))}
//             </div>

//             <button
//               onClick={() => goTo(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               style={pgBtn}
//             >
//               Next <ChevronRight size={15} />
//             </button>
//           </div>
//         )}

//       </div>
//     </>
//   );
// }

// /* ─── Styles ─────────────────────────────────────────────────── */
// const th = {
//   padding: "13px 14px", textAlign: "left",
//   fontSize: 11, color: "#4338ca",
//   fontWeight: 700, whiteSpace: "nowrap",
// };
// const td      = { padding: "13px 14px", whiteSpace: "nowrap", fontSize: 12 };
// const tdLight = { ...td, color: "#6b7280" };
// const tdBlue  = { ...td, color: "#4338ca", fontWeight: 700 };
// const pgBtn   = {
//   display: "flex", alignItems: "center", gap: 6,
//   padding: "8px 16px", background: "#fff",
//   border: "1px solid #dbeafe", borderRadius: 10,
//   cursor: "pointer", color: "#4338ca", fontWeight: 600,
//   fontFamily: "'Plus Jakarta Sans', sans-serif",
// };





//manju
import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";

/* ─── Toast Hook ───────────────── */

function useToast() {

  const [toasts, setToasts] = useState([]);

  const show = (type, msg) => {

    const id = Date.now();

    setToasts(prev => [
      ...prev,
      { id, type, msg }
    ]);

    setTimeout(() => {

      setToasts(prev =>
        prev.filter(t => t.id !== id)
      );

    }, 3000);

  };

  return {
    toasts,
    show
  };

}

/* ─── Toast UI ───────────────── */

function Toasts({ toasts }) {

  return (

    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}
    >

      {toasts.map(t => (

        <div
          key={t.id}
          style={{
            background:
              t.type === "success"
                ? "#16a34a"
                : "#dc2626",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 12,
            fontWeight: 600,
            boxShadow:
              "0 8px 24px rgba(0,0,0,.12)",
            animation: "fadeIn .25s ease"
          }}
        >
          {t.msg}
        </div>

      ))}

    </div>

  );

}

export default function PaymentPending() {

  const [data, setData] = useState([]);

  const { toasts, show } = useToast();

  // ✅ PAGINATION

  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // ✅ FETCH DATA

  const fetchData = async () => {

   const company_id =
  localStorage.getItem("selected_company_id");

const res = await api.post(
  "/invoice/get_pending_invoice.php",
  {
    company_id
  }
);

    if (res.data.status) {
      setData(res.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ DATE FORMAT

  const formatDate = (date) => {

    if (!date) return "-";

    const d = new Date(date.replace(" ", "T"));

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    });
  };

  // ✅ WHATSAPP REMINDER

  const sendReminder = (
    phone,
    name,
    amount,
    dueDate
  ) => {

    const msg = `Hi ${name},

Your payment ₹${amount} is due on ${formatDate(dueDate)}.

Kindly pay on time. Thank you!`;

    const url =
      `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");
  };

  // ✅ MARK PAID

  const markPaid = async (
    invoice_no,
    pay_amount
  ) => {

    const res = await api.post(
      "/invoice/mark_as_paid.php",
      {
        invoice_no,
        pay_amount
      }
    );

    if (res.data.status) {

      show("success", res.data.message);

      fetchData();
    }
  };

  // ✅ PAGINATION LOGIC

  const totalPages = Math.ceil(
    data.length / recordsPerPage
  );

  const indexOfFirst =
    (currentPage - 1) * recordsPerPage;

  const currentData = data.slice(
    indexOfFirst,
    indexOfFirst + recordsPerPage
  );

  const goTo = (p) => {

    setCurrentPage(
      Math.max(1, Math.min(p, totalPages))
    );

  };

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (

<>
<Toasts toasts={toasts} />

    <div
      style={{
        padding: 24,
        fontFamily: "sans-serif",
        background: "#f8fafc",
        minHeight: "100vh"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22
        }}
      >

        <h2
          style={{
            margin: 0,
            color: "#1e293b"
          }}
        >
          💰 Pending Payments
        </h2>

        <div
          style={{
            background: "#fff",
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            fontWeight: 700,
            color: "#4338ca"
          }}
        >
          Total Pending : ₹
          {data
            .reduce(
              (sum, item) =>
                sum + Number(item.balance_amount),
              0
            )
            .toLocaleString()}
        </div>

      </div>

      {/* TABLE */}

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 14px rgba(0,0,0,.04)"
        }}
      >

        <div style={{ overflowX: "auto" }}>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1300
            }}
          >

            {/* HEADER */}

            <thead>

              <tr
                style={{
                  background: "#eef2ff"
                }}
              >

                <th style={th}>#</th>

                <th style={th}>Invoice</th>

                <th style={th}>Customer</th>

                <th style={th}>Phone</th>

                <th style={th}>Total</th>

                <th style={th}>Paid</th>

                <th style={th}>Pending</th>

                <th style={th}>Limit</th>

                <th style={th}>Due Date</th>

                <th style={th}>Status</th>

                <th style={th}>Reminder</th>

                <th style={th}>Action</th>

              </tr>

            </thead>

            {/* BODY */}

            <tbody>

              {currentData.length === 0 ? (

                <tr>

                  <td
                    colSpan={12}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#64748b",
                      fontWeight: 600
                    }}
                  >
                    No Pending Payments
                  </td>

                </tr>

              ) : currentData.map((item, i) => {

                const today = new Date();

                const due = item.due_date
                  ? new Date(
                      item.due_date.replace(" ", "T")
                    )
                  : null;

                const diff = due
                  ? (due - today) /
                    (1000 * 60 * 60 * 24)
                  : null;

                const isOverdue =
                  diff !== null && diff < 0;

                const showReminder =
                  item.payment_type === "credit" &&
                  Number(item.balance_amount) > 0 &&
                  item.due_date;

                const returnAmount =
                  Number(item.pay_amount || 0) >
                  Number(item.balance_amount)
                    ? Number(item.pay_amount) -
                      Number(item.balance_amount)
                    : 0;

                return (

                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        "1px solid #f1f5f9"
                    }}
                  >

                    {/* SERIAL */}

                    <td style={td}>
                      {indexOfFirst + i + 1}
                    </td>

                    {/* INVOICE */}

                    <td style={tdBlue}>
                      {item.invoice_no}
                    </td>

                    {/* CUSTOMER */}

                    <td style={td}>
                      {item.customer_name}
                    </td>

                    {/* PHONE */}

                    <td style={tdLight}>
                      {item.customer_phone}
                    </td>

                    {/* TOTAL */}

                    <td style={td}>
                      ₹
                      {Number(
                        item.total_amount
                      ).toLocaleString()}
                    </td>

                    {/* PAID */}

                    <td
                      style={{
                        padding: "14px",
                        color: "#16a34a",
                        fontWeight: 700
                      }}
                    >
                      ₹
                      {Number(
                        item.paid_amount_total
                      ).toLocaleString()}
                    </td>

                    {/* PENDING */}

                    <td
                      style={{
                        padding: "14px",
                        color: "#dc2626",
                        fontWeight: 700
                      }}
                    >
                      ₹
                      {Number(
                        item.balance_amount
                      ).toLocaleString()}
                    </td>

                    {/* LIMIT */}

                    <td
                      style={{
                        padding: "14px",
                        color: "#7c3aed",
                        fontWeight: 700
                      }}
                    >
                      ₹
                      {Number(
                        item.credit_limit
                      ).toLocaleString()}
                    </td>

                    {/* DUE DATE */}

                    <td style={td}>
                      {item.due_date
                        ? formatDate(item.due_date)
                        : "-"}
                    </td>

                    {/* STATUS */}

                    <td style={td}>

                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            isOverdue
                              ? "#fee2e2"
                              : "#fef3c7",
                          color:
                            isOverdue
                              ? "#dc2626"
                              : "#d97706"
                        }}
                      >
                        {isOverdue
                          ? "Overdue"
                          : "Pending"}
                      </span>

                    </td>

                    {/* REMINDER */}

                    <td style={td}>

                      {showReminder ? (

                        <button
                          onClick={() =>
                            sendReminder(
                              item.customer_phone,
                              item.customer_name,
                              item.balance_amount,
                              item.due_date
                            )
                          }
                          style={{
                            background: "#22c55e",
                            color: "#fff",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: 700
                          }}
                        >
                          Send
                        </button>

                      ) : (

                        <span
                          style={{
                            color: "#9ca3af"
                          }}
                        >
                          —
                        </span>

                      )}

                    </td>

                    {/* ACTION */}

                    <td style={td}>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8
                        }}
                      >

                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={
                            item.pay_amount || ""
                          }
                          onChange={(e) => {

                            const updated = [
                              ...data
                            ];

                            updated[indexOfFirst + i].pay_amount =
                              e.target.value;

                            setData(updated);

                          }}
                          style={{
                            padding: "8px 10px",
                            border:
                              "1px solid #d1d5db",
                            borderRadius: 8,
                            width: 140
                          }}
                        />

                        {/* RETURN */}

                        {returnAmount > 0 && (

                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#dc2626"
                            }}
                          >
                            Return ₹
                            {returnAmount.toLocaleString()}
                          </div>

                        )}

                        <button
                          onClick={() => {

                            if (
                              !item.pay_amount ||
                              Number(item.pay_amount) <= 0
                            ) {

                              show(
                                "error",
                                "Please enter payment amount"
                              );

                              return;
                            }

                            markPaid(
                              item.invoice_no,
                              item.pay_amount
                            );

                          }}
                          style={{
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: 700
                          }}
                        >
                          Confirm Paid
                        </button>

                      </div>

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 18
          }}
        >

          {/* PREV */}

          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            style={pgBtn}
          >
            <ChevronLeft size={15} />
            Prev
          </button>

          {/* PAGE NUMBERS */}

          <div
            style={{
              display: "flex",
              gap: 6
            }}
          >

            {pages.map((p) => (

              <button
                key={p}
                onClick={() => goTo(p)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: "1px solid #dbeafe",
                  background:
                    currentPage === p
                      ? "#4338ca"
                      : "#fff",
                  color:
                    currentPage === p
                      ? "#fff"
                      : "#4338ca",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {p}
              </button>

            ))}

          </div>

          {/* NEXT */}

          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={pgBtn}
          >
            Next
            <ChevronRight size={15} />
          </button>

        </div>

      )}

    </div>

</>

  );
}

// 🎨 STYLES

const th = {
  padding: "14px",
  textAlign: "left",
  fontSize: 12,
  color: "#4338ca",
  fontWeight: 700,
  whiteSpace: "nowrap"
};

const td = {
  padding: "14px",
  whiteSpace: "nowrap"
};

const tdLight = {
  padding: "14px",
  color: "#6b7280",
  whiteSpace: "nowrap"
};

const tdBlue = {
  padding: "14px",
  color: "#4338ca",
  fontWeight: 700,
  whiteSpace: "nowrap"
};

const pgBtn = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 16px",
  background: "#fff",
  border: "1px solid #dbeafe",
  borderRadius: 10,
  cursor: "pointer",
  color: "#4338ca",
  fontWeight: 600
};