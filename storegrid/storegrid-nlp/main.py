
from fastapi import FastAPI
from classifier import classify_text
from schemas import ClassificationResponse, FeedbackInput

app = FastAPI(
    title="StoreGrid NLP Service",
    description="Operational retail feedback classification API",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "message": "StoreGrid NLP Service is running!",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "storegrid-nlp",
        "version": "1.0.0",
    }



@app.post("/classify", response_model=ClassificationResponse)
def classify_feedback(feedback: FeedbackInput):
    classification = classify_text(feedback.text)

    return ClassificationResponse(
        feedbackId=feedback.feedbackId,
        storeId=feedback.storeId,
        originalText=classification.original_text,
        cleanedText=classification.cleaned_text,
        category=classification.category,
        confidence=classification.confidence,
        needsReview=classification.needs_review,
        matchedTerms=classification.matched_terms,
    )

