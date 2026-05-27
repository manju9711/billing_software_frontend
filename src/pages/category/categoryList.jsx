

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
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
//         <div key={t.id} className={`cl-toast cl-toast-${t.type}`}>
//           <div className="cl-toast-icon">{t.type==="success"?"✓":t.type==="error"?"✕":"!"}</div>
//           <div className="cl-toast-body">
//             <p className="cl-toast-title">{t.title}</p>
//             {t.msg && <p className="cl-toast-msg">{t.msg}</p>}
//           </div>
//           <button className="cl-toast-x" style={{pointerEvents:"auto"}} onClick={()=>remove(t.id)}>✕</button>
//           <div className="cl-toast-bar" />
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ─── Confirm Modal ──────────────────────────────────────── */
// function ConfirmModal({ item, onConfirm, onCancel }) {
//   return (
//     <div className="cl-overlay">
//       <div className="cl-modal">
//         <div className="cl-modal-icon">🗑️</div>
//         <h3 className="cl-modal-title">Delete Category?</h3>
//         <p className="cl-modal-msg">
//           You're about to delete <strong>"{item.name}"</strong>.<br />
//           This action cannot be undone.
//         </p>
//         <div className="cl-modal-actions">
//           <button className="cl-modal-cancel" onClick={onCancel}>Cancel</button>
//           <button className="cl-modal-confirm" onClick={onConfirm}>Yes, Delete</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── Main Component ─────────────────────────────────────── */
// export default function CategoryList() {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const { toasts, show, remove } = useToast();

//   const getCompanyId = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return Number(user?.company_id);
//   };

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const company_id = getCompanyId();
//       if (!company_id) return;
//       const res = await api.get(`/category/get_all.php?company_id=${company_id}`);
//       if (res.data.status) setCategories(res.data.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       show("error", "Fetch failed", "Could not load categories.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCategories(); }, []);

//   const filtered = categories.filter(c =>
//     c.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleDeleteConfirm = async () => {
//     setDeleting(true);
//     try {
//       const res = await api.post("/category/delete.php", { id: deleteTarget.id });
//       if (res.data.status) {
//         show("success", "Deleted!", `"${deleteTarget.name}" has been removed.`);
//         fetchCategories();
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

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//         .cl-page {
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           min-height: 100vh;
//           background: #f0f4ff;
//           padding: 2rem;
//         }

//         /* ── Header ── */
//         .cl-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-bottom: 1.5rem;
//           flex-wrap: wrap;
//           gap: 12px;
//         }
//         .cl-header-left h1 {
//           font-size: 22px;
//           font-weight: 800;
//           color: #0f172a;
//           margin: 0 0 3px;
//           letter-spacing: -0.4px;
//         }
//         .cl-header-left p {
//           font-size: 12.5px;
//           color: #94a3b8;
//           margin: 0;
//           font-weight: 400;
//         }
//         .cl-add-btn {
//           display: flex; align-items: center; gap: 8px;
//           padding: 11px 20px;
//           border-radius: 12px;
//           border: none;
//           cursor: pointer;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           font-size: 13.5px;
//           font-weight: 700;
//           background: linear-gradient(135deg, #1e40af, #3b82f6);
//           color: #fff;
//           box-shadow: 0 4px 16px rgba(37,99,235,0.35);
//           transition: all 0.22s;
//           position: relative; overflow: hidden;
//         }
//         .cl-add-btn::after {
//           content:''; position:absolute; inset:0;
//           background: linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 60%);
//           pointer-events:none;
//         }
//         .cl-add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(37,99,235,0.42); }
//         .cl-add-btn:active { transform:translateY(0); }

//         /* ── Search bar ── */
//         .cl-search-wrap {
//           position: relative;
//           margin-bottom: 1.25rem;
//         }
//         .cl-search-icon {
//           position: absolute;
//           left: 14px; top: 50%;
//           transform: translateY(-50%);
//           font-size: 16px;
//           color: #94a3b8;
//           pointer-events: none;
//         }
//         .cl-search {
//           width: 100%;
//           padding: 12px 16px 12px 44px;
//           border-radius: 13px;
//           border: 1.5px solid #e2e8f0;
//           background: #fff;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           font-size: 14px;
//           color: #1e293b;
//           outline: none;
//           box-sizing: border-box;
//           transition: all 0.22s;
//           box-shadow: 0 1px 4px rgba(0,0,0,0.04);
//         }
//         .cl-search::placeholder { color: #c4cdd6; }
//         .cl-search:focus {
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
//         }
//         .cl-search-clear {
//           position: absolute;
//           right: 12px; top: 50%;
//           transform: translateY(-50%);
//           background: #e2e8f0;
//           border: none;
//           border-radius: 50%;
//           width: 22px; height: 22px;
//           cursor: pointer;
//           font-size: 11px;
//           color: #64748b;
//           display: flex; align-items:center; justify-content:center;
//           transition: all 0.15s;
//         }
//         .cl-search-clear:hover { background: #cbd5e1; }

//         /* ── Stats row ── */
//         .cl-stats {
//           display: flex;
//           gap: 10px;
//           margin-bottom: 1.25rem;
//           flex-wrap: wrap;
//         }
//         .cl-stat {
//           background: #fff;
//           border: 1px solid #e2e8f0;
//           border-radius: 12px;
//           padding: 10px 16px;
//           display: flex; align-items: center; gap: 8px;
//           font-size: 13px;
//           font-weight: 600;
//           color: #475569;
//           box-shadow: 0 1px 4px rgba(0,0,0,0.04);
//         }
//         .cl-stat-num {
//           font-size: 17px;
//           font-weight: 800;
//           color: #2563eb;
//         }

//         /* ── Table card ── */
//         .cl-card {
//           background: #fff;
//           border-radius: 18px;
//           border: 1px solid #e8edf5;
//           box-shadow: 0 2px 16px rgba(37,99,235,0.07), 0 1px 4px rgba(0,0,0,0.04);
//           overflow: hidden;
//           animation: clFadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         @keyframes clFadeUp {
//           from { opacity:0; transform:translateY(16px); }
//           to   { opacity:1; transform:translateY(0); }
//         }

//         /* Accent stripe */
//         .cl-stripe {
//           height: 4px;
//           background: linear-gradient(90deg, #1d4ed8, #6366f1, #3b82f6, #1d4ed8);
//           background-size: 200%;
//           animation: clStripe 3s linear infinite;
//         }
//         @keyframes clStripe { 0%{background-position:0%} 100%{background-position:200%} }

//         /* Table */
//         .cl-table { width: 100%; border-collapse: collapse; }
//         .cl-table thead tr {
//           background: #f8faff;
//           border-bottom: 1.5px solid #e8edf5;
//         }
//         .cl-table th {
//           padding: 13px 18px;
//           font-size: 11px;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           color: #94a3b8;
//           text-align: left;
//         }
//         .cl-table th.center { text-align: center; }
//         .cl-table tbody tr {
//           border-bottom: 1px solid #f1f5f9;
//           transition: background 0.15s;
//           animation: clRowIn 0.3s ease both;
//         }
//         .cl-table tbody tr:last-child { border-bottom: none; }
//         .cl-table tbody tr:hover { background: #f8faff; }
//         @keyframes clRowIn {
//           from { opacity:0; transform:translateX(-8px); }
//           to   { opacity:1; transform:translateX(0); }
//         }
//         .cl-table td { padding: 13px 18px; font-size: 14px; color: #1e293b; }
//         .cl-table td.center { text-align: center; }

//         /* Row index badge */
//         .cl-index {
//           display: inline-flex;
//           align-items: center; justify-content: center;
//           width: 26px; height: 26px;
//           border-radius: 8px;
//           background: #eff6ff;
//           color: #3b82f6;
//           font-size: 11.5px;
//           font-weight: 700;
//           margin-right: 10px;
//         }

//         /* Category name tag */
//         .cl-name-tag {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-weight: 600;
//           font-size: 14px;
//           color: #0f172a;
//         }
//         .cl-name-dot {
//           width: 7px; height: 7px;
//           border-radius: 50%;
//           background: linear-gradient(135deg,#3b82f6,#6366f1);
//           flex-shrink: 0;
//         }

//         /* Action buttons */
//         .cl-actions { display: flex; align-items: center; justify-content: center; gap: 8px; }
//         .cl-btn-edit, .cl-btn-del {
//           width: 34px; height: 34px;
//           border-radius: 10px;
//           border: 1.5px solid;
//           display: flex; align-items:center; justify-content:center;
//           cursor: pointer;
//           transition: all 0.18s;
//           background: transparent;
//         }
//         .cl-btn-edit {
//           border-color: #bfdbfe;
//           color: #2563eb;
//         }
//         .cl-btn-edit:hover { background: #2563eb; color: #fff; border-color: #2563eb; transform: scale(1.08); }
//         .cl-btn-del {
//           border-color: #fecaca;
//           color: #ef4444;
//         }
//         .cl-btn-del:hover { background: #ef4444; color: #fff; border-color: #ef4444; transform: scale(1.08); }

//         /* Empty state */
//         .cl-empty {
//           padding: 3rem 1rem;
//           text-align: center;
//         }
//         .cl-empty-icon {
//           font-size: 42px;
//           margin-bottom: 12px;
//           opacity: 0.5;
//         }
//         .cl-empty-title {
//           font-size: 16px;
//           font-weight: 700;
//           color: #64748b;
//           margin: 0 0 6px;
//         }
//         .cl-empty-sub {
//           font-size: 13px;
//           color: #94a3b8;
//           margin: 0;
//         }

//         /* Skeleton loader */
//         .cl-skeleton {
//           height: 20px;
//           border-radius: 6px;
//           background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
//           background-size: 200% 100%;
//           animation: clSkel 1.4s ease infinite;
//         }
//         @keyframes clSkel { 0%{background-position:200%} 100%{background-position:-200%} }

//         /* ── Confirm Modal ── */
//         .cl-overlay {
//           position: fixed; inset: 0; z-index: 9998;
//           background: rgba(15,23,42,0.45);
//           backdrop-filter: blur(6px);
//           display: flex; align-items: center; justify-content: center;
//           padding: 1rem;
//           animation: clOverIn 0.2s ease both;
//         }
//         @keyframes clOverIn { from{opacity:0} to{opacity:1} }
//         .cl-modal {
//           background: #fff;
//           border-radius: 22px;
//           padding: 2rem;
//           max-width: 360px;
//           width: 100%;
//           text-align: center;
//           box-shadow: 0 24px 64px rgba(0,0,0,0.18);
//           animation: clModalIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         @keyframes clModalIn {
//           from{opacity:0;transform:scale(0.88) translateY(20px)}
//           to{opacity:1;transform:scale(1) translateY(0)}
//         }
//         .cl-modal-icon { font-size: 40px; margin-bottom: 12px; }
//         .cl-modal-title {
//           font-size: 18px; font-weight: 800;
//           color: #0f172a; margin: 0 0 8px;
//         }
//         .cl-modal-msg {
//           font-size: 13.5px; color: #64748b;
//           margin: 0 0 1.5rem; line-height: 1.6;
//         }
//         .cl-modal-msg strong { color: #1e293b; }
//         .cl-modal-actions { display: flex; gap: 10px; }
//         .cl-modal-cancel {
//           flex: 1; padding: 12px;
//           border-radius: 12px; border: 1.5px solid #e2e8f0;
//           background: transparent;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           font-size: 14px; font-weight: 600; color: #64748b;
//           cursor: pointer; transition: all 0.18s;
//         }
//         .cl-modal-cancel:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
//         .cl-modal-confirm {
//           flex: 1; padding: 12px;
//           border-radius: 12px; border: none;
//           background: linear-gradient(135deg, #dc2626, #ef4444);
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           font-size: 14px; font-weight: 700; color: #fff;
//           cursor: pointer; transition: all 0.18s;
//           box-shadow: 0 4px 14px rgba(220,38,38,0.35);
//         }
//         .cl-modal-confirm:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(220,38,38,0.45); }
//         .cl-modal-confirm:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

//         /* ── Toast ── */
//         .cl-toast {
//           pointer-events: auto;
//           display: flex; align-items: center; gap: 11px;
//           min-width: 280px; max-width: 360px;
//           padding: 12px 15px;
//           border-radius: 15px;
//           position: relative; overflow: hidden;
//           box-shadow: 0 8px 28px rgba(0,0,0,0.12);
//           animation: clToastIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//         }
//         @keyframes clToastIn {
//           from{opacity:0;transform:translateX(60px) scale(0.9)}
//           to{opacity:1;transform:translateX(0) scale(1)}
//         }
//         .cl-toast-success { background:#f0fdf4; border:1px solid #bbf7d0; }
//         .cl-toast-error   { background:#fff1f2; border:1px solid #fecdd3; }
//         .cl-toast-icon {
//           width:30px; height:30px; border-radius:9px;
//           display:flex; align-items:center; justify-content:center;
//           font-size:14px; font-weight:800; flex-shrink:0;
//         }
//         .cl-toast-success .cl-toast-icon { background:#dcfce7; color:#16a34a; }
//         .cl-toast-error   .cl-toast-icon { background:#ffe4e6; color:#e11d48; }
//         .cl-toast-body { flex:1; }
//         .cl-toast-title { font-size:13px; font-weight:700; margin:0 0 2px; }
//         .cl-toast-success .cl-toast-title { color:#15803d; }
//         .cl-toast-error   .cl-toast-title { color:#be123c; }
//         .cl-toast-msg { font-size:12px; margin:0; }
//         .cl-toast-success .cl-toast-msg { color:#16a34a; }
//         .cl-toast-error   .cl-toast-msg { color:#e11d48; }
//         .cl-toast-x { background:none; border:none; cursor:pointer; font-size:12px; opacity:0.4; transition:opacity 0.2s; flex-shrink:0; padding:2px; }
//         .cl-toast-x:hover { opacity:0.9; }
//         .cl-toast-bar {
//           position:absolute; bottom:0; left:0; height:3px;
//           animation: clShrink 3.5s linear forwards;
//         }
//         .cl-toast-success .cl-toast-bar { background:#4ade80; }
//         .cl-toast-error   .cl-toast-bar { background:#fb7185; }
//         @keyframes clShrink { from{width:100%} to{width:0%} }
//       `}</style>

//       <ToastPortal toasts={toasts} remove={remove} />

//       {deleteTarget && (
//         <ConfirmModal
//           item={deleteTarget}
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setDeleteTarget(null)}
//         />
//       )}

//       <div className="cl-page">

//         {/* Header */}
//         <div className="cl-header">
//           <div className="cl-header-left">
//             <h1>🏷️ Categories</h1>
//             <p>Manage your product categories</p>
//           </div>
//           <button className="cl-add-btn" onClick={() => navigate("/category/add")}>
//             + Add Category
//           </button>
//         </div>

//         {/* Stats */}
//         {/* <div className="cl-stats">
//           <div className="cl-stat">
//             <span className="cl-stat-num">{categories.length}</span> Total
//           </div>
//           <div className="cl-stat">
//             <span className="cl-stat-num">{filtered.length}</span> Showing
//           </div>
//         </div> */}

//         {/* Search */}
//         <div className="cl-search-wrap">
//           <span className="cl-search-icon">🔍</span>
//           <input
//             type="text"
//             className="cl-search"
//             placeholder="Search categories…"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//           {search && (
//             <button className="cl-search-clear" onClick={() => setSearch("")}>✕</button>
//           )}
//         </div>

//         {/* Table card */}
//         <div className="cl-card">
//           <div className="cl-stripe" />
//           <table className="cl-table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th className="center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading
//                 ? [...Array(4)].map((_, i) => (
//                     <tr key={i}>
//                       <td><div className="cl-skeleton" style={{width:26}} /></td>
//                       <td><div className="cl-skeleton" style={{width:`${120+i*30}px`}} /></td>
//                       <td className="center"><div className="cl-skeleton" style={{width:80,margin:"0 auto"}} /></td>
//                     </tr>
//                   ))
//                 : filtered.length === 0
//                 ? (
//                     <tr>
//                       <td colSpan="3">
//                         <div className="cl-empty">
//                           <div className="cl-empty-icon">📭</div>
//                           <p className="cl-empty-title">No categories found</p>
//                           <p className="cl-empty-sub">{search ? `No results for "${search}"` : "Add your first category to get started"}</p>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 : filtered.map((c, i) => (
//                     <tr key={c.id} style={{ animationDelay: `${i * 0.04}s` }}>
//                       <td><span className="cl-index">{i + 1}</span></td>
//                       <td>
//                         <div className="cl-name-tag">
//                           <span className="cl-name-dot" />
//                           {c.name}
//                         </div>
//                       </td>
//                       <td className="center">
//                         <div className="cl-actions">
//                           <button className="cl-btn-edit" title="Edit" onClick={() => navigate(`/category/edit/${c.id}`)}>
//                             <Pencil size={15} />
//                           </button>
//                           <button className="cl-btn-del" title="Delete" onClick={() => setDeleteTarget(c)}>
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//               }
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Pencil } from "lucide-react";

export default function CategoryList() {

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getCompanyId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return Number(user?.company_id);
  };

  const fetchCategories = async () => {

    setLoading(true);

    try {

      const company_id = getCompanyId();

      if (!company_id) return;

      const res = await api.get(
        `/category/get_all.php?company_id=${company_id}`
      );

      if (res.data.status) {
        setCategories(res.data.data);
      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleStatus = async (category) => {

    const newStatus =
      category.status === "active"
        ? "inactive"
        : "active";

    try {

      const res = await api.post(
        "/category/toggle_category_status.php",
        {
          id: category.id,
          status: newStatus,
        }
      );

      if (res.data.success) {

        setCategories((prev) =>
          prev.map((c) =>
            c.id === category.id
              ? { ...c, status: newStatus }
              : c
          )
        );

      } else {

        alert(res.data.message);

      }

    } catch (err) {

      console.error(err);
      alert("Server error");

    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .cl-page{
          font-family:'Plus Jakarta Sans',sans-serif;
          min-height:100vh;
          background:#f0f4ff;
          padding:2rem;
        }

        .cl-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:1.5rem;
          flex-wrap:wrap;
          gap:12px;
        }

        .cl-header h1{
          margin:0;
          font-size:24px;
          font-weight:800;
          color:#0f172a;
        }

        .cl-header p{
          margin-top:4px;
          color:#64748b;
          font-size:13px;
        }

        .cl-add-btn{
          padding:11px 20px;
          border:none;
          border-radius:12px;
          background:linear-gradient(135deg,#1d4ed8,#3b82f6);
          color:#fff;
          font-size:14px;
          font-weight:700;
          cursor:pointer;
          box-shadow:0 4px 16px rgba(37,99,235,0.35);
        }

        .cl-search-wrap{
          position:relative;
          margin-bottom:1.5rem;
        }

        .cl-search{
          width:100%;
          padding:12px 16px;
          border-radius:12px;
          border:1.5px solid #e2e8f0;
          font-size:14px;
          outline:none;
          box-sizing:border-box;
        }

        .cl-card{
          background:#fff;
          border-radius:20px;
          overflow:hidden;
          border:1px solid #e2e8f0;
          box-shadow:0 4px 24px rgba(37,99,235,0.08);
        }

        .cl-table{
          width:100%;
          border-collapse:collapse;
        }

        .cl-table thead{
          background:linear-gradient(135deg,#1d4ed8,#3b82f6);
        }

        .cl-table th{
          padding:15px;
          font-size:11px;
          font-weight:700;
          color:#fff;
          text-transform:uppercase;
          letter-spacing:0.08em;
          text-align:left;
        }

        .cl-table th.center{
          text-align:center;
        }

        .cl-table td{
          padding:15px;
          border-bottom:1px solid #f1f5f9;
          font-size:14px;
        }

        .cl-index{
          width:28px;
          height:28px;
          border-radius:999px;
          background:#f1f5f9;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:12px;
          font-weight:700;
          color:#64748b;
        }

        .cl-name{
          font-weight:700;
          color:#0f172a;
        }

        .cl-actions{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
        }

        .cl-btn-edit{
          width:34px;
          height:34px;
          border:none;
          border-radius:10px;
          background:#eff6ff;
          color:#2563eb;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
        }

        .cl-btn-edit:hover{
          background:#dbeafe;
        }

        .cl-switch {
          position: relative;
          display: inline-block;
          width: 45px;
          height: 20px;
        }

        .cl-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .cl-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background: #d1d5db;
          transition: 0.4s;
          border-radius: 999px;
        }

        .cl-slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 15px;
          left: 3px;
          top: 3px;
          background: white;
          transition: 0.4s;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }

        .cl-switch input:checked + .cl-slider {
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
        }

        .cl-switch input:checked + .cl-slider:before {
          transform: translateX(24px);
        }

        .cl-status{
          display:inline-block;
          padding:5px 12px;
          border-radius:999px;
          font-size:12px;
          font-weight:700;
        }

        .cl-status.active{
          background:#eff6ff;
          color:#2563eb;
          border:1px solid #bfdbfe;
        }

        .cl-status.inactive{
          background:#f8fafc;
          color:#64748b;
          border:1px solid #e2e8f0;
        }

        .cl-empty{
          padding:3rem;
          text-align:center;
          color:#94a3b8;
        }

      `}</style>

      <div className="cl-page">

        {/* Header */}
        <div className="cl-header">

          <div>
            <h1>🏷️ Categories</h1>
            <p>Manage your product categories</p>
          </div>

          <button
            className="cl-add-btn"
            onClick={() => navigate("/category/add")}
          >
            + Add Category
          </button>

        </div>

        {/* Search */}
        <div className="cl-search-wrap">

          <input
            type="text"
            className="cl-search"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Table */}
        <div className="cl-card">

          <table className="cl-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th className="center">Actions</th>
                <th className="center">Status</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="4" className="cl-empty">
                    Loading...
                  </td>
                </tr>

              ) : filtered.length === 0 ? (

                <tr>
                  <td colSpan="4" className="cl-empty">
                    No categories found
                  </td>
                </tr>

              ) : (

                filtered.map((c, i) => (

                  <tr key={c.id}>

                    <td>
                      <div className="cl-index">
                        {i + 1}
                      </div>
                    </td>

                    <td>
                      <div className="cl-name">
                        {c.name}
                      </div>
                    </td>

                    <td>

                      <div className="cl-actions">

                        <button
                          className="cl-btn-edit"
                          onClick={() =>
                            navigate(`/category/edit/${c.id}`)
                          }
                        >
                          <Pencil size={15} />
                        </button>

                        <label className="cl-switch">

                          <input
                            type="checkbox"
                            checked={c.status === "active"}
                            onChange={() => toggleStatus(c)}
                          />

                          <span className="cl-slider"></span>

                        </label>

                      </div>

                    </td>

                    <td className="center">

                      <span
                        className={`cl-status ${c.status}`}
                      >
                        {c.status}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}