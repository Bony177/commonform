"use client";

import { useEffect, useState } from "react";

export default function ImageViewer({
  images = [],
  autoSwitch = true,
  switchIntervalMs = 4000,
  style,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoSwitch || images.length < 2) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, switchIntervalMs);

    return () => clearInterval(interval);
  }, [images.length, autoSwitch, switchIntervalMs]);

  if (!images.length) return null;

  return (
    <img
      key={index}
      src={images[index]}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        animation: "fadeIn 0.8s ease",
        ...style,
      }}
    />
  );
}