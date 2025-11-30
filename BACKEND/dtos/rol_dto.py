from typing import Optional

from pydantic import BaseModel


class RolBase(BaseModel):
    nombre: str
    estado: Optional[bool] = True


class RolCreate(RolBase):
    pass


class RolUpdate(RolBase):
    pass


class RolOut(RolBase):
    id_rol: int

    class Config:
        from_attributes = True
