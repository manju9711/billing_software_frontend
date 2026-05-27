import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function CustomerForm() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    type: "regular",
    credit_enabled: 0,
    credit_limit: "",
    credit_days: ""
  });

  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {

    /* 🔥 GET COMPANY ID FROM LOCALSTORAGE */
    const user = JSON.parse(localStorage.getItem("user"));
    const company_id = Number(user?.company_id);

    /* ✅ VALIDATION */
    if (!form.name.trim()) {
      alert("Customer name is required");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    if (!company_id) {
      alert("Company not found. Please login again.");
      return;
    }

    setLoading(true);

    try {

      const payload = {
        company_id: company_id, // 🔥 IMPORTANT
        name: form.name.trim(),
        phone: form.phone,
        address: form.address,
        type: form.type,
        credit_enabled: form.credit_enabled,
        credit_limit: form.credit_enabled ? form.credit_limit : 0,
        credit_days: form.credit_enabled ? form.credit_days : 0
      };

      console.log("Payload:", payload); // debug

      const res = await api.post("/customer/create_customer.php", payload);

      if (res.data.status) {
        alert("Customer created successfully!");
        navigate("/customer");
      } else {
        alert(res.data.message || "Failed to create");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#eef2f7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif"
    }}>

      {/* CARD */}
      <div style={{
        width: 380,
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.08)"
      }}>

        {/* HEADER */}
        <div style={{
          background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
          padding: 24,
          color: "#fff"
        }}>
          <h2 style={{ margin: 0 }}>Add Customer</h2>
          <p style={{ margin: "5px 0 0", fontSize: 13, opacity: 0.8 }}>
            Create a new customer
          </p>
        </div>

        {/* FORM */}
        <div style={{ padding: 20 }}>

          {/* NAME */}
          <input
            placeholder="Customer Name"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            style={inputStyle}
          />

          {/* PHONE */}
          <input
            placeholder="Mobile"
            value={form.phone}
            onChange={e => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            style={inputStyle}
          />

          {/* ADDRESS */}
          <textarea
            placeholder="Address"
            value={form.address}
            onChange={e => set("address", e.target.value)}
            style={{ ...inputStyle, height: 70 }}
          />

          <label>Customer Type</label>

          {/* TYPE */}
          <select
            value={form.type}
            onChange={e => set("type", e.target.value)}
            style={inputStyle}
          >
            <option value="regular">Regular</option>
            <option value="wholesale">Wholesale</option>
            <option value="retail">Retail</option>
          </select>

          {/* CREDIT ENABLE */}
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <label>Credit Enabled</label>

            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name="credit_enabled"
                value={1}
                checked={form.credit_enabled === 1}
                onChange={(e) => set("credit_enabled", Number(e.target.value))}
              />
              Yes
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name="credit_enabled"
                value={0}
                checked={form.credit_enabled === 0}
                onChange={(e) => set("credit_enabled", Number(e.target.value))}
              />
              No
            </label>
          </div>

          {/* CREDIT LIMIT */}
          {form.credit_enabled === 1 && (
            <input
              type="number"
              placeholder="Credit Limit"
              value={form.credit_limit}
              onChange={e => set("credit_limit", e.target.value)}
              style={inputStyle}
            />
          )}

          {/* CREDIT DAYS */}
{form.credit_enabled === 1 && (
  <input
    type="number"
    placeholder="Credit Days"
    value={form.credit_days}
    onChange={e => set("credit_days", e.target.value)}
    style={inputStyle}
  />
)}

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              marginTop: 10,
              padding: 14,
              border: "none",
              borderRadius: 14,
              background: "linear-gradient(135deg,#2563eb,#3b82f6)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14
            }}
          >
            {loading ? "Creating..." : "Create Customer"}
          </button>

        </div>
      </div>
    </div>
  );
}

/* INPUT STYLE */
const inputStyle = {
  width: "100%",
  marginBottom: 12,
  padding: "12px 14px",
  borderRadius: 14,
  border: "none",
  background: "#f1f5f9",
  outline: "none",
  fontSize: 14
};