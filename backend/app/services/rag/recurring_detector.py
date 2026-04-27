from collections import Counter

from app.services.rag.memory_store import (
    load_memory
)


def detect_recurring_accounts():

    history = load_memory()

    accounts = []

    for cluster in history:

        accounts.extend(
            cluster["accounts"]
        )

    counts = Counter(accounts)

    recurring = []

    for account, count in (
        counts.items()
    ):

        if count >= 2:

            recurring.append({

                "username":
                    account,

                "appearances":
                    count
            })

    return recurring