"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";

export function AiHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) container.removeChild(container.firstChild);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xffffff, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();

    const renderPass = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight), 0.15, 0.6, 0.3);
    const rgbShift = new ShaderPass(RGBShiftShader);
    rgbShift.uniforms["amount"].value = 0.0008;
    rgbShift.uniforms["angle"].value = Math.PI / 4;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloom);
    composer.addPass(rgbShift);

    const COLS = 50, ROWS = 50, SPACING = 1.4, JITTER = 0.3, DOT_R = 0.03, HEX = 0.5;
    const total = COLS * ROWS;
    const geometry = new THREE.CircleGeometry(DOT_R, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const dots = new THREE.InstancedMesh(geometry, material, total);
    dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(dots);

    const basePos = new Float32Array(total * 2);
    const distArr = new Float32Array(total);
    const xOff = (COLS - 1) * SPACING * 0.5;
    const yOff = (ROWS - 1) * SPACING * 0.5;
    const dummy = new THREE.Object3D();
    let idx = 0;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++, idx++) {
        let x = c * SPACING - xOff + (Math.random() - 0.5) * JITTER;
        let y = r * SPACING - yOff + (c % 2) * HEX * SPACING + (Math.random() - 0.5) * JITTER;
        basePos[idx * 2] = x;
        basePos[idx * 2 + 1] = y;
        distArr[idx] = Math.hypot(x, y) + 0.5 * Math.cos(Math.atan2(y, x) * 8.0) * 0.75;
        dummy.position.set(x, y, 0);
        dummy.updateMatrix();
        dots.setMatrixAt(idx, dummy.matrix);
      }
    }

    const syncColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      material.color.set(isDark ? 0xffffff : 0x111111);
    };
    syncColor();
    const observer = new MutationObserver(syncColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    function roundedSquareWave(t: number, delta: number, a: number, f: number) {
      return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
    }

    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const phase = (Math.sin(2 * Math.PI * t * 0.3) + 1) * 0.5;
      rgbShift.uniforms["amount"].value = 0.0005 + phase * 0.001;
      const mat = new THREE.Matrix4();
      for (let i = 0; i < total; i++) {
        const x0 = basePos[i * 2];
        const y0 = basePos[i * 2 + 1];
        const dist = distArr[i];
        const localDelta = THREE.MathUtils.lerp(0.05, 0.2, Math.min(1.0, dist / 70.0));
        const tt = t * 0.5 - dist * 0.035;
        const k = 1 + roundedSquareWave(tt, localDelta, 0.75, 0.3);
        mat.set(1, 0, 0, x0 * k, 0, 1, 0, y0 * k, 0, 0, 1, 0, 0, 0, 0, 1);
        dots.setMatrixAt(i, mat);
      }
      dots.instanceMatrix.needsUpdate = true;
      composer.render();
    }

    const resizeCamera = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const aspect = w / h;
      const worldH = 10;
      camera.left = -(worldH * aspect) / 2;
      camera.right = (worldH * aspect) / 2;
      camera.top = worldH / 2;
      camera.bottom = -worldH / 2;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(0, 0, 10);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };

    const resizeObs = new ResizeObserver(resizeCamera);
    resizeObs.observe(container);
    resizeCamera();
    animate();

    return () => {
      resizeObs.disconnect();
      observer.disconnect();
      cancelAnimationFrame(animId);
      while (container.firstChild) container.removeChild(container.firstChild);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="relative w-full min-h-[90vh] bg-white dark:bg-black flex flex-col items-center justify-center transition-colors duration-300">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p
          className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-4"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Streetwear Manufacturing &amp; Custom Printing
        </p>
        <h1
          className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase mb-6 text-black dark:text-white leading-none"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          PERFECT
          <br />
          PRINTS LAB
        </h1>
        <p
          className="text-sm text-neutral-500 dark:text-neutral-400 tracking-widest uppercase mb-10"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Print Your Ideas. Wear Your Style.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="/shop"
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Shop Now
          </a>
          <a
            href="https://wa.me/923010148055?text=Hi%21%20I%20want%20to%20inquire%20about%20Bulk%20Printing%20from%20PerfectPrints.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-black dark:border-white text-black dark:text-white text-xs font-semibold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Bulk Printing
          </a>
        </div>
      </div>
    </div>
  );
}

export default AiHeroBackground;