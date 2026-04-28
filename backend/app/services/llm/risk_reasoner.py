# app/services/risk/risk_reasoner.py

def generate_risk_explanation(
    cluster,
    risk_data,
    timing_analysis
):

    cluster_id = cluster["cluster_id"]

    account_count = cluster["account_count"]

    coordination_score = (
        cluster["average_coordination_score"]
    )

    risk_score = risk_data["risk_score"]

    risk_level = risk_data["risk_level"]

    cross_platform_links = cluster.get(
        "cross_platform_links",
        0
    )

    platforms = cluster.get(
        "platforms",
        []
    )

    coordinated_events = 0

    cluster_accounts = set(
        cluster["accounts"]
    )

    for event in timing_analysis:

        if (
            event["post_1"] in cluster_accounts
            and
            event["post_2"] in cluster_accounts
            and
            event["timing_coordinated"]
        ):

            coordinated_events += 1

    evidence = []

    # semantic coordination

    if coordination_score >= 0.90:
        evidence.append(
            "Extremely high semantic similarity detected across accounts."
        )

    elif coordination_score >= 0.70:
        evidence.append(
            "Strong semantic coordination detected between accounts."
        )

    elif coordination_score >= 0.50:
        evidence.append(
            "Moderate semantic coordination detected."
        )

    else:
        evidence.append(
            "Low semantic coordination detected."
        )

    # timing coordination

    if coordinated_events >= 5:
        evidence.append(
            "Heavy synchronized posting behavior observed."
        )

    elif coordinated_events >= 1:
        evidence.append(
            "Synchronized posting windows detected."
        )

    # scale analysis

    if account_count >= 20:
        evidence.append(
            "Large coordinated network identified."
        )

    elif account_count >= 5:
        evidence.append(
            "Multi-account coordination cluster detected."
        )

    # platform spread

    if cross_platform_links > 0:
        evidence.append(
            "Cross-platform amplification behavior detected."
        )

    # VERY CRITICAL detection

    for connection in cluster.get("connections", []):

        if (
            connection.get("severity")
            ==
            "VERY_CRITICAL"
        ):

            evidence.append(
                "Known fraud-pattern similarity matched."
            )

            break

    # risk interpretation

    if risk_level == "VERY_CRITICAL":

        assessment = """
Extremely high-risk coordinated threat detected.

Cluster behavior matches
fraudulent amplification patterns
with strong indicators of
malicious coordinated activity.

Immediate investigation recommended.
"""

    elif risk_level == "CRITICAL":

        assessment = """
High-confidence coordinated influence operation.

Behavior strongly indicates
organized manipulation activity
with deliberate amplification patterns.
"""

    elif risk_level == "HIGH":

        assessment = """
Strong indicators of coordinated
non-organic behavior detected.

Cluster demonstrates suspicious
amplification and synchronization patterns.
"""

    elif risk_level == "MEDIUM":

        assessment = """
Behavior suggests possible
coordinated amplification activity.

Further monitoring recommended.
"""

    else:

        assessment = """
Weak coordination indicators detected.

Insufficient evidence for
high-confidence attribution.
"""

    explanation = f"""
Coordinated Influence Analysis

Cluster ID:
{cluster_id}

Accounts Involved:
{account_count}

Platforms:
{", ".join(platforms) if platforms else "Unknown"}

Average Coordination Score:
{coordination_score}

Risk Score:
{risk_score}

Threat Level:
{risk_level}

Cross Platform Links:
{cross_platform_links}

Coordinated Timing Events:
{coordinated_events}

Evidence Summary:
- {'\n- '.join(evidence)}

Assessment:
{assessment.strip()}
"""

    return explanation.strip()