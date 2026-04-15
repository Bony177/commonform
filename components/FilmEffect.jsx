"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import "./FilmEffect.css";

export default function FilmEffect({ 
  src, 
  className = "", 
  nIntensity = 0.35, 
  sIntensity = 0.05, 
  sCount = 4096, 
  grayscale = false 
}) {
  const mountRef = useRef(null);
  const propsRef = useRef({ nIntensity, sIntensity, sCount, grayscale });

  // Update propsRef whenever props change to keep the animation loop reactive
  useEffect(() => {
    propsRef.current = { nIntensity, sIntensity, sCount, grayscale };
  }, [nIntensity, sIntensity, sCount, grayscale]);

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

    const filmPass = new FilmPass(nIntensity, sIntensity, sCount, grayscale);
    composer.addPass(filmPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

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
    };

    window.addEventListener("resize", resize);
    resize();

    // ANIMATION
    let frameId;
    let time = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.01;

      // Update FilmPass (reactive to propsRef)
      filmPass.uniforms["nIntensity"].value = propsRef.current.nIntensity;
      filmPass.uniforms["sIntensity"].value = propsRef.current.sIntensity;
      filmPass.uniforms["sCount"].value = propsRef.current.sCount;
      filmPass.uniforms["grayscale"].value = propsRef.current.grayscale;
      filmPass.uniforms["time"].value = time;

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
  }, [src]);

  return <div ref={mountRef} className={`film-canvas-container ${className}`} />;
}
