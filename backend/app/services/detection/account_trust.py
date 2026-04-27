def calculate_account_trust(
    recurring_accounts
):

    trust_scores = []

    for account in recurring_accounts:

        appearances = (
            account["appearances"]
        )

        trust = max(
            0,
            100 - (
                appearances * 15
            )
        )

        trust_scores.append({

            "username":
                account["username"],

            "trust_score":
                trust
        })

    return trust_scores