# 🕵️‍♂️ AI Hoax Buster — Browser Extension

**Detect bias and fake news sentence-by-sentence, directly from any webpage.**  
Built for journalists, researchers, and everyday readers who want clarity in a noisy media landscape.

---

## 🚀 Features

- 🔍 **Page Scan Mode** — Analyze the entire page’s text and get:
  - Average bias score + dominant bias label
  - Average fake news confidence + dominant label
  - Most biased sentence
  - Toggleable full breakdown of all sentences

- ✍️ **Manual Mode** — Paste your own text for custom analysis

- ⚡ **Fast, Lightweight UI** — Spinner animation, fade-in results, and toggleable breakdowns

- 🧠 **Sentence-Level Scoring** — Each sentence is labeled with:
  - Bias: `Biased` or `Neutral`
  - Fake News: `Real` or `Fake`
  - Confidence scores for both

---

## 🧠 Models Used

| Task            | Model Name                                             | Source                     |
|-----------------|--------------------------------------------------------|----------------------------|
| Fake News       | `mrm8488/bert-tiny-finetuned-fake-news-detection`     | Hugging Face Transformers |
| Bias Detection  | `nlptown/bert-base-multilingual-uncased-sentiment`    | Hugging Face Transformers |

- **Fake News Model**: Fine-tuned BERT-tiny classifier trained to distinguish between real and fake news headlines and articles.
- **Bias Model**: Sentiment-based proxy for bias, where extreme sentiment (`1 star`, `5 stars`) is interpreted as biased, and mid-range sentiment as neutral.

---

## 🧭 Philosophy

> _“Truth isn’t just about facts — it’s about framing.”_

AI Hoax Buster is built on the belief that media literacy should be accessible, interpretable, and actionable. Instead of binary verdicts, it offers nuanced, sentence-level insights that help users think critically about what they read.

- ✅ Transparency over judgment  
- ✅ Interpretability over black-box scoring  
- ✅ Empowerment over censorship

---

## ⚙️ How It Works

1. **Text Extraction**  
   - Page Scan: Uses `document.body.innerText` or `main.innerText`  
   - Manual Mode: User-pasted input

2. **Preprocessing**  
   - Text is cleaned, trimmed, and split into sentences

3. **Backend Analysis**  
   - Flask server sends each sentence to:
     - Fake News model → label + confidence
     - Bias model → sentiment → bias label + confidence

4. **Frontend Rendering**  
   - Displays average scores, dominant labels, and most biased sentence  
   - Toggleable breakdown with sentence-by-sentence results  
   - Spinner animation and fade-in for smooth UX

---

## 📦 Installation

1. Clone this repo  
2. Run the Flask backend locally:
   ```bash
   python app.py
   ```
3. Load the extension in Chrome:
   - Go to `chrome://extensions`
   - Enable **Developer Mode**
   - Click **Load unpacked** and select the `extension/` folder

---

## 📸 Demo Preview

> _“Such superhuman performance has been realized in functions ranging from the early Apollo orbiter software... to Watson beating the best Jeopardy champs.”_  
> → Bias: `Biased` (92.4%) | Fake News: `Real` (98.7%)

---

## 🔮 Future Improvements

- 📊 Chart visualizations (bias vs fake news trends)  
- 📁 Export results to PDF/JSON  
- 🧪 Real-time feedback as user types  
- 🔄 Streaming backend for partial results  
- 🧠 Fine-tuned bias model for political leanings  
- 🌐 Serverless deployment for public use

---

## 👨‍💻 Author

**Jeevarathinam V**  
| B.Tech AI & Data Science  
passionate about AI, Data Science, and building reproducible, socially impactful ML tools.  
📍 Chennai, India

---

## 📬 Contact

- 🔗 LinkedIn: [linkedin.com/in/jeevarathinamv](https://www.linkedin.com/in/jeevarathinamv)  
- 💻 GitHub: [github.com/Jeevav62](https://github.com/Jeevav62)  
- 📧 Email: `jeevav62@gmail.com`

