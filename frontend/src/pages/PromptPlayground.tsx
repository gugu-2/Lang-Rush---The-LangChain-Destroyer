import React, { useState } from 'react';
import { Play, Save, Settings2, Sparkles, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function PromptPlayground() {
  const [prompt, setPrompt] = useState("You are an expert AI software architect. Analyze the user request and generate a clean architecture solution.\n\nUser Plan: {{ user_plan }}\n\nTask:");
  const [userPlan, setUserPlan] = useState("Pro");
  const [model, setModel] = useState("models/gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runPlayground = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await axios.post(`${API_BASE}/prompts/playground`, {
        template: prompt,
        model_name: model,
        temperature: temperature,
        variables: { user_plan: userPlan }
      });
      setOutput(res.data.response || res.data.output || JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setOutput(`Error executing prompt: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'var(--text-primary)' }}>
      {/* Toolbar */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-base)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Prompt Playground</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={runPlayground} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
            <Play size={16} /> {loading ? 'Running...' : 'Run Prompt'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left Input */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-base)' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>System / Prompt Template</h3>
          <textarea 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            style={{ flex: 1, width: '100%', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', resize: 'none', outline: 'none' }} 
          />

          <div style={{ marginTop: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Template Variables</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="text" value="user_plan" disabled style={{ width: '120px', padding: '8px', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-muted)' }} />
              <input type="text" value={userPlan} onChange={(e) => setUserPlan(e.target.value)} style={{ flex: 1, padding: '8px', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)' }} />
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div style={{ flex: 1, padding: '24px', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Model Output</h3>
          <div style={{ flex: 1, backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
            {loading ? (
              <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={16} className="spin" /> Executing LLM prompt...
              </div>
            ) : output ? (
              output
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>Click 'Run Prompt' to generate live LLM output.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
