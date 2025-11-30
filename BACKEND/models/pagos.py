from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from db import Base
import enum

class TipoPago(str, enum.Enum):
    """Tipos de pago disponibles"""
    TARJETA_CREDITO = "tarjeta_credito"
    TARJETA_DEBITO = "tarjeta_debito"
    TRANSFERENCIA = "transferencia"
    PSE = "pse"
    PAYPAL = "paypal"
    EFECTIVO = "efectivo"

class TipoTarjeta(str, enum.Enum):
    """Tipos de tarjeta de crédito/débito"""
    VISA = "visa"
    MASTERCARD = "mastercard"
    AMEX = "amex"
    DINERS = "diners"
    UNKNOWN = "unknown"

class Pago(Base):
    __tablename__ = "pagos"
    id_pago = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    # Guardamos como VARCHAR para mantener compatibilidad con datos existentes
    tipo_pago = Column(String(50), default=TipoPago.TARJETA_CREDITO.value, nullable=True)
    
    # Para tarjetas
    nombre_tarjeta = Column(String(255), nullable=True)
    numero_tarjeta = Column(String(255), nullable=True)  # Cifrado
    tipo_tarjeta = Column(String(50), default=TipoTarjeta.UNKNOWN.value, nullable=True)
    fecha_expiracion = Column(String(255), nullable=True)  # Cifrado
    cvv = Column(String(255), nullable=True)  # Cifrado
    
    # Para otros métodos
    referencia_pago = Column(String(255), nullable=True)  # Para PSE, transferencia
    banco = Column(String(100), nullable=True)  # Banco de la transferencia
    
    monto = Column(Integer, nullable=True, default=0)  # En centavos
    estado = Column(String(50), default="completado", nullable=True)  # completado, fallido, pendiente
    fecha_pago = Column(TIMESTAMP, server_default=func.now())

    usuario = relationship("Usuario", back_populates="pagos")