"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const products = [
    { id: 1, name: "T-Shirt 1", color: "Black" },
    { id: 2, name: "T-Shirt 2", color: "White" },
    { id: 3, name: "T-Shirt 3", color: "Navy" },
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <div style={styles.container}>
      {/* Main Product Display */}
      <div style={styles.productDisplay}>
        <div style={styles.productContent}>
          <div style={styles.shirtPreview}>
            <svg style={styles.shirtIcon} fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2h10v2H7V2zm0 4h10v12H7V6zm-2 2v10h2V8H5zm12 0v10h2V8h-2z" />
            </svg>
          </div>
          <p style={styles.productName}>{products[currentIndex].name}</p>
          <p style={styles.productColor}>Color: {products[currentIndex].color}</p>
        </div>

        {/* Side Navigation */}
        <button onClick={prevSlide} style={styles.navButton}>
          <ChevronLeft style={styles.navButtonIcon} />
        </button>
        <button onClick={nextSlide} style={styles.navButtonRight}>
          <ChevronRight style={styles.navButtonIcon} />
        </button>
      </div>

      {/* Indicator Dots */}
      <div style={styles.indicators}>
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              ...styles.indicator,
              backgroundColor: i === currentIndex ? "#fbbf24" : "#525252",
            }}
          />
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  productDisplay: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  productContent: {
    width: "75%",
    height: "75%",
    background: "linear-gradient(to bottom right, #262626, #1a1a1a)",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  shirtPreview: {
    width: "8rem",
    height: "10rem",
    backgroundColor: "#2d2d2d",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  shirtIcon: {
    width: "4rem",
    height: "4rem",
    color: "#525252",
  },
  productName: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#737373",
    margin: 0,
  },
  productColor: {
    fontSize: "0.75rem",
    color: "#737373",
    margin: 0,
  },
  navButton: {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "50%",
    padding: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonRight: {
    position: "absolute",
    right: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "50%",
    padding: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonIcon: {
    width: "24px",
    height: "24px",
    color: "white",
  },
  indicators: {
    display: "flex",
    gap: "0.5rem",
  },
  indicator: {
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
}
