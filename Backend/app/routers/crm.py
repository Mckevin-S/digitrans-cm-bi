from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter()

@router.get("/restaurants", summary='Liste des restaurants SavoirManger')
def list_restaurants(db: Session = Depends(get_db)):
    results = (
        db.query(models.KPIVente.ville, models.KPIVente.restaurant)
          .distinct()
          .order_by(models.KPIVente.ville, models.KPIVente.restaurant)
          .all()
    )
    return [
        {
            'ville': r.ville,
            'restaurant': r.restaurant,
        }
        for r in results
    ]
