from fastapi import APIRouter
from app.services.stock_service import get_stock_price

router = APIRouter()

@router.get("/stocks/{symbol}")
def fetch_stock(symbol: str):
    return get_stock_price(symbol)
