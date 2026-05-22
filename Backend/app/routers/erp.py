from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter()

@router.get("/effectifs")
def list_effectifs(db: Session = Depends(get_db)):
    return db.query(models.Effectif).all()
