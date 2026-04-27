from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

from functools import lru_cache

@lru_cache(maxsize=10000)
def embed_single(text):
    return model.encode(text, normalize_embeddings=True)

def generate_embeddings(texts):
    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True  # ✅ CRITICAL FIX
    )

    # 🚫 HARD GUARD: prevent NaN / Inf
    if np.isnan(embeddings).any() or np.isinf(embeddings).any():
        raise ValueError("Embedding contains NaN or Inf values")

    return embeddings