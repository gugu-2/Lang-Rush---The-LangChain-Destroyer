class TestResult:
    def __init__(self, output: str, trace: dict = None, tool_calls: list = None, latency_ms: float = 0):
        self.output = output
        self.trace = trace or {}
        self.tool_calls = tool_calls or []
        self.latency_ms = latency_ms
    
    def __str__(self):
        return self.output
        
class AgentTest:
    agent = None
    
    def run(self, input_text: str) -> TestResult:
        if not self.agent:
            raise NotImplementedError("Agent not configured for test.")
        
        try:
            res = self.agent(input_text)
            output = str(res)
        except Exception as e:
            output = f"Error: {e}"
            
        return TestResult(output=output)
