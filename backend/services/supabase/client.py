"""
Supabase client singleton for the Nidana backend.

Usage:
    from services.supabase import get_supabase_client

    supabase = get_supabase_client()
    # e.g. supabase.table("patients").select("*").execute()
"""

import os
from functools import lru_cache
from supabase import create_client, Client


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    """
    Returns a cached Supabase client instance.

    Requires the following environment variables:
        - SUPABASE_URL: Your Supabase project URL
        - SUPABASE_KEY: Your Supabase anon/service-role key

    Raises:
        ValueError: If the required environment variables are not set.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise ValueError(
            "SUPABASE_URL and SUPABASE_KEY environment variables must be set. "
            "Check your .env file."
        )

    return create_client(url, key)
