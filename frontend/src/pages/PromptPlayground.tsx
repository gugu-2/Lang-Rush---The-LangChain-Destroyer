import React, { useState } from 'react';
import { Play, Settings2, Save, Zap, AlertTriangle, ArrowRightLeft } from 'lucide-react';

const mockSystemPrompt = `You are a helpful customer support assistant for LangForge.
Always maintain a professional, empathetic tone.

Context info:
User Plan: {{user_plan}}
Recent errors: {{error_count}}

If the user asks about pricing, direct them to langforge.ai/pricing.`;

export default function PromptPlayground() {
  const [prompt, setPrompt] = useState(mockSystemPrompt);
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const handleRun = () => {
    setIsStreaming(true);
    setResponse('');
    
    const text = "Hello! I understand you're experiencing some errors. I'd be happy to help you troubleshoot. Based on your Pro plan, you also have access to priority email support if we can't resolve it here. What seems to be the specific issue you're encountering?";
    
    let i = 0;
    const interval = setInterval(() => {
      setResponse(prev => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 20);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'white' }}>
      
      {/* Top Toolbar */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-base)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Playground</h1>
          <span style={{ color: '#94a3b8' }}>/</span>
          <select style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', padding: '6px 12px', outline: 'none' }}>
            <option>Customer Support Bot</option>
            <option>SQL Generator System</option>
          </select>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: '#e2e8f0' }}>v12</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
            <ArrowRightLeft size={16} /> Compare Mode
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
            <Save size={16} /> Save as v13
          </button>
          <button 
            onClick={handleRun}
            disabled={isStreaming}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: isStreaming ? 'not-allowed' : 'pointer', opacity: isStreaming ? 0.7 : 1 }}
          >
            <Play size={16} fill="white" /> {isStreaming ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Prompt
          </div>
          <div style={{ flex: 1, backgroundColor: '#0a0f1c' }}>
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               style={{ width: '100%', height: '100%', backgroundColor: 'transparent', border: 'none', color: '#e2e8f0', padding: '24px', fontFamily: 'monospace', fontSize: '0.875rem', resize: 'none', outline: 'none', lineHeight: 1.6 }}
             />
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>User Input</div>
            <textarea 
               defaultValue="I'm seeing a lot of 500 errors today. Help!"
               style={{ width: '100%', height: '80px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', padding: '16px', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'none', outline: 'none' }}
             />
          </div>
        </div>

        {/* Output & Settings Panel */}
        <div style={{ width: '450px', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.01)' }}>
          
          {/* Settings */}
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>
              <Settings2 size={16} /> Model Settings
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>Model</label>
              <select style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }}>
                <option>gpt-4o</option>
                <option>gpt-4o-mini</option>
                <option>claude-3-5-sonnet</option>
                <option>gemini-1.5-pro</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Temperature</label>
                <span style={{ fontSize: '0.75rem', color: 'white' }}>0.7</span>
              </div>
              <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" style={{ width: '100%' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>Variables</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" defaultValue="user_plan" style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }} />
                <input type="text" defaultValue="Pro" style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" defaultValue="error_count" style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }} />
                <input type="text" defaultValue="12" style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }} />
              </div>
            </div>
          </div>

          {/* Output */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Model Output
            </div>
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              {response ? (
                <div style={{ color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{response}</div>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                  Click Run to generate a response
                </div>
              )}
            </div>
            
            {response && (
              <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={14} /> 124 ms</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14} /> ~45 tokens</span>
                <span>$0.0004</span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
