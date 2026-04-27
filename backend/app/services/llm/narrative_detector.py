from sklearn.feature_extraction.text import (
    TfidfVectorizer
)


def detect_narrative(
    cluster
):

    contents = cluster.get(
        "contents",
        []
    )

    if not contents:

        return {

            "dominant_keywords": [],

            "summary":
                "No narrative detected"
        }

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=5
    )

    matrix = vectorizer.fit_transform(
        contents
    )

    keywords = (
        vectorizer
        .get_feature_names_out()
        .tolist()
    )

    return {

        "dominant_keywords":
            keywords,

        "summary":
            f"""
            Coordinated narrative around:
            {", ".join(keywords)}
            """.strip()
    }