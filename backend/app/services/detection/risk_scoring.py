def calculate_risk_score(
    clusters,
    timing_analysis
):

    results = []

    for cluster in clusters:

        cluster_accounts = set(
            cluster["accounts"]
        )

        coordinated_pairs = 0

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

                coordinated_pairs += 1

        account_count = (
            cluster["account_count"]
        )

        avg_score = (
            cluster[
                "average_coordination_score"
            ]
        )

        connection_count = len(
            cluster["connections"]
        )

        risk_score = 0

        # semantic coordination
        risk_score += (
            avg_score * 35
        )

        # network size
        risk_score += min(
            account_count * 6,
            25
        )

        # timing synchronization
        risk_score += min(
            coordinated_pairs * 4,
            20
        )

        # graph density
        density = (
            connection_count
            /
            max(
                account_count,
                1
            )
        )

        risk_score += min(
            density * 10,
            20
        )

        risk_score = round(
            min(risk_score, 100)
        )

        if risk_score >= 75:

            level = "CRITICAL"

        elif risk_score >= 55:

            level = "HIGH"

        elif risk_score >= 35:

            level = "MEDIUM"

        else:

            level = "LOW"

        results.append({

            "cluster_id":
                cluster["cluster_id"],

            "risk_score":
                risk_score,

            "risk_level":
                level
        })

    return results