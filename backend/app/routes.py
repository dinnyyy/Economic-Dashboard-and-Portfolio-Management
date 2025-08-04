from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from . import crud
from . import schemas
from . import database
from . import models

router = APIRouter()

@router.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@router.get("/users/{user_id}", response_model=schemas.UserOut)
def read_user(user_id: int, db: Session = Depends(database.get_db)):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/users/", response_model=schemas.UserOut)
def get_user_by_username(username: str = Query(...), db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/users/{user_id}/portfolios/", response_model=List[schemas.PortfolioOut])
def get_user_portfolios(user_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Portfolio).filter(models.Portfolio.owner_id == user_id).all()

# Portfolio endpoints
@router.post("/portfolios/", response_model=schemas.PortfolioOut)
def create_portfolio(portfolio: schemas.PortfolioCreate, db: Session = Depends(database.get_db)):
    return crud.create_portfolio(db=db, portfolio=portfolio)

@router.get("/portfolios/{portfolio_id}", response_model=schemas.PortfolioOut)
def read_portfolio(portfolio_id: int, db: Session = Depends(database.get_db)):
    db_portfolio = crud.get_portfolio(db, portfolio_id)
    if db_portfolio is None:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return db_portfolio

@router.put("/portfolios/{portfolio_id}", response_model=schemas.PortfolioOut)
def update_portfolio(portfolio_id: int, portfolio: schemas.PortfolioCreate, db: Session = Depends(database.get_db)):
    db_portfolio = crud.update_portfolio(db, portfolio_id, portfolio)
    if db_portfolio is None:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return db_portfolio

@router.delete("/portfolios/{portfolio_id}", response_model=schemas.PortfolioOut)
def delete_portfolio(portfolio_id: int, db: Session = Depends(database.get_db)):
    db_portfolio = crud.delete_portfolio(db, portfolio_id)
    if db_portfolio is None:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return db_portfolio

# Trades endpoints
@router.post("/trades/", response_model=schemas.TradesOut)
def create_trades(trade: schemas.TradesCreate, db: Session = Depends(database.get_db)):
    trade_obj = crud.create_trades(db=db, trade=trade)
    # Convert date to string for response
    if hasattr(trade_obj, 'date') and not isinstance(trade_obj.date, str):
        trade_obj.date = trade_obj.date.isoformat()
    return trade_obj

@router.get("/trades/{trades_id}", response_model=schemas.TradesOut)
def read_trades(trades_id: int, db: Session = Depends(database.get_db)):
    db_trade = crud.get_trades(db, trades_id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    return db_trade

@router.put("/trades/{trades_id}", response_model=schemas.TradesOut)
def update_trades(trades_id: int, trade: schemas.TradesCreate, db: Session = Depends(database.get_db)):
    db_trade = crud.update_trades(db, trades_id, trade)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    return db_trade

@router.delete("/trades/{trades_id}", response_model=schemas.TradesOut)
def delete_trades(trades_id: int, db: Session = Depends(database.get_db)):
    db_trade = crud.delete_trades(db, trades_id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    if hasattr(db_trade, 'date') and not isinstance(db_trade.date, str):
        db_trade.date = db_trade.date.isoformat()
    return db_trade

@router.get("/trades/", response_model=List[schemas.TradesOut])
def get_all_trades(db: Session = Depends(database.get_db)):
    trades = crud.get_all_trades(db)
    for t in trades:
        if hasattr(t, 'date') and not isinstance(t.date, str):
            t.date = t.date.isoformat()
    return trades

@router.get("/portfolios/{portfolio_id}/trades/", response_model=List[schemas.TradesOut])
def get_trades_for_portfolio(portfolio_id: int, db: Session = Depends(database.get_db)):
    trades = db.query(models.Trades).filter(models.Trades.portfolio_id == portfolio_id).all()
    for t in trades:
        if hasattr(t, 'date') and not isinstance(t.date, str):
            t.date = t.date.isoformat()
    return trades

# ModelResults endpoints
@router.post("/modelresults/", response_model=schemas.ModelResultsOut)
def create_model_results(result: schemas.ModelResultsCreate, db: Session = Depends(database.get_db)):
    return crud.create_model_results(db=db, result=result)

@router.get("/modelresults/{results_id}", response_model=schemas.ModelResultsOut)
def read_model_results(results_id: int, db: Session = Depends(database.get_db)):
    db_result = crud.get_model_results(db, results_id)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Model result not found")
    return db_result

@router.put("/modelresults/{results_id}", response_model=schemas.ModelResultsOut)
def update_model_results(results_id: int, result: schemas.ModelResultsCreate, db: Session = Depends(database.get_db)):
    db_result = crud.update_model_results(db, results_id, result)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Model result not found")
    return db_result

@router.delete("/modelresults/{results_id}", response_model=schemas.ModelResultsOut)
def delete_model_results(results_id: int, db: Session = Depends(database.get_db)):
    db_result = crud.delete_model_results(db, results_id)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Model result not found")
    return db_result

# Reports endpoints
@router.post("/reports/", response_model=schemas.ReportsOut)
def create_report(report: schemas.ReportsCreate, db: Session = Depends(database.get_db)):
    return crud.create_report(db=db, report=report)

@router.get("/reports/{report_id}", response_model=schemas.ReportsOut)
def read_report(report_id: int, db: Session = Depends(database.get_db)):
    db_report = crud.get_report(db, report_id)
    if db_report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report

@router.put("/reports/{report_id}", response_model=schemas.ReportsOut)
def update_report(report_id: int, report: schemas.ReportsCreate, db: Session = Depends(database.get_db)):
    db_report = crud.update_report(db, report_id, report)
    if db_report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report

@router.delete("/reports/{report_id}", response_model=schemas.ReportsOut)
def delete_report(report_id: int, db: Session = Depends(database.get_db)):
    db_report = crud.delete_report(db, report_id)
    if db_report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter_by(username=user.username).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return {"message": "Login successful"}
