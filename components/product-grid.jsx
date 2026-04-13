"use client";

import { useState } from "react";

export default function ProductGrid({ products, activeProduct, onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);

  // --- Adjustable Settings ---
  const ACTIVE_BG_COLOR = "#333333"; // Lighter background color when selected
  const DEFAULT_BG_COLOR = "#1a1a1a"; // Default background color
  const HOVER_ZOOM_SCALE = 1.15; // Image scale when hovered
  // ---------------------------

  return (
    <div style={styles.grid}>
      {products.map((product) => {
        const isActive = product.id === activeProduct.id;
        const isHovered = hoveredId === product.id;

        return (
          <div
            key={product.id}
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              ...styles.gridItem,
              backgroundColor: isActive ? ACTIVE_BG_COLOR : DEFAULT_BG_COLOR,
              border: "1px solid #262626",
            }}
            onClick={() => onSelect(product)}
          >
            {/* product thumbnail */}
            <img
              src={product.media?.find((m) => m.type === "image")?.src || ""}
              alt={`${product.name} thumbnail`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "8px",
                opacity: isActive ? 1 : 0.6,
                transform: isHovered ? `scale(${HOVER_ZOOM_SCALE})` : "scale(1)",
                transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease",
              }}
            />
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
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
    overflow: "hidden",
  },
  label: {
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
};
