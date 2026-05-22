# ═══════════════════════════════════════════════════════════
# DIGITRANS-CM — Module BI — API FastAPI
# Point d'entrée principal de l'application
# ═══════════════════════════════════════════════════════════

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import kpi, erp, crm
from .etl.seed import seed_all_data

# ── VERSION APPLICATION ────────────────────────────────────
# Ajout sans impact sur le fonctionnement
APP_VERSION = "1.0.0"

# ── Création automatique des tables ────────────────────────
Base.metadata.create_all(bind=engine)

# ── Chargement initial des données simulées ────────────────
seed_all_data()

# ── Initialisation de l'application FastAPI ────────────────
app = FastAPI(
    title="DIGITRANS-CM — API Module BI",
    description="""
    API de tableaux de bord stratégiques pour AGROCAM S.A.
    Projet DIGITRANS-CM — Institut 3iAC EADL4 2025/2026
    """,
    version=APP_VERSION,
    contact={
        "name": "Équipe Module BI",
        "email": "bi@camtech.cm"
    }
)

# ── Middleware CORS ────────────────────────────────────────
# Autoriser le frontend React à communiquer avec l'API

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:80",
        "*"  # À sécuriser en production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Inclusion des routeurs ─────────────────────────────────

app.include_router(
    kpi.router,
    prefix="/api/kpi",
    tags=["KPI Globaux"]
)

app.include_router(
    erp.router,
    prefix="/api/erp",
    tags=["Module ERP"]
)

app.include_router(
    crm.router,
    prefix="/api/crm",
    tags=["Module CRM"]
)

# ── Route principale ───────────────────────────────────────

@app.get("/")
def root():
    return {
        "message": "BI DIGITRANS-CM opérationnel",
        "version": APP_VERSION,
        "docs": "/docs"
    }

# ── Endpoint Health Check ──────────────────────────────────

@app.get("/health")
def health_check():
    """
    Endpoint vérifié par le pipeline CI/CD et AWS
    """

    return {
        "status": "healthy",
        "module": "BI",
        "projet": "DIGITRANS-CM"
    }

# ── Événement de démarrage ─────────────────────────────────

@app.on_event("startup")
async def startup_event():

    # Seed automatique des données si nécessaire
    seed_all_data()

    print("✅ Application BI DIGITRANS-CM démarrée")
    print("📊 Documentation API disponible : http://localhost:8000/docs")
    print(f"🚀 Version active : {APP_VERSION}")