from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)


KNOWN_FRAUD_PATTERNS = [

    "click this link now",

    "claim your reward now",

    "urgent bank verification needed",

    "your account is suspended",

    "crypto giveaway claim now",

    "win money instantly"

]


fraud_embeddings = model.encode(
    KNOWN_FRAUD_PATTERNS
)


VERY_CRITICAL_THRESHOLD = 0.85


def detect_fraud_similarity(
    text_embedding
):

    max_score = 0

    for fraud_embedding in fraud_embeddings:

        score = cosine_similarity(
            [text_embedding],
            [fraud_embedding]
        )[0][0]

        if score > max_score:
            max_score = score

    return float(max_score)