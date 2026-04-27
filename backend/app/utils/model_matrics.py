from datetime import datetime


def print_metric(
    model_name,
    metric_name,
    metric_value
):

    print(f"""

==================================================
MODEL METRIC
==================================================

time:
{datetime.utcnow()}

model:
{model_name}

metric:
{metric_name}

value:
{metric_value}

==================================================

""")