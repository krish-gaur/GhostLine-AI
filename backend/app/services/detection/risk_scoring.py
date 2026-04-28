def calculate_risk_score(
    clusters,
    timing_analysis
):

    results = []

    for cluster in clusters:

        coordination = (
            cluster[
                "average_coordination_score"
            ]
        )

        accounts = (
            cluster[
                "account_count"
            ]
        )

        timing_hits = 0

        for event in timing_analysis:

            if (
                event[
                    "timing_coordinated"
                ]
            ):

                if (

                    event["post_1"]
                    in cluster["accounts"]

                    and

                    event["post_2"]
                    in cluster["accounts"]

                ):

                    timing_hits += 1

        score = 0

        score += int(
            coordination * 40
        )

        score += (
            accounts * 8
        )

        score += (
            timing_hits * 10
        )

        if accounts >= 5:

            score += 20

        if coordination >= 0.8:

            score += 15

        score = min(score, 100)

        if (
            accounts < 3
            and
            coordination < 0.75
        ):

            level = "LOW"

        elif score >= 80:

            level = "CRITICAL"

        elif score >= 60:

            level = "HIGH"

        elif score >= 40:

            level = "MEDIUM"

        else:

            level = "LOW"

        # VERY CRITICAL ESCALATION

        for connection in cluster[
            "connections"
        ]:

            if (

                connection.get(
                    "severity"
                )

                ==

                "VERY_CRITICAL"

            ):

                level = (
                    "VERY_CRITICAL"
                )

                score = 95

                break

        results.append({

            "cluster_id":
                cluster["cluster_id"],

            "risk_score":
                score,

            "risk_level":
                level
        })

    return results