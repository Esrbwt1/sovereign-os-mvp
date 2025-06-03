import yaml
import requests
import json
import argparse
from jsonschema import validate, ValidationError

# --- Configuration ---
# You'll need an OpenRouter API Key. Get one from https://openrouter.ai/keys
# IMPORTANT: Do NOT commit your API key to GitHub.
# For now, we'll set it as an environment variable or paste it here temporarily for testing.
# Best practice is to use environment variables.
# Example: Set OPENROUTER_API_KEY in your terminal before running.
# $env:OPENROUTER_API_KEY="your_key_here" (PowerShell)
# export OPENROUTER_API_KEY="your_key_here" (Bash/Zsh)
import os
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "YOUR_OPENROUTER_API_KEY_HERE_IF_NOT_SET_AS_ENV_VAR")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

def load_agent_config(yaml_path):
    """Loads agent configuration from a YAML file."""
    try:
        with open(yaml_path, 'r') as f:
            config = yaml.safe_load(f)
        # Basic validation for key fields (can be expanded with jsonschema later for the whole config)
        if not all(k in config for k in ['name', 'llm_config', 'prompt_template', 'input_schema']):
            raise ValueError("Agent config is missing one or more required top-level keys.")
        if 'model' not in config.get('llm_config', {}):
             raise ValueError("Agent llm_config is missing 'model'.")
        return config
    except FileNotFoundError:
        print(f"Error: Agent configuration file not found at {yaml_path}")
        return None
    except yaml.YAMLError as e:
        print(f"Error parsing YAML file {yaml_path}: {e}")
        return None
    except ValueError as e:
        print(f"Error in agent configuration {yaml_path}: {e}")
        return None

def validate_input_data(input_data, schema):
    """Validates input data against the agent's input_schema."""
    try:
        validate(instance=input_data, schema=schema)
        return True
    except ValidationError as e:
        print(f"Error: Input data validation failed.")
        print(f"Reason: {e.message}")
        if e.path:
            print(f"Path: {' -> '.join(map(str, e.path))}")
        if e.schema_path:
             print(f"Schema Path: {' -> '.join(map(str, e.schema_path))}")
        # print(f"Instance: {e.instance}") # Can be verbose
        # print(f"Schema: {e.schema}") # Can be verbose
        return False

def fill_prompt_template(template, data):
    """Fills placeholders in the prompt template with input data."""
    prompt = template
    for key, value in data.items():
        prompt = prompt.replace(f"{{{{{key}}}}}", str(value))
    return prompt

def call_llm(prompt, llm_config):
    """Calls the LLM API (OpenRouter in this case)."""
    if OPENROUTER_API_KEY == "YOUR_OPENROUTER_API_KEY_HERE_IF_NOT_SET_AS_ENV_VAR" or not OPENROUTER_API_KEY:
        print("Error: OpenRouter API key not set. Please set the OPENROUTER_API_KEY environment variable or update the script.")
        return None

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": llm_config.get("model"),
        "messages": [{"role": "user", "content": prompt}],
        "temperature": llm_config.get("temperature", 0.7),
        "max_tokens": llm_config.get("max_tokens", 512)
    }
    
    print(f"\n--- Sending to LLM ({llm_config.get('model')}) ---")
    print(f"Prompt: {prompt[:200]}...") # Print a snippet of the prompt
    # print(f"Full Payload: {json.dumps(payload, indent=2)}") # For debugging

    try:
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload, timeout=60) # 60s timeout
        response.raise_for_status()  # Raise an exception for HTTP errors
        result = response.json()
        
        # print(f"--- LLM Raw Response ---") # For debugging
        # print(json.dumps(result, indent=2)) # For debugging

        if result.get("choices") and len(result["choices"]) > 0:
            content = result["choices"][0].get("message", {}).get("content")
            if content:
                return content.strip()
            else:
                print("Error: LLM response content is empty or malformed.")
                print(f"Full response: {result}")
                return None
        else:
            print("Error: No 'choices' in LLM response or choices array is empty.")
            print(f"Full response: {result}")
            # Check for specific OpenRouter errors if available
            if result.get("error"):
                print(f"OpenRouter Error: {result['error'].get('message', 'Unknown error')}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error calling LLM API: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_detail = e.response.json()
                print(f"Error details: {json.dumps(error_detail, indent=2)}")
            except json.JSONDecodeError:
                print(f"Error details (raw): {e.response.text}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred during LLM call: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(description="Run a SovereignOS agent.")
    parser.add_argument("agent_yaml_path", help="Path to the agent's YAML configuration file.")
    parser.add_argument("--input-json", "-i", help="JSON string of input data for the agent.", default="{}")
    
    args = parser.parse_args()

    print(f"SovereignOS Agent Runner v0.1 (Local)")
    print(f"====================================")

    # 1. Load agent config
    print(f"\n[1] Loading agent configuration from: {args.agent_yaml_path}")
    agent_config = load_agent_config(args.agent_yaml_path)
    if not agent_config:
        return
    print(f"Agent '{agent_config['name']}' loaded successfully.")

    # 2. Parse and validate input data
    print(f"\n[2] Processing input data...")
    try:
        input_data = json.loads(args.input_json)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid input JSON: {e}")
        return
    
    print(f"Input data: {input_data}")
    if not validate_input_data(input_data, agent_config.get("input_schema", {})):
        return
    print("Input data validated successfully.")

    # 3. Fill prompt template
    print(f"\n[3] Preparing prompt...")
    filled_prompt = fill_prompt_template(agent_config["prompt_template"], input_data)
    # print(f"Filled prompt: {filled_prompt}") # Can be verbose

    # 4. Call LLM
    print(f"\n[4] Executing agent with LLM...")
    llm_response = call_llm(filled_prompt, agent_config["llm_config"])

    # 5. Display result
    print(f"\n[5] Agent Execution Result:")
    if llm_response:
        print("------------------------------------")
        print(llm_response)
        print("------------------------------------")
    else:
        print("Agent execution failed or produced no output.")
    
    print("\nAgent run finished.")

if __name__ == "__main__":
    main()