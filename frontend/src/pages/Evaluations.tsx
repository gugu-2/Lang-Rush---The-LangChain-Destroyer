import React from 'react';
import { Play, Award, CheckCircle, XCircle, BarChart2 } from 'lucide-react';

const mockEvalRuns = [
  { id: 'eval-1', name: 'SQL Generator - Accuracy Benchmark', dataset: 'SQL Benchmark Set', evaluator: 'exact_match', score: 0.94, status: 'completed', created_at: '2 hours ago' },
  { id: 'eval-2', name: 'Support Classification - Intent Test', dataset: 'Support Classification Test', evaluator: 'contains_keyword', score: 0.88, status: 'completed', created_at: '1 day ago' },
  { id: 'eval-3', name: 'RAG Answer Faithfulness - LLM Judge', dataset: 'RAG Ground Truth QA', evaluator: 'llm_judge (gpt-4o)', score: 0.91, status: 'completed', created_at: '3 days ago' },
];

export default function Evaluations() {
  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Evaluations & Benchmarks</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Run automated quality scoring on model outputs.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Play size={18} /> New Eval Run
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-overlay)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 24px' }}>Eval Run Name</th>
              <th style={{ padding: '16px 24px' }}>Dataset</th>
              <th style={{ padding: '16px 24px' }}>Evaluator Type</th>
              <th style={{ padding: '16px 24px' }}>Overall Score</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {mockEvalRuns.map(run => (
              <tr key={run.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '20px 24px', fontWeight: 600, color: 'var(--text-primary)' }}>{run.name}</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-secondary)' }}>{run.dataset}</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{run.evaluator}</td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: run.score > 0.9 ? '#10b981' : '#f59e0b' }}>{(run.score * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{run.status}</span>
                </td>
                <td style={{ padding: '20px 24px', color: 'var(--text-muted)', textAlign: 'right', fontSize: '0.85rem' }}>{run.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
