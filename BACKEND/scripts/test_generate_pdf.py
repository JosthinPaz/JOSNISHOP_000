import sys
import os
# Asegurarse de que el paquete BACKEND esté en sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.pdf_utils import generate_invoice_pdf

class Dummy:
    pass

pedido = Dummy()
pedido.fecha_pedido = '2025-11-29 18:16'
pedido.id_pedido = 123
pedido.total = 50000.0
pedido.iva = 0.0

cliente = Dummy()
cliente.nombre = 'Usuario de Prueba'
cliente.correo = 'test@example.com'

items = [
    {'cantidad': 1, 'descripcion': 'Producto de prueba con una descripción lo suficientemente larga para forzar salto de línea y comprobar wrapping en la celda de descripción.', 'precio': 50000.0, 'subtotal': 50000.0}
]

pdf_bytes = generate_invoice_pdf(pedido, cliente=cliente, items=items)

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_invoice.pdf')
with open(out_path, 'wb') as f:
    f.write(pdf_bytes)

print(f'PDF de prueba escrito en: {out_path}')
