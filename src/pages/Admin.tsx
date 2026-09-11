import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft, Github, Linkedin, Twitter, Instagram, Youtube, Facebook, Music2, Link as LinkIcon, Briefcase, Code, Share2, X, LogOut, Terminal, Search, Mail, ShieldCheck, Cpu } from 'lucide-react';
import { getPortfolioData, savePortfolioData, PortfolioData, Experience, Project, StackItem, Social } from '../services/dataService';
import { TECH_ICONS, getIconUrl } from '../constants/techIcons';
import Loader from '../components/Loader';

const SOCIAL_LIST = [
  { name: 'GitHub', icon: <Github size={20} /> },
  { name: 'LinkedIn', icon: <Linkedin size={20} /> },
  { name: 'Twitter', icon: <Twitter size={20} /> },
  { name: 'X', icon: <Twitter size={20} /> },
  { name: 'Instagram', icon: <Instagram size={20} /> },
  { name: 'YouTube', icon: <Youtube size={20} /> },
  { name: 'Facebook', icon: <Facebook size={20} /> },
  { name: 'TikTok', icon: <Music2 size={20} /> },
  { name: 'Email', icon: <Mail size={20} /> },
];

const SOCIAL_PREVIEW_MAP: Record<string, React.ReactNode> = {
  'GitHub': <Github size={18} />,
  'LinkedIn': <Linkedin size={18} />,
  'Twitter': <Twitter size={18} />,
  'X': <Twitter size={18} />,
  'Instagram': <Instagram size={18} />,
  'YouTube': <Youtube size={18} />,
  'Facebook': <Facebook size={18} />,
  'TikTok': <Music2 size={18} />,
  'Email': <Mail size={18} />,
};

export default function Admin() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'experience' | 'projects' | 'stack' | 'socials'>('experience');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'experience' | 'projects' | 'stack' | 'socials' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/';
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const loadData = async () => {
    try {
      const result = await getPortfolioData();
      setData(result);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to synchronize with server' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await savePortfolioData(data);
      setStatus({ type: 'success', message: 'Content published successfully' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to publish changes' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center font-mono text-accent">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <span className="animate-pulse tracking-[0.3em] text-[10px]">INITIALIZING CMS CONSOLE</span>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="min-h-screen bg-bg text-fg font-sans selection:bg-accent selection:text-white p-6 md:p-12 relative select-none overflow-x-hidden">
      
      {/* Admin Dedicated Subtle Wireframe Drafting Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Subtle grid & dot matrix */}
        <div className="absolute inset-0 tech-grid-bg opacity-40" />
        <div className="absolute inset-0 tech-dot-bg opacity-25" />

        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Outer Framing Chassis */}
          <rect x="60" y="45" width="1800" height="990" rx="4" fill="none" stroke="currentColor" strokeWidth="1" className="text-fg/20" />
          
          {/* Continuous Architectural Guide Conduits */}
          <line x1="240" y1="-50" x2="240" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />
          <line x1="1680" y1="-50" x2="1680" y2="1150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" className="text-fg/20" />

          {/* _(5) Stepped Cyber Rail across Upper Background */}
          <polygon
            points="240,140 860,140 900,175 1640,175 1640,210 880,210 840,175 240,175"
            fill="rgba(11, 13, 16, 0.035)"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-fg/30"
          />

          {/* Stazquez Right Bank: 8 Stacked Angled Louver Slot Capsules */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
            const y = 260 + idx * 24;
            return (
              <polygon
                key={`admin-louver-rt-${idx}`}
                points={`1720,${y} 1790,${y - 20} 1806,${y - 20} 1736,${y}`}
                fill="rgba(11, 13, 16, 0.04)"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-fg/30"
              />
            );
          })}

          {/* Stazquez Bottom-Left: Double Horizontal Beveled Stadium Bars */}
          <polygon
            points="80,940 440,940 465,965 105,965"
            fill="rgba(11, 13, 16, 0.04)"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-fg/30"
          />
          <polygon
            points="80,980 400,980 425,1005 105,1005"
            fill="rgba(11, 13, 16, 0.04)"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-fg/30"
          />

          {/* _(5) Mechanical Eyelet Accent */}
          <circle cx="240" cy="158" r="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/35" />
          <circle cx="240" cy="158" r="5" fill="#FF5500" />

          {/* Corner Registration Brackets */}
          <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />
          <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="currentColor" strokeWidth="2" className="text-fg/45" />

          <text x="120" y="70" fontFamily="monospace" fontSize="9" fontWeight="bold" className="fill-accent">CONTROL_PLANE // CMS_V26</text>
          <text x="1800" y="160" fontFamily="monospace" fontSize="12" fontWeight="bold" className="fill-accent">☒</text>
        </svg>

        <div className="absolute right-8 top-10 font-mono text-[8vw] font-black text-fg/[0.02] leading-none pointer-events-none select-none">
          CMS_CONSOLE
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header HUD Chassis */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-fg/15 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <a href="/" className="text-fg hover:text-accent transition-colors p-2.5 border border-fg/20 bg-surface hud-pill">
                <ArrowLeft className="w-4 h-4" />
              </a>
              <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight">
                CMS CONTROL CONSOLE
              </h1>
            </div>
            <p className="font-mono text-[9px] text-accent font-bold tracking-wider uppercase">
              // STATION_LIDETA // DB_SYNC_ACTIVE // 380/AC002
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 border border-fg/20 bg-surface hover:border-accent hover:text-accent font-mono text-[10px] uppercase tracking-widest font-bold transition-colors cursor-none hud-pill"
            >
              <LogOut size={13} />
              <span>TERMINATE_SESSION</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white hover:bg-accent-hover transition-all font-mono text-[10px] uppercase tracking-widest font-bold shadow-[0_4px_16px_rgba(255,85,0,0.3)] cursor-none hud-pill"
            >
              {saving ? (
                <Loader />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>PUBLISH_CHANGES</span>
                </>
              )}
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Tabs */}
          <aside className="md:w-60 shrink-0">
            <nav className="flex flex-col gap-2.5 sticky top-12">
              <TabButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<Briefcase size={16} />} label="Career" />
              <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<LinkIcon size={16} />} label="Projects" />
              <TabButton active={activeTab === 'stack'} onClick={() => setActiveTab('stack')} icon={<Code size={16} />} label="Tech Stack" />
              <TabButton active={activeTab === 'socials'} onClick={() => setActiveTab('socials')} icon={<Share2 size={16} />} label="Socials" />
            </nav>
          </aside>

          {/* Editor Area */}
          <main className="flex-grow min-w-0">
            {activeTab === 'experience' && (
              <SectionWrapper title="Career Timeline Milestones" onAdd={() => {
                setAddModalType('experience');
                setShowAddModal(true);
              }}>
                {/* Visual Vertical Timeline Layout for Admin */}
                <div className="relative pl-6 sm:pl-10">
                  {/* Vertical Timeline Rail Track */}
                  <div className="absolute left-[12px] sm:left-[20px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-accent via-fg/30 to-fg/10" />

                  <div className="flex flex-col gap-8">
                    {data.experience.map((exp, i) => {
                      const isCurrent = i === 0;
                      return (
                        <div key={`${exp.role}-${i}`} className="relative flex items-start gap-4 sm:gap-6 group">
                          {/* Timeline Node Pip */}
                          <div className="relative flex-shrink-0 z-20 mt-4">
                            {isCurrent ? (
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-[0_0_15px_rgba(255,85,0,0.4)] ring-2 ring-accent/30">
                                01
                              </div>
                            ) : (
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface border-2 border-fg/30 text-fg flex items-center justify-center font-mono text-[9px] font-bold group-hover:border-accent group-hover:text-accent transition-colors">
                                0{i + 1}
                              </div>
                            )}
                          </div>

                          {/* Timeline Card */}
                          <div className="flex-1">
                            <ItemCard onDelete={() => setData({ ...data, experience: data.experience.filter((_, idx) => idx !== i) })}>
                              <div className="flex items-center justify-between border-b border-fg/10 pb-3 mb-4">
                                <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
                                  // TIMELINE_NODE_0{i + 1}
                                </span>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent font-mono text-[8px] font-bold uppercase">
                                    ACTIVE_POSITION
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input label="Period" value={exp.period} onChange={(val) => {
                                  const newExp = [...data.experience];
                                  newExp[i].period = val;
                                  setData({ ...data, experience: newExp });
                                }} />
                                <Input label="Role" value={exp.role} onChange={(val) => {
                                  const newExp = [...data.experience];
                                  newExp[i].role = val;
                                  setData({ ...data, experience: newExp });
                                }} />
                              </div>
                              <TextArea label="Description" value={exp.desc} onChange={(val) => {
                                const newExp = [...data.experience];
                                newExp[i].desc = val;
                                setData({ ...data, experience: newExp });
                              }} />
                            </ItemCard>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SectionWrapper>
            )}

            {activeTab === 'projects' && (
              <SectionWrapper title="Projects Registry" onAdd={() => {
                setAddModalType('projects');
                setShowAddModal(true);
              }}>
                <div className="flex flex-col gap-6">
                  {data.projects.map((proj, i) => (
                    <ItemCard key={`${proj.id}-${i}`} onDelete={() => setData({ ...data, projects: data.projects.filter((_, idx) => idx !== i) })}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-mono text-[9px] uppercase tracking-[0.25em] text-fg/50">// DB_ID</label>
                          <div className="bg-fg/[0.02] border border-fg/15 px-3.5 py-2.5 text-xs text-fg/50 font-mono select-none">
                            {proj.id ?? '—'}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <Input label="Title" value={proj.title} onChange={(val) => {
                            const newProj = [...data.projects];
                            newProj[i].title = val;
                            setData({ ...data, projects: newProj });
                          }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input label="Metadata" value={proj.meta} onChange={(val) => {
                          const newProj = [...data.projects];
                          newProj[i].meta = val;
                          setData({ ...data, projects: newProj });
                        }} />
                        <Input label="Repo Link" value={proj.repo} onChange={(val) => {
                          const newProj = [...data.projects];
                          newProj[i].repo = val;
                          setData({ ...data, projects: newProj });
                        }} />
                      </div>
                      <div className="mb-4">
                        <Input label="Website Link" value={proj.link} onChange={(val) => {
                          const newProj = [...data.projects];
                          newProj[i].link = val;
                          setData({ ...data, projects: newProj });
                        }} />
                      </div>
                      <TextArea label="Description" value={proj.desc} onChange={(val) => {
                        const newProj = [...data.projects];
                        newProj[i].desc = val;
                        setData({ ...data, projects: newProj });
                      }} />
                      <TextArea label="Detailed Description" value={proj.detailedDesc || ''} onChange={(val) => {
                        const newProj = [...data.projects];
                        newProj[i].detailedDesc = val;
                        setData({ ...data, projects: newProj });
                      }} />
                      <div className="mt-4">
                        <TechPillsInput 
                          label="Technologies" 
                          techs={proj.technologies || []} 
                          onChange={(techs) => {
                            const newProj = [...data.projects];
                            newProj[i].technologies = techs;
                            setData({ ...data, projects: newProj });
                          }} 
                        />
                      </div>
                    </ItemCard>
                  ))}
                </div>
              </SectionWrapper>
            )}

            {activeTab === 'stack' && (
              <SectionWrapper title="Tech Stack Matrix" onAdd={() => {
                setAddModalType('stack');
                setShowAddModal(true);
              }}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.stack.map((item, i) => (
                    <motion.div 
                      key={`${item.name}-${i}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group bg-surface/90 border border-fg/15 p-5 relative flex flex-col items-center gap-3 hover:border-accent transition-all hud-plate-c"
                    >
                      <button
                        onClick={() => setData({ ...data, stack: data.stack.filter((_, idx) => idx !== i) })}
                        className="absolute top-2 right-2 p-1 text-fg/40 hover:text-accent transition-all cursor-none"
                      >
                        <X size={13} />
                      </button>
                      <div className="w-10 h-10 flex items-center justify-center filter grayscale">
                        {TECH_ICONS[item.name] ? (
                          <img 
                            src={getIconUrl(TECH_ICONS[item.name].slug)} 
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Terminal size={20} className="text-accent" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-mono text-[9.5px] uppercase tracking-wider text-fg font-bold">{item.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SectionWrapper>
            )}

            {activeTab === 'socials' && (
              <SectionWrapper title="Social Frequency Links" onAdd={() => {
                setAddModalType('socials');
                setShowAddModal(true);
              }}>
                <div className="flex flex-col gap-4">
                  {data.socials.map((soc, i) => (
                    <ItemCard key={`${soc.name}-${i}`} onDelete={() => setData({ ...data, socials: data.socials.filter((_, idx) => idx !== i) })}>
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-fg/10">
                        <div className="w-8 h-8 flex items-center justify-center bg-fg/[0.04] border border-fg/15 text-accent">
                          {SOCIAL_PREVIEW_MAP[soc.name] || <Share2 size={16} />}
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-fg font-bold">{soc.name}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Network Name" value={soc.name} onChange={(val) => {
                          const newSocials = [...data.socials];
                          newSocials[i].name = val;
                          setData({ ...data, socials: newSocials });
                        }} />
                        <Input label="URL" value={soc.url} onChange={(val) => {
                          const newSocials = [...data.socials];
                          newSocials[i].url = val;
                          setData({ ...data, socials: newSocials });
                        }} />
                      </div>
                    </ItemCard>
                  ))}
                </div>
              </SectionWrapper>
            )}
          </main>
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-fg/50 backdrop-blur-md z-[5000] flex items-center justify-center p-6"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-surface border border-fg/20 p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto relative hud-plate-a"
            >
              <div className="flex justify-between items-center mb-8 border-b border-fg/10 pb-4">
                <h3 className="text-xl font-display font-black uppercase text-fg leading-none">
                  New {addModalType?.toUpperCase()}
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-fg/50 hover:text-accent transition-colors cursor-none"
                >
                  <X size={18} />
                </button>
              </div>

              {addModalType === 'stack' || addModalType === 'socials' ? (
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fg/40" size={16} />
                    <input 
                      type="text"
                      placeholder={`Search ${addModalType}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-fg/[0.02] border border-fg/20 pl-11 pr-4 py-3 text-fg focus:outline-none focus:border-accent transition-all font-mono text-xs placeholder:text-fg/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(addModalType === 'stack' ? Object.values(TECH_ICONS) : SOCIAL_LIST)
                      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(item => (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (addModalType === 'stack') {
                              if (!data!.stack.some(s => s.name === item.name)) {
                                const techItem = item as any;
                                setData({ ...data!, stack: [...data!.stack, { name: techItem.name, color: techItem.color }] });
                              }
                            } else {
                              if (!data!.socials.some(s => s.name === item.name)) {
                                setData({ ...data!, socials: [...data!.socials, { name: item.name, url: '' }] });
                              }
                            }
                            setShowAddModal(false);
                            setSearchTerm('');
                          }}
                          className="flex flex-col items-center gap-2.5 p-4 bg-surface border border-fg/15 hover:border-accent hover:bg-fg/[0.02] transition-all group cursor-none hud-pill"
                        >
                          <div className="w-8 h-8 flex items-center justify-center filter grayscale group-hover:grayscale-0">
                            {addModalType === 'stack' ? (
                              <img src={getIconUrl((item as any).slug)} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-fg group-hover:text-accent">{(item as any).icon}</div>
                            )}
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-center font-bold text-fg">{item.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                <AddForm 
                  type={addModalType!} 
                  onAdd={(item) => {
                    if (addModalType === 'experience') {
                      setData({ ...data, experience: [item as Experience, ...data.experience] });
                    } else if (addModalType === 'projects') {
                      setData({ ...data, projects: [...data.projects, item as Project] });
                    } else if (addModalType === 'socials') {
                      setData({ ...data, socials: [...data.socials, item as Social] });
                    }
                    setShowAddModal(false);
                  }} 
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Modal Overlay */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-fg/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 15 }}
              className="max-w-sm w-full bg-surface border border-fg/20 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-center relative overflow-hidden hud-plate-a"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center bg-fg text-surface">
                  {status.type === 'success' ? <Save size={22} className="text-accent" /> : <X size={22} />}
                </div>
                
                <h3 className="text-xl font-display font-black uppercase mb-2 tracking-tight text-fg">
                  {status.type === 'success' ? 'Changes Published' : 'System Alert'}
                </h3>
                
                <p className="text-muted text-[10px] leading-relaxed mb-6 font-bold uppercase font-mono">
                  {status.message}
                </p>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus(null);
                    if (status.type === 'success') {
                      navigate('/');
                    }
                  }}
                  className="w-full py-3 bg-fg text-surface font-mono text-[9px] uppercase tracking-[0.25em] hover:bg-accent hover:text-white transition-all font-bold cursor-none hud-pill"
                >
                  {status.type === 'success' ? 'Back to Dashboard' : 'Close'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SectionWrapper: React.FC<{ title: string, children: React.ReactNode, onAdd: () => void }> = ({ title, children, onAdd }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6 border-b border-fg/10 pb-4">
        <h2 className="text-lg font-mono uppercase tracking-[0.2em] text-muted font-bold">// {title}</h2>
        <button
          onClick={onAdd}
          className="p-2 border border-fg/20 text-fg hover:bg-accent hover:border-accent hover:text-white transition-all cursor-none hud-pill"
        >
          <Plus size={16} />
        </button>
      </div>
      {children}
    </motion.div>
  );
}

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-3 border transition-all duration-300 text-left font-mono text-[10px] uppercase tracking-wider font-bold cursor-none hud-pill ${
        active 
          ? 'bg-accent text-white border-accent shadow-[0_4px_16px_rgba(255,85,0,0.3)]' 
          : 'bg-surface border-fg/15 text-fg/70 hover:bg-fg/5 hover:border-fg/30 hover:text-fg'
      }`}
    >
      <span className={active ? 'text-white' : 'text-accent'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const ItemCard: React.FC<{ children: React.ReactNode, onDelete: () => void }> = ({ children, onDelete }) => {
  return (
    <div className="bg-surface/90 border border-fg/15 p-6 relative group transition-all hover:border-accent shadow-sm hud-plate-a">
      <button
        onClick={onDelete}
        className="absolute top-4 right-4 p-1.5 border border-fg/15 hover:bg-accent hover:border-accent hover:text-white text-muted opacity-0 group-hover:opacity-100 transition-all bg-surface cursor-none"
        title="Delete item"
      >
        <Trash2 size={13} />
      </button>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string, type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[9px] uppercase tracking-[0.25em] text-fg/50">// {label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-fg/[0.02] border border-fg/20 px-3.5 py-2.5 focus:outline-none focus:border-accent transition-colors w-full text-xs text-fg placeholder:text-fg/25 font-mono"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[9px] uppercase tracking-[0.25em] text-fg/50">// {label}</label>
      <textarea
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-fg/[0.02] border border-fg/20 px-3.5 py-2.5 focus:outline-none focus:border-accent transition-colors w-full text-xs text-fg resize-none placeholder:text-fg/25 font-mono"
      />
    </div>
  );
}

function TechPillsInput({ 
  label, 
  techs, 
  onChange 
}: { 
  label: string, 
  techs: string[], 
  onChange: (techs: string[]) => void 
}) {
  const [inputValue, setInputValue] = useState('');

  const addTech = () => {
    if (inputValue.trim() && !techs.includes(inputValue.trim())) {
      onChange([...techs, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTech = (tech: string) => {
    onChange(techs.filter(t => t !== tech));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[9px] uppercase tracking-[0.25em] text-fg/50">// {label}</label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTech();
            }
          }}
          placeholder="Add technology..."
          className="bg-fg/[0.02] border border-fg/20 px-3.5 py-2.5 pr-10 focus:outline-none focus:border-accent transition-colors w-full text-xs text-fg placeholder:text-fg/25 font-mono"
        />
        <button
          type="button"
          onClick={addTech}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-fg hover:text-accent transition-colors cursor-none"
        >
          <Plus size={15} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {techs.map((tech, idx) => (
          <span 
            key={idx}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono border border-fg/15 text-fg bg-fg/[0.03] hover:bg-fg/[0.06] transition-colors font-semibold uppercase"
          >
            {tech}
            <button 
              type="button"
              onClick={() => removeTech(tech)}
              className="hover:text-accent transition-colors cursor-none"
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function AddForm({ type, onAdd }: { type: string, onAdd: (item: any) => void }) {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  if (type === 'experience') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Period" 
          value={formData.period || ''} 
          placeholder="e.g. 2024 — Present"
          onChange={(val) => setFormData({ ...formData, period: val })} 
        />
        <Input 
          label="Role" 
          value={formData.role || ''} 
          placeholder="e.g. Lead Product Engineer"
          onChange={(val) => setFormData({ ...formData, role: val })} 
        />
        <TextArea 
          label="Description" 
          value={formData.desc || ''} 
          placeholder="Description of achievements and technical scope..."
          onChange={(val) => setFormData({ ...formData, desc: val })} 
        />
        <FormSubmit />
      </form>
    );
  }

  if (type === 'projects') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="ID" 
            value={formData.id || ''} 
            placeholder="01"
            onChange={(val) => setFormData({ ...formData, id: val })} 
          />
          <Input 
            label="Title" 
            value={formData.title || ''} 
            placeholder="Project Name"
            onChange={(val) => setFormData({ ...formData, title: val })} 
          />
        </div>
        <Input 
          label="Metadata" 
          value={formData.meta || ''} 
          placeholder="e.g. Full-Stack / Distributed System"
          onChange={(val) => setFormData({ ...formData, meta: val })} 
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Repo Link" 
            value={formData.repo || ''} 
            placeholder="https://github.com/..."
            onChange={(val) => setFormData({ ...formData, repo: val })} 
          />
          <Input 
            label="Website Link" 
            value={formData.link || ''} 
            placeholder="https://live-site.com"
            onChange={(val) => setFormData({ ...formData, link: val })} 
          />
        </div>
        <TextArea 
          label="Description" 
          value={formData.desc || ''} 
          placeholder="Brief summary for specimen plate."
          onChange={(val) => setFormData({ ...formData, desc: val })} 
        />
        <TextArea 
          label="Detailed Description" 
          value={formData.detailedDesc || ''} 
          placeholder="Detailed architectural specifications for inspection drawer."
          onChange={(val) => setFormData({ ...formData, detailedDesc: val })} 
        />
        <TechPillsInput 
          label="Technologies" 
          techs={formData.technologies || []} 
          onChange={(techs) => setFormData({ 
            ...formData, 
            technologies: techs
          })} 
        />
        <FormSubmit />
      </form>
    );
  }

  if (type === 'socials') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Network Name" 
          value={formData.name || ''} 
          placeholder="e.g. GitHub, LinkedIn, Twitter"
          onChange={(val) => setFormData({ ...formData, name: val })} 
        />
        <Input 
          label="URL" 
          value={formData.url || ''} 
          placeholder="https://..."
          onChange={(val) => setFormData({ ...formData, url: val })} 
        />
        <FormSubmit />
      </form>
    );
  }

  return null;
}

function FormSubmit() {
  return (
    <button
      type="submit"
      className="w-full py-3 bg-accent hover:bg-accent-hover text-white transition-all font-mono text-xs uppercase tracking-widest font-bold shadow-[0_4px_16px_rgba(255,85,0,0.3)] cursor-none hud-pill mt-4"
    >
      + COMMIT NEW RECORD
    </button>
  );
}
