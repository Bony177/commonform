"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import "./Scene2CompositeEffect.css";

export default function Scene2CompositeEffect() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();

    // --- LAYERS ---
    // 1. Background
    const bgTexture = loader.load("/images/bg2.jpg");
    bgTexture.colorSpace = THREE.SRGBColorSpace;
    const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
    const bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial);
    bgPlane.position.z = 0;
    scene.add(bgPlane);

    // 2. Butterfly (with thermal shader and glitch animation)
    const butterTexture = loader.load("/images/butter.png");
    butterTexture.colorSpace = THREE.SRGBColorSpace;
    
    const thermalUniforms = {
      uTexture: { value: butterTexture },
      uTime: { value: 0 },
      uActive: { value: 1.0 },
      uThermalSaturate: { value: 3.2 },
      uBrightness: { value: 1.25 },
      uContrast: { value: 1.2 }
    };

    const butterMaterial = new THREE.ShaderMaterial({
      uniforms: thermalUniforms,
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uActive;
        uniform float uThermalSaturate;
        uniform float uBrightness;
        uniform float uContrast;
        varying vec2 vUv;

        void main() {
          vec4 texColor = texture2D(uTexture, vUv);
          if (texColor.a < 0.1) discard;

          vec3 color = texColor.rgb;
          
          if (uActive > 0.5) {
            // Simple thermal-like effect
            float grey = dot(color, vec3(0.299, 0.587, 0.114));
            vec3 thermal = vec3(grey * uThermalSaturate, grey * 0.5, 1.0 - grey);
            color = mix(color, thermal, 0.85);
            color *= uBrightness;
            color = ((color - 0.5) * uContrast) + 0.5;
          }

          gl_FragColor = vec4(color, texColor.a);
        }
      `
    });

    const butterPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), butterMaterial);

    butterPlane.position.set(-0.35, -0.6, 1); // rough center-leftish
    scene.add(butterPlane);

    // 3. Subject (scene2.png)
    const subjectTexture = loader.load("/images/scene2.png");
    subjectTexture.colorSpace = THREE.SRGBColorSpace;
    const subjectMaterial = new THREE.MeshBasicMaterial({ 
      map: subjectTexture, 
      transparent: true 
    });
    const subjectPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), subjectMaterial);
    subjectPlane.position.set(0.65, -0.75, 2); // bottom right
    scene.add(subjectPlane);

    // --- POST-PROCESSING ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const halftoneParams = {
      shape: 1,
      radius: 4, // distinct dots
      rotateR: 15 * (Math.PI / 180),
      rotateG: 75 * (Math.PI / 180),
      rotateB: 0 * (Math.PI / 180),
      scatter: 0.18, // vibrant scatter
      blending: 1,
      blendingMode: 0, // Linear (Normal) - FIXES THE BLACKOUT
      greyscale: false,
      disable: false
    };

    const halftonePass = new HalftonePass(container.clientWidth, container.clientHeight, halftoneParams);
    composer.addPass(halftonePass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // --- RESIZE & ANIMATION ---
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const aspect = w / h;

      // Correct OrthographicCamera bounds based on aspect
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      composer.setSize(w, h);
      halftonePass.setSize(w, h);

      // Adjust BG to cover (Ortho)
      bgPlane.scale.set(aspect, 1, 1);

      // Subject scaling (bottom-right area)
      const subScale = 0.55;
      subjectPlane.scale.set(subScale, subScale, 1);
      subjectPlane.position.set(aspect * 0.65, -0.45, 2);

      // Butterfly scaling
      const butterScale = 1.6;
      butterPlane.scale.set(butterScale, butterScale, 1);
      butterPlane.position.set(-aspect * 0.35, -0.2, 1);
    };


    window.addEventListener("resize", resize);
    resize();

    let frameId;
    let time = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.01;

      // Update shader uniforms
      thermalUniforms.uTime.value = time;
      
      // Random jitter for "glitch" feel (approx 10% of frames)
      if (Math.random() > 0.9) {
        butterPlane.position.x += (Math.random() - 0.5) * 0.02;
        butterPlane.position.y += (Math.random() - 0.5) * 0.02;
        thermalUniforms.uActive.value = 1.0;
      } else {
        thermalUniforms.uActive.value = 0.8; // subtle constant thermal
      }

      // Subtle float for butterfly
      butterPlane.position.y += Math.sin(time * 0.5) * 0.002;
      butterPlane.position.x += Math.cos(time * 0.3) * 0.001;

      // Dynamic halftone radius (premium pulse)
      halftonePass.uniforms["radius"].value = 3 + Math.sin(time * 2) * 0.5;

      composer.render();
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
      container.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="scene2-composite-canvas" />;
}
