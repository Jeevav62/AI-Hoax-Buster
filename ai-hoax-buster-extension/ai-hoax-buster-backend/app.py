from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer

app = Flask(__name__)
CORS(app)

# Load models
fake_news_model = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-fake-news-detection")
bias_model = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# Load tokenizer for token count debugging
tokenizer = AutoTokenizer.from_pretrained("mrm8488/bert-tiny-finetuned-fake-news-detection")

# 📰 Fake news prediction with chunking
def predict_fake_news(text, chunk_size=500):
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    scores = []
    labels = []

    for chunk in chunks[:5]:  # Limit to first 5 chunks
        token_count = len(tokenizer.encode(chunk))
        print(f"Chunk token count: {token_count}")
        result = fake_news_model(chunk)[0]
        scores.append(result["score"])
        labels.append(result["label"])

    avg_score = sum(scores) / len(scores)
    raw_label = max(set(labels), key=labels.count)  # Majority vote

    # ✅ Map raw labels to readable ones
    label_map = {
        "LABEL_0": "Real",
        "LABEL_1": "Fake"
    }
    final_label = label_map.get(raw_label, raw_label)

    return final_label, f"{avg_score * 100:.2f}"

# ⚖️ Bias detection (sentence-level)
def detect_bias_sentences(text):
    sentences = text.split(".")
    results = []

    for sentence in sentences:
        sentence = sentence.strip()
        if sentence:
            sentiment = bias_model(sentence)[0]
            label = "Biased" if sentiment["label"] in ["1 star", "5 stars"] else "Neutral"
            results.append({
                "text": sentence,
                "bias": {
                    "label": label,
                    "confidence": sentiment["score"] * 100
                },
                "fake_news": {
                    "label": "Real",  # Default for sentence-level
                    "confidence": 98.78  # Optional placeholder
                }
            })
    return results

# 🚀 Main route
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({ "error": "No text provided." }), 400

    fake_label, fake_confidence = predict_fake_news(text)
    bias_sentences = detect_bias_sentences(text)

    return jsonify({
        "fake_news": {
            "label": fake_label,
            "confidence": float(fake_confidence)
        },
        "sentences": bias_sentences  # ✅ renamed for frontend compatibility
    })

if __name__ == "__main__":
    print("Device set to use CPU")
    app.run(debug=True)