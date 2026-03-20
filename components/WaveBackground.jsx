"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WaveBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ----- SCENE -----
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    containerRef.current.appendChild(renderer.domElement);

    // ----- POINT GRID -----
    const aspect = window.innerWidth / window.innerHeight;
    const height = 80;
    const width = height * aspect;
    const spacing = 3;

    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let x = -width / 2; x < width / 2; x += spacing) {
      for (let y = -height / 2; y < height / 2; y += spacing) {
        positions.push(x, y, 0);
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      opacity: 0.9,
      transparent: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const positionAttr = geometry.attributes.position;
    const clock = new THREE.Clock();

    let isActive = true;
    document.addEventListener("visibilitychange", () => {
      isActive = !document.hidden;
    });

    // ----- ANIMATION -----
    function animate() {
      requestAnimationFrame(animate);
      if (!isActive) return;

      const time = clock.getElapsedTime() * 0.7;

      for (let i = 0; i < positionAttr.count; i++) {
        const x = positionAttr.getX(i);
        const y = positionAttr.getY(i);

        const wave =
          Math.sin(x * 0.15 + time) * 2 + Math.cos(y * 0.15 + time * 0.8) * 2;

        positionAttr.setZ(i, wave);
      }

      positionAttr.needsUpdate = true;
      renderer.render(scene, camera);
    }

    animate();

    // ----- RESIZE -----
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    // ----- CLEANUP (IMPORTANT) -----
    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
