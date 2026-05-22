import random
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import KPIVente, KPIBudget, KPIEffectif, KPIStock

# ── Données de référence AGROCAM S.A. ───────────────────────
VILLES = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Ngaoundéré']
MOIS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05']
RESTAURANTS = {
    'Douala':     ['SavoirManger Bonanjo', 'SavoirManger Akwa', 'SavoirManger Bassa'],
    'Yaoundé':   ['SavoirManger Bastos', 'SavoirManger Centre Ville'],
    'Bafoussam':  ['SavoirManger Bafoussam'],
    'Garoua':     ['SavoirManger Nord'],
    'Ngaoundéré': ['SavoirManger Adamaoua'],
}
CA_BASE = {'Douala': 8500000, 'Yaoundé': 6200000,
           'Bafoussam': 3800000, 'Garoua': 2900000, 'Ngaoundéré': 2500000}

def seed_ventes(db: Session):
    if db.query(KPIVente).count() > 0: return  # Éviter double seed
    for mois in MOIS:
        for ville, restos in RESTAURANTS.items():
            for resto in restos:
                ca = CA_BASE[ville] + random.randint(-1000000, 1500000)
                db.add(KPIVente(mois=mois, ville=ville, restaurant=resto,
                    ca_mensuel=max(ca, 1500000),
                    nb_couverts=random.randint(500, 3000)))
    db.commit()
    print(f'  ✅ {db.query(KPIVente).count()} enregistrements ventes créés')

def seed_budget(db: Session):
    if db.query(KPIBudget).count() > 0: return
    # Données officielles du sujet d'examen
    budgets = [
        ('ERP',          132000000, 138500000),
        ('CRM',           96000000,  91200000),
        ('Supply Chain', 120000000, 127800000),
        ('BI',           132000000, 124500000),
    ]
    for module, prevu, reel in budgets:
        for mois in MOIS:
            db.add(KPIBudget(module=module, mois=mois,
                budget_prevu=prevu/len(MOIS),
                depenses_reelles=reel/len(MOIS)))
    db.commit()
    print(f'  ✅ Budget DIGITRANS-CM chargé')

def seed_effectifs(db: Session):
    if db.query(KPIEffectif).count() > 0: return
    depts = ['Transformation Cacao', 'Distribution', 'SavoirManger',
             'Informatique', 'Finance', 'RH', 'Logistique']
    for mois in MOIS:
        for dept in depts:
            eff = random.randint(60, 300)
            db.add(KPIEffectif(mois=mois, departement=dept,
                effectif=eff,
                masse_salariale=eff * random.randint(200000, 500000)))
    db.commit()
    print(f'  ✅ {db.query(KPIEffectif).count()} enregistrements effectifs créés')

def seed_all_data():
    print('🌱 Chargement des données simulées AGROCAM...')
    db = SessionLocal()
    try:
        seed_ventes(db)
        seed_budget(db)
        seed_effectifs(db)
        print('🎉 Base de données DIGITRANS-CM prête !')
    finally:
        db.close()
