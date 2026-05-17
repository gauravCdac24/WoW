import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 6000;

export function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = () => window.innerWidth;
    const height = () => window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width(), height());
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width() / height(), 0.1, 2000);
    camera.position.set(0, 0, 180);

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const tmpColor = new THREE.Color();

    const GOLDEN = Math.PI * (1 + Math.sqrt(5));
    const count = PARTICLE_COUNT;

    function updateParticles(time: number) {
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.7);
      const hueShift = 0.04 * Math.sin(time * 0.2);
      for (let i = 0; i < count; i++) {
        const n = i / count;
        const phi = Math.acos(1 - 2 * n);
        const theta = GOLDEN * i;
        const sinPhi = Math.sin(phi);
        const sx = sinPhi * Math.cos(theta);
        const sy = sinPhi * Math.sin(theta);
        const sz = Math.cos(phi);
        const r = 60 + 10 * Math.sin(time * 0.9 + i * 0.003) + 18 * pulse;
        const fx = 6 * Math.sin(sy * 2.1 + time * 0.9);
        const fy = 6 * Math.cos(sz * 2.3 + time * 1.1);
        const fz = 6 * Math.sin(sx * 2.5 + time * 0.7);

        const i3 = i * 3;
        positions[i3] = sx * r + fx;
        positions[i3 + 1] = sy * r + fy;
        positions[i3 + 2] = sz * r + fz;

        const hue = (0.62 + 0.22 * n + hueShift) % 1;
        const light = 0.45 + 0.2 * Math.sin(i * 0.008 + time * 1.6);
        tmpColor.setHSL(hue < 0 ? hue + 1 : hue, 0.82, light);
        colors[i3] = tmpColor.r;
        colors[i3 + 1] = tmpColor.g;
        colors[i3 + 2] = tmpColor.b;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    }

    function onResize() {
      const w = width();
      const h = height();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = performance.now();
    let raf = 0;

    function frame() {
      const time = (performance.now() - start) / 1000;
      updateParticles(time);
      points.rotation.y = time * 0.05;
      points.rotation.x = Math.sin(time * 0.25) * 0.15;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    if (reducedMotion) {
      updateParticles(0);
      renderer.render(scene, camera);
    } else {
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="particle-bg" aria-hidden />;
}
