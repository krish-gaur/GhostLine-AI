import networkx as nx


def build_coordination_clusters(
    suspicious_pairs,
    processed_posts
):

    graph = nx.Graph()

    username_to_post = {
        post["username"]: post
        for post in processed_posts
    }

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

        platforms = set()

        contents = []

        cross_platform_links = 0

        for user in cluster_nodes:

            post_data = username_to_post.get(user)

            if post_data:

                platforms.add(
                    post_data["platform"]
                )

                contents.append(
                    post_data["cleaned_content"]
                )

        for u, v, data in graph.edges(
            data=True
        ):

            if (
                u in cluster_nodes
                and
                v in cluster_nodes
            ):

                platform_u = username_to_post[u]["platform"]

                platform_v = username_to_post[v]["platform"]

                is_cross_platform = (
                    platform_u != platform_v
                )

                if is_cross_platform:

                    cross_platform_links += 1

                cluster_edges.append({

                    "source": u,

                    "target": v,

                    "score": round(
                        data["weight"],
                        3
                    ),

                    "type":
                        "cross_platform_coordination"
                        if is_cross_platform
                        else "semantic_coordination"
                })

                total_score += data["weight"]

                edge_count += 1

        average_score = (
            total_score / edge_count
            if edge_count > 0
            else 0
        )

        clusters.append({

            "cluster_id":
                f"cluster_{index + 1}",

            "accounts":
                cluster_nodes,

            "account_count":
                len(cluster_nodes),

            "average_coordination_score":
                round(average_score, 3),

            "platforms":
                list(platforms),

            "cross_platform_links":
                cross_platform_links,

            "contents":
                contents,

            "connections":
                cluster_edges
        })

    return clusters