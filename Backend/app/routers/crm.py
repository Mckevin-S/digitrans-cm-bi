from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter()

@router.get("/restaurants")
def list_restaurants(db: Session = Depends(get_db)):
    return db.query(models.Restaurant).all()
