from typing import Optional

from pydantic import BaseModel


class UsuarioBase(BaseModel):
    nombre: str
    correo: str
    contraseña: str
    rol_id: int
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    fecha_nacimiento: Optional[str] = None
    seguridad_pregunta: Optional[str] = None
    seguridad_respuesta: Optional[str] = None


class UsuarioCreate(UsuarioBase):
    pass


class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[str] = None
    contraseña: Optional[str] = None
    rol_id: Optional[int] = None



class UsuarioOut(UsuarioBase):
    id_usuario: int
    estado: Optional[int] = None  # 0 = inactivo, 1 = activo (nullable to match DB)

    class Config:
        orm_mode = True


class UsuarioLogin(BaseModel):
    correo: str
    contraseña: str 
    

