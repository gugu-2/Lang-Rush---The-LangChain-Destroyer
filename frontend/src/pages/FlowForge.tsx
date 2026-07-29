import React from 'react';
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
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'var(--brand)' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: 'var(--brand)' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: 'var(--brand)' } },
];

// Custom Node Components using CSS Variables for multi-theme compatibility
const InputNode = ({ data }: any) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 24px', minWidth: '150px', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-sm)' }}>
    <MessageSquare size={16} color="var(--text-secondary)" /> {data.label}
    <Handle type="source" position={Position.Right} style={{ background: 'var(--brand)' }} />
  </div>
);

const RetrieveNode = ({ data }: any) => (
  <div style={{ background: 'var(--brand-subtle)', border: '1px solid var(--brand)', borderRadius: '12px', padding: '12px 24px', minWidth: '150px', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-glow)' }}>
    <Handle type="target" position={Position.Left} style={{ background: 'var(--brand)' }} />
    <Database size={16} color="var(--brand)" /> {data.label}
    <Handle type="source" position={Position.Right} style={{ background: 'var(--brand)' }} />
  </div>
);

const LlmNode = ({ data }: any) => (
  <div style={{ background: 'var(--brand-subtle)', border: '1px solid var(--brand)', borderRadius: '12px', padding: '12px 24px', minWidth: '150px', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-glow)' }}>
    <Handle type="target" position={Position.Left} style={{ background: 'var(--brand)' }} />
    <Zap size={16} color="var(--brand)" /> {data.label}
    <Handle type="source" position={Position.Right} style={{ background: 'var(--brand)' }} />
  </div>
);

const OutputNode = ({ data }: any) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 24px', minWidth: '150px', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-sm)' }}>
    <Handle type="target" position={Position.Left} style={{ background: 'var(--brand)' }} />
    <MessageSquare size={16} color="var(--text-secondary)" /> {data.label}
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'var(--text-primary)' }}>
      
      {/* Toolbar */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-base)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>RAG Pipeline</h1>
          <span style={{ backgroundColor: 'var(--brand-subtle)', color: 'var(--brand)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--brand)' }}>Draft</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-overlay)', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
            <Save size={16} /> Save Graph
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', color: 'white', backgroundColor: 'var(--brand)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
            <Play size={16} /> Test Flow
          </button>
        </div>
      </div>

      {/* Main Flow + Code Split Area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        
        {/* Canvas Area */}
        <div style={{ flex: 1, position: 'relative', backgroundColor: 'var(--bg-base)' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="var(--border)" variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <MiniMap style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} maskColor="var(--bg-base)" />
          </ReactFlow>
        </div>

        {/* Generated Code Sidebar */}
        <div style={{ width: '450px', borderLeft: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Generated LangGraph Python Code</span>
            <button style={{ color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: '4px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
              <Download size={14} /> Export .py
            </button>
          </div>
          <div style={{ flex: 1, padding: '16px', backgroundColor: 'var(--bg-overlay)', overflowY: 'auto' }}>
            <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-wrap', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
              {generatedCode}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}
