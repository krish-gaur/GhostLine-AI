import faiss
import numpy as np


def build_faiss_index(embeddings):
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)  # cosine with normalized vectors
    index.add(embeddings)
    return index


def get_top_k_similar(index, embeddings, k=5):
    scores, indices = index.search(embeddings, k)
    return scores, indices