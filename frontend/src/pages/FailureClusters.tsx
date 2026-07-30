import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Cpu, TestTube, ChevronDown, ChevronRight } from 'lucide-react';

const mockClusters = [
  { id: 'c1', label: 'Tool timeout in web search', count: 234, priority: 92, trending: true, sample_error: 'TimeoutError: web_search exceeded 10s limit', root_cause: 'The web_search tool is timing out due to slow external API responses. Recommend increasing timeout to 30s or adding retry logic.' },
  { id: 'c2', label: 'Context window exceeded', count: 178, priority: 78, trending: false, sample_error: 'openai.BadRequestError: context_length_exceeded', root_cause: 'Input documents are too long. Recommend adding a chunking step before LLM call, or using a model with larger context window.' },
  { id: 'c3', label: 'JSON parsing failure in output', count: 89, priority: 55, trending: true, sample_error: 'JSONDecodeError: Expecting value at line 1', root_cause: 'LLM is not consistently returning valid JSON. Recommend using json_mode=True or adding a JSON repair step.' },
];

export default function FailureClusters() {
  const [expandedId, setExpandedId] = useState<string | null>(mockClusters[0].id);

  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Failure Intelligence</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>AI-driven root cause analysis of production errors.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockClusters.map(cluster => (
          <div key={cluster.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div 
              onClick={() => setExpandedId(expandedId === cluster.id ? null : cluster.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', cursor: 'pointer', backgroundColor: expandedId === cluster.id ? 'var(--bg-overlay)' : 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  {expandedId === cluster.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cluster.label}</h3>
                    {cluster.trending && <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}><TrendingUp size={12} /> Trending</span>}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>{cluster.sample_error}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cluster.count}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Errors</div>
                </div>
                <div style={{ width: '80px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Priority</span>
                    <span style={{ fontWeight: 600, color: cluster.priority > 80 ? '#f43f5e' : cluster.priority > 50 ? '#f59e0b' : '#22c55e' }}>{cluster.priority}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${cluster.priority}%`, backgroundColor: cluster.priority > 80 ? '#f43f5e' : cluster.priority > 50 ? '#f59e0b' : '#22c55e', borderRadius: '3px' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {expandedId === cluster.id && (
              <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid var(--border)' }}>
                <div style={{ backgroundColor: 'var(--brand-subtle)', border: '1px solid var(--brand)', borderRadius: '8px', padding: '16px', marginTop: '24px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                  <Cpu size={20} color="var(--brand)" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--brand)', marginBottom: '4px', fontSize: '0.875rem' }}>AI Root Cause Analysis</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.5 }}>{cluster.root_cause}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Sample Traces</h4>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                    <TestTube size={14} /> Create Test
                  </button>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}>run-38491</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>gpt-4o</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>10 mins ago</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}>run-38482</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>gpt-4o</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>15 mins ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
