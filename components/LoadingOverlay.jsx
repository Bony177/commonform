"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingOverlay({ isLoaded, progress }) {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShouldRender(false), 2000); // Wait for transition
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            color: "#fff",
            fontFamily: "Panchang, sans-serif",
          }}
        >
          {/* Grain Effect in Loader */}
          <div 
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.15,
              pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <h2 style={{ fontSize: "0.8rem", letterSpacing: "0.4rem", fontWeight: 500 }}>
              COMMON FORM
            </h2>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.2rem", opacity: 0.5 }}>
              ESTABLISHING IDENTITY
            </div>
          </motion.div>

          <div style={{ position: "relative", width: "240px", height: "1px", backgroundColor: "rgba(255,255,255,0.1)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{
                position: "absolute",
                height: "100%",
                backgroundColor: "#fff",
                boxShadow: "0 0 15px rgba(255,255,255,0.5)"
              }}
            />
          </div>

          <div style={{ fontSize: "0.7rem", letterSpacing: "0.1rem", fontVariantNumeric: "tabular-nums" }}>
            {Math.round(progress)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
