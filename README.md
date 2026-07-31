# ⚡ LangRush

**The World's First All-in-One LLMOps + LangChain Developer Platform (The LangChain Destroyer)**

> Observe · Debug · Evaluate · Build · Optimize — everything in one place.

![LangRush Banner](https://via.placeholder.com/1200x400/030710/4f6ef7?text=LangRush+%E2%80%94+All-in-One+LLMOps+Platform)

---

## 🚀 What is LangRush?

LangRush is a **closed-source commercial SaaS** that combines:

| Module | Description |
|--------|-------------|
| 📊 **Dashboard** | Real-time stats: runs, cost, latency, error rate |
| 🔍 **Traces & Runs** | Full trace capture with visual tree debugger (like LangSmith) |
| 🌳 **Trace Detail** | ChainScope-powered visual debugger for every LLM/tool/chain step |
| 🛡️ **Security Firewall** | Inline PII redaction and prompt injection defense |
| 🔧 **Auto-Healing Middleware** | Automated error-repair engine powered by Gemini |
| 💼 **Business Hub** | 5 autonomous AI business engines (Compliance, VoC, Proposals, Medical, SDR Battlecards) |
| 🎨 **Shadcn UI Engine** | Native Radix UI primitives and Tailwind CSS design tokens |
| 🗂️ **Projects** | Organize runs, manage environments, set alert thresholds |
| 🧪 **Datasets & Evals** | Build test sets, run LLM-as-judge evaluations, track regression |
| 📝 **Prompt Hub** | PromptVault — Git-style versioned prompts with A/B testing |
| 🎮 **Playground** | Live prompt editor with model comparison |
| 💸 **TokenMiser** | Semantic cache + smart routing — cut your API bill 40–70% |
| 🧪 **AgentBench** | pytest for LangGraph agents with semantic assertions |
| 🎨 **FlowForge** | Drag-and-drop visual LangGraph builder with live code sync |
| 📈 **Monitoring** | Time-series charts, alert rules, cost forecasting |
| 🔬 **Failure Intelligence** | AI-powered failure clustering and root cause analysis |

---

## ⚡ Quick Start (Local Dev)

### Prerequisites
- Python 3.11+
- Node.js 20+
- (Optional) Redis for TokenMiser caching

### 1. Backend

```powershell
cd backend
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env and add your GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

Backend API docs: http://localhost:8000/docs

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

### 3. Python SDK

```powershell
cd sdk
pip install -e .
```

```python
import langrush

# Configure (or set LANGRUSH_API_KEY + LANGRUSH_URL env vars)
langrush.configure(
    api_key="your-project-api-key",
    base_url="http://localhost:8000"
)

# Trace a LangChain chain
from langrush import LangRushCallbackHandler
handler = LangRushCallbackHandler()
result = chain.invoke({"question": "Hello"}, config={"callbacks": [handler]})

# Trace any function
from langrush import traceable

@traceable(name="my-retrieval", run_type="tool")
def retrieve_docs(query: str) -> list:
    return vectorstore.similarity_search(query)

# Use Prompt Hub
from langrush import hub
prompt = hub.pull("rag-system-prompt")  # Fetches latest production version

# Cost optimization
from langrush import optimize

@optimize(budget="$10/day", cache=True, prefer_cheap=True)
def answer(query: str) -> str:
    return llm.invoke(query)
```

---

## 🐳 One-Command Docker Deploy

```powershell
cp .env.example .env
# Add GEMINI_API_KEY to .env
docker-compose up -d
```

Open: http://localhost:5173

---

## 🧪 AgentBench — Testing Your Agents

```python
from langrush.testing import AgentTest, assert_tool_called, assert_contains_topic, assert_no_hallucination

class TestMyRAGAgent(AgentTest):
    agent = my_rag_agent

    def test_uses_search_for_unknown_facts(self):
        result = self.run("What is the GDP of Iceland in 2024?")
        assert_tool_called(result, tool="web_search")
        assert_contains_topic(result, "GDP")

    def test_handles_greeting(self):
        result = self.run("Hello!")
        assert_contains_topic(result, "hello")

    def test_no_hallucination(self):
        result = self.run("What does our refund policy say?")
        assert_no_hallucination(result, source=refund_policy_text)
```

Run: `langrush test run --suite TestMyRAGAgent`

---

## 💸 TokenMiser — Cut Your API Bill

```python
from langrush import optimize

# Simple — drop-in decorator, zero config changes needed
@optimize(budget="$20/day", cache=True, prefer_cheap=True)
def my_llm_pipeline(question: str) -> str:
    return rag_chain.invoke({"question": question})

# Results: 
# ✅ Semantic cache: identical/similar questions hit cache (0 API cost)
# ✅ Smart routing: simple questions → gemini-2.5-flash (10x cheaper)
# ✅ Budget guard: warns and throttles when daily limit approaches
```

---

## 🎨 FlowForge — Build LangGraph Agents Visually

1. Open http://localhost:5173/flowforge
2. Drag nodes from the palette: LLM, Tool, Router, Memory, Human-in-loop
3. Connect them with edges
4. Live Python code appears in the right panel
5. Download as `.py` or run directly

---

## 📊 Pricing

| Plan | Price | Runs/month | Features |
|------|-------|-----------|---------|
| Starter | Free | 5,000 | 1 project, 7-day retention |
| Pro | $49/mo | 100,000 | All modules, 90-day retention |
| Team | $149/mo | 500,000 | 5 seats, RBAC, unlimited projects |
| Enterprise | $499+/mo | Unlimited | SSO, SLA, dedicated support |

---

## 🛠️ Architecture

```
langrush/
├── backend/          # FastAPI + SQLAlchemy + SQLite/PostgreSQL
├── frontend/         # React 19 + Vite + Tailwind CSS + shadcn/ui
├── sdk/              # Python SDK (pip install langrush-sdk)
├── docker-compose.yml
└── .env.example
```

- **Backend**: FastAPI, SQLAlchemy (async), SQLite (dev) / PostgreSQL (prod)
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, Recharts, React Flow
- **SDK**: Pure Python, zero heavy dependencies, async-safe
- **Realtime**: WebSocket streaming for live trace updates

---

## 📄 License

Commercial Software — All rights reserved.
Contact: your-email@example.com

---

*Built with ❤️ using FastAPI, React, and Gemini*
