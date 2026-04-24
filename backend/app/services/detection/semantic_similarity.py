from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter

from app.services.embeddings.embedding_service import (
    generate_embeddings
)

SEMANTIC_WEIGHT = 0.7
KEYWORD_WEIGHT = 0.3

THRESHOLD = 0.45


def keyword_overlap(text1, text2):

    words1 = set(text1.split())
    words2 = set(text2.split())

    overlap = words1.intersection(words2)

    union = words1.union(words2)

    if not union:
        return 0

    return len(overlap) / len(union)


def detect_semantic_similarity(posts):

    texts = [post["cleaned_content"] for post in posts]

    embeddings = generate_embeddings(texts)

    similarity_matrix = cosine_similarity(embeddings)

    suspicious_pairs = []

    total_posts = len(posts)

    for i in range(total_posts):

        for j in range(i + 1, total_posts):

            semantic_score = float(
                similarity_matrix[i][j]
            )

            keyword_score = keyword_overlap(
                texts[i],
                texts[j]
            )

            final_score = (
                semantic_score * SEMANTIC_WEIGHT
                +
                keyword_score * KEYWORD_WEIGHT
            )

            print(
                f"""
                {posts[i]["username"]} vs {posts[j]["username"]}

                semantic_score = {round(semantic_score, 3)}

                keyword_score = {round(keyword_score, 3)}

                final_score = {round(final_score, 3)}
                """
            )

            if final_score >= THRESHOLD:

                suspicious_pairs.append({
                    "post_1": posts[i]["username"],
                    "post_2": posts[j]["username"],

                    "content_1": texts[i],
                    "content_2": texts[j],

                    "semantic_score": round(
                        semantic_score, 3
                    ),

                    "keyword_score": round(
                        keyword_score, 3
                    ),

                    "final_score": round(
                        final_score, 3
                    )
                })

    return suspicious_pairs