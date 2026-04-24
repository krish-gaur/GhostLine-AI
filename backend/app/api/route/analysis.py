from fastapi import APIRouter

from app.schemas.analysis_schema import AnalysisRequest

from app.services.preprocessing.cleaner import clean_text

from app.services.detection.semantic_similarity import detect_semantic_similarity

from app.services.detection.cluster_engine import build_coordination_clusters

from app.services.detection.timing_analysis import detect_timing_coordination

from app.services.detection.risk_scoring import calculate_risk_score

from app.services.llm.risk_reasoner import generate_risk_explanation

from app.services.rag.history_manager import store_cluster_history

from app.services.rag.recurring_detector import detect_recurring_accounts

from app.services.detection.evidence_collector import collect_cluster_evidence

from app.services.llm.narrative_detector import detect_narrative


router = APIRouter()


@router.post("/analyze")
async def analyze_posts(payload: AnalysisRequest):

    processed_posts = []

    for post in payload.posts:

        processed_posts.append({

            "username": post.username,

            "cleaned_content": clean_text(post.content),

            "timestamp": post.timestamp,

            "platform": post.platform
        })


    suspicious_pairs = detect_semantic_similarity(processed_posts)

    clusters = build_coordination_clusters(suspicious_pairs)

    timing_analysis = detect_timing_coordination(
        suspicious_pairs,
        processed_posts
    )

    risk_analysis = calculate_risk_score(
        clusters,
        timing_analysis
    )

    recurring_accounts = detect_recurring_accounts()


    # STORE HISTORY ONCE (IMPORTANT FIX)
    store_cluster_history(
        clusters,
        risk_analysis
    )


    explanations = []
    narratives = []
    evidence_reports = []


    for cluster, risk_data in zip(clusters, risk_analysis):

        explanation = generate_risk_explanation(
            cluster,
            risk_data,
            timing_analysis
        )

        explanations.append({

            "cluster_id": cluster["cluster_id"],
            "explanation": explanation
        })


    for cluster in clusters:

        narratives.append({

            "cluster_id": cluster["cluster_id"],
            "analysis": detect_narrative(cluster)
        })

        evidence_reports.append({

            "cluster_id": cluster["cluster_id"],
            "evidence": collect_cluster_evidence(
                cluster,
                timing_analysis
            )
        })


    return {

        "total_posts": len(processed_posts),

        "suspicious_pairs_found": len(suspicious_pairs),

        "clusters_found": len(clusters),

        "timing_coordination_found": len([
            x for x in timing_analysis if x["timing_coordinated"]
        ]),

        "risk_analysis": risk_analysis,

        "llm_explanations": explanations,

        "clusters": clusters,

        "timing_analysis": timing_analysis,

        "recurring_accounts": recurring_accounts,

        "narratives": narratives,

        "evidence_reports": evidence_reports
    }