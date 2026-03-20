"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SignalBars({ width = 400, height = 400, bars = 40 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000,
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // 🔥 GROUP FOR BARS
    const group = new THREE.Group();
    scene.add(group);

    const barHeight = height / bars;

    const barsArray = [];

    for (let i = 0; i < bars; i++) {
      // decreasing width
      const progress = i / bars;
      const barWidth = width * (1 - progress);

      // fewer bars as it goes up
      if (barWidth < width * 0.1) continue;

      const geometry = new THREE.PlaneGeometry(barWidth, barHeight * 0.7);

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#00d4ff"),
        transparent: true,
        opacity: 0.9,
      });

      const bar = new THREE.Mesh(geometry, material);

      bar.position.y = -height / 2 + i * barHeight;
      bar.position.x = -width / 2 + barWidth / 2;

      group.add(bar);
      barsArray.push(bar);
    }

    // 🔥 ANIMATION (signal feel)
    let t = 0;

    function animate() {
      requestAnimationFrame(animate);

      t += 0.03;

      barsArray.forEach((bar, i) => {
        const wave = Math.sin(t + i * 0.3);

        // subtle width breathing
        bar.scale.x = 1 + wave * 0.08;

        // opacity flicker
        bar.material.opacity = 0.6 + wave * 0.3;
      });

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [width, height, bars]);

  return <div ref={mountRef} />;
}
