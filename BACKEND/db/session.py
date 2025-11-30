from sqlalchemy.orm import sessionmaker

from db import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
