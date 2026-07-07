import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../services/api";
import TablePagination from "../../components/TablePagination";
import Barcode from "react-barcode";
import { Pencil, ArrowLeft, Plus } from "lucide-react";

export default function SupplierProductList() {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const location = useLocation();
  const supplierName = location.state?.supplierName || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);

  const DEFAULT_PAGE_SIZE = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/product/get_by_supplier.php?supplier_id=${supplierId}`
      );
      if (res.data.status) setProducts(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) fetchProducts();
  }, [supplierId]);

  const filtered = products.filter((p) =>
    p.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const stockBadge = (stock) => {
    if (stock <= 0) return { cls: "pl-badge-out", label: "Out" };
    if (stock <= 10) return { cls: "pl-badge-low", label: "Low" };
    return { cls: "pl-badge-ok", label: "OK" };
  };

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      .pl-page{font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;background:#f0f4ff;padding:2rem;}
      .pl-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:12px;}
      .pl-header-left{display:flex;align-items:center;gap:12px;}
      .pl-back-btn{width:38px;height:38px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;}
      .pl-header-left h1{font-size:22px;font-weight:800;margin:0;color:#0f172a;}
      .pl-header-left p{font-size:13px;color:#94a3b8;margin-top:4px;}
      .pl-add-btn{display:flex;align-items:center;gap:6px;padding:10px 18px;border:none;border-radius:12px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(37,99,235,0.35);}
      .pl-toolbar{display:flex;gap:12px;margin-bottom:1.25rem;flex-wrap:wrap;}
      .pl-search{flex:1;min-width:220px;padding:12px 14px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:14px;}
      .pl-card{background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(37,99,235,0.08);}
      .pl-table{width:100%;border-collapse:collapse;}
      .pl-table thead{background:linear-gradient(135deg,#1e40af,#2563eb);}
      .pl-table th{padding:14px;font-size:11px;text-transform:uppercase;color:#fff;text-align:left;}
      .pl-table th.center{text-align:center;}
      .pl-table td{padding:14px;border-bottom:1px solid #f1f5f9;font-size:14px;}
      .pl-table td.center{text-align:center;}
      .pl-index{width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:#eff6ff;color:#2563eb;font-size:12px;font-weight:700;}
      .pl-prod-name{font-weight:700;color:#0f172a;}
      .pl-prod-cat{font-size:12px;color:#94a3b8;margin-top:4px;}
      .pl-price{font-weight:700;}
      .pl-gst{display:inline-flex;align-items:center;justify-content:center;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;}
      .pl-status-active{background:#dcfce7;color:#15803d;border:1px solid #bbf7d0;}
      .pl-stock-wrap{display:flex;align-items:center;justify-content:center;gap:6px;}
      .pl-badge-ok{padding:3px 9px;border-radius:999px;background:#dcfce7;color:#15803d;font-size:11px;font-weight:700;}
      .pl-badge-low{padding:3px 9px;border-radius:999px;background:#fef9c3;color:#854d0e;font-size:11px;font-weight:700;}
      .pl-badge-out{padding:3px 9px;border-radius:999px;background:#ffe4e6;color:#be123c;font-size:11px;font-weight:700;}
      .pl-btn-edit{width:34px;height:34px;border:none;border-radius:10px;background:#eff6ff;color:#2563eb;cursor:pointer;}
      .pl-barcode-cell{display:flex;flex-direction:column;align-items:center;}
      .pl-barcode-num{font-size:10px;color:#94a3b8;margin-top:4px;}
      `}</style>

      <div className="pl-page">
       <div className="pl-header">
          <div className="pl-header-left">
            <button className="pl-back-btn" onClick={() => navigate("/supplier")}>
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1>📦 {supplierName ? `${supplierName}'s Products` : "Supplier Products"}</h1>
              <p>Products added by this supplier</p>
            </div>
          </div>

          <button
            className="pl-add-btn"
            onClick={() =>
              navigate(`/supplier/${supplierId}/add-product`, {
                state: { supplierName },
              })
            }
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="pl-toolbar">
          <input
            className="pl-search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="pl-card">
          <div style={{ padding: "16px 20px 0" }}>
            <TablePagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              onPageChange={setCurrentPage}
              itemLabel="products"
              position="top"
            />
          </div>
          <table className="pl-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th className="center">Company</th>
                <th className="center">HSN Code</th>
                <th className="center">Price</th>
                <th className="center">Stock</th>
                <th className="center">GST</th>
                <th className="center">Barcode</th>
                <th className="center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9">Loading…</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="9">No Products Found</td></tr>
              ) : (
                paginated.map((p, i) => {
                  const sb = stockBadge(p.stock);
                  return (
                    <tr key={p.id}>
                      <td><span className="pl-index">{(safePage - 1) * pageSize + i + 1}</span></td>
                      <td>
                        <div className="pl-prod-name">{p.product_name}</div>
                        <div className="pl-prod-cat">{p.category_name || "No Category"}</div>
                      </td>
                      <td className="center">{p.company_name || "-"}</td>
                      <td className="center"><span className="pl-gst pl-status-active">{p.product_code || "-"}</span></td>
                      <td className="center"><span className="pl-price">₹{p.price}</span></td>
                      <td className="center">
                        <div className="pl-stock-wrap">
                          <span>{p.stock}</span>
                          <span className={sb.cls}>{sb.label}</span>
                        </div>
                      </td>
                      <td className="center"><span className="pl-gst pl-status-active">{p.gst_percentage}%</span></td>
                      <td className="center">
                        <div className="pl-barcode-cell">
                          <Barcode value={p.barcode || "NA"} width={1} height={36} fontSize={0} margin={0} />
                          <span className="pl-barcode-num">{p.barcode || "-"}</span>
                        </div>
                      </td>
                      <td className="center">
                        <button
                          className="pl-btn-edit"
                          onClick={() => navigate(`/supplier/${supplierId}/products/edit/${p.id}`, { state: { supplierName } })}
                        >
                          <Pencil size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && filtered.length > 0 && (
            <TablePagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              onPageChange={setCurrentPage}
              itemLabel="products"
            />
          )}
        </div>
      </div>
    </>
  );
}