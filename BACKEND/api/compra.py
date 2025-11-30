# Importamos los módulos y clases necesarios de FastAPI, Pydantic y SQLAlchemy.
# Estos son como las "herramientas" que necesitamos para construir nuestra aplicación.
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.session import SessionLocal
from models.pedido import Pedido
from models.detallepedido import DetallePedido
from models.inventario import Inventario
from utils.email_utils import enviar_confirmacion_compra, enviar_alerta_stock
from utils.pdf_utils import generate_invoice_pdf
from datetime import datetime
import os

# Creamos un enrutador de FastAPI. Esto nos permite agrupar y organizar las rutas de nuestra API.
router = APIRouter()

# --- Modelos de datos para validar las peticiones ---

# Definimos la estructura de un solo producto dentro de la compra.
# Esto asegura que cada "detalle" de la compra tenga un ID de producto (entero),
# una cantidad (entero) y un subtotal (flotante).
class DetalleCompra(BaseModel):
    producto_id: int
    cantidad: int
    subtotal: float

# Definimos la estructura completa de la petición de compra.
# El cuerpo de la petición (lo que el cliente envía) debe tener un ID de cliente,
# una lista de los productos (`detalles`), el total de la compra y el correo del cliente.
class CompraRequest(BaseModel):
    cliente_id: int
    detalles: list[DetalleCompra]  # Espera una lista de los objetos definidos arriba.
    total: float
    correo: str

# --- Punto de entrada para la API de compra ---

# Definimos una ruta que acepta peticiones POST en el endpoint "/compra".
# La función `realizar_compra` se ejecutará cuando se reciba una petición a esta ruta.
@router.post("/compra")
def realizar_compra(compra: CompraRequest):
    # Abrimos una nueva sesión de base de datos. Piénsalo como abrir una conexión para hablar con la base de datos.
    db = SessionLocal()
    try:
        # --- Paso 1: Crear el pedido principal ---

        # Creamos un nuevo objeto Pedido con la información de la petición.
        # Le asignamos la fecha y hora actuales y un estado inicial de "Procesando".
        nuevo_pedido = Pedido(
            cliente_id=compra.cliente_id,
            vendedor_id=1,  # Siempre el vendedor 1
            fecha_pedido=datetime.now(),  # Usamos la fecha y hora actuales del sistema.
            estado="Procesando",
            total=compra.total
        )
        
        # Agregamos el nuevo pedido a la sesión de la base de datos.
        db.add(nuevo_pedido)
        
        # Guardamos los cambios en la base de datos. Ahora el pedido existe y tiene un ID.
        db.commit()
        
        # Recargamos el objeto para obtener el ID de pedido que la base de datos acaba de generar.
        db.refresh(nuevo_pedido)

        # --- Paso 2: Crear los detalles del pedido y actualizar el inventario ---

        # Recorremos cada producto en la lista de detalles de la compra.
        for detalle in compra.detalles:
            # Para cada producto, creamos un objeto DetallePedido.
            # Lo enlazamos al pedido principal que acabamos de crear usando `nuevo_pedido.id_pedido`.
            nuevo_detalle = DetallePedido(
                pedido_id=nuevo_pedido.id_pedido,
                producto_id=detalle.producto_id,
                cantidad=detalle.cantidad,
                subtotal=detalle.subtotal
            )
            # Lo agregamos a la sesión para que se guarde.
            db.add(nuevo_detalle)

            # Buscamos el registro del inventario para el producto actual.
            inventario = db.query(Inventario).filter_by(producto_id=detalle.producto_id).first()
            
            # Verificamos si encontramos el producto en el inventario.
            if inventario:
                # Comprobamos si hay suficiente stock para la cantidad solicitada.
                if inventario.cantidad >= detalle.cantidad:
                    # Si hay, restamos la cantidad comprada al stock actual.
                    inventario.cantidad -= detalle.cantidad
                    # Guardamos este cambio en el inventario.
                    db.commit()
                    
                    # Verificamos si el stock ahora está por debajo del nivel mínimo.
                    if inventario.cantidad < inventario.stock_minimo:
                        # Si el stock es bajo, obtenemos el nombre del producto para el correo.
                        producto = getattr(inventario, 'producto', None)
                        nombre_producto = producto.nombre if producto and hasattr(producto, 'nombre') else f"ID {detalle.producto_id}"
                        # Enviamos una alerta al vendedor.
                        enviar_alerta_stock(
                            destinatario="josthinpaz2@gmail.com",
                            producto=nombre_producto,
                            cantidad=inventario.cantidad
                        )
                else:
                    # Si no hay suficiente stock, deshazemos todos los cambios anteriores.
                    db.rollback()
                    # Lanzamos un error HTTP 400 (Bad Request) con un mensaje claro.
                    raise HTTPException(status_code=400, detail=f"Stock insuficiente para el producto {detalle.producto_id}")
            else:
                # Si el producto no se encuentra en el inventario, deshacemos todo.
                db.rollback()
                # Lanzamos un error HTTP 404 (Not Found).
                raise HTTPException(status_code=404, detail=f"Inventario no encontrado para el producto {detalle.producto_id}")

        # --- Paso 3: Finalizar y responder ---
        
        # Generar PDF de la factura (si se desea incluir detalles)
        try:
            # Obtener cliente si existe para incluir nombre/email
            cliente = None
            from models.usuarios import Usuario
            cliente = db.query(Usuario).filter_by(id_usuario=compra.cliente_id).first()

            items = []
            from models.producto import Producto
            for detalle in compra.detalles:
                # intentar obtener nombre de producto
                prod = db.query(Producto).filter_by(id=detalle.producto_id).first()
                nombre = prod.nombre if prod else f'Producto ID {detalle.producto_id}'
                items.append({
                    'cantidad': detalle.cantidad,
                    'descripcion': nombre,
                    'subtotal': detalle.subtotal,
                    'precio': detalle.subtotal / detalle.cantidad if detalle.cantidad > 0 else detalle.subtotal
                })

            # Ruta al logo en frontend/public
            logo_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'FRONTEND', 'public', 'logo.png')
            if not os.path.exists(logo_path):
                logo_path = None

            pedido_pdf_bytes = generate_invoice_pdf(nuevo_pedido, cliente=cliente, items=items, logo_path=logo_path)
            print(f"[COMPRA] PDF generado exitosamente: {len(pedido_pdf_bytes) if pedido_pdf_bytes else 0} bytes")
        except Exception as e:
            # No bloquear la compra si falla la generación de PDF
            print(f'[COMPRA] Error generando PDF de factura: {e}')
            import traceback
            traceback.print_exc()
            pedido_pdf_bytes = None

        # Si todo fue bien, enviamos un correo de confirmación al cliente con la factura adjunta.
        try:
            print(f"[COMPRA] Enviando correo de confirmación a {compra.correo} | PDF: {len(pedido_pdf_bytes) if pedido_pdf_bytes else 'NO'}")
            enviar_confirmacion_compra(compra.correo, nuevo_pedido.id_pedido, pdf_bytes=pedido_pdf_bytes)
        except Exception as e:
            print(f'[COMPRA] Error enviando correo de confirmación (no bloqueante): {e}')

        # Devolvemos una respuesta exitosa al cliente con un mensaje y el número de pedido.
        return {"mensaje": "Compra realizada exitosamente", "numero_pedido": nuevo_pedido.id_pedido}
        
    except Exception as e:
        # Si ocurre cualquier otro error, deshacemos todos los cambios en la base de datos.
        db.rollback()
        # Lanzamos un error HTTP 500 (Internal Server Error) para el cliente.
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        # Cerramos la conexión a la base de datos. Esto siempre se ejecuta, sin importar si hay error o no.
        db.close()