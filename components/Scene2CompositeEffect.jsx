"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Scene2CompositeEffect.css";

/**
 * Scene2CompositeEffect
 * A high-end transparent overlay that uses a custom shader for Film Grain and Scanlines.
 * This ensures visibility even when used as a non-intrusive filter over DOM content.
 */
export default function Scene2CompositeEffect({
  nIntensity = 0.5,
  sIntensity = 0.15,
  sCount = 1024,
  opacity = 0.2,
  grayscale = false
}) {
  const mountRef = useRef(null);
  const propsRef = useRef({ nIntensity, sIntensity, sCount, opacity, grayscale });

  // Update props in real-time for the animation loop
  useEffect(() => {
    propsRef.current = { nIntensity, sIntensity, sCount, opacity, grayscale };
  }, [nIntensity, sIntensity, sCount, opacity, grayscale]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    // Explicitly set transparent background
    renderer.setClearColor(0x000000, 0); 
    container.appendChild(renderer.domElement);

    // --- CUSTOM FILTER SHADER ---
    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending, // Use additive for the "light grain" look
      uniforms: {
        time: { value: 0 },
        nIntensity: { value: nIntensity },
        sIntensity: { value: sIntensity },
        sCount: { value: sCount },
        uOpacity: { value: opacity }
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
          // 1. Noise Grain
          // Dynamic seed with time for animation
          float noise = random(vUv + mod(time, 10.0));
          
          // 2. Scanlines 
          // Use a sine wave for horizontal lines
          float scanline = sin(vUv.y * sCount) * 0.5 + 0.5;
          scanline = pow(scanline, 1.5); // sharpen the lines
          
          // 3. Composite Effect
          // We render grain and scanlines in white/grey to simulate cinematic texture
          vec3 grainColor = vec3(noise * nIntensity);
          float scanlineAlpha = scanline * sIntensity;
          
          // Add some variance to scanlines via noise
          float finalAlpha = (noise * nIntensity * 0.4) + scanlineAlpha;
          
          // Output white/grey texture with controlled alpha
          gl_FragColor = vec4(vec3(noise * 0.8), finalAlpha * uOpacity);
        }
      `
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

    // --- ANIMATION ---
    let frameId;
    let time = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.05; // Slightly faster time for visible grain movement

      material.uniforms.time.value = time;
      material.uniforms.nIntensity.value = propsRef.current.nIntensity;
      material.uniforms.sIntensity.value = propsRef.current.sIntensity;
      material.uniforms.sCount.value = propsRef.current.sCount;
      material.uniforms.uOpacity.value = propsRef.current.opacity;

      renderer.render(scene, camera);
    };

    animate();

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
  }, []);

  return <div ref={mountRef} className="scene2-composite-canvas" />;
}
