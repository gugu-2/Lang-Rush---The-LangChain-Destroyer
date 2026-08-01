import os
import platform
import logging
import zipfile
import urllib.request
from pathlib import Path
from huggingface_hub import hf_hub_download, snapshot_download

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

COLIBRI_DIR = Path(__file__).parent.resolve()
ENGINE_DIR = COLIBRI_DIR / "engine"
MODELS_DIR = COLIBRI_DIR / "models"

# Mock URLs for Colibrì Engine binaries (Simulating a C-based backend engine)
ENGINE_RELEASES = {
    "Windows": "https://github.com/justvugg/colibri/releases/latest/download/colibri-windows-amd64.zip",
    "Linux": "https://github.com/justvugg/colibri/releases/latest/download/colibri-linux-amd64.tar.gz",
    "Darwin": "https://github.com/justvugg/colibri/releases/latest/download/colibri-darwin-arm64.tar.gz",
}

def ensure_directories():
    ENGINE_DIR.mkdir(parents=True, exist_ok=True)
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

def download_engine():
    """Downloads the appropriate Colibrì C binary for the current OS."""
    ensure_directories()
    sys_os = platform.system()
    
    # The actual colibri executable we expect
    executable_name = "colibri.bat" if sys_os == "Windows" else "colibri"
    engine_path = ENGINE_DIR / executable_name
    
    if engine_path.exists():
        logger.info(f"Colibrì engine already exists at {engine_path}")
        return str(engine_path)
        
    logger.info(f"Colibrì engine not found. Downloading for {sys_os}...")
    
    # In a real scenario, this would download from GitHub releases.
    # For now, we will create a mock "colibri" script/executable that just mimics the expected interface
    # so the bridge can talk to it for development.
    create_mock_engine(engine_path, sys_os)
    
    return str(engine_path)

def create_mock_engine(path: Path, sys_os: str):
    """Creates a mock Python script acting as the Colibrì binary for local testing without the real C engine."""
    logger.info("Generating mock Colibrì engine for development testing.")
    
    mock_script = """import sys
import json
import time

def log(msg):
    sys.stderr.write(f"[Colibri-Mock] {msg}\\n")
    sys.stderr.flush()

if __name__ == '__main__':
    log("Starting Mock Engine...")
    while True:
        line = sys.stdin.readline()
        if not line:
            break
        
        line = line.strip()
        if not line:
            continue
            
        try:
            req = json.loads(line)
            prompt = req.get('prompt', '')
            max_tokens = req.get('max_tokens', 100)
            
            log(f"Received prompt: {prompt[:30]}...")
            
            # Simulate streaming response
            words = ["This", " is", " a", " streamed", " response", " from", " the", " air-gapped", " engine."]
            for w in words:
                res = {"type": "token", "text": w}
                sys.stdout.write(json.dumps(res) + "\\n")
                sys.stdout.flush()
                time.sleep(0.1)
                
            final = {"type": "done", "reason": "stop"}
            sys.stdout.write(json.dumps(final) + "\\n")
            sys.stdout.flush()
            
        except Exception as e:
            err = {"type": "error", "message": str(e)}
            sys.stdout.write(json.dumps(err) + "\\n")
            sys.stdout.flush()
"""
    if sys_os == "Windows":
        # Create a bat file that runs the python script
        py_path = path.with_suffix(".py")
        py_path.write_text(mock_script, encoding="utf-8")
        path.write_text(f"@echo off\r\npython %~dp0{py_path.name} %*\r\n", encoding="utf-8")
    else:
        path.write_text("#!/usr/bin/env python3\\n" + mock_script)
        path.chmod(0o755)

def download_model(model_id: str, repo_id: str, filename: str = None) -> str:
    """Downloads a model from HuggingFace to the local colibri/models directory."""
    ensure_directories()
    logger.info(f"Downloading model {model_id} from {repo_id}...")
    
    model_dir = MODELS_DIR / model_id
    model_dir.mkdir(parents=True, exist_ok=True)
    
    if filename:
        # Download a single file (like a GGUF)
        file_path = hf_hub_download(
            repo_id=repo_id,
            filename=filename,
            local_dir=str(model_dir),
            local_dir_use_symlinks=False
        )
        logger.info(f"Successfully downloaded {filename} to {file_path}")
        return file_path
    else:
        # Download whole snapshot
        snapshot_dir = snapshot_download(
            repo_id=repo_id,
            local_dir=str(model_dir),
            local_dir_use_symlinks=False
        )
        logger.info(f"Successfully downloaded model snapshot to {snapshot_dir}")
        return snapshot_dir

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Colibrì Downloader")
    parser.add_argument("--engine", action="store_true", help="Download the Colibrì engine")
    parser.add_argument("--model", type=str, help="Model ID to download (e.g., olmoe-7b)")
    parser.add_argument("--repo", type=str, help="HuggingFace repo ID")
    parser.add_argument("--filename", type=str, help="Specific filename to download (optional)")
    
    args = parser.parse_args()
    
    if args.engine:
        download_engine()
        
    if args.model and args.repo:
        download_model(args.model, args.repo, args.filename)
