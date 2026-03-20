"use client";

export default function ProductGrid({ products, activeProduct, onSelect }) {
  return (
    <div style={styles.grid}>
      {products.map((product) => {
        const isActive = product.id === activeProduct.id;

        return (
          <div
            key={product.id}
            style={{
              ...styles.gridItem,
              borderColor: isActive ? "#fbbf24" : "#262626",
            }}
            onClick={() => onSelect(product)}
          >
            <div
              style={{
                ...styles.gridItemContent,
                backgroundColor: isActive ? "#3a3a3a" : "#2d2d2d",
              }}
            >
              {/* placeholder thumbnail */}
              <svg
                style={{
                  ...styles.gridItemIcon,
                  color: isActive ? "#fbbf24" : "#525252",
                }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 2h10v2H7V2zm0 4h10v12H7V6zm-2 2v10h2V8H5zm12 0v10h2V8h-2z" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0.75rem",
  },
  gridItem: {
    aspectRatio: "1 / 1",
    backgroundColor: "#1a1a1a",
    borderRadius: "4px",
    border: "1px solid #262626",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.3s ease",
  },
  gridItemContent: {
    width: "75%",
    height: "75%",
    backgroundColor: "#2d2d2d",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
};
