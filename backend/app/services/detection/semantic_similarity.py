from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import time

from app.services.embeddings.embedding_service import (
    generate_embeddings
)

SEMANTIC_WEIGHT = 0.8
KEYWORD_WEIGHT = 0.2
THRESHOLD = 0.55


def keyword_overlap(text1, text2):

    words1 = set(text1.split())
    words2 = set(text2.split())

    if not words1 or not words2:
        return 0.0

    return len(words1 & words2) / len(words1 | words2)


def safe_cosine(a, b):

    if np.isnan(a).any() or np.isnan(b).any():
        return 0.0

    if np.isinf(a).any() or np.isinf(b).any():
        return 0.0

    score = cosine_similarity(
        [a],
        [b]
    )[0][0]

    if np.isnan(score) or np.isinf(score):
        return 0.0

    return float(score)


def detect_semantic_similarity(posts):

    start_time = time.time()

    texts = [
        post["cleaned_content"]
        for post in posts
    ]

    embedding_start = time.time()

    embeddings = generate_embeddings(
        texts
    )

    embedding_time = round(
        time.time() - embedding_start,
        3
    )

    print(f"""

==================================================
EMBEDDING METRICS
==================================================

total_texts:
{len(texts)}

embedding_generation_time:
{embedding_time} sec

==================================================

""")

    suspicious_pairs = []

    total_comparisons = 0

    for i in range(len(posts)):

        for j in range(i + 1, len(posts)):

            # skip same user

            if (
                posts[i]["username"]
                ==
                posts[j]["username"]
            ):
                continue

            total_comparisons += 1

            semantic_score = safe_cosine(
                embeddings[i],
                embeddings[j]
            )

            keyword_score = keyword_overlap(
                texts[i],
                texts[j]
            )

            final_score = (
                semantic_score
                * SEMANTIC_WEIGHT
                +
                keyword_score
                * KEYWORD_WEIGHT
            )

            # reject invalid semantic scores

            if semantic_score < 0:
                continue

            print(f"""

--------------------------------------------------

{posts[i]["username"]}
vs
{posts[j]["username"]}

semantic_score:
{round(semantic_score, 3)}

keyword_score:
{round(keyword_score, 3)}

final_score:
{round(final_score, 3)}

--------------------------------------------------

""")

            if final_score >= THRESHOLD:

                suspicious_pairs.append({

                    "post_1":
                        posts[i]["username"],

                    "post_2":
                        posts[j]["username"],

                    "content_1":
                        texts[i],

                    "content_2":
                        texts[j],

                    "semantic_score":
                        round(semantic_score, 3),

                    "keyword_score":
                        round(keyword_score, 3),

                    "final_score":
                        round(final_score, 3)
                })

    total_time = round(
        time.time() - start_time,
        3
    )

    print(f"""

==================================================
SEMANTIC DETECTOR SUMMARY
==================================================

total_posts:
{len(posts)}

total_comparisons:
{total_comparisons}

suspicious_pairs:
{len(suspicious_pairs)}

pipeline_time:
{total_time} sec

==================================================

""")

    return suspicious_pairs