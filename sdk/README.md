# LangForge SDK

Official Python SDK for the LangForge LLMOps Platform.

## Installation

```bash
pip install langforge-sdk
```

## Setup

```bash
langforge config set --api-key YOUR_KEY --url http://localhost:8000
```

## Features

### Tracing

```python
from langforge import traceable

@traceable(name="my-cool-function")
def do_something(x):
    return x * 2
```

### LangChain Integration

```python
from langforge import LangForgeCallbackHandler
from langchain.chains import LLMChain
# ... setup your chain
handler = LangForgeCallbackHandler()
chain.invoke({"input": "hello"}, config={"callbacks": [handler]})
```

### Prompt Hub

```python
from langforge import hub

template = hub.pull("my-prompt", version="latest")
```

### Testing

```python
from langforge import AgentTest, assert_contains_topic

class MyTest(AgentTest):
    def __init__(self):
        self.agent = lambda x: f"Response about {x}"

test = MyTest()
result = test.run("apples")
assert_contains_topic(result, "apples")
```
