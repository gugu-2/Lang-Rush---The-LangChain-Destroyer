import React, { useState } from 'react';
import { Database, Plus, FileText, Trash2, Download, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockDatasets = [
  { id: 'ds-1', name: 'SQL Benchmark Set', description: '50 complex natural language questions mapped to target SQL queries.', examplesCount: 50, created_at: '2 weeks ago' },
  { id: 'ds-2', name: 'Support Classification Test', description: '200 multi-turn support conversations tagged by intent.', examplesCount: 200, created_at: '1 month ago' },
  { id: 'ds-3', name: 'RAG Ground Truth QA', description: '100 document context pairs with ground truth answers.', examplesCount: 100, created_at: '3 days ago' },
];

export default function Datasets() {
  const [datasets] = useState(mockDatasets);

  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Datasets & Test Sets</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Golden datasets for automated regression testing and model benchmarks.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> New Dataset
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {datasets.map(dataset => (
          <div key={dataset.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ backgroundColor: 'var(--brand-subtle)', padding: '10px', borderRadius: '10px', color: 'var(--brand)' }}>
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dataset.name}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created {dataset.created_at}</div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px', lineHeight: 1.5 }}>
              {dataset.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{dataset.examplesCount}</strong> test cases
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                <Play size={14} /> Run Test Set
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
