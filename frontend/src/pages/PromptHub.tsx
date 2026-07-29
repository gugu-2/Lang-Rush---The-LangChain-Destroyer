import React, { useState } from 'react';
import { Plus, Search, GitCommit, Play, Tag, Clock, ArrowRightLeft } from 'lucide-react';

const mockPrompts = [
  { id: 'p1', name: 'Customer Support Bot', versions: 12, production: 'v12', updated: '2 hours ago' },
  { id: 'p2', name: 'SQL Generator System', versions: 5, production: 'v4', updated: '1 day ago' },
  { id: 'p3', name: 'Intent Classifier', versions: 24, production: 'v21', updated: '3 days ago' },
];

const mockVersions = [
  { version: 'v12', commit: 'Update tone to be more empathetic', date: '2 hours ago', author: 'Alex D.', isProd: true, content: 'You are an empathetic customer support assistant...' },
  { version: 'v11', commit: 'Add knowledge base fallback', date: '1 day ago', author: 'Alex D.', isProd: false, content: 'You are a customer support assistant. If you do not know, say so...' },
  { version: 'v10', commit: 'Initial prompt design', date: '5 days ago', author: 'Sarah W.', isProd: false, content: 'You are a helpful assistant.' },
];

export default function PromptHub() {
  const [selectedPrompt, setSelectedPrompt] = useState(mockPrompts[0].id);

  return (
    <div style={{ display: 'flex', height: '100%', color: 'white' }}>
      
      {/* Left Panel */}
      <div style={{ width: '320px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Prompts</h2>
            <button style={{ backgroundColor: 'var(--brand)', color: 'white', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Plus size={18} />
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Search prompts..." style={{ width: '100%', padding: '8px 12px 8px 36px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {mockPrompts.map(prompt => (
            <div 
              key={prompt.id} 
              onClick={() => setSelectedPrompt(prompt.id)}
              style={{ 
                padding: '16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                cursor: 'pointer',
                backgroundColor: selectedPrompt === prompt.id ? 'rgba(79, 110, 247, 0.1)' : 'transparent',
                border: selectedPrompt === prompt.id ? '1px solid rgba(79, 110, 247, 0.3)' : '1px solid transparent',
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 500, color: selectedPrompt === prompt.id ? 'var(--brand)' : 'white' }}>{prompt.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitCommit size={12} /> {prompt.versions} versions</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={12} /> {prompt.production}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 600 }}>{mockPrompts.find(p => p.id === selectedPrompt)?.name}</h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Updated 2 hours ago</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><GitCommit size={14} /> 12 Commits</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
              <ArrowRightLeft size={16} /> Diff Mode
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
              <Play size={16} fill="white" /> Open in Playground
            </button>
          </div>
        </div>

        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '24px', width: '2px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
            
            {mockVersions.map((v, i) => (
              <div key={v.version} style={{ position: 'relative', paddingLeft: '48px', marginBottom: '32px' }}>
                <div style={{ position: 'absolute', left: '12px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: v.isProd ? 'var(--brand)' : '#64748b', border: '2px solid #0f172a', zIndex: 1 }}></div>
                
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>{v.commit}</span>
                        {v.isProd && <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Production</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.875rem', color: '#94a3b8' }}>
                        <span>{v.version}</span> • <span>{v.author}</span> • <span>{v.date}</span>
                      </div>
                    </div>
                    {!v.isProd && (
                      <button style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', fontSize: '0.875rem', cursor: 'pointer' }}>
                        Set as Production
                      </button>
                    )}
                  </div>
                  
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.875rem', color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                    {v.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
