from pydantic import BaseModel
from typing import List

from app.schemas.post_schemas import Post


class AnalysisRequest(BaseModel):
    posts: List[Post]