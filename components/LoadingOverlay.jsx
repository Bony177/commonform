"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingOverlay({ isLoaded, progress }) {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShouldRender(false), 700);
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
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
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
            gap: "1.5rem",
            color: "#fff",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.5rem",
              fontWeight: 400,
              margin: 0,
            }}
          >
            LOADING
          </motion.h1>

          <div style={{ 
            position: "relative", 
            width: "200px", 
            height: "1px", 
            backgroundColor: "rgba(255,255,255,0.15)" 
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{
                position: "absolute",
                height: "100%",
                backgroundColor: "#fff",
              }}
            />
          </div>

          <div style={{ 
            fontSize: "0.6rem", 
            letterSpacing: "0.1rem", 
            opacity: 0.6,
            fontVariantNumeric: "tabular-nums" 
          }}>
            {Math.round(progress)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
