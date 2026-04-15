"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function NegativeLens() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth lerp settings
  const springConfig = { damping: 35, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Find the Scene 3 container to check bounds
      const scene3 = document.querySelector(".cursor-none-container");
      if (!scene3) return;

      const rect = scene3.getBoundingClientRect();
      const inBounds = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

      setIsVisible(inBounds);
      
      if (inBounds) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 170, // 170px Diameter
        height: 170,
        borderRadius: "50%",
        backgroundColor: "#ffffff", // White + difference = Negative Inversion
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        display: isVisible ? "block" : "none",
        // Sharp surgical edges
        boxShadow: "0 0 0 1px #000",
        border: "none",
        willChange: "transform",
      }}
    />
  );
}
