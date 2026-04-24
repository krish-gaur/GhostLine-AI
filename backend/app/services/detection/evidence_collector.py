def collect_cluster_evidence(
    cluster,
    timing_analysis
):

    evidence = []

    avg_score = (
        cluster[
            "average_coordination_score"
        ]
    )

    if avg_score > 0.7:

        evidence.append(
            "High semantic similarity detected across accounts"
        )

    elif avg_score > 0.5:

        evidence.append(
            "Moderate semantic coordination detected"
        )

    coordinated_count = 0

    cluster_accounts = set(
        cluster["accounts"]
    )

    for item in timing_analysis:

        if (

            item["timing_coordinated"]

            and

            item["post_1"]
            in cluster_accounts

            and

            item["post_2"]
            in cluster_accounts
        ):

            coordinated_count += 1

    if coordinated_count >= 3:

        evidence.append(
            "Synchronized posting behavior identified"
        )

    if cluster["account_count"] >= 5:

        evidence.append(
            "Large coordinated amplification network detected"
        )

    if len(
        cluster["connections"]
    ) >= 5:

        evidence.append(
            "Dense inter-account coordination graph"
        )

    return evidence