from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from app.database import get_db
from app.models import Transaction
from app.schemas import TransactionCreate, TransactionResponse

router = APIRouter(
    prefix="/transactions",
    tags=["Global Transactions & Orders"]
)


@router.post("/", response_model=TransactionResponse)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    tx_ref = "TXN-" + str(uuid.uuid4())[:8].upper()

    new_tx = Transaction(
        transaction_ref=tx_ref,
        customer_name=data.customer_name,
        amount=data.amount,
        payment_method=data.payment_method or "UPI / Card",
        status=data.status or "Completed"
    )

    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)

    return new_tx


@router.get("/", response_model=list[TransactionResponse])
def get_all_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).order_by(Transaction.created_at.desc()).all()


@router.get("/{tx_id}", response_model=TransactionResponse)
def get_transaction(tx_id: int, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx
