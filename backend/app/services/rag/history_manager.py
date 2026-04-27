from datetime import datetime

from app.services.rag.memory_store import (
    load_memory,
    save_memory
)


def store_cluster_history(
    clusters,
    risk_analysis
):

    history = load_memory()

    existing_clusters = [

        set(item["accounts"])

        for item in history
    ]

    for cluster, risk in zip(
        clusters,
        risk_analysis
    ):

        current_accounts = set(
            cluster["accounts"]
        )

        # prevent duplicate storage

        if (
            current_accounts
            in existing_clusters
        ):

            continue

        history.append({

            "timestamp":
                str(datetime.utcnow()),

            "cluster_id":
                cluster["cluster_id"],

            "accounts":
                cluster["accounts"],

            "risk_level":
                risk["risk_level"],

            "risk_score":
                risk["risk_score"],

            "coordination_score":
                cluster[
                    "average_coordination_score"
                ]
        })

    save_memory(history)