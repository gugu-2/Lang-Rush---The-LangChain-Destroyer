import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Activity, AlertTriangle, Clock, Zap, DollarSign, TrendingUp, TrendingDown, ChevronRight, ShieldCheck, Sparkles, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockStats = {
  total_runs: 14823,
  error_rate: 2.4,
  avg_latency_ms: 1247,
  total_tokens: 48200000,
  total_cost_usd: 312.45,
};

const mockRunsOverTime = Array.from({length: 24}, (_, i) => ({
  time: `${i}:00`, count: Math.floor(Math.sin(i / 3) * 150 + 350)
}));

const mockErrorRate = Array.from({length: 24}, (_, i) => ({
  time: `${i}:00`, rate: parseFloat((Math.abs(Math.sin(i / 2)) * 3 + 0.5).toFixed(1))
}));

const mockCostByModel = [
  { model: 'gemini-2.5-flash', cost: 145.20, color: 'var(--brand)' },
  { model: 'gpt-4o', cost: 87.30, color: '#3139fb' },
  { model: 'claude-3-5-sonnet', cost: 62.10, color: '#a855f7' },
  { model: 'gpt-4o-mini', cost: 17.85, color: '#10b981' },
];

const mockLatency = Array.from({length: 24}, (_, i) => ({
  time: `${i}:00`,
  p50: Math.floor(Math.sin(i / 4) * 100 + 450),
  p95: Math.floor(Math.sin(i / 4) * 200 + 950),
  p99: Math.floor(Math.sin(i / 4) * 300 + 1450),
}));

const mockRuns = [
  { id: 'r1', name: 'RAG Pipeline Auto-Heal', status: 'success', model: 'models/gemini-2.5-flash', latency_ms: 450, total_cost_usd: 0.0002, prompt_tokens: 1240, run_type: 'chain', created_at: 'Just now' },
  { id: 'r2', name: 'Customer Support Guardrails Scan', status: 'success', model: 'models/gemini-2.5-flash', latency_ms: 320, total_cost_usd: 0.0001, prompt_tokens: 342, run_type: 'agent', created_at: '3 min ago' },
  { id: 'r3', name: 'JEPA World Model Trajectory', status: 'error', model: 'jepa-embed-v1', latency_ms: 120, total_cost_usd: 0.0000, prompt_tokens: 0, run_type: 'tool', created_at: '6 min ago' },
  { id: 'r4', name: 'Enterprise Compliance Audit', status: 'success', model: 'models/gemini-2.5-flash', latency_ms: 1850, total_cost_usd: 0.0015, prompt_tokens: 4200, run_type: 'chain', created_at: '11 min ago' },
  { id: 'r5', name: 'VoC Sentiment Clustering', status: 'success', model: 'models/gemini-2.5-flash', latency_ms: 920, total_cost_usd: 0.0005, prompt_tokens: 1890, run_type: 'tool', created_at: '15 min ago' },
];

const StatCard = ({ title, value, icon, change, isPositive }: any) => (
  <div style={{
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    flex: 1,
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--brand)' }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>{title}</div>
      <div style={{ color: 'var(--brand)', backgroundColor: 'var(--brand-subtle)', padding: '10px', borderRadius: '10px', display: 'flex' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.5px' }}>{value}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: isPositive ? '#10b981' : '#ef4444', fontWeight: 600 }}>
      {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      <span>{change}</span>
      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs last week</span>
    </div>
  </div>
);

export default function Dashboard() {
  const chartProps = {
    cartesianGrid: { stroke: "var(--border)", strokeDasharray: "3 3" },
    xAxis: { stroke: "var(--text-muted)", tick: { fill: "var(--text-muted)", fontSize: 11 } },
    yAxis: { stroke: "var(--text-muted)", tick: { fill: "var(--text-muted)", fontSize: 11 } },
    tooltip: { contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)' } }
  };

  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Banner / Welcome */}
      <div style={{ 
        marginBottom: '32px', padding: '24px 32px', borderRadius: '16px', 
        background: 'linear-gradient(135deg, var(--brand-subtle) 0%, var(--bg-card) 100%)',
        border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Welcome to LangRush Platform</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time LLMOps, JEPA Trajectory Predictions, and Security Guardrails powered live by Gemini.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/business" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: 'var(--brand)', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
            <Sparkles size={16} /> Business Hub
          </Link>
          <Link to="/flowforge" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: 'var(--bg-overlay)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
            <Network size={16} /> FlowForge
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <StatCard title="Total Runs" value={(mockStats.total_runs).toLocaleString()} icon={<Activity size={20} />} change="+12.5%" isPositive={true} />
        <StatCard title="Error Rate" value={`${mockStats.error_rate}%`} icon={<AlertTriangle size={20} />} change="-0.4%" isPositive={true} />
        <StatCard title="Avg Latency" value={`${mockStats.avg_latency_ms} ms`} icon={<Clock size={20} />} change="-45 ms" isPositive={true} />
        <StatCard title="Total Tokens" value={`${(mockStats.total_tokens / 1000000).toFixed(1)}M`} icon={<Zap size={20} />} change="+18.2%" isPositive={true} />
        <StatCard title="Est. Cost" value={`$${mockStats.total_cost_usd.toFixed(2)}`} icon={<DollarSign size={20} />} change="-$12.40" isPositive={true} />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Runs Over Time */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Runs Volume (Last 24h)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRunsOverTime}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="time" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Area type="monotone" dataKey="count" stroke="var(--brand)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost by Model */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Cost Breakdown by Model (USD)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCostByModel}>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="model" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                  {mockCostByModel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Latency Percentiles + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Latency Percentiles */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Latency Percentiles (p50, p95, p99)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockLatency}>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="time" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Line type="monotone" dataKey="p50" stroke="#10b981" strokeWidth={2} dot={false} name="p50" />
                <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} dot={false} name="p95" />
                <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={false} name="p99" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Active Traces */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Recent Active Traces</h3>
            <Link to="/runs" style={{ color: 'var(--brand)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {mockRuns.map((run) => (
              <Link 
                to={`/runs/${run.id}`} 
                key={run.id}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
                  backgroundColor: 'var(--bg-overlay)', borderRadius: '10px', border: '1px solid var(--border)',
                  textDecoration: 'none', transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{run.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{run.model} • {run.created_at}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{run.latency_ms} ms</span>
                  <span style={{ 
                    padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                    backgroundColor: run.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: run.status === 'success' ? '#10b981' : '#ef4444'
                  }}>
                    {run.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
