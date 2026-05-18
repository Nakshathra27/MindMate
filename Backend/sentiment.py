try:
    from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
    VADER_AVAILABLE = True
except ImportError:
    VADER_AVAILABLE = False

try:
    from textblob import TextBlob
    TEXTBLOB_AVAILABLE = True
except ImportError:
    TEXTBLOB_AVAILABLE = False


def analyze_sentiment(text: str) -> dict:
    result = {
        "label": "neutral",
        "confidence": 0.5,
        "compound": 0.0,
        "scores": {}
    }

    if VADER_AVAILABLE:
        analyzer = SentimentIntensityAnalyzer()
        scores = analyzer.polarity_scores(text)
        compound = scores["compound"]
        result["compound"] = compound
        result["scores"] = scores

        if compound >= 0.05:
            result["label"] = "positive"
            result["confidence"] = min(0.95, 0.5 + compound * 0.5)
        elif compound <= -0.05:
            result["label"] = "negative"
            result["confidence"] = min(0.95, 0.5 + abs(compound) * 0.5)
        else:
            result["label"] = "neutral"
            result["confidence"] = 0.6

    elif TEXTBLOB_AVAILABLE:
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        result["compound"] = polarity
        result["scores"] = {
            "polarity": polarity,
            "subjectivity": blob.sentiment.subjectivity
        }

        if polarity > 0.05:
            result["label"] = "positive"
            result["confidence"] = min(0.9, 0.5 + polarity * 0.4)
        elif polarity < -0.05:
            result["label"] = "negative"
            result["confidence"] = min(0.9, 0.5 + abs(polarity) * 0.4)
        else:
            result["label"] = "neutral"
            result["confidence"] = 0.6

    else:
        text_lower = text.lower()
        positive_words = ["happy", "great", "amazing", "good", "wonderful",
                         "excited", "grateful", "joyful", "peaceful", "calm"]
        negative_words = ["sad", "terrible", "awful", "bad", "depressed",
                         "anxious", "stressed", "angry", "frustrated", "hopeless"]

        pos_count = sum(1 for w in positive_words if w in text_lower)
        neg_count = sum(1 for w in negative_words if w in text_lower)

        if pos_count > neg_count:
            result["label"] = "positive"
            result["confidence"] = 0.6
        elif neg_count > pos_count:
            result["label"] = "negative"
            result["confidence"] = 0.6

    return result