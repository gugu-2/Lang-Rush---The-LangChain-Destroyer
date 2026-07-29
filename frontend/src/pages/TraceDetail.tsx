import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Clock, Zap, Activity, AlertTriangle, Play, Settings2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const mockTrace = {
  id: 'root', name: 'RAG Pipeline Auto-Heal', run_type: 'chain', status: 'success',
  latency_ms: 2450, prompt_tokens: 1890, completion_tokens: 342, total_cost_usd: 0.024,
  inputs: { question: 'What is LangRush platform architecture?' },
  outputs: { answer: 'LangRush is an all-in-one LLMOps platform with JEPA world models, auto-healing middleware, and enterprise guardrails...' },
  children: [
    { 
      id: 'r1', name: 'Retrieve Documents', run_type: 'tool', status: 'success', 
      latency_ms: 234, prompt_tokens: 0, completion_tokens: 0, total_cost_usd: 0, 
      inputs: { query: 'LangRush' }, 
      outputs: { docs: ['LangRush provides 26 observability and business modules...', 'JEPA predicts agent loops in embedding space...'] }, 
      children: [] 
    },
    { 
      id: 'r2', name: 'models/gemini-2.5-flash', run_type: 'llm', status: 'success', 
      latency_ms: 2216, prompt_tokens: 1890, completion_tokens: 342, total_cost_usd: 0.024,
      inputs: { prompt: 'You are a helpful assistant...\n\nContext: LangRush provides...\n\nQuestion: What is LangRush?' },
      outputs: { text: 'LangRush is an all-in-one LLMOps platform...' },
      children: [] 
    }
  ]
};

const TypeIcon = ({ type }: { type: string }) => {
  switch(type) {
    case 'llm': return <Zap size={16} color="var(--brand)" />;
    case 'tool': return <Settings2 size={16} color="#a855f7" />;
    case 'chain': return <Activity size={16} color="#10b981" />;
    default: return <Activity size={16} color="var(--text-muted)" />;
  }
};

const JsonViewer = ({ data, label }: { data: any, label: string }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    <div style={{ backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
    </div>
  </div>
);

const TraceNode = ({ node, level = 0, isLast = true }: { node: any, level?: number, isLast?: boolean, key?: any }) => {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <div style={{ position: 'relative' }}>
      {level > 0 && (
        <div style={{ 
          position: 'absolute', 
          left: `${level * 24 - 12}px`, 
          top: 0, 
          bottom: isLast ? '50%' : '-100%', 
          width: '1px', 
          backgroundColor: 'var(--border)' 
        }} />
      )}
      
      {level > 0 && (
        <div style={{ 
          position: 'absolute', 
          left: `${level * 24 - 12}px`, 
          top: '24px', 
          width: '12px', 
          height: '1px', 
          backgroundColor: 'var(--border)' 
        }} />
      )}

      <div style={{ paddingLeft: `${level * 24}px`, marginBottom: '16px' }}>
        <div 
          onClick={() => setExpanded(!expanded)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px', 
            backgroundColor: 'var(--bg-card)', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {node.children && node.children.length > 0 ? (
                expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
              ) : (
                <div style={{ width: '18px' }} />
              )}
            </span>
            <TypeIcon type={node.run_type} />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{node.name}</span>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--brand-subtle)', color: 'var(--brand)', textTransform: 'uppercase', fontWeight: 600 }}>{node.run_type}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>{node.latency_ms} ms</span>
            <span>{node.prompt_tokens + node.completion_tokens} tokens</span>
            <span>${node.total_cost_usd.toFixed(4)}</span>
          </div>
        </div>

        {expanded && (
          <div style={{ marginTop: '12px', paddingLeft: '28px' }}>
            <JsonViewer label="Input Parameters" data={node.inputs} />
            <JsonViewer label="Execution Output" data={node.outputs} />
          </div>
        )}
      </div>

      {expanded && node.children && node.children.map((child: any, idx: number) => (
        <TraceNode key={child.id} node={child} level={level + 1} isLast={idx === node.children.length - 1} />
      ))}
    </div>
  );
};

export default function TraceDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <Link to="/runs" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Runs</Link> / <span>{id || 'root'}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{mockTrace.name}</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-overlay)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
            <Play size={16} /> Replay Trace
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>SUCCESS</div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>LATENCY</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{mockTrace.latency_ms} ms</div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL TOKENS</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{mockTrace.prompt_tokens + mockTrace.completion_tokens}</div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL COST</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>${mockTrace.total_cost_usd}</div>
        </div>
      </div>

      {/* Execution Tree */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Execution Tree (ChainScope Debugger)</h2>
        <TraceNode node={mockTrace} />
      </div>

    </div>
  );
}
