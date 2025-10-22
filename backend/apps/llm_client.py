import copy
import json
import os
from typing import Any, Dict, List, Optional

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

    def _collect_text(self, response: Any) -> str:
        content_blocks = getattr(response, "content", []) or []
        parts: List[str] = []
        for block in content_blocks:
            text = getattr(block, "text", None)
            if text:
                parts.append(text)
        return "".join(parts)

    def complete_json(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_retries: int = 2,
        model: Optional[str] = None,
        max_tokens: int = 2048,
    ) -> Dict[str, Any]:
        blocks = [{"type": "text", "text": user_prompt}]
        return self.complete_json_from_blocks(
            system_prompt,
            blocks,
            temperature=temperature,
            max_retries=max_retries,
            model=model,
            max_tokens=max_tokens,
        )

    def complete_json_from_blocks(
        self,
        system_prompt: str,
        content_blocks: List[Dict[str, Any]],
        temperature: float = 0.3,
        max_retries: int = 2,
        model: Optional[str] = None,
        max_tokens: int = 2048,
    ) -> Dict[str, Any]:
        base_blocks = [copy.deepcopy(block) for block in content_blocks]
        instruction_tail = ["Return ONLY valid minified JSON."]
        last_err: Optional[Exception] = None

        for _ in range(max_retries + 1):
            try:
                if self.provider != "anthropic":
                    raise ValueError("Unsupported provider")
                user_blocks = [copy.deepcopy(block) for block in base_blocks]
                for instruction in instruction_tail:
                    user_blocks.append({"type": "text", "text": instruction})
                msg = self.client.messages.create(
                    model=model or self.model,
                    temperature=temperature,
                    system=system_prompt,
                    max_tokens=max_tokens,
                    messages=[{"role": "user", "content": user_blocks}],
                )
                content = self._collect_text(msg) or "{}"
                return self._parse_json(content)
            except Exception as exc:
                last_err = exc
                instruction_tail.append("Respond strictly with JSON only.")
        raise RuntimeError(f"Failed to get valid JSON from LLM: {last_err}")
