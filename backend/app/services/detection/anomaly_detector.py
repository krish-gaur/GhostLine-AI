import numpy as np


def detect_anomalies(
    clusters
):

    scores = [

        cluster[
            "average_coordination_score"
        ]

        for cluster in clusters
    ]

    mean = np.mean(scores)

    std = np.std(scores)

    anomalies = []

    for cluster in clusters:

        score = (
            cluster[
                "average_coordination_score"
            ]
        )

        z_score = (
            (score - mean)
            / (std + 0.0001)
        )

        anomalies.append({

            "cluster_id":
                cluster["cluster_id"],

            "anomaly_score":
                round(z_score, 2),

            "is_anomalous":
                z_score > 1.5
        })

    return anomalies