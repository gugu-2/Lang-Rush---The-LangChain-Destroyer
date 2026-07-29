import React from 'react';
import { Play, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const mockEvals = [
  { id: 'e1', name: 'RAG Accuracy Test v2', dataset: 'Customer Support Q&A', evaluator: 'LLM-as-Judge (gpt-4)', status: 'completed', score: 92, date: '2 hours ago' },
  { id: 'e2', name: 'Toxicity Scan', dataset: 'Toxic Prompts', evaluator: 'Heuristic + Rule-based', status: 'completed', score: 100, date: '1 day ago' },
  { id: 'e3', name: 'SQL Generation Test', dataset: 'SQL Generation Bench', evaluator: 'Exact Match', status: 'failed', score: 45, date: '3 days ago' },
];

export default function Evaluations() {
  return (
    <div style={{ padding: '32px', color: 'white', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Evaluations</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Run test suites against your datasets to measure performance.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Play size={18} fill="white" /> Run Evaluation
        </button>
      </div>

      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', overflow: 'hidden' }}>
        <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <tr style={{ color: '#94a3b8' }}>
            <th style={{ padding: '16px 24px', fontWeight: 500 }}>Name</th>
            <th style={{ padding: '16px 24px', fontWeight: 500 }}>Dataset</th>
            <th style={{ padding: '16px 24px', fontWeight: 500 }}>Evaluator</th>
            <th style={{ padding: '16px 24px', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '16px 24px', fontWeight: 500, width: '200px' }}>Score</th>
            <th style={{ padding: '16px 24px', fontWeight: 500 }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {mockEvals.map((evalRun, i) => (
            <tr key={evalRun.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <td style={{ padding: '20px 24px', fontWeight: 600, color: 'white' }}>{evalRun.name}</td>
              <td style={{ padding: '20px 24px', color: '#e2e8f0' }}>{evalRun.dataset}</td>
              <td style={{ padding: '20px 24px', color: '#94a3b8' }}>{evalRun.evaluator}</td>
              <td style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: evalRun.status === 'completed' ? '#22c55e' : '#f43f5e' }}>
                  {evalRun.status === 'completed' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span style={{ textTransform: 'capitalize' }}>{evalRun.status}</span>
                </div>
              </td>
              <td style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${evalRun.score}%`, height: '100%', backgroundColor: evalRun.score > 80 ? '#22c55e' : evalRun.score > 50 ? '#f59e0b' : '#f43f5e' }}></div>
                  </div>
                  <span style={{ fontWeight: 600, color: evalRun.score > 80 ? '#22c55e' : evalRun.score > 50 ? '#f59e0b' : '#f43f5e' }}>{evalRun.score}%</span>
                </div>
              </td>
              <td style={{ padding: '20px 24px', color: '#64748b' }}>{evalRun.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
