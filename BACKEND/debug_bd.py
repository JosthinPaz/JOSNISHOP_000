#!/usr/bin/env python
"""
Script para inspeccionar la BD y debuguear el problema de bcrypt.
Muestra qué está guardado para usuario 54 y prueba la lógica de verificación.
"""
import sys
sys.path.insert(0, '/e:/VERSIONES/JOSNISHOP-oficial-FINAL/BACKEND')

import bcrypt
from db.session import SessionLocal
from models.usuarios import Usuario

print("=" * 80)
print("INSPECCIÓN DE BD Y PRUEBA DE BCRYPT")
print("=" * 80)

# Conectar a BD
db = SessionLocal()
try:
    usuario = db.query(Usuario).filter(Usuario.id_usuario == 54).first()
    
    if not usuario:
        print("\n❌ ERROR: Usuario 54 no encontrado en la BD")
        sys.exit(1)
    
    print(f"\n✓ Usuario encontrado:")
    print(f"  ID: {usuario.id_usuario}")
    print(f"  Correo: {usuario.correo}")
    print(f"  Nombre: {usuario.nombre}")
    print(f"  Pregunta de seguridad: {usuario.seguridad_pregunta}")
    print(f"  Respuesta en BD (raw): {repr(usuario.seguridad_respuesta)}")
    print(f"  Longitud: {len(usuario.seguridad_respuesta) if usuario.seguridad_respuesta else 'NULL'}")
    
    if not usuario.seguridad_respuesta:
        print("\n❌ ERROR: No hay respuesta de seguridad guardada")
        sys.exit(1)
    
    # Probar bcrypt
    print("\n" + "=" * 80)
    print("PRUEBA DE BCRYPT")
    print("=" * 80)
    
    respuesta_a_probar = "azul"
    print(f"\nIntentando verificar respuesta: '{respuesta_a_probar}'")
    
    # Intentar verificación exactamente como lo hace el backend
    try:
        hashed_bytes = usuario.seguridad_respuesta.encode('utf-8')
        respuesta_bytes = respuesta_a_probar.encode('utf-8')
        
        print(f"  Hash en BD (bytes): {repr(hashed_bytes[:30])}...") 
        print(f"  Respuesta (bytes): {respuesta_bytes}")
        
        ok = bcrypt.checkpw(respuesta_bytes, hashed_bytes)
        print(f"\n✓ bcrypt.checkpw RESULT: {ok}")
        
        if ok:
            print("  ✅ LA VERIFICACIÓN FUNCIONA CORRECTAMENTE")
        else:
            print("  ❌ LA VERIFICACIÓN FALLA - El hash o la respuesta no coinciden")
            
            # Intentar probar con otras variantes
            print("\n  Probando variantes...")
            
            # Variante: trimmed
            respuesta_trimmed = respuesta_a_probar.strip()
            ok_trimmed = bcrypt.checkpw(respuesta_trimmed.encode('utf-8'), hashed_bytes)
            print(f"    Con .strip(): {ok_trimmed}")
            
            # Variante: mayúscula
            respuesta_upper = respuesta_a_probar.upper()
            try:
                ok_upper = bcrypt.checkpw(respuesta_upper.encode('utf-8'), hashed_bytes)
                print(f"    Con .upper(): {ok_upper}")
            except:
                print(f"    Con .upper(): Error")
            
            # Variante: minúscula
            respuesta_lower = respuesta_a_probar.lower()
            try:
                ok_lower = bcrypt.checkpw(respuesta_lower.encode('utf-8'), hashed_bytes)
                print(f"    Con .lower(): {ok_lower}")
            except:
                print(f"    Con .lower(): Error")
                
    except Exception as e:
        print(f"\n❌ ERROR en bcrypt.checkpw: {type(e).__name__}: {str(e)}")
        print(f"  Esto usualmente significa que el hash en la BD es inválido")
        print(f"  Hash en BD: {usuario.seguridad_respuesta}")
        
    # Probar creando un nuevo hash para comparar
    print("\n" + "=" * 80)
    print("PRUEBA: GENERAR NUEVO HASH E VERIFICAR")
    print("=" * 80)
    
    print(f"\nGenerando hash nuevo de 'azul'...")
    nuevo_hash = bcrypt.hashpw(b'azul', bcrypt.gensalt())
    print(f"Nuevo hash: {nuevo_hash}")
    
    ok_nuevo = bcrypt.checkpw(b'azul', nuevo_hash)
    print(f"Verificación con nuevo hash: {ok_nuevo}")
    
    if ok_nuevo:
        print("✅ El proceso bcrypt funciona correctamente")
        print(f"\nPara ARREGLAR el usuario 54, ejecuta:")
        print(f"  python set_security_answer.py 54 azul")
    
finally:
    db.close()

print("\n" + "=" * 80)
