from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from urllib.parse import quote
from difflib import SequenceMatcher

from db.session import SessionLocal
from dtos.bot_dto import BotRequest, BotResponseOut
from models.bot_response import BotResponse
from models.chatbox import Chat

from config import BUSINESS_WHATSAPP, OPENAI_API_KEY
from utils.openai_utils import ask_openai
import logging

logger = logging.getLogger("bot_controller")

router = APIRouter(prefix="/bot", tags=["bot"])


@router.get('/wa')
def get_whatsapp_link():
    """Return the WhatsApp URL built from BUSINESS_WHATSAPP so frontend can request it when needed."""
    phone = BUSINESS_WHATSAPP
    if phone:
        text = quote("Hola, necesito ayuda")
        wa = f"https://wa.me/{phone}?text={text}"
    else:
        wa = None
    # return both phone and a sample whatsapp_url; frontend can build a custom url including the user's message
    return {"whatsapp_url": wa, "phone": phone}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/respond", response_model=BotResponseOut)
def respond(payload: BotRequest, db: Session = Depends(get_db)):
    """
    Improved responder:
    1) Try exact substring match (existing behavior).
    2) If no exact match, compute a simple fuzzy/token overlap score for each `clave` and pick the best.
    3) If best score meets threshold, return that response; otherwise return fallback with WhatsApp link.

    This keeps the implementation dependency-free and performs better on longer user messages.
    """
    # Require an authenticated user: frontend should send `usuario_origen` (user id)
    if not payload.usuario_origen:
        # Do not answer bot requests for anonymous users
        raise HTTPException(status_code=401, detail="Debes iniciar sesión para usar el chatbot")

    mensaje = (payload.mensaje or "").lower()
    respuestas = db.query(BotResponse).filter(BotResponse.enabled == True).order_by(BotResponse.prioridad.desc()).all()

    # If the message doesn't contain any known 'clave' tokens, treat it as a general question
    # and prefer OpenAI (so topics outside e-commerce like 'sapos' get AI answers).
    try:
        any_clave = False
        for r in respuestas:
            if r.clave:
                for tok in r.clave.lower().split():
                    if tok and tok in mensaje:
                        any_clave = True
                        break
            if any_clave:
                break
        if not any_clave and OPENAI_API_KEY:
            logger.info("Message '%s' appears general (no DB clave match) - calling OpenAI", mensaje[:80])
            ai_reply = ask_openai(payload.mensaje or "", history=payload.history if getattr(payload, 'history', None) else None)
            if ai_reply:
                try:
                    if payload.usuario_origen:
                        db_chat_bot = Chat(usuario_origen=None, usuario_destino=payload.usuario_origen, mensaje=ai_reply)
                        db.add(db_chat_bot)
                        db.commit()
                except Exception:
                    db.rollback()
                return BotResponseOut(texto=ai_reply, fallback=False, ai_generated=True)
    except Exception:
        # defensive: if anything fails here, continue with normal flow
        pass

    # quick keyword sets
    whatsapp_keywords = ['whatsapp', 'whassap', 'whassapp', 'whass', 'wa.me', 'whats', 'contacto por whatsapp', 'hablar por whatsapp']
    greeting_keywords = ['hola', 'buenos', 'buenas', 'buen día', 'buen dia', 'buenas tardes', 'buenas noches', 'buenas dias', 'buenas']
    farewell_keywords = ['gracias', 'adios', 'hasta luego', 'chao', 'nos vemos', 'hasta pronto']

    # 0) If user explicitly requests WhatsApp, return fallback with wa link immediately
    for kw in whatsapp_keywords:
        if kw in mensaje:
            phone = BUSINESS_WHATSAPP
            if phone:
                text = quote(f"Hola, necesito ayuda con: {payload.mensaje}")
                wa = f"https://wa.me/{phone}?text={text}"
            else:
                wa = None
            # register user message only if the user is logged in
            try:
                if payload.usuario_origen:
                    db_chat = Chat(usuario_origen=payload.usuario_origen, usuario_destino=None, mensaje=payload.mensaje)
                    db.add(db_chat)
                    db.commit()
            except Exception:
                db.rollback()
            return BotResponseOut(texto="Puedo conectarte por WhatsApp. Pulsa el botón para iniciar la conversación.", fallback=True, whatsapp_url=wa)

    # 0b) greetings and short chit-chat: prefer quick friendly reply
    if len(mensaje) < 60:
        for g in greeting_keywords:
            if g in mensaje:
                try:
                    if payload.usuario_origen:
                        db_chat = Chat(usuario_origen=payload.usuario_origen, usuario_destino=None, mensaje=payload.mensaje)
                        db.add(db_chat)
                        db.commit()
                except Exception:
                    db.rollback()
                return BotResponseOut(texto="¡Hola! ¿En qué puedo ayudarte hoy? Puedes preguntarme por pedidos, envíos, devoluciones, o decir 'hablar con soporte' para WhatsApp.", fallback=False)
        for f in farewell_keywords:
            if f in mensaje:
                try:
                    if payload.usuario_origen:
                        db_chat = Chat(usuario_origen=payload.usuario_origen, usuario_destino=None, mensaje=payload.mensaje)
                        db.add(db_chat)
                        db.commit()
                except Exception:
                    db.rollback()
                return BotResponseOut(texto="Gracias por contactarnos. Si necesitas algo más, aquí estoy. ¡Que tengas un buen día!", fallback=False)

    # 1) Exact substring match (high confidence)
    for r in respuestas:
        try:
            if r.clave and r.clave.lower() in mensaje:
                # register chat (user -> bot) and bot reply in chat table
                try:
                    if payload.usuario_origen:
                        db_chat = Chat(usuario_origen=payload.usuario_origen, usuario_destino=None, mensaje=payload.mensaje)
                        db.add(db_chat)
                        db.commit()
                except Exception:
                    db.rollback()
                return BotResponseOut(texto=r.respuesta, fallback=False)
        except Exception:
            # defensive: skip malformed entries
            continue

    # 2) Fuzzy/token matching
    def token_overlap(a: str, b: str) -> float:
        sa = set(a.split())
        sb = set(b.split())
        if not sb:
            return 0.0
        return len(sa & sb) / float(len(sb))

    # multi-intent: compute score for all responses and pick top candidates
    scored = []
    keywords_map = {
        'horario': ['horario', 'abren', 'cierra', 'hora'],
        'envio': ['envio', 'envios', 'llegar', 'tiempo', 'demora', 'entrega', 'enviar'],
        'devolucion': ['devoluci', 'devolver', 'reembolso', 'reembols'],
        'pedido': ['pedido', 'compr', 'orden', 'estado', 'entregado', 'cancelar'],
        'contraseña': ['contrase', 'clave', 'password', 'recuperar', 'restablecer'],
        'nombre': ['nombre', 'usuario', 'apodo', 'editar nombre', 'cambiar nombre'],
        'ventas': ['venta', 'mayor', 'precio', 'oferta', 'promocion', 'promo'],
        'stock': ['agotado', 'agotada', 'stock', 'disponible']
    }

    for r in respuestas:
        clave = (r.clave or "").lower()
        ratio = SequenceMatcher(None, mensaje, clave).ratio() if clave else 0.0
        overlap = token_overlap(mensaje, clave) if clave else 0.0
        score = max(ratio, overlap)

        # boost score if certain keywords appear for common intents
        keywords_boost = 0.0
        for k, kws in keywords_map.items():
            for kw in kws:
                if kw in mensaje and (k in clave or kw in clave):
                    keywords_boost += 0.15
                    break

        score = min(1.0, score + keywords_boost)
        adjusted_score = score + (r.prioridad or 0) * 0.01
        scored.append((adjusted_score, r))

    # pick top candidates above a lower threshold and combine up to 2 answers
    scored.sort(key=lambda x: x[0], reverse=True)
    COMBINE_THRESHOLD = 0.35
    combined = []
    for s, r in scored:
        if s >= COMBINE_THRESHOLD and len(combined) < 2:
            combined.append((s, r))

    if combined:
        # if best candidate is confident enough return combined text, otherwise provide fallback option
        texts = [r.respuesta for (_s, r) in combined]
        reply = "\n\n".join(texts)
        try:
            if payload.usuario_origen:
                db_chat = Chat(usuario_origen=payload.usuario_origen, usuario_destino=None, mensaje=payload.mensaje)
                db.add(db_chat)
                db.commit()
        except Exception:
            db.rollback()

        # make combined/fuzzy replies slightly more polite and offer further help
        polite_suffix = "\n\nSi necesitas más ayuda o detalles, dímelo y con gusto te ayudo."
        reply = reply.strip()
        # avoid duplicating punctuation
        if not reply.endswith('.') and not reply.endswith('!') and not reply.endswith('?'):
            reply = reply + '.'
        reply = reply + polite_suffix

        # if top score is low, also include whatsapp link so frontend shows the button
        top_score = combined[0][0]
        # If the best candidate has low confidence, prefer asking the AI for a general/coherent answer
        if top_score < 0.7:
            if OPENAI_API_KEY:
                logger.info("Top DB match low (%.2f): calling OpenAI for user=%s", top_score, str(payload.usuario_origen))
            else:
                logger.info("Top DB match low (%.2f) and OpenAI not configured", top_score)
        if top_score < 0.7 and OPENAI_API_KEY:
            try:
                ai_reply = ask_openai(payload.mensaje or "", history=payload.history if getattr(payload, 'history', None) else None)
                if ai_reply:
                    try:
                        if payload.usuario_origen:
                            db_chat_bot = Chat(usuario_origen=None, usuario_destino=payload.usuario_origen, mensaje=ai_reply)
                            db.add(db_chat_bot)
                            db.commit()
                    except Exception:
                        db.rollback()
                    return BotResponseOut(texto=ai_reply, fallback=False, ai_generated=True)
            except Exception:
                # ignore AI errors and fall back to DB reply below
                pass

        if top_score < 0.5:
            phone = BUSINESS_WHATSAPP
            if phone:
                text = quote(f"Hola, necesito ayuda con: {payload.mensaje}")
                wa = f"https://wa.me/{phone}?text={text}"
            else:
                wa = None
            return BotResponseOut(texto=reply + "\n\nSi deseas hablar con un agente, puedes usar el botón de WhatsApp.", fallback=True, whatsapp_url=wa)

        return BotResponseOut(texto=reply, fallback=False)

    # 3) No good match -> try AI fallback (if configured), otherwise WhatsApp fallback
    # register user message only if logged in
    try:
        if payload.usuario_origen:
            db_chat = Chat(usuario_origen=payload.usuario_origen, usuario_destino=None, mensaje=payload.mensaje)
            db.add(db_chat)
            db.commit()
    except Exception:
        db.rollback()

    # If OpenAI key exists, try to get a light AI response
    if OPENAI_API_KEY:
        logger.info("No good DB match: calling OpenAI for user=%s", str(payload.usuario_origen))
        try:
            ai_reply = ask_openai(payload.mensaje or "", history=payload.history if getattr(payload, 'history', None) else None)
            if ai_reply:
                # save AI reply into chat table as a bot message (usuario_origen=None -> system/bot)
                try:
                    if payload.usuario_origen:
                        db_chat_bot = Chat(usuario_origen=None, usuario_destino=payload.usuario_origen, mensaje=ai_reply)
                        db.add(db_chat_bot)
                        db.commit()
                except Exception:
                    db.rollback()
                # return AI answer as the bot response (not marking as fallback)
                return BotResponseOut(texto=ai_reply, fallback=False, ai_generated=True)
        except Exception:
            # on any error, fall back to whatsapp behavior below
            pass

    phone = BUSINESS_WHATSAPP
    if phone:
        text = quote(f"Hola, necesito ayuda con: {payload.mensaje}")
        wa = f"https://wa.me/{phone}?text={text}"
    else:
        wa = None

    return BotResponseOut(texto="No encontré una respuesta para eso. ¿Quieres hablar con atención al cliente?", fallback=True, whatsapp_url=wa)
