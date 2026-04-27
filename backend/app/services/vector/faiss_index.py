import faiss
import numpy as np


class VectorIndex:

    def __init__(
        self,
        dimension
    ):

        self.index = (
            faiss.IndexFlatIP(
                dimension
            )
        )

    def add_embeddings(
        self,
        embeddings
    ):

        vectors = np.array(
            embeddings
        ).astype("float32")

        self.index.add(vectors)

    def search(
        self,
        query_vectors,
        top_k=5
    ):

        vectors = np.array(
            query_vectors
        ).astype("float32")

        scores, indexes = (
            self.index.search(
                vectors,
                top_k
            )
        )

        return scores, indexes