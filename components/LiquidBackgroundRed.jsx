import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./LiquidBackgroundRed.css";

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

  /* 🔥 CLEAN LIGHT BASE */
  uColor1: { value: new THREE.Vector3(0.96, 0.96, 0.98) },

  /* 🔵 BLUE */
  uColor2: { value: new THREE.Vector3(0.2, 0.4, 0.9) },

  /* 🔴 RED */
  uColor3: { value: new THREE.Vector3(0.85, 0.2, 0.3) },

  uSpeed: { value: 0.08 } // slow = premium
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
uniform vec2 uResolution;
uniform vec3 uColor1; // base (light)
uniform vec3 uColor2; // blue
uniform vec3 uColor3; // red
uniform float uSpeed;

varying vec2 vUv;

void main(){
  // Center coordinates and adjust for aspect ratio
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  uv.x *= aspect;
  
  // Use a slightly faster time factor for visible movement and fading
  float t = uTime * (uSpeed * 12.0); 

  vec2 center = vec2(0.5 * aspect, 0.5);

  // Position for Blue Sphere - moving in an organic pattern
  vec2 posBlue = center + vec2(sin(t * 0.7), cos(t * 0.5)) * 0.35;
  float distBlue = length(uv - posBlue);

  // Position for Red Sphere - moving in an opposite organic pattern
  vec2 posRed = center + vec2(cos(t * 0.6), sin(t * 0.8)) * 0.35;
  float distRed = length(uv - posRed);

  // Opacity fading (vanishes and reappears)
  // Maps sine wave from [-1, 1] to a smooth [0, 1] fade
  float alphaBlue = smoothstep(-0.5, 0.8, sin(t * 0.9)); 
  float alphaRed  = smoothstep(-0.5, 0.8, cos(t * 1.1));

  // Sphere shaping (Soft glowing edges like volumetric orbs)
  float radius = 0.6; // Large soft orbs
  float glowBlue = smoothstep(radius, 0.0, distBlue) * alphaBlue;
  float glowRed  = smoothstep(radius, 0.0, distRed) * alphaRed;

  // Base background color
  vec3 color = uColor1; 
  
  // Blend the spheres over the background (Additive mix but using alpha to retain lightness)
  // Since we are mixing on a light background, mix() works beautifully
  color = mix(color, uColor2, glowBlue * 0.85);
  color = mix(color, uColor3, glowRed * 0.85);

  gl_FragColor = vec4(color, 1.0);
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

  return <div className="liquid-bg-blue" ref={mountRef} />;
}