"use client";

import { useEffect, useState } from "react";
import styles from "./ThermalGlitch.module.css";

export default function ThermalGlitch({
  children,
  as: Component = "span", // Change to div if wrapping large block elements
  className = "",
  inline = false,

  // Glitch Trigger settings (how often / how long)
  intervalMs = 2800,
  durationMs = 520,
  jitterMs = 1200,
  disabled = false,

  // Editable CSS Variables for styling
  speed = "180ms",          // How fast it jitters
  intensityX = "1px",       // Horizontal shake distance
  intensityY = "1px",       // Vertical shake distance
  opacity = 1,              // Opacity of the glitch layers
  thermalSaturate = "3200%",// Color intensity of the red/orange layer
  negativeSaturate = "230%",// Color intensity of the blue layer
  brightness = 1.25,        // Brightness of the thermal layer
  contrast = 1.2,           // Contrast of the thermal layer
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (disabled) return undefined;

    let isMounted = true;
    let startTimer;
    let stopTimer;

    const schedule = () => {
      const delay = intervalMs + Math.floor(Math.random() * jitterMs);

      startTimer = setTimeout(() => {
        if (!isMounted) return;
        setIsActive(true);

        stopTimer = setTimeout(() => {
          if (!isMounted) return;
          setIsActive(false);
          schedule();
        }, durationMs);
      }, delay);
    };

    schedule();

    return () => {
      isMounted = false;
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [disabled, durationMs, intervalMs, jitterMs]);

  const activeClass = !disabled && isActive ? styles.active : "";

  // Apply all CSS variables so you can tweak them directly via props
  const dynamicStyles = {
    "--glitch-speed": speed,
    "--glitch-x": intensityX,
    "--glitch-y": intensityY,
    "--thermal-saturate": thermalSaturate,
    "--negative-saturate": negativeSaturate,
    "--glitch-opacity": opacity,
    "--glitch-brightness": brightness,
    "--glitch-contrast": contrast,
    display: inline ? "inline-block" : undefined
  };

  return (
    <Component className={`${styles.wrapper} ${className}`.trim()} style={dynamicStyles}>
      {/* Base Layer - Normal Content */}
      <span className={styles.base}>{children}</span>
      
      {/* Glitch Layer 1: Thermal (Red/Orange hue) */}
      <span className={`${styles.layer} ${styles.thermal} ${activeClass}`.trim()} aria-hidden="true">
        {children}
      </span>
      
      {/* Glitch Layer 2: Negative (Blueish hue) */}
      <span className={`${styles.layer} ${styles.negative} ${activeClass}`.trim()} aria-hidden="true">
        {children}
      </span>
    </Component>
  );
}
