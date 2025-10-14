from typing import Dict, List

from ..llm_client import LLMClient
from .prompts import (
    COOK_INSTR_SYSTEM,
    COOK_INSTR_USER,
    INGR_SYSTEM,
    INGR_USER,
)

# Use provider/model from env by default (defaults to Anthropic Haiku)
_llm = LLMClient()

def cooking_instructions(title: str) -> Dict:
    system = COOK_INSTR_SYSTEM
    user = COOK_INSTR_USER.format(title=title)
    return _llm.complete_json(system, user)


def required_ingredients(title: str) -> Dict:
    system = INGR_SYSTEM
    user = INGR_USER.format(title=title)
    return _llm.complete_json(system, user)
