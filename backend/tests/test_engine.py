from app import engine
from app.extract import extract_fallback

RAMESH = {"state": "Bihar", "age": 42, "occupation": "farmer", "land_acres": 2}


def by_id(out, sid):
    return next((r for r in out["results"] if r["id"] == sid), None)


def test_ramesh_gets_three_farm_schemes():
    out = engine.match(RAMESH)
    eligible = {r["id"] for r in out["results"] if r["status"] == "eligible"}
    assert {"pm-kisan", "pmfby", "kcc"} <= eligible


def test_missing_land_is_needs_info_not_failure():
    out = engine.match({"occupation": "farmer"})
    assert by_id(out, "pm-kisan")["status"] == "needs_info"
    assert by_id(out, "pm-kisan")["missing_fields"] == ["land_acres"]


def test_near_miss_when_one_condition_fails():
    out = engine.match({"age": 45, "has_bank_account": True})
    r = by_id(out, "atal-pension")
    assert r["status"] == "near_miss"
    assert r["unmet"] == ["You are 40 years old or younger"]


def test_two_failures_hidden():
    out = engine.match({"age": 45, "has_bank_account": False})
    assert by_id(out, "atal-pension") is None


def test_documents_merged_without_duplicates():
    docs = engine.match(RAMESH)["merged_documents"]
    assert docs.count("Aadhaar") == 1
    assert "Land ownership record" in docs


def test_eligible_ranked_before_needs_info():
    out = engine.match({"occupation": "farmer", "land_acres": 2})
    statuses = [r["status"] for r in out["results"]]
    assert statuses == sorted(statuses, key=lambda s: ["eligible", "needs_info", "near_miss"].index(s))


def test_next_question_prefers_most_common_unknown():
    assert engine.match({})["ask_next_field"] in {"occupation", "age", "has_bank_account",
                                                  "has_girl_child_under_10"}


def test_fallback_extraction_english_and_hindi():
    assert extract_fallback("I am a farmer in Bihar, 42 years old, with 2 acres") == {
        "state": "Bihar", "age": 42, "land_acres": 2.0, "occupation": "farmer"}
    hi = extract_fallback("मैं बिहार का किसान हूँ, 2 एकड़ ज़मीन है")
    assert hi["state"] == "Bihar" and hi["occupation"] == "farmer" and hi["land_acres"] == 2.0
