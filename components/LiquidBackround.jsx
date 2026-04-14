import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LiquidBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    /* 🎥 SCENE SETUP */
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    /* 🎨 MONOCHROME COLORS */
    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      },
      uColor1: { value: new THREE.Vector3(0.05, 0.05, 0.05) }, // deep black
      uColor2: { value: new THREE.Vector3(0.2, 0.2, 0.2) },   // dark grey
      uColor3: { value: new THREE.Vector3(0.4, 0.4, 0.4) },   // mid grey
      uColor4: { value: new THREE.Vector3(0.8, 0.8, 0.8) },   // soft white
      uSpeed: { value: 0.2 },      // slow = cinematic
      uIntensity: { value: 0.6 }   // subtle
    };

    /* 🧠 GEOMETRY */
    const geometry = new THREE.PlaneGeometry(2, 2);

    /* 🎬 SHADER */
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform float uSpeed;
        uniform float uIntensity;

        varying vec2 vUv;

        float noise(vec2 p){
          return sin(p.x)*sin(p.y);
        }

        void main(){
          vec2 uv = vUv;

          float t = uTime * uSpeed;

          float n1 = noise(uv * 3.0 + t);
          float n2 = noise(uv * 5.0 - t * 1.2);
          float n3 = noise(uv * 8.0 + t * 0.5);

          float mixVal = (n1 + n2 + n3) / 3.0;

          vec3 color = mix(uColor1, uColor2, mixVal);
          color = mix(color, uColor3, smoothstep(0.2,0.7,mixVal));
          color = mix(color, uColor4, smoothstep(0.6,1.0,mixVal));

          color *= uIntensity;

          gl_FragColor = vec4(color,1.0);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /* 🎞️ ANIMATION */
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      uniforms.uTime.value += clock.getDelta();
      renderer.render(scene, camera);
    }

    animate();

    /* 📱 RESIZE */
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    });

    return () => {
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="liquid-bg" ref={mountRef} />;
}