import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Clock, Zap, Activity, AlertTriangle, Play, Settings2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const mockTrace = {
  id: 'root', name: 'RAG Pipeline', run_type: 'chain', status: 'success',
  latency_ms: 2450, prompt_tokens: 1890, completion_tokens: 342, total_cost_usd: 0.024,
  inputs: { question: 'What is LangChain?' },
  outputs: { answer: 'LangChain is a framework for building LLM applications...' },
  children: [
    { 
      id: 'r1', name: 'Retrieve Documents', run_type: 'tool', status: 'success', 
      latency_ms: 234, prompt_tokens: 0, completion_tokens: 0, total_cost_usd: 0, 
      inputs: { query: 'LangChain' }, 
      outputs: { docs: ['LangChain provides standard interfaces...', 'Agents use an LLM as a reasoning engine...'] }, 
      children: [] 
    },
    { 
      id: 'r2', name: 'gpt-4o', run_type: 'llm', status: 'success', 
      latency_ms: 2216, prompt_tokens: 1890, completion_tokens: 342, total_cost_usd: 0.024,
      inputs: { prompt: 'You are a helpful assistant...\n\nContext: LangChain provides...\n\nQuestion: What is LangChain?' },
      outputs: { text: 'LangChain is a framework for building applications powered by large language models (LLMs)...' },
      children: [] 
    }
  ]
};

const TypeIcon = ({ type }: { type: string }) => {
  switch(type) {
    case 'llm': return <Zap size={16} color="#4f6ef7" />;
    case 'tool': return <Settings2 size={16} color="#a855f7" />;
    case 'chain': return <Activity size={16} color="#22c55e" />;
    default: return <Activity size={16} color="#94a3b8" />;
  }
};

const JsonViewer = ({ data, label }: { data: any, label: string }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '0.875rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
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
          backgroundColor: 'rgba(255,255,255,0.1)' 
        }} />
      )}
      
      {level > 0 && (
        <div style={{ 
          position: 'absolute', 
          left: `${level * 24 - 12}px`, 
          top: '24px', 
          width: '12px', 
          height: '1px', 
          backgroundColor: 'rgba(255,255,255,0.1)' 
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
            backgroundColor: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#94a3b8' }}>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
              <TypeIcon type={node.run_type} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase' }}>{node.run_type}</span>
            </div>
            <span style={{ fontWeight: 600, color: 'white' }}>{node.name}</span>
            {node.status === 'error' && <span style={{ color: '#f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 }}>Failed</span>}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '0.875rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {node.latency_ms} ms</div>
            {node.prompt_tokens > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> {node.prompt_tokens + node.completion_tokens} tkns</div>}
            {node.total_cost_usd > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>${node.total_cost_usd}</div>}
          </div>
        </div>

        {expanded && (
          <div style={{ marginTop: '16px', paddingLeft: '28px' }}>
            <JsonViewer data={node.inputs} label="Inputs" />
            <JsonViewer data={node.outputs} label="Outputs" />
          </div>
        )}
      </div>

      {expanded && node.children && node.children.length > 0 && (
        <div style={{ position: 'relative' }}>
          {node.children.map((child: any, i: number) => (
            <TraceNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              isLast={i === node.children.length - 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TraceDetail() {
  const [activeTab, setActiveTab] = useState('tree');
  const { id } = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Breadcrumb */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#94a3b8' }}>
        <Link to="/runs" style={{ color: '#94a3b8', textDecoration: 'none' }}>Runs</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'white', fontWeight: 500 }}>{id || mockTrace.id}</span>
      </div>

      {/* Header Info */}
      <div style={{ padding: '32px', backgroundColor: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>{mockTrace.name}</h1>
          <span className="badge" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 12px', borderRadius: '16px', fontSize: '0.875rem', fontWeight: 500 }}>
            {mockTrace.status.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '48px', fontSize: '0.875rem' }}>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Total Latency</div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>{mockTrace.latency_ms} ms</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Tokens</div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>{mockTrace.prompt_tokens + mockTrace.completion_tokens}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Total Cost</div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>${mockTrace.total_cost_usd}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Time</div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>Oct 24, 14:32:05</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 32px' }}>
        <button 
          onClick={() => setActiveTab('tree')}
          style={{ padding: '16px 24px', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'tree' ? '2px solid var(--brand)' : '2px solid transparent', color: activeTab === 'tree' ? 'white' : '#94a3b8', fontWeight: 500, cursor: 'pointer' }}
        >
          Trace Tree
        </button>
        <button 
          onClick={() => setActiveTab('timeline')}
          style={{ padding: '16px 24px', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'timeline' ? '2px solid var(--brand)' : '2px solid transparent', color: activeTab === 'timeline' ? 'white' : '#94a3b8', fontWeight: 500, cursor: 'pointer' }}
        >
          Timeline
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        {activeTab === 'tree' ? (
          <TraceNode node={mockTrace} />
        ) : (
          <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '48px' }}>Timeline view coming soon.</div>
        )}
      </div>
    </div>
  );
}
