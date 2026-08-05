from pydantic import BaseModel
from datetime import datetime

# ----------------------------
# Auth & User Schemas
# ----------------------------

class UserLoginRequest(BaseModel):
    role: str  # admin / vendor
    display_name: str
    username: str
    gender: str
    aadhaar_number: str
    email: str
    phone: str | None = None
    password: str
    security_key: str | None = None

class GoogleSignInRequest(BaseModel):
    email: str
    display_name: str
    role: str

class RequestAadhaarOtpRequest(BaseModel):
    aadhaar_number: str
    channel: str  # 'mobile' | 'email' | 'both'
    destination: str | None = None

class AadhaarOtpRequest(BaseModel):
    aadhaar_number: str
    otp_code: str

class ForgotSecurityKeyRequest(BaseModel):
    identifier: str  # email or phone

class VendorStatusUpdateRequest(BaseModel):
    is_online: bool

class UserResponse(BaseModel):
    id: int
    display_name: str
    username: str
    gender: str
    aadhaar_number: str
    email: str
    phone: str | None = None
    role: str
    security_key: str
    is_aadhaar_verified: bool
    is_online: bool

    class Config:
        from_attributes = True


# ----------------------------
# Vendor Schemas
# ----------------------------

class VendorCreate(BaseModel):
    name: str
    email: str
    rating: float | None = 4.8
    status: str | None = "Active"


class VendorUpdate(BaseModel):
    name: str
    email: str
    rating: float | None = 4.8
    status: str | None = "Active"


class VendorResponse(BaseModel):
    id: int
    name: str
    email: str
    rating: float
    status: str

    class Config:
        from_attributes = True


# ----------------------------
# Product Schemas
# ----------------------------

class ProductCreate(BaseModel):
    name: str
    category: str | None = None
    price: float
    vendor_id: int
    stock: str | None = "In Stock"


class ProductUpdate(BaseModel):
    name: str
    category: str | None = None
    price: float
    stock: str | None = "In Stock"


class ProductResponse(BaseModel):
    id: int
    name: str
    category: str | None = None
    price: float
    vendor_id: int
    stock: str

    class Config:
        from_attributes = True


# ----------------------------
# Customer Schemas
# ----------------------------

class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: str
    city: str


class CustomerUpdate(BaseModel):
    name: str
    email: str
    phone: str
    city: str


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    city: str

    class Config:
        from_attributes = True


# ----------------------------
# Transaction Schemas
# ----------------------------

class TransactionCreate(BaseModel):
    customer_name: str
    amount: float
    payment_method: str | None = "UPI / Card"
    status: str | None = "Completed"


class TransactionResponse(BaseModel):
    id: int
    transaction_ref: str
    customer_name: str
    amount: float
    payment_method: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True