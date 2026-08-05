from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


# -----------------------------
# User / Auth Model (Admin & Vendor)
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    gender = Column(String, nullable=False, default="Male")  # Male (Mr.) / Female (Mrs.)
    aadhaar_number = Column(String, nullable=False)  # 12-digit Aadhaar
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True, default="+91 9876543210")
    role = Column(String, nullable=False, default="vendor")  # admin / vendor
    security_key = Column(String, nullable=False)  # Mandatory permanent security key
    is_aadhaar_verified = Column(Boolean, default=False)
    is_online = Column(Boolean, default=True)  # Vendor online status


# -----------------------------
# Vendor Model
# -----------------------------
class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    rating = Column(Float, default=4.8)
    status = Column(String, default="Active")

    products = relationship("Product", back_populates="vendor")


# -----------------------------
# Product Model
# -----------------------------
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(String, nullable=False, default="In Stock")  # In Stock / Low Stock / No Stock

    vendor_id = Column(Integer, ForeignKey("vendors.id"))

    vendor = relationship("Vendor", back_populates="products")


# -----------------------------
# Customer Model
# -----------------------------
class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    city = Column(String, nullable=False)


# -----------------------------
# Transaction / Order Model
# -----------------------------
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_ref = Column(String, unique=True, nullable=False)
    customer_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String, default="UPI / Card")
    status = Column(String, default="Completed")  # Completed / Pending / Refunded
    created_at = Column(DateTime, default=datetime.utcnow)