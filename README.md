# 🧠 MindMate — AI Mental Wellness Companion

> A full-stack AIML project: mood journaling + sentiment analysis + AI therapist chat

![Tech Stack](https://img.shields.io/badge/Python-Flask-blue) ![React](https://img.shields.io/badge/React-18-blue) ![AI](https://img.shields.io/badge/AI-Claude%20API-green) ![NLP](https://img.shields.io/badge/NLP-VADER%20Sentiment-orange)

---

## ✨ What This Project Does

| Feature | Technology |
|--------|-----------|
| 📝 Daily mood journaling | React UI |
| 😊 Sentiment analysis | VADER NLP model |
| 📊 Mood trend charts | Custom React charts |
| 🔮 Pattern detection | Python ML algorithms |
| 💬 AI therapy chat | Anthropic Claude API |
| 🔥 Streak tracking | Python backend |

---

## 🗂️ Project Structure

```
mindmate/
├── backend/
│   ├── app.py              # Flask API server
│   ├── sentiment.py        # VADER sentiment analysis
│   ├── pattern_detector.py # ML pattern detection
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── JournalPage.jsx   # Mood logging UI
    │   │   ├── DashboardPage.jsx # Charts & stats
    │   │   ├── InsightsPage.jsx  # AI insights
    │   │   └── ChatPage.jsx      # AI chat
    │   ├── utils/api.js          # API calls
    │   ├── App.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Setup Instructions

### Step 1 — Clone / open the project
```bash
cd mindmate
```

### Step 2 — Backend Setup
```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download TextBlob corpus (one-time)
python -c "import nltk; nltk.download('punkt')"
```

### Step 3 — Get your Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Go to **API Keys** → Create a new key
4. Copy the key

### Step 4 — Set up environment variables
```bash
# Copy the example file
cp .env.example .env

# Open .env and paste your key:
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Step 5 — Run the backend
```bash
python app.py
# Backend runs on http://localhost:5000
```

### Step 6 — Frontend Setup (new terminal)
```bash
cd ../frontend

# Install Node dependencies
npm install

# Start the frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### Step 7 — Open the app!
Go to **http://localhost:3000** in your browser 🎉

---

## 🧪 How to Test

1. Go to the **Journal** tab → write something, pick a mood score, save it
2. Go to **Trends** → see your mood chart
3. Add 5+ entries → go to **Insights** → see AI-detected patterns
4. Go to **MindMate AI** → chat with the AI therapist

---

## 🛠️ Tech Stack Explained (for your README / viva)

- **Flask** — Python web framework for REST APIs
- **VADER** — Valence Aware Dictionary for sEntiment Reasoning. Rule-based NLP model, great for social/emotional text
- **TextBlob** — Backup NLP library for polarity/subjectivity analysis
- **React** — Frontend UI library
- **Vite** — Fast build tool for React
- **Claude API** — Anthropic's AI model for empathetic chat responses

---

## 📈 Future Improvements (mention these in your presentation!)

- [ ] User authentication (JWT)
- [ ] Export journal to PDF
- [ ] Push notifications for daily reminders
- [ ] Mobile app (React Native)
- [ ] Fine-tune sentiment model on mental health datasets
- [ ] Crisis detection with immediate helpline routing


