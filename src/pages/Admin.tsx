import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft, Github, Linkedin, Twitter, Instagram, Youtube, Facebook, Music2, Link as LinkIcon, Briefcase, Code, Share2, X, LogOut, Terminal, Search, Mail } from 'lucide-react';
import { getPortfolioData, savePortfolioData, PortfolioData, Experience, Project, StackItem, Social } from '../services/dataService';
import { TECH_ICONS, getIconUrl } from '../constants/techIcons';
import Loader from '../components/Loader';

const SOCIAL_LIST = [
  { name: 'GitHub', icon: <Github size={24} /> },
  { name: 'LinkedIn', icon: <Linkedin size={24} /> },
  { name: 'Twitter', icon: <Twitter size={24} /> },
  { name: 'X', icon: <Twitter size={24} /> },
  { name: 'Instagram', icon: <Instagram size={24} /> },
  { name: 'YouTube', icon: <Youtube size={24} /> },
  { name: 'Facebook', icon: <Facebook size={24} /> },
  { name: 'TikTok', icon: <Music2 size={24} /> },
  { name: 'Email', icon: <Mail size={24} /> },
];

const SOCIAL_PREVIEW_MAP: Record<string, React.ReactNode> = {
  'GitHub': <Github size={20} />,
  'LinkedIn': <Linkedin size={20} />,
  'Twitter': <Twitter size={20} />,
  'X': <Twitter size={20} />,
  'Instagram': <Instagram size={20} />,
  'YouTube': <Youtube size={20} />,
  'Facebook': <Facebook size={20} />,
  'TikTok': <Music2 size={20} />,
  'Email': <Mail size={20} />,
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
        <span className="animate-pulse tracking-[0.3em] text-[10px]">INITIALIZING CMS</span>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="min-h-screen bg-bg text-fg font-sans selection:bg-accent selection:text-white p-6 md:p-12 relative">
      {/* Background grids matching global style */}
      <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 tech-dot-bg opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b-2 border-fg pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <a href="/" className="text-fg hover:text-accent transition-colors p-1 border-2 border-transparent hover:border-fg">
                <ArrowLeft className="w-5 h-5" />
              </a>
              <h1 className="text-3xl font-display font-black uppercase tracking-tight">Content Manager</h1>
            </div>
            <p className="font-mono text-[9px] text-fg/40 tracking-wider uppercase">// LOCALHOST_STATION_DATABASE</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-fg/30 hover:border-accent hover:text-accent font-mono text-[10px] uppercase tracking-widest transition-colors cursor-none"
            >
              <LogOut size={14} />
              Exit
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-fg text-bg border-2 border-fg hover:bg-accent hover:border-accent hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest font-bold cursor-none"
            >
              {saving ? (
                <Loader />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  PUBLISH_CHANGES
                </>
              )}
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Tabs */}
          <aside className="md:w-64 shrink-0">
            <nav className="flex flex-col gap-2.5 sticky top-12">
              <TabButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<Briefcase size={18} />} label="Professional Journey" />
              <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<LinkIcon size={18} />} label="Project Index" />
              <TabButton active={activeTab === 'stack'} onClick={() => setActiveTab('stack')} icon={<Code size={18} />} label="Core Tech Stack" />
              <TabButton active={activeTab === 'socials'} onClick={() => setActiveTab('socials')} icon={<Share2 size={18} />} label="Social Dispatches" />
            </nav>
          </aside>

          {/* Editor Area */}
          <main className="flex-grow min-w-0">
            {activeTab === 'experience' && (
              <SectionWrapper title="Professional Journey" onAdd={() => {
                setAddModalType('experience');
                setShowAddModal(true);
              }}>
                <div className="flex flex-col gap-8">
                  {data.experience.map((exp, i) => (
                    <ItemCard key={`${exp.role}-${i}`} onDelete={() => setData({ ...data, experience: data.experience.filter((_, idx) => idx !== i) })}>
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
                  ))}
                </div>
              </SectionWrapper>
            )}

            {activeTab === 'projects' && (
              <SectionWrapper title="Previous Projects" onAdd={() => {
                setAddModalType('projects');
                setShowAddModal(true);
              }}>
                <div className="flex flex-col gap-8">
                  {data.projects.map((proj, i) => (
                    <ItemCard key={`${proj.id}-${i}`} onDelete={() => setData({ ...data, projects: data.projects.filter((_, idx) => idx !== i) })}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input label="ID" value={proj.id} onChange={(val) => {
                          const newProj = [...data.projects];
                          newProj[i].id = val;
                          setData({ ...data, projects: newProj });
                        }} />
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
              <SectionWrapper title="Tech Stack" onAdd={() => {
                setAddModalType('stack');
                setShowAddModal(true);
              }}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {data.stack.map((item, i) => (
                    <motion.div 
                      key={`${item.name}-${i}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group bg-fg/[0.02] border-2 border-fg p-6 relative flex flex-col items-center gap-4 hover:bg-fg/[0.04] transition-all rounded-none"
                    >
                      <button
                        onClick={() => setData({ ...data, stack: data.stack.filter((_, idx) => idx !== i) })}
                        className="absolute top-2 right-2 p-1 border border-transparent hover:border-fg hover:text-accent text-muted transition-all bg-bg rounded-none cursor-none"
                      >
                        <X size={14} />
                      </button>
                      <div className="w-12 h-12 flex items-center justify-center bg-fg/[0.04] border border-fg/20 text-accent p-2">
                        {TECH_ICONS[item.name] ? (
                          <img 
                            src={getIconUrl(TECH_ICONS[item.name].slug)} 
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Terminal size={24} />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg font-bold">{item.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SectionWrapper>
            )}

            {activeTab === 'socials' && (
              <SectionWrapper title="Social Links" onAdd={() => {
                setAddModalType('socials');
                setShowAddModal(true);
              }}>
                <div className="flex flex-col gap-4">
                  {data.socials.map((soc, i) => (
                    <ItemCard key={`${soc.name}-${i}`} onDelete={() => setData({ ...data, socials: data.socials.filter((_, idx) => idx !== i) })}>
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-fg/10">
                        <div className="w-10 h-10 flex items-center justify-center bg-fg/[0.04] border border-fg/20 text-accent">
                          {SOCIAL_PREVIEW_MAP[soc.name] || <Share2 size={20} />}
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg font-bold">{soc.name}</p>
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
            className="fixed inset-0 bg-fg/40 backdrop-blur-sm z-[5000] flex items-center justify-center p-6"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-bg border-2 border-fg p-8 md:p-12 shadow-[8px_8px_0px_#0B0D11] max-h-[90vh] overflow-y-auto rounded-none relative"
            >
              {/* Corner Tech Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent" />

              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-display font-black uppercase text-fg leading-none">
                  New {addModalType?.charAt(0).toUpperCase()}{addModalType?.slice(1)}
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 border border-transparent hover:border-fg text-fg transition-colors rounded-none cursor-none"
                >
                  <X />
                </button>
              </div>

              {addModalType === 'stack' || addModalType === 'socials' ? (
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fg/40" size={18} />
                    <input 
                      type="text"
                      placeholder={`Search ${addModalType}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-fg/[0.02] border-2 border-fg/30 pl-12 pr-6 py-4 text-fg focus:outline-none focus:border-accent transition-all font-mono text-sm placeholder:text-fg/20 rounded-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                          className="flex flex-col items-center gap-3 p-6 bg-fg/[0.02] border border-fg/10 hover:bg-accent/10 hover:border-accent transition-all group rounded-none cursor-none"
                        >
                          <div className="w-10 h-10 transition-transform group-hover:scale-105 flex items-center justify-center">
                            {addModalType === 'stack' ? (
                              <img src={getIconUrl((item as any).slug)} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-fg group-hover:text-accent">{(item as any).icon}</div>
                            )}
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-widest text-center font-bold text-fg">{item.name}</span>
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
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              className="max-w-sm w-full bg-bg border-2 border-fg p-10 shadow-[8px_8px_0px_#0B0D11] text-center relative overflow-hidden rounded-none"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-none mx-auto mb-8 flex items-center justify-center bg-fg text-bg border-2 border-fg">
                  {status.type === 'success' ? <Save size={28} /> : <X size={28} />}
                </div>
                
                <h3 className="text-2xl font-display font-black uppercase mb-4 tracking-tight leading-none text-fg">
                  {status.type === 'success' ? 'Changes Published' : 'System Alert'}
                </h3>
                
                <p className="text-muted text-xs leading-[1.8] mb-10 font-bold uppercase font-mono">
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
                  className="w-full py-4 bg-fg text-bg border-2 border-fg font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-accent hover:border-accent hover:text-white transition-all font-bold cursor-none"
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
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8 border-b border-fg/10 pb-4">
        <h2 className="text-xl font-mono uppercase tracking-[0.2em] text-muted font-bold">// {title}</h2>
        <button
          onClick={onAdd}
          className="p-2 border-2 border-fg text-fg hover:bg-accent hover:border-accent hover:text-white transition-all rounded-none cursor-none"
        >
          <Plus size={20} />
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
      className={`flex items-center gap-4 px-6 py-4 border-2 transition-all duration-300 text-left rounded-none font-mono text-[10px] uppercase tracking-widest font-bold cursor-none ${
        active 
          ? 'bg-fg text-bg border-fg shadow-[4px_4px_0px_rgba(0,0,0,0.15)] scale-102' 
          : 'bg-bg border-fg/20 text-fg/60 hover:bg-fg/5 hover:border-fg'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

const ItemCard: React.FC<{ children: React.ReactNode, onDelete: () => void }> = ({ children, onDelete }) => {
  return (
    <div className="bg-fg/[0.01] border-2 border-fg p-6 md:p-8 relative group transition-all hover:bg-fg/[0.03] rounded-none shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
      {/* Corner Tech Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-fg/20" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-fg/20" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-fg/20" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-fg/20" />

      <button
        onClick={onDelete}
        className="absolute top-4 right-4 p-2 border border-transparent hover:border-fg text-muted hover:text-accent opacity-0 group-hover:opacity-100 transition-all bg-bg rounded-none cursor-none"
      >
        <Trash2 size={16} />
      </button>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string, type?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/60 ml-0.5">// {label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-fg/[0.02] border-2 border-fg/30 rounded-none px-4 py-3 focus:outline-none focus:border-accent transition-colors w-full text-sm text-fg placeholder:text-fg/20 font-mono"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/60 ml-0.5">// {label}</label>
      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-fg/[0.02] border-2 border-fg/30 rounded-none px-4 py-3 focus:outline-none focus:border-accent transition-colors w-full text-sm text-fg resize-none placeholder:text-fg/20 font-mono"
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
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/60 ml-0.5">// {label}</label>
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
          className="bg-fg/[0.02] border-2 border-fg/30 rounded-none px-4 py-3 pr-12 focus:outline-none focus:border-accent transition-colors w-full text-sm text-fg placeholder:text-fg/20 font-mono"
        />
        <button
          type="button"
          onClick={addTech}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-fg hover:text-accent transition-colors cursor-none"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {techs.map((tech, idx) => (
          <span 
            key={idx}
            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono border border-fg/20 text-fg bg-fg/[0.03] hover:bg-fg/[0.06] transition-colors rounded-none font-bold uppercase"
          >
            {tech}
            <button 
              type="button"
              onClick={() => removeTech(tech)}
              className="hover:text-accent transition-colors cursor-none"
            >
              <X size={12} />
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
      <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="Detailed description of your responsibilities and achievements..."
          onChange={(val) => setFormData({ ...formData, desc: val })} 
        />
        <FormSubmit />
      </form>
    );
  }

  if (type === 'projects') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="e.g. Design & Development"
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
          placeholder="Small description for the card."
          onChange={(val) => setFormData({ ...formData, desc: val })} 
        />
        <TextArea 
          label="Detailed Description" 
          value={formData.detailedDesc || ''} 
          placeholder="Detailed description for the project modal."
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Network Name" 
          value={formData.name || ''} 
          placeholder="e.g. GitHub, LinkedIn, Twitter"
          onChange={(val) => setFormData({ ...formData, name: val })} 
        />
        <Input 
          label="URL" 
          value={formData.url || ''} 
          placeholder="https://network.com/username"
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
      className="w-full py-4 bg-fg text-bg border-2 border-fg hover:bg-accent hover:border-accent hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest font-bold cursor-none"
    >
      Add Item
    </button>
  );
}
