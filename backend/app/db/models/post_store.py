from app.db.database import (
    get_connection
)


def initialize_database():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS posts (

        id INTEGER PRIMARY KEY,

        username TEXT,

        content TEXT,

        timestamp TEXT,

        platform TEXT
    )

    """)

    conn.commit()

    conn.close()