# app/services/graph/graph_builder.py


def generate_graph_data(

    clusters,

    risk_analysis
):

    nodes = []

    edges = []

    for cluster in clusters:

        cluster_id = cluster[
            "cluster_id"
        ]

        matching_risk = next(

            (
                risk

                for risk
                in risk_analysis

                if risk[
                    "cluster_id"
                ]
                ==
                cluster_id
            ),

            None
        )

        for account in cluster[
            "accounts"
        ]:

            nodes.append({

                "id":
                    account,

                "group":
                    cluster_id,

                "risk_level":
                    matching_risk[
                        "risk_level"
                    ],

                "risk_score":
                    matching_risk[
                        "risk_score"
                    ]
            })

        for connection in cluster[
            "connections"
        ]:

            edges.append({

                "source":
                    connection[
                        "source"
                    ],

                "target":
                    connection[
                        "target"
                    ],

                "weight":
                    connection[
                        "score"
                    ],

                "type":
                    connection[
                        "type"
                    ],

                "cluster":
                    cluster_id
            })

    return {

        "nodes":
            nodes,

        "edges":
            edges
    }