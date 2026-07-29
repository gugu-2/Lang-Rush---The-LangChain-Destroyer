import React, { useState } from 'react';
import { Plus, Database, ChevronDown, ChevronRight, FileJson } from 'lucide-react';

const mockDatasets = [
  { id: 'd1', name: 'Customer Support Q&A', examplesCount: 1250, created: '2 weeks ago', description: 'Gold standard dataset for testing RAG accuracy on support docs.' },
  { id: 'd2', name: 'Toxic Prompts', examplesCount: 450, created: '1 month ago', description: 'Adversarial examples to test prompt injection.' },
  { id: 'd3', name: 'SQL Generation Bench', examplesCount: 85, created: '3 days ago', description: 'Text to SQL pairs.' },
];

export default function Datasets() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div style={{ padding: '32px', color: 'white', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Datasets</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Manage ground-truth data for evaluation and fine-tuning.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> New Dataset
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockDatasets.map(dataset => (
          <div key={dataset.id} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
            <div 
              onClick={() => setExpandedRow(expandedRow === dataset.id ? null : dataset.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ color: '#94a3b8' }}>
                  {expandedRow === dataset.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(79, 110, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={20} color="var(--brand)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>{dataset.name}</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>{dataset.description}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>{dataset.examplesCount}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Examples</div>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{dataset.created}</div>
              </div>
            </div>

            {expandedRow === dataset.id && (
              <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Examples Preview</h4>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <Plus size={14} /> Add Row
                  </button>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', color: '#94a3b8' }}>
                      <th style={{ padding: '12px 16px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Inputs</th>
                      <th style={{ padding: '12px 16px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Target Outputs</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px', verticalAlign: 'top', width: '50%' }}>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', color: '#e2e8f0' }}>
                          <span style={{ color: '#4f6ef7' }}>"query":</span> "How do I reset my password?"
                        </div>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'top', width: '50%' }}>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', color: '#e2e8f0' }}>
                          <span style={{ color: '#4f6ef7' }}>"answer":</span> "To reset your password, go to settings and click 'Forgot Password'."
                        </div>
                      </td>
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
