"""
StoreGrid NLP Feedback Classification Engine.

A modular, rule-based classifier for retail customer feedback.
Provides transparent, deterministic scoring, handles English and Telugu-English
code-mixed feedback, detects category conflicts conservatively, and normalizes text.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Final

# Supported operational categories
CATEGORY_STOCK_SHORTAGE: Final[str] = "STOCK_SHORTAGE"
CATEGORY_BILLING_DELAY: Final[str] = "BILLING_DELAY"
CATEGORY_STAFF_BEHAVIOUR: Final[str] = "STAFF_BEHAVIOUR"
CATEGORY_PRODUCT_QUALITY: Final[str] = "PRODUCT_QUALITY"
CATEGORY_EQUIPMENT_FAILURE: Final[str] = "EQUIPMENT_FAILURE"
CATEGORY_OTHER: Final[str] = "OTHER"
CATEGORY_NEEDS_REVIEW: Final[str] = "NEEDS_REVIEW"

SUPPORTED_CATEGORIES: Final[list[str]] = [
    CATEGORY_STOCK_SHORTAGE,
    CATEGORY_BILLING_DELAY,
    CATEGORY_STAFF_BEHAVIOUR,
    CATEGORY_PRODUCT_QUALITY,
    CATEGORY_EQUIPMENT_FAILURE,
    CATEGORY_OTHER,
    CATEGORY_NEEDS_REVIEW,
]

# Confidence threshold required to assign an operational category
MIN_CONFIDENCE_THRESHOLD: Final[float] = 0.60

# Score assigned when conflicting categories collide
CONFLICT_CONFIDENCE_SCORE: Final[float] = 0.40


@dataclass(frozen=True)
class Rule:
    pattern: re.Pattern[str]
    display_term: str
    weight: float


@dataclass
class ClassificationResult:
    original_text: str
    cleaned_text: str
    category: str
    confidence: float
    needs_review: bool
    matched_terms: list[str] = field(default_factory=list)


def clean_text(raw_text: str | None) -> str:
    """
    Normalizes feedback text:
    - Preserves string content
    - Converts to lowercase
    - Normalizes all whitespace (collapses consecutive spaces, newlines, tabs)
    """
    if not raw_text:
        return ""
    return " ".join(raw_text.lower().split())


def _compile_rule(regex_str: str, display_term: str, weight: float) -> Rule:
    return Rule(
        pattern=re.compile(regex_str, re.IGNORECASE),
        display_term=display_term,
        weight=weight,
    )


# ---------------------------------------------------------------------------
# Rule Definitions: Phrase rules (0.85-0.90) and Strong Keywords (0.70-0.75)
# Including English and Telugu-English transliterated expressions.
# ---------------------------------------------------------------------------

RULES: dict[str, list[Rule]] = {
    CATEGORY_STOCK_SHORTAGE: [
        # English Phrases (0.85)
        _compile_rule(r"\bout[- ]of[- ]stock\b", "out of stock", 0.85),
        _compile_rule(r"\bno[- ]stock\b", "no stock", 0.85),
        _compile_rule(r"\bnot in stock\b", "not in stock", 0.85),
        _compile_rule(r"\bempty shelves\b", "empty shelves", 0.85),
        _compile_rule(r"\bshelves (are |were )?(completely |totally |mostly )?empty\b", "shelves empty", 0.85),
        _compile_rule(r"\bshelf (is |was )?(completely |totally |mostly )?empty\b", "shelf empty", 0.85),
        _compile_rule(r"\bnot available\b", "not available", 0.85),
        _compile_rule(r"\bitem(s)? (is |are |was |were )?(completely |currently )?unavailable\b", "item unavailable", 0.85),
        _compile_rule(r"\bproduct(s)? (is |are |was |were )?(completely |currently )?unavailable\b", "product unavailable", 0.85),
        _compile_rule(r"\bsold[- ]out\b", "sold out", 0.85),
        _compile_rule(r"\bran out of\b", "ran out of", 0.85),
        _compile_rule(r"\brun out of\b", "run out of", 0.85),
        _compile_rule(r"\bstock shortage\b", "stock shortage", 0.85),
        _compile_rule(r"\bshortage of\b", "shortage of", 0.85),
        _compile_rule(r"\bneed(s)? to restock\b", "need to restock", 0.85),
        _compile_rule(r"\bnever in stock\b", "never in stock", 0.85),
        _compile_rule(r"\bzero inventory\b", "zero inventory", 0.85),
        _compile_rule(r"\bitems? missing from (the )?shelf\b", "items missing from shelf", 0.85),
        _compile_rule(r"\b(milk|bread|rice|oil|eggs|fruits|sugar|salt) (is |was |are |were )?(out of stock|unavailable|missing|not available)\b", "item out of stock", 0.85),
        # Telugu-English code-mixed phrases (0.85 - 0.90)
        _compile_rule(r"\bstock ledhu\b|\bstock ledu\b", "stock ledu", 0.90),
        _compile_rule(r"\bstock aipoyindi\b|\bstock ipoyindi\b|\bstock aypoindi\b|\bstock ayipoyindi\b", "stock aipoyindi", 0.90),
        _compile_rule(r"\bitems levu\b|\bitems lev\b|\bsarakulu levu\b", "items levu", 0.90),
        _compile_rule(r"\bshelves khali\b|\bshelves empty ga unnai\b|\bshelf khali\b", "shelves khali", 0.90),
        _compile_rule(r"\bavailable ledhu\b|\bavailable ledu\b", "available ledu", 0.90),
        _compile_rule(r"\bdhorakatledu\b|\bdorakatledu\b|\bdorakadam ledu\b|\bdhorakaledu\b|\bdorakaledu\b", "dorakatledu", 0.90),
        _compile_rule(r"\bstock undatledu\b|\bstock undadam ledu\b|\bstock ravadam ledu\b", "stock undatledu", 0.90),
        # Single strong keywords (0.70)
        _compile_rule(r"\bunstocked\b", "unstocked", 0.70),
        _compile_rule(r"\brestock\b|\brestocking\b", "restock", 0.70),
    ],

    CATEGORY_BILLING_DELAY: [
        # English Phrases (0.85)
        _compile_rule(r"\bbilling delay(s)?\b", "billing delay", 0.85),
        _compile_rule(r"\bslow billing\b", "slow billing", 0.85),
        _compile_rule(r"\bbilling (is |was )?(too |very |extremely |so )?slow\b", "billing slow", 0.85),
        _compile_rule(r"\blong queue(s)?\b", "long queue", 0.85),
        _compile_rule(r"\bhuge queue(s)?\b", "huge queue", 0.85),
        _compile_rule(r"\blong line(s)?\b", "long line", 0.85),
        _compile_rule(r"\bqueue is (too |very |extremely |so )?long\b", "queue is too long", 0.85),
        _compile_rule(r"\bline is (too |very |extremely |so )?long\b", "line is too long", 0.85),
        _compile_rule(r"\bwaiting in (a )?(long )?(line|queue)\b", "waiting in line", 0.85),
        _compile_rule(r"\bcounter delay(s)?\b", "counter delay", 0.85),
        _compile_rule(r"\bslow checkout\b|\bcheckout delay(s)?\b", "slow checkout", 0.85),
        _compile_rule(r"\bpayment delay(s)?\b|\bdelayed payment\b", "payment delay", 0.85),
        _compile_rule(r"\bpayment (is |was )?(very |too |extremely )?slow\b|\bupi (is |was )?(very |too )?slow\b", "payment slow", 0.85),
        _compile_rule(r"\btook forever to bill\b|\btook forever at (the )?billing\b", "took forever to bill", 0.85),
        _compile_rule(r"\bwaiting (too long|a long time) at (the )?(billing|counter)\b", "waiting too long at counter", 0.85),
        _compile_rule(r"\bbilling counter rush\b|\bcrowded billing\b", "billing counter rush", 0.85),
        _compile_rule(r"\bcashier (is |was )?(too |very |extremely |so )?slow\b", "cashier slow", 0.85),
        _compile_rule(r"\b(took|waited) (10|15|20|30|40|45) (min|mins|minutes) (for|at) billing\b", "billing wait time", 0.85),
        # Telugu-English code-mixed phrases (0.85 - 0.90)
        _compile_rule(r"\bbilling chala slow( ga undi)?\b", "billing chala slow ga undi", 0.90),
        _compile_rule(r"\bbilling slow ga undi\b", "billing slow ga undi", 0.90),
        _compile_rule(r"\bbilling late( avtundi| aindi)?\b", "billing late", 0.90),
        _compile_rule(r"\bqueue chala ekkuva\b|\bqueue ekkuva\b", "queue chala ekkuva", 0.90),
        _compile_rule(r"\bline chala peddaga( undi)?\b|\bline peddaga undi\b", "line chala peddaga", 0.90),
        _compile_rule(r"\bchala sepu aagalsi vachindi\b|\bchala sepu wait cheyalsi vachindi\b", "chala sepu aagalsi vachindi", 0.90),
        _compile_rule(r"\bbilling (counter )?daggara wait\b", "billing counter daggara wait", 0.90),
        _compile_rule(r"\bcounter chala slow\b", "counter chala slow", 0.90),
        _compile_rule(r"\bpayment avvatledu\b|\bupi avvatledu\b", "payment avvatledu", 0.90),
        _compile_rule(r"\bchala late billing\b", "chala late billing", 0.90),
        # Strong keywords (0.70)
        _compile_rule(r"\bcheckout-delay\b", "checkout-delay", 0.70),
    ],

    CATEGORY_STAFF_BEHAVIOUR: [
        # English Phrases (0.85)
        _compile_rule(r"\brude staff\b|\bstaff (is |was )?(very |too |extremely |so )?rude\b", "rude staff", 0.85),
        _compile_rule(r"\bstaff behavio(u)?r\b", "staff behaviour", 0.85),
        _compile_rule(r"\bbad attitude\b|\brude attitude\b", "bad attitude", 0.85),
        _compile_rule(r"\bunhelpful staff\b|\bstaff (is |was )?(very |too |extremely |so )?unhelpful\b", "unhelpful staff", 0.85),
        _compile_rule(r"\bimpolite staff\b|\bdisrespectful staff\b", "impolite staff", 0.85),
        _compile_rule(r"\bcashier (is |was )?(very |too |extremely |so )?rude\b|\bmanager (is |was )?(very |too |extremely |so )?rude\b", "cashier was rude", 0.85),
        _compile_rule(r"\barrogant staff\b|\bstaff (is |was )?(very |too |extremely |so )?arrogant\b", "arrogant staff", 0.85),
        _compile_rule(r"\bpoor customer service\b|\bterrible customer service\b|\bbad customer service\b", "poor customer service", 0.85),
        _compile_rule(r"\bunprofessional staff\b|\bunprofessional behavio(u)?r\b", "unprofessional staff", 0.85),
        _compile_rule(r"\bstaff ignored\b|\bworkers ignored\b", "staff ignored", 0.85),
        _compile_rule(r"\bshouting at customer(s)?\b|\byelling at customer(s)?\b", "shouting at customers", 0.85),
        _compile_rule(r"\bemployee attitude\b|\bworker attitude\b", "employee attitude", 0.85),
        _compile_rule(r"\bstore assistant unhelpful\b", "store assistant unhelpful", 0.85),
        # Telugu-English code-mixed phrases (0.85 - 0.90)
        _compile_rule(r"\bstaff rude ga( matladaru)?\b|\brude ga matladaru\b", "staff rude ga matladaru", 0.90),
        _compile_rule(r"\bstaff sariga matladatledu\b|\bsarigga matladatledu\b|\bsariga matladaledu\b", "staff sariga matladatledu", 0.90),
        _compile_rule(r"\bstaff behavio(u)?r bagoledu\b|\bstaff behavio(u)?r bagaledu\b", "staff behaviour bagoledu", 0.90),
        _compile_rule(r"\bworker sariga respond avvaledu\b|\bhelpers respond avvaledu\b", "worker sariga respond avvaledu", 0.90),
        _compile_rule(r"\bcashier arrogant ga( unnadu)?\b|\bstaff arrogant ga\b", "cashier arrogant ga", 0.90),
        _compile_rule(r"\bstaff pattinchukoled(h)?u\b|\bpattinchukovatledu\b", "staff pattinchukoledu", 0.90),
        _compile_rule(r"\bmariyada led(h)?u\b|\bmaryada ledu\b", "mariyada ledu", 0.90),
        _compile_rule(r"\bstaff chala rude\b", "staff chala rude", 0.90),
        _compile_rule(r"\bsarigga samadhanam cheppatledu\b|\bsamadhanam cheppaledu\b", "sarigga samadhanam cheppatledu", 0.90),
        # Strong keywords (0.70 - 0.75)
        _compile_rule(r"\brude\b", "rude", 0.75),
        _compile_rule(r"\bimpolite\b", "impolite", 0.70),
        _compile_rule(r"\bdisrespectful\b", "disrespectful", 0.75),
        _compile_rule(r"\bmisbehaved\b|\bmisbehavio(u)?r\b", "misbehaved", 0.75),
        _compile_rule(r"\bunprofessional\b", "unprofessional", 0.70),
        _compile_rule(r"\barrogant\b", "arrogant", 0.70),
    ],

    CATEGORY_PRODUCT_QUALITY: [
        # English Phrases (0.85)
        _compile_rule(r"\bexpired product(s)?\b|\bexpired item(s)?\b", "expired product", 0.85),
        _compile_rule(r"\bexpiry date passed\b|\bpast expiry\b|\bcrossed expiry date\b", "expiry date passed", 0.85),
        _compile_rule(r"\bstale bread\b|\bstale food\b|\bstale product(s)?\b|\bstale item(s)?\b", "stale food", 0.85),
        _compile_rule(r"\bspoiled milk\b|\bspoiled item(s)?\b|\bspoiled product(s)?\b", "spoiled milk", 0.85),
        _compile_rule(r"\brotten fruit(s)?\b|\brotten vegetable(s)?\b|\brotten veggies\b", "rotten fruits", 0.85),
        _compile_rule(r"\bdamaged package\b|\bdamaged packaging\b|\bdamaged item(s)?\b|\bdamaged product(s)?\b", "damaged package", 0.85),
        _compile_rule(r"\bbroken seal\b|\bleaking packet\b|\btorn pack\b", "broken seal", 0.85),
        _compile_rule(r"\bbad quality\b|\bpoor quality\b|\bterrible quality\b|\bworst quality\b", "poor quality", 0.85),
        _compile_rule(r"\bfungus on\b|\bmold on\b|\bmould on\b", "fungus on product", 0.85),
        _compile_rule(r"\bsour milk\b|\bfoul smell\b|\bbad smell\b", "foul smell", 0.85),
        _compile_rule(r"\bdecayed vegetable(s)?\b|\bdecayed fruit(s)?\b", "decayed vegetables", 0.85),
        _compile_rule(r"\bsubstandard item\b|\bdefective item\b", "defective item", 0.85),
        _compile_rule(r"\btasted bad\b|\binedible food\b", "inedible food", 0.85),
        _compile_rule(r"\b(milk|bread|curd|meat|fruits|vegetables|cheese) (is |was )?(expired|spoiled|rotten|stale|damaged|smelly)\b", "spoiled/expired item", 0.85),
        # Telugu-English code-mixed phrases (0.85 - 0.90)
        _compile_rule(r"\bcurd stale ga undi\b|\bstale ga undi\b", "curd stale ga undi", 0.90),
        _compile_rule(r"\bfruits rotten ga unnai\b|\bveggies rotten ga unnai\b", "fruits rotten ga unnai", 0.90),
        _compile_rule(r"\bmilk expire aipoyindi\b|\bexpire aipoyindi\b|\bexpired aipoyindi\b", "milk expire aipoyindi", 0.90),
        _compile_rule(r"\bdate datipoyindi\b|\bexpiry date datipoyindi\b", "expiry date datipoyindi", 0.90),
        _compile_rule(r"\bdamaged ga vachindi\b|\bdamaged ga undi\b", "damaged ga vachindi", 0.90),
        _compile_rule(r"\bquality chala worst\b|\bquality bagoledu\b|\bquality bagaledu\b", "quality bagoledu", 0.90),
        _compile_rule(r"\bbad smell vastondi\b|\bsmell vastundi\b", "bad smell vastondi", 0.90),
        _compile_rule(r"\bproduct paadaipoyindi\b|\bpaadaipoyindi\b|\bpadaipoyindi\b|\bcheddipoindi\b", "product paadaipoyindi", 0.90),
        _compile_rule(r"\bkullipoina( fruits| veggies)?\b|\bkullipoyayi\b", "kullipoyayi", 0.90),
        # Strong keywords (0.70 - 0.75)
        _compile_rule(r"\bexpired\b", "expired", 0.75),
        _compile_rule(r"\bspoiled\b", "spoiled", 0.75),
        _compile_rule(r"\brotten\b", "rotten", 0.75),
        _compile_rule(r"\bstale\b", "stale", 0.75),
        _compile_rule(r"\binedible\b", "inedible", 0.70),
    ],

    CATEGORY_EQUIPMENT_FAILURE: [
        # English Phrases (0.85)
        _compile_rule(r"\bpos not working\b|\bpos machine (is |was )?(not working|down|broken)\b", "pos not working", 0.85),
        _compile_rule(r"\bpos down\b|\bpos failure\b", "pos failure", 0.85),
        _compile_rule(r"\bscanner (is |was )?(broken|not working)\b|\bbarcode scanner (not reading|not working|broken)\b", "scanner broken", 0.85),
        _compile_rule(r"\bfridge not cooling\b|\brefrigerator (not cooling|broken|not working)\b", "fridge not cooling", 0.85),
        _compile_rule(r"\bac not working\b|\bac (is |was )?broken\b|\bair condition(ing|er) (not working|down|broken)\b", "ac not working", 0.85),
        _compile_rule(r"\bcard machine (not working|down|broken|failed)\b|\bcard swipe machine (not working|broken)\b", "card machine not working", 0.85),
        _compile_rule(r"\bweighing scale (broken|not working)\b|\bweighing machine (broken|not working)\b", "weighing scale broken", 0.85),
        _compile_rule(r"\bfreezer (broken|not working|not cooling)\b", "freezer broken", 0.85),
        _compile_rule(r"\bescalator (stopped|not working|broken)\b", "escalator stopped", 0.85),
        _compile_rule(r"\btrolley (is |was )?broken\b|\bbroken cart\b|\bcart wheel broken\b", "trolley broken", 0.85),
        _compile_rule(r"\bbilling machine (crash|down|broken|not working)\b", "billing machine crash", 0.85),
        _compile_rule(r"\blift (not working|broken)\b|\belevator (not working|broken|out of order)\b", "lift not working", 0.85),
        # Telugu-English code-mixed phrases (0.85 - 0.90)
        _compile_rule(r"\bac pani cheyatledu\b|\bac panichedham ledu\b|\bac pani cheyadam ledu\b", "ac pani cheyatledu", 0.90),
        _compile_rule(r"\bpos machine pani cheyatledu\b|\bpos pani cheyatledu\b", "pos machine pani cheyatledu", 0.90),
        _compile_rule(r"\bscanner pani cheyatledu\b|\bscanner work avvatledu\b", "scanner pani cheyatledu", 0.90),
        _compile_rule(r"\brefrigerator cooling ledu\b|\bfridge cooling ledu\b", "refrigerator cooling ledu", 0.90),
        _compile_rule(r"\bcard machine pani cheyatam ledu\b|\bcard machine pani cheyatledu\b", "card machine pani cheyatam ledu", 0.90),
        _compile_rule(r"\bfridge aagipoyindi\b", "fridge aagipoyindi", 0.90),
        _compile_rule(r"\bsystem down aindi\b|\bsystem down aipoyindi\b", "system down aindi", 0.90),
        _compile_rule(r"\btrolley wheel broken\b|\btrolley pani cheyatledu\b", "trolley pani cheyatledu", 0.90),
        _compile_rule(r"\bscale pani cheyatledu\b", "scale pani cheyatledu", 0.90),
        _compile_rule(r"\blift pani cheyatledu\b", "lift pani cheyatledu", 0.90),
        # Strong keywords (0.70)
        _compile_rule(r"\bmalfunctioning\b", "malfunctioning", 0.70),
    ],

    CATEGORY_OTHER: [
        # English Phrases (0.85)
        _compile_rule(r"\bparking space\b|\bno parking\b|\bcar park(ing)?\b|\bparking lot\b|\bparking issue(s)?\b", "parking space", 0.85),
        _compile_rule(r"\bstore timing(s)?\b|\bopening hour(s)?\b|\bclosing time\b|\bopen early\b|\bclose late\b", "store timings", 0.85),
        _compile_rule(r"\bstore ambience\b|\blighting too dim\b|\bloud music\b|\bnice music\b|\bstore atmosphere\b", "store ambience", 0.85),
        _compile_rule(r"\bgreat discount(s)?\b|\bgood offer(s)?\b|\bgreat deal(s)?\b|\bpricing is high\b|\boverpriced\b", "pricing or discounts", 0.85),
        _compile_rule(r"\bwheelchair access\b|\bwheelchair ramp\b", "wheelchair access", 0.85),
        _compile_rule(r"\bcleanliness of restroom(s)?\b|\bwashroom facilit(y|ies)\b|\brestroom clean\b|\bbathroom dirty\b", "washroom facility", 0.85),
        _compile_rule(r"\bgood shopping experience\b|\blove this store\b|\bnice collection\b|\bpleasant experience\b", "general store experience", 0.85),
        _compile_rule(r"\bstore location\b|\bdifficult to locate\b", "store location", 0.85),
        # Telugu-English code-mixed phrases (0.85 - 0.90)
        _compile_rule(r"\bparking space led(h)?u\b|\bparking kashtam( ga undi)?\b", "parking space ledu", 0.90),
        _compile_rule(r"\bstore timings marchandi\b|\btimings bagoledu\b", "store timings marchandi", 0.90),
        _compile_rule(r"\boffers chala bagunnai\b|\bdiscounts levu\b", "offers chala bagunnai", 0.90),
        _compile_rule(r"\blighting chala dark ga undi\b|\blighting dim ga undi\b", "lighting dim ga undi", 0.90),
        _compile_rule(r"\bwashroom clean ga led(h)?u\b", "washroom clean ga ledu", 0.90),
        _compile_rule(r"\bstore location chala duram\b", "store location duram", 0.90),
        _compile_rule(r"\boverall shopping bagundi\b|\bchala bagundi store\b", "overall shopping bagundi", 0.90),
        # Strong keywords (0.70)
        _compile_rule(r"\bparking\b", "parking", 0.70),
        _compile_rule(r"\bwashroom\b|\brestroom\b", "washroom", 0.70),
        _compile_rule(r"\boverpriced\b", "overpriced", 0.70),
    ],
}


def classify_text(raw_text: str | None) -> ClassificationResult:
    """
    Classifies a customer feedback message using rule-based keyword & phrase matching.

    Scoring Approach:
    - Normalizes raw text into lowercase with single-spaced whitespace.
    - Matches pre-defined phrase rules (multi-word, 0.85-0.90 weight) and keyword rules (0.70-0.75 weight).
    - Uses regular expression word boundaries (\\b) to avoid arbitrary substring matches.
    - Category score = max matched rule weight + 0.05 per additional distinct matched term (capped at 0.95).
    - Conservative Conflict Resolution: If two or more actionable categories have strong matches (score >= 0.65),
      we classify as 'NEEDS_REVIEW' with confidence 0.40 and flag needsReview=True, consolidating matched terms.
    - Low-confidence or uninformative text (empty, gibberish, vague words, score < 0.60) defaults to
      'NEEDS_REVIEW' with needsReview=True.
    """
    original = raw_text if raw_text is not None else ""
    cleaned = clean_text(original)

    # Fast-path for empty or whitespace-only text
    if not cleaned:
        return ClassificationResult(
            original_text=original,
            cleaned_text="",
            category=CATEGORY_NEEDS_REVIEW,
            confidence=0.0,
            needs_review=True,
            matched_terms=[],
        )

    # Evaluate matches per category
    category_scores: dict[str, float] = {}
    category_matches: dict[str, list[str]] = {}

    for cat, rules in RULES.items():
        matched_terms: list[str] = []
        max_weight = 0.0

        for rule in rules:
            if rule.pattern.search(cleaned):
                if rule.display_term not in matched_terms:
                    matched_terms.append(rule.display_term)
                if rule.weight > max_weight:
                    max_weight = rule.weight

        if matched_terms:
            # Score formula: base max weight + 0.05 bonus for each reinforcement term, capped at 0.95
            reinforcement_bonus = min(0.10, (len(matched_terms) - 1) * 0.05)
            final_score = round(min(0.95, max_weight + reinforcement_bonus), 2)
            category_scores[cat] = final_score
            category_matches[cat] = matched_terms

    # Check if no rules matched
    if not category_scores:
        return ClassificationResult(
            original_text=original,
            cleaned_text=cleaned,
            category=CATEGORY_NEEDS_REVIEW,
            confidence=0.0,
            needs_review=True,
            matched_terms=[],
        )

    # Sort categories by score descending
    sorted_cats = sorted(category_scores.items(), key=lambda item: item[1], reverse=True)
    top_cat, top_score = sorted_cats[0]

    # Check for category conflicts:
    # If the top category and second category both have strong confidence (>= 0.65),
    # or both matched high-precision rules, handle conservatively as NEEDS_REVIEW.
    if len(sorted_cats) > 1:
        second_cat, second_score = sorted_cats[1]
        if second_score >= 0.65:
            # Combine matched terms from both conflicting categories
            all_conflict_terms = list(dict.fromkeys(
                category_matches[top_cat] + category_matches[second_cat]
            ))
            return ClassificationResult(
                original_text=original,
                cleaned_text=cleaned,
                category=CATEGORY_NEEDS_REVIEW,
                confidence=CONFLICT_CONFIDENCE_SCORE,
                needs_review=True,
                matched_terms=all_conflict_terms,
            )

    # If the top score is below threshold, route to NEEDS_REVIEW
    if top_score < MIN_CONFIDENCE_THRESHOLD:
        return ClassificationResult(
            original_text=original,
            cleaned_text=cleaned,
            category=CATEGORY_NEEDS_REVIEW,
            confidence=top_score,
            needs_review=True,
            matched_terms=category_matches.get(top_cat, []),
        )

    # Confident single-category assignment
    return ClassificationResult(
        original_text=original,
        cleaned_text=cleaned,
        category=top_cat,
        confidence=top_score,
        needs_review=False,
        matched_terms=category_matches[top_cat],
    )
