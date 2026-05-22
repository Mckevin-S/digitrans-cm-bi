# ═══════════════════════════════════════════════════════════
# DIGITRANS-CM — Module BI — API FastAPI
# Point d'entrée principal de l'application
# ═══════════════════════════════════════════════════════════
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import kpi, erp, crm
from .etl.seed import seed_all_data

# Création automatique des tables si elles n'existent pas
Base.metadata.create_all(bind=engine)

# Chargement initial des données simulées pour le développement
seed_all_data()

# Initialisation de l'application FastAPI
app = FastAPI(
    title="DIGITRANS-CM — API Module BI",
    description="""
    API de tableaux de bord stratégiques pour AGROCAM S.A.
    Projet DIGITRANS-CM — Institut 3iAC EADL4 2025/2026
    """,
    version="1.0.0",
    contact={"name": "Équipe Module BI", "email": "bi@camtech.cm"}
)

# ── CORS : autoriser le frontend React à appeler cette API ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",    # React en développement local
        "http://localhost:80",
        "*"  # À restreindre en production
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# ── Inclusion des routeurs ───────────────────────────────────
app.include_router(kpi.router, prefix="/api/kpi", tags=["KPI Globaux"])
app.include_router(erp.router, prefix="/api/erp", tags=["Module ERP"])
app.include_router(crm.router, prefix="/api/crm", tags=["Module CRM"])

# ── Endpoint de santé (health check) ────────────────────────
@app.get('/')
def root():
    return {
        "message": "BI DIGITRANS-CM opérationnel",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get('/health')
def health_check():
    """Endpoint vérifié par le pipeline CI/CD et AWS"""
    return {"status": "healthy", "module": "BI", "projet": "DIGITRANS-CM"}

# ── Seed des données au démarrage (si la BDD est vide) ──────
@app.on_event('startup')
async def startup_event():
    seed_all_data()
    print('✅ Application BI DIGITRANS-CM démarrée')
    print('📊 Documentation API disponible : http://localhost:8000/docs')
