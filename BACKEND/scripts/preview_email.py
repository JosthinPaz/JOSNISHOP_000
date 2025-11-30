from utils.email_utils import HTML_EMAIL_TEMPLATE

html = HTML_EMAIL_TEMPLATE.format(
    title="¡Hola!",
    intro="Hemos recibido una solicitud para recuperar tu contraseña en <strong>KAIO</strong>.",
    content="<h3 style='color:#0ea5e9;margin:0;'>UzS\\Jmc\\</h3>",
    footer='1. Inicia sesión con tu correo y esta contraseña temporal<br>2. Dirígete a tu panel de control<br>3. Cambia esta contraseña temporal por una que recuerdes fácilmente',
    button_html='<a href="https://josnishop.example" style="display:inline-block;padding:12px 18px;background:#d32f2f;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Ir a JosniShop</a>'
)

with open('preview_email.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Wrote preview_email.html in the current folder. Open it in a browser to preview the template.')
