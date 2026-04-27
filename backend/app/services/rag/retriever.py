from app.services.rag.knowledge_base import (
    MANIPULATION_PATTERNS
)


def retrieve_matching_patterns(
    cluster,
    timing_analysis
):

    matches = []

    coordination_score = (
        cluster[
            "average_coordination_score"
        ]
    )

    account_count = (
        cluster["account_count"]
    )

    coordinated_pairs = len([
        x for x in timing_analysis
        if x["timing_coordinated"]
    ])

    for pattern in (
        MANIPULATION_PATTERNS
    ):

        score = 0

        indicators = (
            pattern["indicators"]
        )

        if (
            coordination_score > 0.7
        ):
            score += 1

        if coordinated_pairs >= 2:
            score += 1

        if account_count >= 3:
            score += 1

        if score >= 2:

            matches.append({

                "pattern_name":
                    pattern["name"],

                "description":
                    pattern[
                        "description"
                    ],

                "confidence_score":
                    score
            })

    return matches