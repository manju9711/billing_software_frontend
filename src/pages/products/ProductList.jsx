// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import Barcode from "react-barcode";
// import { Pencil, Trash2 } from "lucide-react";

// /* ─── Toast Hook ─────────────────────────────────────────── */
// function useToast() {
//   const [toasts, setToasts] = useState([]);
//   const show = (type, title, msg) => {
//     const id = Date.now();
//     setToasts(p => [...p, { id, type, title, msg }]);
//     setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
//   };
//   const remove = id => setToasts(p => p.filter(t => t.id !== id));
//   return { toasts, show, remove };
// }

// function ToastPortal({ toasts, remove }) {
//   return (
//     <div style={{ position:"fixed", top:22, right:22, zIndex:9999, display:"flex", flexDirection:"column", gap:9, pointerEvents:"none" }}>
//       {toasts.map(t => (
//         <div key={t.id} className={`pl-toast pl-toast-${t.type}`}>
//           <div className="pl-toast-icon">{t.type==="success"?"✓":"✕"}</div>
//           <div className="pl-toast-body">
//             <p className="pl-toast-title">{t.title}</p>
//             {t.msg && <p className="pl-toast-msg">{t.msg}</p>}
//           </div>
//           <button className="pl-toast-x" style={{pointerEvents:"auto"}} onClick={()=>remove(t.id)}>✕</button>
//           <div className="pl-toast-bar" />
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ─── Confirm Modal ──────────────────────────────────────── */
// function ConfirmModal({ item, onConfirm, onCancel, deleting }) {
//   return (
//     <div className="pl-overlay">
//       <div className="pl-modal">
//         <div className="pl-modal-icon">🗑️</div>
//         <h3 className="pl-modal-title">Delete Product?</h3>
//         <p className="pl-modal-msg">
//           You're about to delete <strong>"{item.product_name}"</strong>.<br />
//           This action cannot be undone.
//         </p>
//         <div className="pl-modal-actions">
//           <button className="pl-modal-cancel" onClick={onCancel} disabled={deleting}>Cancel</button>
//           <button className="pl-modal-confirm" onClick={onConfirm} disabled={deleting}>
//             {deleting ? "Deleting…" : "Yes, Delete"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── Main Component ─────────────────────────────────────── */
// export default function ProductList() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const { toasts, show, remove } = useToast();

//   const ITEMS_PER_PAGE = 10;

//   const getCompanyId = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return Number(user?.company_id);
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const company_id = getCompanyId();
//       if (!company_id) return;
//       const res = await api.get(`/product/get.php?company_id=${company_id}`);
//       if (res.data.status) setProducts(res.data.data);
//       else show("error", "Fetch failed", res.data.message);
//     } catch (err) {
//       console.error(err);
//       show("error", "Server error", "Could not load products.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchProducts(); }, []);

//   const filtered = products.filter(p =>
//     p.product_name.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//   const safePage = Math.min(currentPage, totalPages);
//   const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

//   const handleSearch = val => { setSearch(val); setCurrentPage(1); };

//   const handleDeleteConfirm = async () => {
//     setDeleting(true);
//     try {
//       const res = await api.post("/product/delete.php", { id: deleteTarget.id });
//       if (res.data.status) {
//         show("success", "Deleted!", `"${deleteTarget.product_name}" removed.`);
//         fetchProducts();
//       } else {
//         show("error", "Delete failed", res.data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       show("error", "Server error", "Could not delete. Try again.");
//     } finally {
//       setDeleting(false);
//       setDeleteTarget(null);
//     }
//   };

//   const getPages = () => {
//     const pages = [];
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1);
//       if (safePage > 3) pages.push("...");
//       for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
//       if (safePage < totalPages - 2) pages.push("...");
//       pages.push(totalPages);
//     }
//     return pages;
//   };

//   const stockBadge = (stock) => {
//     if (stock <= 0)  return { cls: "pl-badge-out",  label: "Out" };
//     if (stock <= 10) return { cls: "pl-badge-low",  label: "Low" };
//     return              { cls: "pl-badge-ok",   label: "OK" };
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//         .pl-page {
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           min-height: 100vh;
//           background: #f0f4ff;
//           padding: 2rem;
//         }

//         /* ── Header ── */
//         .pl-header {
//           display:flex; align-items:center; justify-content:space-between;
//           margin-bottom:1.5rem; flex-wrap:wrap; gap:12px;
//         }
//         .pl-header-left h1 {
//           font-size:22px; font-weight:800; color:#0f172a;
//           margin:0 0 3px; letter-spacing:-0.4px;
//         }
//         .pl-header-left p { font-size:12.5px; color:#94a3b8; margin:0; }
//         .pl-add-btn {
//           display:flex; align-items:center; gap:8px;
//           padding:11px 20px; border-radius:12px; border:none; cursor:pointer;
//           font-family:'Plus Jakarta Sans',sans-serif; font-size:13.5px; font-weight:700;
//           background:linear-gradient(135deg,#1e40af,#3b82f6); color:#fff;
//           box-shadow:0 4px 16px rgba(37,99,235,0.35); transition:all 0.22s;
//           position:relative; overflow:hidden;
//         }
//         .pl-add-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 60%); pointer-events:none; }
//         .pl-add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(37,99,235,0.42); }

//         /* ── Toolbar ── */
//         .pl-toolbar {
//           display:flex; gap:12px; margin-bottom:1.25rem; flex-wrap:wrap; align-items:center;
//         }
//         .pl-search-wrap { position:relative; flex:1; min-width:200px; }
//         .pl-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:15px; pointer-events:none; color:#94a3b8; }
//         .pl-search {
//           width:100%; padding:11px 16px 11px 42px;
//           border-radius:13px; border:1.5px solid #e2e8f0; background:#fff;
//           font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#1e293b;
//           outline:none; box-sizing:border-box; transition:all 0.22s;
//           box-shadow:0 1px 4px rgba(0,0,0,0.04);
//         }
//         .pl-search::placeholder { color:#c4cdd6; }
//         .pl-search:focus { border-color:#3b82f6; box-shadow:0 0 0 4px rgba(59,130,246,0.1); }
//         .pl-search-clear {
//           position:absolute; right:12px; top:50%; transform:translateY(-50%);
//           background:#e2e8f0; border:none; border-radius:50%;
//           width:20px; height:20px; cursor:pointer; font-size:10px; color:#64748b;
//           display:flex; align-items:center; justify-content:center; transition:all 0.15s;
//         }
//         .pl-search-clear:hover { background:#cbd5e1; }

//         .pl-stat {
//           background:#fff; border:1px solid #e2e8f0; border-radius:12px;
//           padding:9px 16px; display:flex; align-items:center; gap:7px;
//           font-size:12.5px; font-weight:600; color:#475569;
//           box-shadow:0 1px 4px rgba(0,0,0,0.04); white-space:nowrap;
//         }
//         .pl-stat-num { font-size:16px; font-weight:800; color:#2563eb; }

//         /* ── Card ── */
//         .pl-card {
//           background:#fff; border-radius:18px; border:1px solid #e8edf5;
//           box-shadow:0 2px 16px rgba(37,99,235,0.07), 0 1px 4px rgba(0,0,0,0.04);
//           overflow:hidden;
//           animation:plFadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         @keyframes plFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
//         .pl-stripe {
//           height:4px;
//           background:linear-gradient(90deg,#1d4ed8,#6366f1,#3b82f6,#1d4ed8);
//           background-size:200%; animation:plStripe 3s linear infinite;
//         }
//         @keyframes plStripe{0%{background-position:0%}100%{background-position:200%}}

//         /* ── Table ── */
//         .pl-table { width:100%; border-collapse:collapse; }
//         .pl-table thead tr { background:#f8faff; border-bottom:1.5px solid #e8edf5; }
//         .pl-table th {
//           padding:12px 14px; font-size:10.5px; font-weight:700;
//           text-transform:uppercase; letter-spacing:0.08em; color:#94a3b8; text-align:left;
//           white-space:nowrap;
//         }
//         .pl-table th.center { text-align:center; }
//         .pl-table tbody tr {
//           border-bottom:1px solid #f1f5f9; transition:background 0.15s;
//           animation:plRowIn 0.3s ease both;
//         }
//         .pl-table tbody tr:last-child { border-bottom:none; }
//         .pl-table tbody tr:hover { background:#f8faff; }
//         @keyframes plRowIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
//         .pl-table td { padding:11px 14px; font-size:13.5px; color:#1e293b; vertical-align:middle; }
//         .pl-table td.center { text-align:center; }

//         /* Row index */
//         .pl-index {
//           display:inline-flex; align-items:center; justify-content:center;
//           width:24px; height:24px; border-radius:7px;
//           background:#eff6ff; color:#3b82f6; font-size:11px; font-weight:700;
//         }

//         /* Product name */
//         .pl-prod-name { font-weight:700; font-size:13.5px; color:#0f172a; }
//         .pl-prod-cat  { font-size:11.5px; color:#94a3b8; margin-top:2px; }

//         /* Price */
//         .pl-price { font-weight:700; color:#0f172a; font-size:14px; }

//         /* GST badge */
//         .pl-gst {
//           display:inline-flex; align-items:center;
//           padding:3px 9px; border-radius:100px;
//           background:#eff6ff; color:#2563eb;
//           font-size:11.5px; font-weight:700; border:1px solid #bfdbfe;
//         }

//         /* Stock badge */
//         .pl-stock-wrap { display:flex; align-items:center; gap:6px; justify-content:center; }
//         .pl-badge-ok  { padding:3px 9px; border-radius:100px; font-size:11px; font-weight:700; background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; }
//         .pl-badge-low { padding:3px 9px; border-radius:100px; font-size:11px; font-weight:700; background:#fef9c3; color:#854d0e; border:1px solid #fde68a; }
//         .pl-badge-out { padding:3px 9px; border-radius:100px; font-size:11px; font-weight:700; background:#ffe4e6; color:#be123c; border:1px solid #fecdd3; }

//         /* Barcode cell */
//         .pl-barcode-cell { display:flex; flex-direction:column; align-items:center; gap:2px; }
//         .pl-barcode-num { font-size:10px; color:#94a3b8; font-weight:500; }

//         /* Action buttons */
//         .pl-actions { display:flex; align-items:center; justify-content:center; gap:7px; }
//         .pl-btn-edit, .pl-btn-del {
//           width:32px; height:32px; border-radius:9px; border:1.5px solid;
//           display:flex; align-items:center; justify-content:center;
//           cursor:pointer; transition:all 0.18s; background:transparent;
//         }
//         .pl-btn-edit { border-color:#bfdbfe; color:#2563eb; }
//         .pl-btn-edit:hover { background:#2563eb; color:#fff; border-color:#2563eb; transform:scale(1.1); }
//         .pl-btn-del  { border-color:#fecaca; color:#ef4444; }
//         .pl-btn-del:hover  { background:#ef4444; color:#fff; border-color:#ef4444; transform:scale(1.1); }

//         /* Empty */
//         .pl-empty { padding:3.5rem 1rem; text-align:center; }
//         .pl-empty-icon { font-size:44px; opacity:0.45; margin-bottom:12px; }
//         .pl-empty-title { font-size:16px; font-weight:700; color:#64748b; margin:0 0 6px; }
//         .pl-empty-sub   { font-size:13px; color:#94a3b8; margin:0; }

//         /* Skeleton */
//         .pl-skel {
//           height:16px; border-radius:5px;
//           background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
//           background-size:200% 100%; animation:plSkel 1.4s ease infinite;
//         }
//         @keyframes plSkel{0%{background-position:200%}100%{background-position:-200%}}

//         /* ── Pagination ── */
//         .pl-pagination {
//           display:flex; align-items:center; justify-content:space-between;
//           padding:14px 18px; border-top:1px solid #f1f5f9;
//           background:#fafbff; flex-wrap:wrap; gap:10px;
//         }
//         .pl-pg-info { font-size:12.5px; color:#94a3b8; font-weight:500; }
//         .pl-pg-info span { color:#2563eb; font-weight:700; }
//         .pl-pg-controls { display:flex; align-items:center; gap:4px; }
//         .pl-pg-btn {
//           min-width:34px; height:34px; padding:0 10px;
//           border-radius:9px; border:1.5px solid #e2e8f0;
//           background:#fff; font-family:'Plus Jakarta Sans',sans-serif;
//           font-size:13px; font-weight:600; color:#64748b;
//           cursor:pointer; display:flex; align-items:center; justify-content:center;
//           transition:all 0.18s;
//         }
//         .pl-pg-btn:hover:not(:disabled) { border-color:#3b82f6; color:#2563eb; background:#eff6ff; }
//         .pl-pg-btn.active {
//           background:linear-gradient(135deg,#1e40af,#3b82f6);
//           border-color:transparent; color:#fff;
//           box-shadow:0 3px 10px rgba(37,99,235,0.35);
//         }
//         .pl-pg-btn:disabled { opacity:0.35; cursor:not-allowed; }
//         .pl-pg-dots { font-size:13px; color:#cbd5e1; padding:0 4px; }

//         /* ── Confirm Modal ── */
//         .pl-overlay {
//           position:fixed; inset:0; z-index:9998;
//           background:rgba(15,23,42,0.45); backdrop-filter:blur(6px);
//           display:flex; align-items:center; justify-content:center; padding:1rem;
//           animation:plOverIn 0.2s ease both;
//         }
//         @keyframes plOverIn{from{opacity:0}to{opacity:1}}
//         .pl-modal {
//           background:#fff; border-radius:22px; padding:2rem;
//           max-width:360px; width:100%; text-align:center;
//           box-shadow:0 24px 64px rgba(0,0,0,0.18);
//           animation:plModalIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         @keyframes plModalIn{from{opacity:0;transform:scale(0.88) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
//         .pl-modal-icon { font-size:40px; margin-bottom:12px; }
//         .pl-modal-title { font-size:18px; font-weight:800; color:#0f172a; margin:0 0 8px; }
//         .pl-modal-msg { font-size:13.5px; color:#64748b; margin:0 0 1.5rem; line-height:1.6; }
//         .pl-modal-msg strong { color:#1e293b; }
//         .pl-modal-actions { display:flex; gap:10px; }
//         .pl-modal-cancel {
//           flex:1; padding:12px; border-radius:12px; border:1.5px solid #e2e8f0;
//           background:transparent; font-family:'Plus Jakarta Sans',sans-serif;
//           font-size:14px; font-weight:600; color:#64748b; cursor:pointer; transition:all 0.18s;
//         }
//         .pl-modal-cancel:hover { background:#f8fafc; border-color:#cbd5e1; color:#1e293b; }
//         .pl-modal-confirm {
//           flex:1; padding:12px; border-radius:12px; border:none;
//           background:linear-gradient(135deg,#dc2626,#ef4444);
//           font-family:'Plus Jakarta Sans',sans-serif;
//           font-size:14px; font-weight:700; color:#fff; cursor:pointer; transition:all 0.18s;
//           box-shadow:0 4px 14px rgba(220,38,38,0.35);
//         }
//         .pl-modal-confirm:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(220,38,38,0.45); }
//         .pl-modal-confirm:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

//         /* ── Toast ── */
//         .pl-toast {
//           pointer-events:auto; display:flex; align-items:center; gap:11px;
//           min-width:280px; max-width:360px; padding:12px 15px; border-radius:15px;
//           position:relative; overflow:hidden; box-shadow:0 8px 28px rgba(0,0,0,0.12);
//           animation:plToastIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
//           font-family:'Plus Jakarta Sans',sans-serif;
//         }
//         @keyframes plToastIn{from{opacity:0;transform:translateX(60px) scale(0.9)}to{opacity:1;transform:translateX(0) scale(1)}}
//         .pl-toast-success{background:#f0fdf4;border:1px solid #bbf7d0;}
//         .pl-toast-error  {background:#fff1f2;border:1px solid #fecdd3;}
//         .pl-toast-icon{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex-shrink:0;}
//         .pl-toast-success .pl-toast-icon{background:#dcfce7;color:#16a34a;}
//         .pl-toast-error   .pl-toast-icon{background:#ffe4e6;color:#e11d48;}
//         .pl-toast-body{flex:1;}
//         .pl-toast-title{font-size:13px;font-weight:700;margin:0 0 2px;}
//         .pl-toast-success .pl-toast-title{color:#15803d;}
//         .pl-toast-error   .pl-toast-title{color:#be123c;}
//         .pl-toast-msg{font-size:12px;margin:0;}
//         .pl-toast-success .pl-toast-msg{color:#16a34a;}
//         .pl-toast-error   .pl-toast-msg{color:#e11d48;}
//         .pl-toast-x{background:none;border:none;cursor:pointer;font-size:12px;opacity:0.4;transition:opacity 0.2s;flex-shrink:0;padding:2px;}
//         .pl-toast-x:hover{opacity:0.9;}
//         .pl-toast-bar{position:absolute;bottom:0;left:0;height:3px;animation:plShrink 3.5s linear forwards;}
//         .pl-toast-success .pl-toast-bar{background:#4ade80;}
//         .pl-toast-error   .pl-toast-bar{background:#fb7185;}
//         @keyframes plShrink{from{width:100%}to{width:0%}}
//       `}</style>

//       <ToastPortal toasts={toasts} remove={remove} />

//       {deleteTarget && (
//         <ConfirmModal
//           item={deleteTarget}
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setDeleteTarget(null)}
//           deleting={deleting}
//         />
//       )}

//       <div className="pl-page">

//         {/* Header */}
//         <div className="pl-header">
//           <div className="pl-header-left">
//             <h1>📦 Products</h1>
//             <p>Manage your product inventory</p>
//           </div>
//           <button className="pl-add-btn" onClick={() => navigate("/products/add")}>
//             + Add Product
//           </button>
//         </div>

//         {/* Toolbar */}
//         <div className="pl-toolbar">
//           <div className="pl-search-wrap">
//             <span className="pl-search-icon">🔍</span>
//             <input type="text" className="pl-search"
//               placeholder="Search products…"
//               value={search}
//               onChange={e => handleSearch(e.target.value)} />
//             {search && <button className="pl-search-clear" onClick={() => handleSearch("")}>✕</button>}
//           </div>
//           <div className="pl-stat">
//             <span className="pl-stat-num">{products.length}</span> Total
//           </div>
//           <div className="pl-stat">
//             <span className="pl-stat-num">{filtered.length}</span> Showing
//           </div>
//         </div>

//         {/* Table card */}
//         <div className="pl-card">
//           <div className="pl-stripe" />
//           <div style={{overflowX:"auto"}}>
//             <table className="pl-table">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Product</th>
//                   {/* <th className="center">Unit</th> */}
//                   <th className="center"> Product Code</th>
//                   <th className="center">Price</th>
//                   <th className="center">Stock</th>
//                   <th className="center">GST</th>
//                   <th className="center">Barcode</th>
//                   <th className="center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading
//                   ? [...Array(6)].map((_, i) => (
//                       <tr key={i}>
//                         <td><div className="pl-skel" style={{width:24}} /></td>
//                         <td>
//                           <div className="pl-skel" style={{width:"70%",marginBottom:5}} />
//                           <div className="pl-skel" style={{width:"40%",height:12}} />
//                         </td>
//                         <td className="center"><div className="pl-skel" style={{width:60,margin:"0 auto"}} /></td>
                        
//                         <td className="center"><div className="pl-skel" style={{width:50,margin:"0 auto"}} /></td>
//                         <td className="center"><div className="pl-skel" style={{width:44,margin:"0 auto"}} /></td>
//                         <td className="center"><div className="pl-skel" style={{width:80,height:40,margin:"0 auto"}} /></td>
//                         <td className="center"><div className="pl-skel" style={{width:72,margin:"0 auto"}} /></td>
//                       </tr>
//                     ))
//                   : paginated.length === 0
//                   ? (
//                     <tr>
//                       <td colSpan="7">
//                         <div className="pl-empty">
//                           <div className="pl-empty-icon">📭</div>
//                           <p className="pl-empty-title">No products found</p>
//                           <p className="pl-empty-sub">{search ? `No results for "${search}"` : "Add your first product to get started"}</p>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                   : paginated.map((p, i) => {
//                     const sb = stockBadge(p.stock);
//                     return (
                     
// <tr key={p.id} style={{animationDelay:`${i*0.03}s`}}>

//   {/* INDEX */}

//   <td>
//     <span className="pl-index">
//       {(safePage-1)*ITEMS_PER_PAGE+i+1}
//     </span>
//   </td>

//   {/* PRODUCT */}

//   <td>
//     <div className="pl-prod-name">
//       {p.product_name}
//     </div>

//     <div className="pl-prod-cat">
//       {p.category_name || "No Category"}
//     </div>
//   </td>

//   {/* PRODUCT CODE */}

//   <td className="center">
//     <span className="pl-gst">
//       {p.product_code || "-"}
//     </span>
//   </td>

//   {/* PRICE */}

//   <td className="center">
//     <span className="pl-price">
//       ₹{p.price}
//     </span>
//   </td>

//   {/* STOCK */}

//   <td className="center">
//     <div className="pl-stock-wrap">
//       <span>{p.stock}</span>

//       <span className={sb.cls}>
//         {sb.label}
//       </span>
//     </div>
//   </td>

//   {/* GST */}

//   <td className="center">
//     <span className="pl-gst">
//       {p.gst_percentage}%
//     </span>
//   </td>

//   {/* BARCODE */}

//   <td className="center">

//     <div className="pl-barcode-cell">

//       <Barcode
//         value={p.barcode || "NA"}
//         width={1}
//         height={36}
//         fontSize={0}
//         margin={0}
//       />

//       <span className="pl-barcode-num">
//         {p.barcode || "—"}
//       </span>

//     </div>

//   </td>

//   {/* ACTION */}

//   <td className="center">

//     <div className="pl-actions">

//       <button
//         className="pl-btn-edit"
//         title="Edit"
//         onClick={() =>
//           navigate(`/products/edit/${p.id}`)
//         }
//       >
//         <Pencil size={14} />
//       </button>

//       <button
//         className="pl-btn-del"
//         title="Delete"
//         onClick={() => setDeleteTarget(p)}
//       >
//         <Trash2 size={14} />
//       </button>

//     </div>

//   </td>

// </tr>


//                     );
//                   })
//                 }
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {!loading && filtered.length > ITEMS_PER_PAGE && (
//             <div className="pl-pagination">
//               <p className="pl-pg-info">
//                 Showing <span>{(safePage-1)*ITEMS_PER_PAGE+1}–{Math.min(safePage*ITEMS_PER_PAGE, filtered.length)}</span> of <span>{filtered.length}</span> products
//               </p>
//               <div className="pl-pg-controls">
//                 <button className="pl-pg-btn" disabled={safePage===1} onClick={()=>setCurrentPage(1)} title="First">«</button>
//                 <button className="pl-pg-btn" disabled={safePage===1} onClick={()=>setCurrentPage(p=>p-1)} title="Prev">‹</button>
//                 {getPages().map((pg, idx) =>
//                   pg === "..."
//                     ? <span key={`d${idx}`} className="pl-pg-dots">···</span>
//                     : <button key={pg} className={`pl-pg-btn${safePage===pg?" active":""}`} onClick={()=>setCurrentPage(pg)}>{pg}</button>
//                 )}
//                 <button className="pl-pg-btn" disabled={safePage===totalPages} onClick={()=>setCurrentPage(p=>p+1)} title="Next">›</button>
//                 <button className="pl-pg-btn" disabled={safePage===totalPages} onClick={()=>setCurrentPage(totalPages)} title="Last">»</button>
//               </div>
//             </div>
//           )}
//         </div>

//       </div>
//     </>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Barcode from "react-barcode";
import { Pencil } from "lucide-react";

export default function ProductList() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 10;

  const getCompanyId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return Number(user?.company_id);
  };

  const fetchProducts = async () => {

    setLoading(true);

    try {

      const company_id = getCompanyId();

      if (!company_id) return;

      const res = await api.get(
        `/product/get.php?company_id=${company_id}`
      );

      if (res.data.status) {
        setProducts(res.data.data);
      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* TOGGLE STATUS */

  const toggleStatus = async (product) => {

    const newStatus =
      product.status === "active"
        ? "inactive"
        : "active";

    try {

      const res = await api.post(
        "/product/toggle_status_product.php",
        {
          id: product.id,
          status: newStatus,
        }
      );

      if (res.data.success) {

        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, status: newStatus }
              : p
          )
        );

      } else {

        alert(res.data.message);

      }

    } catch (err) {

      console.error(err);
      alert("Server Error");

    }
  };

  /* SEARCH */

  const filtered = products.filter((p) =>
    p.product_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const stockBadge = (stock) => {

    if (stock <= 0) {
      return {
        cls: "pl-badge-out",
        label: "Out",
      };
    }

    if (stock <= 10) {
      return {
        cls: "pl-badge-low",
        label: "Low",
      };
    }

    return {
      cls: "pl-badge-ok",
      label: "OK",
    };
  };

  return (
    <>
      <style>{`

      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .pl-page{
        font-family:'Plus Jakarta Sans',sans-serif;
        min-height:100vh;
        background:#f0f4ff;
        padding:2rem;
      }

      .pl-header{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:1.5rem;
        flex-wrap:wrap;
        gap:12px;
      }

      .pl-header-left h1{
        font-size:22px;
        font-weight:800;
        margin:0;
        color:#0f172a;
      }

      .pl-header-left p{
        font-size:13px;
        color:#94a3b8;
        margin-top:4px;
      }

      .pl-add-btn{
        padding:11px 20px;
        border:none;
        border-radius:12px;
        background:linear-gradient(135deg,#1e40af,#3b82f6);
        color:#fff;
        font-weight:700;
        cursor:pointer;
        box-shadow:0 4px 14px rgba(37,99,235,0.35);
      }

      .pl-toolbar{
        display:flex;
        gap:12px;
        margin-bottom:1.25rem;
        flex-wrap:wrap;
      }

      .pl-search{
        flex:1;
        min-width:220px;
        padding:12px 14px;
        border-radius:12px;
        border:1.5px solid #e2e8f0;
        background:#fff;
        font-size:14px;
      }

      .pl-card{
        background:#fff;
        border-radius:20px;
        overflow:hidden;
        border:1px solid #e2e8f0;
        box-shadow:0 4px 24px rgba(37,99,235,0.08);
      }

      .pl-table{
        width:100%;
        border-collapse:collapse;
      }

      .pl-table thead{
        background:linear-gradient(135deg,#1e40af,#2563eb);
      }

      .pl-table th{
        padding:14px;
        font-size:11px;
        text-transform:uppercase;
        color:#fff;
        text-align:left;
      }

      .pl-table th.center{
        text-align:center;
      }

      .pl-table td{
        padding:14px;
        border-bottom:1px solid #f1f5f9;
        font-size:14px;
      }

      .pl-table td.center{
        text-align:center;
      }

      .pl-index{
        width:26px;
        height:26px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        border-radius:8px;
        background:#eff6ff;
        color:#2563eb;
        font-size:12px;
        font-weight:700;
      }

      .pl-prod-name{
        font-weight:700;
        color:#0f172a;
      }

      .pl-prod-cat{
        font-size:12px;
        color:#94a3b8;
        margin-top:4px;
      }

      .pl-price{
        font-weight:700;
      }

      .pl-gst{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:4px 10px;
        border-radius:999px;
        font-size:11px;
        font-weight:700;
      }

      .pl-status-active{
        background:#dcfce7;
        color:#15803d;
        border:1px solid #bbf7d0;
      }

      .pl-status-inactive{
        background:#f1f5f9;
        color:#64748b;
        border:1px solid #e2e8f0;
      }

      .pl-stock-wrap{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:6px;
      }

      .pl-badge-ok{
        padding:3px 9px;
        border-radius:999px;
        background:#dcfce7;
        color:#15803d;
        font-size:11px;
        font-weight:700;
      }

      .pl-badge-low{
        padding:3px 9px;
        border-radius:999px;
        background:#fef9c3;
        color:#854d0e;
        font-size:11px;
        font-weight:700;
      }

      .pl-badge-out{
        padding:3px 9px;
        border-radius:999px;
        background:#ffe4e6;
        color:#be123c;
        font-size:11px;
        font-weight:700;
      }

      .pl-actions{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:10px;
      }

      .pl-btn-edit{
        width:34px;
        height:34px;
        border:none;
        border-radius:10px;
        background:#eff6ff;
        color:#2563eb;
        cursor:pointer;
      }

      .pl-switch{
        position:relative;
        display:inline-block;
        width:46px;
        height:24px;
      }

      .pl-switch input{
        opacity:0;
        width:0;
        height:0;
      }

      .pl-slider{
        position:absolute;
        cursor:pointer;
        inset:0;
        background:#d1d5db;
        transition:.4s;
        border-radius:999px;
      }

      .pl-slider:before{
        position:absolute;
        content:"";
        height:18px;
        width:18px;
        left:3px;
        top:3px;
        background:white;
        transition:.4s;
        border-radius:50%;
        box-shadow:0 2px 6px rgba(0,0,0,0.25);
      }

      .pl-switch input:checked + .pl-slider{
        background:linear-gradient(135deg,#1d4ed8,#3b82f6);
      }

      .pl-switch input:checked + .pl-slider:before{
        transform:translateX(22px);
      }

      .pl-barcode-cell{
        display:flex;
        flex-direction:column;
        align-items:center;
      }

      .pl-barcode-num{
        font-size:10px;
        color:#94a3b8;
        margin-top:4px;
      }

      `}</style>

      <div className="pl-page">

        {/* HEADER */}

        <div className="pl-header">

          <div className="pl-header-left">
            <h1>📦 Products</h1>
            <p>Manage your product inventory</p>
          </div>

          <button
            className="pl-add-btn"
            onClick={() => navigate("/products/add")}
          >
            + Add Product
          </button>

        </div>

        {/* SEARCH */}

        <div className="pl-toolbar">

          <input
            className="pl-search"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* TABLE */}

        <div className="pl-card">

          <table className="pl-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th className="center">Code</th>
                <th className="center">Price</th>
                <th className="center">Stock</th>
                <th className="center">GST</th>
                <th className="center">Barcode</th>
                <th className="center">Actions</th>
                <th className="center">Status</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="9">
                    Loading...
                  </td>
                </tr>

              ) : paginated.length === 0 ? (

                <tr>
                  <td colSpan="9">
                    No Products Found
                  </td>
                </tr>

              ) : (

                paginated.map((p, i) => {

                  const sb = stockBadge(p.stock);

                  return (

                    <tr key={p.id}>

                      <td>
                        <span className="pl-index">
                          {(safePage - 1) *
                            ITEMS_PER_PAGE +
                            i +
                            1}
                        </span>
                      </td>

                      <td>

                        <div className="pl-prod-name">
                          {p.product_name}
                        </div>

                        <div className="pl-prod-cat">
                          {p.category_name ||
                            "No Category"}
                        </div>

                      </td>

                      <td className="center">

                        <span className="pl-gst pl-status-active">
                          {p.product_code || "-"}
                        </span>

                      </td>

                      <td className="center">

                        <span className="pl-price">
                          ₹{p.price}
                        </span>

                      </td>

                      <td className="center">

                        <div className="pl-stock-wrap">

                          <span>
                            {p.stock}
                          </span>

                          <span className={sb.cls}>
                            {sb.label}
                          </span>

                        </div>

                      </td>

                      <td className="center">

                        <span className="pl-gst pl-status-active">
                          {p.gst_percentage}%
                        </span>

                      </td>

                      <td className="center">

                        <div className="pl-barcode-cell">

                          <Barcode
                            value={p.barcode || "NA"}
                            width={1}
                            height={36}
                            fontSize={0}
                            margin={0}
                          />

                          <span className="pl-barcode-num">
                            {p.barcode || "-"}
                          </span>

                        </div>

                      </td>

                      {/* ACTION */}

                      <td className="center">

                        <div className="pl-actions">

                          <button
                            className="pl-btn-edit"
                            onClick={() =>
                              navigate(
                                `/products/edit/${p.id}`
                              )
                            }
                          >
                            <Pencil size={15} />
                          </button>

                          <label className="pl-switch">

                            <input
                              type="checkbox"
                              checked={
                                p.status === "active"
                              }
                              onChange={() =>
                                toggleStatus(p)
                              }
                            />

                            <span className="pl-slider"></span>

                          </label>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="center">

                        <span
                          className={`pl-gst ${
                            p.status === "active"
                              ? "pl-status-active"
                              : "pl-status-inactive"
                          }`}
                        >
                          {p.status}
                        </span>

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}