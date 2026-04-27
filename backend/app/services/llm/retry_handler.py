import time

from app.services.llm.risk_reasoner import (
    generate_risk_explanation
)


def retry_llm_call(
    cluster,
    risk_data,
    timing_analysis,
    retries=3
):

    for attempt in range(retries):

        try:

            return generate_risk_explanation(
                cluster,
                risk_data,
                timing_analysis
            )

        except Exception as error:

            print(
                f"LLM retry failed: {error}"
            )

            time.sleep(2)

    return (
        "LLM explanation unavailable."
    )