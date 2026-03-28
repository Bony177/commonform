"use client";

import { useEffect, useState } from "react";
import styles from "./FalseColorGlitchImage.module.css";

export default function FalseColorGlitchImage({
  src,
  alt = "",
  imageClassName = "",
  intervalMs = 2800,
  durationMs = 520,
  jitterMs = 1200,
  disabled = false,
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (disabled) {
      return undefined;
    }

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

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${imageClassName} ${styles.base}`.trim()}
      />
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`${imageClassName} ${styles.layer} ${styles.thermal} ${activeClass}`.trim()}
      />
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`${imageClassName} ${styles.layer} ${styles.negative} ${activeClass}`.trim()}
      />
    </>
  );
}
