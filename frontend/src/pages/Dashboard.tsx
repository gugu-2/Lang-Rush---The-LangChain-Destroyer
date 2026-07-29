import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, AlertTriangle, Clock, Zap, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const mockStats = {
  total_runs: 14823,
  error_rate: 2.4,
  avg_latency_ms: 1247,
  total_tokens: 48200000,
  total_cost_usd: 312.45,
};

const mockRunsOverTime = Array.from({length: 24}, (_, i) => ({
  time: `${i}:00`, count: Math.floor(Math.random() * 400 + 100)
}));

const mockErrorRate = Array.from({length: 24}, (_, i) => ({
  time: `${i}:00`, rate: parseFloat((Math.random() * 5).toFixed(1))
}));

const mockCostByModel = [
  { model: 'gpt-4o', cost: 145.20 },
  { model: 'gpt-4o-mini', cost: 87.30 },
  { model: 'claude-3-5', cost: 62.10 },
  { model: 'gemini-flash', cost: 17.85 },
];

const mockLatency = Array.from({length: 24}, (_, i) => ({
  time: `${i}:00`,
  p50: Math.floor(Math.random() * 400 + 600),
  p95: Math.floor(Math.random() * 600 + 1200),
  p99: Math.floor(Math.random() * 800 + 2000),
}));

const mockRuns = [
  { id: 'r1', name: 'RAG Pipeline', status: 'success', model: 'gpt-4o', latency_ms: 1243, total_cost_usd: 0.012, prompt_tokens: 1240, run_type: 'chain', created_at: '2 min ago' },
  { id: 'r2', name: 'Customer Support Agent', status: 'success', model: 'gpt-4o-mini', latency_ms: 892, total_cost_usd: 0.003, prompt_tokens: 342, run_type: 'agent', created_at: '4 min ago' },
  { id: 'r3', name: 'SQL Generator', status: 'error', model: 'gpt-4o', latency_ms: 2341, total_cost_usd: 0.025, prompt_tokens: 2100, run_type: 'llm', created_at: '7 min ago' },
  { id: 'r4', name: 'Document Classifier', status: 'success', model: 'gemini-flash', latency_ms: 456, total_cost_usd: 0.001, prompt_tokens: 890, run_type: 'chain', created_at: '12 min ago' },
  { id: 'r5', name: 'Web Search Tool', status: 'success', model: 'gpt-4o-mini', latency_ms: 234, total_cost_usd: 0.001, prompt_tokens: 123, run_type: 'tool', created_at: '18 min ago' },
];

const StatCard = ({ title, value, icon, change, isPositive }: any) => (
  <div className="stat-card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', flex: 1 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>{title}</div>
      <div style={{ color: 'var(--brand)', backgroundColor: 'rgba(79, 110, 247, 0.1)', padding: '8px', borderRadius: '8px' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{value}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: isPositive ? 'var(--green)' : 'var(--amber)' }}>
      {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      <span>{change}</span>
      <span style={{ color: '#64748b' }}>vs last week</span>
    </div>
  </div>
);

export default function Dashboard() {
  const chartProps = {
    cartesianGrid: { stroke: "rgba(255,255,255,0.05)" },
    xAxis: { stroke: "#475569", tick: { fill: "#475569" } },
    yAxis: { stroke: "#475569", tick: { fill: "#475569" } },
    tooltip: { contentStyle: { background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 } }
  };

  return (
    <div style={{ padding: '32px', color: 'white', height: '100%', overflowY: 'auto' }}>
      
      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <StatCard title="Total Runs" value={(mockStats.total_runs).toLocaleString()} icon={<Activity size={20} />} change="+12.5%" isPositive={true} />
        <StatCard title="Error Rate" value={`${mockStats.error_rate}%`} icon={<AlertTriangle size={20} />} change="-0.4%" isPositive={true} />
        <StatCard title="Avg Latency" value={`${mockStats.avg_latency_ms} ms`} icon={<Clock size={20} />} change="+45 ms" isPositive={false} />
        <StatCard title="Total Tokens" value={`${(mockStats.total_tokens / 1000000).toFixed(1)}M`} icon={<Zap size={20} />} change="+18.2%" isPositive={true} />
        <StatCard title="Est. Cost" value={`$${mockStats.total_cost_usd.toFixed(2)}`} icon={<DollarSign size={20} />} change="-$12.40" isPositive={true} />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Runs Over Time */}
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', fontWeight: 600 }}>Runs (Last 24h)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRunsOverTime}>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="time" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Line type="monotone" dataKey="count" stroke="#4f6ef7" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Rate */}
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', fontWeight: 600 }}>Error Rate (%)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockErrorRate}>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="time" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Line type="monotone" dataKey="rate" stroke="#a855f7" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost by Model */}
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', fontWeight: 600 }}>Cost by Model (USD)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCostByModel} layout="vertical">
                <CartesianGrid {...chartProps.cartesianGrid} horizontal={false} />
                <XAxis type="number" {...chartProps.xAxis} />
                <YAxis dataKey="model" type="category" width={100} {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Bar dataKey="cost" fill="#22d3ee" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Percentiles */}
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', fontWeight: 600 }}>Latency Percentiles (ms)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLatency}>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="time" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Area type="monotone" dataKey="p99" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Area type="monotone" dataKey="p95" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                <Area type="monotone" dataKey="p50" stackId="3" stroke="#4f6ef7" fill="#4f6ef7" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Runs Table */}
      <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Recent Runs</h3>
          <a href="/runs" style={{ color: 'var(--brand)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>View All</a>
        </div>
        
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Type</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Model</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Latency</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Tokens</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {mockRuns.map((run, i) => (
              <tr key={run.id} style={{ borderBottom: i === mockRuns.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0' }}>
                <td style={{ padding: '16px' }}>{run.name}</td>
                <td style={{ padding: '16px' }}>
                  <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
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
                <td style={{ padding: '16px' }}>{run.latency_ms} ms</td>
                <td style={{ padding: '16px' }}>{run.prompt_tokens}</td>
                <td style={{ padding: '16px', color: '#94a3b8' }}>{run.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
