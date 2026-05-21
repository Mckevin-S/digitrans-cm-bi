param([string]$Target = "backend")

Write-Host "Creation de la structure dans : $Target/" -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "$Target/app/routers" | Out-Null
New-Item -ItemType Directory -Force -Path "$Target/app/etl"     | Out-Null
New-Item -ItemType Directory -Force -Path "$Target/tests"       | Out-Null

New-Item -ItemType File -Force -Path "$Target/app/__init__.py"         | Out-Null
New-Item -ItemType File -Force -Path "$Target/app/routers/__init__.py" | Out-Null
New-Item -ItemType File -Force -Path "$Target/app/etl/__init__.py"     | Out-Null
New-Item -ItemType File -Force -Path "$Target/tests/__init__.py"       | Out-Null

Set-Content -Encoding UTF8 "$Target/app/main.py" 'from fastapi import FastAPI
from app.routers import kpi, erp, crm
app = FastAPI(title="DIGITRANS-CM API")
app.include_router(kpi.router, prefix="/kpi", tags=["KPI"])
app.include_router(erp.router, prefix="/erp", tags=["ERP"])
app.include_router(crm.router, prefix="/crm", tags=["CRM"])
@app.get("/")
def root():
    return {"message": "DIGITRANS-CM API is running"}'

Set-Content -Encoding UTF8 "$Target/app/database.py" 'from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/digitrans")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()'

Set-Content -Encoding UTF8 "$Target/app/models.py" 'from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base
class KPI(Base):
    __tablename__ = "kpis"
    id          = Column(Integer, primary_key=True, index=True)
    nom         = Column(String,  nullable=False)
    valeur      = Column(Float,   nullable=False)
    cible       = Column(Float,   nullable=False)
    date_mesure = Column(Date,    nullable=False)
class Effectif(Base):
    __tablename__ = "effectifs"
    id        = Column(Integer, primary_key=True, index=True)
    module    = Column(String,  nullable=False)
    poste     = Column(String,  nullable=False)
    jh_prevus = Column(Float,   nullable=False)
    jh_reels  = Column(Float,   nullable=True)
class Restaurant(Base):
    __tablename__ = "restaurants"
    id    = Column(Integer, primary_key=True, index=True)
    ville = Column(String,  nullable=False)
    ca    = Column(Float,   nullable=False)
    mois  = Column(String,  nullable=False)'

Set-Content -Encoding UTF8 "$Target/app/routers/kpi.py" 'from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
router = APIRouter()
@router.get("/")
def list_kpis(db: Session = Depends(get_db)):
    return db.query(models.KPI).all()
@router.get("/{kpi_id}")
def get_kpi(kpi_id: int, db: Session = Depends(get_db)):
    return db.query(models.KPI).filter(models.KPI.id == kpi_id).first()'

Set-Content -Encoding UTF8 "$Target/app/routers/erp.py" 'from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
router = APIRouter()
@router.get("/effectifs")
def list_effectifs(db: Session = Depends(get_db)):
    return db.query(models.Effectif).all()'

Set-Content -Encoding UTF8 "$Target/app/routers/crm.py" 'from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
router = APIRouter()
@router.get("/restaurants")
def list_restaurants(db: Session = Depends(get_db)):
    return db.query(models.Restaurant).all()'

Set-Content -Encoding UTF8 "$Target/requirements.txt" 'fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
psycopg2-binary==2.9.9
python-dotenv==1.0.1
pytest==8.2.0
httpx==0.27.0'

Set-Content -Encoding UTF8 "$Target/.env" 'DATABASE_URL=postgresql://user:password@localhost:5432/digitrans
SECRET_KEY=change_me'

Set-Content -Encoding UTF8 "$Target/.gitignore" '.env
__pycache__/
*.pyc
.pytest_cache/
venv/'

Set-Content -Encoding UTF8 "$Target/Dockerfile" 'FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]'

Write-Host "Structure generee avec succes !" -ForegroundColor Green
Write-Host "Prochaines etapes :"
Write-Host "  cd $Target"
Write-Host "  pip install -r requirements.txt"
Write-Host "  uvicorn app.main:app --reload"
