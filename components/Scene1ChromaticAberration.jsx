"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./Scene1ChromaticAberration.module.css";

/**
 * Scene1ChromaticAberration (Optimized)
 * A high-end background shader for Scene 1 that applies chromatic aberration
 * to the edges of the screen using a radial vignette mask with performance optimizations.
 */
export default function Scene1ChromaticAberration({
  src = "/images/background.jpg",
  uIntensity = 1.0,
  uRadius = 0.2,
  uSoftness = 0.5,
  uSpread = 0.05,
  opacity = 1.0,
  glitchActive = true,
  goWild = false,
}) {
  const mountRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const propsRef = useRef({
    uIntensity,
    uRadius,
    uSoftness,
    uSpread,
    opacity,
    glitchActive,
    goWild,
  });

  // Detect if component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (mountRef.current) {
      observer.observe(mountRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Update props in real-time for the animation loop
  useEffect(() => {
    propsRef.current = {
      uIntensity,
      uRadius,
      uSoftness,
      uSpread,
      opacity,
      glitchActive,
      goWild,
    };
  }, [uIntensity, uRadius, uSoftness, uSpread, opacity, glitchActive, goWild]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Show loading state immediately with a subtle gradient
    container.style.background = 'linear-gradient(135deg, #000 0%, #111 100%)';
    
    // Preload texture immediately (not waiting for visibility)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      src,
      (texture) => {
        // Texture loaded successfully
        initializeScene(container, texture);
      },
      undefined,
      (error) => {
        console.warn('Texture failed to load, using fallback');
        // Create a simple gradient texture as fallback
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(1, '#111');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        const fallbackTexture = new THREE.CanvasTexture(canvas);
        initializeScene(container, fallbackTexture);
      }
    );

    function initializeScene(container, texture) {
      // --- SCENE SETUP ---
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      // Optimized renderer: disable antialias for performance, use lower DPI on mobile
      const isLowEndDevice =
        window.devicePixelRatio > 2 || navigator.hardwareConcurrency < 4;
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(
        isLowEndDevice ? 1 : Math.min(window.devicePixelRatio, 1.5)
      );
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      // Clear loading background
      container.style.background = 'transparent';

      // --- TEXTURE SETUP ---
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

    // --- SHADER MATERIAL (Simplified, no EffectComposer) ---
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uIntensity: { value: uIntensity },
        uRadius: { value: uRadius },
        uSoftness: { value: uSoftness },
        uSpread: { value: uSpread },
        uOpacity: { value: opacity },
        uResolution: {
          value: new THREE.Vector2(
            container.clientWidth,
            container.clientHeight,
          ),
        },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uIntensity;
        uniform float uRadius;
        uniform float uSoftness;
        uniform float uSpread;
        uniform float uOpacity;
        uniform vec2 uResolution;
        varying vec2 vUv;

        void main() {
          // Center UVs at (0.5, 0.5)
          vec2 centeredUv = vUv - 0.5;
          
          // Calculate radial distance
          float dist = length(centeredUv);
          
          // Create vignette mask using smoothstep
          float mask = smoothstep(uRadius, uRadius + uSoftness, dist);
          
          // Chromatic Spread - scaled by mask and intensity
          float spread = uSpread * mask * uIntensity;
          
          vec2 rOffset = vec2(-0.5, 0.5) * spread;
          vec2 gOffset = vec2(1.0, 0.0) * (spread * 0.5); 
          vec2 bOffset = vec2(0.5, -0.5) * spread;

          float r = texture2D(uTexture, vUv + rOffset).r;
          float g = texture2D(uTexture, vUv + gOffset).g;
          float b = texture2D(uTexture, vUv + bOffset).b;
          
          vec3 color = vec3(r, g, b);
          
          // Subtle lens imperfection: very faint grain
          float grain = fract(sin(dot(vUv + uTime * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
          color += (grain - 0.5) * 0.02 * mask;

          gl_FragColor = vec4(color, uOpacity);
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
      material.uniforms.uResolution.value.set(w, h);
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

      // Skip frames on low-end devices
      frameCounter++;
      if (frameCounter % frameThrottle !== 0) return;

      time += 0.01;

      material.uniforms.uTime.value = time;
      material.uniforms.uIntensity.value = propsRef.current.uIntensity;
      material.uniforms.uRadius.value = propsRef.current.uRadius;
      material.uniforms.uSoftness.value = propsRef.current.uSoftness;
      material.uniforms.uSpread.value = propsRef.current.uSpread;
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
      texture.dispose();
      plane.geometry.dispose();
    };
  }, [src]); // Changed dependency to src only

  // Handle visibility changes for animation
  useEffect(() => {
    if (isVisible && mountRef.current) {
      // Find the renderer and restart animation
      const canvas = mountRef.current.querySelector('canvas');
      if (canvas && canvas._sceneData) {
        const { animate } = canvas._sceneData;
        if (animate && !canvas._isAnimating) {
          canvas._isAnimating = true;
          animate();
        }
      }
    }
  }, [isVisible]);

  return <div ref={mountRef} className={styles.canvasContainer} />;
}
