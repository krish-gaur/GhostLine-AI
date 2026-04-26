from collections import Counter


def calculate_behavioral_similarity(
    posts
):

    platform_pattern = Counter(
        [
            post["platform"]
            for post in posts
        ]
    )

    posting_density = len(posts)

    return {

        "posting_density":
            posting_density,

        "platform_distribution":
            dict(platform_pattern),

        "behavior_risk":
            min(
                100,
                posting_density * 10
            )
    }