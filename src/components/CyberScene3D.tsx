import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CyberScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. High-Tech Dual-Tone Cyber Swarm (Orange Tactical Embers + Cyan Quantum Sparks)
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    // Primary Swarm: Tactical Orange (#FF5500) Embers
    const orangeCount = 850;
    const orangePositions = new Float32Array(orangeCount * 3);
    const orangeScales = new Float32Array(orangeCount);

    for (let i = 0; i < orangeCount; i++) {
      const idx = i * 3;
      // Spread across a broad volumetric 3D corridor
      orangePositions[idx] = (Math.random() - 0.5) * 28;
      orangePositions[idx + 1] = (Math.random() - 0.5) * 22;
      orangePositions[idx + 2] = (Math.random() - 0.5) * 16 - 2;
      orangeScales[i] = Math.random() * 0.05 + 0.02;
    }

    const orangeGeo = new THREE.BufferGeometry();
    orangeGeo.setAttribute('position', new THREE.BufferAttribute(orangePositions, 3));
    orangeGeo.setAttribute('scale', new THREE.BufferAttribute(orangeScales, 1));

    const orangeMat = new THREE.PointsMaterial({
      color: 0xff5500,
      size: 0.055,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const orangeParticles = new THREE.Points(orangeGeo, orangeMat);
    particleGroup.add(orangeParticles);

    // Secondary Accent Swarm: Cyan Micro-Sparks (#00E5FF)
    const cyanCount = 350;
    const cyanPositions = new Float32Array(cyanCount * 3);
    for (let i = 0; i < cyanCount; i++) {
      const idx = i * 3;
      cyanPositions[idx] = (Math.random() - 0.5) * 26;
      cyanPositions[idx + 1] = (Math.random() - 0.5) * 20;
      cyanPositions[idx + 2] = (Math.random() - 0.5) * 14 - 3;
    }

    const cyanGeo = new THREE.BufferGeometry();
    cyanGeo.setAttribute('position', new THREE.BufferAttribute(cyanPositions, 3));

    const cyanMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const cyanParticles = new THREE.Points(cyanGeo, cyanMat);
    particleGroup.add(cyanParticles);

    // 3. Mouse Inertia Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 4. GSAP Scroll-Linked Parallax Scrubbing
    const scrollCtx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          // Subtly shift camera Z-depth and Y-drift with page momentum
          camera.position.y = -progress * 6;
          camera.position.z = 10 - progress * 2.5;
        }
      });
    });

    // 5. Continuous RAF Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow organic rotation & drift
      orangeParticles.rotation.y = elapsed * 0.035;
      orangeParticles.rotation.x = Math.sin(elapsed * 0.02) * 0.05;
      cyanParticles.rotation.y = -elapsed * 0.025;
      cyanParticles.rotation.z = Math.cos(elapsed * 0.03) * 0.04;

      // Mouse inertia damping
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      particleGroup.rotation.y = mouse.x * 0.35;
      particleGroup.rotation.x = -mouse.y * 0.35;

      renderer.render(scene, camera);
    };
    animate();

    // 6. Viewport Resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      scrollCtx.revert();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      orangeGeo.dispose();
      orangeMat.dispose();
      cyanGeo.dispose();
      cyanMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true"
    />
  );
}
