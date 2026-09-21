import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Cursor, { CursorType } from './components/Cursor';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Work from './components/Work';
import Stack from './components/Stack';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Modal from './components/Modal';
import SciFiGateLoader from './components/SciFiGateLoader';
import TacticalHudOverlay from './components/TacticalHudOverlay';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { getPortfolioData, PortfolioData } from './services/dataService';

gsap.registerPlugin(ScrollTrigger);

// ProtectedRoute component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function LandingPage({ 
  data, 
  setCursorType, 
  setIsInFooter, 
  setSelectedProjectId, 
  selectedProjectId, 
  isInFooter
}: { 
  data: PortfolioData | null,
  setCursorType: (type: CursorType) => void,
  setIsInFooter: (inFooter: boolean) => void,
  setSelectedProjectId: (id: string | null) => void,
  selectedProjectId: string | null,
  isInFooter: boolean
}) {
  const [activeSection, setActiveSection] = useState('hero');
  const sections = ['hero', 'experience', 'work', 'stack', 'footer'];

  // Track active section smoothly during Lenis inertia scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative z-10 bg-transparent min-h-screen">
      {/* Fixed Screen-Space Tactical HUD Layer */}
      <TacticalHudOverlay 
        activeSection={activeSection}
      />

      <Navigation isInFooter={isInFooter} activeSection={activeSection} />
      <Hero />
      <Experience data={data?.experience || []} />
      <Work 
        data={data?.projects || []}
        onSelectProject={setSelectedProjectId} 
      />
      <Stack data={data?.stack || []} />
      <Footer 
        data={data?.socials || []}
        onFooterIntersect={(isIntersecting) => {
          setIsInFooter(isIntersecting);
          if (selectedProjectId) return;
          setCursorType(isIntersecting ? 'footer' : 'default');
        }}
      />
      <Modal 
        projectId={selectedProjectId} 
        onClose={() => setSelectedProjectId(null)}
        projects={data?.projects || []}
      />
    </div>
  );
}

export default function App() {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isInFooter, setIsInFooter] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isGateOpen, setIsGateOpen] = useState(false);

  // Initialize Lenis Smooth Inertia Scrolling Engine & GSAP Ticker Synchronization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    getPortfolioData().then(setData).catch(console.error);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProjectId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <BrowserRouter>
      {/* Sci-Fi Hydraulic Blast Gate & Reactor Loader */}
      {!isGateOpen && (
        <SciFiGateLoader onComplete={() => setIsGateOpen(true)} />
      )}

      <main className="relative min-h-screen bg-bg overflow-x-hidden">
        <Cursor type={cursorType} />
        <div className="grain-overlay pointer-events-none" />
        
        <Routes>
          <Route path="/" element={
            <LandingPage 
              data={data} 
              setCursorType={setCursorType}
              setIsInFooter={setIsInFooter}
              setSelectedProjectId={setSelectedProjectId}
              selectedProjectId={selectedProjectId}
              isInFooter={isInFooter}
            />
          } />
          <Route path="/admin" element={
            <div className="min-h-screen overflow-y-auto">
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            </div>
          } />
          <Route path="/login" element={
            <div className="min-h-screen overflow-y-auto">
              <Login />
            </div>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
