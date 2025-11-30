#!/usr/bin/env python3
"""
Script de prueba para generar PDF de factura y enviar correo de prueba.
Uso: python test_pdf_and_email.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.pdf_utils import generate_invoice_pdf
from utils.email_utils import enviar_confirmacion_compra
from datetime import datetime

print("=" * 60)
print("TEST: Generar PDF y enviar por correo")
print("=" * 60)

class MockPedido:
    def __init__(self):
        self.id_pedido = 999
        self.fecha_pedido = datetime.now()
        self.total = 150000.0
        self.iva = 0.0

class MockCliente:
    def __init__(self):
        self.nombre = 'Cliente Test'
        self.correo = 'josthinpaznieto07@gmail.com'  # Cambiar al correo de prueba

# Crear datos de prueba
pedido = MockPedido()
cliente = MockCliente()

items = [
    {
        'cantidad': 2,
        'descripcion': 'Producto 1 - Test con descripción larga para verificar wrapping en la tabla de facturas.',
        'precio': 50000.0,
        'subtotal': 100000.0
    },
    {
        'cantidad': 1,
        'descripcion': 'Producto 2 - Test rápido',
        'precio': 50000.0,
        'subtotal': 50000.0
    }
]

# Paso 1: Generar PDF
print("\n[1] Generando PDF de factura...")
try:
    pdf_bytes = generate_invoice_pdf(pedido, cliente=cliente, items=items)
    print(f"✓ PDF generado exitosamente: {len(pdf_bytes)} bytes")
except Exception as e:
    print(f"✗ Error generando PDF: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Paso 2: Guardar PDF en disco (para inspección)
out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_factura_999.pdf')
try:
    with open(out_path, 'wb') as f:
        f.write(pdf_bytes)
    print(f"✓ PDF guardado en: {out_path}")
except Exception as e:
    print(f"✗ Error guardando PDF: {e}")

# Paso 3: Enviar por correo
print(f"\n[2] Enviando correo a {cliente.correo}...")
try:
    enviar_confirmacion_compra(cliente.correo, pedido.id_pedido, pdf_bytes=pdf_bytes)
    print(f"✓ Correo enviado exitosamente")
except Exception as e:
    print(f"✗ Error enviando correo: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Test completado. Revisa tu correo y el PDF en la ruta.")
print("=" * 60)
