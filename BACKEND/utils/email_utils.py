import os
import smtplib
from email.message import EmailMessage

def enviar_alerta_stock(destinatario, producto, cantidad):
    remitente = os.getenv('SMTP_EMAIL', 'josnishop@gmail.com')
    password = os.getenv('SMTP_PASSWORD', 'uoth lcxb qbvf yixd')
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '465'))

    asunto = "¡Atención! Stock bajo en JosniShop"
    texto = f"Producto: {producto}\nQuedan {cantidad} unidades."

    html = HTML_EMAIL_TEMPLATE.format(
        title="¡Atención! Stock bajo",
        intro=f"El producto <strong>{producto}</strong> está por agotarse.",
        content=f"<p>Actualmente solo quedan <strong>{cantidad}</strong> unidades disponibles.</p>",
        footer="Revisa el inventario en tu panel de control.",
        button_html=""
    )

    msg = EmailMessage()
    msg.set_content(texto)
    msg.add_alternative(html, subtype='html')
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = destinatario

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(remitente, password)
            server.send_message(msg)
    except Exception as e:
        print("Error enviando correo:", e)

def enviar_confirmacion_compra(correo, pedido_id, pdf_bytes=None, filename=None):
    """Envía el correo de confirmación de compra. Acepta opcionalmente `pdf_bytes` para adjuntar la factura."""
    remitente = os.getenv('SMTP_EMAIL', 'josnishop@gmail.com')
    password = os.getenv('SMTP_PASSWORD', 'uoth lcxb qbvf yixd')
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '465'))

    asunto = "¡Gracias por tu compra en JosniShop!"
    texto = f"Tu compra ha sido confirmada. Pedido: {pedido_id}.\nDescarga la factura adjunta para tener un respaldo de tu compra."

    # Contenido del correo con información clara sobre la factura
    pdf_info = "<p><strong>📎 Factura adjunta:</strong> Hemos incluido tu comprobante de compra en formato PDF. Descárgalo y guárdalo como respaldo.</p>" if pdf_bytes else ""

    html = HTML_EMAIL_TEMPLATE.format(
        title="¡Gracias por tu compra!",
        intro=f"Hemos confirmado tu compra. <strong>Pedido #{pedido_id}</strong>",
        content=f"<p>Tu compra ha sido procesada exitosamente.</p>{pdf_info}<p>En breve recibirás actualizaciones sobre el estado de tu pedido.</p>",
        footer="Puedes consultar el estado de tu pedido en tu panel de usuario. Gracias por confiar en JosniShop.",
        button_html=""
    )

    msg = EmailMessage()
    msg.set_content(texto)
    msg.add_alternative(html, subtype='html')
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = correo

    # Adjuntar PDF si está disponible
    if pdf_bytes:
        if not filename:
            filename = f'factura_pedido_{pedido_id}.pdf'
        try:
            msg.add_attachment(pdf_bytes, maintype='application', subtype='pdf', filename=filename)
            print(f'[CONFIRMACION_COMPRA] PDF adjuntado: {filename} ({len(pdf_bytes)} bytes)')
        except Exception as e:
            print(f'[CONFIRMACION_COMPRA] Error adjuntando PDF: {e}')
    else:
        print(f'[CONFIRMACION_COMPRA] No se proporcionó pdf_bytes para el pedido {pedido_id}')

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(remitente, password)
            server.send_message(msg)
            print(f"[CONFIRMACION_COMPRA] Correo enviado a {correo} | Pedido: {pedido_id}")
    except Exception as e:
        print(f"[CONFIRMACION_COMPRA] Error enviando correo: {e}")

def send_registration_email(to_email):
    remitente = os.getenv('SMTP_EMAIL', 'josnishop@gmail.com')
    password = os.getenv('SMTP_PASSWORD', 'uoth lcxb qbvf yixd')
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '465'))

    subject = "Registro exitoso en JosniShop"
    texto = "Te has registrado exitosamente en JosniShop."

    html = HTML_EMAIL_TEMPLATE.format(
        title="¡Bienvenido!",
        intro="Has registrado tu cuenta en JosniShop.",
        content="<p>Gracias por confiar en nosotros.</p>",
        footer="Disfruta de la experiencia de compra.",
        button_html=""
    )

    msg = EmailMessage()
    msg.set_content(texto)
    msg.add_alternative(html, subtype='html')
    msg['Subject'] = subject
    msg['From'] = remitente
    msg['To'] = to_email

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(remitente, password)
            server.send_message(msg)
    except Exception as e:
        print("Error enviando correo:", e)

def enviar_alerta_resena(destinatario, producto, comentario, calificacion):
    remitente = os.getenv('SMTP_EMAIL', 'josnishop@gmail.com')
    password = os.getenv('SMTP_PASSWORD', 'uoth lcxb qbvf yixd')
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '465'))

    asunto = "¡Nueva reseña en tu producto JosniShop!"
    texto = f"Nueva reseña en {producto}: {calificacion} estrellas."

    html = HTML_EMAIL_TEMPLATE.format(
        title="Nueva reseña recibida",
        intro=f"Tu producto <strong>{producto}</strong> recibió una nueva reseña.",
        content=f"<p><strong>Calificación:</strong> {calificacion} estrellas</p><p><strong>Comentario:</strong> {comentario}</p>",
        footer="Revisa tu panel para responder o gestionar la reseña.",
        button_html=""
    )

    msg = EmailMessage()
    msg.set_content(texto)
    msg.add_alternative(html, subtype='html')
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = destinatario

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(remitente, password)
            server.send_message(msg)
    except Exception as e:
        print("Error enviando correo:", e)


def enviar_respuesta_resena(destinatario, producto, respuesta_vendedor):
    """Enviar correo al cliente cuando el vendedor responde su reseña."""
    remitente = os.getenv('SMTP_EMAIL', 'josnishop@gmail.com')
    password = os.getenv('SMTP_PASSWORD', 'uoth lcxb qbvf yixd')
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '465'))

    asunto = "Tu reseña ha recibido una respuesta en JosniShop"
    texto = f"Tu reseña sobre {producto} ha sido respondida."

    html = HTML_EMAIL_TEMPLATE.format(
        title="Respuesta a tu reseña",
        intro=f"Tu reseña sobre <strong>{producto}</strong> ha sido respondida.",
        content=f"<p>{respuesta_vendedor}</p>",
        footer="Puedes ver la conversación en tu panel de usuario.",
        button_html=""
    )

    msg = EmailMessage()
    msg.set_content(texto)
    msg.add_alternative(html, subtype='html')
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = destinatario

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(remitente, password)
            server.send_message(msg)
    except Exception as e:
        print("Error enviando correo (respuesta reseña):", e)


def enviar_cambio_estado_pedido(correo, pedido_id, nuevo_estado):
    """Enviar correo al cliente cuando cambie el estado de su pedido."""
    remitente = os.getenv('SMTP_EMAIL', 'josnishop@gmail.com')
    password = os.getenv('SMTP_PASSWORD', 'uoth lcxb qbvf yixd')
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '465'))

    asunto = f"Actualización de estado del pedido #{pedido_id}"
    texto = f"El estado de tu pedido #{pedido_id} ha cambiado a: {nuevo_estado}."

    html = HTML_EMAIL_TEMPLATE.format(
        title="Cambio de estado de pedido",
        intro=f"Tu pedido <strong>#{pedido_id}</strong> cambió de estado.",
        content=f"<p>Nuevo estado: <strong>{nuevo_estado}</strong></p>",
        footer="Consulta más detalles en tu panel de usuario.",
        button_html=""
    )
    # build and send message for pedido state change
    msg = EmailMessage()
    msg.set_content(texto)
    msg.add_alternative(html, subtype='html')
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = correo

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(remitente, password)
            server.send_message(msg)
    except Exception as e:
        print("Error enviando correo (estado pedido):", e)


def enviar_recuperacion_contrasena(destinatario, nueva_contrasena):
    """Envía el correo de recuperación de contraseña usando la plantilla mejorada."""
    remitente = os.getenv('SMTP_EMAIL', 'josnishop@gmail.com')
    password = os.getenv('SMTP_PASSWORD', 'uoth lcxb qbvf yixd')
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '465'))

    asunto = "Recuperación de contraseña - JosniShop"
    texto = f"Tu nueva contraseña temporal es: {nueva_contrasena}"

    frontend_url = os.getenv('FRONTEND_URL', '')
    if frontend_url:
        button = f"<a href=\"{frontend_url}\" style=\"display:inline-block;padding:12px 18px;background:#d32f2f;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;\">Ir a JosniShop</a>"
    else:
        button = ""

    # Password highlighted block
    pwd_block = f"<div style=\"font-family:monospace;background:#0f1724;color:#fff;display:inline-block;padding:10px 14px;border-radius:6px;font-size:18px;letter-spacing:1px;\">{nueva_contrasena}</div>"

    html = HTML_EMAIL_TEMPLATE.format(
        title="Recuperación de contraseña",
        intro="Hemos recibido una solicitud para recuperar tu contraseña.",
        content=(
            f"<p>Tu nueva contraseña temporal es:</p>"
            f"<div style='margin:12px 0'>{pwd_block}</div>"
            "<h3 style='margin-top:18px;color:#374151;'>Instrucciones:</h3>"
            "<ol style='color:#6b7280;margin-left:18px;'>"
            "<li>Inicia sesión con tu correo y esta contraseña temporal</li>"
            "<li>Dirígete a tu panel de control</li>"
            "<li>Cambia esta contraseña temporal por una que recuerdes fácilmente</li>"
            "</ol>"
            "<p style='margin-top:12px;'><strong>Importante:</strong> Esta contraseña temporal es válida por un acceso. Por favor, cámbiala inmediatamente después de iniciar sesión.</p>"
        ),
        footer="",
        button_html=button
    )

    msg = EmailMessage()
    msg.set_content(texto)
    msg.add_alternative(html, subtype='html')
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = destinatario

    # Debug output to confirm function is used and message structure
    print(f"[ENVIAR_RECUPERACION] Para={destinatario} | Asunto={asunto} | SMTP={smtp_server}:{smtp_port}")
    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(remitente, password)
            server.send_message(msg)
            print(f"[ENVIAR_RECUPERACION] Enviado OK a {destinatario}")
    except Exception as e:
        print('Error enviando correo (recuperacion):', e)
    # function finished


# Reusable HTML email template. The left colored stripe is red (#d32f2f).
# Uses simple inline styles for better email client compatibility.
HTML_EMAIL_TEMPLATE = """<!doctype html>
<html>
    <head>
        <meta charset=\"utf-8\"> 
        <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />
    </head>
    <body style=\"margin:0;padding:0;font-family:Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;background:#f3f4f6;color:#111827;\">
        <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"padding:24px;\">
            <tr>
                <td align=\"center\"> 
                    <table role=\"presentation\" width=\"680\" cellspacing=\"0\" cellpadding=\"0\" style=\"background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 6px 18px rgba(15,23,42,0.06);\">
                        <tr>
                            <td style=\"width:10px;background:#d32f2f;vertical-align:top;\">&nbsp;</td>
                            <td style=\"padding:28px 36px;\">

                                <h1 style=\"margin:6px 0 14px 0;font-size:22px;color:#0f1724;\">{title}</h1>
                                <p style=\"margin:0 0 18px 0;color:#374151;font-size:15px;\">{intro}</p>

                                <div style=\"background:#fafafa;border-radius:8px;padding:18px;margin:12px 0;border:1px solid #eef2f3;color:#1f2937;\">{content}</div>

                                <div style=\"margin:10px 0 18px 0;color:#6b7280;font-size:14px;\">{footer}</div>

                                <div style=\"border-top:1px solid #eef2f6;margin-top:20px;padding-top:18px;text-align:center;color:#9ca3af;font-size:13px;\">
                                    <div>¿Necesitas ayuda? Contáctanos en <a href=\"mailto:soporte@josnishop.com\" style=\"color:#d32f2f;text-decoration:none;\">soporte@josnishop.com</a></div>
                                    <div style=\"margin-top:8px;font-weight:600;color:#374151;\">¡Gracias por confiar en nosotros! &nbsp; <span style=\"display:block;font-size:12px;color:#9ca3af;\">JOSNISHOP</span></div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>"""