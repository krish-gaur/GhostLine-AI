from fastapi import APIRouter

from app.schemas.post_schemas import UploadRequest
from app.services.preprocessing.cleaner import clean_text

router = APIRouter()


@router.post("/upload")
async def upload_posts(payload: UploadRequest):

    cleaned_posts = []

    for post in payload.posts:

        cleaned = clean_text(post.content)

        cleaned_posts.append({
            "username": post.username,
            "cleaned_content": cleaned,
            "timestamp": post.timestamp,
            "platform": post.platform
        })

    return {
        "status": "success",
        "processed_posts": cleaned_posts
    }