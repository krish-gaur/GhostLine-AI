import networkx as nx


def build_coordination_clusters(suspicious_pairs):

    graph = nx.Graph()

    for pair in suspicious_pairs:

        user_1 = pair["post_1"]
        user_2 = pair["post_2"]

        score = pair["final_score"]

        graph.add_edge(
            user_1,
            user_2,
            weight=score
        )

    connected_components = list(
        nx.connected_components(graph)
    )

    clusters = []

    for index, component in enumerate(
        connected_components
    ):

        cluster_nodes = list(component)

        cluster_edges = []

        total_score = 0
        edge_count = 0

        for u, v, data in graph.edges(
            data=True
        ):

            if (
                u in cluster_nodes
                and
                v in cluster_nodes
            ):

                cluster_edges.append({
                    "source": u,
                    "target": v,
                    "score": round(
                        data["weight"], 3
                    )
                })

                total_score += data["weight"]

                edge_count += 1

        average_score = (
            total_score / edge_count
            if edge_count > 0
            else 0
        )

        clusters.append({
            "cluster_id": f"cluster_{index + 1}",

            "accounts": cluster_nodes,

            "account_count": len(
                cluster_nodes
            ),

            "average_coordination_score":
                round(average_score, 3),

            "connections": cluster_edges
        })

    return clusters