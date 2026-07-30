import React, { useState } from 'react';
import { TestTube, CheckCircle, XCircle, Play, ShieldAlert } from 'lucide-react';

const mockTests = [
  { id: 't1', name: 'assert_tool_called("web_search")', type: 'Tool Assertion', status: 'passed', details: 'Tool web_search was called with query: "LangRush architecture"' },
  { id: 't2', name: 'assert_no_hallucination()', type: 'Hallucination Check', status: 'passed', details: 'Output grounded with 0 unverified claims' },
  { id: 't3', name: 'assert_sentiment("positive")', type: 'Sentiment Check', status: 'passed', details: 'Positive sentiment confidence: 98.4%' },
  { id: 't4', name: 'assert_score_above(0.85)', type: 'LLM Quality Judge', status: 'passed', details: 'Score: 0.94 / 1.00' },
];

export default function AgentBench() {
  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>AgentBench Integration Tests</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Unit and integration testing framework for AI agents.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Play size={18} /> Run Agent Tests
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginTop: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>Active Test Assertions</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-overlay)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Assertion Name</th>
              <th style={{ padding: '12px 16px' }}>Type</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {mockTests.map(test => (
              <tr key={test.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{test.name}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{test.type}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> {test.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{test.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
