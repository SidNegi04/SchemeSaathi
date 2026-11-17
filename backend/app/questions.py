"""Follow-up questions, one per profile field, in English and Hindi."""

QUESTIONS = {
    "state": {
        "en": "Which state do you live in?",
        "hi": "आप किस राज्य में रहते हैं?",
    },
    "age": {
        "en": "How old are you?",
        "hi": "आपकी उम्र कितनी है?",
    },
    "gender": {
        "en": "What is your gender?",
        "hi": "आपका लिंग क्या है?",
    },
    "occupation": {
        "en": "What work do you do? (farmer, student, small business, salaried, other)",
        "hi": "आप क्या काम करते हैं? (किसान, छात्र, छोटा व्यवसाय, नौकरी, अन्य)",
    },
    "annual_income": {
        "en": "What is your family's yearly income in rupees?",
        "hi": "आपके परिवार की सालाना आय कितने रुपये है?",
    },
    "land_acres": {
        "en": "How many acres of land does your family own?",
        "hi": "आपके परिवार के पास कितने एकड़ ज़मीन है?",
    },
    "category": {
        "en": "Which category do you belong to? (General, OBC, SC, ST, EWS)",
        "hi": "आप किस श्रेणी में आते हैं? (सामान्य, OBC, SC, ST, EWS)",
    },
    "has_bank_account": {
        "en": "Do you have a bank account?",
        "hi": "क्या आपका बैंक खाता है?",
    },
    "has_girl_child_under_10": {
        "en": "Do you have a girl child under 10 years old?",
        "hi": "क्या आपके परिवार में 10 साल से छोटी बेटी है?",
    },
}

DISCLAIMER = {
    "en": "Please confirm eligibility and details on the official website before applying.",
    "hi": "आवेदन करने से पहले कृपया आधिकारिक वेबसाइट पर पात्रता और जानकारी की पुष्टि करें।",
}


def question_for(field: str, lang: str = "en") -> str:
    entry = QUESTIONS.get(field, {})
    return entry.get(lang) or entry.get("en", "")
