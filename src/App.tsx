import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cursor, { CursorType } from './components/Cursor';
import Background from './components/Background';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Work from './components/Work';
import Stack from './components/Stack';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Modal from './components/Modal';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { getPortfolioData, PortfolioData } from './services/dataService';

// Add a simple ProtectedRoute component
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [containerRef.current]);

  return (
    <div className="snap-container" ref={containerRef}>
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
      <main className="relative h-screen overflow-hidden">
        <Cursor type={cursorType} />
        <Background />
        
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
            <div className="h-screen overflow-y-auto">
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            </div>
          } />
          <Route path="/login" element={
            <div className="h-screen overflow-y-auto">
              <Login />
            </div>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
