"""Turn a free-text message (English or Hindi) into profile fields.

extract_with_llm uses Groq if GROQ_API_KEY is set; otherwise (or on any error)
extract_fallback uses simple regexes so the app and tests still work offline.
"""
import json
import os
import re
from typing import Optional

STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh",
]
HI_STATES = {
    "बिहार": "Bihar", "उत्तर प्रदेश": "Uttar Pradesh", "मध्य प्रदेश": "Madhya Pradesh",
    "राजस्थान": "Rajasthan", "महाराष्ट्र": "Maharashtra", "गुजरात": "Gujarat",
    "हरियाणा": "Haryana", "पंजाब": "Punjab", "झारखंड": "Jharkhand", "ओडिशा": "Odisha",
    "पश्चिम बंगाल": "West Bengal", "दिल्ली": "Delhi", "उत्तराखंड": "Uttarakhand",
    "छत्तीसगढ़": "Chhattisgarh", "तमिलनाडु": "Tamil Nadu", "कर्नाटक": "Karnataka",
}
OCCUPATION_WORDS = {
    "farmer": ["farmer", "farming", "किसान", "खेती"],
    "student": ["student", "छात्र", "छात्रा", "विद्यार्थी"],
    "small_business": ["shop", "small business", "business owner", "दुकान", "व्यापार", "व्यवसाय"],
    "salaried": ["salaried", "job", "employee", "नौकरी"],
}
FIELDS = ["state", "age", "gender", "occupation", "annual_income", "land_acres",
          "category", "has_bank_account", "has_girl_child_under_10"]

SYSTEM_PROMPT = """You extract a citizen profile from a message (English or Hindi) for a government
scheme eligibility checker. Return ONLY a JSON object with these keys; use null when the message does
not say. Never guess.
state (English name), age (integer), gender (male|female|other), occupation
(farmer|student|small_business|salaried|unemployed|other), annual_income (integer rupees),
land_acres (number), category (general|obc|sc|st|ews), has_bank_account (true|false),
has_girl_child_under_10 (true|false)."""


def extract_fallback(message: str) -> dict:
    text = message.lower()
    out: dict = {}
    for s in STATES:
        if s.lower() in text:
            out["state"] = s
            break
    else:
        for hi, en in HI_STATES.items():
            if hi in message:
                out["state"] = en
                break
    m = re.search(r"(\d{1,3})\s*(?:years|yrs|year|saal|साल|वर्ष)", text)
    if m:
        out["age"] = int(m.group(1))
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:acres?|एकड़)", text)
    if m:
        out["land_acres"] = float(m.group(1))
    for occ, words in OCCUPATION_WORDS.items():
        if any(w in text or w in message for w in words):
            out["occupation"] = occ
            break
    return out


async def extract_with_llm(message: str) -> Optional[dict]:
    key = os.getenv("GROQ_API_KEY")
    model = os.getenv("EXTRACT_MODEL") or "llama-3.3-70b-versatile"
    if not key:
        return None
    import httpx  # imported here so the engine and tests need no web libraries
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {key}"},
                json={
                    "model": model,
                    "temperature": 0,
                    "response_format": {"type": "json_object"},
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": message},
                    ],
                },
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
        content = re.sub(r"^```(?:json)?|```$", "", content.strip(), flags=re.M).strip()
        data = json.loads(content)
        return {k: v for k, v in data.items() if k in FIELDS and v is not None}
    except Exception:
        return None


async def extract(message: str) -> tuple[dict, str]:
    llm = await extract_with_llm(message)
    if llm is not None:
        return llm, "llm"
    return extract_fallback(message), "fallback"
