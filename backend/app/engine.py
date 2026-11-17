"""Deterministic eligibility engine. Pure Python, no web or LLM dependencies.

A profile is a plain dict like {"state": "Bihar", "age": 42, "occupation": "farmer"}.
Missing fields are simply absent (or None), and are treated as "unknown", never as a failure.
"""
import json
from pathlib import Path
from typing import Any, Optional

SCHEMES_PATH = Path(__file__).parent / "data" / "schemes.json"

ELIGIBLE = "eligible"
NEEDS_INFO = "needs_info"
NEAR_MISS = "near_miss"
NOT_ELIGIBLE = "not_eligible"


def load_schemes(path: Path = SCHEMES_PATH) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _norm(v: Any) -> Any:
    return v.strip().lower() if isinstance(v, str) else v


def check_condition(cond: dict, profile: dict) -> Optional[bool]:
    """True = passes, False = fails, None = unknown (field not provided)."""
    val = profile.get(cond["field"])
    if val is None:
        return None
    op, target = cond["op"], cond.get("value")
    val, target = _norm(val), _norm(target)
    if op == "eq":
        return val == target
    if op == "in":
        return val in [_norm(t) for t in target]
    if op == "gte":
        return val >= target
    if op == "lte":
        return val <= target
    if op == "gt":
        return val > target
    if op == "lt":
        return val < target
    if op == "is_true":
        return bool(val) is True
    raise ValueError(f"Unknown operator: {op}")


def evaluate(scheme: dict, profile: dict) -> dict:
    passed, failed, unknown = [], [], []
    for cond in scheme["conditions"]:
        result = check_condition(cond, profile)
        bucket = passed if result is True else failed if result is False else unknown
        bucket.append(cond)

    if not failed and not unknown:
        status = ELIGIBLE
    elif not failed:
        status = NEEDS_INFO
    elif len(failed) == 1:
        status = NEAR_MISS
    else:
        status = NOT_ELIGIBLE

    return {
        "id": scheme["id"],
        "name": scheme["name"],
        "category": scheme["category"],
        "status": status,
        "benefit": scheme["benefit"],
        "why_matched": [c["label"] for c in passed],
        "unmet": [c["label"] for c in failed],  # near miss: "You'd qualify if..."
        "missing_fields": sorted({c["field"] for c in unknown}),
        "documents": scheme["documents"],
        "how_to_apply": scheme["how_to_apply"],
        "official_url": scheme.get("official_url"),
        "verified": scheme.get("verified", False),
        "last_checked": scheme.get("last_checked"),
        "_priority": scheme.get("priority", 0),
        "_failed_count": len(failed),
    }


def merge_documents(results: list[dict]) -> list[str]:
    """One checklist across eligible schemes, de-duplicated, order preserved."""
    seen, merged = set(), []
    for r in results:
        if r["status"] != ELIGIBLE:
            continue
        for doc in r["documents"]:
            key = doc.strip().lower()
            if key not in seen:
                seen.add(key)
                merged.append(doc)
    return merged


def pick_next_question(results: list[dict]) -> Optional[str]:
    """Most useful field to ask next: the one unknown across the most still-possible schemes."""
    counts: dict[str, int] = {}
    for r in results:
        if r["status"] in (NEEDS_INFO, NEAR_MISS):
            for f in r["missing_fields"]:
                counts[f] = counts.get(f, 0) + 1
    if not counts:
        return None
    return sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]


_STATUS_ORDER = {ELIGIBLE: 0, NEEDS_INFO: 1, NEAR_MISS: 2, NOT_ELIGIBLE: 3}


def match(profile: dict, schemes: Optional[list[dict]] = None) -> dict:
    schemes = schemes if schemes is not None else load_schemes()
    results = [evaluate(s, profile) for s in schemes]
    # Ranking: eligible first, then needs-info, near-miss; within a group by scheme priority.
    results.sort(key=lambda r: (_STATUS_ORDER[r["status"]], -r["_priority"], r["name"]))
    next_field = pick_next_question(results)
    for r in results:
        r.pop("_priority", None)
        r.pop("_failed_count", None)
    visible = [r for r in results if r["status"] != NOT_ELIGIBLE]
    return {
        "results": visible,
        "merged_documents": merge_documents(results),
        "ask_next_field": next_field,
    }
