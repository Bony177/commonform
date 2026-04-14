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

/* 🔥 CLEAN PATTERN (NO GRAIN) */
float pattern(vec2 uv, float t) {
  float n = 0.0;

  n += sin(uv.x * 3.5 + t) * 0.5;
  n += sin(uv.y * 5.0 - t * 1.2) * 0.5;
  n += sin((uv.x + uv.y) * 4.5 + t * 0.6) * 0.5;

  return n / 1.5;
}

void main(){
  vec2 uv = vUv;

  float t = uTime * uSpeed;

  float p = pattern(uv, t);

  /* 🔥 SHARPER TRANSITIONS */
  p = smoothstep(-0.3, 0.7, p);

  vec3 color = mix(uColor1, uColor2, p);
  color = mix(color, uColor3, smoothstep(0.25,0.7,p));
  color = mix(color, uColor4, smoothstep(0.65,1.0,p));

  /* 🔥 SLIGHT CONTRAST BOOST (CLEAN LOOK) */
  color = pow(color, vec3(0.9));

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