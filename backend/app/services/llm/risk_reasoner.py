from openai import OpenAI

from app.core.config import settings

from app.services.rag.retriever import (
    retrieve_matching_patterns
)

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)


def local_reasoning(
    cluster,
    risk_data
):

    account_count = (
        cluster["account_count"]
    )

    coordination = (
        cluster[
            "average_coordination_score"
        ]
    )

    risk_level = (
        risk_data["risk_level"]
    )

    return (
        f"This cluster shows signs of coordinated "
        f"narrative amplification. "

        f"{account_count} accounts shared highly "
        f"similar content with an average "
        f"coordination score of "
        f"{coordination}. "

        f"The activity pattern suggests "
        f"synchronized dissemination behavior. "

        f"Threat Level: {risk_level}."
    )


def generate_risk_explanation(
    cluster,
    risk_data,
    timing_analysis
):

    patterns = (
        retrieve_matching_patterns(
            cluster,
            timing_analysis
        )
    )

    pattern_text = ""

    if patterns:

        pattern_text = (
            "Matched Threat Patterns:\n"
        )

        for pattern in patterns:

            pattern_text += (

                f"- {pattern['pattern_name']}: "

                f"{pattern['description']}\n"
            )

    try:

        prompt = f"""

        You are a cyber threat analyst.

        Analyze this cluster.

        Cluster:
        {cluster}

        Risk:
        {risk_data}

        Threat Intelligence Matches:
        {pattern_text}

        Explain why this activity
        may indicate coordinated
        manipulation.

        Keep under 120 words.
        """

        response = (
            client.chat.completions.create(

                model="gpt-4.1-mini",

                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],

                temperature=0.3
            )
        )

        return (
            response
            .choices[0]
            .message
            .content
        )

    except Exception:

        return local_reasoning(
            cluster,
            risk_data
        )