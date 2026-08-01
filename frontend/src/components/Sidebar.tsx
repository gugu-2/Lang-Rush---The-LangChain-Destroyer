import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, GitBranch, Zap, BookOpen, 
  FlaskConical, CheckSquare, MessageSquare, DollarSign, 
  TestTube, Network, BarChart2, AlertTriangle, 
  FolderOpen, Settings, User, Shield, Sparkles, Layers,
  HardDriveDownload
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navSections = [
    {
      title: 'OBSERVE',
      items: [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
        { name: 'Traces & Runs', path: '/runs', icon: <Activity size={18} /> },
        { name: 'Monitoring', path: '/monitoring', icon: <BarChart2 size={18} /> },
        { name: 'Failure Intelligence', path: '/failures', icon: <AlertTriangle size={18} /> },
      ]
    },
    {
      title: 'ENTERPRISE ENGINES',
      items: [
        { name: 'Shadcn UI Engine', path: '/shadcn', icon: <Layers size={18} /> },
        { name: 'Business Hub', path: '/business', icon: <Sparkles size={18} /> },
        { name: 'Security & Auto-Heal', path: '/guardrails', icon: <Shield size={18} /> },
        { name: 'Local Models (MoE)', path: '/local-models', icon: <HardDriveDownload size={18} /> },
      ]
    },
    {
      title: 'BUILD',
      items: [
        { name: 'FlowForge', path: '/flowforge', icon: <Network size={18} /> },
        { name: 'Prompt Hub', path: '/prompts', icon: <BookOpen size={18} /> },
        { name: 'Playground', path: '/playground', icon: <Zap size={18} /> },
      ]
    },
    {
      title: 'EVALUATE',
      items: [
        { name: 'Datasets', path: '/datasets', icon: <FolderOpen size={18} /> },
        { name: 'Evaluations', path: '/evaluations', icon: <TestTube size={18} /> },
        { name: 'Annotation Queue', path: '/annotations', icon: <CheckSquare size={18} /> },
      ]
    },
    {
      title: 'OPTIMIZE',
      items: [
        { name: 'TokenMiser', path: '/tokenmiser', icon: <DollarSign size={18} /> },
        { name: 'AgentBench', path: '/agentbench', icon: <GitBranch size={18} /> },
      ]
    },
    {
      title: 'MANAGE',
      items: [
        { name: 'Projects', path: '/projects', icon: <FolderOpen size={18} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
      ]
    }
  ];

  return (
    <div style={{ width: '260px', borderRight: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--bg-base)', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--brand) 0%, var(--cyan) 100%)', borderRadius: '8px', padding: '6px' }}>
          <Zap size={24} color="white" fill="white" />
        </div>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          LangRush
        </h1>
      </div>

      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navSections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '12px', letterSpacing: '0.05em' }}>
              {section.title}
            </div>
            {section.items.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${isActive(item.path) && item.path !== '/' || (item.path === '/' && location.pathname === '/') ? 'active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                  borderRadius: '6px', color: (isActive(item.path) && item.path !== '/' || (item.path === '/' && location.pathname === '/')) ? 'var(--brand)' : 'var(--text-secondary)',
                  textDecoration: 'none', transition: 'all 0.2s',
                  backgroundColor: (isActive(item.path) && item.path !== '/' || (item.path === '/' && location.pathname === '/')) ? 'var(--brand-subtle)' : 'transparent',
                  fontWeight: (isActive(item.path) && item.path !== '/' || (item.path === '/' && location.pathname === '/')) ? 600 : 500, fontSize: '0.9rem'
                }}
              >
                <div style={{ color: (isActive(item.path) && item.path !== '/' || (item.path === '/' && location.pathname === '/')) ? 'var(--brand)' : 'var(--text-muted)' }}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={18} color="white" />
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Alex Developer</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand)', fontWeight: 500 }}>Pro Plan</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
