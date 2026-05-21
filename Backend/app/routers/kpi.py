from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import KPIVente, KPIBudget, KPIEffectif, KPIStock

router = APIRouter()

# ─────────────────────────────────────────────────────────────
# GET /api/kpi/resume
# Résumé exécutif pour le dashboard principal (DG AGROCAM)
# ─────────────────────────────────────────────────────────────
@router.get('/resume', summary='Résumé KPI pour la direction AGROCAM')
def get_resume(db: Session = Depends(get_db)):
    ca_total = db.query(func.sum(KPIVente.ca_mensuel)).scalar() or 0
    effectif = db.query(func.sum(KPIEffectif.effectif)).filter(
        KPIEffectif.mois == '2026-05').scalar() or 0
    bud_prevu = db.query(func.sum(KPIBudget.budget_prevu)).scalar() or 1
    bud_reel  = db.query(func.sum(KPIBudget.depenses_reelles)).scalar() or 0
    return {
        "ca_total_fcfa":            float(ca_total),
        "effectif_total":           int(effectif),
        "budget_prevu_fcfa":        float(bud_prevu),
        "depenses_reelles_fcfa":    float(bud_reel),
        "ecart_budget_fcfa":        float(bud_reel - bud_prevu),
        "taux_consommation_pct":    round(float(bud_reel) / float(bud_prevu) * 100, 2),
        "statut":                   "SOUS_BUDGET" if bud_reel < bud_prevu else "DEPASSEMENT"
    }

# ─────────────────────────────────────────────────────────────
# GET /api/kpi/ca-par-ville
# CA SavoirManger par ville (pour Bar Chart)
# ─────────────────────────────────────────────────────────────
@router.get('/ca-par-ville', summary='CA mensuel par ville SavoirManger')
def get_ca_par_ville(db: Session = Depends(get_db)):
    results = db.query(
        KPIVente.ville,
        func.sum(KPIVente.ca_mensuel).label('ca'),
        func.sum(KPIVente.nb_couverts).label('couverts')
    ).group_by(KPIVente.ville).order_by(func.sum(KPIVente.ca_mensuel).desc()).all()
    return [{'ville': r.ville, 'ca': float(r.ca), 'couverts': r.couverts} for r in results]

# ─────────────────────────────────────────────────────────────
# GET /api/kpi/evolution-mensuelle
# Évolution CA mois par mois (pour Line Chart)
# ─────────────────────────────────────────────────────────────
@router.get('/evolution-mensuelle', summary='Evolution CA mensuelle Jan-Mai 2026')
def get_evolution(db: Session = Depends(get_db)):
    results = db.query(
        KPIVente.mois,
        func.sum(KPIVente.ca_mensuel).label('ca')
    ).group_by(KPIVente.mois).order_by(KPIVente.mois).all()
    return [{'mois': r.mois, 'ca': float(r.ca)} for r in results]

# ─────────────────────────────────────────────────────────────
# GET /api/kpi/budget-modules
# Suivi budgétaire des 4 modules DIGITRANS-CM
# ─────────────────────────────────────────────────────────────
@router.get('/budget-modules', summary='Budget prévu vs réel par module')
def get_budget(db: Session = Depends(get_db)):
    results = db.query(
        KPIBudget.module,
        func.sum(KPIBudget.budget_prevu).label('prevu'),
        func.sum(KPIBudget.depenses_reelles).label('reel')
    ).group_by(KPIBudget.module).all()
    return [{
        'module': r.module,
        'prevu':  float(r.prevu),
        'reel':   float(r.reel),
        'ecart':  float(r.reel - r.prevu),
        'statut': 'SOUS_BUDGET' if r.reel <= r.prevu else 'DEPASSEMENT'
    } for r in results]
