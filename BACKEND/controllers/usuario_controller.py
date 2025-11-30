# Importamos las herramientas principales de FastAPI y SQLAlchemy.
from fastapi import APIRouter, Depends, HTTPException, Request, Body, Query, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
import random
import string
# removed direct MIMEText use; sending moved to utils.email_utils
import bcrypt  # Librería para encriptar contraseñas.
import threading # Para enviar correos de forma asíncrona.
import time
from typing import Optional, List
from sqlalchemy import text
import os
import uuid
import datetime
import re
from dotenv import load_dotenv  # Para cargar variables de entorno

# Importamos las clases y funciones que necesitamos de otros archivos.
from db.session import SessionLocal
# DTOs de Pydantic para la validación de datos de usuarios.
from dtos.usuario_dto import UsuarioCreate, UsuarioOut, UsuarioUpdate, UsuarioLogin
# Modelo de SQLAlchemy que se mapea a la tabla 'usuarios'.
from models.usuarios import Usuario
from models.videos import Video
# Funciones de utilidad para enviar correos y gestionar tokens.
from utils.email_utils import send_registration_email, enviar_recuperacion_contrasena
from utils.jwt_utils import create_access_token, create_refresh_token, get_current_user

# Creamos un enrutador de FastAPI.
router = APIRouter(prefix="/usuarios", tags=["usuarios"])

# Cargar variables de entorno
load_dotenv()

# --- Variables de seguridad para el bloqueo de intentos ---
# Diccionario para almacenar intentos fallidos: {clave: [intentos, timestamp_bloqueo]}
failed_attempts = {}
MAX_ATTEMPTS = int(os.getenv("MAX_LOGIN_ATTEMPTS", "5"))
BLOCK_TIME = int(os.getenv("LOGIN_ATTEMPT_TIMEOUT", "300"))

# --- Dependencia de la base de datos ---
# Función que gestiona la sesión de la base de datos.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Funciones de seguridad y utilidad ---

# Esta función verifica si un usuario está bloqueado por demasiados intentos de login fallidos.
def is_blocked(key):
    if key in failed_attempts:
        attempts, block_until = failed_attempts[key]
        # Si hay un tiempo de bloqueo y el tiempo actual es menor al de bloqueo, está bloqueado.
        if block_until and time.time() < block_until:
            return True
    return False

# Clase para la validación de la petición de recuperación de contraseña.
class RecuperarRequest(BaseModel):
    email: str

# Email sending for password recovery is handled in `utils.email_utils.enviar_recuperacion_contrasena`


# --- Endpoints de la API ---

### 1. Crear un usuario (POST)
# Este endpoint es un CRUD básico, no encripta la contraseña, lo cual es inseguro.
# Se incluye para mostrar un ejemplo simple, pero el endpoint `/register` es el correcto.
@router.post("/", response_model=UsuarioOut)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = Usuario(**usuario.dict())
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

### 2. Listar todos los usuarios (GET)
@router.get("/", response_model=list[UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

### 3. Obtener un usuario por ID (GET)
@router.get("/{usuario_id}", response_model=UsuarioOut)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

### 4. Actualizar un usuario (PUT)
@router.put("/{usuario_id}", response_model=UsuarioOut)
def actualizar_usuario(
    usuario_id: int, datos: UsuarioUpdate, db: Session = Depends(get_db)
):
    usuario = db.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    update_data = datos.dict(exclude_unset=True)
    # Si se envía una nueva contraseña, la encripta antes de guardar.
    if "contraseña" in update_data and update_data["contraseña"]:
        hashed = bcrypt.hashpw(update_data["contraseña"].encode('utf-8'), bcrypt.gensalt())
        update_data["contraseña"] = hashed.decode('utf-8')
    for key, value in update_data.items():
        setattr(usuario, key, value)
    db.commit()
    db.refresh(usuario)
    return usuario

### 5. Eliminar un usuario (DELETE)
@router.delete("/{usuario_id}")
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    # Elimina datos relacionados (agrega más si tienes otras tablas)
    db.execute(text("DELETE FROM pedidos WHERE cliente_id = :usuario_id"), {"usuario_id": usuario_id})
    # db.execute(text("DELETE FROM resenas WHERE usuario_id = :usuario_id"), {"usuario_id": usuario_id})
    # db.execute(text("DELETE FROM pagos WHERE usuario_id = :usuario_id"), {"usuario_id": usuario_id})
    db.delete(usuario)
    db.commit()
    return {"message": "Usuario eliminado"}

### 6. Registro de nuevo usuario (POST)
@router.post("/register")
def register(user: UsuarioCreate):
    db = SessionLocal()
    # Verifica si el correo ya existe.
    db_user = db.query(Usuario).filter(Usuario.correo == user.correo).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    # Encriptar la contraseña antes de guardar con `bcrypt`.
    hashed = bcrypt.hashpw(user.contraseña.encode('utf-8'), bcrypt.gensalt())
    nuevo_usuario = Usuario(**user.dict())
    nuevo_usuario.contraseña = hashed.decode('utf-8')
    nuevo_usuario.estado = 1  # Activo por defecto
    # Hashear la respuesta de seguridad con bcrypt (igual que la contraseña)
    if getattr(user, 'seguridad_respuesta', None):
        hashed_resp = bcrypt.hashpw(user.seguridad_respuesta.strip().encode('utf-8'), bcrypt.gensalt())
        nuevo_usuario.seguridad_respuesta = hashed_resp.decode('utf-8')
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    
    # Enviar correo de notificación en un hilo aparte para no bloquear la respuesta.
    threading.Thread(target=send_registration_email, args=(user.correo,)).start()
    
    return {"msg": "Usuario creado", "usuario": nuevo_usuario.id_usuario}


@router.post("/{usuario_id}/verificar-seguridad")
def verificar_seguridad(usuario_id: int, payload: dict):
    db = SessionLocal()
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    respuesta = payload.get("respuesta", "").strip()
    if not usuario.seguridad_respuesta:
        raise HTTPException(status_code=400, detail="No hay pregunta de seguridad configurada")
    
    # Verificar con bcrypt (igual que en login)
    # La respuesta se envía en texto plano, el hash está en la BD
    if not bcrypt.checkpw(respuesta.encode('utf-8'), usuario.seguridad_respuesta.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Respuesta de seguridad incorrecta")
    
    return {"msg": "Verificación exitosa", "valid": True}

### 7. Login de usuario (POST)
@router.post("/login")
def login(user: UsuarioLogin, request: Request):
    key = user.correo
    if is_blocked(key):
        raise HTTPException(status_code=429, detail="Demasiados intentos fallidos. Intenta de nuevo más tarde en 5 minutos.")

    db = SessionLocal()
    db_user = db.query(Usuario).filter(Usuario.correo == user.correo).first()
    if not db_user or not bcrypt.checkpw(user.contraseña.encode('utf-8'), db_user.contraseña.encode('utf-8')):
        attempts, block_until = failed_attempts.get(key, (0, None))
        attempts += 1
        if attempts >= MAX_ATTEMPTS:
            failed_attempts[key] = (attempts, time.time() + BLOCK_TIME)
        else:
            failed_attempts[key] = (attempts, None)
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    failed_attempts.pop(key, None)
    access_token = create_access_token({"sub": db_user.correo, "id": db_user.id_usuario})
    refresh_token = create_refresh_token({"sub": db_user.correo, "id": db_user.id_usuario})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "id_usuario": db_user.id_usuario,
        "nombre": db_user.nombre,
        "correo": db_user.correo,
        "rol": db_user.rol.nombre,
        "rol_id": db_user.rol_id,
        # Coerce boolean/None to int/None to match DTO expectations (0/1/null)
        "estado": int(db_user.estado) if db_user.estado is not None else None
    }

### 8. Recuperar contraseña (POST)
@router.post("/recuperar-contrasena")
def recuperar_contrasena(request: RecuperarRequest):
    db = SessionLocal()
    usuario = db.query(Usuario).filter(Usuario.correo == request.email).first()
    if not usuario:
        # Por seguridad, no se debe especificar si el correo existe o no.
        # Se envía una respuesta genérica para evitar enumerar usuarios.
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Genera una contraseña aleatoria de 8 caracteres.
    nueva_contrasena = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
    # Encripta la nueva contraseña antes de guardarla.
    hashed = bcrypt.hashpw(nueva_contrasena.encode('utf-8'), bcrypt.gensalt())
    usuario.contraseña = hashed.decode('utf-8')
    db.commit()
    db.close()
    
    # Envía el correo con la nueva contraseña temporal (usa plantilla central)
    # enviar_recuperacion_contrasena hace login con las credenciales en env
    enviar_recuperacion_contrasena(request.email, nueva_contrasena)
    
    return {"msg": "Nueva contraseña enviada al correo"}


### 9. Refrescar el token de acceso (POST)
@router.post("/refresh")
def refresh_token(refresh_token: str = Body(...)):
    from utils.jwt_utils import create_access_token, verify_token
    # Verifica si el refresh token es válido.
    payload = verify_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Refresh token inválido o expirado")
    
    # Crea un nuevo token de acceso a partir de los datos del payload.
    access_token = create_access_token({"sub": payload["sub"], "id": payload["id"]})
    return {"access_token": access_token, "token_type": "bearer"}

### 10. Obtener perfil de usuario (GET, protegido)
# Este endpoint requiere un token JWT válido para acceder.
@router.get("/perfil")
def perfil_usuario(current_user: dict = Depends(get_current_user)):
    # `get_current_user` verifica el token y devuelve el payload del usuario.
    # Si el token no es válido, `get_current_user` lanza una excepción HTTP 401.
    return {"msg": f"Hola, {current_user['sub']}"}

# --- Endpoint de Reportes Parametrizados para Usuarios ---
@router.get("/reportes", response_model=List[UsuarioOut])
def reportes_parametrizados_usuarios(
    nombre: Optional[str] = Query(None),
    correo: Optional[str] = Query(None),
    rol: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Usuario)
    if nombre:
        query = query.filter(Usuario.nombre.ilike(f"%{nombre}%"))
    if correo:
        query = query.filter(Usuario.correo.ilike(f"%{correo}%"))
    if rol:
        query = query.filter(Usuario.rol.has(nombre=rol))
    return query.all()
# Comentario: Endpoint de reportes parametrizados para usuarios.

# --- Endpoint de Carga Masiva de Usuarios ---
@router.post("/bulk", response_model=List[UsuarioOut])
def carga_masiva_usuarios(
    usuarios: List[UsuarioCreate],
    db: Session = Depends(get_db)
):
    nuevos_usuarios = []
    for u in usuarios:
        hashed = bcrypt.hashpw(u.contraseña.encode('utf-8'), bcrypt.gensalt())
        usuario = Usuario(**u.dict())
        usuario.contraseña = hashed.decode('utf-8')
        nuevos_usuarios.append(usuario)
    db.add_all(nuevos_usuarios)
    db.commit()
    for u in nuevos_usuarios:
        db.refresh(u)
    return nuevos_usuarios
# Comentario: Endpoint para carga masiva de usuarios.

blacklist = set()

def logout(token):
    blacklist.add(token)
    return {"msg": "Sesión cerrada"}

### 11. Desactivar un usuario (PUT)
@router.put("/{usuario_id}/desactivar")
def desactivar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.estado = 0  # O False si es booleano
    db.commit()
    return {"message": "Usuario desactivado"}

### 12. Activar un usuario (PUT)
@router.put("/{usuario_id}/activar")
def activar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.estado = 1  # O True si es booleano
    db.commit()
    return {"message": "Usuario activado"}


### 13. Subir foto de perfil (POST)
@router.post("/{usuario_id}/upload-perfil")
async def upload_foto_perfil(
    usuario_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Permite que un usuario suba o actualice su foto de perfil"""
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if not file:
        raise HTTPException(status_code=400, detail="No se proporciono archivo")
    
    # Validar que sea imagen
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes (JPEG, PNG, GIF, WebP)")
    
    try:
        # Directorio de guardado
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        uploads_dir = os.path.join(base_dir, 'static', 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        
        # Sanitizar nombre de archivo
        def _sanitize_filename(name: str) -> str:
            name = name.replace('\\', '_').replace('/', '_')
            name = re.sub(r'[<>:\\"/\\|?*]', '_', name)
            name = re.sub(r'\s+', '_', name).strip('_')
            return name
        
        safe_name = _sanitize_filename(file.filename or 'profile')
        filename = f"{uuid.uuid4().hex}__{safe_name}"
        save_path = os.path.join(uploads_dir, filename)
        
        # Guardar archivo
        contents = await file.read()
        with open(save_path, 'wb') as f:
            f.write(contents)
        
        url = f"/static/uploads/{filename}"
        
        # Eliminar foto anterior si existe
        old_foto = db.query(Video).filter(
            Video.usuario_id == usuario_id,
            Video.tipo == 'perfil'
        ).first()
        if old_foto:
            db.delete(old_foto)
            db.commit()
        
        # Guardar nuevo registro de foto en tabla videos
        db_foto = Video(
            usuario_id=usuario_id,
            tipo='perfil',
            url=url,
            fecha_subida=datetime.datetime.utcnow()
        )
        db.add(db_foto)
        db.commit()
        db.refresh(db_foto)
        
        return {
            "success": True,
            "message": "Foto de perfil actualizada correctamente",
            "foto_id": db_foto.id,
            "url": url
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al subir archivo: {str(e)}")