"""
Script de diagnóstico para probar bcrypt con la respuesta 'azul'
y verificar que el flujo funciona correctamente.
"""
import bcrypt
from db.session import SessionLocal
from models.usuarios import Usuario

# 1. Probar bcrypt localmente
print("=" * 60)
print("TEST 1: Bcrypt con texto plano 'azul'")
print("=" * 60)

respuesta_original = "azul"
print(f"Respuesta original: '{respuesta_original}'")

# Simular lo que hace el backend en el registro
hashed = bcrypt.hashpw(respuesta_original.encode('utf-8'), bcrypt.gensalt())
hashed_str = hashed.decode('utf-8')
print(f"Hash bcrypt (registro): {hashed_str}")

# Simular lo que hace el backend en la verificación
respuesta_enviada = "azul"  # Lo que envía el frontend
try:
    ok = bcrypt.checkpw(respuesta_enviada.encode('utf-8'), hashed_str.encode('utf-8'))
    print(f"Verificación con '{respuesta_enviada}': {ok}")
except Exception as e:
    print(f"ERROR en verificación: {e}")

# 2. Revisar lo que hay en la BD para usuario 54
print("\n" + "=" * 60)
print("TEST 2: Revisar BD para usuario 54")
print("=" * 60)

db = SessionLocal()
try:
    usuario = db.query(Usuario).filter(Usuario.id_usuario == 54).first()
    if usuario:
        print(f"Usuario encontrado: {usuario.correo}")
        print(f"seguridad_pregunta: {usuario.seguridad_pregunta}")
        print(f"seguridad_respuesta (BD): {usuario.seguridad_respuesta}")
        
        # Intentar verificar con "azul"
        if usuario.seguridad_respuesta:
            respuesta_test = "azul"
            try:
                ok = bcrypt.checkpw(respuesta_test.encode('utf-8'), usuario.seguridad_respuesta.encode('utf-8'))
                print(f"\nVerificación con '{respuesta_test}': {ok}")
            except Exception as e:
                print(f"\nERROR al verificar: {e}")
    else:
        print("Usuario 54 no encontrado")
finally:
    db.close()

# 3. Intentar registrar un usuario de prueba con respuesta "azul"
print("\n" + "=" * 60)
print("TEST 3: Registrar usuario de prueba con 'azul'")
print("=" * 60)

from dtos.usuario_dto import UsuarioCreate

# Este es un test adicional: ver si el flujo completo funciona
# (Se omite para evitar crear usuarios duplicados; ejecutar manualmente si es necesario)
print("(Omitido para no crear duplicados; ver registro manual si es necesario)")
