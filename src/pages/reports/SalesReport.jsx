// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// import {
//   FileText,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Receipt,
//   Download
// } from "lucide-react";

// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// // ── inject styles ────────────────────────────────────────────────────────────

// function useStyles() {

//   useEffect(() => {

//     const id = "reports-styles";

//     if (document.getElementById(id)) return;

//     const s = document.createElement("style");

//     s.id = id;

//     s.innerHTML = `
//       @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//       .rp * {
//         box-sizing: border-box;
//       }

//       @keyframes rp-in {
//         from {
//           opacity: 0;
//           transform: translateY(14px);
//         }
//         to {
//           opacity: 1;
//           transform: none;
//         }
//       }

//       @keyframes rp-spin {
//         to {
//           transform: rotate(360deg);
//         }
//       }

//       .rp-row {
//         transition: background .15s;
//         cursor: pointer;
//       }

//       .rp-row:hover td {
//         background: #f5f7ff !important;
//       }

//       .rp-row:hover .rp-view-btn {
//         opacity: 1 !important;
//         transform: scale(1) !important;
//       }

//       .rp-view-btn {
//         transition: all .18s;
//       }

//       .rp-pg-btn {
//         transition: all .18s;
//       }

//       .rp-pg-btn:hover:not(:disabled) {
//         background: #e0e7ff !important;
//         color: #4338ca !important;
//       }

//       .rp-search:focus {
//         border-color: #6366f1 !important;
//         box-shadow: 0 0 0 3px rgba(99,102,241,.1) !important;
//       }

//       .rp-card {
//         animation: rp-in .4s ease both;
//       }
//     `;

//     document.head.appendChild(s);

//     return () => document.head.removeChild(s);

//   }, []);
// }

// export default function Reports() {

//   useStyles();

//   const navigate = useNavigate();

//   const font = "'Plus Jakarta Sans', sans-serif";

//   const [invoices, setInvoices] = useState([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);

//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const recordsPerPage = 10;

//   // ── fetch invoices ────────────────────────────────────────────────────────

//   useEffect(() => {

//     const fetchInvoices = async () => {

//       try {

//         const user = JSON.parse(localStorage.getItem("user"));

//         if (!user?.company_id) return;

//         const res = await api.post(
//           "/invoice/get_all_invoice.php",
//           {
//             company_id: user.company_id
//           }
//         );

//         if (res.data.status) {

//           setInvoices(res.data.data);
//         }

//       } catch (err) {

//         console.error(err);

//       } finally {

//         setLoading(false);
//       }
//     };

//     fetchInvoices();

//   }, []);

//   // ── search filter ─────────────────────────────────────────────────────────

//   const filtered = invoices.filter(inv =>

//     inv.invoice_no?.toLowerCase().includes(search.toLowerCase()) ||

//     inv.customer_name?.toLowerCase().includes(search.toLowerCase()) ||

//     inv.customer_phone?.includes(search)
//   );

//   // ── pagination ────────────────────────────────────────────────────────────

//   const totalPages = Math.ceil(filtered.length / recordsPerPage);

//   const indexOfFirst = (currentPage - 1) * recordsPerPage;

//   const currentInvoices = filtered.slice(
//     indexOfFirst,
//     indexOfFirst + recordsPerPage
//   );

//   const goTo = (p) => {

//     setCurrentPage(
//       Math.max(1, Math.min(p, totalPages))
//     );
//   };

//   const pages = Array.from(
//     { length: totalPages },
//     (_, i) => i + 1
//   );

//   const handleSearch = (v) => {

//     setSearch(v);

//     setCurrentPage(1);
//   };

//   // ── excel download ────────────────────────────────────────────────────────

//   const downloadExcel = () => {

//     if (!startDate || !endDate) {

//       alert("Please select start date and end date");

//       return;
//     }

//     const start = new Date(startDate);

//     const end = new Date(endDate);

//     end.setHours(23, 59, 59, 999);

//     const filteredData = invoices.filter(inv => {

//       const invoiceDate = new Date(
//         inv.created_at || inv.date || inv.created_date
//       );

//       return invoiceDate >= start && invoiceDate <= end;
//     });

//     if (filteredData.length === 0) {

//       alert("No reports found");

//       return;
//     }

//     const excelData = filteredData.map((inv, index) => ({

//       "S.No": index + 1,

//       "Invoice No": inv.invoice_no,

//       "Customer Name": inv.customer_name,

//       "Phone Number": inv.customer_phone,

//       "Total Amount": `₹${Number(inv.total_amount).toLocaleString()}`,

//       "Created Date": inv.created_at || inv.date || ""
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);

//     // column widths

//     worksheet["!cols"] = [
//       { wch: 10 },
//       { wch: 22 },
//       { wch: 30 },
//       { wch: 20 },
//       { wch: 18 },
//       { wch: 25 }
//     ];

//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(
//       workbook,
//       worksheet,
//       "Invoice Report"
//     );

//     const excelBuffer = XLSX.write(
//       workbook,
//       {
//         bookType: "xlsx",
//         type: "array"
//       }
//     );

//     const blob = new Blob(
//       [excelBuffer],
//       {
//         type:
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//       }
//     );

//     saveAs(
//       blob,
//       `invoice_report_${startDate}_to_${endDate}.xlsx`
//     );
//   };

//   // ── render ────────────────────────────────────────────────────────────────

//   return (

//     <div
//       className="rp"
//       style={{
//         fontFamily: font,
//         padding: "22px 26px"
//       }}
//     >

//       {/* HEADER */}

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 22,
//           flexWrap: "wrap",
//           gap: 16
//         }}
//       >

//         {/* left */}

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12
//           }}
//         >

//           <div style={{ fontSize: 28 }}>
//             🧾
//           </div>

//           <div>

//             <h1
//               style={{
//                 margin: 0,
//                 fontSize: 22,
//                 fontWeight: 800,
//                 color: "#1e1b4b"
//               }}
//             >
//               Invoice Reports
//             </h1>

//             <p
//               style={{
//                 margin: "2px 0 0",
//                 fontSize: 13,
//                 color: "#9ca3af"
//               }}
//             >
//               View and manage all your invoices
//             </p>

//           </div>

//         </div>

//         {/* right */}

//         {/* <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             flexWrap: "wrap"
//           }}
//         >

//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             style={{
//               padding: "10px 14px",
//               borderRadius: 10,
//               border: "1.5px solid #dbeafe",
//               fontFamily: font,
//               fontSize: 13,
//               outline: "none"
//             }}
//           />

//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             style={{
//               padding: "10px 14px",
//               borderRadius: 10,
//               border: "1.5px solid #dbeafe",
//               fontFamily: font,
//               fontSize: 13,
//               outline: "none"
//             }}
//           />

//           <button
//             onClick={downloadExcel}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               background: "#4338ca",
//               border: "none",
//               color: "#fff",
//               padding: "10px 18px",
//               borderRadius: 12,
//               fontSize: 13,
//               fontWeight: 700,
//               cursor: "pointer",
//               fontFamily: font,
//               boxShadow: "0 2px 10px rgba(67,56,202,.2)"
//             }}
//           >
//             <Download size={15} />
//             Download
//           </button>

//         </div> */}

//         <div
//   style={{
//     display: "flex",
//     alignItems: "end",
//     gap: 14,
//     flexWrap: "wrap"
//   }}
// >

//   {/* START DATE */}

//   <div
//     style={{
//       display: "flex",
//       flexDirection: "column",
//       gap: 6
//     }}
//   >

//     <label
//       style={{
//         fontSize: 12,
//         fontWeight: 700,
//         color: "#4338ca",
//         paddingLeft: 2
//       }}
//     >
//       Start Date
//     </label>

//     <input
//       type="date"
//       value={startDate}
//       onChange={(e) => setStartDate(e.target.value)}
//       style={{
//         padding: "10px 14px",
//         borderRadius: 10,
//         border: "1.5px solid #dbeafe",
//         fontFamily: font,
//         fontSize: 13,
//         outline: "none",
//         minWidth: 170
//       }}
//     />

//   </div>

//   {/* END DATE */}

//   <div
//     style={{
//       display: "flex",
//       flexDirection: "column",
//       gap: 6
//     }}
//   >

//     <label
//       style={{
//         fontSize: 12,
//         fontWeight: 700,
//         color: "#4338ca",
//         paddingLeft: 2
//       }}
//     >
//       End Date
//     </label>

//     <input
//       type="date"
//       value={endDate}
//       onChange={(e) => setEndDate(e.target.value)}
//       style={{
//         padding: "10px 14px",
//         borderRadius: 10,
//         border: "1.5px solid #dbeafe",
//         fontFamily: font,
//         fontSize: 13,
//         outline: "none",
//         minWidth: 170
//       }}
//     />

//   </div>

//   {/* DOWNLOAD BUTTON */}

//   <button
//     onClick={downloadExcel}
//     style={{
//       display: "flex",
//       alignItems: "center",
//       gap: 8,
//       background: "#4338ca",
//       border: "none",
//       color: "#fff",
//       padding: "10px 18px",
//       borderRadius: 12,
//       fontSize: 13,
//       fontWeight: 700,
//       cursor: "pointer",
//       fontFamily: font,
//       height: 42,
//       boxShadow: "0 2px 10px rgba(67,56,202,.2)"
//     }}
//   >
//     <Download size={15} />
//     Download
//   </button>

// </div>

//       </div>

//       {/* SEARCH */}

//       <div
//         style={{
//           position: "relative",
//           marginBottom: 18
//         }}
//       >

//         <Search
//           size={16}
//           color="#6366f1"
//           style={{
//             position: "absolute",
//             left: 16,
//             top: "50%",
//             transform: "translateY(-50%)"
//           }}
//         />

//         <input
//           className="rp-search"
//           value={search}
//           onChange={(e) => handleSearch(e.target.value)}
//           placeholder="Search invoices..."
//           style={{
//             width: "100%",
//             padding: "12px 16px 12px 44px",
//             background: "#fff",
//             border: "1.5px solid #e0e7ff",
//             borderRadius: 14,
//             fontSize: 14,
//             outline: "none"
//           }}
//         />

//       </div>

//       {/* TABLE */}

//       <div
//         className="rp-card"
//         style={{
//           background: "#fff",
//           borderRadius: 20,
//           border: "1.5px solid #e0e7ff",
//           overflow: "hidden"
//         }}
//       >

//         <div
//           style={{
//             height: 4,
//             background:
//               "linear-gradient(90deg,#4338ca,#6366f1,#818cf8)"
//           }}
//         />

//         <div style={{ overflowX: "auto" }}>

//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse"
//             }}
//           >

//             <thead>

//               <tr style={{ background: "#eef2ff" }}>

//                 {[
//                   "#",
//                   "Invoice No",
//                   "Customer",
//                   "Phone",
//                   "Amount",
//                   "Action"
//                 ].map((h, i) => (

//                   <th
//                     key={i}
//                     style={{
//                       padding: "12px 18px",
//                       textAlign: "left",
//                       fontSize: 11,
//                       fontWeight: 700,
//                       color: "#4338ca",
//                       borderBottom: "1px solid #dbeafe"
//                     }}
//                   >
//                     {h}
//                   </th>

//                 ))}

//               </tr>

//             </thead>

//             <tbody>

//               {loading ? (

//                 <tr>

//                   <td
//                     colSpan={6}
//                     style={{
//                       padding: "50px",
//                       textAlign: "center"
//                     }}
//                   >
//                     Loading...
//                   </td>

//                 </tr>

//               ) : currentInvoices.length > 0 ? (

//                 currentInvoices.map((inv, i) => {

//                   const rowNum = indexOfFirst + i + 1;

//                   return (

//                     <tr
//                       key={i}
//                       className="rp-row"
//                       onClick={() =>
//                         navigate(`/invoice/${inv.invoice_no}`)
//                       }
//                     >

//                       <td style={{ padding: "14px 18px" }}>
//                         {rowNum}
//                       </td>

//                       <td style={{ padding: "14px 18px" }}>

//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 8
//                           }}
//                         >

//                           <div
//                             style={{
//                               width: 32,
//                               height: 32,
//                               borderRadius: 10,
//                               background: "#eef2ff",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center"
//                             }}
//                           >
//                             <Receipt
//                               size={14}
//                               color="#4338ca"
//                             />
//                           </div>

//                           <span
//                             style={{
//                               fontWeight: 700,
//                               color: "#4338ca"
//                             }}
//                           >
//                             {inv.invoice_no}
//                           </span>

//                         </div>

//                       </td>

//                       <td style={{ padding: "14px 18px" }}>
//                         {inv.customer_name}
//                       </td>

//                       <td style={{ padding: "14px 18px" }}>
//                         {inv.customer_phone}
//                       </td>

//                       <td
//                         style={{
//                           padding: "14px 18px",
//                           color: "#15803d",
//                           fontWeight: 700
//                         }}
//                       >
//                         ₹{Number(inv.total_amount).toLocaleString()}
//                       </td>

//                       <td style={{ padding: "14px 18px" }}>

//                         <button
//                           className="rp-view-btn"
//                           onClick={(e) => {

//                             e.stopPropagation();

//                             navigate(`/invoice/${inv.invoice_no}`);
//                           }}
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 6,
//                             background: "#eef2ff",
//                             border: "1px solid #c7d2fe",
//                             color: "#4338ca",
//                             borderRadius: 10,
//                             padding: "7px 14px",
//                             cursor: "pointer",
//                             fontWeight: 600
//                           }}
//                         >
//                           <Eye size={13} />
//                           View
//                         </button>

//                       </td>

//                     </tr>

//                   );
//                 })

//               ) : (

//                 <tr>

//                   <td
//                     colSpan={6}
//                     style={{
//                       padding: "50px",
//                       textAlign: "center"
//                     }}
//                   >

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         gap: 10
//                       }}
//                     >

//                       <FileText
//                         size={32}
//                         color="#c7d2fe"
//                       />

//                       <span
//                         style={{
//                           color: "#9ca3af"
//                         }}
//                       >
//                         No invoices found
//                       </span>

//                     </div>

//                   </td>

//                 </tr>

//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>

//       {/* PAGINATION */}

//       {totalPages > 1 && (

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginTop: 18
//           }}
//         >

//           {/* prev */}

//           <button
//             className="rp-pg-btn"
//             onClick={() => goTo(currentPage - 1)}
//             disabled={currentPage === 1}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "8px 16px",
//               background: "#fff",
//               border: "1px solid #dbeafe",
//               borderRadius: 10,
//               cursor: "pointer"
//             }}
//           >
//             <ChevronLeft size={15} />
//             Prev
//           </button>

//           {/* pages */}

//           <div
//             style={{
//               display: "flex",
//               gap: 6
//             }}
//           >

//             {pages.map((p) => (

//               <button
//                 key={p}
//                 onClick={() => goTo(p)}
//                 className="rp-pg-btn"
//                 style={{
//                   width: 36,
//                   height: 36,
//                   borderRadius: 10,
//                   border: "1px solid #dbeafe",
//                   background:
//                     currentPage === p
//                       ? "#4338ca"
//                       : "#fff",
//                   color:
//                     currentPage === p
//                       ? "#fff"
//                       : "#4338ca",
//                   fontWeight: 700,
//                   cursor: "pointer"
//                 }}
//               >
//                 {p}
//               </button>

//             ))}

//           </div>

//           {/* next */}

//           <button
//             className="rp-pg-btn"
//             onClick={() => goTo(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "8px 16px",
//               background: "#fff",
//               border: "1px solid #dbeafe",
//               borderRadius: 10,
//               cursor: "pointer"
//             }}
//           >
//             Next
//             <ChevronRight size={15} />
//           </button>

//         </div>

//       )}

//     </div>
//   );
// }

//new update

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Receipt,
  Download
} from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ── inject styles ────────────────────────────────────────────────────────────

function useStyles() {

  useEffect(() => {

    const id = "reports-styles";

    if (document.getElementById(id)) return;

    const s = document.createElement("style");

    s.id = id;

    s.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .rp * {
        box-sizing: border-box;
      }

      @keyframes rp-in {
        from {
          opacity: 0;
          transform: translateY(14px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }

      .rp-row {
        transition: background .15s;
        cursor: pointer;
        font-size:12px;
      }


       .rp-row:hover td {
        background: #f5f7ff !important;
      }
      .rp-view-btn {
        transition: all .18s;
      }

      .rp-pg-btn {
        transition: all .18s;
      }

      .rp-pg-btn:hover:not(:disabled) {
        background: #e0e7ff !important;
        color: #4338ca !important;
      }

      .rp-search:focus {
        border-color: #6366f1 !important;
        box-shadow: 0 0 0 3px rgba(99,102,241,.1) !important;
      }

      .rp-card {
        animation: rp-in .4s ease both;
      }
    `;

    document.head.appendChild(s);

    return () => document.head.removeChild(s);

  }, []);
}

export default function Reports() {

  useStyles();

  const navigate = useNavigate();

  const font = "'Plus Jakarta Sans', sans-serif";

  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // popup states

  const [showPopup, setShowPopup] = useState(false);

  const [reportType, setReportType] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  const [monthlyDate, setMonthlyDate] = useState("");

  const recordsPerPage = 10;

  // ── fetch invoices ────────────────────────────────────────────────────────

  useEffect(() => {

    const fetchInvoices = async () => {

      try {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.company_id) return;

        const res = await api.post(
          "/invoice/get_all_invoice.php",
          {
            company_id: user.company_id
          }
        );

        if (res.data.status) {

          setInvoices(res.data.data);
        }

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

    fetchInvoices();

  }, []);

  // ── search filter ─────────────────────────────────────────────────────────

  const filtered = invoices.filter(inv =>

    inv.invoice_no?.toLowerCase().includes(search.toLowerCase()) ||

    inv.customer_name?.toLowerCase().includes(search.toLowerCase()) ||

    inv.customer_phone?.includes(search)
  );

  // ── pagination ────────────────────────────────────────────────────────────

  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  const indexOfFirst = (currentPage - 1) * recordsPerPage;

  const currentInvoices = filtered.slice(
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

  const handleSearch = (v) => {

    setSearch(v);

    setCurrentPage(1);
  };

  // ── button style ──────────────────────────────────────────────────────────

  const btnStyle = {
    background: "#4338ca",
    border: "none",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: font,
    display: "flex",
    alignItems: "center",
    gap: 8
  };

  // ── excel download ────────────────────────────────────────────────────────

  const downloadExcel = () => {

    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    let filteredData = [];

    const now = new Date();

    // DAILY

    if (reportType === "daily") {

      filteredData = invoices.filter(inv => {

        const invoiceDate = new Date(inv.created_at);

        return (
          invoiceDate.toDateString() === now.toDateString() &&
          inv.payment_method === paymentMethod
        );
      });
    }

    // WEEKLY

    else if (reportType === "weekly") {

      const firstDay = new Date();

      firstDay.setDate(now.getDate() - 7);

      filteredData = invoices.filter(inv => {

        const invoiceDate = new Date(inv.created_at);

        return (
          invoiceDate >= firstDay &&
          invoiceDate <= now &&
          inv.payment_method === paymentMethod
        );
      });
    }

    // MONTHLY

    else if (reportType === "monthly") {

      if (!monthlyDate) {
        alert("Please select month");
        return;
      }

      filteredData = invoices.filter(inv => {

        const invoiceDate = new Date(inv.created_at);

        const invoiceMonth =
          invoiceDate.getMonth() + 1;

        const invoiceYear =
          invoiceDate.getFullYear();

        const [year, month] = monthlyDate.split("-");

        return (
          invoiceMonth === Number(month) &&
          invoiceYear === Number(year) &&
          inv.payment_method === paymentMethod
        );
      });
    }

    if (filteredData.length === 0) {

      alert("No reports found");

      return;
    }

    const excelData = filteredData.map((inv, index) => ({

      "S.No": index + 1,

      "Invoice No": inv.invoice_no,

      "Customer Name": inv.customer_name,

      "Phone Number": inv.customer_phone,

      "Invoice Generated By": inv.cashier_name || "-",

      "Payment Method": inv.payment_method,

      "Payment Status": inv.payment_status,

      "Total Amount": `₹${Number(inv.total_amount).toLocaleString()}`,

      "Created Date": inv.created_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 22 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 25 }
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Invoice Report"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    );

    saveAs(
      blob,
      `${reportType}_${paymentMethod}_report.xlsx`
    );

    setShowPopup(false);

    setPaymentMethod("");

    setMonthlyDate("");
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (

    <div
      className="rp"
      style={{
        fontFamily: font,
        padding: "22px 26px"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
          flexWrap: "wrap",
          gap: 16
        }}
      >

        {/* left */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >

          <div style={{ fontSize: 12 }}>
            🧾
          </div>

          <div>

            <h1
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 800,
                color: "#1e1b4b"
              }}
            >
              Invoice Reports
            </h1>

            <p
              style={{
                margin: "2px 0 0",
                fontSize: 12,
                color: "#9ca3af"
              }}
            >
              View and manage all your invoices
            </p>

          </div>

        </div>

        {/* right */}

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap"
          }}
        >

          <button
            onClick={() => {
              setReportType("daily");
              setShowPopup(true);
            }}
            style={btnStyle}
          >
            <Download size={15} />
            Daily Report
          </button>

          <button
            onClick={() => {
              setReportType("weekly");
              setShowPopup(true);
            }}
            style={btnStyle}
          >
            <Download size={15} />
            Weekly Report
          </button>

          <button
            onClick={() => {
              setReportType("monthly");
              setShowPopup(true);
            }}
            style={btnStyle}
          >
            <Download size={15} />
            Monthly Report
          </button>

        </div>

      </div>

      {/* SEARCH */}

      <div
        style={{
          position: "relative",
          marginBottom: 18
        }}
      >

        <Search
          size={16}
          color="#6366f1"
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)"
          }}
        />

        <input
          className="rp-search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search invoices..."
          style={{
            width: "100%",
            padding: "12px 16px 12px 44px",
            background: "#fff",
            border: "1.5px solid #e0e7ff",
            borderRadius: 14,
            fontSize: 12,
            outline: "none"
          }}
        />

      </div>

      {/* TABLE */}

      <div
        className="rp-card"
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #e0e7ff",
          overflow: "hidden"
        }}
      >

        <div
          style={{
            height: 4,
            background:
              "linear-gradient(90deg,#4338ca,#6366f1,#818cf8)"
          }}
        />

        <div style={{ overflowX: "auto" }}>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1200

            }}
          >

            <thead>

              <tr style={{ background: "#eef2ff" }}>

                {[
                  "#",
                  "Invoice No",
                  "Customer",
                  "Phone",
                  "Amount",
                  "Payment Method",
                  "Invoice Generated By",
                  "Action"
                ].map((h, i) => (

                  <th
                    key={i}
                    style={{
                      padding: "12px 18px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#4338ca",
                      borderBottom: "1px solid #dbeafe",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {h}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan={8}
                    style={{
                      padding: "50px",
                      textAlign: "center"
                    }}
                  >
                    Loading...
                  </td>

                </tr>

              ) : currentInvoices.length > 0 ? (

                currentInvoices.map((inv, i) => {

                  const rowNum = indexOfFirst + i + 1;

                  return (

                    <tr
                      key={i}
                      className="rp-row"
                      onClick={() =>
                        navigate(`/invoice/${inv.invoice_no}`)
                      }
                    >

                      <td style={{ padding: "14px 18px" }}>
                        {rowNum}
                      </td>

                      <td style={{ padding: "14px 18px" }}>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                          }}
                        >

                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 10,
                              background: "#eef2ff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Receipt
                              size={14}
                              color="#4338ca"
                            />
                          </div>

                          <span
                            style={{
                              fontWeight: 700,
                              color: "#4338ca"
                            }}
                          >
                            {inv.invoice_no}
                          </span>

                        </div>

                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        {inv.customer_name}
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        {inv.customer_phone}
                      </td>

                      




                      <td
                        style={{
                          padding: "14px 18px",
                          color: "#15803d",
                          fontWeight: 700
                        }}
                      >
                        ₹{Number(inv.total_amount).toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 18px" }}>

  <span
    style={{
      padding: "6px 12px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
      background:
        inv.payment_method?.toLowerCase() === "cash"
          ? "#dcfce7"
          : inv.payment_method?.toLowerCase() === "online"
          ? "#dbeafe"
          : inv.payment_method?.toLowerCase() === "upi"
          ? "#f3e8ff"
          : "#fee2e2",
      color:
        inv.payment_method?.toLowerCase() === "cash"
          ? "#15803d"
          : inv.payment_method?.toLowerCase() === "online"
          ? "#1d4ed8"
          : inv.payment_method?.toLowerCase() === "upi"
          ? "#7e22ce"
          : "#dc2626"
    }}
  >
    {inv.payment_method || "-"}
  </span>

</td>

{/* CASHIER */}

{/* <td style={{ padding: "14px 18px" }}>

  <span
    style={{
      padding: "6px 12px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
      background: "#eef2ff",
      color: "#4338ca",
      whiteSpace: "nowrap"
    }}
  >
    {inv.cashier_name || "-"}
  </span>

</td> */}
 <td style={{ padding: "14px 18px" }}>
                        {inv.cashier_name || "-"}
                      </td>
                      <td style={{ padding: "14px 18px" }}>

                        <button
                          className="rp-view-btn"
                          onClick={(e) => {

                            e.stopPropagation();

                            navigate(`/invoice/${inv.invoice_no}`);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "#eef2ff",
                            border: "1px solid #c7d2fe",
                            color: "#4338ca",
                            borderRadius: 10,
                            padding: "7px 14px",
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                        >
                          <Eye size={13} />
                          View
                        </button>

                      </td>

                    </tr>

                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan={8}
                    style={{
                      padding: "50px",
                      textAlign: "center"
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10
                      }}
                    >

                      <FileText
                        size={32}
                        color="#c7d2fe"
                      />

                      <span
                        style={{
                          color: "#9ca3af"
                        }}
                      >
                        No invoices found
                      </span>

                    </div>

                  </td>

                </tr>

              )}

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

          <button
            className="rp-pg-btn"
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: "#fff",
              border: "1px solid #dbeafe",
              borderRadius: 10,
              cursor: "pointer"
            }}
          >
            <ChevronLeft size={15} />
            Prev
          </button>

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
                className="rp-pg-btn"
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

          <button
            className="rp-pg-btn"
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: "#fff",
              border: "1px solid #dbeafe",
              borderRadius: 10,
              cursor: "pointer"
            }}
          >
            Next
            <ChevronRight size={15} />
          </button>

        </div>

      )}

      {/* POPUP */}

      {showPopup && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >

          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 24,
              width: 350
            }}
          >

            <h3
              style={{
                marginTop: 0,
                marginBottom: 20,
                color: "#4338ca"
              }}
            >
              {reportType.toUpperCase()} Report
            </h3>

            {/* PAYMENT METHOD */}

            <div style={{ marginBottom: 16 }}>

              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 700
                }}
              >
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #dbeafe"
                }}
              >
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="upi">UPI</option>
                <option value="credit">Credit</option>
              </select>

            </div>

            {/* MONTH PICKER */}

            {reportType === "monthly" && (

              <div style={{ marginBottom: 18 }}>

                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 700
                  }}
                >
                  Select Month
                </label>

                <input
                  type="month"
                  value={monthlyDate}
                  onChange={(e) =>
                    setMonthlyDate(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #dbeafe"
                  }}
                />

              </div>

            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10
              }}
            >

              <button
                onClick={() => setShowPopup(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

              <button
                onClick={downloadExcel}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "#4338ca",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Download
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

