from sqlalchemy import Column, Integer, String, Numeric, DateTime
from .database import Base
from datetime import datetime

class KPIVente(Base):
    """Table des ventes mensuelles par restaurant SavoirManger"""
    __tablename__ = 'kpi_ventes'
    id          = Column(Integer, primary_key=True, index=True)
    mois        = Column(String(7), nullable=False)  # Format : '2026-01'
    ville       = Column(String(50), nullable=False)
    restaurant  = Column(String(100))
    ca_mensuel  = Column(Numeric(15, 2))  # FCFA
    nb_couverts = Column(Integer)
    created_at  = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Vente {self.mois} {self.ville} : {self.ca_mensuel} FCFA>'

class KPIBudget(Base):
    """Table de suivi budgétaire par module"""
    __tablename__ = 'kpi_budget'
    id               = Column(Integer, primary_key=True, index=True)
    module           = Column(String(50))  # 'ERP', 'CRM', 'Supply Chain', 'BI'
    budget_prevu     = Column(Numeric(15, 2))  # FCFA
    depenses_reelles = Column(Numeric(15, 2))  # FCFA
    mois             = Column(String(7))

class KPIEffectif(Base):
    """Table des effectifs et masse salariale par département"""
    __tablename__ = 'kpi_effectifs'
    id              = Column(Integer, primary_key=True, index=True)
    mois            = Column(String(7))
    departement     = Column(String(100))
    effectif        = Column(Integer)
    masse_salariale = Column(Numeric(15, 2))  # FCFA

class KPIStock(Base):
    """Table de suivi des stocks Supply Chain"""
    __tablename__ = 'kpi_stocks'
    id             = Column(Integer, primary_key=True, index=True)
    mois           = Column(String(7))
    produit        = Column(String(100))
    stock_initial  = Column(Numeric(10, 2))
    stock_final    = Column(Numeric(10, 2))
    taux_rupture   = Column(Numeric(5, 2))  # Pourcentage
