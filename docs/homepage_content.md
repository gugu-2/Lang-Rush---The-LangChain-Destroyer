# LangRush Homepage Copy

## [Hero Section]

**Headline:** Stop Prototyping. Start Shipping Production-Grade AI.
**Sub-headline:** The world’s first all-in-one platform for LLM observability, cost-routing, and zero-cost local evaluation. We built what LangChain forgot.
**Primary CTA:** Start for Free (No Credit Card Required)
**Secondary CTA:** Book a Demo
**Social Proof:** "LangRush cut our OpenAI bill by 60% overnight while giving us 100% visibility into our LangGraph agents." — CTO, Stealth AI Startup

## [Section 2: The Problem vs. The LangRush Solution]

**The Problem:** Building AI is easy. Scaling it is a nightmare. 
You are stringing together 5 different tools: LangSmith for tracing, PromptLayer for prompts, Datadog for metrics, and spending thousands on OpenAI for evaluations. When OpenAI goes down, your app crashes.

**The Solution:** LangRush replaces them all. 
Observe your agents, slash your API costs with semantic caching, and run massive test suites overnight using our built-in local engine—all from a single, beautiful dashboard.

## [Section 3: Core Features (Grid Layout)]

**🔍 X-Ray Vision for Your Agents (ChainScope)**
Step into the mind of your LLM. Trace every thought, tool call, and API request in a visual tree. Find the exact prompt that caused a hallucination in seconds.

**💸 TokenMiser: Cut Costs by 40-70%**
Stop paying for the same answer twice. TokenMiser automatically intercepts redundant queries with Semantic Caching and routes simple questions to cheaper models. Add it with one line of code: `@optimize(budget="$50/day")`.

**🪶 Colibrì Engine: 100% Offline AI**
Need HIPAA compliance? Unstable internet? LangRush bundles a blazing-fast local Mixture-of-Experts engine. If OpenAI crashes, LangRush seamlessly falls back to local SSD inference. Your users never see a loading spinner.

**🧪 AgentBench: Zero-Cost Automated Testing**
Stop paying OpenAI to test your code. Write semantic assertions for your agents and run thousands of evaluations overnight. Our Colibrì local engine acts as the LLM-judge for exactly $0.00.

**🎨 FlowForge: Build Visually, Deploy Instantly**
Drag-and-drop your LangGraph architectures on an infinite canvas. We generate the live Python code in real-time. Deploy directly to production.

## [Section 4: The Developer Experience]

**One Line of Code to Rule Them All**
No heavy SDKs, no massive rewrites. LangRush integrates seamlessly with standard Python and LangChain. 

```python
from langrush import optimize

# Turn on semantic caching and offline fallback instantly
@optimize(budget="$20/day", cache=True, offline_fallback=True)
def my_llm_pipeline(question: str) -> str:
    return llm.invoke(question)
```

## [Section 5: Enterprise Ready]

**Bank-Grade Security & Privacy**
- **PII Firewall:** Automatically redacts sensitive data (SSNs, emails, health info) before it reaches cloud APIs.
- **Air-Gapped Mode:** Run the entire platform and the Colibrì engine inside your own VPC. 100% offline.
- **RBAC & SSO:** Granular access controls and SAML/SSO integrations for large teams.

## [Footer/Final CTA]

**Headline:** Ready to destroy your LLM headaches?
**Sub-headline:** Join 10,000+ developers shipping resilient, cost-effective AI applications today.
**CTA:** Deploy LangRush Now
