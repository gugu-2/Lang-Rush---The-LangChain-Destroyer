import React, { useCallback } from 'react';
import ReactFlow, { 
  Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  Handle, Position, BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Download, Save, Zap, Database, MessageSquare } from 'lucide-react';

const initialNodes = [
  { id: '1', type: 'inputNode', position: { x: 50, y: 150 }, data: { label: 'User Input' } },
  { id: '2', type: 'retrieveNode', position: { x: 300, y: 150 }, data: { label: 'Vector Store' } },
  { id: '3', type: 'llmNode', position: { x: 550, y: 150 }, data: { label: 'gpt-4o' } },
  { id: '4', type: 'outputNode', position: { x: 800, y: 150 }, data: { label: 'Output' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#94a3b8' } },
];

// Custom Node Components
const InputNode = ({ data }: any) => (
  <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 24px', minWidth: '150px', color: 'white', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
    <MessageSquare size={16} color="#94a3b8" /> {data.label}
    <Handle type="source" position={Position.Right} style={{ background: '#94a3b8' }} />
  </div>
);

const RetrieveNode = ({ data }: any) => (
  <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid #a855f7', borderRadius: '8px', padding: '12px 24px', minWidth: '150px', color: 'white', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 10px rgba(168, 85, 247, 0.2)' }}>
    <Handle type="target" position={Position.Left} style={{ background: '#a855f7' }} />
    <Database size={16} color="#a855f7" /> {data.label}
    <Handle type="source" position={Position.Right} style={{ background: '#a855f7' }} />
  </div>
);

const LlmNode = ({ data }: any) => (
  <div style={{ background: 'rgba(79, 110, 247, 0.1)', border: '1px solid #4f6ef7', borderRadius: '8px', padding: '12px 24px', minWidth: '150px', color: 'white', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 10px rgba(79, 110, 247, 0.2)' }}>
    <Handle type="target" position={Position.Left} style={{ background: '#4f6ef7' }} />
    <Zap size={16} color="#4f6ef7" /> {data.label}
    <Handle type="source" position={Position.Right} style={{ background: '#4f6ef7' }} />
  </div>
);

const OutputNode = ({ data }: any) => (
  <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 24px', minWidth: '150px', color: 'white', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Handle type="target" position={Position.Left} style={{ background: '#94a3b8' }} />
    <MessageSquare size={16} color="#94a3b8" /> {data.label}
  </div>
);

const nodeTypes = { inputNode: InputNode, retrieveNode: RetrieveNode, llmNode: LlmNode, outputNode: OutputNode };

const generatedCode = `from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from typing import TypedDict, List

class State(TypedDict):
    question: str
    context: List[str]
    answer: str

def retrieve(state: State) -> State:
    # Tool: Document Retrieval
    docs = retriever.get_relevant_documents(state["question"])
    return {**state, "context": [d.page_content for d in docs]}

def generate(state: State) -> State:
    # LLM: gpt-4o
    llm = ChatOpenAI(model="gpt-4o")
    prompt = f"Context: {chr(10).join(state['context'])}\\n\\nQuestion: {state['question']}"
    response = llm.invoke(prompt)
    return {**state, "answer": response.content}

# Build graph
graph = StateGraph(State)
graph.add_node("retrieve", retrieve)
graph.add_node("generate", generate)
graph.set_entry_point("retrieve")
graph.add_edge("retrieve", "generate")
graph.add_edge("generate", END)

app = graph.compile()
`;

export default function FlowForge() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Toolbar */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-base)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>RAG Pipeline</h1>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Draft</span>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
            <Save size={16} /> Save
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
            <Download size={16} /> Export .py
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
            <Play size={16} fill="white" /> Generate Code
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="rgba(255,255,255,0.1)" />
            <Controls style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', fill: 'white' }} />
          </ReactFlow>
        </div>

        {/* Code Panel */}
        <div style={{ width: '450px', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0f1c' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem', fontWeight: 600, color: 'white', display: 'flex', justifyContent: 'space-between' }}>
            <span>Generated LangGraph Code</span>
            <span style={{ color: 'var(--brand)', fontSize: '0.75rem', cursor: 'pointer' }}>Copy</span>
          </div>
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5 }}>
              <code dangerouslySetInnerHTML={{ __html: generatedCode.replace(/def /g, '<span style="color: #c678dd">def </span>').replace(/class /g, '<span style="color: #c678dd">class </span>').replace(/return/g, '<span style="color: #c678dd">return</span>').replace(/import/g, '<span style="color: #c678dd">import</span>').replace(/from/g, '<span style="color: #c678dd">from</span>').replace(/\"(.*?)\"/g, '<span style="color: #98c379">"$1"</span>') }} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
