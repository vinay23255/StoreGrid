"""
Unit tests for the StoreGrid feedback classifier.
Tests rule matching, category resolution, Telugu-English phrases,
conflict detection, edge cases, and text normalization.
"""

import pytest
from classifier import (
    CATEGORY_BILLING_DELAY,
    CATEGORY_EQUIPMENT_FAILURE,
    CATEGORY_NEEDS_REVIEW,
    CATEGORY_OTHER,
    CATEGORY_PRODUCT_QUALITY,
    CATEGORY_STAFF_BEHAVIOUR,
    CATEGORY_STOCK_SHORTAGE,
    clean_text,
    classify_text,
)


class TestTextNormalization:
    """Verifies that original text is preserved and cleanedText is properly normalized."""

    def test_whitespace_and_casing(self):
        raw = "   Billing   Chala   SLOW   ga   undi!   \n\t"
        cleaned = clean_text(raw)
        assert cleaned == "billing chala slow ga undi!"

    def test_empty_and_none(self):
        assert clean_text("") == ""
        assert clean_text(None) == ""
        assert clean_text("    ") == ""

    def test_original_text_preservation(self):
        raw = "  RUDE Staff at Counter!!  "
        result = classify_text(raw)
        assert result.original_text == raw
        assert result.cleaned_text == "rude staff at counter!!"


class TestCategoryStockShortage:
    """Tests at least 3 distinct examples for STOCK_SHORTAGE, including English and Telugu-English."""

    @pytest.mark.parametrize(
        "text",
        [
            "The sunflower oil was completely out of stock today.",
            "Empty shelves in the snack section, please restock soon.",
            "Items are unavailable on the shelf, zero inventory for eggs.",
            "Milk stock ledu bro, counter daggara adigithe ledhu annaru.",
            "Sarakulu levu shelves empty ga unnai store lo.",
        ],
    )
    def test_stock_shortage_examples(self, text: str):
        res = classify_text(text)
        assert res.category == CATEGORY_STOCK_SHORTAGE
        assert res.confidence >= 0.70
        assert res.needs_review is False
        assert len(res.matched_terms) > 0


class TestCategoryBillingDelay:
    """Tests at least 3 distinct examples for BILLING_DELAY, including English and Telugu-English."""

    @pytest.mark.parametrize(
        "text",
        [
            "Very slow billing at counter 3, waited 20 minutes in line.",
            "Huge queue at the billing counter and slow checkout process.",
            "Payment delay due to slow card machine, took forever to bill.",
            "Billing chala slow ga undi counter daggara.",
            "Line chala peddaga undi, billing late avtundi chala sepu aagalsi vachindi.",
        ],
    )
    def test_billing_delay_examples(self, text: str):
        res = classify_text(text)
        assert res.category == CATEGORY_BILLING_DELAY
        assert res.confidence >= 0.70
        assert res.needs_review is False
        assert len(res.matched_terms) > 0


class TestCategoryStaffBehaviour:
    """Tests at least 3 distinct examples for STAFF_BEHAVIOUR, including English and Telugu-English."""

    @pytest.mark.parametrize(
        "text",
        [
            "The cashier was very rude and showed bad attitude.",
            "Unprofessional staff yelling at customers and totally unhelpful.",
            "Terrible customer service, store assistant was arrogant.",
            "Staff rude ga matladaru counter daggara mariyada ledu.",
            "Staff sariga matladatledu and helpers sariga respond avvaledu.",
        ],
    )
    def test_staff_behaviour_examples(self, text: str):
        res = classify_text(text)
        assert res.category == CATEGORY_STAFF_BEHAVIOUR
        assert res.confidence >= 0.70
        assert res.needs_review is False
        assert len(res.matched_terms) > 0


class TestCategoryProductQuality:
    """Tests at least 3 distinct examples for PRODUCT_QUALITY, including English and Telugu-English."""

    @pytest.mark.parametrize(
        "text",
        [
            "The bread was stale and milk was expired by two days.",
            "Found rotten fruits and damaged packaging in dairy section.",
            "Foul smell coming from the meat and bad quality items.",
            "Curd stale ga undi and veggies rotten ga unnai.",
            "Milk expire aipoyindi, expiry date datipoyindi product paadaipoyindi.",
        ],
    )
    def test_product_quality_examples(self, text: str):
        res = classify_text(text)
        assert res.category == CATEGORY_PRODUCT_QUALITY
        assert res.confidence >= 0.70
        assert res.needs_review is False
        assert len(res.matched_terms) > 0


class TestCategoryEquipmentFailure:
    """Tests at least 3 distinct examples for EQUIPMENT_FAILURE, including English and Telugu-English."""

    @pytest.mark.parametrize(
        "text",
        [
            "The barcode scanner is broken and pos not working.",
            "Refrigerator not cooling and freezer broken in frozen aisle.",
            "AC not working inside the store, feeling extremely suffocated.",
            "AC pani cheyatledu and pos machine pani cheyatledu.",
            "Card machine pani cheyatam ledu scanner work avvatledu.",
        ],
    )
    def test_equipment_failure_examples(self, text: str):
        res = classify_text(text)
        assert res.category == CATEGORY_EQUIPMENT_FAILURE
        assert res.confidence >= 0.70
        assert res.needs_review is False
        assert len(res.matched_terms) > 0


class TestCategoryOther:
    """Tests at least 3 distinct examples for OTHER category."""

    @pytest.mark.parametrize(
        "text",
        [
            "The parking space is way too small and car park was completely full.",
            "Store timings should be extended till 11 PM on weekends.",
            "Loved the store ambience, nice music and great discounts on clothes.",
            "Parking space ledu car park cheyadaniki chala kashtam.",
            "Offers chala bagunnai and overall shopping bagundi.",
        ],
    )
    def test_other_examples(self, text: str):
        res = classify_text(text)
        assert res.category == CATEGORY_OTHER
        assert res.confidence >= 0.70
        assert res.needs_review is False
        assert len(res.matched_terms) > 0


class TestCategoryNeedsReview:
    """Tests at least 3 distinct examples for NEEDS_REVIEW (empty, ambiguous, unrecognized, conflicts)."""

    def test_empty_and_whitespace(self):
        res_empty = classify_text("")
        assert res_empty.category == CATEGORY_NEEDS_REVIEW
        assert res_empty.confidence == 0.0
        assert res_empty.needs_review is True
        assert res_empty.matched_terms == []

        res_space = classify_text("     \t \n ")
        assert res_space.category == CATEGORY_NEEDS_REVIEW
        assert res_space.confidence == 0.0
        assert res_space.needs_review is True

    def test_ambiguous_short_messages(self):
        ambiguous_cases = [
            "ok",
            "okay",
            "fine",
            "something happened yesterday",
            "please check this",
            "visited today",
        ]
        for msg in ambiguous_cases:
            res = classify_text(msg)
            assert res.category == CATEGORY_NEEDS_REVIEW
            assert res.needs_review is True

    def test_unrecognized_messages(self):
        unrecognized = [
            "asdfghjklqwerty",
            "12345 67890 ???",
            "random bla bla not matching anything",
        ]
        for msg in unrecognized:
            res = classify_text(msg)
            assert res.category == CATEGORY_NEEDS_REVIEW
            assert res.confidence == 0.0
            assert res.needs_review is True
            assert res.matched_terms == []

    def test_conflicting_categories(self):
        # Conflicts between Staff Conduct and Product Quality
        conflict1 = "The cashier was very rude and the milk I bought was expired."
        res1 = classify_text(conflict1)
        assert res1.category == CATEGORY_NEEDS_REVIEW
        assert res1.needs_review is True
        assert res1.confidence == 0.40
        assert any("rude" in t for t in res1.matched_terms)
        assert any("expired" in t for t in res1.matched_terms)

        # Conflicts between Stock Shortage and Billing Delay
        conflict2 = "Sunflower oil is out of stock and billing chala slow ga undi."
        res2 = classify_text(conflict2)
        assert res2.category == CATEGORY_NEEDS_REVIEW
        assert res2.needs_review is True
        assert res2.confidence == 0.40
        assert any("out of stock" in t for t in res2.matched_terms)
        assert any("billing" in t for t in res2.matched_terms)

        # Conflicts between Equipment Failure and Staff Behaviour
        conflict3 = "Pos machine is broken and the staff was extremely rude."
        res3 = classify_text(conflict3)
        assert res3.category == CATEGORY_NEEDS_REVIEW
        assert res3.needs_review is True
        assert res3.confidence == 0.40


class TestTeluguEnglishCoverage:
    """Explicitly tests Telugu-English code-mixed phrases across categories."""

    def test_telugu_stock(self):
        res = classify_text("Store lo milk stock ledu")
        assert res.category == CATEGORY_STOCK_SHORTAGE
        assert res.needs_review is False

    def test_telugu_billing(self):
        res = classify_text("Billing chala slow ga undi counter daggara")
        assert res.category == CATEGORY_BILLING_DELAY
        assert res.needs_review is False

    def test_telugu_staff(self):
        res = classify_text("Staff rude ga matladaru mariyada ledu")
        assert res.category == CATEGORY_STAFF_BEHAVIOUR
        assert res.needs_review is False

    def test_telugu_quality(self):
        res = classify_text("Curd stale ga undi milk expire aipoyindi")
        assert res.category == CATEGORY_PRODUCT_QUALITY
        assert res.needs_review is False

    def test_telugu_equipment(self):
        res = classify_text("Store lo ac pani cheyatledu and scanner pani cheyatledu")
        assert res.category == CATEGORY_EQUIPMENT_FAILURE
        assert res.needs_review is False


class TestSyntheticDatasetConsistency:
    """Verifies that all 35 synthetic dataset records match their expected categories."""

    def test_all_sample_feedback_rows(self):
        import csv
        from pathlib import Path

        csv_path = Path(__file__).parent.parent / "sample_feedback.csv"
        assert csv_path.exists(), "sample_feedback.csv does not exist"

        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                res = classify_text(row["text"])
                assert res.category == row["expectedCategory"], (
                    f"Feedback {row['feedbackId']} failed: expected {row['expectedCategory']}, got {res.category}"
                )

