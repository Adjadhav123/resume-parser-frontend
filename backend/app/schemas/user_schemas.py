from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSchema(BaseModel):
    username : str 
    name : str 
    email : EmailStr
    password : str 

class UserLoginSchema(BaseModel):
    username : Optional[str] = None
    email : Optional[EmailStr] = None
    password : str

class UserLoginResponseSchema(BaseModel):
    detail: str
    access_token: str

class UserResponseScema(BaseModel):
    user_id : int 
    username : str 
    name : str 
    email : EmailStr

    class Config:
        orm_mode = True
    