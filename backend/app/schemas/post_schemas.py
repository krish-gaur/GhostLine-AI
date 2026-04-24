from pydantic import BaseModel
from typing import List
from datetime import datetime


class Post(BaseModel):

    username: str

    content: str

    timestamp: datetime

    platform: str


class UploadRequest(BaseModel):

    posts: List[Post]