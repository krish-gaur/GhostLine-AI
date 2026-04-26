from datetime import datetime


BURST_THRESHOLD = 120


def detect_burst_activity(
    posts
):

    timestamps = sorted([

        datetime.fromisoformat(
            post["timestamp"]
        )

        for post in posts
    ])

    bursts = 0

    for i in range(
        len(timestamps) - 1
    ):

        diff = (
            timestamps[i + 1]
            -
            timestamps[i]
        ).seconds

        if diff <= BURST_THRESHOLD:

            bursts += 1

    return {

        "burst_events":
            bursts,

        "burst_detected":
            bursts > 2
    }