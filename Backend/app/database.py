import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# URL de connexion à PostgreSQL
# Format : postgresql://utilisateur:motdepasse@hote:port/nom_base
DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'postgresql://bi_user:bi_pass@localhost:5433/digitrans_bi'  # valeur par défaut
)

# Création du moteur SQLAlchemy
engine = create_engine(DATABASE_URL)

# Factory de sessions de BDD
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles
Base = declarative_base()

# Dépendance FastAPI pour obtenir une session BDD
# Utilisée dans chaque endpoint avec : db: Session = Depends(get_db)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  # Toujours fermer la connexion après utilisation
