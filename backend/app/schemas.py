from ast import List
from pydantic import BaseModel, ConfigDict, field_serializer
from datetime import date


class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    user_id: int

    class Config:
        orm_mode = True

class PortfolioBase(BaseModel):
    owner_id: int

class PortfolioCreate(PortfolioBase):
    pass

class PortfolioOut(PortfolioBase):
    portfolio_id: int

    class Config:
        orm_mode = True

class TradesBase(BaseModel):
    symbol: str
    quantity: int
    price: float
    date: str  # ISO date string
    portfolio_id: int
    action: str

class TradesCreate(BaseModel):
    symbol: str
    price: float
    quantity: int
    action: str
    date: str
    portfolio_id: int  # <-- add this line

class TradesOut(BaseModel):
    trades_id: int
    symbol: str
    quantity: int
    price: float
    date: date  # keep as str
    portfolio_id: int
    action: str

    @field_serializer('date')
    def serialize_date(self, value):
        return value.isoformat() if hasattr(value, 'isoformat') else value

    class Config:
        orm_mode = True

    @staticmethod
    def from_orm(obj):
        d = obj.__dict__.copy()
        if isinstance(d['date'], date):
            d['date'] = d['date'].isoformat()
        return TradesOut(**d)

class ModelResultsBase(BaseModel):
    user_id: int
    model_name: str
    parameters: dict

class ModelResultsCreate(ModelResultsBase):
    pass

class ModelResultsOut(ModelResultsBase):
    results_id: int

    class Config:
        orm_mode = True

class ReportsBase(BaseModel):
    file_path: str
    created_at: str  # ISO date string

class ReportsCreate(ReportsBase):
    pass

class ReportsOut(ReportsBase):
    report_id: int

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str

class Tracker(BaseModel):
    portfolio_id: int
    portfolio_values: list[float]   # or list[float] if Python >=3.9
    dates: list[date]               # or list[date]

    model_config = ConfigDict(from_attributes=True)

class TradesUpdate(BaseModel):
    symbol: str
    price: float
    quantity: int
    action: str
    date: date
    portfolio_id: int

    