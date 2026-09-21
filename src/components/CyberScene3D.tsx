import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CyberScene3DProps {
  isWireframe?: boolean;
}

export default function CyberScene3D({ isWireframe = false }: CyberScene3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isWireframeRef = useRef(isWireframe);
  isWireframeRef.current = isWireframe;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xff5500, 3.5);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00e5ff, 2.5);
    cyanRimLight.position.set(-5, -4, -3);
    scene.add(cyanRimLight);

    // 3. The 3D Master Cyber-Artifact Group
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);

    // Geometry A: Central Quantum Reactor Core (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x111620,
      emissive: 0xff5500,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.9,
      wireframe: isWireframeRef.current
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    artifactGroup.add(coreMesh);

    // Inner Plasma Sphere
    const innerPlasmaGeo = new THREE.SphereGeometry(0.85, 24, 24);
    const innerPlasmaMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const innerPlasma = new THREE.Mesh(innerPlasmaGeo, innerPlasmaMat);
    artifactGroup.add(innerPlasma);

    // Geometry B: Concentric Floating Gimbal Rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x1a2130,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.95,
      wireframe: isWireframeRef.current
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.045, 16, 100), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.035, 16, 100), ringMat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.025, 16, 100), ringMat);

    ring1.rotation.x = Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    ring3.rotation.z = Math.PI / 6;

    artifactGroup.add(ring1);
    artifactGroup.add(ring2);
    artifactGroup.add(ring3);

    // Geometry C: Outer Particle Swarm (650 Points)
    const particleCount = 650;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 3.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xff5500,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    artifactGroup.add(particles);

    // 4. Mouse Coordinates and Inertia Physics
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 5. GSAP ScrollTrigger Integration for Camera & Artifact Choreography
    const scrollCtx = gsap.context(() => {
      // Timeline 1: Experience section (shifts right, tilts)
      ScrollTrigger.create({
        trigger: '#experience',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          // Smoothly glide artifact to the right to frame left-side experience cards
          gsap.to(artifactGroup.position, {
            x: p * 2.8,
            y: -p * 0.4,
            z: -p * 1.2,
            duration: 0.5,
            overwrite: 'auto'
          });
        }
      });

      // Timeline 2: Work section (elevates and centers above project deck)
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.to(artifactGroup.position, {
            x: (1 - p) * 2.8,
            y: 1.6 * p,
            z: -1.5,
            duration: 0.5,
            overwrite: 'auto'
          });
          gsap.to(ring3.scale, {
            x: 1 + p * 0.4,
            y: 1 + p * 0.4,
            z: 1 + p * 0.4,
            duration: 0.5,
            overwrite: 'auto'
          });
        }
      });

      // Timeline 3: Stack section (expands gimbal rings outward)
      ScrollTrigger.create({
        trigger: '#stack',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.to(artifactGroup.position, {
            x: -p * 2.2,
            y: -0.2,
            z: -1.0,
            duration: 0.5,
            overwrite: 'auto'
          });
        }
      });

      // Timeline 4: Footer section (converges into glowing energy beacon)
      ScrollTrigger.create({
        trigger: '#footer',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.to(artifactGroup.position, {
            x: 0,
            y: -0.6 * p,
            z: 0.5 * p,
            duration: 0.5,
            overwrite: 'auto'
          });
          gsap.to(coreMesh.scale, {
            x: 1 - p * 0.35,
            y: 1 - p * 0.35,
            z: 1 - p * 0.35,
            duration: 0.5,
            overwrite: 'auto'
          });
        }
      });
    });

    // 6. Animation Loop (60-120 FPS synchronized)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Dynamic Wireframe state check
      if (coreMat.wireframe !== isWireframeRef.current) {
        coreMat.wireframe = isWireframeRef.current;
        ringMat.wireframe = isWireframeRef.current;
        coreMat.needsUpdate = true;
        ringMat.needsUpdate = true;
      }

      // Gyroscopic Rotations on concentric rings
      coreMesh.rotation.y += delta * 0.3;
      coreMesh.rotation.x += delta * 0.15;
      innerPlasma.rotation.y -= delta * 0.5;

      ring1.rotation.x += delta * 0.45;
      ring1.rotation.y += delta * 0.2;
      ring2.rotation.y += delta * 0.35;
      ring2.rotation.z += delta * 0.25;
      ring3.rotation.z += delta * 0.3;
      ring3.rotation.x += delta * 0.2;

      particles.rotation.y += delta * 0.08;

      // Mouse inertia damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      artifactGroup.rotation.y = mouse.x * 0.45 + Math.sin(elapsed * 0.4) * 0.1;
      artifactGroup.rotation.x = -mouse.y * 0.45 + Math.cos(elapsed * 0.3) * 0.1;

      // Core energetic pulsation
      const pulse = 1 + Math.sin(elapsed * 2.8) * 0.04;
      innerPlasma.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };
    animate();

    // 7. Responsive Resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount to free 100% GPU memory
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      scrollCtx.revert();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      innerPlasmaGeo.dispose();
      innerPlasmaMat.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
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
