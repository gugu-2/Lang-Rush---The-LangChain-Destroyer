# 🏗️ LangRush System Architecture & Design

## Monorepo Layout

```
langrush/
├── backend/                  # FastAPI 0.115 + SQLAlchemy 2.0 Async
│   ├── main.py               # Main application entry & middleware initialization
│   ├── config.py             # Pydantic BaseSettings & Gemini API key configuration
│   ├── database.py           # Async engine (SQLite aiosqlite / PostgreSQL)
│   ├── models/               # SQLAlchemy 2.0 Declarative Models (User, Project, Run, Dataset, etc.)
│   ├── routers/              # 12 REST Routers + WebSocket + Power + Business Engines
│   └── services/             # Gemini API, Evaluators, JEPA World Model, Flow Codegen
├── frontend/                 # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── index.css         # Premium Dark Navy Design System
│   │   ├── App.tsx           # React Router 15-page layout mapping
│   │   ├── components/       # Sidebar, TopBar, JsonViewer, Modals
│   │   ├── pages/            # 15+ Interactive pages
│   │   └── api/              # Axios HTTP client with Bearer auth interceptor
├── sdk/                      # LangRush Official Python SDK (pip install langrush-sdk)
│   ├── langrush/             # Core package
│   │   ├── callback_handler  # LangChain callback hook
│   │   ├── traceable.py      # @traceable decorator
│   │   ├── auto_heal.py      # @auto_heal runtime repair decorator
│   │   ├── guardrails.py     # @guardrails inline security firewall
│   │   ├── optimize.py       # @optimize TokenMiser cost manager
│   │   └── testing/          # AgentBench pytest semantic assertion framework
├── docs/                     # Comprehensive technical documentation
├── docker-compose.yml        # Full-stack container orchestration
├── .env                      # Global environment variable configuration
└── test_all_features.py      # End-to-end 20-module integration test suite
```

---

## ⚡ High-Level Data Flow

```
                                  +-----------------------+
                                  |  Developer / Agent    |
                                  +-----------+-----------+
                                              |
                          SDK / REST Telemetry| (X-API-Key / Bearer)
                                              v
+------------------+             +------------+------------+             +-------------------+
|  React 18 UI     | <== HTTP ==>|  FastAPI Backend API    | <== REST ==>|  Gemini 2.5 API   |
|  (Port 5173)     |  WebSocket  |  (Port 8000)            |             |  (LLM Engine)     |
+------------------+             +------------+------------+             +-------------------+
                                              |
                                     SQLAlchemy (async)
                                              v
                                 +------------+------------+
                                 |  SQLite / PostgreSQL DB |
                                 +-------------------------+
```

---

## 🗄️ Database Schemas

1. **`users`**: User profiles, plans (`free`/`pro`/`team`/`enterprise`), hashed passwords.
2. **`projects`**: Project containers, API keys (`uuid`), environment settings.
3. **`runs`**: Execution spans (root agents, tools, chains, LLMs), latencies, token counts, cost, parent-child relations.
4. **`datasets` & `dataset_examples`**: Golden test sets, inputs/outputs pairs.
5. **`eval_runs` & `eval_results`**: Evaluation executions and per-example scoring results.
6. **`prompts` & `prompt_versions`**: Versioned prompt repository with production flags.
7. **`flows`**: Visual LangGraph topologies stored as JSON graphs + generated Python code.
8. **`alert_rules` & `alert_events`**: System monitoring thresholds & event logs.
9. **`annotation_queues` & `annotations`**: Human review queues and feedback scores.
