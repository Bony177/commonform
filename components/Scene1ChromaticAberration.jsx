"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import styles from "./Scene1ChromaticAberration.module.css";

/**
 * Scene1ChromaticAberration
 * A high-end background shader for Scene 1 that applies chromatic aberration
 * to the edges of the screen using a radial vignette mask, now including a Glitch effect.
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
  const propsRef = useRef({ 
    uIntensity, 
    uRadius, 
    uSoftness, 
    uSpread, 
    opacity,
    glitchActive,
    goWild
  });

  // Update props in real-time for the animation loop
  useEffect(() => {
    propsRef.current = { 
      uIntensity, 
      uRadius, 
      uSoftness, 
      uSpread, 
      opacity,
      glitchActive,
      goWild
    };
  }, [uIntensity, uRadius, uSoftness, uSpread, opacity, glitchActive, goWild]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- TEXTURE LOADING ---
    const loader = new THREE.TextureLoader();
    const texture = loader.load(src);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // --- SHADER MATERIAL ---
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uIntensity: { value: uIntensity },
        uRadius: { value: uRadius },
        uSoftness: { value: uSoftness },
        uSpread: { value: uSpread },
        uOpacity: { value: opacity },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
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

    // --- POST-PROCESSING ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const glitchPass = new GlitchPass();
    glitchPass.enabled = glitchActive;
    glitchPass.goWild = goWild;
    composer.addPass(glitchPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // --- RESIZE ---
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    // --- ANIMATION ---
    let frameId;
    let time = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.01;

      material.uniforms.uTime.value = time;
      material.uniforms.uIntensity.value = propsRef.current.uIntensity;
      material.uniforms.uRadius.value = propsRef.current.uRadius;
      material.uniforms.uSoftness.value = propsRef.current.uSoftness;
      material.uniforms.uSpread.value = propsRef.current.uSpread;
      material.uniforms.uOpacity.value = propsRef.current.opacity;

      glitchPass.enabled = propsRef.current.glitchActive;
      glitchPass.goWild = propsRef.current.goWild;

      composer.render();
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
      composer.dispose();
      material.dispose();
      texture.dispose();
      plane.geometry.dispose();
    };
  }, [src]);

  return <div ref={mountRef} className={styles.canvasContainer} />;
}
