import json
import os
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from pathlib import Path

# Provider: Anthropic only
try:
    from anthropic import Anthropic
except Exception:
    Anthropic = None  # type: ignore

# Load env from current working dir and backend directory (.env and .env.local)
load_dotenv()
_BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(_BACKEND_DIR / ".env")
load_dotenv(_BACKEND_DIR / ".env.local")


class LLMClient:
    def __init__(self, provider: Optional[str] = None, model: Optional[str] = None) -> None:
        # Anthropic only
        provider = provider or os.getenv("LLM_PROVIDER", "anthropic")
        model = model or os.getenv("LLM_MODEL", "claude-3-5-haiku-latest")
        self.provider = provider
        self.model = model

        if provider != "anthropic":
            raise ValueError("Only 'anthropic' provider is supported in this project")
        if Anthropic is None:
            raise RuntimeError("anthropic package not installed")
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError("ANTHROPIC_API_KEY is not set")
        self.client = Anthropic(api_key=api_key)

    def _parse_json(self, content: str) -> Dict[str, Any]:
        txt = content.strip()
        if txt.startswith("```") and txt.endswith("```"):
            txt = txt.strip("`")
        try:
            return json.loads(txt)
        except Exception:
            start = txt.find("{")
            end = txt.rfind("}")
            if start != -1 and end != -1 and end > start:
                snippet = txt[start : end + 1]
                return json.loads(snippet)
            raise

    def complete_json(self, system_prompt: str, user_prompt: str, temperature: float = 0.3, max_retries: int = 2) -> Dict[str, Any]:
        last_err: Optional[Exception] = None
        for _ in range(max_retries + 1):
            try:
                if self.provider == "anthropic":
                    # Anthropic JSON mode via content blocks
                    msg = self.client.messages.create(
                        model=self.model,
                        temperature=temperature,
                        system=system_prompt,
                        max_tokens=2048,
                        messages=[{"role": "user", "content": user_prompt + "\n\nReturn ONLY valid minified JSON."}],
                    )
                    # Extract text
                    content = ""
                    for block in getattr(msg, "content", []) or []:
                        # block.type can be 'text' in SDK
                        text = getattr(block, "text", None)
                        if text:
                            content += text
                    content = content or "{}"
                    return self._parse_json(content)
                else:
                    raise ValueError("Unsupported provider")
            except Exception as e:
                last_err = e
                user_prompt = user_prompt + "\nRespond strictly with JSON only."
        raise RuntimeError(f"Failed to get valid JSON from LLM: {last_err}")
