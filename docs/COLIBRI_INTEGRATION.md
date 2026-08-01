# ⚡ LangRush × Colibrì — Feature Architectural Roadmap
### Integrating Local Air-Gapped MoE Inference into LangRush

> **Status:** Planning Document — No code changes yet.
> **Scope:** 4 major feature additions inspired by [JustVugg/Colibrì](https://github.com/JustVugg/colibri)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [What is Colibrì & How It Works](#what-is-colibri)
3. [Feature 1 — Air-Gapped Offline Mode](#feature-1---air-gapped-offline-mode)
4. [Feature 2 — TokenMiser Local Fallback Engine](#feature-2---tokenmiser-local-fallback-engine)
5. [Feature 3 — Zero-Cost Offline Evaluator](#feature-3---zero-cost-offline-evaluator)
6. [Feature 4 — Local Model Dashboard UI](#feature-4---local-model-dashboard-ui)
7. [Full Directory Structure After All Features](#full-directory-structure-after-all-features)
8. [Dependencies & Packages](#dependencies--packages)
9. [Known Problems & How to Solve Them](#known-problems--how-to-solve-them)
10. [Implementation Order & Timeline](#implementation-order--timeline)

---

## Executive Summary

LangRush currently relies 100% on **cloud AI APIs** (Gemini, OpenAI, Anthropic) to power all inference. This has 3 critical weaknesses:

| Weakness | Consequence |
|---|---|
| All data exits your machine | Violates HIPAA, GDPR, SOC2 for sensitive enterprise clients |
| API costs scale with usage | Running 10,000 eval tests = potentially $200–$500+ per run |
| API downtime = LangRush downtime | No fallback when cloud providers have outages |

**Colibrì solves all three** by enabling disk-streamed local MoE inference on consumer hardware.

By integrating these concepts, LangRush becomes the **world's first Hybrid (Cloud + Air-Gapped) LLMOps platform**.

---

## What is Colibrì?

Colibrì is an inference engine written in **pure C with zero external dependencies**. Its breakthrough is **SSD disk-streaming** for Mixture-of-Experts (MoE) models:

```
Traditional Model Loading:
  Load ENTIRE 744B model into VRAM  <- Requires $50,000+ GPUs

Colibri Disk Streaming:
  SSD (model) --stream only active experts--> 25GB RAM (inference)
              rest stays on disk
```

**Key specs:**
- Models supported: GLM-5.2 (744B), Inkling (975B), Kimi K3 (2.8T), OLMoE (7B)
- Minimum RAM: **24-32 GB** system RAM (not VRAM)
- Minimum SSD: **500GB-2TB NVMe** (fast read speed matters)
- Speed: **0.1-0.5 tokens/second** (slow — NOT for real-time chat)
- Ideal for: **batch jobs, evaluations, offline audits, privacy-sensitive workloads**

---

## Feature 1 — Air-Gapped Offline Mode

### What It Does
A dedicated **Offline Execution Engine** that allows users to run LangRush modules (Compliance Audit, PII Scanner, Document Synthesis) with a local model, with **zero internet traffic**.

### Architecture Diagram

```
LangRush Backend (FastAPI)
  |
  |-- Cloud Router (Gemini/OpenAI)  <--> Air-Gap Router (NEW)  /api/offline/*
                                              |
                                    LocalInferenceService (NEW)
                                      - Model registry
                                      - Subprocess launcher
                                      - Output parser
                                              |
                                    subprocess / socket
                                              |
colibri/ (NEW ROOT-LEVEL DIRECTORY)
  |-- engine/         <- Colibri C binary (pre-compiled)
  |-- models/         <- Downloaded MoE model weights
  |   |-- olmoe-7b/   <- Smallest model (~15GB SSD)
  |   |-- glm-744b/   <- Full frontier model (~400GB SSD)
  |-- configs/        <- Model configs (context len, etc)
  |-- bridge.py       <- Python <-> Colibri subprocess IPC
```

### New Files to Create

```
backend/
  routers/
    offline.py               <- NEW: Air-gapped inference API endpoints
  services/
    local_inference.py       <- NEW: Service layer for Colibri subprocess management
    model_registry.py        <- NEW: Track downloaded models, their status, size

colibri/                     <- NEW ROOT-LEVEL DIRECTORY
  engine/
    README.md                <- Instructions to download Colibri binary
    .gitkeep
  models/
    .gitkeep
  configs/
    olmoe_7b.json
    glm_744b.json
  bridge.py                  <- Python subprocess wrapper
  downloader.py              <- Helper to pull model weights from HuggingFace

frontend/src/pages/
  OfflineHub.tsx             <- NEW: Air-Gapped mode control panel page

frontend/src/components/
  OfflineStatusBadge.tsx     <- NEW: Shows "OFFLINE MODE ACTIVE" badge in TopBar
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/offline/status` | Returns local engine status, loaded model, SSD/RAM usage |
| GET | `/api/offline/models` | Lists all locally downloaded model files with sizes |
| POST | `/api/offline/models/download` | Triggers model download from HuggingFace |
| POST | `/api/offline/run` | Submits a prompt to local engine, returns job ID |
| GET | `/api/offline/run/{job_id}` | Polls status and partial output of a local inference job |
| DELETE | `/api/offline/run/{job_id}` | Cancels a running local job |
| POST | `/api/offline/audit` | Runs a full compliance audit locally |

### Process Flow

```
User sends POST /api/offline/run
        |
        v
LocalInferenceService checks if colibri binary exists
        | No?  -> Return error: "Download Colibri engine first"
        | Yes?
        v
Service spawns subprocess: ./colibri/engine/colibri -m ./models/olmoe-7b -p "prompt..."
        |
        v
bridge.py reads stdout line by line, accumulates tokens
        |
        v
WebSocket streams partial tokens back to frontend in real-time
        |
        v
Final output stored in DB as a Run record (type="offline")
```

---

## Feature 2 — TokenMiser Local Fallback Engine

### What It Does
When cloud API **daily budget is exhausted** or **rate limits hit (HTTP 429)**, TokenMiser automatically re-routes pending batch jobs to the local Colibrì engine instead of failing.

### Architecture Diagram

```
User Pipeline Call
        |
        v
TokenMiser Interceptor (optimize.py)
        |
        |-- Check 1: Cache hit? -----------------------> Return cached (free)
        |-- Check 2: Budget OK? YES -----------------> Cloud API (Gemini/OAI)
        |                       NO --+
        |                            v
        |              Check 3: Local engine available?
        |                       YES -----------------> Colibri Local Inference
        |                       NO  -----------------> Queue for later (Redis)
```

### New Files to Create

```
backend/
  services/
    fallback_router.py       <- NEW: Decision logic for cloud vs local routing

sdk/langforge/
  fallback.py                <- NEW: Client-side fallback logic for SDK users

frontend/src/pages/
  TokenMiser.tsx             <- MODIFY: Add "Fallback Engine" config section
```

### New DB Fields (in `models/run.py`)

```python
execution_mode: str   # "cloud" | "local" | "cache"
fallback_reason: str  # "budget_exceeded" | "rate_limit" | "manual"
local_model_used: str # "olmoe-7b" | "glm-744b" | None
```

---

## Feature 3 — Zero-Cost Offline Evaluator

### What It Does
Use the **local Colibrì MoE model as the LLM judge** in `Evaluations` and `AgentBench`. Run thousands of test cases overnight at **$0 API cost**.

### New Files to Create

```
backend/
  services/
    eval_judge.py            <- NEW: Unified judge service (cloud OR local)

frontend/src/pages/
  Evaluations.tsx            <- MODIFY: Add "Local LLM Judge" option
  AgentBench.tsx             <- MODIFY: Add "Run offline" toggle

frontend/src/components/
  EvalJobQueue.tsx           <- NEW: Shows batch eval queue status
```

### Batch Eval Flow

```
User clicks "Run Evaluation with Local LLM"
        |
        v
Backend creates EvalRun record (status="queued_local")
        |
        v
Celery/Background task iterates all dataset examples
        |   (this runs overnight -- no timeout)
        v
For each example:
  -> Format judge prompt: "Given input X, expected Y. Model output Z. Score 1-10:"
  -> Submit to Colibri subprocess
  -> Wait for score (2-5 min per example at 0.2 tok/sec)
  -> Store result in EvalResult table
        |
        v
Frontend polls /api/eval-runs/{id}/status
  -> Shows progress: "342 / 1000 examples complete (34%)"
        |
        v
Final report generated when all examples done
```

---

## Feature 4 — Local Model Dashboard UI

### What It Does
A new **Local Models** page in the frontend showing downloaded models, live SSD bandwidth, RAM consumption, active job status, and download progress.

### New Files to Create

```
frontend/src/pages/
  LocalModels.tsx            <- NEW: Full local model management dashboard

frontend/src/components/
  ModelDownloadCard.tsx      <- NEW: Model card with download progress
  InferenceMonitor.tsx       <- NEW: Live stats (tokens/sec, RAM, SSD speed)
  OfflineBatchQueue.tsx      <- NEW: Queued/running/completed offline jobs

backend/
  routers/
    system_metrics.py        <- NEW: RAM, SSD read speed, CPU usage endpoint
```

---

## Full Directory Structure After All Features

```
langrush/                           <- ROOT
|
|-- [NEW] colibri/                  <- NEW ROOT-LEVEL: All local inference assets
|   |-- engine/
|   |   |-- README.md
|   |   |-- .gitkeep               <- Binary NOT committed to git
|   |-- models/
|   |   |-- .gitkeep               <- Model weights NOT committed (too large)
|   |-- configs/
|   |   |-- olmoe_7b.json
|   |   |-- glm_744b.json
|   |   |-- kimi_k3.json
|   |-- bridge.py                  <- Python <-> Colibri IPC
|   |-- downloader.py              <- HuggingFace model downloader
|
|-- backend/
|   |-- models/
|   |   |-- user.py                <- existing
|   |   |-- project.py             <- existing
|   |   |-- run.py                 <- [MODIFY] add execution_mode, fallback_reason
|   |   |-- dataset.py             <- existing
|   |   |-- evaluation.py          <- existing
|   |   |-- [NEW] offline_job.py   <- NEW: OfflineJob DB table
|   |
|   |-- routers/
|   |   |-- auth.py                <- existing
|   |   |-- runs.py                <- existing
|   |   |-- stats.py               <- existing
|   |   |-- prompts.py             <- existing
|   |   |-- datasets.py            <- existing
|   |   |-- evaluations.py         <- [MODIFY] add local LLM judge
|   |   |-- business_engines.py    <- existing
|   |   |-- gamechangers.py        <- existing
|   |   |-- ws.py                  <- existing
|   |   |-- alerts.py              <- existing
|   |   |-- flows.py               <- existing
|   |   |-- [NEW] offline.py       <- NEW: Air-gapped inference API
|   |   |-- [NEW] system_metrics.py <- NEW: RAM/SSD/CPU stats API
|   |
|   |-- services/
|   |   |-- (existing services)
|   |   |-- [NEW] local_inference.py  <- NEW: Colibri subprocess manager
|   |   |-- [NEW] model_registry.py   <- NEW: Track downloaded models
|   |   |-- [NEW] fallback_router.py  <- NEW: Cloud vs local routing
|   |   |-- [NEW] eval_judge.py       <- NEW: Unified eval judge
|   |
|   |-- config.py                  <- [MODIFY] add colibri_engine_path
|   |-- main.py                    <- [MODIFY] register new routers
|   |-- requirements.txt           <- [MODIFY] add psutil, huggingface-hub, aiofiles
|
|-- frontend/
|   |-- src/
|       |-- pages/
|       |   |-- Dashboard.tsx       <- existing
|       |   |-- TokenMiser.tsx      <- [MODIFY] add Fallback Engine panel
|       |   |-- Evaluations.tsx     <- [MODIFY] add Local LLM Judge option
|       |   |-- AgentBench.tsx      <- [MODIFY] add Run Offline toggle
|       |   |-- [NEW] OfflineHub.tsx    <- NEW: Air-Gapped mode control panel
|       |   |-- [NEW] LocalModels.tsx   <- NEW: Local model management dashboard
|       |
|       |-- components/
|           |-- Sidebar.tsx         <- [MODIFY] add new page links
|           |-- TopBar.tsx          <- [MODIFY] add OFFLINE badge
|           |-- [NEW] OfflineStatusBadge.tsx
|           |-- [NEW] ModelDownloadCard.tsx
|           |-- [NEW] InferenceMonitor.tsx
|           |-- [NEW] EvalJobQueue.tsx
|           |-- [NEW] OfflineBatchQueue.tsx
|
|-- sdk/
|   |-- langforge/
|       |-- __init__.py             <- [MODIFY] export new offline classes
|       |-- optimize.py             <- [MODIFY] add fallback="local" support
|       |-- [NEW] fallback.py       <- NEW: Cloud->local fallback logic
|       |-- [NEW] offline_client.py <- NEW: SDK client for offline jobs
|
|-- docs/
    |-- [NEW] COLIBRI_INTEGRATION.md  <- This document
    |-- [NEW] OFFLINE_MODE_GUIDE.md   <- End-user setup guide
    |-- [NEW] LOCAL_MODELS.md         <- Supported models & hardware requirements
```

---

## Dependencies & Packages

### Backend (Python) — New Additions to `requirements.txt`

| Package | Purpose | Notes |
|---------|---------|-------|
| `psutil` | RAM usage, CPU %, disk I/O stats | Pure Python, lightweight |
| `huggingface-hub` | Download model weight files from HuggingFace | Well-maintained |
| `aiofiles` | Async file reading for download progress | Very lightweight |
| `celery[redis]` | Background task queue for overnight eval batches | **Already in requirements.txt** |
| `redis` | Queue storage | **Already in requirements.txt** |

> **No new heavyweight ML packages needed.** The actual inference is handled by the Colibrì C binary as a subprocess. Python only manages the process.

### Frontend (JavaScript)

> **No new npm packages needed.** `recharts`, `react-flow`, and all necessary libraries are already installed.

### Colibrì Binary — How to Get It

```bash
# The Colibri binary is a compiled C executable -- NOT a Python package.

# Windows:
# Download colibri.exe from https://github.com/JustVugg/colibri/releases
# Place at: langrush/colibri/engine/colibri.exe

# Linux / macOS:
# git clone https://github.com/JustVugg/colibri
# cd colibri && make
# Copy to: langrush/colibri/engine/colibri

# LangRush's downloader.py script will automate this entire step.
```

### Model Weights — Storage Requirements

| Model | Size on Disk | Min RAM | Best For |
|-------|-------------|---------|----------|
| OLMoE-7B | ~15 GB | 24 GB | Testing, small evals |
| GLM-5.2 744B | ~400 GB | 32 GB | Production compliance audits |
| Kimi K3 2.8T | ~1.5 TB | 64 GB | Ultra-frontier research |

---

## Known Problems & How to Solve Them

### Problem 1: Colibrì is SLOW (0.2-0.5 tok/sec)

**Impact:** A 500-token response takes ~25 minutes. Standard 30s API timeouts will fail.

**Solutions:**
- NEVER use local inference for real-time chat or interactive Playground
- Use **async Job Queue pattern** only: submit -> get job_id -> poll for completion
- Show estimated time in UI: "Est. 2.3 hours — runs overnight"
- WebSocket streams partial tokens to prevent perceived freeze

---

### Problem 2: Large Model Files Cannot Go in Git

**Impact:** Models are 15GB-1.5TB. Cannot be committed to the repository.

**Solutions:**
- Add to `.gitignore`: `/colibri/models/` and `/colibri/engine/colibri*`
- Use `.gitkeep` placeholder files to preserve folder structure
- `downloader.py` pulls weights from HuggingFace on first setup
- Document in `docs/OFFLINE_MODE_GUIDE.md`

---

### Problem 3: Windows vs Linux vs macOS Binary Incompatibility

**Impact:** The Colibrì C binary must be compiled for the user's OS.

**Solutions:**
- `model_registry.py` detects OS at startup using `platform.system()`
- Automatically selects correct binary: `colibri.exe` (Windows), `colibri` (Linux/macOS)
- `downloader.py` pulls the correct pre-compiled binary from Colibrì's GitHub Releases
- `chmod +x` applied automatically after download on Linux/macOS

---

### Problem 4: Subprocess Crashes & Hangs

**Impact:** If the Colibrì binary crashes mid-inference (OOM, corrupt model), the subprocess silently dies and the backend hangs.

**Solutions:**
- `bridge.py` wraps all subprocess calls with:
  - **Timeout watchdog:** Kill subprocess if no token output for >120 seconds
  - **Return code checker:** Non-zero return code = propagate as error
  - **Stderr capture:** Log Colibrì stderr for debugging
  - **Retry limit:** Max 3 automatic retries before marking job FAILED

---

### Problem 5: Hardware Requirements May Not Be Met

**Impact:** Users with less than 24GB RAM or spinning HDDs get terrible or unusable performance.

**Solutions:**
- At startup, `system_metrics.py` checks RAM and disk type
- Frontend `LocalModels.tsx` shows **Hardware Compatibility Check** before any downloads
- Prevent download of models the user's hardware cannot support

---

### Problem 6: Long-Running Jobs Must Survive Server Restarts

**Impact:** If FastAPI restarts during a 6-hour eval batch job, all progress is lost.

**Solutions:**
- `OfflineJob` DB table persists all job state (status, progress, subprocess PID)
- On backend startup, scan for `status="running"` jobs and requeue or resume
- Use **Celery** (already in requirements) as the task queue so jobs survive restarts

---

### Problem 7: Colibrì API May Change (Early Open Source Project)

**Impact:** CLI flags and output format may change between Colibrì versions.

**Solutions:**
- Pin the Colibrì binary version in `colibri/engine/VERSION` file
- Abstract all Colibrì-specific CLI flags inside `bridge.py` (single update point)
- Add integration tests in `test_all_features.py` that verify bridge output parsing

---

## Implementation Order & Timeline

```
Week 1-2:  Feature 4 (Local Model Dashboard UI)
            -> No inference needed, just UI + system metrics endpoint
            -> psutil for RAM/disk stats
            -> ModelDownloadCard.tsx + InferenceMonitor.tsx
            -> Safe to build and test without any local model

Week 3:    colibri/bridge.py + colibri/downloader.py
            -> Build Python IPC wrapper for Colibri subprocess
            -> Test with OLMoE-7B (smallest model, ~15GB)
            -> Verify token streaming works end-to-end

Week 4:    Feature 1 (Air-Gapped Offline Mode)
            -> backend/routers/offline.py
            -> backend/services/local_inference.py
            -> OfflineHub.tsx frontend page
            -> WebSocket streaming of local tokens

Week 5-6:  Feature 2 (TokenMiser Local Fallback)
            -> backend/services/fallback_router.py
            -> Modify sdk/langforge/optimize.py
            -> sdk/langforge/fallback.py
            -> Update TokenMiser.tsx frontend

Week 7-8:  Feature 3 (Zero-Cost Offline Evaluator)
            -> backend/services/eval_judge.py
            -> Celery batch job for overnight evals
            -> EvalJobQueue.tsx + progress tracking
            -> Modify Evaluations.tsx + AgentBench.tsx
```

---

## Summary Table

| Feature | New Root Dirs | New Files | Modified Files | New Python Packages |
|---------|--------------|-----------|----------------|---------------------|
| 1. Air-Gapped Offline Mode | `colibri/` | 8 | 3 | `psutil`, `huggingface-hub`, `aiofiles` |
| 2. TokenMiser Fallback | — | 2 | 3 | none |
| 3. Zero-Cost Evaluator | — | 2 | 3 | none |
| 4. Local Model Dashboard | — | 4 | 2 | none |
| **TOTAL** | **1 new root dir** | **~16 new files** | **~11 modified** | **3 new Python packages** |

---

> No code has been changed. This is a planning document only.
> Tell me which features to implement and in what order.

*Document created: 2026-08-01 | LangRush Engineering*
