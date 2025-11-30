import os
from typing import Optional

from config import OPENAI_API_KEY

try:
    import openai
except Exception:
    openai = None


def ask_openai(prompt: str, language: str = "es", history: Optional[list] = None) -> Optional[str]:
    """Ask OpenAI ChatCompletion for a helpful reply in Spanish using optional conversation history.

    - `history` expected as list of { from: 'user'|'bot', text: str } from the frontend.
    Returns assistant text or None on error / if OpenAI not configured.
    """
    if not OPENAI_API_KEY:
        return None
    if openai is None:
        return None

    openai.api_key = OPENAI_API_KEY

    system = (
        "Eres un asistente breve y amable para una tienda online, pero también puedes responder preguntas generales "
        "(naturaleza, cultura, definiciones básicas, etc.) de forma clara y concisa en español. Responde en un máximo de 150 palabras, "
        "mantén un tono servicial y práctico. Si el usuario pregunta por algo sensible o peligroso, indica que no puedes ayudar y sugiere contactar soporte. "
        "Cuando sea apropiado, ofrece pasos accionables o una breve explicación."
    )

    messages = [{"role": "system", "content": system}]
    # append history if provided
    if history:
        for h in history:
            try:
                role = "user" if h.get("from") == "user" else "assistant"
                messages.append({"role": role, "content": h.get("text", "")})
            except Exception:
                continue

    # finally add the current user prompt
    if prompt:
        messages.append({"role": "user", "content": prompt})

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=400,
            temperature=0.6,
        )
        # Backwards-compat: different openai versions return slightly different shapes
        try:
            text = resp.choices[0].message.content.strip()
        except Exception:
            try:
                text = resp.choices[0].text.strip()
            except Exception:
                return None
        return text
    except Exception:
        return None
