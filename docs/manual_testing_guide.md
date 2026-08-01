# LangRush: Manual Testing Guide

Welcome to the LangRush testing environment! Both the Backend and Frontend servers are currently running on your machine. Follow the steps below to explore the core features.

## 🌐 1. Accessing the Platform
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

## 🧪 2. What to Test in the UI

### The Local Models Dashboard (Phase 1)
1. Go to your frontend at [http://localhost:5173](http://localhost:5173).
2. Look for the **"Local Models"** tab or dashboard section.
3. **Verify System Metrics:** You should see live CPU/RAM usage graphs. This data is streaming from the `psutil` integration on your backend.
4. **Offline Inference Monitors:** Check out the beautiful Shadcn UI cards we built for tracking the Colibrì local engine.

## 💻 3. Testing the APIs (via Swagger)

Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.

### Test 1: The TokenMiser Fallback
We built a system that catches cloud API errors and automatically routes the prompt to your local Colibrì engine.
1. Scroll down to `POST /api/inference/chat`.
2. Click **"Try it out"**.
3. Use this JSON payload:
   ```json
   {
     "prompt": "Explain quantum computing in one sentence.",
     "model": "gpt-4o-mini",
     "max_tokens": 100
   }
   ```
4. Click **Execute**.
5. **What to expect:** Since your `.env` does not have a real OpenAI key, it will trigger an `AuthenticationError`. You will see the backend instantly fall back to the mock Colibrì engine we generated in Phase 2, and it will return a response!

### Test 2: System Telemetry
1. Scroll to `GET /api/system_metrics/system`.
2. Click **Execute**.
3. **What to expect:** It should return live JSON data showing your current PC's CPU %, Memory %, and Disk Space.

### Test 3: The Zero-Cost Evaluator (Optional)
If you want to simulate an automated LLM-as-a-judge test:
1. Since we haven't seeded the database with evaluation runs yet, testing the `local_llm_judge` requires programmatic DB access. However, the logic is safely integrated into `backend/services/evaluators.py`.

## 🛑 4. Stopping the Servers
When you are done testing, let me know, and I can shut down the backend and frontend engines for you.
