import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import {
  Search,
  Building2,
  Check,
  X,
  Users,
} from "lucide-react";

export default function CompanyRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        "/CompanyRequest/get_company_requests.php"
      );

      if (res.data.status) {
        setRequests(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    //   alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(requestId);

      const res = await api.post(
        "/CompanyRequest/approve_company_request.php",
        {
          request_id: requestId,
        }
      );

      if (res.data.status) {
        alert("Company request approved");
        fetchRequests();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this request?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(requestId);

      const res = await api.post(
        "/CompanyRequest/reject_company_request.php",
        {
          request_id: requestId,
        }
      );

      if (res.data.status) {
        alert("Company request rejected");
        fetchRequests();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const txt = search.toLowerCase();

      return (
        (r.company_name || "")
          .toLowerCase()
          .includes(txt) ||
        (r.owner_name || "")
          .toLowerCase()
          .includes(txt) ||
        (r.owner_email || "")
          .toLowerCase()
          .includes(txt)
      );
    });
  }, [requests, search]);

  return (
    <div
      style={{
        padding: 30,
        background: "#f4f8ff",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 25,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            Pending Company Requests
          </h2>

          <p
            style={{
              marginTop: 10,
              color: "#64748b",
              fontSize: 16,
            }}
          >
            Manage company approval requests
          </p>
        </div>

        <div
          style={{
            width: 220,
            background: "#fff",
            borderRadius: 28,
            padding: 24,
            display: "flex",
            gap: 18,
            alignItems: "center",
            boxShadow:
              "0 10px 25px rgba(15,23,42,.05)",
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 18,
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users
              size={30}
              color="#2563eb"
            />
          </div>

          <div>
            <div
              style={{
                color: "#64748b",
                fontSize: 13,
              }}
            >
              Total Requests
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#1e40af",
              }}
            >
              {filteredRequests.length}
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 30,
          boxShadow:
            "0 5px 20px rgba(15,23,42,.04)",
        }}
      >
        <Search
          size={26}
          color="#94a3b8"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search company, owner or email..."
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: 18,
            color: "#334155",
            background: "transparent",
          }}
        />
      </div>

      {/* TABLE */}

      <div
        style={{
          background: "#fff",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow:
            "0 15px 30px rgba(15,23,42,.05)",
        }}
      >
        {/* HEADER */}

        <div
  style={{
    background:
      "linear-gradient(135deg,#2563eb,#4f86ff)",
    color: "#fff",
    padding: "22px 40px",
    display: "grid",
    gridTemplateColumns:
      "2fr 1.5fr 1.2fr",
    fontWeight: 700,
    fontSize: 15
  }}
>
  <div>Company</div>
  <div>Requested By</div>
  <div style={{ textAlign: "center" }}>
    Actions
  </div>
</div>

        {loading ? (
          <div
            style={{
              padding: 50,
              textAlign: "center",
            }}
          >
            Loading...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div
            style={{
              padding: 50,
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No pending requests found
          </div>
        ) : (
          filteredRequests.map((item) => (
            <div
  key={item.id}
  style={{
    padding: "28px 40px",
    display: "grid",
    gridTemplateColumns:
      "2fr 1.5fr 1.2fr",
    alignItems: "center",
    borderBottom:
      "1px solid #eef2f7"
  }}
>
              {/* COMPANY */}

             <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 18
  }}
>
  <div
    style={{
      width: 58,
      height: 58,
      borderRadius: 18,
      background: "#dbeafe",
      color: "#2563eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: 28
    }}
  >
    {item.company_name
      ?.charAt(0)
      ?.toUpperCase()}
  </div>

  <div>
    <div
      style={{
        fontWeight: 700,
        fontSize: 18,
        color: "#0f172a"
      }}
    >
      {item.company_name}
    </div>

    <div
      style={{
        color: "#94a3b8",
        marginTop: 4,
        fontSize: 14
      }}
    >
      Request ID #{item.id}
    </div>
  </div>
</div>

              {/* REQUESTED BY */}
<div>
  <div
    style={{
      fontWeight: 600,
      fontSize: 17,
      color: "#334155"
    }}
  >
    {item.admin_name}
  </div>

  <div
    style={{
      fontSize: 13,
      color: "#94a3b8",
      marginTop: 4
    }}
  >
    Admin
  </div>
</div>

             


              {/* ACTIONS */}

             <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 12
  }}
>
  <button
    onClick={() => handleApprove(item.id)}
    style={{
      border: "none",
      background:
        "linear-gradient(135deg,#16a34a,#22c55e)",
      color: "#fff",
      padding: "14px 28px",
      borderRadius: 16,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      gap: 8,
      boxShadow:
        "0 6px 16px rgba(34,197,94,.25)"
    }}
  >
    <Check size={18}/>
    Accept
  </button>

  <button
    onClick={() => handleReject(item.id)}
    style={{
      border: "none",
      background:
        "linear-gradient(135deg,#dc2626,#ef4444)",
      color: "#fff",
      padding: "14px 28px",
      borderRadius: 16,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      gap: 8,
      boxShadow:
        "0 6px 16px rgba(239,68,68,.25)"
    }}
  >
    <X size={18}/>
    Reject
  </button>
</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}