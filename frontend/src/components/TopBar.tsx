import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronDown, Sun, Moon } from 'lucide-react';

interface TopBarProps {
  titles: Record<string, { title: string, subtitle: string }>;
}

const TopBar: React.FC<TopBarProps> = ({ titles }) => {
  const location = useLocation();
  const path = location.pathname;
  
  const [theme, setTheme] = useState<'dark' | 'light' | 'arc' | 'replicate'>(() => {
    return (localStorage.getItem('langrush_theme') as any) || 'replicate';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('langrush_theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'arc';
      if (prev === 'arc') return 'replicate';
      return 'dark';
    });
  };
  
  // Find matching title or default
  let currentTitle = titles[path] || { title: 'Dashboard', subtitle: 'Overview of your LLM application' };
  
  if (path.startsWith('/runs/')) {
    currentTitle = { title: 'Trace Detail', subtitle: 'Deep dive into execution trace' };
  }

  return (
    <div style={{ 
      height: '72px', 
      borderBottom: '1px solid rgba(255,255,255,0.05)', 
      backgroundColor: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>{currentTitle.title}</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', marginTop: '2px' }}>{currentTitle.subtitle}</p>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '8px 16px', 
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand)' }}></div>
          <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>Production App</span>
          <ChevronDown size={14} color="#94a3b8" style={{ marginLeft: '8px' }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '4px' }}>
          {['1h', '24h', '7d', '30d'].map((range, i) => (
            <button 
              key={range}
              style={{
                background: i === 1 ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none',
                color: i === 1 ? 'white' : '#94a3b8',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {range}
            </button>
          ))}
        </div>

        <button 
          onClick={cycleTheme}
          title={`Active Theme: ${theme.toUpperCase()}. Click to switch.`}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px',
            backgroundColor: 'var(--bg-overlay)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {theme === 'replicate' ? <span style={{ fontSize: '14px' }}>🔥</span> : theme === 'arc' ? <span style={{ fontSize: '14px' }}>🎨</span> : theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
          <span>{theme === 'replicate' ? 'Replicate Theme' : theme === 'arc' ? 'Arc Theme' : theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="#94a3b8" />
          <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
