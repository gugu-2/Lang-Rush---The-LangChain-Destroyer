# Lang Rush SDK

Official Python SDK for the Lang Rush LLMOps Platform.

## Quick Start

```bash
pip install lang-rush-sdk
```

Configure your environment:

```bash
langrush config set --api-key YOUR_KEY --url http://localhost:8000
```

Or in Python code:

```python
import langrush

# 1. Automatic tracing decorator
from langrush import traceable

@traceable(name="my-llm-pipeline", run_type="chain")
def run_pipeline(user_query: str) -> str:
    return "response"

# 2. LangChain Callback Handler
from langrush import LangRushCallbackHandler

handler = LangRushCallbackHandler()
chain.invoke(input, config={"callbacks": [handler]})

# 3. Fetch prompts from PromptVault
from langrush import hub

prompt = hub.pull("sql_generator")

# 4. AgentBench testing framework
from langrush.testing import AgentTest, assert_contains_topic

class TestAgent(AgentTest):
    def test_basic(self):
        res = self.run("Hello")
        assert_contains_topic(res, "hello")
```
