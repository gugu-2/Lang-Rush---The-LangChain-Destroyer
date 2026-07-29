# 🧠 JEPA & Core Platform Logic in LangRush

## 1. Joint Embedding Predictive Architecture (JEPA) Integration

### Background & Motivation
Traditional LLMOps platforms only inspect text outputs **after** an LLM generation completes. When an AI agent enters an infinite loop, hallucination cycle, or invalid tool calling sequence, standard platforms waste hundreds of dollars and seconds of latency before noticing.

**JEPA (Joint Embedding Predictive Architecture)** — inspired by Yann LeCun's world model research — predicts future agent state representations in **embedding space** rather than pixel/token space.

```
                           +----------------------+
                           |  Agent State History |
                           +----------+-----------+
                                      |
                                  Embeddings
                                      v
                               +------+------+
                               | JEPA Model  |
                               +------+------+
                                      |
                           Predicted Trajectory
                                      v
                        +-------------+-------------+
                        |  Anomaly / Loop Detector   |
                        +-------------+-------------+
                                      |
                 +--------------------+--------------------+
                 |                                         |
         [Nominal Trajectory]                     [Anomalous Loop]
                 |                                         |
          Continue Execution                      Pivot / Terminate Agent
```

### Implementation Logic (`/api/power/jepa/predict`)
1. **State Embedding**: Agent trajectory steps (e.g., `["Search VectorDB", "Call Tool WebSearch", "Call Tool WebSearch"]`) are embedded into a joint feature vector.
2. **Trajectory Prediction**: The JEPA model predicts the expected embedding location of the next action.
3. **Distance Calculation**: It calculates the cosine/Euclidean distance between the predicted embedding and historical embedding states:
   $$\text{Distance}(E_{t+1}, E_{t}) = 1 - \frac{E_{t+1} \cdot E_t}{\|E_{t+1}\| \|E_t\|}$$
4. **Action Intervention**:
   - If $\text{Distance} < \epsilon$ (indicating a repeating loop in representation space), `anomaly_score` rises above `0.70`.
   - Returns `recommended_action: "terminate_or_pivot"`, halting execution before calling another expensive LLM.

---

## 2. Auto-Healing Middleware Logic (`/api/power/auto-heal` & `@auto_heal`)

```
   [Agent Function Execution]
               |
               v (Exception / Error Raised)
  +------------+------------+
  |  Auto-Healing Interceptor|
  +------------+------------+
               |
               | (Sends: Prompt + Failed Output + StackTrace)
               v
    +----------+----------+
    |  Gemini 2.5 Repair  |
    +----------+----------+
               |
               v (Returns Repaired JSON / Corrected Result)
   [Function Recovers Successfully]
```

When an agent tool or LLM output fails due to a formatting error, stack trace exception, or API error, `@auto_heal`:
1. Intercepts the exception in Python runtime.
2. Constructs a repair payload with the original prompt, raw output, and full stack trace.
3. Calls Gemini (`models/gemini-2.5-flash`) with system instruction: *"You are an automated code and LLM output repair agent. Fix the failed output based on the prompt and error trace. Return ONLY the corrected output."*
4. Returns the repaired output to the calling application without crashing the production pipeline.

---

## 3. Security Firewall & Guardrail Scanning (`/api/power/guardrails/scan` & `@guardrails`)

The guardrails proxy sits in front of agent invocations:
1. **PII Masking**: Scans input text using regular expression engines for Sensitive Personal Data:
   - Credit Cards (`\b(?:\d[ -]*?){13,16}\b`) → `[REDACTED_CREDIT_CARD]`
   - SSNs (`\b\d{3}-\d{2}-\d{4}\b`) → `[REDACTED_SSN]`
   - Emails (`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`) → `[REDACTED_EMAIL]`
   - API Keys (`\b(?:sk|key|token)_[a-zA-Z0-9]{24,}\b`) → `[REDACTED_API_KEY]`
2. **Prompt Injection Defense**: Detects malicious override patterns (`ignore previous instructions`, `DAN mode`, `jailbreak`).
3. **Execution Control**: Returns `{ "is_safe": false, "violations": [...] }`, blocking or sanitizing malicious inputs automatically.

---

## 4. RAG Triad Evaluator Logic (`/api/power/evaluations/rag-triad`)

Computes the RAG Triad scores asynchronously using Gemini:
$$\text{Overall RAG Score} = \frac{\text{Context Relevance} + \text{Groundedness} + \text{Answer Relevance}}{3}$$
1. **Context Relevance**: Measures if retrieved documents contain necessary information.
2. **Groundedness / Faithfulness**: Measures if generated answer contains facts NOT present in context.
3. **Answer Relevance**: Measures if response directly answers user query.
