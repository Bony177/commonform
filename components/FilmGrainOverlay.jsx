"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass.js";

export default function FilmGrainOverlay({ className = "" }) {
  const mountRef = useRef(null);
  const composerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup (simple quad filling view)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Quad geometry/texture for base (film grain needs scene content)
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.001, // Near-invisible base
    });
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    mount.appendChild(renderer.domElement);

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const dotPass = new DotScreenPass();
    composer.addPass(dotPass);

    // Refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    composerRef.current = composer;

    let rafId;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      timeRef.current += 0.016;

      // Animate grain: moving dots via scale/angle
      const speed =
        parseFloat(getComputedStyle(mount).getPropertyValue("--grain-speed")) ||
        1.0;
      const scale =
        parseFloat(getComputedStyle(mount).getPropertyValue("--grain-scale")) ||
        150.0;
      dotPass.uniforms["scale"].value =
        scale * (0.8 + 0.4 * Math.sin(timeRef.current * speed * 0.5));
      dotPass.uniforms["angle"].value = timeRef.current * speed * 0.3;

      // Opacity control
      const opacity =
        parseFloat(
          getComputedStyle(mount).getPropertyValue("--grain-opacity"),
        ) || 0.25;
      material.opacity = opacity;

      composer.render();
    };
    tick();

    // Resize
    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      camera.left = -clientWidth / window.innerHeight;
      camera.right = clientWidth / window.innerHeight;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      composer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      composer.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`film-grain-overlay fixed inset-0 pointer-events-none z-[9999] ${className}`}
      style={{ opacity: "var(--grain-opacity, 0.25)" }}
    />
  );
}
