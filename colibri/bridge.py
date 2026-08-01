import os
import json
import asyncio
import logging
from typing import AsyncGenerator, Dict, Any, Optional
import platform

logger = logging.getLogger(__name__)

class ColibriEngineError(Exception):
    pass

class ColibriEngine:
    """
    Python-C Bridge for the Colibrì Offline Inference Engine.
    Manages the subprocess, streams I/O, and handles errors.
    """
    
    def __init__(self, model_path: str, engine_path: Optional[str] = None):
        self.model_path = model_path
        
        if engine_path:
            self.engine_path = engine_path
        else:
            # Default to the downloaded binary in colibri/engine
            sys_os = platform.system()
            # For testing with the mock engine, it creates a .bat file on Windows.
            # Real Colibrì would probably be .exe, but we'll use .bat for now.
            executable_name = "colibri.bat" if sys_os == "Windows" else "colibri"
            base_dir = os.path.dirname(os.path.abspath(__file__))
            self.engine_path = os.path.join(base_dir, "engine", executable_name)
            
        if not os.path.exists(self.engine_path):
            raise FileNotFoundError(f"Colibrì engine not found at {self.engine_path}. Run downloader first.")
            
        self.process = None

    async def start(self):
        """Starts the Colibrì C subprocess."""
        if self.process:
            return

        logger.info(f"Starting Colibrì Engine from {self.engine_path} with model {self.model_path}")
        
        is_windows_bat = platform.system() == "Windows" and not self.engine_path.endswith(".exe")
        
        cmd = [self.engine_path, "--model", self.model_path]
        
        if is_windows_bat:
            import sys
            py_script = self.engine_path.replace(".bat", ".py")
            self.process = await asyncio.create_subprocess_exec(
                sys.executable, py_script, "--model", self.model_path,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
        else:
            self.process = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
        
        # Start a background task to consume stderr so it doesn't block and we can log it
        asyncio.create_task(self._consume_stderr())
        logger.info(f"Colibrì engine started (PID: {self.process.pid})")

    async def _consume_stderr(self):
        """Reads and logs the engine's stderr asynchronously."""
        if not self.process or not self.process.stderr:
            return
            
        while True:
            line = await self.process.stderr.readline()
            if not line:
                break
            # Colibri C logs
            logger.debug(f"[Colibrì] {line.decode().strip()}")

    async def stop(self):
        """Stops the Colibrì engine subprocess."""
        if self.process:
            logger.info("Stopping Colibrì engine...")
            self.process.terminate()
            try:
                await asyncio.wait_for(self.process.wait(), timeout=5.0)
            except asyncio.TimeoutError:
                logger.warning("Engine did not terminate gracefully. Killing it.")
                self.process.kill()
            self.process = None

    async def generate_stream(self, prompt: str, max_tokens: int = 1024, temperature: float = 0.7) -> AsyncGenerator[str, None]:
        """
        Sends a prompt to the engine via stdin and yields tokens as they arrive on stdout.
        """
        if not self.process:
            await self.start()
            
        if self.process.returncode is not None:
            # Process died
            raise ColibriEngineError(f"Colibrì engine died unexpectedly with code {self.process.returncode}")

        # Construct request payload
        req = {
            "prompt": prompt,
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        
        req_str = json.dumps(req) + "\\n"
        
        # Write to stdin
        self.process.stdin.write(req_str.encode("utf-8"))
        await self.process.stdin.drain()
        
        logger.info("Sent inference request to engine. Waiting for tokens...")
        
        # Read from stdout stream
        while True:
            line = await self.process.stdout.readline()
            if not line:
                # EOF reached unexpectedly
                raise ColibriEngineError("Engine stdout stream closed unexpectedly.")
                
            try:
                res = json.loads(line.decode("utf-8").strip())
            except json.JSONDecodeError:
                logger.error(f"Failed to decode engine output: {line}")
                continue
                
            msg_type = res.get("type")
            
            if msg_type == "token":
                yield res.get("text", "")
            elif msg_type == "done":
                # Generation complete
                break
            elif msg_type == "error":
                raise ColibriEngineError(f"Engine returned error: {res.get('message')}")
            else:
                logger.warning(f"Unknown message type from engine: {msg_type}")

    async def generate(self, prompt: str, **kwargs) -> str:
        """Helper to collect the entire generated text instead of streaming."""
        full_text = []
        async for token in self.generate_stream(prompt, **kwargs):
            full_text.append(token)
        return "".join(full_text)

# Simple test if run directly
if __name__ == "__main__":
    async def test():
        # Using a mock path for the local test
        bridge = ColibriEngine(model_path="dummy/path")
        try:
            print("Sending prompt...")
            async for token in bridge.generate_stream("What is the capital of France?"):
                print(token, end="", flush=True)
            print("\\nDone.")
        finally:
            await bridge.stop()
            
    # For testing we need to ensure the mock engine exists
    from downloader import download_engine
    download_engine()
    
    asyncio.run(test())
