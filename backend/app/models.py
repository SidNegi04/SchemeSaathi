from enum import Enum
from typing import Literal, Optional

from pydantic import BaseModel, Field


class Occupation(str, Enum):
    farmer = "farmer"
    student = "student"
    small_business = "small_business"
    salaried = "salaried"
    unemployed = "unemployed"
    other = "other"


class Category(str, Enum):
    general = "general"
    obc = "obc"
    sc = "sc"
    st = "st"
    ews = "ews"


class Profile(BaseModel):
    state: Optional[str] = None
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[Literal["male", "female", "other"]] = None
    occupation: Optional[Occupation] = None
    annual_income: Optional[int] = Field(None, ge=0)
    land_acres: Optional[float] = Field(None, ge=0)
    category: Optional[Category] = None
    has_bank_account: Optional[bool] = None
    has_girl_child_under_10: Optional[bool] = None


class MatchRequest(BaseModel):
    profile: Profile
    lang: Literal["en", "hi"] = "en"


class ExtractRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    profile: Profile = Profile()
    lang: Literal["en", "hi"] = "en"
