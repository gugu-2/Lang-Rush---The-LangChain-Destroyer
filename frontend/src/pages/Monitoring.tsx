import React from 'react';
import { Bell, Plus, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

const mockAlerts = [
  { id: 'a1', metric: 'error_rate', condition: 'gt', threshold: 5.0, channel: 'slack', is_active: true },
  { id: 'a2', metric: 'latency_p95', condition: 'gt', threshold: 2500, channel: 'email', is_active: true },
  { id: 'a3', metric: 'cost_daily', condition: 'gt', threshold: 50.0, channel: 'slack', is_active: false },
];

export default function Monitoring() {
  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Monitoring & Alerts</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Configure live alert webhooks for error rates, latency spikes, and daily budget limits.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> New Alert Rule
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginTop: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>Active Alert Rules</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-overlay)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Metric</th>
              <th style={{ padding: '12px 16px' }}>Condition</th>
              <th style={{ padding: '12px 16px' }}>Threshold</th>
              <th style={{ padding: '12px 16px' }}>Channel</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAlerts.map(alert => (
              <tr key={alert.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{alert.metric}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{alert.condition}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>{alert.threshold}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>{alert.channel}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    backgroundColor: alert.is_active ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-overlay)', 
                    color: alert.is_active ? '#10b981' : 'var(--text-muted)', 
                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 
                  }}>
                    {alert.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
