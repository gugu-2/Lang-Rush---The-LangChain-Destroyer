import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import Runs from './pages/Runs'
import TraceDetail from './pages/TraceDetail'
import Projects from './pages/Projects'
import Datasets from './pages/Datasets'
import Evaluations from './pages/Evaluations'
import AnnotationQueue from './pages/AnnotationQueue'
import PromptHub from './pages/PromptHub'
import PromptPlayground from './pages/PromptPlayground'
import TokenMiser from './pages/TokenMiser'
import AgentBench from './pages/AgentBench'
import FlowForge from './pages/FlowForge'
import Monitoring from './pages/Monitoring'
import FailureClusters from './pages/FailureClusters'
import BusinessHub from './pages/BusinessHub'
import GuardrailsHub from './pages/GuardrailsHub'
import './index.css'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Real-time overview of your LLM application' },
  '/runs': { title: 'Traces & Runs', subtitle: 'Inspect every LLM call, chain, and agent step' },
  '/business': { title: 'Business Engines Hub', subtitle: 'High-impact autonomous AI business tools' },
  '/guardrails': { title: 'Security & Auto-Heal', subtitle: 'Inline security firewall and automated error-repair' },
  '/projects': { title: 'Projects', subtitle: 'Organize your runs and prompts by application' },
  '/datasets': { title: 'Datasets & Evaluations', subtitle: 'Build test sets and run quality evaluations' },
  '/evaluations': { title: 'Evaluations', subtitle: 'Track quality across versions with automated evals' },
  '/annotations': { title: 'Annotation Queue', subtitle: 'Human review and feedback on agent outputs' },
  '/prompts': { title: 'Prompt Hub', subtitle: 'Version-controlled prompt storage and management' },
  '/playground': { title: 'Prompt Playground', subtitle: 'Experiment and compare prompts live' },
  '/tokenmiser': { title: 'TokenMiser', subtitle: 'Cost optimization, semantic cache, and budget controls' },
  '/agentbench': { title: 'AgentBench', subtitle: 'Automated testing suite for LangGraph agents' },
  '/flowforge': { title: 'FlowForge', subtitle: 'Visual LangGraph agent builder' },
  '/monitoring': { title: 'Monitoring & Alerts', subtitle: 'Production observability and alert management' },
  '/failures': { title: 'Failure Intelligence', subtitle: 'AI-powered failure clustering and root cause analysis' },
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <TopBar titles={PAGE_TITLES} />
          <main className="page-content animate-fade-in">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/runs" element={<Runs />} />
              <Route path="/runs/:id" element={<TraceDetail />} />
              <Route path="/business" element={<BusinessHub />} />
              <Route path="/guardrails" element={<GuardrailsHub />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/evaluations" element={<Evaluations />} />
              <Route path="/annotations" element={<AnnotationQueue />} />
              <Route path="/prompts" element={<PromptHub />} />
              <Route path="/playground" element={<PromptPlayground />} />
              <Route path="/tokenmiser" element={<TokenMiser />} />
              <Route path="/agentbench" element={<AgentBench />} />
              <Route path="/flowforge" element={<FlowForge />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/failures" element={<FailureClusters />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
