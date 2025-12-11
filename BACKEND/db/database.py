from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# connection string
# represenat la base de datos a conectar
# dependiendo la base de datos que se use y el lenguaje de programación
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:admin@localhost:3315/josnishop"

# crea el objeto de conexion(permite conectarse a la base de datos)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
