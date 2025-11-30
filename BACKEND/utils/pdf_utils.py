from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics import renderPDF
from io import BytesIO
import os
from datetime import datetime
# Importaciones necesarias para el manejo correcto de texto con saltos de línea
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet


def _draw_table(c, x, y, col_widths, data, row_height_min=10 * mm, page_height=A4[1], margin=18 * mm, footer_space=80 * mm):
    """
    Dibuja la tabla de ítems en múltiples páginas si es necesario.
    Retorna (final_y, num_pages) donde final_y es la posición Y final en la última página.
    """
    styles = getSampleStyleSheet()
    styleN = styles['Normal']
    styleN.fontName = 'Helvetica'
    styleN.fontSize = 9

    total_width = sum(col_widths)
    min_y_safe = margin + footer_space  # Espacio mínimo al final de página
    
    # Dibujar encabezado
    header_height = row_height_min
    header_bg = colors.HexColor('#10b981')
    c.setFillColor(header_bg)
    c.rect(x, y - header_height, total_width, header_height, fill=1, stroke=0)
    c.setFillColor(colors.white)

    cur_x = x
    c.setFont('Helvetica-Bold', 9)
    for i, w in enumerate(col_widths):
        header = data[0][i]
        c.drawCentredString(cur_x + w / 2, y - header_height + 3 * mm, str(header))
        cur_x += w

    cur_y = y - header_height
    page_count = 1

    for idx, row in enumerate(data[1:]):
        # Calcular altura de la fila
        description_text = str(row[1])
        desc_col_width = col_widths[1] - 4 * mm

        description_p = Paragraph(description_text, styleN)
        w, h = description_p.wrapOn(c, desc_col_width, page_height)
        
        this_row_h = max(row_height_min, h + 4 * mm)

        # Verificar si hay espacio en la página actual
        if cur_y - this_row_h < min_y_safe:
            # No hay espacio: crear nueva página
            c.showPage()
            page_count += 1
            
            # Dibujar borde en la nueva página
            c.setLineWidth(0.5)
            c.setStrokeColor(colors.black)
            c.rect(margin / 2, margin / 2, c._pagesize[0] - margin, c._pagesize[1] - margin)
            
            # Redibuja el encabezado en la nueva página
            y_new = page_height - margin
            header_y = y_new
            c.setFillColor(header_bg)
            c.rect(x, header_y - header_height, total_width, header_height, fill=1, stroke=0)
            c.setFillColor(colors.white)
            
            cur_x = x
            c.setFont('Helvetica-Bold', 9)
            for i, w in enumerate(col_widths):
                header = data[0][i]
                c.drawCentredString(cur_x + w / 2, header_y - header_height + 3 * mm, str(header))
                cur_x += w
            
            cur_y = header_y - header_height

        # Mover Y
        cur_y -= this_row_h

        # Sombreado alternado
        if idx % 2 == 0:
            c.setFillColor(colors.HexColor('#f7faf7'))
        else:
            c.setFillColor(colors.white)
            
        c.rect(x, cur_y, total_width, this_row_h, fill=1, stroke=0)
        c.setFillColor(colors.black)

        # Dibujar contenido
        cur_x = x
        for i, cell in enumerate(row):
            col_w = col_widths[i]
            text_y = cur_y + (this_row_h / 2) - 3 * mm
            
            if i == 1:  # Descripción
                description_p.drawOn(c, cur_x + 2 * mm, cur_y + this_row_h - h - 2 * mm)
            else:
                c.setFont('Helvetica', 9)
                if i == 0:  # Cantidad
                    c.drawString(cur_x + 4 * mm, text_y, str(cell))
                else:  # Precio y Subtotal
                    c.drawRightString(cur_x + col_w - 4 * mm, text_y, str(cell))

            cur_x += col_w

    return (cur_y, page_count)


def generate_invoice_pdf(pedido, cliente=None, items=None, logo_path=None):
    """Genera un PDF de factura con soporte para múltiples páginas si hay muchos ítems."""
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    margin = 18 * mm
    
    # Configuración de espacios
    header_height = 50 * mm  # Altura para logo + título
    footer_height = 80 * mm  # Altura para footer + QR
    usable_height = height - margin * 2 - header_height - footer_height
    
    # --- Preparar datos de la tabla ---
    if not items:
        items = [
            {'cantidad': 1, 'descripcion': 'Set de Figuras de Acción Coleccionables', 'subtotal': 30000.00, 'precio': 30000.00},
            {'cantidad': 1, 'descripcion': 'Set de Juguetes Educativos de Madera', 'subtotal': 20000.00, 'precio': 20000.00},
        ]

    data = [['Cant', 'Descripción', 'Precio Unit.', 'Subtotal']]
    for it in items:
        cant = it.get('cantidad', '')
        desc = it.get('descripcion', '')
        subtotal = float(it.get('subtotal', 0) or 0)
        try:
            precio = float(it.get('precio', None)) if it.get('precio') is not None else (subtotal / float(it.get('cantidad')) if float(it.get('cantidad')) else subtotal)
        except Exception:
            precio = subtotal
        data.append([str(cant), desc, f"{precio:,.2f}", f"{subtotal:,.2f}"])

    # Procesar fecha_pedido correctamente
    fecha_obj = getattr(pedido, 'fecha_pedido', None)
    if hasattr(fecha_obj, 'strftime'):
        fecha_str = fecha_obj.strftime('%Y-%m-%d %H:%M')
    else:
        fecha_str = str(fecha_obj) if fecha_obj else datetime.now().strftime('%Y-%m-%d %H:%M')
    
    pedido_id = getattr(pedido, 'id_pedido', getattr(pedido, 'id', None)) or '57'
    cliente_nombre = getattr(cliente, 'nombre', None) or getattr(cliente, 'nombre_completo', 'Cliente')
    cliente_correo = getattr(cliente, 'correo', 'cliente@example.com') if cliente else 'cliente@example.com'
    
    subtotal_calc = sum(float(it.get('subtotal', 0) or 0) for it in items)
    total = getattr(pedido, 'total', subtotal_calc) or subtotal_calc
    iva = getattr(pedido, 'iva', 0.0)

    # --- Función para dibujar header (logo + título) ---
    def draw_header(canvas_obj, y_start):
        logo_drawn_h = 0
        try:
            if not logo_path:
                repo_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
                candidates = [
                    os.path.join(repo_root, 'FRONTEND', 'public', 'logo-icon.png'),
                    os.path.join(repo_root, 'FRONTEND', 'public', 'logo.png'),
                    os.path.join(repo_root, 'FRONTEND', 'src', 'assets', 'IMG', 'logo.png'),
                    os.path.join(repo_root, 'BACKEND', 'static', 'logo-icon.png'),
                    os.path.join(repo_root, 'BACKEND', 'static', 'logo.png'),
                ]
                for p in candidates:
                    p = os.path.normpath(p)
                    if os.path.exists(p):
                        logo_path_found = p
                        break
            else:
                logo_path_found = logo_path

            if logo_path_found and os.path.exists(logo_path_found):
                logo_w = 40 * mm
                logo_h = 40 * mm
                logo_x = margin + 5 * mm
                logo_y = y_start - logo_h
                try:
                    canvas_obj.drawImage(logo_path_found, logo_x, logo_y, width=logo_w, height=logo_h, preserveAspectRatio=True, mask='auto')
                    logo_drawn_h = logo_h
                except Exception:
                    logo_drawn_h = 0
        except Exception:
            logo_drawn_h = 0

        title_y = (y_start - (logo_drawn_h / 2)) if logo_drawn_h > 0 else (y_start - 20 * mm)
        canvas_obj.setFont('Helvetica-Bold', 24)
        canvas_obj.drawCentredString(width / 2, title_y, 'FACTURA ELECTRÓNICA')
        
        return y_start - (logo_drawn_h or 35 * mm) - 12 * mm

    # --- Función para dibujar metadata ---
    def draw_metadata(canvas_obj, y_pos):
        canvas_obj.setFont('Helvetica-Bold', 10)
        canvas_obj.drawString(margin, y_pos, 'Número:')
        canvas_obj.setFont('Helvetica', 10)
        canvas_obj.drawString(margin + 36 * mm, y_pos, str(pedido_id))
        
        canvas_obj.setFont('Helvetica-Bold', 10)
        canvas_obj.drawString(width - margin - 70 * mm, y_pos, 'Fecha:')
        canvas_obj.setFont('Helvetica', 10)
        canvas_obj.drawString(width - margin - 50 * mm, y_pos, fecha_str)
        y_pos -= 6 * mm

        canvas_obj.setFont('Helvetica-Bold', 10)
        canvas_obj.drawString(margin, y_pos, 'Cliente:')
        canvas_obj.setFont('Helvetica', 10)
        canvas_obj.drawString(margin + 36 * mm, y_pos, cliente_nombre)
        
        canvas_obj.setFont('Helvetica-Bold', 10)
        canvas_obj.drawString(width - margin - 70 * mm, y_pos, 'Email:')
        canvas_obj.setFont('Helvetica', 10)
        canvas_obj.drawString(width - margin - 50 * mm, y_pos, cliente_correo)

        return y_pos - 12 * mm

    # --- Función para dibujar totales ---
    def draw_totals(canvas_obj, y_pos):
        box_w = 70 * mm
        box_h = 28 * mm
        box_x = width - margin - box_w
        box_y = y_pos - box_h

        canvas_obj.setFillColor(colors.HexColor('#f3f4f6'))
        canvas_obj.rect(box_x, box_y, box_w, box_h, fill=1, stroke=0)
        canvas_obj.setFillColor(colors.black)

        canvas_obj.setFont('Helvetica', 10)
        canvas_obj.drawRightString(box_x + box_w - 8 * mm, box_y + box_h - 8 * mm, f'Subtotal: {subtotal_calc:,.2f}')
        canvas_obj.drawRightString(box_x + box_w - 8 * mm, box_y + box_h - 16 * mm, f'Iva: {iva:,.2f}')

        sep_y = box_y + 8 * mm
        canvas_obj.setStrokeColor(colors.HexColor('#e5e7eb'))
        canvas_obj.setLineWidth(0.5)
        canvas_obj.line(box_x + 6 * mm, sep_y, box_x + box_w - 6 * mm, sep_y)

        canvas_obj.setFont('Helvetica-Bold', 12)
        canvas_obj.drawRightString(box_x + box_w - 8 * mm, box_y + 4 * mm, f'Total: {total:,.2f}')
        
        return box_y

    # --- Función para dibujar footer y mensaje motivacional ---
    def draw_footer(canvas_obj):
        footer_y = margin + 18 * mm
        
        canvas_obj.setFont('Helvetica-Bold', 13)
        canvas_obj.setFillColor(colors.HexColor('#d32f2f'))
        thank_msg = '¡Gracias por preferir a JosniShop!'
        canvas_obj.drawCentredString(width / 2, footer_y + 22 * mm, thank_msg)
        
        canvas_obj.setFont('Helvetica', 10)
        canvas_obj.setFillColor(colors.black)
        msg1 = 'Tu compra nos inspira a mejorar cada día y ofrecer lo mejor para ti.'
        msg2 = 'Si tienes dudas o necesitas soporte, contáctanos a soporte@josnishop.com'
        canvas_obj.drawCentredString(width / 2, footer_y + 16 * mm, msg1)
        canvas_obj.drawCentredString(width / 2, footer_y + 12 * mm, msg2)

        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.drawString(margin, footer_y + 4 * mm, 'Responsable de IVA - Autorización de numeración de facturación | Software JosniShop')

    # --- Función para dibujar QR (opcional, al final) ---
    def draw_qr_footer(canvas_obj):
        footer_y = margin + 18 * mm
        try:
            cufe_placeholder = (str(pedido_id) + '-' + str(int(total)) + '-' + str(int(subtotal_calc)) + '-' + fecha_str).replace(' ', '_')
            qr_value = f'CUFE:{cufe_placeholder}|Total:{total:,.2f}|Fecha:{fecha_str}'
            qr = QrCodeWidget(qr_value)
            qr_size = 30 * mm
            render_x = (width - qr_size) / 2
            render_y = footer_y + 40 * mm

            renderPDF.draw(qr, c, render_x, render_y, size=qr_size)
            
            c.setFont('Helvetica-Bold', 9)
            c.drawCentredString(width / 2, render_y - 4 * mm, 'CUFE:')
            c.setFont('Helvetica', 8)
            c.drawCentredString(width / 2, render_y - 10 * mm, cufe_placeholder[:80] + '...')
        except Exception:
            pass

    # --- PRIMERA PÁGINA: Header + Metadata + Tabla ---
    y = height - margin
    
    # Dibujar border
    c.setLineWidth(0.5)
    c.setStrokeColor(colors.black)
    c.rect(margin / 2, margin / 2, width - margin, height - margin)

    # Dibujar header
    y = draw_header(c, y)

    # Dibujar metadata
    y = draw_metadata(c, y)

    # Dibujar tabla de ítems (con soporte para múltiples páginas)
    col_widths = [18 * mm, 100 * mm, 30 * mm, 30 * mm]
    final_y, page_count = _draw_table(c, margin, y, col_widths, data, row_height_min=10 * mm, 
                                       page_height=height, margin=margin, footer_space=footer_height)

    # --- MANEJO DE PÁGINAS MÚLTIPLES ---
    # Si la tabla ocupó múltiples páginas, ya estamos en la última página
    # Si solo ocupó una, continuamos en la primera
    
    # Verificar si hay espacio para totales en la página actual
    min_space_for_totals = 50 * mm
    
    if final_y - min_space_for_totals < (margin + footer_height):
        # No hay espacio: crear nueva página para totales + footer
        c.showPage()
        page_count += 1
        
        # Dibujar borde en la nueva página
        c.setLineWidth(0.5)
        c.setStrokeColor(colors.black)
        c.rect(margin / 2, margin / 2, width - margin, height - margin)
        
        # Colocar totales en la nueva página
        y_totals = height - margin - 60 * mm
        totals_bottom = draw_totals(c, y_totals)
    else:
        # Hay espacio: dibujar totales en la página actual
        y_totals = final_y - 10 * mm
        totals_bottom = draw_totals(c, y_totals)

    # Dibujar footer y QR siempre en la página actual (última)
    draw_footer(c)
    draw_qr_footer(c)

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer.read()
