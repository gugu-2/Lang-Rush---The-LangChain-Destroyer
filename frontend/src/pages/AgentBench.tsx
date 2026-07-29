import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, ChevronRight, ChevronDown, ShieldAlert, Bug } from 'lucide-react';

const mockSuites = [
  { id: 's1', name: 'ReAct Agent Core Capabilities', tests: 45, score: 92, lastRun: '2 hours ago', pass: 41, fail: 4 },
  { id: 's2', name: 'Tool Use Safety bounds', tests: 12, score: 100, lastRun: '1 day ago', pass: 12, fail: 0 },
  { id: 's3', name: 'Multi-turn Reasoning', tests: 28, score: 75, lastRun: '3 days ago', pass: 21, fail: 7 },
];

const mockTests = [
  { id: 't1', name: 'Refuses to execute destructive SQL', result: 'pass', latency: 1240 },
  { id: 't2', name: 'Successfully uses web_search for current events', result: 'pass', latency: 2341 },
  { id: 't3', name: 'Recovers from tool error correctly', result: 'fail', latency: 4520, error: 'Agent entered infinite loop instead of apologizing.' },
];

export default function AgentBench() {
  const [expandedSuite, setExpandedSuite] = useState<string | null>(mockSuites[0].id);

  return (
    <div style={{ padding: '32px', color: 'white', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>AgentBench</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Continuous integration testing for autonomous agents.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Play size={18} fill="white" /> Run All Suites
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockSuites.map(suite => (
          <div key={suite.id} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
            <div 
              onClick={() => setExpandedSuite(expandedSuite === suite.id ? null : suite.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', cursor: 'pointer', backgroundColor: expandedSuite === suite.id ? 'rgba(255,255,255,0.01)' : 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ color: '#94a3b8' }}>
                  {expandedSuite === suite.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>{suite.name}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.875rem', color: '#94a3b8' }}>
                    <span>{suite.tests} tests</span>
                    <span>Last run: {suite.lastRun}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e' }}><CheckCircle2 size={16} /> {suite.pass}</div>
                  {suite.fail > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f43f5e' }}><XCircle size={16} /> {suite.fail}</div>}
                </div>
                <div style={{ textAlign: 'right', width: '60px' }}>
                  <div style={{ color: suite.score >= 90 ? '#22c55e' : suite.score >= 70 ? '#f59e0b' : '#f43f5e', fontWeight: 700, fontSize: '1.25rem' }}>{suite.score}%</div>
                </div>
              </div>
            </div>

            {expandedSuite === suite.id && (
              <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', marginBottom: '16px' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <Play size={14} /> Run Suite
                  </button>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <tbody>
                    {mockTests.map((test, i) => (
                      <tr key={test.id} style={{ borderBottom: i === mockTests.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '16px 8px', width: '40px' }}>
                          {test.result === 'pass' ? <CheckCircle2 size={18} color="#22c55e" /> : <XCircle size={18} color="#f43f5e" />}
                        </td>
                        <td style={{ padding: '16px 8px', color: 'white' }}>
                          <div style={{ fontWeight: 500 }}>{test.name}</div>
                          {test.error && <div style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Bug size={12} /> {test.error}</div>}
                        </td>
                        <td style={{ padding: '16px 8px', color: '#94a3b8', textAlign: 'right' }}>{test.latency} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
