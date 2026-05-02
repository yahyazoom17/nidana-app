"""
Report Data Extractor — Nidana

Uses the NVIDIA LLM to parse OCR-extracted report text into structured
JSON matching the Supabase schema.  The output feeds directly into
`report_persister.persist_report_data()`.
"""

import json
import os
import re
from typing import Any

from openai import OpenAI

# ── LLM client (same model used by CrewAI agents) ─────────────────

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=os.getenv("NVIDIA_API_KEY"),
        )
    return _client

MODEL_ID = "meta/llama-4-maverick-17b-128e-instruct"

# ── Extraction prompt ─────────────────────────────────────────────

EXTRACTION_PROMPT = """You are a medical report data extractor. Analyze the following medical report text and extract ALL relevant health data into a structured JSON object.

IMPORTANT: Return ONLY a valid JSON object — no markdown, no explanation, no code fences. Just raw JSON.

The JSON must have the following top-level keys (use empty arrays/objects if no data found for a section):

{
  "health_indicators": [
    {
      "indicator_name": "string (e.g. Blood Sugar, Cholesterol, HbA1c, Hemoglobin, etc.)",
      "value": number,
      "unit": "string (e.g. mg/dL, %, g/dL, etc.)"
    }
  ],
  "vital_signs": {
    "bp_systolic": number or null,
    "bp_diastolic": number or null,
    "heart_rate": number or null,
    "temperature": number or null,
    "spo2": number or null,
    "respiratory_rate": number or null,
    "notes": "string or null"
  },
  "prescriptions": [
    {
      "medication_name": "string",
      "dosage": "string (e.g. 500mg)",
      "frequency": "string (e.g. Twice daily)",
      "status": "upcoming",
      "ai_insight": "string — a brief AI-generated insight about this medication"
    }
  ],
  "lifestyle": {
    "sleep_hours": number or null,
    "sleep_quality_pct": number or null,
    "water_glasses": number or null,
    "exercise_recommendations": [
      {
        "exercise_name": "string",
        "duration_min": number,
        "calories_burned": number
      }
    ],
    "diet_recommendations": [
      {
        "meal_type": "Breakfast | Lunch | Snack | Dinner",
        "items": [
          {"name": "string", "calories": number}
        ],
        "total_calories": number
      }
    ]
  },
  "ai_trends": [
    {
      "trend_title": "string — concise title",
      "trend_summary": "string — 1-2 sentence analysis/insight from the report",
      "category": "glycemic | recovery | general"
    }
  ],
  "report_summary": "string — a concise 2-3 sentence summary of the overall report findings"
}

Extract as much data as possible. For values not present in the report, use null or empty arrays. Infer reasonable AI insights based on the data.

MEDICAL REPORT TEXT:
---
{report_text}
---

Return ONLY the JSON object:"""


def extract_report_data(report_text: str) -> dict[str, Any]:
    """
    Send the OCR text to the LLM and parse the structured JSON response.

    Returns a dict matching the schema above, or a minimal fallback if
    parsing fails.
    """
    if not report_text or not report_text.strip():
        return _empty_result()

    try:
        response = _get_client().chat.completions.create(
            model=MODEL_ID,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a precise medical data extraction assistant. "
                        "Always respond with valid JSON only."
                    ),
                },
                {
                    "role": "user",
                    "content": EXTRACTION_PROMPT.format(report_text=report_text),
                },
            ],
            temperature=0.2,
            max_tokens=2048,
        )

        raw = response.choices[0].message.content or ""
        return _parse_llm_json(raw)

    except Exception as exc:
        print(f"[report_extractor] LLM extraction failed: {exc}")
        return _empty_result()


# ── Helpers ────────────────────────────────────────────────────────

def _parse_llm_json(raw: str) -> dict[str, Any]:
    """Best-effort parse of the LLM output."""
    # Strip markdown fences if the model wraps them anyway
    cleaned = raw.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
        if isinstance(data, dict):
            return data
    except json.JSONDecodeError:
        pass

    # Try to find a JSON object within the text
    match = re.search(r"\{[\s\S]*\}", cleaned)
    if match:
        try:
            data = json.loads(match.group())
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            pass

    print(f"[report_extractor] Could not parse LLM response: {raw[:200]}...")
    return _empty_result()


def _empty_result() -> dict[str, Any]:
    return {
        "health_indicators": [],
        "vital_signs": {},
        "prescriptions": [],
        "lifestyle": {},
        "ai_trends": [],
        "report_summary": "",
    }
