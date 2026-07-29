import argparse
import os
import json
import sys
import requests
from .client import get_client

CONFIG_PATH = os.path.expanduser("~/.langforge/config.json")

def load_config():
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r") as f:
                return json.load(f)
        except:
            pass
    return {}

def save_config(api_key, url):
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    with open(CONFIG_PATH, "w") as f:
        json.dump({"api_key": api_key, "url": url}, f)

def main():
    parser = argparse.ArgumentParser(description="LangForge SDK CLI")
    subparsers = parser.add_subparsers(dest="command")

    # config set
    config_parser = subparsers.add_parser("config")
    config_sub = config_parser.add_subparsers(dest="subcommand")
    config_set = config_sub.add_parser("set")
    config_set.add_argument("--api-key", required=True)
    config_set.add_argument("--url", required=True)

    # status
    status_parser = subparsers.add_parser("status")

    # prompt
    prompt_parser = subparsers.add_parser("prompt")
    prompt_sub = prompt_parser.add_subparsers(dest="subcommand")
    
    push_parser = prompt_sub.add_parser("push")
    push_parser.add_argument("--name", required=True)
    push_parser.add_argument("--file", required=True)

    list_parser = prompt_sub.add_parser("list")

    args = parser.parse_args()

    if args.command == "config" and args.subcommand == "set":
        save_config(args.api_key, args.url)
        print(f"Saved config to {CONFIG_PATH}")

    elif args.command == "status":
        client = get_client()
        try:
            resp = requests.get(f"{client.base_url}/health", timeout=5)
            if resp.status_code == 200:
                print("LangForge backend is OK!")
            else:
                print(f"Backend returned status {resp.status_code}")
        except Exception as e:
            print(f"Failed to connect to LangForge backend: {e}")

    elif args.command == "prompt" and args.subcommand == "push":
        if not os.path.exists(args.file):
            print(f"File {args.file} not found.")
            sys.exit(1)
        with open(args.file, "r") as f:
            template = f.read()
        
        client = get_client()
        success = client.push_prompt(name=args.name, template=template)
        if success:
            print(f"Successfully pushed prompt '{args.name}'")
        else:
            print(f"Failed to push prompt '{args.name}'")

    elif args.command == "prompt" and args.subcommand == "list":
        print("Prompt listing requires a backend endpoint not defined in the base SDK yet.")
        
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
