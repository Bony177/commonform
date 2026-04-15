"use client";

import styles from "./HalftoneFilter.module.css";

/**
 * HalftoneFilter
 * A position-neutral visual overlay that applies a vibrant CMYK halftone effect
 * using CSS patterns and blending modes. This approach ensures that the underlying
 * DOM layout and element positions are never affected.
 */
export default function HalftoneFilter() {
  return (
    <div className={styles.container} aria-hidden="true">
      {/* Cyan Layer */}
      <div className={`${styles.layer} ${styles.cyan}`} />
      {/* Magenta Layer */}
      <div className={`${styles.layer} ${styles.magenta}`} />
      {/* Yellow Layer */}
      <div className={`${styles.layer} ${styles.yellow}`} />
      {/* Black Layer for contrast */}
      <div className={`${styles.layer} ${styles.black}`} />
    </div>
  );
}
