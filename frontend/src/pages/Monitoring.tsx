import React from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, Plus } from 'lucide-react';

const mockVolume = Array.from({length: 30}, (_, i) => ({ day: i+1, count: Math.floor(Math.random() * 5000 + 10000) }));
const mockLatency = Array.from({length: 30}, (_, i) => ({ day: i+1, p50: 800 + Math.random()*200, p95: 1500 + Math.random()*400, p99: 2500 + Math.random()*800 }));
const mockErrors = Array.from({length: 30}, (_, i) => ({ day: i+1, rate: 1 + Math.random()*3 }));
const mockTokens = Array.from({length: 30}, (_, i) => ({ day: i+1, tokens: Math.floor(Math.random() * 2000000 + 5000000) }));

export default function Monitoring() {
  const chartProps = {
    cartesianGrid: { stroke: "rgba(255,255,255,0.05)" },
    xAxis: { stroke: "#475569", tick: { fill: "#475569" } },
    yAxis: { stroke: "#475569", tick: { fill: "#475569" } },
    tooltip: { contentStyle: { background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 } }
  };

  return (
    <div style={{ padding: '32px', color: 'white', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>System Monitoring</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>7d</button>
          <button style={{ padding: '6px 12px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer' }}>30d</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Request Volume */}
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', fontWeight: 600 }}>Request Volume</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockVolume}>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="day" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Line type="monotone" dataKey="count" stroke="#4f6ef7" strokeWidth={2} dot={false} fillOpacity={1} fill="url(#colorUv)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency */}
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', fontWeight: 600 }}>Latency (ms)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockLatency}>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="day" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Line type="monotone" dataKey="p99" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p95" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p50" stroke="#4f6ef7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Rate */}
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', fontWeight: 600 }}>Error Rate (%)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockErrors}>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="day" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Area type="monotone" dataKey="rate" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tokens */}
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', fontWeight: 600 }}>Token Usage</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTokens}>
                <CartesianGrid {...chartProps.cartesianGrid} />
                <XAxis dataKey="day" {...chartProps.xAxis} />
                <YAxis {...chartProps.yAxis} />
                <Tooltip {...chartProps.tooltip} />
                <Bar dataKey="tokens" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alert Rules */}
      <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Active Alerts</h3>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 500, cursor: 'pointer' }}>
            <Plus size={16} /> Add Alert
          </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Metric</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Condition</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Channel</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white' }}>
              <td style={{ padding: '16px' }}>Error Rate</td>
              <td style={{ padding: '16px' }}>&gt; 5% for 5 mins</td>
              <td style={{ padding: '16px', color: '#94a3b8' }}>#alerts-critical</td>
              <td style={{ padding: '16px' }}>
                <div style={{ width: '36px', height: '20px', backgroundColor: 'var(--brand)', borderRadius: '10px', position: 'relative' }}>
                  <div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                </div>
              </td>
            </tr>
            <tr style={{ color: 'white' }}>
              <td style={{ padding: '16px' }}>p95 Latency</td>
              <td style={{ padding: '16px' }}>&gt; 3000ms for 10 mins</td>
              <td style={{ padding: '16px', color: '#94a3b8' }}>pagerduty</td>
              <td style={{ padding: '16px' }}>
                <div style={{ width: '36px', height: '20px', backgroundColor: 'var(--brand)', borderRadius: '10px', position: 'relative' }}>
                  <div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
