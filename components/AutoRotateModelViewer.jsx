"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function AutoRotateModelViewer({
  modelPath,
  className = "",
  rotationSpeed = 0.01,
}) {
  const mountRef = useRef(null);
  const fitRadiusRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !modelPath) return;

    let frameId = null;
    let disposed = false;

    const readCssNumber = (name, fallback) => {
      const raw = getComputedStyle(mount).getPropertyValue(name);
      const parsed = Number.parseFloat(raw);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.4, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(2.5, 4, 3);
    rimLight.position.set(-3, 2, -2);
    scene.add(ambientLight, keyLight, rimLight);

    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    const fitCameraToRadius = (radius) => {
      const halfFovY = THREE.MathUtils.degToRad(camera.fov / 2);
      const halfFovX = Math.atan(Math.tan(halfFovY) * camera.aspect);
      const fitPadding = readCssNumber("--cf-model-fit-padding", 1.08);

      const distanceForHeight = radius / Math.sin(halfFovY);
      const distanceForWidth = radius / Math.sin(halfFovX);
      const distance = Math.max(distanceForHeight, distanceForWidth) * fitPadding;

      camera.position.set(0, radius * 0.08, distance);
      camera.near = Math.max(0.01, distance / 100);
      camera.far = distance * 20;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    const fitToView = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      if (fitRadiusRef.current) {
        fitCameraToRadius(fitRadiusRef.current);
      }
    };

    fitToView();

    const resizeObserver = new ResizeObserver(() => fitToView());
    resizeObserver.observe(mount);

    const loader = new GLTFLoader();
    loader.load(
      encodeURI(modelPath),
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);
        const maxSize = Math.max(size.x, size.y, size.z) || 1;
        const scale = 1 / maxSize;
        model.scale.setScalar(scale);

        modelRoot.add(model);
        const fittedBox = new THREE.Box3().setFromObject(model);
        const fittedSphere = fittedBox.getBoundingSphere(new THREE.Sphere());
        fitRadiusRef.current = fittedSphere.radius || 1;
        fitCameraToRadius(fitRadiusRef.current);
        setIsLoaded(true);
      },
      undefined,
      () => {
        if (!disposed) setIsLoaded(true);
      },
    );

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      modelRoot.rotation.y += rotationSpeed;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();

      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material?.dispose());
          return;
        }
        object.material?.dispose();
      });

      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [modelPath, rotationSpeed]);

  return (
    <div ref={mountRef} className={`cf-model-viewer ${className}`.trim()}>
      {!isLoaded && <div className="cf-model-viewer__loading">LOADING 3D</div>}
    </div>
  );
}
