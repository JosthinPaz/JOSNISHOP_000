import sys
from db.session import SessionLocal
from models.usuarios import Usuario
import bcrypt


def usage():
    print("Usage: python set_security_answer.py <usuario_id> <nueva_respuesta>")


def main():
    if len(sys.argv) < 3:
        usage()
        return
    try:
        usuario_id = int(sys.argv[1])
    except ValueError:
        print("usuario_id must be an integer")
        return
    nueva_respuesta = sys.argv[2].strip()
    db = SessionLocal()
    try:
        usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
        if not usuario:
            print(f"Usuario with id {usuario_id} not found")
            return
        # Hashear la respuesta con bcrypt (igual que en registro)
        hashed = bcrypt.hashpw(nueva_respuesta.encode('utf-8'), bcrypt.gensalt())
        usuario.seguridad_respuesta = hashed.decode('utf-8')
        db.add(usuario)
        db.commit()
        print(f"✓ Updated seguridad_respuesta for usuario {usuario_id}")
        print(f"  Respuesta: '{nueva_respuesta}' (hasheada con bcrypt)")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()


if __name__ == '__main__':
    main()
