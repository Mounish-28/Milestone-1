from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Vendor
from app.schemas import VendorCreate, VendorResponse, VendorUpdate

router = APIRouter(
    prefix="/vendors",
    tags=["Vendors"]
)


# ---------------------------------------------------------
# 1. REGISTER A NEW VENDOR
# ---------------------------------------------------------
@router.post("/register", response_model=VendorResponse)
def register_vendor(
    vendor: VendorCreate,
    db: Session = Depends(get_db)
):
    existing_vendor = db.query(Vendor).filter(
        Vendor.email == vendor.email
    ).first()

    if existing_vendor:
        raise HTTPException(
            status_code=400,
            detail="Vendor with this email already exists"
        )

    new_vendor = Vendor(
        name=vendor.name,
        email=vendor.email
    )

    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)

    return new_vendor


# ---------------------------------------------------------
# 2. GET ALL VENDORS
# ---------------------------------------------------------
@router.get("/", response_model=list[VendorResponse])
def get_all_vendors(db: Session = Depends(get_db)):
    return db.query(Vendor).all()


# ---------------------------------------------------------
# 3. GET VENDOR BY ID
# ---------------------------------------------------------
@router.get("/{vendor_id}", response_model=VendorResponse)
def get_vendor(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    return vendor


# ---------------------------------------------------------
# 4. UPDATE VENDOR
# ---------------------------------------------------------
@router.put("/{vendor_id}", response_model=VendorResponse)
def update_vendor(
    vendor_id: int,
    vendor_data: VendorUpdate,
    db: Session = Depends(get_db)
):
    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    existing_vendor = db.query(Vendor).filter(
        Vendor.email == vendor_data.email,
        Vendor.id != vendor_id
    ).first()

    if existing_vendor:
        raise HTTPException(
            status_code=400,
            detail="Another vendor with this email already exists"
        )

    vendor.name = vendor_data.name
    vendor.email = vendor_data.email

    db.commit()
    db.refresh(vendor)

    return vendor


# ---------------------------------------------------------
# 5. DELETE VENDOR
# ---------------------------------------------------------
@router.delete("/{vendor_id}")
def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    db.delete(vendor)
    db.commit()

    return {"message": "Vendor deleted successfully"}