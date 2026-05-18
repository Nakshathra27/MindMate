from datetime import datetime
from collections import Counter
import re


def detect_patterns(logs: list) -> dict:
    if not logs:
        return {"message": "No data yet. Start journaling to see patterns!"}

    insights = []
    scores = [log["mood_score"] for log in logs]
    avg = sum(scores) / len(scores)

    if len(scores) >= 3:
        first_half = scores[:len(scores)//2]
        second_half = scores[len(scores)//2:]
        first_avg = sum(first_half) / len(first_half)
        second_avg = sum(second_half) / len(second_half)

        if second_avg > first_avg + 0.5:
            insights.append({
                "type": "trend",
                "icon": "📈",
                "title": "Your mood is improving!",
                "detail": f"Your recent average ({second_avg:.1f}/10) is higher than earlier ({first_avg:.1f}/10)."
            })
        elif second_avg < first_avg - 0.5:
            insights.append({
                "type": "trend",
                "icon": "📉",
                "title": "Mood has been dipping lately",
                "detail": f"Your recent average ({second_avg:.1f}/10) is lower than earlier ({first_avg:.1f}/10). Consider what might be contributing."
            })

    if len(scores) >= 4:
        diffs = [abs(scores[i] - scores[i-1]) for i in range(1, len(scores))]
        volatility = sum(diffs) / len(diffs)
        if volatility > 3:
            insights.append({
                "type": "volatility",
                "icon": "🌊",
                "title": "High mood variability detected",
                "detail": "Your mood swings quite a bit day to day. Consistent sleep and routine can help stabilize this."
            })
        elif volatility < 1:
            insights.append({
                "type": "volatility",
                "icon": "⚖️",
                "title": "Very stable emotional state",
                "detail": "Your mood has been consistent — a sign of emotional regulation."
            })

    day_scores = {}
    for log in logs:
        try:
            dt = datetime.fromisoformat(log["timestamp"])
            day = dt.strftime("%A")
            if day not in day_scores:
                day_scores[day] = []
            day_scores[day].append(log["mood_score"])
        except Exception:
            pass

    if len(day_scores) >= 3:
        day_avgs = {day: sum(v)/len(v) for day, v in day_scores.items()}
        best_day = max(day_avgs, key=day_avgs.get)
        worst_day = min(day_avgs, key=day_avgs.get)
        if day_avgs[best_day] - day_avgs[worst_day] > 1:
            insights.append({
                "type": "weekly",
                "icon": "📅",
                "title": f"{best_day}s are your best days",
                "detail": f"You feel best on {best_day}s (avg {day_avgs[best_day]:.1f}/10) and lowest on {worst_day}s (avg {day_avgs[worst_day]:.1f}/10)."
            })

    keyword_mood = {}
    stop_words = {"i", "the", "a", "is", "was", "am", "and", "to", "it", "my",
                  "me", "so", "but", "in", "on", "at", "of", "for", "with", "had", "have"}

    for log in logs:
        words = re.findall(r'\b[a-z]{4,}\b', log["text"].lower())
        for word in words:
            if word not in stop_words:
                if word not in keyword_mood:
                    keyword_mood[word] = []
                keyword_mood[word].append(log["mood_score"])

    positive_keywords = []
    negative_keywords = []
    for word, word_scores in keyword_mood.items():
        if len(word_scores) >= 2:
            word_avg = sum(word_scores) / len(word_scores)
            if word_avg >= avg + 1.5:
                positive_keywords.append((word, word_avg))
            elif word_avg <= avg - 1.5:
                negative_keywords.append((word, word_avg))

    if positive_keywords:
        top_positive = sorted(positive_keywords, key=lambda x: x[1], reverse=True)[:3]
        words_str = ", ".join([f'"{w}"' for w, _ in top_positive])
        insights.append({
            "type": "keywords",
            "icon": "✨",
            "title": "Words linked to higher mood",
            "detail": f"Entries containing {words_str} tend to be on your better days."
        })

    if negative_keywords:
        top_negative = sorted(negative_keywords, key=lambda x: x[1])[:3]
        words_str = ", ".join([f'"{w}"' for w, _ in top_negative])
        insights.append({
            "type": "keywords",
            "icon": "⚠️",
            "title": "Words linked to lower mood",
            "detail": f"Entries containing {words_str} often appear on harder days."
        })

    if not insights:
        insights.append({
            "type": "info",
            "icon": "📝",
            "title": "Keep journaling for deeper insights",
            "detail": f"Your current average mood is {avg:.1f}/10. Log more entries to unlock pattern detection."
        })

    return {
        "insights": insights,
        "summary": {
            "average_mood": round(avg, 1),
            "total_entries": len(logs),
            "insight_count": len(insights)
        }
    }