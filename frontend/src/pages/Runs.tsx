import React, { useState } from 'react';
import { Search, Filter, Download, Trash2, ChevronRight, Activity, Zap, Server } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const mockRuns = Array.from({ length: 15 }, (_, i) => ({
  id: `run-${i}`,
  name: i % 3 === 0 ? 'SQL Generator' : i % 2 === 0 ? 'Customer Support Agent' : 'RAG Pipeline',
  status: i % 5 === 0 ? 'error' : 'success',
  model: i % 2 === 0 ? 'gpt-4o' : 'gemini-flash',
  latency_ms: Math.floor(Math.random() * 2000 + 200),
  total_cost_usd: parseFloat((Math.random() * 0.05).toFixed(3)),
  prompt_tokens: Math.floor(Math.random() * 2000 + 100),
  run_type: i % 3 === 0 ? 'llm' : i % 2 === 0 ? 'agent' : 'chain',
  created_at: `${i * 2 + 1} min ago`
}));

export default function Runs() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleSelect = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const toggleAll = () => {
    if (selected.size === mockRuns.length) setSelected(new Set());
    else setSelected(new Set(mockRuns.map(r => r.id)));
  };

  return (
    <div style={{ padding: '32px', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input 
              type="text" 
              placeholder="Search runs..." 
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: 'white',
                width: '300px',
                outline: 'none',
                fontSize: '0.875rem'
              }}
            />
          </div>
          <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0', cursor: 'pointer' }}>
            <Filter size={16} /> Filters
          </button>
        </div>

        {selected.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{selected.size} selected</span>
            <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0', cursor: 'pointer' }}>
              <Download size={16} /> Export
            </button>
            <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '8px', color: '#f43f5e', cursor: 'pointer' }}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#0f172a', zIndex: 1 }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                <th style={{ padding: '16px', width: '40px' }}>
                  <input type="checkbox" checked={selected.size === mockRuns.length} onChange={toggleAll} style={{ cursor: 'pointer' }} />
                </th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Type</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Model</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Latency</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Tokens</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Cost</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {mockRuns.map((run, i) => (
                <tr 
                  key={run.id} 
                  style={{ 
                    borderBottom: i === mockRuns.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)', 
                    color: '#e2e8f0',
                    backgroundColor: selected.has(run.id) ? 'rgba(79, 110, 247, 0.05)' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== 'INPUT') {
                      navigate(`/runs/${run.id}`);
                    }
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected.has(run.id) ? 'rgba(79, 110, 247, 0.05)' : 'transparent'}
                >
                  <td style={{ padding: '16px' }}>
                    <input type="checkbox" checked={selected.has(run.id)} onChange={() => toggleSelect(run.id)} style={{ cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{run.name}</td>
                  <td style={{ padding: '16px' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {run.run_type === 'llm' ? <Zap size={12} /> : run.run_type === 'agent' ? <Server size={12} /> : <Activity size={12} />}
                      {run.run_type}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className="badge" style={{ 
                      backgroundColor: run.status === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)', 
                      color: run.status === 'success' ? '#22c55e' : '#f43f5e',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' 
                    }}>
                      {run.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#94a3b8' }}>{run.model}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, run.latency_ms / 30)}%`, height: '100%', backgroundColor: run.latency_ms > 2000 ? '#f59e0b' : '#4f6ef7' }}></div>
                      </div>
                      <span>{run.latency_ms} ms</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{run.prompt_tokens}</td>
                  <td style={{ padding: '16px' }}>${run.total_cost_usd}</td>
                  <td style={{ padding: '16px', color: '#94a3b8' }}>{run.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
          <div>Showing 1 to 15 of 14,823 results</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '4px 12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#94a3b8', cursor: 'not-allowed' }}>Previous</button>
            <button style={{ padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>1</button>
            <button style={{ padding: '4px 12px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer' }}>2</button>
            <button style={{ padding: '4px 12px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer' }}>3</button>
            <span style={{ padding: '4px 8px' }}>...</span>
            <button style={{ padding: '4px 12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
