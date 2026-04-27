from collections import deque

from app.services.detection.semantic_similarity import (
    detect_semantic_similarity
)

from app.services.detection.cluster_engine import (
    build_coordination_clusters
)

from app.services.detection.risk_scoring import (
    calculate_risk_score
)

from app.services.detection.timing_analysis import (
    detect_timing_coordination
)

from app.services.graph.graph_builder import (
    generate_graph_data
)


MAX_POST_BUFFER = 100


live_posts = deque(
    maxlen=MAX_POST_BUFFER
)


def add_post(post):

    live_posts.append(post)


def get_live_posts():

    return list(live_posts)


def run_live_analysis():

    posts = get_live_posts()

    suspicious_pairs = (
        detect_semantic_similarity(
            posts
        )
    )

    clusters = (
        build_coordination_clusters(
            suspicious_pairs
        )
    )

    timing_analysis = (
        detect_timing_coordination(
            suspicious_pairs,
            posts
        )
    )

    risk_analysis = (
        calculate_risk_score(
            clusters,
            timing_analysis
        )
    )

    graph_data = (
        generate_graph_data(
            clusters,
            risk_analysis
        )
    )

    return {

        "clusters":
            clusters,

        "risk_analysis":
            risk_analysis,

        "graph_data":
            graph_data
    }