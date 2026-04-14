"use client";

import { useEffect, useState } from "react";
import styles from "./ThermalGlitch.module.css";

// This is identical to ThermalGlitch, but built specifically for <img> tags.
// It avoids wrapping divs which can break flexbox, grid, and object-fit alignments!
export default function ThermalGlitchImage({
  src,
  alt = "",
  className = "",
  
  // Glitch Trigger settings
  intervalMs = 2800,
  durationMs = 520,
  jitterMs = 1200,
  disabled = false,

  // Editable CSS Variables
  speed = "180ms",
  intensityX = "1px",
  intensityY = "1px",
  opacity = 1,
  thermalSaturate = "3200%",
  negativeSaturate = "230%",
  brightness = 1.25,
  contrast = 1.2,
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

  // Apply all CSS variables
  const dynamicStyles = {
    "--glitch-speed": speed,
    "--glitch-x": intensityX,
    "--glitch-y": intensityY,
    "--thermal-saturate": thermalSaturate,
    "--negative-saturate": negativeSaturate,
    "--glitch-opacity": opacity,
    "--glitch-brightness": brightness,
    "--glitch-contrast": contrast,
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className}`.trim()}
        style={dynamicStyles}
      />
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`${className} ${styles.imageLayer} ${styles.thermal} ${activeClass}`.trim()}
        style={dynamicStyles}
      />
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`${className} ${styles.imageLayer} ${styles.negative} ${activeClass}`.trim()}
        style={dynamicStyles}
      />
    </>
  );
}
