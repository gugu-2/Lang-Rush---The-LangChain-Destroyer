import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Check, X, Filter } from 'lucide-react';

const mockQueue = [
  { id: 'q1', input: 'My account is locked and I cannot reset my password.', output: 'I apologize for the inconvenience. Please navigate to the "Help" section on the login page and click "Contact Support". Our team will assist you in unlocking your account.', model: 'gpt-4o', latency: 1243 },
  { id: 'q2', input: 'Give me a SQL query to find all users who signed up last week and have made a purchase.', output: 'SELECT u.id, u.name\nFROM users u\nJOIN purchases p ON u.id = p.user_id\nWHERE u.signup_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK);', model: 'gpt-4o-mini', latency: 890 },
];

export default function AnnotationQueue() {
  return (
    <div style={{ padding: '32px', color: 'white', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Annotation Queue</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Review production traces to build fine-tuning datasets.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#94a3b8' }}>
            <span style={{ color: 'white', fontWeight: 600 }}>12</span> of 45 reviewed
          </div>
          <div style={{ width: '100px', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
            <div style={{ width: '25%', height: '100%', backgroundColor: 'var(--brand)', borderRadius: '3px' }}></div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {mockQueue.map(item => (
          <div key={item.id} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ flex: 1, padding: '24px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Input</div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {item.input}
                </div>
              </div>
              <div style={{ flex: 1, padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Model Output</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '8px' }}>
                    <span>{item.model}</span>
                    <span>{item.latency} ms</span>
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {item.output}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>
                <MessageSquare size={16} /> Add Comment
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '8px', color: '#f43f5e', cursor: 'pointer', fontWeight: 500 }}>
                  <ThumbsDown size={18} /> Reject
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px', color: '#22c55e', cursor: 'pointer', fontWeight: 500 }}>
                  <ThumbsUp size={18} /> Approve
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
