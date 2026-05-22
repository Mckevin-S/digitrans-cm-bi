from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter()

@router.get("/effectifs", summary='Liste des effectifs par département')
def list_effectifs(db: Session = Depends(get_db)):
    results = db.query(models.KPIEffectif).order_by(models.KPIEffectif.mois, models.KPIEffectif.departement).all()
    return [
        {
            'mois': r.mois,
            'departement': r.departement,
            'effectif': r.effectif,
            'masse_salariale': float(r.masse_salariale)
        }
        for r in results
    ]
