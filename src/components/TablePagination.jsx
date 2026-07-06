import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageSizeChange,
  onPageChange,
  itemLabel = "items",
  position = "bottom",
  showEntriesLabel = "Show entries",
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}) {
  if (position === "top") {
    return (
      <div style={{ marginBottom: 14, display: "flex", justifyContent: "flex-start" }}>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            color: "#475569",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "8px 12px",
            boxShadow: "0 4px 14px rgba(37,99,235,0.06)",
          }}
        >
          <span>{showEntriesLabel}</span>
          <select
            value={pageSize}
            onChange={onPageSizeChange}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#0f172a",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(safePage * pageSize, totalItems);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
    .reduce((acc, p, i, arr) => {
      if (i > 0 && arr[i - 1] !== p - 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderTop: "1px solid #f1f5f9",
        background: "#fafbff",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
        Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of <strong>{totalItems}</strong> {itemLabel}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <button
          className="al-page-btn"
          disabled={safePage === 1}
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid #e2e8f0",
            background: "#fff",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#64748b",
            cursor: safePage === 1 ? "not-allowed" : "pointer",
            opacity: safePage === 1 ? 0.38 : 1,
            transition: "all 0.18s",
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((item, index) =>
          item === "..." ? (
            <span key={`dots-${index}`} style={{ padding: "0 4px", color: "#94a3b8", fontSize: 13 }}>
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: safePage === item ? "none" : "1.5px solid #e2e8f0",
                background: safePage === item ? "linear-gradient(135deg, #1d4ed8, #3b82f6)" : "#fff",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: safePage === item ? "#fff" : "#64748b",
                cursor: "pointer",
                boxShadow: safePage === item ? "0 3px 10px rgba(37,99,235,0.35)" : "none",
                transition: "all 0.18s",
              }}
            >
              {item}
            </button>
          )
        )}

        <button
          disabled={safePage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid #e2e8f0",
            background: "#fff",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#64748b",
            cursor: safePage === totalPages ? "not-allowed" : "pointer",
            opacity: safePage === totalPages ? 0.38 : 1,
            transition: "all 0.18s",
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
