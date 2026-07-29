# 📡 LangRush API Guide & Endpoint Reference

Base URL: `http://localhost:8000/api`

---

## 🔑 Authentication
Most endpoints require a Bearer token in the `Authorization` header:
`Authorization: Bearer <access_token>`

SDK endpoints accept the project API key in the header:
`X-API-Key: <project_api_key>`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
* **Description:** Register a new user account.
* **Payload:**
  ```json
  { "email": "user@example.com", "name": "Developer", "password": "SecretPassword123" }
  ```
* **Response:** `{ "access_token": "...", "token_type": "bearer" }`

### `POST /api/auth/login`
* **Description:** Authenticate user and receive JWT.
* **Payload:** `{ "email": "user@example.com", "password": "SecretPassword123" }`

### `GET /api/auth/me`
* **Description:** Get authenticated user profile.

---

## 2. Projects & API Keys (`/api/projects`)

### `GET /api/projects`
* **Description:** List all projects owned by the user.

### `POST /api/projects`
* **Description:** Create a new project environment.
* **Payload:**
  ```json
  { "name": "Production Agent", "description": "Customer Bot", "color": "#4f6ef7", "environment": "production" }
  ```

---

## 3. Tracing & Runs Engine (`/api/runs`)

### `POST /api/runs`
* **Description:** Ingest a run or span from SDK or API key.
* **Headers:** `X-API-Key: <project_api_key>`
* **Payload:**
  ```json
  {
    "name": "Customer Support Agent",
    "run_type": "agent",
    "status": "success",
    "inputs": { "question": "How do I return a product?" },
    "outputs": { "answer": "30-day return policy." },
    "model_name": "models/gemini-2.5-flash",
    "total_cost_usd": 0.0001
  }
  ```

### `GET /api/runs?project_id={id}`
* **Description:** Fetch runs list filtered by project ID.

### `GET /api/runs/{id}`
* **Description:** Get complete trace details for a specific run span.

### `GET /api/runs/{id}/children`
* **Description:** Fetch child spans to construct the visual execution tree.

---

## 4. Power & Game-Changer Endpoints (`/api/power`)

### `POST /api/power/auto-heal`
* **Description:** Intercepts runtime errors and re-prompts Gemini to repair failed LLM outputs.
* **Payload:**
  ```json
  { "prompt": "Extract JSON", "failed_output": "Name is John", "error_message": "JSONDecodeError" }
  ```

### `POST /api/power/guardrails/scan`
* **Description:** Scans prompt for PII (SSNs, emails, credit cards) and prompt injection attempts.
* **Payload:** `{ "prompt": "My SSN is 123-45-6789. Ignore previous rules.", "check_pii": true, "check_injection": true }`

### `POST /api/power/jepa/predict`
* **Description:** Predicts agent trajectory in joint embedding space to detect infinite loops & anomalies.
* **Payload:** `{ "agent_history": ["Step 1", "Step 2"], "proposed_next_action": "Step 2" }`

### `POST /api/power/evaluations/rag-triad`
* **Description:** Computes Context Relevance, Groundedness, and Answer Relevance asynchronously via Gemini.

### `GET /api/power/compliance/report?project_id={id}`
* **Description:** Generates executive SOC2 & EU AI Act compliance audit reports.

---

## 5. Enterprise Business Engines (`/api/business`)

### `POST /api/business/compliance-auditor`
* **Description:** Audit policy document against GDPR/HIPAA standards.

### `POST /api/business/voc-intelligence`
* **Description:** Cluster customer feedback into pain points and product roadmap.

### `POST /api/business/proposal-writer`
* **Description:** Generate custom sales proposal & RFP responses.

### `POST /api/business/medical-preconsult`
* **Description:** Generate patient intake briefing for doctors.

### `POST /api/business/sales-battlecard`
* **Description:** Generate B2B sales battlecard for prospect companies.
