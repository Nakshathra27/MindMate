from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json, os, uuid
from sentiment import analyze_sentiment
from pattern_detector import detect_patterns

app = Flask(__name__)
CORS(app)

DATA_FILE = "data/mood_logs.json"
os.makedirs("data", exist_ok=True)

def load_logs():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_logs(logs):
    with open(DATA_FILE, "w") as f:
        json.dump(logs, f, indent=2)

@app.route("/api/log", methods=["POST"])
def log_mood():
    data = request.json
    text = data.get("text", "").strip()
    mood_score = data.get("mood_score", 5)

    if not text:
        return jsonify({"error": "Text is required"}), 400

    sentiment = analyze_sentiment(text)

    entry = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "text": text,
        "mood_score": mood_score,
        "sentiment": sentiment,
        "date": datetime.now().strftime("%Y-%m-%d")
    }

    logs = load_logs()
    logs.append(entry)
    save_logs(logs)

    return jsonify({"entry": entry, "message": "Mood logged successfully!"})

@app.route("/api/logs", methods=["GET"])
def get_logs():
    logs = load_logs()
    return jsonify({"logs": logs})

@app.route("/api/insights", methods=["GET"])
def get_insights():
    logs = load_logs()
    if len(logs) < 2:
        return jsonify({"insights": "Log at least 2 entries to see insights."})

    patterns = detect_patterns(logs)
    return jsonify({"insights": patterns})

@app.route("/api/chat", methods=["POST"])
def chat():
    import anthropic

    data = request.json
    message = data.get("message", "")
    logs = load_logs()

    recent_logs = logs[-5:] if len(logs) >= 5 else logs
    mood_context = "\n".join([
        f"- {log['date']}: mood {log['mood_score']}/10, said: '{log['text'][:80]}'"
        for log in recent_logs
    ])

    system_prompt = f"""You are MindMate, a compassionate AI mental health companion.
You provide emotional support, coping strategies, and evidence-based mental wellness advice.

You are NOT a replacement for professional therapy. Always encourage professional help for serious concerns.

The user's recent mood journal entries:
{mood_context if mood_context else "No entries yet."}

Be warm, empathetic, brief (2-3 sentences max per response), and non-judgmental.
If the user seems to be in crisis, immediately suggest professional resources like a helpline."""

    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        system=system_prompt,
        messages=[{"role": "user", "content": message}]
    )

    return jsonify({"reply": response.content[0].text})

@app.route("/api/stats", methods=["GET"])
def get_stats():
    logs = load_logs()
    if not logs:
        return jsonify({"stats": {}})

    scores = [log["mood_score"] for log in logs]
    avg = sum(scores) / len(scores)

    sentiments = {"positive": 0, "negative": 0, "neutral": 0}
    for log in logs:
        s = log.get("sentiment", {}).get("label", "neutral").lower()
        if s in sentiments:
            sentiments[s] += 1

    daily = {}
    for log in logs:
        d = log["date"]
        if d not in daily:
            daily[d] = []
        daily[d].append(log["mood_score"])

    daily_avg = {date: sum(v)/len(v) for date, v in daily.items()}
    sorted_daily = sorted(daily_avg.items())[-7:]

    return jsonify({
        "stats": {
            "total_entries": len(logs),
            "average_mood": round(avg, 1),
            "sentiment_dist": sentiments,
            "weekly_trend": [{"date": d, "avg": round(v, 1)} for d, v in sorted_daily],
            "streak": calculate_streak(logs)
        }
    })

def calculate_streak(logs):
    if not logs:
        return 0
    dates = sorted(set(log["date"] for log in logs), reverse=True)
    streak = 1
    for i in range(1, len(dates)):
        from datetime import timedelta
        d1 = datetime.strptime(dates[i-1], "%Y-%m-%d")
        d2 = datetime.strptime(dates[i], "%Y-%m-%d")
        if (d1 - d2).days == 1:
            streak += 1
        else:
            break
    return streak

if __name__ == "__main__":
    app.run(debug=True, port=5000)