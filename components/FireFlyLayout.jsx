import { useEffect, useRef } from "react";
import "./FireFly.css";

export default function FireflyLayer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    /* 🎯 CONTROL PANEL — tweak these! */
    const CONFIG = {
      count: 100,            // number of fireflies
      speed: 0.4,           // movement speed
      sizeMin: 0.3,         // smallest firefly radius (px)
      sizeMax: 1.2,         // largest firefly radius (px)
      glowRadius: 3,        // glow halo multiplier (higher = bigger glow)
      screenTop: 50,        // fireflies start here (% from top, 0=top, 100=bottom)
      screenBottom: 100,    // fireflies end here   (% from top, 0=top, 100=bottom)
      screenLeft: 0,        // left limit  (% from left, 0=left edge, 100=right edge)
      screenRight: 100,     // right limit (% from left, 0=left edge, 100=right edge)
    };

    function calcArea() {
      return {
        x: w * CONFIG.screenLeft / 100,
        y: h * CONFIG.screenTop / 100,
        w: w * (CONFIG.screenRight - CONFIG.screenLeft) / 100,
        h: h * (CONFIG.screenBottom - CONFIG.screenTop) / 100
      };
    }
    let AREA = calcArea();

    class Firefly {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = AREA.x + Math.random() * AREA.w;
        this.y = AREA.y + Math.random() * AREA.h;

        this.size = CONFIG.sizeMin + Math.random() * (CONFIG.sizeMax - CONFIG.sizeMin);
        this.angle = Math.random() * Math.PI * 2;
        this.speed = CONFIG.speed * (0.5 + Math.random());
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.angle += (Math.random() - 0.5) * 0.1;

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (
          this.x < AREA.x ||
          this.x > AREA.x + AREA.w ||
          this.y < AREA.y ||
          this.y > AREA.y + AREA.h
        ) {
          this.reset();
        }

        this.phase += 0.05;
      }

      draw() {
        const glow = (Math.sin(this.phase) + 1) / 2;
        const radius = this.size * (0.5 + glow);
        const glowR = radius * CONFIG.glowRadius;

        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glowR
        );

        gradient.addColorStop(0, `rgba(255, 200, 120, ${0.8 * glow})`);
        gradient.addColorStop(0.4, `rgba(255, 200, 120, ${0.3 * glow})`);
        gradient.addColorStop(1, `rgba(255, 200, 120, 0)`);

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(this.x, this.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let fireflies = [];
    for (let i = 0; i < CONFIG.count; i++) {
      fireflies.push(new Firefly());
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      fireflies.forEach(f => {
        f.update();
        f.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      AREA = calcArea();
    });

  }, []);

  return <canvas ref={canvasRef} className="firefly-canvas" />;
}