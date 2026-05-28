


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";


import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  Pencil,
  Search,
  Phone,
  MapPin,
  Download
} from "lucide-react";

export default function CustomerList() {

  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // ✅ CUSTOMER HISTORY

  const [invoiceHistory, setInvoiceHistory] = useState([]);

  // ✅ ALL INVOICE HISTORY

  const [allHistory, setAllHistory] = useState([]);

  // ✅ FETCH CUSTOMERS

  const fetchCustomers = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const company_id = Number(
        user?.company_id
      );

      const res = await api.get(
        `/customer/get_all_customer.php?company_id=${company_id}`
      );

      if (res.data.status) {

        setCustomers(res.data.data);

        if (res.data.data.length > 0) {

          setSelectedCustomer(
            res.data.data[0]
          );

          fetchCustomerHistory(
            res.data.data[0].id
          );

        }

      }

    } catch (err) {

      console.error(err);

    }

  };

  // ✅ FETCH ALL HISTORY

  const fetchAllHistory = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await api.post(
        "/invoice/get_pending_invoice_history.php",
        {
          company_id: user.company_id
        }
      );

      if (res.data.status) {

        setAllHistory(
          res.data.data
        );

      }

    } catch (err) {

      console.error(err);

    }

  };

  // ✅ FETCH SINGLE CUSTOMER HISTORY

  const fetchCustomerHistory = async (
    customerId
  ) => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await api.post(
        "/invoice/get_pending_invoice_history.php",
        {
          company_id: user.company_id
        }
      );

      if (res.data.status) {

        const filteredHistory =
          res.data.data.filter(
            item =>
              Number(item.customer_id) ===
              Number(customerId)
          );

        setInvoiceHistory(
          filteredHistory
        );

      }

    } catch (err) {

      console.error(err);

    }

  };

  

  useEffect(() => {

    fetchCustomers();

    fetchAllHistory();

  }, []);

  // ✅ TOGGLE STATUS

  const toggleStatus = async (
    customer
  ) => {

    const newStatus =
      customer.status === "active"
        ? "inactive"
        : "active";

    try {

      const res = await api.post(
        "/customer/toggle_status_customer.php",
        {
          id: customer.id,
          status: newStatus,
        }
      );

      if (res.data.success) {

        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customer.id
              ? {
                  ...c,
                  status: newStatus
                }
              : c
          )
        );

        if (
          selectedCustomer?.id ===
          customer.id
        ) {

          setSelectedCustomer({
            ...customer,
            status: newStatus
          });

        }

      } else {

        alert(res.data.message);

      }

    } catch (err) {

      console.error(err);

      alert("Server Error");

    }

  };

  // ✅ SEARCH

  const filtered = customers.filter(
    c =>
      c.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  // ✅ DATE FORMAT

  const formatDate = (date) => {

    if (!date) return "-";

    const d = new Date(
      date.replace(" ", "T")
    );

    return d.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  };

  // ✅ EXCEL DOWNLOAD

const downloadExcel = () => {

  const excelData =
    invoiceHistory.map((item) => ({

      // Type:
      //   selectedCustomer?.type || "-",

      "Payment Method":
  item.payment_method || "-",

      Total:
        item.total_amount,

      Paid:
        item.paid_amount_total,

      Pending:
        item.balance_amount,

      "Due Date":
        item.due_date
          ? formatDate(item.due_date)
          : "-",

      Status:
        Number(item.balance_amount) <= 0
          ? "Paid"
          : "Not Paid"

    }));

  const worksheet =
    XLSX.utils.json_to_sheet(
      excelData
    );

    // ✅ COLUMN WIDTH

worksheet["!cols"] = [
  { wch: 15 },
  { wch: 15 },
  { wch: 15 },
  { wch: 15 },
  { wch: 18 },
  { wch: 18 }
];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Customer Report"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

  const fileData =
    new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    );

  saveAs(
    fileData,
    `${selectedCustomer?.name || "customer"}_report.xlsx`
  );

};

  // ✅ CUSTOMER PENDING TOTAL

  const getCustomerPendingTotal = (
    customerId
  ) => {

    const customerInvoices =
      allHistory.filter(
        item =>
          Number(item.customer_id) ===
          Number(customerId)
      );

    const totalPending =
      customerInvoices.reduce(
        (sum, item) =>
          sum +
          Number(
            item.balance_amount || 0
          ),
        0
      );

    return totalPending;

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: 20,
        fontFamily: "Inter, sans-serif"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 16
        }}
      >

        <div>

          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700
            }}
          >
            Customers
          </h2>

          <p
            style={{
              marginTop: 4,
              color: "#64748b",
              fontSize: 13
            }}
          >
            Manage your customers
          </p>

        </div>

       <div
  style={{
    display: "flex",
    gap: 10,
    alignItems: "center"
  }}
>

  {/* EXCEL DOWNLOAD */}

  <button
    onClick={downloadExcel}
    style={{
      background: "#16a34a",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "12px 18px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8
    }}
  >
    <Download size={16} />
    Excel Download
  </button>

  {/* ADD CUSTOMER */}

  <button
    onClick={() =>
      navigate("/customer/add")
    }
    style={{
      background: "#ef4444",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "12px 18px",
      fontWeight: 600,
      cursor: "pointer"
    }}
  >
    + Add Customer
  </button>

</div>

      </div>

      {/* MAIN LAYOUT */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "320px 1fr",
          gap: 16,
          height:
            "calc(100vh - 120px)"
        }}
      >

        {/* LEFT SIDE */}

        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            overflow: "hidden",
            border:
              "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column"
          }}
        >

          {/* SEARCH */}

          <div
            style={{
              padding: 14,
              borderBottom:
                "1px solid #f1f5f9",
              position: "relative"
            }}
          >

            <Search
              size={16}
              style={{
                position: "absolute",
                top: "50%",
                left: 26,
                transform:
                  "translateY(-50%)",
                color: "#94a3b8"
              }}
            />

            <input
              placeholder="Search customer..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding:
                  "10px 14px 10px 36px",
                borderRadius: 10,
                border:
                  "1px solid #dbeafe",
                outline: "none",
                fontSize: 13
              }}
            />

          </div>

          {/* LIST HEADER */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              padding: "10px 14px",
              background: "#f8fafc",
              borderBottom:
                "1px solid #e5e7eb",
              fontSize: 12,
              fontWeight: 700,
              color: "#64748b"
            }}
          >

            <span>
              Customer Name
            </span>

            <span>
              Amount
            </span>

          </div>

          {/* CUSTOMER LIST */}

          <div
            style={{
              overflowY: "auto",
              flex: 1
            }}
          >

            {filtered.length === 0 ? (

              <div
                style={{
                  padding: 20,
                  textAlign: "center",
                  color: "#94a3b8"
                }}
              >
                No customers found
              </div>

            ) : (

              filtered.map((c) => {

                const pendingTotal =
                  getCustomerPendingTotal(
                    c.id
                  );

                return (

                  <div
                    key={c.id}
                    onClick={() => {

                      setSelectedCustomer(
                        c
                      );

                      fetchCustomerHistory(
                        c.id
                      );

                    }}
                    style={{
                      padding: 14,
                      borderBottom:
                        "1px solid #f1f5f9",
                      cursor: "pointer",
                      background:
                        selectedCustomer?.id ===
                        c.id
                          ? "#dbeafe"
                          : "#fff"
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start"
                      }}
                    >

                      <div>

                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            color:
                              "#111827"
                          }}
                        >
                          {c.name}
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color:
                              "#64748b",
                            marginTop: 4
                          }}
                        >
                          {c.phone}
                        </div>

                      </div>

                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color:
                            pendingTotal > 0
                              ? "#10b981"
                              : "#94a3b8"
                        }}
                      >

                        {pendingTotal > 0 ? (
                          <>
                            ₹
                            {Number(
                              pendingTotal
                            ).toLocaleString()}
                          </>
                        ) : (
                          "0.00"
                        )}

                      </div>

                    </div>

                  </div>

                );

              })

            )}

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border:
              "1px solid #e5e7eb",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}
        >

          {/* CUSTOMER HEADER */}

          {selectedCustomer && (

            <div
              style={{
                padding: 20,
                borderBottom:
                  "1px solid #f1f5f9"
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-start"
                }}
              >

                <div>

                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      marginBottom: 10
                    }}
                  >
                    {
                      selectedCustomer.name
                    }
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 8,
                      marginBottom: 8,
                      color: "#64748b",
                      fontSize: 13
                    }}
                  >
                    <Phone size={14} />

                    {
                      selectedCustomer.phone
                    }
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 8,
                      color: "#64748b",
                      fontSize: 13
                    }}
                  >
                    <MapPin size={14} />

                    {
                      selectedCustomer.address
                    }
                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/customer/edit/${selectedCustomer.id}`
                    )
                  }
                  style={btnEdit}
                >
                  <Pencil size={16} />
                </button>

              </div>

            </div>

          )}

          {/* TABLE */}

          <div
            style={{
              overflowX: "auto",
              flex: 1,
              overflowY: "auto"
            }}
          >

            {/* TABLE HEADER */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr 1fr 1fr 1fr 1fr",
                padding: "14px 20px",
                background: "#f8fafc",
                borderBottom:
                  "1px solid #e5e7eb",
                fontWeight: 700,
                fontSize: 13,
                color: "#475569",
                minWidth: 900,
                 position: "sticky",
    top: 0,
    zIndex: 20
              }}
            >

              <span>Payment Method</span>

              <span>Total</span>

              <span>Paid</span>

              <span>Pending</span>

              <span>Due Date</span>

              <span>
                Payment Status
              </span>

            </div>

            {/* ROWS */}

            {invoiceHistory.length ===
            0 ? (

              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  color: "#94a3b8",
                  fontWeight: 600
                }}
              >
                No Invoice History
              </div>

            ) : (

              invoiceHistory.map(
                (item, index) => {

                  const isPaid =
                    Number(
                      item.balance_amount
                    ) <= 0;

                  return (

                    <div
                      key={index}
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "1fr 1fr 1fr 1fr 1fr 1fr",
                        padding:
                          "16px 20px",
                        alignItems:
                          "center",
                        borderBottom:
                          "1px solid #f1f5f9",
                        minWidth: 900
                      }}
                    >

                      {/* TYPE */}

                      {/* <div>

                        <span
                          style={{
                            background:
                              "#eff6ff",
                            color:
                              "#2563eb",
                            padding:
                              "5px 12px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700
                          }}
                        >
                          {
                            selectedCustomer.type
                          }
                        </span>

                      </div>  */}

                      {/* PAYMENT METHOD */}

<div>

  <span
    style={{
      padding: "6px 12px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,

      background:
        item.payment_method?.toLowerCase() === "cash"
          ? "#dcfce7"
          : item.payment_method?.toLowerCase() === "online"
          ? "#dbeafe"
          : item.payment_method?.toLowerCase() === "upi"
          ? "#f3e8ff"
          : "#fee2e2",

      color:
        item.payment_method?.toLowerCase() === "cash"
          ? "#15803d"
          : item.payment_method?.toLowerCase() === "online"
          ? "#1d4ed8"
          : item.payment_method?.toLowerCase() === "upi"
          ? "#7e22ce"
          : "#dc2626"
    }}
  >
    {item.payment_method || "-"}
  </span>

</div>

                      {/* TOTAL */}

                      <div
                        style={{
                          fontWeight: 700
                        }}
                      >
                        ₹
                        {Number(
                          item.total_amount
                        ).toLocaleString()}
                      </div>

                      {/* PAID */}

                      <div
                        style={{
                          color:
                            "#16a34a",
                          fontWeight: 700
                        }}
                      >
                        ₹
                        {Number(
                          item.paid_amount_total
                        ).toLocaleString()}
                      </div>

                      {/* PENDING */}

                      <div>

                        <span
                          style={{
                            color:
                              Number(
                                item.balance_amount
                              ) > 0
                                ? "#dc2626"
                                : "#94a3b8",
                            fontWeight: 700,
                            background:
                              Number(
                                item.balance_amount
                              ) > 0
                                ? "#fee2e2"
                                : "#f1f5f9",
                            padding:
                              "5px 10px",
                            borderRadius: 8,
                            fontSize: 12
                          }}
                        >

                          {Number(
                            item.balance_amount
                          ) > 0 ? (
                            <>
                              ₹
                              {Number(
                                item.balance_amount
                              ).toLocaleString()}
                            </>
                          ) : (
                            "-"
                          )}

                        </span>

                      </div>

                      {/* DUE DATE */}

                      <div
                        style={{
                          fontWeight: 500
                        }}
                      >
                        {item.due_date
                          ? formatDate(
                              item.due_date
                            )
                          : "-"}
                      </div>

                      {/* STATUS */}

                      <div>

                        <span
                          style={{
                            padding:
                              "6px 14px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            background:
                              isPaid
                                ? "#dcfce7"
                                : "#fee2e2",
                            color:
                              isPaid
                                ? "#15803d"
                                : "#dc2626"
                          }}
                        >
                          {isPaid
                            ? "Paid"
                            : "Not Paid"}
                        </span>

                      </div>

                    </div>

                  );

                }
              )

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

/* BUTTON */

const btnEdit = {
  background: "#eff6ff",
  border: "none",
  padding: 10,
  borderRadius: 10,
  cursor: "pointer",
  color: "#2563eb"
};