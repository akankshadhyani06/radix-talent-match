"""Deferred LangChain model construction interface.

The LLM provider has not been selected. This module deliberately performs no
model initialization, credential lookup, or network activity at import time.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from langchain_core.language_models import BaseLanguageModel


def create_llm() -> BaseLanguageModel:
    """Create a configured LangChain model after a provider is selected."""
    raise NotImplementedError(
        "LLM construction is deferred until an LLM provider is selected."
    )
