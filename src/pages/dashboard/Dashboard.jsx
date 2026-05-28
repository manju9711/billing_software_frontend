import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import {
  TrendingUp, Package, AlertTriangle,
  ShoppingBag, BarChart2, Wallet, Clock, IndianRupee
} from "lucide-react";

function useStyles() {
  useEffect(() => {
    const id = "db-v5-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
      .db * { box-sizing: border-box; }
      @keyframes db-up   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
      @keyframes db-spin { to{transform:rotate(360deg)} }
      @keyframes db-num  { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
      .db-card { transition: box-shadow .22s, transform .22s; }
      .db-card:hover { box-shadow: 0 8px 32px rgba(99,102,241,.13) !important; transform: translateY(-2px); }
      .db-row:hover td { background: #f8f7ff !important; }
      .db-row td { transition: background .15s; }
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e1b4b", borderRadius: 12, padding: "10px 16px",
      fontFamily: "'Plus Jakarta Sans',sans-serif",
    }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#a5b4fc" }}>₹{Number(payload[0].value).toLocaleString()}</div>
    </div>
  );
}

const ACCENTS = {
  green:  { bg: "#f0fdf4", icon: "#bbf7d0", iconFg: "#15803d", val: "#15803d", border: "#dcfce7" },
  blue:   { bg: "#eff6ff", icon: "#bfdbfe", iconFg: "#1d4ed8", val: "#1d4ed8", border: "#dbeafe" },
  red:    { bg: "#fff1f2", icon: "#fecdd3", iconFg: "#be123c", val: "#be123c", border: "#ffe4e6" },
  indigo: { bg: "#eef2ff", icon: "#c7d2fe", iconFg: "#4338ca", val: "#4338ca", border: "#e0e7ff" },
  orange: { bg: "#fff7ed", icon: "#fed7aa", iconFg: "#c2410c", val: "#b91c1c", border: "#fed7aa" },
};

function StatCard({ label, value, icon: Icon, accent, delay, prefix = "", suffix = "" }) {
  const c = ACCENTS[accent] || ACCENTS.indigo;
  return (
    <div className="db-card" style={{
      background: c.bg, border: `1.5px solid ${c.border}`,
      borderRadius: 18, padding: "22px 20px",
      animation: `db-up .45s ${delay}s ease both`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -18, right: -18, width: 70, height: 70, borderRadius: "50%", background: c.icon, opacity: .45, pointerEvents: "none" }} />
      <div style={{ width: 40, height: 40, borderRadius: 12, background: c.icon, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={c.iconFg} strokeWidth={2.2} />
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: c.val, fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.1, animation: "db-num .5s ease both" }}>
          {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
        </div>
      </div>
    </div>
  );
}

function StockBadge({ stock }) {
  const color = stock === 0 ? "#be123c" : stock <= 2 ? "#c2410c" : "#b45309";
  const bg    = stock === 0 ? "#fff1f2" : stock <= 2 ? "#fff7ed" : "#fefce8";
  const border= stock === 0 ? "#fecdd3" : stock <= 2 ? "#fed7aa" : "#fef08a";
  return (
    <span style={{ background: bg, color, border: `1px solid ${border}`, borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
      {stock === 0 ? "Out of stock" : `${stock} left`}
    </span>
  );
}

function SectionHeader({ icon: Icon, iconBg, iconColor, title, subtitle, badge }) {
  const font = "'Plus Jakarta Sans', sans-serif";
  return (
    <div style={{ padding: "16px 22px 12px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={iconColor} />
        </div>
        <div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b", fontFamily: font }}>{title}</span>
          {subtitle && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{subtitle}</div>}
        </div>
      </div>
      {badge}
    </div>
  );
}

export default function Dashboard() {
  useStyles();
  const font = "'Plus Jakarta Sans', sans-serif";

  const [stats, setStats] = useState({ total_sales: 0, total_products: 0, monthly_sales: [] });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [creditStats, setCreditStats] = useState({ total_credit_sales: 0, total_outstanding: 0, overdue_amount: 0, today_collection: 0 });
  const [creditList, setCreditList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBar, setActiveBar] = useState(null);

  const getCompanyId = () => JSON.parse(localStorage.getItem("user"))?.company_id;

  useEffect(() => {
    fetchStats();
    fetchLowStockProducts();
    fetchCreditDashboard();
  }, []);

  const fetchStats = async () => {
    try {
      const id = getCompanyId();
      const [basic, analytics] = await Promise.all([
        api.get(`/dashboard/get_stats.php?company_id=${id}`),
        api.get(`/dashboard/get_analytics.php?company_id=${id}`)
      ]);
      if (basic.data.status && analytics.data.status) {
        setStats({ ...basic.data.data, monthly_sales: analytics.data.data.monthly_sales });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // const fetchLowStockProducts = async () => {
  //   try {
  //     const res = await api.get(`/product/get.php?company_id=${getCompanyId()}`);
  //     if (res.data.status) setLowStockProducts(res.data.data.filter(p => p.stock <= 5));
  //   } catch (e) { console.error(e); }
  // };

 
 const fetchLowStockProducts = async () => {
  try {

    const res = await api.get(
      `/product/get.php?company_id=${getCompanyId()}`
    );

    if (res.data.status) {

      // ACTIVE PRODUCTS ONLY
      const activeLowStock = res.data.data.filter(
        (p) =>
          p.status === "active" &&
          Number(p.stock) <= 5
      );

      setLowStockProducts(activeLowStock);
    }

  } catch (e) {

    console.error(e);

  }
};
  const fetchCreditDashboard = async () => {
    try {
      const res = await api.get(`/dashboard/get_dashboard.php?company_id=${getCompanyId()}`);
      if (res.data.status) { setCreditStats(res.data.cards); setCreditList(res.data.list); }
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 10, color: "#6366f1", fontFamily: font }}>
      <span style={{ width: 20, height: 20, border: "2.5px solid #c7d2fe", borderTopColor: "#6366f1", borderRadius: "50%", display: "inline-block", animation: "db-spin .8s linear infinite" }} />
      Loading dashboard…
    </div>
  );

  const thStyle = { padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#9ca3af", borderBottom: "1px solid #f3f4f6" };
  const tdStyle = (bg = "#fff") => ({ padding: "13px 20px", fontSize: 14, color: "#374151", background: bg });

  return (
    <div className="db" style={{ fontFamily: font }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, animation: "db-up .35s ease both" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1e1b4b" }}>Dashboard</h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#9ca3af" }}>Welcome back — here's what's happening today</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#eef2ff", border: "1.5px solid #e0e7ff", borderRadius: 12, padding: "8px 16px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,.2)" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#4338ca" }}>Live data</span>
        </div>
      </div>

      {/* ── Top 3 Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 14 }}>
        <StatCard label="Total Sales"    value={stats.total_sales}       icon={TrendingUp}    accent="green"  delay={0}    prefix="₹" />
        <StatCard label="Total Products" value={stats.total_products}    icon={Package}       accent="blue"   delay={0.07} />
        <StatCard label="Low Stock"      value={lowStockProducts.length} icon={AlertTriangle} accent="red"    delay={0.14} suffix=" items" />
      </div>

      {/* ── Credit Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Credit Sales"     value={creditStats.total_credit_sales} icon={ShoppingBag}   accent="indigo" delay={0.18} prefix="₹" />
        <StatCard label="Outstanding"      value={creditStats.total_outstanding}  icon={Wallet}        accent="red"    delay={0.22} prefix="₹" />
        <StatCard label="Overdue"          value={creditStats.overdue_amount}     icon={Clock}         accent="orange" delay={0.26} prefix="₹" />
        <StatCard label="Today Collection" value={creditStats.today_collection}   icon={IndianRupee}   accent="green"  delay={0.30} prefix="₹" />
      </div>

      {/* ── Chart ── */}
      <div style={{ background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 20, padding: "22px 24px", marginBottom: 20, animation: "db-up .45s .32s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b" }}>Monthly Sales</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Revenue overview this year</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart2 size={16} color="#6366f1" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.monthly_sales} barSize={32}
            onMouseMove={s => setActiveBar(s.isTooltipActive ? s.activeTooltipIndex : null)}
            onMouseLeave={() => setActiveBar(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: font, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: font }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,.06)", radius: 8 }} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <Bar dataKey="total" radius={[10, 10, 0, 0]}>
              {stats.monthly_sales.map((_, i) => (
                <Cell key={i} fill={activeBar === null ? "url(#barGrad)" : activeBar === i ? "#4f46e5" : "#c7d2fe"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Low Stock Table ── */}
      <div style={{ background: "#fff", border: "1.5px solid #ffe4e6", borderRadius: 20, overflow: "hidden", marginBottom: 20, animation: "db-up .45s .36s ease both" }}>
        <SectionHeader
          icon={AlertTriangle} iconBg="#fff1f2" iconColor="#be123c"
          title="Low Stock Products" subtitle="Items with 5 or fewer units remaining"
          badge={lowStockProducts.length > 0 && (
            <span style={{ background: "#fff1f2", color: "#be123c", border: "1.5px solid #fecdd3", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
              {lowStockProducts.length} alert{lowStockProducts.length > 1 ? "s" : ""}
            </span>
          )}
        />
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["#", "Product Name", "Price", "Stock"].map((h, i) => <th key={i} style={thStyle}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.length > 0 ? lowStockProducts.map((item, i) => (
              <tr key={item.id} className="db-row" style={{ borderBottom: "1px solid #fafafa" }}>
                <td style={tdStyle()}><span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span></td>
                <td style={tdStyle()}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={13} color="#7c3aed" />
                    </div>
                    <span style={{ fontWeight: 700, color: "#1e1b4b" }}>{item.product_name}</span>
                  </div>
                </td>
                <td style={tdStyle()}>₹{Number(item.price).toLocaleString()}</td>
                <td style={tdStyle()}><StockBadge stock={Number(item.stock)} /></td>
              </tr>
            )) : (
              <tr><td colSpan={4} style={{ padding: "36px 20px", textAlign: "center", color: "#9ca3af", fontSize: 14, background: "#fff" }}>All products are well stocked</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Outstanding Table ── */}
      <div style={{ background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 20, overflow: "hidden", animation: "db-up .45s .40s ease both" }}>
        <SectionHeader
          icon={Wallet} iconBg="#eef2ff" iconColor="#4338ca"
          title="Outstanding Customers" subtitle="Pending credit payments"
        />
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Customer", "Outstanding", "Due Date", "Status"].map((h, i) => <th key={i} style={thStyle}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {creditList.length > 0 ? creditList.map((c, i) => (
              <tr key={i} className="db-row" style={{ borderBottom: "1px solid #fafafa" }}>
                <td style={tdStyle()}><span style={{ fontWeight: 700, color: "#1e1b4b" }}>{c.customer}</span></td>
                <td style={tdStyle()}>₹{Number(c.outstanding).toLocaleString()}</td>
                <td style={tdStyle()}>{c.due_date}</td>
                <td style={tdStyle()}>
                  <span style={{
                    background: c.status === "Overdue" ? "#fee2e2" : "#fef9c3",
                    color:      c.status === "Overdue" ? "#dc2626" : "#ca8a04",
                    border: `1px solid ${c.status === "Overdue" ? "#fca5a5" : "#fde68a"}`,
                    borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700
                  }}>{c.status}</span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} style={{ padding: "36px 20px", textAlign: "center", color: "#9ca3af", fontSize: 14, background: "#fff" }}>No outstanding records</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}