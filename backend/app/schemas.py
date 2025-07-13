from pydantic import BaseModel


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

class TradesCreate(TradesBase):
    pass

class TradesOut(TradesBase):
    trades_id: int

    class Config:
        orm_mode = True

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

