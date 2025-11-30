from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.session import SessionLocal
from fastapi.responses import JSONResponse
from sqlalchemy import text, func
from datetime import datetime

# Models para consultas
from models.detallepedido import DetallePedido
from models.producto import Producto
from models.pedido import Pedido

router = APIRouter(prefix="/ventas", tags=["ventas"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def consultar_ventas(
    anio: int = Query(...),
    mes: int = Query(None),
    dia: int = Query(None),
    db: Session = Depends(get_db)
):
    # Llama al SP con los parámetros recibidos
    result = db.execute(
        text("CALL SP_ConsultarVentasVendedor(:anio, :mes, :dia)"),
        {"anio": anio, "mes": mes, "dia": dia}
    )
    # Obtén los resultados como lista de dicts
    rows = result.fetchall()
    columns = result.keys()
    data = [dict(zip(columns, row)) for row in rows]
    return JSONResponse(content=data)


@router.get("/daily_report")
def reporte_ventas_diario(date: str = Query(None, description="Fecha en formato YYYY-MM-DD"), db: Session = Depends(get_db)):
    """Retorna ventas del dia agrupadas por producto.
    Responde con: [{ producto_id, producto_nombre, total_cantidad, total_revenue }]
    Si `date` no se provee, usa la fecha actual.
    """
    if not date:
        date = datetime.today().strftime("%Y-%m-%d")

    # Agregación por producto usando SQLAlchemy
    # JOIN detalle_pedido -> pedidos (para fecha) y productos (para nombre)
    query = (
        db.query(
            DetallePedido.producto_id,
            Producto.nombre,
            func.coalesce(func.sum(DetallePedido.cantidad), 0).label("total_cantidad"),
            func.coalesce(func.sum(DetallePedido.subtotal), 0.0).label("total_revenue"),
        )
        .join(Pedido, DetallePedido.pedido_id == Pedido.id_pedido)
        .join(Producto, DetallePedido.producto_id == Producto.id)
        .filter(func.DATE(Pedido.fecha_pedido) == date)
        .group_by(DetallePedido.producto_id, Producto.nombre)
    )

    rows = query.all()
    result = []
    for r in rows:
        producto_id = int(r[0])
        nombre = r[1]
        total_cantidad = int(r[2]) if r[2] is not None else 0
        total_revenue = float(r[3]) if r[3] is not None else 0.0
        result.append({
            "producto_id": producto_id,
            "producto_nombre": nombre,
            "total_cantidad": total_cantidad,
            "total_revenue": total_revenue,
        })

    return JSONResponse(content=result)