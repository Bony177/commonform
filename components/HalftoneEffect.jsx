"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import "./HalftoneEffect.css";

export default function HalftoneEffect({ 
  src, 
  className = "", 
  radius = 4, 
  scatter = 0, 
  rotateR = 15, 
  rotateG = 75, 
  rotateB = 0, 
  rotateK = 45,
  blend = 1,
  blendMode = 1, // 1 is multiply, 0 is linear (normal)
  grayscale = false
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // TEXTURE LOADING
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      resize(); // Resize after texture load to ensure aspect ratio
    });

    // PLANE
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // POST-PROCESSING
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const params = {
      shape: 1,
      radius: radius,
      rotateR: rotateR * (Math.PI / 180),
      rotateG: rotateG * (Math.PI / 180),
      rotateB: rotateB * (Math.PI / 180),
      scatter: scatter,
      blending: blend,
      blendingMode: blendMode,
      greyscale: grayscale,
      disable: false
    };

    const halftonePass = new HalftonePass(container.clientWidth, container.clientHeight, params);
    composer.addPass(halftonePass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // UPDATE UNIFORMS FROM PROPS/CSS
    const updateParams = () => {
      const style = getComputedStyle(document.documentElement);
      
      const r = parseFloat(style.getPropertyValue("--halftone-radius")) || radius;
      const s = parseFloat(style.getPropertyValue("--halftone-scatter")) || scatter;
      const b = parseFloat(style.getPropertyValue("--halftone-blend")) || blend;
      
      halftonePass.uniforms["radius"].value = r;
      halftonePass.uniforms["scatter"].value = s;
      halftonePass.uniforms["blending"].value = b;
      
      // Update angles if needed (optional)
      halftonePass.uniforms["rotateR"].value = (parseFloat(style.getPropertyValue("--halftone-rotate-r")) || rotateR) * (Math.PI / 180);
      halftonePass.uniforms["rotateG"].value = (parseFloat(style.getPropertyValue("--halftone-rotate-g")) || rotateG) * (Math.PI / 180);
      halftonePass.uniforms["rotateB"].value = (parseFloat(style.getPropertyValue("--halftone-rotate-b")) || rotateB) * (Math.PI / 180);
    };

    // RESIZE
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (texture.image) {
        const imageAspect = texture.image.width / texture.image.height;
        const containerAspect = width / height;

        if (containerAspect > imageAspect) {
          mesh.scale.set(imageAspect / containerAspect, 1, 1);
        } else {
          mesh.scale.set(1, containerAspect / imageAspect, 1);
        }
      }

      renderer.setSize(width, height);
      composer.setSize(width, height);
      halftonePass.setSize(width, height);
    };

    window.addEventListener("resize", resize);
    resize();

    // ANIMATION
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      updateParams();
      composer.render();
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      composer.dispose();
    };
  }, [src, radius, scatter, rotateR, rotateG, rotateB, blend, blendMode, grayscale]);

  return <div ref={mountRef} className={`halftone-canvas-container ${className}`} />;
}
