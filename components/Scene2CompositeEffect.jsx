"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./Scene2CompositeEffect.css";

/**
 * Scene2CompositeEffect (Optimized)
 * A high-end transparent overlay with Film Grain and Scanlines.
 * Optimized with visibility detection and reduced render quality.
 */
export default function Scene2CompositeEffect({
  nIntensity = 0.5,
  sIntensity = 0.15,
  sCount = 1024,
  opacity = 0.2,
  grayscale = false,
}) {
  const mountRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const propsRef = useRef({
    nIntensity,
    sIntensity,
    sCount,
    opacity,
    grayscale,
  });

  // Detect if component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    if (mountRef.current) {
      observer.observe(mountRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Update props in real-time for the animation loop
  useEffect(() => {
    propsRef.current = { nIntensity, sIntensity, sCount, opacity, grayscale };
  }, [nIntensity, sIntensity, sCount, opacity, grayscale]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Initialize scene immediately (Scene 2 is an overlay, no loading needed)
    return initializeScene(container);

    function initializeScene(container) {
      // --- SCENE SETUP ---
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
      camera.position.z = 1;

      // Optimized renderer: disable antialias for performance
      const isLowEndDevice =
        window.devicePixelRatio > 2 || navigator.hardwareConcurrency < 4;
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(
        isLowEndDevice ? 1 : Math.min(window.devicePixelRatio, 1.5),
      );
      renderer.setSize(container.clientWidth, container.clientHeight);
      // Explicitly set transparent background
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // --- CUSTOM FILTER SHADER (Simplified) ---
      const material = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        uniforms: {
          time: { value: 0 },
          nIntensity: { value: nIntensity },
          sIntensity: { value: sIntensity },
          sCount: { value: sCount },
          uOpacity: { value: opacity },
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
        fragmentShader: `
        uniform float time;
        uniform float nIntensity;
        uniform float sIntensity;
        uniform float sCount;
        uniform float uOpacity;
        varying vec2 vUv;

        // Simple pseudo-random function
        float random(vec2 uv) {
          return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
          // Reduced calculations for performance
          float noise = random(vUv + mod(time, 100.0));
          
          // Scanlines (reduced resolution for performance)
          float scanline = sin(vUv.y * sCount * 0.5) * 0.5 + 0.5;
          scanline = pow(scanline, 1.5);
          
          float scanlineAlpha = scanline * sIntensity;
          float finalAlpha = (noise * nIntensity * 0.4) + scanlineAlpha;
          
          gl_FragColor = vec4(vec3(noise * 0.8), finalAlpha * uOpacity);
        }
      `,
      });

      const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(plane);

      // --- RESIZE ---
      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", resize);
      resize();

      // --- ANIMATION (Only when visible) ---
      let frameId;
      let time = 0;
      let frameCounter = 0;
      let isAnimating = false;

      const animate = () => {
        if (!isVisible) {
          isAnimating = false;
          return;
        }

        frameId = requestAnimationFrame(animate);
        isAnimating = true;

        // Skip frames on low-end devices or when not critical
        frameCounter++;
        if (frameCounter % frameThrottle !== 0) return;

        time += 0.05;

        material.uniforms.time.value = time;
        material.uniforms.nIntensity.value = propsRef.current.nIntensity;
        material.uniforms.sIntensity.value = propsRef.current.sIntensity;
        material.uniforms.sCount.value = propsRef.current.sCount;
        material.uniforms.uOpacity.value = propsRef.current.opacity;

        renderer.render(scene, camera);
      };

      // Start animation when visible
      if (isVisible && !isAnimating) {
        animate();
      }

      // --- CLEANUP ---
      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(frameId);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        material.dispose();
        plane.geometry.dispose();
      };
    } // Close initializeScene function
  }, []); // Initialize once, no dependencies

  // Handle visibility changes for animation
  useEffect(() => {
    if (isVisible && mountRef.current) {
      // Find the renderer and restart animation
      const canvas = mountRef.current.querySelector("canvas");
      if (canvas && canvas._sceneData) {
        const { animate } = canvas._sceneData;
        if (animate && !canvas._isAnimating) {
          canvas._isAnimating = true;
          animate();
        }
      }
    }
  }, [isVisible]);

  return <div ref={mountRef} className="scene2-composite-canvas" />;
}
