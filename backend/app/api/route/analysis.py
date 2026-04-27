# 📁 app/api/route/analysis.py

from fastapi import APIRouter

from app.schemas.analysis_schema import (
    AnalysisRequest
)

from app.services.preprocessing.cleaner import (
    clean_text
)

from app.services.detection.semantic_similarity import (
    detect_semantic_similarity
)

from app.services.detection.cluster_engine import (
    build_coordination_clusters
)

from app.services.detection.timing_analysis import (
    detect_timing_coordination
)

from app.services.detection.risk_scoring import (
    calculate_risk_score
)

from app.services.llm.retry_handler import (
    retry_llm_call
)

from app.services.rag.history_manager import (
    store_cluster_history
)

from app.services.rag.recurring_detector import (
    detect_recurring_accounts
)

from app.services.detection.evidence_collector import (
    collect_cluster_evidence
)

from app.services.llm.narrative_detector import (
    detect_narrative
)

from app.services.graph.graph_builder import (
    generate_graph_data
)

router = APIRouter()


@router.post("/analyze")
async def analyze_posts(payload: AnalysisRequest):

    # ----------------------------------------
    # preprocess posts
    # ----------------------------------------

    processed_posts = []

    for post in payload.posts:

        cleaned = clean_text(post.content)

        # 🚫 skip empty content
        if not cleaned.strip():
            continue

        processed_posts.append({

            "username": post.username,

            "cleaned_content": cleaned,

            "timestamp": post.timestamp,

            "platform": post.platform
        })

    # ----------------------------------------
    # semantic coordination detection
    # ----------------------------------------

    suspicious_pairs = (
        detect_semantic_similarity(
            processed_posts
        )
    )

    # ----------------------------------------
    # build clusters
    # ----------------------------------------

    clusters = build_coordination_clusters(
        suspicious_pairs,
        processed_posts
    )

    # ----------------------------------------
    # timing coordination
    # ----------------------------------------

    timing_analysis = (
        detect_timing_coordination(
            suspicious_pairs,
            processed_posts
        )
    )

    # ----------------------------------------
    # risk scoring
    # ----------------------------------------

    risk_analysis = (
        calculate_risk_score(
            clusters,
            timing_analysis
        )
    )

    # ----------------------------------------
    # recurring account detection
    # ----------------------------------------

    recurring_accounts = (
        detect_recurring_accounts()
    )

    # ----------------------------------------
    # save history ONCE
    # ----------------------------------------

    store_cluster_history(
        clusters,
        risk_analysis
    )

    # ----------------------------------------
    # llm explanations
    # ----------------------------------------

    explanations = []

    for cluster, risk_data in zip(
        clusters,
        risk_analysis
    ):

        explanation = (
            retry_llm_call(
                cluster,
                risk_data,
                timing_analysis
            )
        )

        explanations.append({

            "cluster_id":
                cluster["cluster_id"],

            "explanation":
                explanation
        })

    # ----------------------------------------
    # narrative detection
    # ----------------------------------------

    narratives = []

    for cluster in clusters:

        narratives.append({

            "cluster_id":
                cluster["cluster_id"],

            "analysis":
                detect_narrative(cluster)
        })

    # ----------------------------------------
    # evidence collection
    # ----------------------------------------

    evidence_reports = []

    for cluster in clusters:

        evidence_reports.append({

            "cluster_id":
                cluster["cluster_id"],

            "evidence":
                collect_cluster_evidence(
                    cluster,
                    timing_analysis
                )
        })

    # ----------------------------------------
    # graph visualization
    # ----------------------------------------

    graph_data = generate_graph_data(
        clusters,
        risk_analysis
    )

    # ----------------------------------------
    # final response
    # ----------------------------------------

    return {

        "total_posts":
            len(processed_posts),

        "suspicious_pairs_found":
            len(suspicious_pairs),

        "clusters_found":
            len(clusters),

        "timing_coordination_found":
            len([
                x for x in timing_analysis
                if x["timing_coordinated"]
            ]),

        "risk_analysis":
            risk_analysis,

        "llm_explanations":
            explanations,

        "graph_data":
            graph_data,

        "clusters":
            clusters,

        "timing_analysis":
            timing_analysis,

        "recurring_accounts":
            recurring_accounts,

        "narratives":
            narratives,

        "evidence_reports":
            evidence_reports
    }