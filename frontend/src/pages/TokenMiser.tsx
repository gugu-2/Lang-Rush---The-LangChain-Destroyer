import React from 'react';
import { DollarSign, ShieldCheck, Zap, ArrowRight, ArrowDown, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const mockSavings = {
  total_saved: 2847.32,
  cache_hit_rate: 34.2,
  tokens_saved: 18400000,
  requests_optimized: 8234,
};

export default function TokenMiser() {
  const pieData = [
    { name: 'Cache Hit', value: 34.2 },
    { name: 'Cache Miss', value: 65.8 },
  ];
  const COLORS = ['#22c55e', 'rgba(255,255,255,0.1)'];

  return (
    <div style={{ padding: '32px', color: 'white', height: '100%', overflowY: 'auto' }}>
      
      {/* Hero Section */}
      <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '32px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
          <ShieldCheck size={32} color="#22c55e" />
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>You saved <span style={{ color: '#22c55e' }}>${mockSavings.total_saved.toLocaleString()}</span> this month</h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.125rem' }}>TokenMiser automatically routed queries and cached responses to reduce your LLM bill by 18.4%.</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500, marginBottom: '16px' }}>Cache Hit Rate</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={20} outerRadius={30} paddingAngle={0} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{mockSavings.cache_hit_rate}%</div>
          </div>
        </div>
        
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>Tokens Saved</div>
            <Zap size={18} color="var(--brand)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{(mockSavings.tokens_saved / 1000000).toFixed(1)}M</div>
          <div style={{ color: '#22c55e', fontSize: '0.875rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowDown size={14} /> 12% vs last month
          </div>
        </div>

        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>Cost Saved</div>
            <DollarSign size={18} color="#22c55e" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>${mockSavings.total_saved.toLocaleString()}</div>
          <div style={{ color: '#22c55e', fontSize: '0.875rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowDown size={14} /> 18% vs last month
          </div>
        </div>

        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>Requests Optimized</div>
            <Activity size={18} color="#a855f7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{mockSavings.requests_optimized.toLocaleString()}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '8px' }}>Automatically routed to cheaper models</div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Budget & Routing Rules</h3>
          <button style={{ padding: '8px 16px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
            Add Rule
          </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Project</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Rule Type</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Condition</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Action</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white' }}>
              <td style={{ padding: '16px' }}>Customer Support Bot</td>
              <td style={{ padding: '16px' }}>Semantic Router</td>
              <td style={{ padding: '16px', color: '#94a3b8' }}>Query complexity &lt; 0.4</td>
              <td style={{ padding: '16px' }}>Route to <span style={{ color: '#22d3ee' }}>gpt-4o-mini</span></td>
              <td style={{ padding: '16px' }}><span style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Active</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white' }}>
              <td style={{ padding: '16px' }}>Internal QA Agent</td>
              <td style={{ padding: '16px' }}>Budget Limit</td>
              <td style={{ padding: '16px', color: '#94a3b8' }}>Daily spend &gt; $50</td>
              <td style={{ padding: '16px' }}>Reject requests (429)</td>
              <td style={{ padding: '16px' }}><span style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Active</span></td>
            </tr>
            <tr style={{ color: 'white' }}>
              <td style={{ padding: '16px' }}>All Projects</td>
              <td style={{ padding: '16px' }}>Semantic Cache</td>
              <td style={{ padding: '16px', color: '#94a3b8' }}>Similarity &gt; 0.95</td>
              <td style={{ padding: '16px' }}>Return cached response</td>
              <td style={{ padding: '16px' }}><span style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
