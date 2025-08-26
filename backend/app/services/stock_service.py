import requests
import os

API_KEY = os.getenv("ALPHA_VANTAGE_KEY")   # store in .env, not code
BASE_URL = "https://www.alphavantage.co/query"

def get_stock_price(symbol: str) -> dict:
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": API_KEY
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    return {
        "symbol": symbol,
        "price": data.get("Global Quote", {}).get("05. price"),
        "change_percent": data.get("10. change percent")
    }
