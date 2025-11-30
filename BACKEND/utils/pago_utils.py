"""
Utilidades para procesar pagos y detectar tipos de tarjeta
"""

import re
from typing import Dict, Tuple
from enum import Enum

class TipoTarjeta(str, Enum):
    VISA = "visa"
    MASTERCARD = "mastercard"
    AMEX = "amex"
    DINERS = "diners"
    UNKNOWN = "unknown"

def detectar_tipo_tarjeta(numero_tarjeta: str) -> TipoTarjeta:
    """
    Detecta automáticamente el tipo de tarjeta basado en el número.
    
    Patrones de tarjetas:
    - VISA: Comienza con 4, 13 o 19 dígitos
    - Mastercard: Comienza con 51-55 o 2221-2720, 16 dígitos
    - AMEX: Comienza con 34 o 37, 15 dígitos
    - DINERS: Comienza con 36, 38, 300-305, 14 dígitos
    """
    # Remover espacios y guiones
    numero_limpio = numero_tarjeta.replace(" ", "").replace("-", "")
    
    if not numero_limpio.isdigit():
        return TipoTarjeta.UNKNOWN
    
    # VISA: comienza con 4
    if numero_limpio.startswith('4') and len(numero_limpio) in [13, 16, 19]:
        return TipoTarjeta.VISA
    
    # Mastercard: comienza con 51-55 o 2221-2720
    if len(numero_limpio) == 16:
        if numero_limpio.startswith(('51', '52', '53', '54', '55')):
            return TipoTarjeta.MASTERCARD
        # Rango 2221-2720
        try:
            primeros_cuatro = int(numero_limpio[:4])
            if 2221 <= primeros_cuatro <= 2720:
                return TipoTarjeta.MASTERCARD
        except ValueError:
            pass
    
    # AMEX: comienza con 34 o 37, 15 dígitos
    if numero_limpio.startswith(('34', '37')) and len(numero_limpio) == 15:
        return TipoTarjeta.AMEX
    
    # DINERS: comienza con 36, 38, 300-305, 14 dígitos
    if len(numero_limpio) == 14:
        if numero_limpio.startswith(('36', '38')):
            return TipoTarjeta.DINERS
        try:
            primeros_tres = int(numero_limpio[:3])
            if 300 <= primeros_tres <= 305:
                return TipoTarjeta.DINERS
        except ValueError:
            pass
    
    return TipoTarjeta.UNKNOWN

def validar_numero_tarjeta(numero_tarjeta: str) -> Tuple[bool, str]:
    """
    Valida un número de tarjeta usando el algoritmo de Luhn.
    
    Retorna: (es_valido, mensaje_error)
    """
    numero_limpio = numero_tarjeta.replace(" ", "").replace("-", "")
    
    # Verificar que solo contenga dígitos
    if not numero_limpio.isdigit():
        return False, "El número de tarjeta solo debe contener dígitos"
    
    # Verificar longitud (13-19 dígitos)
    if not (13 <= len(numero_limpio) <= 19):
        return False, f"El número de tarjeta debe tener entre 13 y 19 dígitos (tiene {len(numero_limpio)})"
    
    # Algoritmo de Luhn
    def luhn_check(numero: str) -> bool:
        digits = [int(d) for d in numero]
        # Doblar cada segundo dígito de derecha a izquierda
        for i in range(len(digits) - 2, -1, -2):
            digits[i] *= 2
            if digits[i] > 9:
                digits[i] -= 9
        # Suma total
        return sum(digits) % 10 == 0
    
    if not luhn_check(numero_limpio):
        return False, "Número de tarjeta inválido"
    
    return True, ""

def validar_fecha_expiracion(fecha: str) -> Tuple[bool, str]:
    """
    Valida una fecha de expiración en formato MM/YY o MM/YYYY.
    
    Retorna: (es_valida, mensaje_error)
    """
    fecha_limpia = fecha.replace(" ", "").replace("/", "")
    
    if len(fecha_limpia) not in [4, 5]:
        return False, "Formato de fecha inválido. Use MM/YY o MM/YYYY"
    
    try:
        if "/" not in fecha:
            return False, "Use formato MM/YY o MM/YYYY"
        
        partes = fecha.split("/")
        if len(partes) != 2:
            return False, "Use formato MM/YY o MM/YYYY"
        
        mes = int(partes[0])
        año = int(partes[1])
        
        if not (1 <= mes <= 12):
            return False, "El mes debe estar entre 01 y 12"
        
        # Si año es de 2 dígitos, asumir 20XX
        if año < 100:
            año += 2000
        
        # Aquí podrías agregar validación de fecha futura si lo requieres
        
        return True, ""
    except ValueError:
        return False, "Formato de fecha inválido"

def validar_cvv(cvv: str, tipo_tarjeta: TipoTarjeta = TipoTarjeta.UNKNOWN) -> Tuple[bool, str]:
    """
    Valida un CVV (3-4 dígitos).
    
    - AMEX: 4 dígitos
    - Otros: 3 dígitos
    """
    cvv_limpio = cvv.replace(" ", "")
    
    if not cvv_limpio.isdigit():
        return False, "El CVV solo debe contener dígitos"
    
    # AMEX tiene 4 dígitos
    if tipo_tarjeta == TipoTarjeta.AMEX:
        if len(cvv_limpio) != 4:
            return False, "AMEX requiere 4 dígitos en el CVV"
    else:
        # Otros tipos: 3-4 dígitos
        if not (3 <= len(cvv_limpio) <= 4):
            return False, "El CVV debe tener 3 o 4 dígitos"
    
    return True, ""

def enmascarar_numero_tarjeta(numero_tarjeta: str) -> str:
    """
    Enmascara el número de tarjeta para mostrar solo los últimos 4 dígitos.
    Ejemplo: 4532 1488 0343 6467 → **** **** **** 6467
    """
    numero_limpio = numero_tarjeta.replace(" ", "").replace("-", "")
    if len(numero_limpio) >= 4:
        # Mostrar solo los últimos 4 dígitos
        ultimos_cuatro = numero_limpio[-4:]
        return f"**** **** **** {ultimos_cuatro}"
    return "****"

def formatear_numero_tarjeta(numero_tarjeta: str, tipo: TipoTarjeta = None) -> str:
    """
    Formatea un número de tarjeta para mostrar de forma legible.
    Ejemplo: 4532148803436467 → 4532 1488 0343 6467
    """
    numero_limpio = numero_tarjeta.replace(" ", "").replace("-", "")
    
    if not numero_limpio.isdigit():
        return numero_tarjeta
    
    # AMEX: 4 4 5
    if tipo == TipoTarjeta.AMEX or (not tipo and len(numero_limpio) == 15):
        return f"{numero_limpio[:4]} {numero_limpio[4:10]} {numero_limpio[10:]}"
    
    # Otros: 4 4 4 4
    return f"{numero_limpio[:4]} {numero_limpio[4:8]} {numero_limpio[8:12]} {numero_limpio[12:]}"

def obtener_nombre_tipo_tarjeta(tipo: TipoTarjeta) -> str:
    """Obtiene el nombre legible del tipo de tarjeta"""
    nombres = {
        TipoTarjeta.VISA: "Visa",
        TipoTarjeta.MASTERCARD: "Mastercard",
        TipoTarjeta.AMEX: "American Express",
        TipoTarjeta.DINERS: "Diners Club",
        TipoTarjeta.UNKNOWN: "Tarjeta Desconocida"
    }
    return nombres.get(tipo, "Tarjeta")
