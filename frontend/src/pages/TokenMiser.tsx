import React from 'react';
import { DollarSign, Cpu, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TokenMiser() {
  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>TokenMiser Cost Optimizer</h1>
        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Dynamic prompt complexity classification & automatic cheap model routing.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Estimated Cost Savings</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10b981', margin: '16px 0 8px 0' }}>68.4%</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Saved $412.50 this month by auto-routing simple queries to cheaper models.</p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Active Routing Strategy</h3>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--brand)', margin: '16px 0 8px 0' }}>Complexity Classifier v2</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Prompts under 200 tokens with zero code blocks auto-route to gemini-2.5-flash.</p>
        </div>
      </div>
    </div>
  );
}
