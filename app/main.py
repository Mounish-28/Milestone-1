from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app import models

from app.routers import auth
from app.routers import vendors
from app.routers import products
from app.routers import customers
from app.routers import analytics
from app.routers import transactions

# Create Database Tables
Base.metadata.create_all(bind=engine)

# Auto-seed database with default items if empty
def seed_initial_database():
    db: Session = SessionLocal()
    try:
        if db.query(models.Vendor).count() == 0:
            v1 = models.Vendor(name="TechWorld Electronics", email="contact@techworld.com", rating=4.9, status="Active")
            v2 = models.Vendor(name="StyleHub Fashion", email="sales@stylehub.com", rating=4.7, status="Active")
            db.add_all([v1, v2])
            db.commit()

            p1 = models.Product(name="Wireless Noise-Canceling Headphones", category="Electronics", price=149.99, stock="In Stock", vendor_id=v1.id)
            p2 = models.Product(name="Smart Fitness Watch Pro", category="Electronics", price=199.50, stock="In Stock", vendor_id=v1.id)
            p3 = models.Product(name="Premium Leather Laptop Bag", category="Accessories", price=89.00, stock="Low Stock", vendor_id=v2.id)
            p4 = models.Product(name="Mechanical RGB Gaming Keyboard", category="Electronics", price=119.99, stock="No Stock", vendor_id=v1.id)
            db.add_all([p1, p2, p3, p4])
            db.commit()

        if db.query(models.Customer).count() == 0:
            c1 = models.Customer(name="Aarav Sharma", email="aarav@gmail.com", phone="+91 9876543210", city="Mumbai")
            c2 = models.Customer(name="Priya Patel", email="priya@gmail.com", phone="+91 9876543211", city="Bangalore")
            c3 = models.Customer(name="Vikram Singh", email="vikram@gmail.com", phone="+91 9876543212", city="Delhi")
            db.add_all([c1, c2, c3])
            db.commit()

        if db.query(models.Transaction).count() == 0:
            t1 = models.Transaction(transaction_ref="TXN-984210", customer_name="Aarav Sharma", amount=149.99, payment_method="UPI", status="Completed")
            t2 = models.Transaction(transaction_ref="TXN-881240", customer_name="Priya Patel", amount=199.50, payment_method="Credit Card", status="Completed")
            db.add_all([t1, t2])
            db.commit()
    finally:
        db.close()

seed_initial_database()

# Swagger UI OpenAPI Metadata
tags_metadata = [
    {
        "name": "Authentication & Aadhaar KYC",
        "description": "User login, Google Sign-In, Aadhaar OTP verification, Security Key delivery, and vendor online status.",
    },
    {
        "name": "Analytics & Dashboard Stats",
        "description": "Platform revenue summaries, active order counters, stock distribution, and sales growth charts.",
    },
    {
        "name": "Global Transactions & Orders",
        "description": "Customer order history, transaction creation, and payment logs.",
    },
    {
        "name": "Vendors",
        "description": "Operations with marketplace vendors, registration, ratings, and partner details.",
    },
    {
        "name": "Products",
        "description": "Product catalog management, QR auto-generation, pricing, stock options (In Stock / Low Stock / No Stock), and vendor assignments.",
    },
    {
        "name": "Customers",
        "description": "Customer directory, user profiles, city lookup, and registration.",
    },
]

app = FastAPI(
    title="ShopSense Multi-Vendor API",
    description="""
    ### 🛍️ ShopSense E-Commerce Analytics Platform API
    
    The **ShopSense API** provides complete interactive management endpoints for:
    * **Authentication & Aadhaar KYC**: Multi-role login, Google Auth, Aadhaar OTP, and Security Key delivery.
    * **Analytics & Dashboard Stats**: Revenue tracking, stock breakdown, and sales analytics.
    * **Global Transactions**: Real-time customer order processing and logs.
    * **Vendors**: Marketplace vendor profiles, rating management & online/offline toggling.
    * **Products**: Inventory catalog, QR code scanner data, pricing, and 3 stock states (In Stock, Low Stock, No Stock).
    * **Customers**: Full CRUD customer directory and lookup.
    """,
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All Routers
app.include_router(auth.router)
app.include_router(analytics.router)
app.include_router(transactions.router)
app.include_router(vendors.router)
app.include_router(products.router)
app.include_router(customers.router)

# Health Check Route
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "ShopSense Multi-Vendor API",
        "version": "1.0.0"
    }

# Home Route
@app.get("/")
def root():
    return {
        "message": "ShopSense API is working smoothly",
        "status": "online",
        "docs": "/docs"
    }