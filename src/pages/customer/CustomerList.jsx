// // // import { useEffect, useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import api from "../../services/api";

// // // import * as XLSX from "xlsx";
// // // import { saveAs } from "file-saver";

// // // import {
// // //   Pencil,
// // //   Search,
// // //   Phone,
// // //   MapPin,
// // //   Download,
// // //   Wallet
// // // } from "lucide-react";

// // // export default function CustomerList() {

// // //   const navigate = useNavigate();

// // //   const [customers, setCustomers] = useState([]);
// // //   const [search, setSearch] = useState("");
// // //   const [selectedCustomer, setSelectedCustomer] = useState(null);

// // //   const [invoiceHistory, setInvoiceHistory] = useState([]);

// // //   const [allHistory, setAllHistory] = useState([]);
// // //   const [toast, setToast] = useState(null);
  

// // //   // PAYMENT POPUP

// // //   const [showPaymentPopup, setShowPaymentPopup] =
// // //     useState(false);

// // //   const [selectedInvoice, setSelectedInvoice] =
// // //     useState(null);

// // //   const [receivedAmount, setReceivedAmount] =
// // //     useState("");

// // //   const [paymentMethod, setPaymentMethod] =
// // //     useState("cash");

// // //     const showToast = (msg, ok = true) => {

// // //   setToast({ msg, ok });

// // //   setTimeout(() => {
// // //     setToast(null);
// // //   }, 3000);

// // // };

// // //   // FETCH CUSTOMERS

// // //   const fetchCustomers = async () => {

// // //     try {

// // //       const user = JSON.parse(
// // //         localStorage.getItem("user")
// // //       );

// // //       const company_id = Number(
// // //         user?.company_id
// // //       );

// // //       const res = await api.get(
// // //         `/customer/get_all_customer.php?company_id=${company_id}`
// // //       );

// // //       if (res.data.status) {

// // //         setCustomers(res.data.data);

// // //         if (res.data.data.length > 0) {

// // //           setSelectedCustomer(
// // //             res.data.data[0]
// // //           );

// // //           fetchCustomerHistory(
// // //             res.data.data[0].id
// // //           );

// // //         }

// // //       }

// // //     } catch (err) {

// // //       console.error(err);

// // //     }

// // //   };

// // //   // FETCH ALL HISTORY

// // //   const fetchAllHistory = async () => {

// // //     try {

// // //       const user = JSON.parse(
// // //         localStorage.getItem("user")
// // //       );

// // //       const res = await api.post(
// // //         "/invoice/get_pending_invoice_history.php",
// // //         {
// // //           company_id: user.company_id
// // //         }
// // //       );

// // //       if (res.data.status) {

// // //         setAllHistory(
// // //           res.data.data
// // //         );

// // //       }

// // //     } catch (err) {

// // //       console.error(err);

// // //     }

// // //   };

// // //   // FETCH SINGLE CUSTOMER HISTORY

// // //   const fetchCustomerHistory = async (
// // //     customerId
// // //   ) => {

// // //     try {

// // //       const user = JSON.parse(
// // //         localStorage.getItem("user")
// // //       );

// // //       const res = await api.post(
// // //         "/invoice/get_pending_invoice_history.php",
// // //         {
// // //           company_id: user.company_id
// // //         }
// // //       );

// // //       if (res.data.status) {

// // //         const filteredHistory =
// // //           res.data.data.filter(
// // //             item =>
// // //               Number(item.customer_id) ===
// // //               Number(customerId)
// // //           );

// // //         setInvoiceHistory(
// // //           filteredHistory
// // //         );

// // //       }

// // //     } catch (err) {

// // //       console.error(err);

// // //     }

// // //   };

// // //   useEffect(() => {

// // //     fetchCustomers();

// // //     fetchAllHistory();

// // //   }, []);

// // //   // SEARCH

// // //   const filtered = customers.filter(
// // //     c =>
// // //       c.name
// // //         ?.toLowerCase()
// // //         .includes(search.toLowerCase()) ||
// // //       c.phone?.includes(search)
// // //   );

// // //   // DATE FORMAT

// // //   const formatDate = (date) => {

// // //     if (!date) return "-";

// // //     const d = new Date(
// // //       date.replace(" ", "T")
// // //     );

// // //     return d.toLocaleDateString(
// // //       "en-IN",
// // //       {
// // //         day: "2-digit",
// // //         month: "short",
// // //         year: "numeric"
// // //       }
// // //     );

// // //   };

// // //   // EXCEL DOWNLOAD

// // //   const downloadExcel = () => {

// // //     const excelData =
// // //       invoiceHistory.map((item) => ({

// // //         "Payment Method":
// // //           item.payment_method || "-",

// // //         Total:
// // //           item.total_amount,

// // //         Paid:
// // //           item.paid_amount_total,

// // //         Pending:
// // //           item.balance_amount,

// // //         "Due Date":
// // //           item.due_date
// // //             ? formatDate(item.due_date)
// // //             : "-",

// // //         Status:
// // //           Number(item.balance_amount) <= 0
// // //             ? "Paid"
// // //             : "Not Paid"

// // //       }));

// // //     const worksheet =
// // //       XLSX.utils.json_to_sheet(
// // //         excelData
// // //       );

// // //     worksheet["!cols"] = [
// // //       { wch: 18 },
// // //       { wch: 15 },
// // //       { wch: 15 },
// // //       { wch: 15 },
// // //       { wch: 18 },
// // //       { wch: 18 }
// // //     ];

// // //     const workbook =
// // //       XLSX.utils.book_new();

// // //     XLSX.utils.book_append_sheet(
// // //       workbook,
// // //       worksheet,
// // //       "Customer Report"
// // //     );

// // //     const excelBuffer =
// // //       XLSX.write(workbook, {
// // //         bookType: "xlsx",
// // //         type: "array"
// // //       });

// // //     const fileData =
// // //       new Blob(
// // //         [excelBuffer],
// // //         {
// // //           type:
// // //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// // //         }
// // //       );

// // //     saveAs(
// // //       fileData,
// // //       `${selectedCustomer?.name || "customer"}_report.xlsx`
// // //     );

// // //   };

// // //   // CUSTOMER PENDING TOTAL

// // //   const getCustomerPendingTotal = (
// // //     customerId
// // //   ) => {

// // //     const customerInvoices =
// // //       allHistory.filter(
// // //         item =>
// // //           Number(item.customer_id) ===
// // //           Number(customerId)
// // //       );

// // //     const totalPending =
// // //       customerInvoices.reduce(
// // //         (sum, item) =>
// // //           sum +
// // //           Number(
// // //             item.balance_amount || 0
// // //           ),
// // //         0
// // //       );

// // //     return totalPending;

// // //   };

// // //   // CREDIT PAYMENT

  
// // //   const handleCreditPayment = async () => {

// // //   if (!selectedInvoice) return;

// // //   if (!receivedAmount || Number(receivedAmount) <= 0) {
// // //     showToast("Enter valid amount", false);
// // //     return;
// // //   }

// // //   try {

// // //     const res = await api.post(
// // //       "/invoice/update_credit_payment.php",
// // //       {
// // //         invoice_id: selectedInvoice.id,
// // //         amount: receivedAmount,
// // //         payment_method: paymentMethod
// // //       }
// // //     );

// // //     console.log("FULL RESPONSE =", res);
// // //     console.log("DATA =", res.data);

// // //     // alert(JSON.stringify(res.data));

// // //     if (res.data.status) {

// // //      showToast(
// // //   res.data.message ||
// // //   "Payment Updated Successfully",
// // //   true
// // // );


// // //       setShowPaymentPopup(false);

// // //       setReceivedAmount("");

// // //       fetchCustomerHistory(selectedCustomer.id);

// // //       fetchAllHistory();

// // //     } else {

// // //      showToast(
// // //   res.data.message ||
// // //   "Something went wrong",
// // //   false
// // // );

// // //     }

// // //   } catch (err) {

// // //     console.log("ERROR =", err);

// // //     if (err.response) {
// // //       console.log("ERROR RESPONSE =", err.response.data);
// // //       // alert(JSON.stringify(err.response.data));
// // //     } else {
// // //      showToast("Server Error", false);
// // //     }

// // //   }

// // // };

// // //   return (
// // // <>

// // // <style>{`
// // // @keyframes toastIn {
// // //   from {
// // //     opacity: 0;
// // //     transform: translateY(-10px) scale(.95);
// // //   }
// // //   to {
// // //     opacity: 1;
// // //     transform: translateY(0) scale(1);
// // //   }
// // // }
// // // `}</style>
// // // {/* TOAST */}

// // // {toast && (

// // //   <div
// // //     style={{
// // //       position: "fixed",
// // //       top: 20,
// // //       right: 20,
// // //       zIndex: 99999,
// // //       background: toast.ok
// // //         ? "linear-gradient(135deg,#2563eb,#3b82f6)"
// // //         : "linear-gradient(135deg,#dc2626,#ef4444)",
// // //       color: "#fff",
// // //       padding: "13px 18px",
// // //       borderRadius: 14,
// // //       boxShadow: "0 10px 30px rgba(0,0,0,.15)",
// // //       display: "flex",
// // //       alignItems: "center",
// // //       gap: 10,
// // //       fontWeight: 600,
// // //       fontSize: 14,
// // //       animation: "toastIn .25s ease"
// // //     }}
// // //   >

// // //     <div
// // //       style={{
// // //         width: 22,
// // //         height: 22,
// // //         borderRadius: 7,
// // //         background: "rgba(255,255,255,.2)",
// // //         display: "flex",
// // //         alignItems: "center",
// // //         justifyContent: "center",
// // //         fontSize: 12,
// // //         fontWeight: 700
// // //       }}
// // //     >
// // //       {toast.ok ? "✓" : "✕"}
// // //     </div>

// // //     {toast.msg}

// // //   </div>

// // // )}
// // //     <div
// // //       style={{
// // //         minHeight: "100vh",
// // //         background: "#f3f4f6",
// // //         padding: 20,
// // //         fontFamily: "Inter, sans-serif"
// // //       }}
// // //     >

// // //       {/* HEADER */}

// // //       <div
// // //         style={{
// // //           display: "flex",
// // //           justifyContent:
// // //             "space-between",
// // //           alignItems: "center",
// // //           marginBottom: 16
// // //         }}
// // //       >

// // //         <div>

// // //           <h2
// // //             style={{
// // //               margin: 0,
// // //               fontSize: 24,
// // //               fontWeight: 700
// // //             }}
// // //           >
// // //             Customers
// // //           </h2>

// // //           <p
// // //             style={{
// // //               marginTop: 4,
// // //               color: "#64748b",
// // //               fontSize: 13
// // //             }}
// // //           >
// // //             Manage your customers
// // //           </p>

// // //         </div>

// // //         <div
// // //           style={{
// // //             display: "flex",
// // //             gap: 10,
// // //             alignItems: "center"
// // //           }}
// // //         >

// // //           <button
// // //             onClick={downloadExcel}
// // //             style={{
// // //               background: "#16a34a",
// // //               color: "#fff",
// // //               border: "none",
// // //               borderRadius: 10,
// // //               padding: "12px 18px",
// // //               fontWeight: 600,
// // //               cursor: "pointer",
// // //               display: "flex",
// // //               alignItems: "center",
// // //               gap: 8
// // //             }}
// // //           >
// // //             <Download size={16} />
// // //             Excel Download
// // //           </button>

// // //           <button
// // //             onClick={() =>
// // //               navigate("/customer/add")
// // //             }
// // //             style={{
// // //               background: "#ef4444",
// // //               color: "#fff",
// // //               border: "none",
// // //               borderRadius: 10,
// // //               padding: "12px 18px",
// // //               fontWeight: 600,
// // //               cursor: "pointer"
// // //             }}
// // //           >
// // //             + Add Customer
// // //           </button>

// // //         </div>

// // //       </div>

// // //       {/* MAIN */}

// // //       <div
// // //         style={{
// // //           display: "grid",
// // //           gridTemplateColumns:
// // //             "320px 1fr",
// // //           gap: 16,
// // //           height:
// // //             "calc(100vh - 120px)"
// // //         }}
// // //       >

// // //         {/* LEFT */}

// // //         <div
// // //           style={{
// // //             background: "#fff",
// // //             borderRadius: 14,
// // //             overflow: "hidden",
// // //             border:
// // //               "1px solid #e5e7eb",
// // //             display: "flex",
// // //             flexDirection: "column"
// // //           }}
// // //         >

// // //           {/* SEARCH */}

// // //           <div
// // //             style={{
// // //               padding: 14,
// // //               borderBottom:
// // //                 "1px solid #f1f5f9",
// // //               position: "relative"
// // //             }}
// // //           >

// // //             <Search
// // //               size={16}
// // //               style={{
// // //                 position: "absolute",
// // //                 top: "50%",
// // //                 left: 26,
// // //                 transform:
// // //                   "translateY(-50%)",
// // //                 color: "#94a3b8"
// // //               }}
// // //             />

// // //             <input
// // //               placeholder="Search customer..."
// // //               value={search}
// // //               onChange={(e) =>
// // //                 setSearch(
// // //                   e.target.value
// // //                 )
// // //               }
// // //               style={{
// // //                 width: "100%",
// // //                 padding:
// // //                   "10px 14px 10px 36px",
// // //                 borderRadius: 10,
// // //                 border:
// // //                   "1px solid #dbeafe",
// // //                 outline: "none",
// // //                 fontSize: 13
// // //               }}
// // //             />

// // //           </div>

// // //           {/* CUSTOMER LIST */}

// // //           <div
// // //             style={{
// // //               overflowY: "auto",
// // //               flex: 1
// // //             }}
// // //           >

// // //             {filtered.map((c) => {

// // //               const pendingTotal =
// // //                 getCustomerPendingTotal(
// // //                   c.id
// // //                 );

// // //               return (

// // //                 <div
// // //                   key={c.id}
// // //                   onClick={() => {

// // //                     setSelectedCustomer(
// // //                       c
// // //                     );

// // //                     fetchCustomerHistory(
// // //                       c.id
// // //                     );

// // //                   }}
// // //                   style={{
// // //                     padding: 14,
// // //                     borderBottom:
// // //                       "1px solid #f1f5f9",
// // //                     cursor: "pointer",
// // //                     background:
// // //                       selectedCustomer?.id ===
// // //                       c.id
// // //                         ? "#dbeafe"
// // //                         : "#fff"
// // //                   }}
// // //                 >

// // //                   <div
// // //                     style={{
// // //                       display: "flex",
// // //                       justifyContent:
// // //                         "space-between"
// // //                     }}
// // //                   >

// // //                     <div>

// // //                       <div
// // //                         style={{
// // //                           fontWeight: 700
// // //                         }}
// // //                       >
// // //                         {c.name}
// // //                       </div>

// // //                       <div
// // //                         style={{
// // //                           fontSize: 12,
// // //                           color: "#64748b",
// // //                           marginTop: 4
// // //                         }}
// // //                       >
// // //                         {c.phone}
// // //                       </div>

// // //                     </div>

// // //                     <div
// // //                       style={{
// // //                         fontWeight: 700,
// // //                         color:
// // //                           pendingTotal > 0
// // //                             ? "#10b981"
// // //                             : "#94a3b8"
// // //                       }}
// // //                     >
// // //                       ₹
// // //                       {Number(
// // //                         pendingTotal
// // //                       ).toLocaleString()}
// // //                     </div>

// // //                   </div>

// // //                 </div>

// // //               );

// // //             })}

// // //           </div>

// // //         </div>

// // //         {/* RIGHT */}

// // //         <div
// // //           style={{
// // //             background: "#fff",
// // //             borderRadius: 14,
// // //             border:
// // //               "1px solid #e5e7eb",
// // //             overflow: "hidden",
// // //             display: "flex",
// // //             flexDirection: "column"
// // //           }}
// // //         >

// // //           {/* HEADER */}

// // //           {selectedCustomer && (

// // //             <div
// // //               style={{
// // //                 padding: 20,
// // //                 borderBottom:
// // //                   "1px solid #f1f5f9"
// // //               }}
// // //             >

// // //               <div
// // //                 style={{
// // //                   display: "flex",
// // //                   justifyContent:
// // //                     "space-between"
// // //                 }}
// // //               >

// // //                 <div>

// // //                   <div
// // //                     style={{
// // //                       fontSize: 24,
// // //                       fontWeight: 700,
// // //                       marginBottom: 10
// // //                     }}
// // //                   >
// // //                     {
// // //                       selectedCustomer.name
// // //                     }
// // //                   </div>

// // //                   <div
// // //                     style={{
// // //                       display: "flex",
// // //                       alignItems:
// // //                         "center",
// // //                       gap: 8,
// // //                       marginBottom: 8
// // //                     }}
// // //                   >
// // //                     <Phone size={14} />
// // //                     {
// // //                       selectedCustomer.phone
// // //                     }
// // //                   </div>

// // //                   <div
// // //                     style={{
// // //                       display: "flex",
// // //                       alignItems:
// // //                         "center",
// // //                       gap: 8
// // //                     }}
// // //                   >
// // //                     <MapPin size={14} />
// // //                     {
// // //                       selectedCustomer.address
// // //                     }
// // //                   </div>

// // //                 </div>

// // //                 <button
// // //                   onClick={() =>
// // //                     navigate(
// // //                       `/customer/edit/${selectedCustomer.id}`
// // //                     )
// // //                   }
// // //                   style={btnEdit}
// // //                 >
// // //                   <Pencil size={16} />
// // //                 </button>

// // //               </div>

// // //             </div>

// // //           )}

// // //           {/* TABLE HEADER */}

// // //           <div
// // //             style={{
// // //              display: "grid",
// // // gridTemplateColumns:
// // //   "1.2fr .8fr .8fr .8fr 1fr 1fr 1fr",
// // // alignItems: "center",
// // // textAlign: "center",
// // // columnGap: 12,
// // //               padding: "14px 20px",
// // //               background: "#f8fafc",
// // //               borderBottom:
// // //                 "1px solid #e5e7eb",
// // //               fontWeight: 700,
// // //               fontSize: 13,
// // //               minWidth: "100%"
// // //             }}
// // //           >

// // //             <span>Payment Method</span>

// // //             <span>Total</span>

// // //             <span>Paid</span>

// // //             <span>Pending</span>

// // //             <span>Due Date</span>

// // //             <span>Status</span>

// // //             {/* <span>Action</span> */}
// // //             <span style={{ textAlign: "center" }}>
// // //   Collect Payment
// // // </span>

// // //           </div>

// // //           {/* ROWS */}

// // //           <div
// // //             style={{
// // //               overflowY: "auto",
// // //               flex: 1
// // //             }}
// // //           >

// // //             {invoiceHistory.map(
// // //               (item, index) => {

// // //                 const isPaid =
// // //                   Number(
// // //                     item.balance_amount
// // //                   ) <= 0;

// // //                 return (

// // //                   <div
// // //                     key={index}
// // //                     style={{
                      
// // //                       // minWidth: "100%"
// // //                       display: "grid",
// // // gridTemplateColumns:
// // //   "1.2fr .8fr .8fr .8fr 1fr 1fr 1fr",
// // // padding: "18px 20px",
// // // alignItems: "center",
// // // textAlign: "center",
// // // columnGap: 12,
// // // borderBottom: "1px solid #f1f5f9",
// // //                     }}
// // //                   >

// // //                     {/* PAYMENT METHOD */}

// // //                     <div
// // //                      style={{
// // //     textTransform: "capitalize",
// // //     fontWeight: 600
// // //   }}>
// // //                       {item.payment_method}
// // //                     </div>

// // //                     {/* TOTAL */}

// // //                     <div>
// // //                       ₹
// // //                       {Number(
// // //                         item.total_amount
// // //                       ).toLocaleString()}
// // //                     </div>

// // //                     {/* PAID */}

// // //                     <div
// // //                       style={{
// // //                         color: "#16a34a",
// // //                         fontWeight: 700
// // //                       }}
// // //                     >
// // //                       ₹
// // //                       {Number(
// // //                         item.paid_amount_total
// // //                       ).toLocaleString()}
// // //                     </div>

// // //                     {/* PENDING */}

// // //                     <div>

// // //                       <span
// // //                         style={{
// // //                           background:
// // //                             "#fee2e2",
// // //                           color: "#dc2626",
// // //                           padding:
// // //                             "5px 10px",
// // //                           borderRadius: 8
// // //                         }}
// // //                       >
// // //                         ₹
// // //                         {Number(
// // //                           item.balance_amount
// // //                         ).toLocaleString()}
// // //                       </span>

// // //                     </div>

// // //                     {/* DUE DATE */}

// // //                     <div>
// // //                       {item.due_date
// // //                         ? formatDate(
// // //                             item.due_date
// // //                           )
// // //                         : "-"}
// // //                     </div>

// // //                     {/* STATUS */}

// // //                     <div>

// // //                      <span
// // //   style={{
// // //     padding: "7px 16px",
// // //     borderRadius: 20,
// // //     fontSize: 12,
// // //     fontWeight: 700,
// // //     background:
// // //       isPaid
// // //         ? "#dcfce7"
// // //         : "#fee2e2",
// // //     color:
// // //       isPaid
// // //         ? "#15803d"
// // //         : "#dc2626",
// // //     display: "inline-block",
// // //     minWidth: 90,
// // //     textAlign: "center"
// // //   }}
// // // >
// // //   {isPaid
// // //     ? "Paid"
// // //     : "Not Paid"}
// // // </span>
// // //                     </div>

// // //                     {/* ACTION */}

// // //                     <div>

// // //                       {Number(
// // //                         item.balance_amount
// // //                       ) > 0 && (

// // //                         <button
// // //                           onClick={() => {

// // //                             setSelectedInvoice(
// // //                               item
// // //                             );

// // //                             setShowPaymentPopup(
// // //                               true
// // //                             );

// // //                           }}
// // //                          style={{
// // //   background: "#2563eb",
// // //   color: "#fff",
// // //   border: "none",
// // //   padding: "10px 16px",
// // //   borderRadius: 12,
// // //   cursor: "pointer",
// // //   fontSize: 13,
// // //   fontWeight: 700,
// // //   display: "flex",
// // //   alignItems: "center",
// // //   justifyContent: "center",
// // //   gap: 6,
// // //   minWidth: 110
// // // }}
// // //                         >
// // //                           <Wallet size={14} />
// // //                           Collect
// // //                         </button>

// // //                       )}

// // //                     </div>

// // //                   </div>

// // //                 );

// // //               }
// // //             )}

// // //             {invoiceHistory.length === 0 && (

// // //   <div
// // //     style={{
// // //       flex: 1,
// // //       display: "flex",
// // //       alignItems: "center",
// // //       justifyContent: "center",
// // //       flexDirection: "column",
// // //       padding: 40,
// // //       textAlign: "center",
// // //       color: "#64748b"
// // //     }}
// // //   >

// // //     <div
// // //       style={{
// // //         fontSize: 70,
// // //         marginBottom: 20
// // //       }}
// // //     >
// // //       📄
// // //     </div>

// // //     <h2
// // //       style={{
// // //         margin: 0,
// // //         color: "#0f172a"
// // //       }}
// // //     >
// // //       No Billing Records Found
// // //     </h2>

// // //     <p
// // //       style={{
// // //         marginTop: 10,
// // //         fontSize: 15,
// // //         maxWidth: 400,
// // //         lineHeight: 1.7
// // //       }}
// // //     >
// // //       This customer does not have any
// // //       billing or payment history yet.
// // //     </p>

// // //     {/* <button
// // //       onClick={() => navigate("/billing")}
// // //       style={{
// // //         marginTop: 20,
// // //         background: "#2563eb",
// // //         color: "#fff",
// // //         border: "none",
// // //         borderRadius: 12,
// // //         padding: "12px 20px",
// // //         fontWeight: 700,
// // //         cursor: "pointer"
// // //       }}
// // //     >
// // //       + Create Bill
// // //     </button> */}

// // //   </div>

// // // )}

// // //           </div>

// // //         </div>

// // //       </div>

// // //       {/* PAYMENT POPUP */}

// // //       {showPaymentPopup && (

// // //         <div
// // //           style={{
// // //             position: "fixed",
// // //             inset: 0,
// // //             background:
// // //               "rgba(0,0,0,.4)",
// // //             display: "flex",
// // //             alignItems: "center",
// // //             justifyContent: "center",
// // //             zIndex: 9999
// // //           }}
// // //         >

// // //           <div
// // //             style={{
// // //               background: "#fff",
// // //               width: 380,
// // //               borderRadius: 18,
// // //               padding: 24
// // //             }}
// // //           >

// // //             <h3>
// // //               Collect Credit Payment
// // //             </h3>

// // //             <div
// // //               style={{
// // //                 marginBottom: 14
// // //               }}
// // //             >
// // //               Pending :
// // //               ₹
// // //               {Number(
// // //                 selectedInvoice?.balance_amount || 0
// // //               ).toLocaleString()}
// // //             </div>

// // //             <input
// // //               type="number"
// // //               placeholder="Enter amount"
// // //               value={receivedAmount}
// // //               onChange={(e) =>
// // //                 setReceivedAmount(
// // //                   e.target.value
// // //                 )
// // //               }
// // //               style={{
// // //                 width: "100%",
// // //                 padding: 12,
// // //                 borderRadius: 10,
// // //                 border:
// // //                   "1px solid #dbeafe",
// // //                 marginBottom: 14
// // //               }}
// // //             />

// // //             <select
// // //               value={paymentMethod}
// // //               onChange={(e) =>
// // //                 setPaymentMethod(
// // //                   e.target.value
// // //                 )
// // //               }
// // //               style={{
// // //                 width: "100%",
// // //                 padding: 12,
// // //                 borderRadius: 10,
// // //                 border:
// // //                   "1px solid #dbeafe",
// // //                 marginBottom: 20
// // //               }}
// // //             >
// // //               <option value="cash">
// // //                 Cash
// // //               </option>

// // //               <option value="online">
// // //                 Online
// // //               </option>

// // //               <option value="upi">
// // //                 UPI
// // //               </option>

// // //             </select>

// // //             <div
// // //               style={{
// // //                 display: "flex",
// // //                 justifyContent:
// // //                   "flex-end",
// // //                 gap: 10
// // //               }}
// // //             >

// // //               <button
// // //                 onClick={() =>
// // //                   setShowPaymentPopup(false)
// // //                 }
// // //                 style={{
// // //                   padding: "10px 14px",
// // //                   borderRadius: 10,
// // //                   border:
// // //                     "1px solid #d1d5db",
// // //                   background: "#fff"
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </button>

// // //               <button
// // //                 onClick={
// // //                   handleCreditPayment
// // //                 }
// // //                 style={{
// // //                   padding: "10px 14px",
// // //                   borderRadius: 10,
// // //                   border: "none",
// // //                   background: "#2563eb",
// // //                   color: "#fff",
// // //                   fontWeight: 700
// // //                 }}
// // //               >
// // //                 Submit
// // //               </button>

// // //             </div>

// // //           </div>

// // //         </div>

// // //       )}

// // //     </div>
// // // </>
// // //   );

// // // }

// // // const btnEdit = {
// // //   background: "#eff6ff",
// // //   border: "1px solid #dbeafe",
// // //   width: 52,
// // //   height: 52,
// // //   borderRadius: 14,
// // //   cursor: "pointer",
// // //   color: "#2563eb",
// // //   display: "flex",
// // //   alignItems: "center",
// // //   justifyContent: "center",
// // //   flexShrink: 0
// // // };

// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import api from "../../services/api";
// // import * as XLSX from "xlsx";
// // import { saveAs } from "file-saver";
// // import {
// //   Pencil, Search, Phone, MapPin, Download, Wallet,
// //   CheckCircle, AlertCircle, ChevronRight, IndianRupee
// // } from "lucide-react";

// // /* ─────────────────── helpers ─────────────────── */
// // const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

// // const formatDate = (date) => {
// //   if (!date) return "-";
// //   return new Date(date.replace(" ", "T")).toLocaleDateString("en-IN", {
// //     day: "2-digit", month: "short", year: "numeric",
// //   });
// // };

// // /* Smart distribution: FIFO across pending invoices */
// // const distributePayment = (pendingInvoices, totalAmount) => {
// //   let remaining = Number(totalAmount);
// //   return pendingInvoices.map((inv) => {
// //     const bal = Number(inv.balance_amount);
// //     if (remaining <= 0) return { ...inv, _applying: 0, _newBalance: bal };
// //     const applying = Math.min(remaining, bal);
// //     remaining -= applying;
// //     return { ...inv, _applying: applying, _newBalance: bal - applying };
// //   });
// // };

// // /* ─────────────────── component ─────────────────── */
// // export default function CustomerList() {
// //   const navigate = useNavigate();

// //   const [customers, setCustomers]           = useState([]);
// //   const [search, setSearch]                 = useState("");
// //   const [selectedCustomer, setSelectedCustomer] = useState(null);
// //   const [invoiceHistory, setInvoiceHistory] = useState([]);
// //   const [allHistory, setAllHistory]         = useState([]);
// //   const [toast, setToast]                   = useState(null);

// //   /* collect panel */
// //   const [collectAmount, setCollectAmount]   = useState("");
// //   const [collectMethod, setCollectMethod]   = useState("cash");
// //   const [collecting, setCollecting]         = useState(false);
// //   const [preview, setPreview]               = useState([]);   // distribution preview

// //   /* ── toast ── */
// //   const showToast = (msg, ok = true) => {
// //     setToast({ msg, ok });
// //     setTimeout(() => setToast(null), 3000);
// //   };

// //   /* ── fetch customers ── */
// //   const fetchCustomers = async () => {
// //     try {
// //       const user = JSON.parse(localStorage.getItem("user"));
// //       const res  = await api.get(`/customer/get_all_customer.php?company_id=${user.company_id}`);
// //       if (res.data.status) {
// //         setCustomers(res.data.data);
// //         if (res.data.data.length > 0) {
// //           setSelectedCustomer(res.data.data[0]);
// //           fetchCustomerHistory(res.data.data[0].id);
// //         }
// //       }
// //     } catch (err) { console.error(err); }
// //   };

// //   /* ── fetch all history (for sidebar totals) ── */
// //   const fetchAllHistory = async () => {
// //     try {
// //       const user = JSON.parse(localStorage.getItem("user"));
// //       const res  = await api.post("/invoice/get_pending_invoice_history.php", { company_id: user.company_id });
// //       if (res.data.status) setAllHistory(res.data.data);
// //     } catch (err) { console.error(err); }
// //   };

// //   /* ── fetch single customer history ── */
// //   const fetchCustomerHistory = async (customerId) => {
// //     try {
// //       const user = JSON.parse(localStorage.getItem("user"));
// //       const res  = await api.post("/invoice/get_pending_invoice_history.php", { company_id: user.company_id });
// //       if (res.data.status) {
// //         const filtered = res.data.data.filter(
// //           (item) => Number(item.customer_id) === Number(customerId)
// //         );
// //         setInvoiceHistory(filtered);
// //       }
// //     } catch (err) { console.error(err); }
// //   };

// //   useEffect(() => {
// //     fetchCustomers();
// //     fetchAllHistory();
// //   }, []);

// //   /* ── recalculate preview whenever collectAmount changes ── */
// //   useEffect(() => {
// //     const pending = invoiceHistory.filter((i) => Number(i.balance_amount) > 0);
// //     if (!collectAmount || Number(collectAmount) <= 0) {
// //       setPreview([]);
// //     } else {
// //       setPreview(distributePayment(pending, collectAmount));
// //     }
// //   }, [collectAmount, invoiceHistory]);

// //   /* ── pending total for sidebar ── */
// //   const getCustomerPendingTotal = (customerId) =>
// //     allHistory
// //       .filter((i) => Number(i.customer_id) === Number(customerId))
// //       .reduce((s, i) => s + Number(i.balance_amount || 0), 0);

// //   /* ── pending invoices for selected customer ── */
// //   const pendingInvoices = invoiceHistory.filter(
// //     (i) => Number(i.balance_amount) > 0
// //   );
// //   const totalPending = pendingInvoices.reduce(
// //     (s, i) => s + Number(i.balance_amount), 0
// //   );

// //   /* ── bulk collect payment (FIFO) ── */
// //   const handleBulkCollect = async () => {
// //     if (!collectAmount || Number(collectAmount) <= 0) {
// //       showToast("Enter a valid amount", false);
// //       return;
// //     }
// //     if (Number(collectAmount) > totalPending) {
// //       showToast("Amount exceeds total pending", false);
// //       return;
// //     }

// //     setCollecting(true);
// //     const distributed = distributePayment(pendingInvoices, collectAmount);
// //     const toUpdate    = distributed.filter((i) => i._applying > 0);

// //     try {
// //       // fire each update sequentially
// //       for (const inv of toUpdate) {
// //         await api.post("/invoice/update_credit_payment.php", {
// //           invoice_id:     inv.id,
// //           amount:         inv._applying,
// //           payment_method: collectMethod,
// //         });
// //       }
// //       showToast("Payment collected successfully", true);
// //       setCollectAmount("");
// //       setPreview([]);
// //       fetchCustomerHistory(selectedCustomer.id);
// //       fetchAllHistory();
// //     } catch (err) {
// //       showToast("Server error, please retry", false);
// //     } finally {
// //       setCollecting(false);
// //     }
// //   };

// //   /* ── excel ── */
// //   const downloadExcel = () => {
// //     const rows = invoiceHistory.map((item) => ({
// //       "Payment Method": item.payment_method || "-",
// //       Total:            item.total_amount,
// //       Paid:             item.paid_amount_total,
// //       Pending:          item.balance_amount,
// //       "Due Date":       item.due_date ? formatDate(item.due_date) : "-",
// //       Status:           Number(item.balance_amount) <= 0 ? "Paid" : "Not Paid",
// //     }));
// //     const ws = XLSX.utils.json_to_sheet(rows);
// //     ws["!cols"] = [18, 15, 15, 15, 18, 18].map((w) => ({ wch: w }));
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, "Customer Report");
// //     const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
// //     saveAs(
// //       new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
// //       `${selectedCustomer?.name || "customer"}_report.xlsx`
// //     );
// //   };

// //   const filtered = customers.filter(
// //     (c) =>
// //       c.name?.toLowerCase().includes(search.toLowerCase()) ||
// //       c.phone?.includes(search)
// //   );

// //   /* ═══════════════════════════════════════════ */
// //   return (
// //     <>
// //       <style>{`
// //         @keyframes toastIn {
// //           from { opacity:0; transform:translateY(-10px) scale(.95); }
// //           to   { opacity:1; transform:translateY(0) scale(1); }
// //         }
// //         @keyframes fadeUp {
// //           from { opacity:0; transform:translateY(6px); }
// //           to   { opacity:1; transform:translateY(0); }
// //         }
// //         .cust-row:hover { background:#f8fafc !important; }
// //         .collect-btn:hover { background:#1d4ed8 !important; }
// //         .method-btn { transition: all .15s; }
// //         .method-btn:hover { border-color:#2563eb !important; color:#2563eb !important; }
// //       `}</style>

// //       {/* TOAST */}
// //       {toast && (
// //         <div style={{
// //           position:"fixed", top:20, right:20, zIndex:99999,
// //           background: toast.ok
// //             ? "linear-gradient(135deg,#2563eb,#3b82f6)"
// //             : "linear-gradient(135deg,#dc2626,#ef4444)",
// //           color:"#fff", padding:"13px 18px", borderRadius:14,
// //           boxShadow:"0 10px 30px rgba(0,0,0,.18)",
// //           display:"flex", alignItems:"center", gap:10,
// //           fontWeight:600, fontSize:14, animation:"toastIn .25s ease"
// //         }}>
// //           <div style={{
// //             width:22, height:22, borderRadius:7,
// //             background:"rgba(255,255,255,.22)",
// //             display:"flex", alignItems:"center", justifyContent:"center",
// //             fontSize:12, fontWeight:700
// //           }}>
// //             {toast.ok ? "✓" : "✕"}
// //           </div>
// //           {toast.msg}
// //         </div>
// //       )}

// //       <div style={{
// //         minHeight:"100vh", background:"#f1f5f9",
// //         padding:"20px 20px 20px 20px",
// //         fontFamily:"Inter, sans-serif"
// //       }}>

// //         {/* HEADER */}
// //         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
// //           <div>
// //             <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#0f172a" }}>Customers</h2>
// //             <p style={{ marginTop:3, color:"#64748b", fontSize:13, margin:0 }}>Manage your customers & payments</p>
// //           </div>
// //           <div style={{ display:"flex", gap:10, alignItems:"center" }}>
// //             <button onClick={downloadExcel} style={btnGreen}>
// //               <Download size={15}/> Excel Download
// //             </button>
// //             <button onClick={() => navigate("/customer/add")} style={btnRed}>
// //               + Add Customer
// //             </button>
// //           </div>
// //         </div>

// //         {/* MAIN GRID: left | center | right */}
// //         <div style={{
// //           display:"grid",
// //           gridTemplateColumns:"300px 1fr 320px",
// //           gap:16,
// //           height:"calc(100vh - 120px)"
// //         }}>

// //           {/* ── LEFT: customer list ── */}
// //           <div style={card}>
// //             {/* search */}
// //             <div style={{ padding:"12px 14px", borderBottom:"1px solid #f1f5f9", position:"relative" }}>
// //               <Search size={15} style={{ position:"absolute", top:"50%", left:26, transform:"translateY(-50%)", color:"#94a3b8" }}/>
// //               <input
// //                 placeholder="Search customer..."
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //                 style={{
// //                   width:"100%", padding:"9px 12px 9px 34px",
// //                   borderRadius:10, border:"1px solid #e2e8f0",
// //                   outline:"none", fontSize:13, boxSizing:"border-box"
// //                 }}
// //               />
// //             </div>

// //             <div style={{ overflowY:"auto", flex:1 }}>
// //               {filtered.map((c) => {
// //                 const pt = getCustomerPendingTotal(c.id);
// //                 const isSelected = selectedCustomer?.id === c.id;
// //                 return (
// //                   <div
// //                     key={c.id}
// //                     className="cust-row"
// //                     onClick={() => {
// //                       setSelectedCustomer(c);
// //                       fetchCustomerHistory(c.id);
// //                       setCollectAmount("");
// //                       setPreview([]);
// //                     }}
// //                     style={{
// //                       padding:"12px 14px",
// //                       borderBottom:"1px solid #f1f5f9",
// //                       cursor:"pointer",
// //                       background: isSelected ? "#eff6ff" : "#fff",
// //                       borderLeft: isSelected ? "3px solid #2563eb" : "3px solid transparent",
// //                       transition:"all .15s"
// //                     }}
// //                   >
// //                     <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
// //                       <div>
// //                         <div style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{c.name}</div>
// //                         <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{c.phone}</div>
// //                       </div>
// //                       <div style={{
// //                         fontWeight:700, fontSize:13,
// //                         color: pt > 0 ? "#ef4444" : "#94a3b8"
// //                       }}>
// //                         ₹{fmt(pt)}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {/* ── CENTER: invoice table ── */}
// //           <div style={{ ...card, overflow:"hidden" }}>

// //             {/* customer header */}
// //             {selectedCustomer && (
// //               <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9" }}>
// //                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
// //                   <div>
// //                     <div style={{ fontSize:20, fontWeight:800, color:"#0f172a", marginBottom:8 }}>
// //                       {selectedCustomer.name}
// //                     </div>
// //                     <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#64748b", marginBottom:4 }}>
// //                       <Phone size={13}/> {selectedCustomer.phone}
// //                     </div>
// //                     <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#64748b" }}>
// //                       <MapPin size={13}/> {selectedCustomer.address}
// //                     </div>
// //                   </div>
// //                   <button onClick={() => navigate(`/customer/edit/${selectedCustomer.id}`)} style={btnEdit}>
// //                     <Pencil size={15}/>
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //             {/* table header */}
// //             <div style={{
// //               display:"grid",
// //               gridTemplateColumns:"1.2fr .8fr .8fr .8fr 1fr 1fr",
// //               padding:"11px 20px",
// //               background:"#f8fafc",
// //               borderBottom:"1px solid #e5e7eb",
// //               fontWeight:700, fontSize:12, color:"#64748b",
// //               textTransform:"uppercase", letterSpacing:".5px",
// //               textAlign:"center"
// //             }}>
// //               <span style={{ textAlign:"left" }}>Payment Method</span>
// //               <span>Total</span>
// //               <span>Paid</span>
// //               <span>Pending</span>
// //               <span>Due Date</span>
// //               <span>Status</span>
// //             </div>

// //             {/* rows */}
// //             <div style={{ overflowY:"auto", flex:1 }}>
// //               {invoiceHistory.length === 0 ? (
// //                 <div style={{
// //                   display:"flex", flexDirection:"column",
// //                   alignItems:"center", justifyContent:"center",
// //                   padding:48, color:"#94a3b8", textAlign:"center"
// //                 }}>
// //                   <div style={{ fontSize:52, marginBottom:14 }}>📄</div>
// //                   <div style={{ fontWeight:700, fontSize:16, color:"#0f172a" }}>No Billing Records</div>
// //                   <p style={{ fontSize:13, marginTop:6, maxWidth:300, lineHeight:1.6 }}>
// //                     This customer has no billing or payment history yet.
// //                   </p>
// //                 </div>
// //               ) : (
// //                 invoiceHistory.map((item, index) => {
// //                   const isPaid = Number(item.balance_amount) <= 0;
// //                   /* find preview for this invoice */
// //                   const prev = preview.find((p) => p.id === item.id);

// //                   return (
// //                     <div
// //                       key={index}
// //                       style={{
// //                         display:"grid",
// //                         gridTemplateColumns:"1.2fr .8fr .8fr .8fr 1fr 1fr",
// //                         padding:"14px 20px",
// //                         alignItems:"center",
// //                         textAlign:"center",
// //                         borderBottom:"1px solid #f8fafc",
// //                         animation:"fadeUp .2s ease",
// //                         background: prev && prev._applying > 0 ? "#f0fdf4" : "#fff",
// //                         transition:"background .2s"
// //                       }}
// //                     >
// //                       <div style={{ textAlign:"left", fontWeight:600, fontSize:13, textTransform:"capitalize" }}>
// //                         {item.payment_method || "-"}
// //                       </div>
// //                       <div style={{ fontSize:13 }}>₹{fmt(item.total_amount)}</div>
// //                       <div style={{ fontWeight:700, color:"#16a34a", fontSize:13 }}>
// //                         ₹{fmt(item.paid_amount_total)}
// //                       </div>

// //                       {/* pending with preview */}
// //                       <div>
// //                         <span style={{
// //                           background: isPaid ? "#f0fdf4" : "#fee2e2",
// //                           color: isPaid ? "#16a34a" : "#dc2626",
// //                           padding:"4px 10px", borderRadius:8, fontSize:12, fontWeight:700
// //                         }}>
// //                           ₹{fmt(item.balance_amount)}
// //                         </span>
// //                         {prev && prev._applying > 0 && (
// //                           <div style={{
// //                             fontSize:11, color:"#16a34a", fontWeight:700, marginTop:3
// //                           }}>
// //                             −₹{fmt(prev._applying)} → ₹{fmt(prev._newBalance)}
// //                           </div>
// //                         )}
// //                       </div>

// //                       <div style={{ fontSize:13, color:"#64748b" }}>
// //                         {item.due_date ? formatDate(item.due_date) : "-"}
// //                       </div>

// //                       <div>
// //                         <span style={{
// //                           padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:700,
// //                           background: isPaid ? "#dcfce7" : "#fee2e2",
// //                           color: isPaid ? "#15803d" : "#dc2626",
// //                           display:"inline-block", minWidth:72, textAlign:"center"
// //                         }}>
// //                           {isPaid ? "Paid" : "Not Paid"}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   );
// //                 })
// //               )}
// //             </div>
// //           </div>

// //           {/* ── RIGHT: collect panel ── */}
// //           <div style={{ ...card, overflow:"hidden" }}>

// //             {/* panel header */}
// //             <div style={{
// //               padding:"16px 18px",
// //               borderBottom:"1px solid #f1f5f9",
// //               background:"linear-gradient(135deg,#1e40af,#2563eb)",
// //               color:"#fff"
// //             }}>
// //               <div style={{ display:"flex", alignItems:"center", gap:8, fontWeight:800, fontSize:15 }}>
// //                 <Wallet size={18}/> Collect Payment
// //               </div>
// //               {selectedCustomer && (
// //                 <div style={{ marginTop:4, fontSize:12, opacity:.8 }}>
// //                   {selectedCustomer.name}
// //                 </div>
// //               )}
// //             </div>

// //             <div style={{ overflowY:"auto", flex:1, padding:18 }}>

// //               {/* pending summary */}
// //               <div style={{
// //                 background:"#fef2f2", border:"1px solid #fecaca",
// //                 borderRadius:12, padding:"14px 16px", marginBottom:18
// //               }}>
// //                 <div style={{ fontSize:11, fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:".5px" }}>
// //                   Total Pending
// //                 </div>
// //                 <div style={{ fontSize:28, fontWeight:900, color:"#dc2626", marginTop:4 }}>
// //                   ₹{fmt(totalPending)}
// //                 </div>
// //                 <div style={{ fontSize:11, color:"#ef4444", marginTop:2 }}>
// //                   {pendingInvoices.length} invoice{pendingInvoices.length !== 1 ? "s" : ""} pending
// //                 </div>
// //               </div>

// //               {pendingInvoices.length === 0 ? (
// //                 <div style={{
// //                   textAlign:"center", color:"#94a3b8",
// //                   padding:"32px 0"
// //                 }}>
// //                   <CheckCircle size={40} style={{ color:"#86efac", marginBottom:12 }}/>
// //                   <div style={{ fontWeight:700, color:"#16a34a" }}>All Cleared!</div>
// //                   <div style={{ fontSize:12, marginTop:4 }}>No pending payments</div>
// //                 </div>
// //               ) : (
// //                 <>
// //                   {/* breakdown list */}
// //                   <div style={{ marginBottom:18 }}>
// //                     <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".5px", marginBottom:8 }}>
// //                       Pending Breakdown
// //                     </div>
// //                     {pendingInvoices.map((inv, i) => {
// //                       const prev = preview.find((p) => p.id === inv.id);
// //                       const applying = prev ? prev._applying : 0;
// //                       return (
// //                         <div key={i} style={{
// //                           display:"flex", justifyContent:"space-between", alignItems:"center",
// //                           padding:"8px 10px", marginBottom:6,
// //                           background: applying > 0 ? "#f0fdf4" : "#f8fafc",
// //                           borderRadius:8,
// //                           border: applying > 0 ? "1px solid #86efac" : "1px solid #f1f5f9",
// //                           transition:"all .2s"
// //                         }}>
// //                           <div>
// //                             <div style={{ fontSize:12, fontWeight:600, color:"#0f172a", textTransform:"capitalize" }}>
// //                               {inv.payment_method || "Invoice"}
// //                             </div>
// //                             {inv.due_date && (
// //                               <div style={{ fontSize:10, color:"#94a3b8" }}>
// //                                 Due: {formatDate(inv.due_date)}
// //                               </div>
// //                             )}
// //                           </div>
// //                           <div style={{ textAlign:"right" }}>
// //                             <div style={{ fontSize:13, fontWeight:700, color:"#dc2626" }}>
// //                               ₹{fmt(inv.balance_amount)}
// //                             </div>
// //                             {applying > 0 && (
// //                               <div style={{ fontSize:11, color:"#16a34a", fontWeight:700 }}>
// //                                 −₹{fmt(applying)}
// //                               </div>
// //                             )}
// //                           </div>
// //                         </div>
// //                       );
// //                     })}
// //                   </div>

// //                   {/* amount input */}
// //                   <div style={{ marginBottom:12 }}>
// //                     <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
// //                       Amount to Collect
// //                     </label>
// //                     <div style={{ position:"relative" }}>
// //                       <IndianRupee size={15} style={{
// //                         position:"absolute", left:12, top:"50%",
// //                         transform:"translateY(-50%)", color:"#94a3b8"
// //                       }}/>
// //                       <input
// //                         type="number"
// //                         placeholder="Enter amount"
// //                         value={collectAmount}
// //                         onChange={(e) => setCollectAmount(e.target.value)}
// //                         style={{
// //                           width:"100%", padding:"11px 12px 11px 34px",
// //                           borderRadius:10, border:"1.5px solid #dbeafe",
// //                           outline:"none", fontSize:14, fontWeight:700,
// //                           boxSizing:"border-box", color:"#0f172a"
// //                         }}
// //                       />
// //                     </div>

// //                     {/* quick fill buttons */}
// //                     <div style={{ display:"flex", gap:6, marginTop:8 }}>
// //                       {[25, 50, 100].map((pct) => {
// //                         const val = Math.round(totalPending * pct / 100);
// //                         return (
// //                           <button
// //                             key={pct}
// //                             onClick={() => setCollectAmount(String(val))}
// //                             style={{
// //                               flex:1, padding:"6px 0", fontSize:11, fontWeight:700,
// //                               background:"#eff6ff", color:"#2563eb",
// //                               border:"1px solid #bfdbfe", borderRadius:8, cursor:"pointer"
// //                             }}
// //                           >
// //                             {pct}%
// //                           </button>
// //                         );
// //                       })}
// //                       <button
// //                         onClick={() => setCollectAmount(String(totalPending))}
// //                         style={{
// //                           flex:1, padding:"6px 0", fontSize:11, fontWeight:700,
// //                           background:"#eff6ff", color:"#2563eb",
// //                           border:"1px solid #bfdbfe", borderRadius:8, cursor:"pointer"
// //                         }}
// //                       >
// //                         Full
// //                       </button>
// //                     </div>
// //                   </div>

// //                   {/* payment method */}
// //                   <div style={{ marginBottom:18 }}>
// //                     <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
// //                       Payment Method
// //                     </label>
// //                     <div style={{ display:"flex", gap:8 }}>
// //                       {["cash", "online", "upi"].map((m) => (
// //                         <button
// //                           key={m}
// //                           className="method-btn"
// //                           onClick={() => setCollectMethod(m)}
// //                           style={{
// //                             flex:1, padding:"9px 0", fontSize:12, fontWeight:700,
// //                             textTransform:"capitalize", borderRadius:9, cursor:"pointer",
// //                             background: collectMethod === m ? "#2563eb" : "#fff",
// //                             color:      collectMethod === m ? "#fff"    : "#64748b",
// //                             border:     collectMethod === m ? "1.5px solid #2563eb" : "1.5px solid #e5e7eb",
// //                           }}
// //                         >
// //                           {m}
// //                         </button>
// //                       ))}
// //                     </div>
// //                   </div>

// //                   {/* distribution preview */}
// //                   {preview.length > 0 && Number(collectAmount) > 0 && (
// //                     <div style={{
// //                       background:"#f0fdf4", border:"1px solid #bbf7d0",
// //                       borderRadius:10, padding:"12px 14px", marginBottom:16,
// //                       animation:"fadeUp .2s ease"
// //                     }}>
// //                       <div style={{ fontSize:11, fontWeight:700, color:"#16a34a", marginBottom:8, textTransform:"uppercase", letterSpacing:".5px" }}>
// //                         Payment Distribution
// //                       </div>
// //                       {preview.filter((p) => p._applying > 0).map((p, i) => (
// //                         <div key={i} style={{
// //                           display:"flex", justifyContent:"space-between",
// //                           fontSize:12, color:"#166534", marginBottom:4, fontWeight:600
// //                         }}>
// //                           <span style={{ textTransform:"capitalize" }}>
// //                             <ChevronRight size={12} style={{ verticalAlign:"middle" }}/>
// //                             {p.payment_method || "Invoice"} #{i + 1}
// //                           </span>
// //                           <span>−₹{fmt(p._applying)}</span>
// //                         </div>
// //                       ))}
// //                       <div style={{
// //                         borderTop:"1px solid #86efac", marginTop:8, paddingTop:8,
// //                         display:"flex", justifyContent:"space-between",
// //                         fontWeight:800, fontSize:13, color:"#15803d"
// //                       }}>
// //                         <span>Balance after</span>
// //                         <span>₹{fmt(totalPending - Number(collectAmount))}</span>
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* collect button */}
// //                   <button
// //                     className="collect-btn"
// //                     onClick={handleBulkCollect}
// //                     disabled={collecting}
// //                     style={{
// //                       width:"100%", padding:"13px 0",
// //                       background: collecting ? "#93c5fd" : "#2563eb",
// //                       color:"#fff", border:"none", borderRadius:12,
// //                       fontWeight:800, fontSize:14, cursor: collecting ? "not-allowed" : "pointer",
// //                       display:"flex", alignItems:"center", justifyContent:"center", gap:8,
// //                       boxShadow:"0 4px 14px rgba(37,99,235,.35)"
// //                     }}
// //                   >
// //                     <Wallet size={16}/>
// //                     {collecting ? "Processing..." : "Collect Payment"}
// //                   </button>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //           {/* end right */}

// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // /* ── style constants ── */
// // const card = {
// //   background:"#fff",
// //   borderRadius:14,
// //   border:"1px solid #e5e7eb",
// //   display:"flex",
// //   flexDirection:"column",
// // };

// // const btnGreen = {
// //   background:"#16a34a", color:"#fff",
// //   border:"none", borderRadius:10,
// //   padding:"10px 16px", fontWeight:700,
// //   cursor:"pointer", display:"flex",
// //   alignItems:"center", gap:7, fontSize:13
// // };

// // const btnRed = {
// //   background:"#ef4444", color:"#fff",
// //   border:"none", borderRadius:10,
// //   padding:"10px 16px", fontWeight:700,
// //   cursor:"pointer", fontSize:13
// // };

// // const btnEdit = {
// //   background:"#eff6ff",
// //   border:"1px solid #dbeafe",
// //   width:44, height:44, borderRadius:12,
// //   cursor:"pointer", color:"#2563eb",
// //   display:"flex", alignItems:"center",
// //   justifyContent:"center", flexShrink:0
// // };

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import {
//   Pencil, Search, Phone, MapPin, Download, Wallet,
//   CheckCircle, ChevronRight, IndianRupee, X
// } from "lucide-react";

// /* ─────────────────── helpers ─────────────────── */
// const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

// const formatDate = (date) => {
//   if (!date) return "-";
//   return new Date(date.replace(" ", "T")).toLocaleDateString("en-IN", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// };

// /* Smart FIFO distribution */
// const distributePayment = (pendingInvoices, totalAmount) => {
//   let remaining = Number(totalAmount);
//   return pendingInvoices.map((inv) => {
//     const bal = Number(inv.balance_amount);
//     if (remaining <= 0) return { ...inv, _applying: 0, _newBalance: bal };
//     const applying = Math.min(remaining, bal);
//     remaining -= applying;
//     return { ...inv, _applying: applying, _newBalance: bal - applying };
//   });
// };

// /* ─────────────────── component ─────────────────── */
// export default function CustomerList() {
//   const navigate = useNavigate();

//   const [customers, setCustomers]             = useState([]);
//   const [search, setSearch]                   = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [invoiceHistory, setInvoiceHistory]   = useState([]);
//   const [allHistory, setAllHistory]           = useState([]);
//   const [toast, setToast]                     = useState(null);

//   /* collect popup */
//   const [showCollect, setShowCollect]         = useState(false);
//   const [collectAmount, setCollectAmount]     = useState("");
//   const [collectMethod, setCollectMethod]     = useState("cash");
//   const [collecting, setCollecting]           = useState(false);
//   const [preview, setPreview]                 = useState([]);

//   /* ── toast ── */
//   const showToast = (msg, ok = true) => {
//     setToast({ msg, ok });
//     setTimeout(() => setToast(null), 3000);
//   };

//   /* ── fetch customers ── */
//   const fetchCustomers = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const res  = await api.get(`/customer/get_all_customer.php?company_id=${user.company_id}`);
//       if (res.data.status) {
//         setCustomers(res.data.data);
//         if (res.data.data.length > 0) {
//           setSelectedCustomer(res.data.data[0]);
//           fetchCustomerHistory(res.data.data[0].id);
//         }
//       }
//     } catch (err) { console.error(err); }
//   };

//   const fetchAllHistory = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const res  = await api.post("/invoice/get_pending_invoice_history.php", { company_id: user.company_id });
//       if (res.data.status) setAllHistory(res.data.data);
//     } catch (err) { console.error(err); }
//   };

//   const fetchCustomerHistory = async (customerId) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const res  = await api.post("/invoice/get_pending_invoice_history.php", { company_id: user.company_id });
//       if (res.data.status) {
//         setInvoiceHistory(
//           res.data.data.filter((item) => Number(item.customer_id) === Number(customerId))
//         );
//       }
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => { fetchCustomers(); fetchAllHistory(); }, []);

//   /* ── preview recalc ── */
//   useEffect(() => {
//     const pending = invoiceHistory.filter((i) => Number(i.balance_amount) > 0);
//     if (!collectAmount || Number(collectAmount) <= 0) { setPreview([]); return; }
//     setPreview(distributePayment(pending, collectAmount));
//   }, [collectAmount, invoiceHistory]);

//   /* ── derived ── */
//   const getCustomerPendingTotal = (customerId) =>
//     allHistory
//       .filter((i) => Number(i.customer_id) === Number(customerId))
//       .reduce((s, i) => s + Number(i.balance_amount || 0), 0);

//   const pendingInvoices = invoiceHistory.filter((i) => Number(i.balance_amount) > 0);
//   const totalPending    = pendingInvoices.reduce((s, i) => s + Number(i.balance_amount), 0);

//   /* ── open popup ── */
//   const openCollect = () => {
//     setCollectAmount("");
//     setCollectMethod("cash");
//     setPreview([]);
//     setShowCollect(true);
//   };

//   /* ── bulk collect ── */
//   const handleBulkCollect = async () => {
//     if (!collectAmount || Number(collectAmount) <= 0) { showToast("Enter a valid amount", false); return; }
//     if (Number(collectAmount) > totalPending)          { showToast("Amount exceeds total pending", false); return; }

//     setCollecting(true);
//     const toUpdate = distributePayment(pendingInvoices, collectAmount).filter((i) => i._applying > 0);

//     try {
//       for (const inv of toUpdate) {
//         await api.post("/invoice/update_credit_payment.php", {
//           invoice_id:     inv.id,
//           amount:         inv._applying,
//           payment_method: collectMethod,
//         });
//       }
//       showToast("Payment collected successfully", true);
//       setShowCollect(false);
//       setCollectAmount("");
//       setPreview([]);
//       fetchCustomerHistory(selectedCustomer.id);
//       fetchAllHistory();
//     } catch {
//       showToast("Server error, please retry", false);
//     } finally {
//       setCollecting(false);
//     }
//   };

//   /* ── excel ── */
//   const downloadExcel = () => {
//     const rows = invoiceHistory.map((item) => ({
//       "Payment Method": item.payment_method || "-",
//       Total: item.total_amount, Paid: item.paid_amount_total,
//       Pending: item.balance_amount,
//       "Due Date": item.due_date ? formatDate(item.due_date) : "-",
//       Status: Number(item.balance_amount) <= 0 ? "Paid" : "Not Paid",
//     }));
//     const ws = XLSX.utils.json_to_sheet(rows);
//     ws["!cols"] = [18,15,15,15,18,18].map((w) => ({ wch: w }));
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Customer Report");
//     const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(
//       new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
//       `${selectedCustomer?.name || "customer"}_report.xlsx`
//     );
//   };

//   const filtered = customers.filter(
//     (c) => c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search)
//   );

//   /* ════════════════════════════════════════════ */
//   return (
//     <>
//       <style>{`
//         @keyframes toastIn  { from{opacity:0;transform:translateY(-10px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
//         @keyframes fadeUp   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes popIn    { from{opacity:0;transform:scale(.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
//         .cust-row:hover     { background:#f8fafc !important; }
//         .collect-btn:hover  { background:#1d4ed8 !important; transform:translateY(-1px); }
//         .method-btn:hover   { border-color:#2563eb !important; color:#2563eb !important; }
//         .quick-btn:hover    { background:#dbeafe !important; }
//         .close-btn:hover    { background:#f1f5f9 !important; }
//       `}</style>

//       {/* ── TOAST ── */}
//       {toast && (
//         <div style={{
//           position:"fixed", top:20, right:20, zIndex:99999,
//           background: toast.ok ? "linear-gradient(135deg,#2563eb,#3b82f6)" : "linear-gradient(135deg,#dc2626,#ef4444)",
//           color:"#fff", padding:"13px 20px", borderRadius:14,
//           boxShadow:"0 10px 30px rgba(0,0,0,.2)",
//           display:"flex", alignItems:"center", gap:10,
//           fontWeight:600, fontSize:14, animation:"toastIn .25s ease"
//         }}>
//           <div style={{
//             width:22, height:22, borderRadius:7, background:"rgba(255,255,255,.22)",
//             display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700
//           }}>
//             {toast.ok ? "✓" : "✕"}
//           </div>
//           {toast.msg}
//         </div>
//       )}

//       {/* ── COLLECT PAYMENT POPUP ── */}
//       {showCollect && (
//         <div
//           onClick={(e) => { if (e.target === e.currentTarget) setShowCollect(false); }}
//           style={{
//             position:"fixed", inset:0, zIndex:9999,
//             background:"rgba(15,23,42,.55)",
//             backdropFilter:"blur(4px)",
//             display:"flex", alignItems:"center", justifyContent:"center",
//             padding:20
//           }}
//         >
//           <div style={{
//             background:"#fff", borderRadius:20,
//             width:"100%", maxWidth:480,
//             boxShadow:"0 24px 64px rgba(0,0,0,.22)",
//             animation:"popIn .25s cubic-bezier(.34,1.56,.64,1)",
//             overflow:"hidden"
//           }}>

//             {/* popup header */}
//             <div style={{
//               background:"linear-gradient(135deg,#1e3a8a,#2563eb)",
//               padding:"20px 24px",
//               display:"flex", justifyContent:"space-between", alignItems:"center"
//             }}>
//               <div>
//                 <div style={{ display:"flex", alignItems:"center", gap:10, color:"#fff", fontWeight:800, fontSize:17 }}>
//                   <Wallet size={20}/> Collect Payment
//                 </div>
//                 <div style={{ color:"rgba(255,255,255,.7)", fontSize:13, marginTop:3 }}>
//                   {selectedCustomer?.name}
//                 </div>
//               </div>
//               <button
//                 className="close-btn"
//                 onClick={() => setShowCollect(false)}
//                 style={{
//                   width:36, height:36, borderRadius:10, border:"none",
//                   background:"rgba(255,255,255,.15)", color:"#fff",
//                   cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"
//                 }}
//               >
//                 <X size={18}/>
//               </button>
//             </div>

//             <div style={{ padding:"22px 24px 24px" }}>

//               {/* total pending banner */}
//               <div style={{
//                 background:"linear-gradient(135deg,#fef2f2,#fff5f5)",
//                 border:"1px solid #fecaca", borderRadius:14,
//                 padding:"16px 20px", marginBottom:20,
//                 display:"flex", justifyContent:"space-between", alignItems:"center"
//               }}>
//                 <div>
//                   <div style={{ fontSize:11, fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:".6px" }}>
//                     Total Pending
//                   </div>
//                   <div style={{ fontSize:30, fontWeight:900, color:"#dc2626", marginTop:2 }}>
//                     ₹{fmt(totalPending)}
//                   </div>
//                 </div>
//                 <div style={{ textAlign:"right" }}>
//                   <div style={{ fontSize:11, color:"#ef4444", fontWeight:600 }}>
//                     {pendingInvoices.length} invoice{pendingInvoices.length !== 1 ? "s" : ""}
//                   </div>
//                   {/* mini breakdown */}
//                   <div style={{ marginTop:6 }}>
//                     {pendingInvoices.map((inv, i) => {
//                       const prev     = preview.find((p) => p.id === inv.id);
//                       const applying = prev ? prev._applying : 0;
//                       return (
//                         <div key={i} style={{
//                           fontSize:11, color: applying > 0 ? "#16a34a" : "#94a3b8",
//                           fontWeight:600, textAlign:"right"
//                         }}>
//                           {applying > 0
//                             ? `✓ ₹${fmt(inv.balance_amount)} → ₹${fmt(Number(inv.balance_amount) - applying)}`
//                             : `₹${fmt(inv.balance_amount)} pending`}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {pendingInvoices.length === 0 ? (
//                 <div style={{ textAlign:"center", padding:"28px 0", color:"#64748b" }}>
//                   <CheckCircle size={44} style={{ color:"#86efac", marginBottom:10 }}/>
//                   <div style={{ fontWeight:700, fontSize:16, color:"#16a34a" }}>All Cleared!</div>
//                   <div style={{ fontSize:13, marginTop:4 }}>No pending payments</div>
//                 </div>
//               ) : (
//                 <>
//                   {/* pending breakdown list */}
//                   <div style={{ marginBottom:18 }}>
//                     <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".5px", marginBottom:8 }}>
//                       Pending Breakdown
//                     </div>
//                     <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
//                       {pendingInvoices.map((inv, i) => {
//                         const prev     = preview.find((p) => p.id === inv.id);
//                         const applying = prev ? prev._applying : 0;
//                         return (
//                           <div key={i} style={{
//                             display:"flex", justifyContent:"space-between", alignItems:"center",
//                             padding:"10px 14px", borderRadius:10,
//                             background: applying > 0 ? "#f0fdf4" : "#f8fafc",
//                             border: applying > 0 ? "1.5px solid #86efac" : "1.5px solid #f1f5f9",
//                             transition:"all .2s"
//                           }}>
//                             <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                               <div style={{
//                                 width:32, height:32, borderRadius:8,
//                                 background: applying > 0 ? "#dcfce7" : "#f1f5f9",
//                                 display:"flex", alignItems:"center", justifyContent:"center",
//                                 fontSize:12, fontWeight:800,
//                                 color: applying > 0 ? "#16a34a" : "#94a3b8"
//                               }}>
//                                 #{i + 1}
//                               </div>
//                               <div>
//                                 <div style={{ fontSize:13, fontWeight:700, color:"#0f172a", textTransform:"capitalize" }}>
//                                   {inv.payment_method || "Invoice"}
//                                 </div>
//                                 {inv.due_date && (
//                                   <div style={{ fontSize:11, color:"#94a3b8" }}>
//                                     Due: {formatDate(inv.due_date)}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                             <div style={{ textAlign:"right" }}>
//                               <div style={{ fontSize:14, fontWeight:800, color:"#dc2626" }}>
//                                 ₹{fmt(inv.balance_amount)}
//                               </div>
//                               {applying > 0 && (
//                                 <div style={{ fontSize:11, color:"#16a34a", fontWeight:700 }}>
//                                   −₹{fmt(applying)} → ₹{fmt(Number(inv.balance_amount) - applying)}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* divider */}
//                   <div style={{ height:1, background:"#f1f5f9", marginBottom:18 }}/>

//                   {/* amount input */}
//                   <div style={{ marginBottom:14 }}>
//                     <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:7 }}>
//                       Amount to Collect
//                     </label>
//                     <div style={{ position:"relative" }}>
//                       <IndianRupee size={16} style={{
//                         position:"absolute", left:13, top:"50%",
//                         transform:"translateY(-50%)", color:"#94a3b8"
//                       }}/>
//                       <input
//                         type="number"
//                         placeholder="0"
//                         value={collectAmount}
//                         onChange={(e) => setCollectAmount(e.target.value)}
//                         autoFocus
//                         style={{
//                           width:"100%", padding:"13px 14px 13px 38px",
//                           borderRadius:12, border:"2px solid #dbeafe",
//                           outline:"none", fontSize:18, fontWeight:800,
//                           boxSizing:"border-box", color:"#0f172a",
//                           transition:"border-color .15s"
//                         }}
//                         onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
//                         onBlur={(e)  => (e.target.style.borderColor = "#dbeafe")}
//                       />
//                     </div>

//                     {/* quick fill */}
//                     <div style={{ display:"flex", gap:8, marginTop:10 }}>
//                       {[25, 50, 100].map((pct) => {
//                         const val = Math.round(totalPending * pct / 100);
//                         return (
//                           <button key={pct} className="quick-btn"
//                             onClick={() => setCollectAmount(String(val))}
//                             style={{
//                               flex:1, padding:"8px 0", fontSize:12, fontWeight:700,
//                               background:"#eff6ff", color:"#2563eb",
//                               border:"1.5px solid #bfdbfe", borderRadius:9, cursor:"pointer",
//                               transition:"background .15s"
//                             }}
//                           >
//                             {pct}%<br/>
//                             <span style={{ fontWeight:600, fontSize:11 }}>₹{fmt(val)}</span>
//                           </button>
//                         );
//                       })}
//                       <button className="quick-btn"
//                         onClick={() => setCollectAmount(String(totalPending))}
//                         style={{
//                           flex:1, padding:"8px 0", fontSize:12, fontWeight:700,
//                           background:"#eff6ff", color:"#2563eb",
//                           border:"1.5px solid #bfdbfe", borderRadius:9, cursor:"pointer",
//                           transition:"background .15s"
//                         }}
//                       >
//                         Full<br/>
//                         <span style={{ fontWeight:600, fontSize:11 }}>₹{fmt(totalPending)}</span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* payment method */}
//                   <div style={{ marginBottom:20 }}>
//                     <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:7 }}>
//                       Payment Method
//                     </label>
//                     <div style={{ display:"flex", gap:10 }}>
//                       {["cash", "online", "upi"].map((m) => (
//                         <button key={m} className="method-btn"
//                           onClick={() => setCollectMethod(m)}
//                           style={{
//                             flex:1, padding:"11px 0", fontSize:13, fontWeight:700,
//                             textTransform:"capitalize", borderRadius:11, cursor:"pointer",
//                             background: collectMethod === m ? "#2563eb" : "#fff",
//                             color:      collectMethod === m ? "#fff"    : "#64748b",
//                             border:     collectMethod === m ? "2px solid #2563eb" : "2px solid #e5e7eb",
//                             transition:"all .15s"
//                           }}
//                         >
//                           {m === "cash" ? "💵" : m === "online" ? "🏦" : "📱"} {m}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* distribution preview */}
//                   {preview.filter((p) => p._applying > 0).length > 0 && (
//                     <div style={{
//                       background:"#f0fdf4", border:"1.5px solid #bbf7d0",
//                       borderRadius:12, padding:"14px 16px", marginBottom:20,
//                       animation:"fadeUp .2s ease"
//                     }}>
//                       <div style={{ fontSize:11, fontWeight:700, color:"#16a34a", marginBottom:10, textTransform:"uppercase", letterSpacing:".5px" }}>
//                         ✓ Payment Distribution
//                       </div>
//                       {preview.filter((p) => p._applying > 0).map((p, i) => (
//                         <div key={i} style={{
//                           display:"flex", justifyContent:"space-between",
//                           fontSize:13, color:"#166534", marginBottom:5, fontWeight:600
//                         }}>
//                           <span style={{ display:"flex", alignItems:"center", gap:6 }}>
//                             <ChevronRight size={13}/>
//                             <span style={{ textTransform:"capitalize" }}>{p.payment_method || "Invoice"}</span>
//                             <span style={{ color:"#86efac" }}>#{i + 1}</span>
//                           </span>
//                           <span>−₹{fmt(p._applying)}</span>
//                         </div>
//                       ))}
//                       <div style={{
//                         borderTop:"1.5px solid #86efac", marginTop:10, paddingTop:10,
//                         display:"flex", justifyContent:"space-between",
//                         fontWeight:800, fontSize:14, color:"#15803d"
//                       }}>
//                         <span>Remaining balance</span>
//                         <span>₹{fmt(Math.max(0, totalPending - Number(collectAmount)))}</span>
//                       </div>
//                     </div>
//                   )}

//                   {/* action buttons */}
//                   <div style={{ display:"flex", gap:10 }}>
//                     <button
//                       onClick={() => setShowCollect(false)}
//                       style={{
//                         flex:1, padding:"13px 0", borderRadius:12,
//                         border:"2px solid #e5e7eb", background:"#fff",
//                         fontWeight:700, fontSize:14, cursor:"pointer", color:"#64748b"
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="collect-btn"
//                       onClick={handleBulkCollect}
//                       disabled={collecting}
//                       style={{
//                         flex:2, padding:"13px 0",
//                         background: collecting ? "#93c5fd" : "#2563eb",
//                         color:"#fff", border:"none", borderRadius:12,
//                         fontWeight:800, fontSize:14,
//                         cursor: collecting ? "not-allowed" : "pointer",
//                         display:"flex", alignItems:"center", justifyContent:"center", gap:8,
//                         boxShadow:"0 4px 16px rgba(37,99,235,.35)",
//                         transition:"all .15s"
//                       }}
//                     >
//                       <Wallet size={17}/>
//                       {collecting ? "Processing..." : "Collect Payment"}
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── MAIN ── */}
//       <div style={{ minHeight:"100vh", background:"#f1f5f9", padding:20, fontFamily:"Inter, sans-serif" }}>

//         {/* HEADER */}
//         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
//           <div>
//             <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#0f172a" }}>Customers</h2>
//             <p style={{ margin:"3px 0 0", color:"#64748b", fontSize:13 }}>Manage your customers & payments</p>
//           </div>
//           <div style={{ display:"flex", gap:10, alignItems:"center" }}>
//             <button onClick={downloadExcel} style={btnGreen}>
//               <Download size={15}/> Excel Download
//             </button>
//             <button onClick={() => navigate("/customer/add")} style={btnRed}>
//               + Add Customer
//             </button>
//           </div>
//         </div>

//         {/* 2-COLUMN LAYOUT */}
//         <div style={{
//           display:"grid",
//           gridTemplateColumns:"300px 1fr",
//           gap:16,
//           height:"calc(100vh - 120px)"
//         }}>

//           {/* ── LEFT ── */}
//           <div style={card}>
//             <div style={{ padding:"12px 14px", borderBottom:"1px solid #f1f5f9", position:"relative" }}>
//               <Search size={15} style={{ position:"absolute", top:"50%", left:26, transform:"translateY(-50%)", color:"#94a3b8" }}/>
//               <input
//                 placeholder="Search customer..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 style={{
//                   width:"100%", padding:"9px 12px 9px 34px",
//                   borderRadius:10, border:"1px solid #e2e8f0",
//                   outline:"none", fontSize:13, boxSizing:"border-box"
//                 }}
//               />
//             </div>
//             <div style={{ overflowY:"auto", flex:1 }}>
//               {filtered.map((c) => {
//                 const pt         = getCustomerPendingTotal(c.id);
//                 const isSelected = selectedCustomer?.id === c.id;
//                 return (
//                   <div key={c.id} className="cust-row"
//                     onClick={() => {
//                       setSelectedCustomer(c);
//                       fetchCustomerHistory(c.id);
//                       setCollectAmount("");
//                       setPreview([]);
//                     }}
//                     style={{
//                       padding:"12px 14px", borderBottom:"1px solid #f1f5f9",
//                       cursor:"pointer",
//                       background:  isSelected ? "#eff6ff" : "#fff",
//                       borderLeft:  isSelected ? "3px solid #2563eb" : "3px solid transparent",
//                       transition:"all .15s"
//                     }}
//                   >
//                     <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//                       <div>
//                         <div style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{c.name}</div>
//                         <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{c.phone}</div>
//                       </div>
//                       <div style={{ fontWeight:700, fontSize:13, color: pt > 0 ? "#ef4444" : "#94a3b8" }}>
//                         ₹{fmt(pt)}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* ── RIGHT: invoice table ── */}
//           <div style={{ ...card, overflow:"hidden" }}>

//             {/* customer info + collect button */}
//             {selectedCustomer && (
//               <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9" }}>
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
//                   <div>
//                     <div style={{ fontSize:20, fontWeight:800, color:"#0f172a", marginBottom:8 }}>
//                       {selectedCustomer.name}
//                     </div>
//                     <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#64748b", marginBottom:4 }}>
//                       <Phone size={13}/> {selectedCustomer.phone}
//                     </div>
//                     <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#64748b" }}>
//                       <MapPin size={13}/> {selectedCustomer.address}
//                     </div>
//                   </div>

//                   {/* RIGHT side: pending badge + collect button + edit */}
//                   <div style={{ display:"flex", alignItems:"center", gap:10 }}>

//                     {/* pending badge */}
//                     {totalPending > 0 && (
//                       <div style={{
//                         background:"#fef2f2", border:"1px solid #fecaca",
//                         borderRadius:12, padding:"8px 16px", textAlign:"center"
//                       }}>
//                         <div style={{ fontSize:10, fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:".5px" }}>
//                           Pending
//                         </div>
//                         <div style={{ fontSize:18, fontWeight:900, color:"#dc2626" }}>
//                           ₹{fmt(totalPending)}
//                         </div>
//                       </div>
//                     )}

//                     {/* collect button */}
//                     {totalPending > 0 && (
//                       <button
//                         onClick={openCollect}
//                         style={{
//                           background:"linear-gradient(135deg,#2563eb,#1d4ed8)",
//                           color:"#fff", border:"none", borderRadius:12,
//                           padding:"10px 18px", fontWeight:700, fontSize:13,
//                           cursor:"pointer", display:"flex", alignItems:"center", gap:7,
//                           boxShadow:"0 4px 14px rgba(37,99,235,.3)",
//                           transition:"all .15s"
//                         }}
//                         onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
//                         onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
//                       >
//                         <Wallet size={15}/> Collect Payment
//                       </button>
//                     )}

//                     <button onClick={() => navigate(`/customer/edit/${selectedCustomer.id}`)} style={btnEdit}>
//                       <Pencil size={15}/>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* table header */}
//             <div style={{
//               display:"grid",
//               gridTemplateColumns:"1.2fr .8fr .8fr .8fr 1fr 1fr",
//               padding:"11px 20px",
//               background:"#f8fafc",
//               borderBottom:"1px solid #e5e7eb",
//               fontWeight:700, fontSize:12, color:"#64748b",
//               textTransform:"uppercase", letterSpacing:".5px",
//               textAlign:"center"
//             }}>
//               <span style={{ textAlign:"left" }}>Payment Method</span>
//               <span>Total</span>
//               <span>Paid</span>
//               <span>Pending</span>
//               <span>Due Date</span>
//               <span>Status</span>
//             </div>

//             {/* rows */}
//             <div style={{ overflowY:"auto", flex:1 }}>
//               {invoiceHistory.length === 0 ? (
//                 <div style={{
//                   display:"flex", flexDirection:"column",
//                   alignItems:"center", justifyContent:"center",
//                   padding:48, color:"#94a3b8", textAlign:"center"
//                 }}>
//                   <div style={{ fontSize:52, marginBottom:14 }}>📄</div>
//                   <div style={{ fontWeight:700, fontSize:16, color:"#0f172a" }}>No Billing Records</div>
//                   <p style={{ fontSize:13, marginTop:6, maxWidth:300, lineHeight:1.6 }}>
//                     This customer has no billing or payment history yet.
//                   </p>
//                 </div>
//               ) : (
//                 invoiceHistory.map((item, index) => {
//                   const isPaid = Number(item.balance_amount) <= 0;
//                   return (
//                     <div key={index} style={{
//                       display:"grid",
//                       gridTemplateColumns:"1.2fr .8fr .8fr .8fr 1fr 1fr",
//                       padding:"14px 20px",
//                       alignItems:"center", textAlign:"center",
//                       borderBottom:"1px solid #f8fafc",
//                       background:"#fff"
//                     }}>
//                       <div style={{ textAlign:"left", fontWeight:600, fontSize:13, textTransform:"capitalize" }}>
//                         {item.payment_method || "-"}
//                       </div>
//                       <div style={{ fontSize:13 }}>₹{fmt(item.total_amount)}</div>
//                       <div style={{ fontWeight:700, color:"#16a34a", fontSize:13 }}>
//                         ₹{fmt(item.paid_amount_total)}
//                       </div>
//                       <div>
//                         <span style={{
//                           background: isPaid ? "#f0fdf4" : "#fee2e2",
//                           color:      isPaid ? "#16a34a" : "#dc2626",
//                           padding:"4px 10px", borderRadius:8, fontSize:12, fontWeight:700
//                         }}>
//                           ₹{fmt(item.balance_amount)}
//                         </span>
//                       </div>
//                       <div style={{ fontSize:13, color:"#64748b" }}>
//                         {item.due_date ? formatDate(item.due_date) : "-"}
//                       </div>
//                       <div>
//                         <span style={{
//                           padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:700,
//                           background: isPaid ? "#dcfce7" : "#fee2e2",
//                           color:      isPaid ? "#15803d" : "#dc2626",
//                           display:"inline-block", minWidth:72, textAlign:"center"
//                         }}>
//                           {isPaid ? "Paid" : "Not Paid"}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// const card = {
//   background:"#fff", borderRadius:14,
//   border:"1px solid #e5e7eb",
//   display:"flex", flexDirection:"column",
// };
// const btnGreen = {
//   background:"#16a34a", color:"#fff", border:"none",
//   borderRadius:10, padding:"10px 16px",
//   fontWeight:700, cursor:"pointer",
//   display:"flex", alignItems:"center", gap:7, fontSize:13
// };
// const btnRed = {
//   background:"#ef4444", color:"#fff", border:"none",
//   borderRadius:10, padding:"10px 16px",
//   fontWeight:700, cursor:"pointer", fontSize:13
// };
// const btnEdit = {
//   background:"#eff6ff", border:"1px solid #dbeafe",
//   width:44, height:44, borderRadius:12,
//   cursor:"pointer", color:"#2563eb",
//   display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
// };


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Pencil, Search, Phone, MapPin, Download, Wallet,
  CheckCircle, ChevronRight, IndianRupee, X
} from "lucide-react";

/* ─────────────────── helpers ─────────────────── */
const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date.replace(" ", "T")).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

/* Smart FIFO distribution */
const distributePayment = (pendingInvoices, totalAmount) => {
  let remaining = Number(totalAmount);
  return pendingInvoices.map((inv) => {
    const bal = Number(inv.balance_amount);
    if (remaining <= 0) return { ...inv, _applying: 0, _newBalance: bal };
    const applying = Math.min(remaining, bal);
    remaining -= applying;
    return { ...inv, _applying: applying, _newBalance: bal - applying };
  });
};

/* ─────────────────── component ─────────────────── */
export default function CustomerList() {
  const navigate = useNavigate();

  const [customers, setCustomers]             = useState([]);
  const [search, setSearch]                   = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoiceHistory, setInvoiceHistory]   = useState([]);
  const [allHistory, setAllHistory]           = useState([]);
  const [toast, setToast]                     = useState(null);

  /* collect popup */
  const [showCollect, setShowCollect]         = useState(false);
  const [collectAmount, setCollectAmount]     = useState("");
  const [collectMethod, setCollectMethod]     = useState("cash");
  const [collecting, setCollecting]           = useState(false);
  const [preview, setPreview]                 = useState([]);

  /* ── toast ── */
  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── fetch customers ── */
  const fetchCustomers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res  = await api.get(`/customer/get_all_customer.php?company_id=${user.company_id}`);
      if (res.data.status) {
        setCustomers(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedCustomer(res.data.data[0]);
          fetchCustomerHistory(res.data.data[0].id);
        }
      }
    } catch (err) { console.error(err); }
  };

  const fetchAllHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res  = await api.post("/invoice/get_pending_invoice_history.php", { company_id: user.company_id });
      if (res.data.status) setAllHistory(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchCustomerHistory = async (customerId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res  = await api.post("/invoice/get_pending_invoice_history.php", { company_id: user.company_id });
      if (res.data.status) {
        setInvoiceHistory(
          res.data.data.filter((item) => Number(item.customer_id) === Number(customerId))
        );
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchCustomers(); fetchAllHistory(); }, []);

  /* ── preview recalc ── */
  useEffect(() => {
    const pending = invoiceHistory.filter((i) => Number(i.balance_amount) > 0);
    if (!collectAmount || Number(collectAmount) <= 0) { setPreview([]); return; }
    setPreview(distributePayment(pending, collectAmount));
  }, [collectAmount, invoiceHistory]);

  /* ── derived ── */
  const getCustomerPendingTotal = (customerId) =>
    allHistory
      .filter((i) => Number(i.customer_id) === Number(customerId))
      .reduce((s, i) => s + Number(i.balance_amount || 0), 0);

  const pendingInvoices = invoiceHistory.filter((i) => Number(i.balance_amount) > 0);
  const totalPending    = pendingInvoices.reduce((s, i) => s + Number(i.balance_amount), 0);

  /* ── open popup ── */
  const openCollect = () => {
    setCollectAmount("");
    setCollectMethod("cash");
    setPreview([]);
    setShowCollect(true);
  };

  /* ── bulk collect ── */
  const handleBulkCollect = async () => {
    if (!collectAmount || Number(collectAmount) <= 0) { showToast("Enter a valid amount", false); return; }
    if (Number(collectAmount) > totalPending)          { showToast("Amount exceeds total pending", false); return; }

    setCollecting(true);
    const toUpdate = distributePayment(pendingInvoices, collectAmount).filter((i) => i._applying > 0);

    try {
      for (const inv of toUpdate) {
        await api.post("/invoice/update_credit_payment.php", {
          invoice_id:     inv.id,
          amount:         inv._applying,
          payment_method: collectMethod,
        });
      }
      showToast("Payment collected successfully", true);
      setShowCollect(false);
      setCollectAmount("");
      setPreview([]);
      fetchCustomerHistory(selectedCustomer.id);
      fetchAllHistory();
    } catch {
      showToast("Server error, please retry", false);
    } finally {
      setCollecting(false);
    }
  };

  /* ── excel ── */
  const downloadExcel = () => {
    const rows = invoiceHistory.map((item) => ({
      "Payment Method": item.payment_method || "-",
      Total: item.total_amount, Paid: item.paid_amount_total,
      Pending: item.balance_amount,
      "Due Date": item.due_date ? formatDate(item.due_date) : "-",
      Status: Number(item.balance_amount) <= 0 ? "Paid" : "Not Paid",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [18,15,15,15,18,18].map((w) => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Report");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `${selectedCustomer?.name || "customer"}_report.xlsx`
    );
  };

  const filtered = customers.filter(
    (c) => c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search)
  );

  /* ════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @keyframes toastIn  { from{opacity:0;transform:translateY(-10px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn    { from{opacity:0;transform:scale(.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .cust-row:hover     { background:#f8fafc !important; }
        .collect-btn:hover  { background:#1d4ed8 !important; transform:translateY(-1px); }
        .method-btn:hover   { border-color:#2563eb !important; color:#2563eb !important; }
        .quick-btn:hover    { background:#dbeafe !important; }
        .close-btn:hover    { background:#f1f5f9 !important; }
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:99999,
          background: toast.ok ? "linear-gradient(135deg,#2563eb,#3b82f6)" : "linear-gradient(135deg,#dc2626,#ef4444)",
          color:"#fff", padding:"13px 20px", borderRadius:14,
          boxShadow:"0 10px 30px rgba(0,0,0,.2)",
          display:"flex", alignItems:"center", gap:10,
          fontWeight:600, fontSize:14, animation:"toastIn .25s ease"
        }}>
          <div style={{
            width:22, height:22, borderRadius:7, background:"rgba(255,255,255,.22)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700
          }}>
            {toast.ok ? "✓" : "✕"}
          </div>
          {toast.msg}
        </div>
      )}

{/* ── COLLECT PAYMENT POPUP ── */}
      {showCollect && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowCollect(false); }}
          style={{
            position:"fixed", inset:0, zIndex:9999,
            background:"rgba(15,23,42,.55)",
            backdropFilter:"blur(4px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:20
          }}
        >
          <div style={{
            background:"#fff", borderRadius:20,
            width:"100%", maxWidth:480,
            maxHeight:"90vh",
            display:"flex", flexDirection:"column",
            boxShadow:"0 24px 64px rgba(0,0,0,.22)",
            animation:"popIn .25s cubic-bezier(.34,1.56,.64,1)",
            overflow:"hidden"
          }}>

            {/* STICKY HEADER - never scrolls */}
            <div style={{
              background:"linear-gradient(135deg,#1e3a8a,#2563eb)",
              padding:"20px 24px",
              display:"flex", justifyContent:"space-between", alignItems:"center",
              flexShrink:0
            }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, color:"#fff", fontWeight:800, fontSize:17 }}>
                  <Wallet size={20}/> Collect Payment
                </div>
                <div style={{ color:"rgba(255,255,255,.7)", fontSize:13, marginTop:3 }}>
                  {selectedCustomer?.name}
                </div>
              </div>
              <button
                onClick={() => setShowCollect(false)}
                style={{
                  width:36, height:36, borderRadius:10, border:"none",
                  background:"rgba(255,255,255,.15)", color:"#fff",
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"
                }}
              >
                <X size={18}/>
              </button>
            </div>

            {/* SCROLLABLE BODY */}
            <div style={{ overflowY:"auto", flex:1, padding:"22px 24px" }}>

              {/* total pending banner */}
              <div style={{
                background:"linear-gradient(135deg,#fef2f2,#fff5f5)",
                border:"1px solid #fecaca", borderRadius:14,
                padding:"16px 20px", marginBottom:20,
                display:"flex", justifyContent:"space-between", alignItems:"center"
              }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:".6px" }}>
                    Total Pending
                  </div>
                  <div style={{ fontSize:30, fontWeight:900, color:"#dc2626", marginTop:2 }}>
                    ₹{fmt(totalPending)}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:"#ef4444", fontWeight:600 }}>
                    {pendingInvoices.length} invoice{pendingInvoices.length !== 1 ? "s" : ""}
                  </div>
                  <div style={{ marginTop:6 }}>
                    {pendingInvoices.map((inv, i) => {
                      const prev     = preview.find((p) => p.id === inv.id);
                      const applying = prev ? prev._applying : 0;
                      return (
                        <div key={i} style={{
                          fontSize:11, color: applying > 0 ? "#16a34a" : "#94a3b8",
                          fontWeight:600, textAlign:"right"
                        }}>
                          {applying > 0
                            ? `✓ ₹${fmt(inv.balance_amount)} → ₹${fmt(Number(inv.balance_amount) - applying)}`
                            : `₹${fmt(inv.balance_amount)} pending`}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {pendingInvoices.length === 0 ? (
                <div style={{ textAlign:"center", padding:"28px 0", color:"#64748b" }}>
                  <CheckCircle size={44} style={{ color:"#86efac", marginBottom:10 }}/>
                  <div style={{ fontWeight:700, fontSize:16, color:"#16a34a" }}>All Cleared!</div>
                  <div style={{ fontSize:13, marginTop:4 }}>No pending payments</div>
                </div>
              ) : (
                <>
                  {/* pending breakdown list */}
                  <div style={{ marginBottom:18 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".5px", marginBottom:8 }}>
                      Pending Breakdown
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {pendingInvoices.map((inv, i) => {
                        const prev     = preview.find((p) => p.id === inv.id);
                        const applying = prev ? prev._applying : 0;
                        return (
                          <div key={i} style={{
                            display:"flex", justifyContent:"space-between", alignItems:"center",
                            padding:"10px 14px", borderRadius:10,
                            background: applying > 0 ? "#f0fdf4" : "#f8fafc",
                            border: applying > 0 ? "1.5px solid #86efac" : "1.5px solid #f1f5f9",
                            transition:"all .2s"
                          }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div style={{
                                width:32, height:32, borderRadius:8,
                                background: applying > 0 ? "#dcfce7" : "#f1f5f9",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                fontSize:12, fontWeight:800,
                                color: applying > 0 ? "#16a34a" : "#94a3b8"
                              }}>
                                #{i + 1}
                              </div>
                              <div>
                                <div style={{ fontSize:13, fontWeight:700, color:"#0f172a", textTransform:"capitalize" }}>
                                  {inv.payment_method || "Invoice"}
                                </div>
                                {inv.due_date && (
                                  <div style={{ fontSize:11, color:"#94a3b8" }}>
                                    Due: {formatDate(inv.due_date)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ textAlign:"right" }}>
                              <div style={{ fontSize:14, fontWeight:800, color:"#dc2626" }}>
                                ₹{fmt(inv.balance_amount)}
                              </div>
                              {applying > 0 && (
                                <div style={{ fontSize:11, color:"#16a34a", fontWeight:700 }}>
                                  −₹{fmt(applying)} → ₹{fmt(Number(inv.balance_amount) - applying)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ height:1, background:"#f1f5f9", marginBottom:18 }}/>

                  {/* amount input */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:7 }}>
                      Amount to Collect
                    </label>
                    <div style={{ position:"relative" }}>
                      <IndianRupee size={16} style={{
                        position:"absolute", left:13, top:"50%",
                        transform:"translateY(-50%)", color:"#94a3b8"
                      }}/>
                      <input
                        type="number"
                        placeholder="0"
                        value={collectAmount}
                        onChange={(e) => setCollectAmount(e.target.value)}
                        autoFocus
                        style={{
                          width:"100%", padding:"13px 14px 13px 38px",
                          borderRadius:12, border:"2px solid #dbeafe",
                          outline:"none", fontSize:18, fontWeight:800,
                          boxSizing:"border-box", color:"#0f172a",
                          transition:"border-color .15s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                        onBlur={(e)  => (e.target.style.borderColor = "#dbeafe")}
                      />
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:10 }}>
                      {[25, 50, 100].map((pct) => {
                        const val = Math.round(totalPending * pct / 100);
                        return (
                          <button key={pct} className="quick-btn"
                            onClick={() => setCollectAmount(String(val))}
                            style={{
                              flex:1, padding:"8px 0", fontSize:12, fontWeight:700,
                              background:"#eff6ff", color:"#2563eb",
                              border:"1.5px solid #bfdbfe", borderRadius:9, cursor:"pointer",
                              transition:"background .15s"
                            }}
                          >
                            {pct}%<br/>
                            <span style={{ fontWeight:600, fontSize:11 }}>₹{fmt(val)}</span>
                          </button>
                        );
                      })}
                      <button className="quick-btn"
                        onClick={() => setCollectAmount(String(totalPending))}
                        style={{
                          flex:1, padding:"8px 0", fontSize:12, fontWeight:700,
                          background:"#eff6ff", color:"#2563eb",
                          border:"1.5px solid #bfdbfe", borderRadius:9, cursor:"pointer",
                          transition:"background .15s"
                        }}
                      >
                        Full<br/>
                        <span style={{ fontWeight:600, fontSize:11 }}>₹{fmt(totalPending)}</span>
                      </button>
                    </div>
                  </div>

                  {/* payment method */}
                  <div style={{ marginBottom:20 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:7 }}>
                      Payment Method
                    </label>
                    <div style={{ display:"flex", gap:10 }}>
                      {["cash", "online", "upi"].map((m) => (
                        <button key={m} className="method-btn"
                          onClick={() => setCollectMethod(m)}
                          style={{
                            flex:1, padding:"11px 0", fontSize:13, fontWeight:700,
                            textTransform:"capitalize", borderRadius:11, cursor:"pointer",
                            background: collectMethod === m ? "#2563eb" : "#fff",
                            color:      collectMethod === m ? "#fff"    : "#64748b",
                            border:     collectMethod === m ? "2px solid #2563eb" : "2px solid #e5e7eb",
                            transition:"all .15s"
                          }}
                        >
                          {m === "cash" ? "💵" : m === "online" ? "🏦" : "📱"} {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* distribution preview */}
                  {preview.filter((p) => p._applying > 0).length > 0 && (
                    <div style={{
                      background:"#f0fdf4", border:"1.5px solid #bbf7d0",
                      borderRadius:12, padding:"14px 16px", marginBottom:20,
                      animation:"fadeUp .2s ease"
                    }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#16a34a", marginBottom:10, textTransform:"uppercase", letterSpacing:".5px" }}>
                        ✓ Payment Distribution
                      </div>
                      {preview.filter((p) => p._applying > 0).map((p, i) => (
                        <div key={i} style={{
                          display:"flex", justifyContent:"space-between",
                          fontSize:13, color:"#166534", marginBottom:5, fontWeight:600
                        }}>
                          <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <ChevronRight size={13}/>
                            <span style={{ textTransform:"capitalize" }}>{p.payment_method || "Invoice"}</span>
                            <span style={{ color:"#86efac" }}>#{i + 1}</span>
                          </span>
                          <span>−₹{fmt(p._applying)}</span>
                        </div>
                      ))}
                      <div style={{
                        borderTop:"1.5px solid #86efac", marginTop:10, paddingTop:10,
                        display:"flex", justifyContent:"space-between",
                        fontWeight:800, fontSize:14, color:"#15803d"
                      }}>
                        <span>Remaining balance</span>
                        <span>₹{fmt(Math.max(0, totalPending - Number(collectAmount)))}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* STICKY FOOTER - action buttons, never scrolls */}
            {pendingInvoices.length > 0 && (
              <div style={{
                padding:"16px 24px",
                borderTop:"1px solid #f1f5f9",
                display:"flex", gap:10,
                flexShrink:0,
                background:"#fff"
              }}>
                <button
                  onClick={() => setShowCollect(false)}
                  style={{
                    flex:1, padding:"13px 0", borderRadius:12,
                    border:"2px solid #e5e7eb", background:"#fff",
                    fontWeight:700, fontSize:14, cursor:"pointer", color:"#64748b"
                  }}
                >
                  Cancel
                </button>
                <button
                  className="collect-btn"
                  onClick={handleBulkCollect}
                  disabled={collecting}
                  style={{
                    flex:2, padding:"13px 0",
                    background: collecting ? "#93c5fd" : "#2563eb",
                    color:"#fff", border:"none", borderRadius:12,
                    fontWeight:800, fontSize:14,
                    cursor: collecting ? "not-allowed" : "pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    boxShadow:"0 4px 16px rgba(37,99,235,.35)",
                    transition:"all .15s"
                  }}
                >
                  <Wallet size={17}/>
                  {collecting ? "Processing..." : "Collect Payment"}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <div style={{ minHeight:"100vh", background:"#f1f5f9", padding:20, fontFamily:"Inter, sans-serif" }}>

        {/* HEADER */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div>
            <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#0f172a" }}>Customers</h2>
            <p style={{ margin:"3px 0 0", color:"#64748b", fontSize:13 }}>Manage your customers & payments</p>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={downloadExcel} style={btnGreen}>
              <Download size={15}/> Excel Download
            </button>
            <button onClick={() => navigate("/customer/add")} style={btnRed}>
              + Add Customer
            </button>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"300px 1fr",
          gap:16,
          height:"calc(100vh - 120px)"
        }}>

          {/* ── LEFT ── */}
          <div style={card}>
            <div style={{ padding:"12px 14px", borderBottom:"1px solid #f1f5f9", position:"relative" }}>
              <Search size={15} style={{ position:"absolute", top:"50%", left:26, transform:"translateY(-50%)", color:"#94a3b8" }}/>
              <input
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width:"100%", padding:"9px 12px 9px 34px",
                  borderRadius:10, border:"1px solid #e2e8f0",
                  outline:"none", fontSize:13, boxSizing:"border-box"
                }}
              />
            </div>
            <div style={{ overflowY:"auto", flex:1 }}>
              {filtered.map((c) => {
                const pt         = getCustomerPendingTotal(c.id);
                const isSelected = selectedCustomer?.id === c.id;
                return (
                  <div key={c.id} className="cust-row"
                    onClick={() => {
                      setSelectedCustomer(c);
                      fetchCustomerHistory(c.id);
                      setCollectAmount("");
                      setPreview([]);
                    }}
                    style={{
                      padding:"12px 14px", borderBottom:"1px solid #f1f5f9",
                      cursor:"pointer",
                      background:  isSelected ? "#eff6ff" : "#fff",
                      borderLeft:  isSelected ? "3px solid #2563eb" : "3px solid transparent",
                      transition:"all .15s"
                    }}
                  >
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{c.name}</div>
                        <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{c.phone}</div>
                      </div>
                      <div style={{ fontWeight:700, fontSize:13, color: pt > 0 ? "#ef4444" : "#94a3b8" }}>
                        ₹{fmt(pt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: invoice table ── */}
          <div style={{ ...card, overflow:"hidden" }}>

            {/* customer info + collect button */}
            {selectedCustomer && (
              <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontSize:20, fontWeight:800, color:"#0f172a", marginBottom:8 }}>
                      {selectedCustomer.name}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#64748b", marginBottom:4 }}>
                      <Phone size={13}/> {selectedCustomer.phone}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#64748b" }}>
                      <MapPin size={13}/> {selectedCustomer.address}
                    </div>
                  </div>

                  {/* RIGHT side: pending badge + collect button + edit */}
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>

                    {/* pending badge */}
                    {totalPending > 0 && (
                      <div style={{
                        background:"#fef2f2", border:"1px solid #fecaca",
                        borderRadius:12, padding:"8px 16px", textAlign:"center"
                      }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:".5px" }}>
                          Pending
                        </div>
                        <div style={{ fontSize:18, fontWeight:900, color:"#dc2626" }}>
                          ₹{fmt(totalPending)}
                        </div>
                      </div>
                    )}

                    {/* collect button */}
                    {totalPending > 0 && (
                      <button
                        onClick={openCollect}
                        style={{
                          background:"linear-gradient(135deg,#2563eb,#1d4ed8)",
                          color:"#fff", border:"none", borderRadius:12,
                          padding:"10px 18px", fontWeight:700, fontSize:13,
                          cursor:"pointer", display:"flex", alignItems:"center", gap:7,
                          boxShadow:"0 4px 14px rgba(37,99,235,.3)",
                          transition:"all .15s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                      >
                        <Wallet size={15}/> Collect Payment
                      </button>
                    )}

                    <button onClick={() => navigate(`/customer/edit/${selectedCustomer.id}`)} style={btnEdit}>
                      <Pencil size={15}/>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* table header */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"1.2fr .8fr .8fr .8fr 1fr 1fr",
              padding:"11px 20px",
              background:"#f8fafc",
              borderBottom:"1px solid #e5e7eb",
              fontWeight:700, fontSize:12, color:"#64748b",
              textTransform:"uppercase", letterSpacing:".5px",
              textAlign:"center"
            }}>
              <span style={{ textAlign:"left" }}>Payment Method</span>
              <span>Total</span>
              <span>Paid</span>
              <span>Pending</span>
              <span>Due Date</span>
              <span>Status</span>
            </div>

            {/* rows */}
            <div style={{ overflowY:"auto", flex:1 }}>
              {invoiceHistory.length === 0 ? (
                <div style={{
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  padding:48, color:"#94a3b8", textAlign:"center"
                }}>
                  <div style={{ fontSize:52, marginBottom:14 }}>📄</div>
                  <div style={{ fontWeight:700, fontSize:16, color:"#0f172a" }}>No Billing Records</div>
                  <p style={{ fontSize:13, marginTop:6, maxWidth:300, lineHeight:1.6 }}>
                    This customer has no billing or payment history yet.
                  </p>
                </div>
              ) : (
                invoiceHistory.map((item, index) => {
                  const isPaid = Number(item.balance_amount) <= 0;
                  return (
                    <div key={index} style={{
                      display:"grid",
                      gridTemplateColumns:"1.2fr .8fr .8fr .8fr 1fr 1fr",
                      padding:"14px 20px",
                      alignItems:"center", textAlign:"center",
                      borderBottom:"1px solid #f8fafc",
                      background:"#fff"
                    }}>
                      <div style={{ textAlign:"left", fontWeight:600, fontSize:13, textTransform:"capitalize" }}>
                        {item.payment_method || "-"}
                      </div>
                      <div style={{ fontSize:13 }}>₹{fmt(item.total_amount)}</div>
                      <div style={{ fontWeight:700, color:"#16a34a", fontSize:13 }}>
                        ₹{fmt(item.paid_amount_total)}
                      </div>
                      <div>
                        <span style={{
                          background: isPaid ? "#f0fdf4" : "#fee2e2",
                          color:      isPaid ? "#16a34a" : "#dc2626",
                          padding:"4px 10px", borderRadius:8, fontSize:12, fontWeight:700
                        }}>
                          ₹{fmt(item.balance_amount)}
                        </span>
                      </div>
                      <div style={{ fontSize:13, color:"#64748b" }}>
                        {item.due_date ? formatDate(item.due_date) : "-"}
                      </div>
                      <div>
                        <span style={{
                          padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:700,
                          background: isPaid ? "#dcfce7" : "#fee2e2",
                          color:      isPaid ? "#15803d" : "#dc2626",
                          display:"inline-block", minWidth:72, textAlign:"center"
                        }}>
                          {isPaid ? "Paid" : "Not Paid"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const card = {
  background:"#fff", borderRadius:14,
  border:"1px solid #e5e7eb",
  display:"flex", flexDirection:"column",
};
const btnGreen = {
  background:"#16a34a", color:"#fff", border:"none",
  borderRadius:10, padding:"10px 16px",
  fontWeight:700, cursor:"pointer",
  display:"flex", alignItems:"center", gap:7, fontSize:13
};
const btnRed = {
  background:"#ef4444", color:"#fff", border:"none",
  borderRadius:10, padding:"10px 16px",
  fontWeight:700, cursor:"pointer", fontSize:13
};
const btnEdit = {
  background:"#eff6ff", border:"1px solid #dbeafe",
  width:44, height:44, borderRadius:12,
  cursor:"pointer", color:"#2563eb",
  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
};