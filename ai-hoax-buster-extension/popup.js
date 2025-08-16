document.addEventListener("DOMContentLoaded", () => {
  const scanButton = document.getElementById("scanBtn");
  const modeToggle = document.getElementById("modeToggle");
  const manualInput = document.getElementById("manualInput");
  const resultContainer = document.getElementById("resultContainer");
  const spinner = document.getElementById("spinner");

  modeToggle.addEventListener("change", () => {
    manualInput.style.display = modeToggle.value === "manual" ? "block" : "none";
  });

  scanButton.addEventListener("click", async () => {
    spinner.style.display = "block";
    resultContainer.style.opacity = 0;
    resultContainer.innerHTML = "";

    const mode = modeToggle.value;
    let pageText = "";

    if (mode === "manual") {
      pageText = manualInput.value.trim();
      if (!pageText) {
        spinner.style.display = "none";
        resultContainer.style.opacity = 1;
        resultContainer.innerHTML = `<p>⚠️ Please enter some text to analyze.</p>`;
        return;
      }
    } else {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText
      });
      pageText = injectionResults[0].result;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pageText })
      });

      const data = await response.json();
      renderResults(data, mode);
    } catch (err) {
      resultContainer.innerHTML = `<p>❌ Error fetching analysis. Is your Flask server running?</p>`;
    } finally {
      spinner.style.display = "none";
      resultContainer.style.opacity = 1;
    }
  });

  function renderResults(data, mode) {
    const sentences = data.sentences;
    const biasScores = sentences.map(s => s.bias.confidence);
    const fakeScores = sentences.map(s => s.fake_news.confidence);

    const avgBias = average(biasScores).toFixed(2);
    const avgFake = average(fakeScores).toFixed(2);

    const biasLabelCounts = countLabels(sentences.map(s => s.bias.label));
    const fakeLabelCounts = countLabels(sentences.map(s => s.fake_news.label));

    const dominantBiasLabel = getDominantLabel(biasLabelCounts);
    const dominantFakeLabel = getDominantLabel(fakeLabelCounts);

    if (mode === "page") {
      const mostBiased = sentences.reduce((max, s) =>
        s.bias.confidence > max.bias.confidence ? s : max, sentences[0]);

      resultContainer.innerHTML = `
        <p>🌐 <strong>Page Scan Summary</strong></p>
        <p>🧠 Avg Bias: ${avgBias}% (label: ${dominantBiasLabel})</p>
        <p>🟢 Avg Fake News Confidence: ${avgFake}% (label: ${dominantFakeLabel})</p>
        <p>⚠️ Most Biased Sentence:</p>
        <blockquote>${mostBiased.text}</blockquote>
        <button id="toggleBreakdown">🔍 Show Full Breakdown</button>
        <div id="fullBreakdown" style="display:none;"></div>
      `;

      const toggleBtn = document.getElementById("toggleBreakdown");
      const breakdownDiv = document.getElementById("fullBreakdown");

      toggleBtn.addEventListener("click", () => {
        if (breakdownDiv.style.display === "none") {
          breakdownDiv.style.display = "block";
          toggleBtn.textContent = "🙈 Hide Full Breakdown";
          breakdownDiv.innerHTML = sentences.map((s, i) => `
            <p><strong>Sentence ${i + 1}:</strong> ${s.text}</p>
            <p>🧠 Bias: ${s.bias.label} (${s.bias.confidence.toFixed(2)}%)</p>
            <p>🟢 Fake News: ${s.fake_news.label} (${s.fake_news.confidence.toFixed(2)}%)</p>
            <hr/>
          `).join("");
        } else {
          breakdownDiv.style.display = "none";
          toggleBtn.textContent = "🔍 Show Full Breakdown";
        }
      });
    } else {
      resultContainer.innerHTML = `<p>🔍 Manual Mode Results</p>`;
      sentences.forEach((s, i) => {
        resultContainer.innerHTML += `
          <p><strong>Sentence ${i + 1}:</strong> ${s.text}</p>
          <p>🧠 Bias: ${s.bias.label} (${s.bias.confidence.toFixed(2)}%)</p>
          <p>🟢 Fake News: ${s.fake_news.label} (${s.fake_news.confidence.toFixed(2)}%)</p>
          <hr/>
        `;
      });
    }
  }

  function average(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  function countLabels(labels) {
    return labels.reduce((acc, label) => {
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
  }

  function getDominantLabel(labelCounts) {
    return Object.entries(labelCounts).reduce((max, entry) =>
      entry[1] > max[1] ? entry : max, ["", 0])[0];
  }
});