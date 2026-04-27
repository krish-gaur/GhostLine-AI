import json
import os


MEMORY_FILE = (
    "datasets/history.json"
)


def load_memory():

    if not os.path.exists(
        MEMORY_FILE
    ):

        return []

    with open(
        MEMORY_FILE,
        "r"
    ) as file:

        return json.load(file)


def save_memory(data):

    with open(
        MEMORY_FILE,
        "w"
    ) as file:

        json.dump(
            data,
            file,
            indent=4
        )