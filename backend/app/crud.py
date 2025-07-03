from sqlalchemy.orm import Session
from . import models
from . import schemas

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=user.password   # you need to add this!
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)  # Now db_user has user_id, username, email, password
    return db_user


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if user:
        db.delete(user)
        db.commit()
    return user

def create_portfolio(db: Session, portfolio: schemas.PortfolioCreate):
    db_portfolio = models.Portfolio(**portfolio.dict())
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

def get_portfolio(db: Session, portfolio_id: int):
    return db.query(models.Portfolio).filter(models.Portfolio.portfolio_id == portfolio_id).first()

def delete_portfolio(db: Session, portfolio_id: int):
    portfolio = get_portfolio(db, portfolio_id)
    if portfolio:
        db.delete(portfolio)
        db.commit()
    return portfolio


def create_trades(db: Session, trade: schemas.TradesCreate):
    db_trade = models.Trades(
        symbol=trade.symbol,
        quantity=trade.quantity,
        price=trade.price,
        date=trade.date,
        portfolio_id=trade.portfolio_id
    )
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade

def get_trades(db: Session, trades_id: int):
    return db.query(models.Trades).filter(models.Trades.trades_id == trades_id).first()

def delete_trades(db: Session, trades_id: int):
    trade = get_trades(db, trades_id)
    if trade:
        db.delete(trade)
        db.commit()
    return trade


def create_model_results(db: Session, result: schemas.ModelResultsCreate):
    db_result = models.ModelResults(
        user_id=result.user_id,
        model_name=result.model_name,
        parameters=result.parameters
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def get_model_results(db: Session, results_id: int):
    return db.query(models.ModelResults).filter(models.ModelResults.results_id == results_id).first()

def delete_model_results(db: Session, results_id: int):
    result = get_model_results(db, results_id)
    if result:
        db.delete(result)
        db.commit()
    return result


def create_report(db: Session, report: schemas.ReportsCreate):
    db_report = models.Reports(
        file_path=report.file_path,
        created_at=report.created_at
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_report(db: Session, report_id: int):
    return db.query(models.Reports).filter(models.Reports.report_id == report_id).first()

def delete_report(db: Session, report_id: int):
    report = get_report(db, report_id)
    if report:
        db.delete(report)
        db.commit()
    return report

def update_user(db: Session, user_id: int, user_update: schemas.UserCreate):
    user = get_user(db, user_id)
    if user:
        user.username = user_update.username
        user.email = user_update.email
        user.password = user_update.password
        db.commit()
        db.refresh(user)
    return user


def update_portfolio(db: Session, portfolio_id: int, portfolio_update: schemas.PortfolioCreate):
    portfolio = get_portfolio(db, portfolio_id)
    if portfolio:
        portfolio.owner_id = portfolio_update.owner_id
        db.commit()
        db.refresh(portfolio)
    return portfolio


def update_trades(db: Session, trades_id: int, trade_update: schemas.TradesCreate):
    trade = get_trades(db, trades_id)
    if trade:
        trade.symbol = trade_update.symbol
        trade.quantity = trade_update.quantity
        trade.price = trade_update.price
        trade.date = trade_update.date
        trade.portfolio_id = trade_update.portfolio_id
        db.commit()
        db.refresh(trade)
    return trade


def update_model_results(db: Session, results_id: int, result_update: schemas.ModelResultsCreate):
    result = get_model_results(db, results_id)
    if result:
        result.user_id = result_update.user_id
        result.model_name = result_update.model_name
        result.parameters = result_update.parameters
        db.commit()
        db.refresh(result)
    return result


def update_report(db: Session, report_id: int, report_update: schemas.ReportsCreate):
    report = get_report(db, report_id)
    if report:
        report.file_path = report_update.file_path
        report.created_at = report_update.created_at
        db.commit()
        db.refresh(report)
    return report
