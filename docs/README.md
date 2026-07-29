# ⚡ LangRush Documentation

Welcome to the official technical and architectural documentation for **LangRush** — the world's first all-in-one LLMOps, DevTools, and AI Business Automation Platform.

---

## 📚 Documentation Index

| Document | Description |
|---|---|
| 📖 [**API Guide**](file:///c:/Users/majip/Downloads/langchain/docs/API_GUIDE.md) | Complete REST API endpoint reference, headers, and payload schemas |
| 🏗️ [**Architecture**](file:///c:/Users/majip/Downloads/langchain/docs/ARCHITECTURE.md) | High-level system design, monorepo layout, DB schemas, and data flow |
| 🧠 [**JEPA & Core Logic**](file:///c:/Users/majip/Downloads/langchain/docs/JEPA_AND_LOGIC.md) | In-depth breakdown of JEPA world model, auto-healing, and security guardrails |
| 🔄 [**Integrations & Changes**](file:///c:/Users/majip/Downloads/langchain/docs/INTEGRATION_AND_CHANGES.md) | Evolution history, applied devtool integrations, and business engines |
| ✨ [**Feature Catalog**](file:///c:/Users/majip/Downloads/langchain/docs/FEATURES.md) | Comprehensive breakdown of all 25+ platform features and business impact |

---

## 🚀 Quick Startup

### Start Backend Server
```powershell
cd backend
python -m uvicorn main:app --reload --port 8000
```

### Start Frontend UI
```powershell
cd frontend
npm run dev
```

### Run Automated Integration Suite
```powershell
python test_all_features.py
```
