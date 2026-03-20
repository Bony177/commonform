"use client";

import { useEffect, useMemo, useState } from "react";

export default function ModelViewer({
  src,
  modelSources = [],
  autoSwitch = false,
  switchIntervalMs = 6000,
  autoRotate = true,
  cameraControls = true,
  disableZoom = true,
  rotationPerSecond,
  style,
}) {
  const modelSourcesKey = modelSources.join("||");

  const sources = useMemo(() => {
    const all = [src, ...modelSources].filter(Boolean);
    return [...new Set(all)];
  }, [src, modelSourcesKey]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [src, modelSourcesKey]);

  useEffect(() => {
    if (!autoSwitch || sources.length < 2) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sources.length);
    }, switchIntervalMs);

    return () => clearInterval(interval);
  }, [autoSwitch, sources.length, modelSourcesKey, src, switchIntervalMs]);

  const currentSrc = sources[currentIndex];

  if (!currentSrc) return null;

  const modelViewerProps = {
    src: currentSrc,
    style,
  };

  if (autoRotate) modelViewerProps["auto-rotate"] = true;
  if (cameraControls) modelViewerProps["camera-controls"] = true;
  if (disableZoom) modelViewerProps["disable-zoom"] = true;
  if (rotationPerSecond) {
    modelViewerProps["rotation-per-second"] = rotationPerSecond;
  }

  return <model-viewer key={currentSrc} {...modelViewerProps} />;
}
