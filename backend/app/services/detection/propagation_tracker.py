from datetime import datetime


def detect_propagation(
    posts
):

    sorted_posts = sorted(

        posts,

        key=lambda x:
            x["timestamp"]
    )

    propagation_chain = []

    for i in range(
        len(sorted_posts) - 1
    ):

        current = sorted_posts[i]

        nxt = sorted_posts[i + 1]

        t1 = datetime.fromisoformat(
            current["timestamp"]
        )

        t2 = datetime.fromisoformat(
            nxt["timestamp"]
        )

        delta = (
            t2 - t1
        ).seconds

        if delta < 300:

            propagation_chain.append({

                "source":
                    current["username"],

                "target":
                    nxt["username"],

                "delay_seconds":
                    delta
            })

    return propagation_chain