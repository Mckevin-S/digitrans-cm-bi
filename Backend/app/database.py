import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# URL de connexion à la base de données
# Format PostgreSQL : postgresql://utilisateur:motdepasse@hote:port/nom_base
# Si aucune variable n'est définie, utiliser SQLite local pour le développement.
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    DATABASE_URL = 'sqlite:///./digitrans_bi.db'
    connect_args = {'check_same_thread': False}
else:
    connect_args = {}

# Création du moteur SQLAlchemy
engine = create_engine(DATABASE_URL, connect_args=connect_args)

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
