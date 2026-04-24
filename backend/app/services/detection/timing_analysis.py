TIME_WINDOW_SECONDS = 300


def calculate_time_difference(
    timestamp_1,
    timestamp_2
):

    return abs(
        (
            timestamp_2 - timestamp_1
        ).total_seconds()
    )


def detect_timing_coordination(
    suspicious_pairs,
    processed_posts
):

    username_to_post = {
        post["username"]: post
        for post in processed_posts
    }

    timing_results = []

    for pair in suspicious_pairs:

        user_1 = pair["post_1"]
        user_2 = pair["post_2"]

        post_1 = username_to_post[user_1]
        post_2 = username_to_post[user_2]

        time_difference = (
            calculate_time_difference(
                post_1["timestamp"],
                post_2["timestamp"]
            )
        )

        coordinated = (
            time_difference
            <= TIME_WINDOW_SECONDS
        )

        timing_results.append({

            "post_1": user_1,

            "post_2": user_2,

            "time_difference_seconds":
                round(time_difference, 2),

            "timing_coordinated":
                coordinated
        })

    return timing_results