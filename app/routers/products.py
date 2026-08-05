from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product, Vendor
from app.schemas import ProductCreate, ProductResponse, ProductUpdate


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("/", response_model=ProductResponse)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):
    vendor = db.query(Vendor).filter(
        Vendor.id == product_data.vendor_id
    ).first()

    if not vendor:
        vendor = Vendor(id=product_data.vendor_id, name="Default Vendor", email=f"vendor{product_data.vendor_id}@shopsense.com")
        db.add(vendor)
        db.commit()

    if product_data.price <= 0:
        raise HTTPException(
            status_code=400,
            detail="Product price must be greater than zero"
        )

    new_product = Product(
        name=product_data.name,
        category=product_data.category,
        price=product_data.price,
        stock=product_data.stock or "In Stock",
        vendor_id=product_data.vendor_id
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get("/", response_model=list[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = product_data.name
    product.category = product_data.category
    product.price = product_data.price
    product.stock = product_data.stock or "In Stock"

    db.commit()
    db.refresh(product)

    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}