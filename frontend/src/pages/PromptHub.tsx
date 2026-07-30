import React, { useState } from 'react';
import { Plus, Search, Tag, History, Play, Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockPrompts = [
  { id: 'pr-1', name: 'sql_generator_v2', description: 'Converts natural language questions to optimized Postgres queries.', version: 3, model: 'gpt-4o', tags: ['sql', 'production'] },
  { id: 'pr-2', name: 'support_classifier', description: 'Classifies customer support tickets into priority buckets.', version: 1, model: 'gpt-4o-mini', tags: ['support', 'classification'] },
  { id: 'pr-3', name: 'rag_summarizer', description: 'Synthesizes retrieved chunks into concise answer bullet points.', version: 5, model: 'models/gemini-2.5-flash', tags: ['rag', 'summary'] },
];

export default function PromptHub() {
  const [selectedPrompt, setSelectedPrompt] = useState(mockPrompts[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', height: '100%', color: 'var(--text-primary)' }}>
      {/* Sidebar List */}
      <div style={{ width: '320px', borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>PromptVault</h2>
          <button style={{ backgroundColor: 'var(--brand)', color: 'white', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Plus size={16} />
          </button>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input type="text" placeholder="Search prompts..." style={{ width: '100%', padding: '8px 12px 8px 32px', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {mockPrompts.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedPrompt(p)}
              style={{
                padding: '16px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                backgroundColor: selectedPrompt.id === p.id ? 'var(--brand-subtle)' : 'transparent'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: selectedPrompt.id === p.id ? 'var(--brand)' : 'var(--text-primary)', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>v{p.version}</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{p.model}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Detail */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', backgroundColor: 'var(--bg-base)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedPrompt.name}</h1>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--brand-subtle)', color: 'var(--brand)', fontWeight: 600, border: '1px solid var(--brand)' }}>Production v{selectedPrompt.version}</span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedPrompt.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 }}>
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              {copied ? 'Copied SDK Code' : 'Copy SDK Code'}
            </button>
            <Link to="/playground" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
              <Play size={16} /> Test in Playground
            </Link>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Template Content</h3>
          <pre style={{ backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
            {`You are an expert SQL engineer. Given a database schema and a natural language user query, generate a valid SQL query.

Schema:
{{ schema }}

User Question:
{{ question }}

Return ONLY the raw SQL code.`}
          </pre>
        </div>
      </div>
    </div>
  );
}
