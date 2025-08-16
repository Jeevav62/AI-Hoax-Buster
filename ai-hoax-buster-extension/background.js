chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scanText",
    title: "Scan with AI Hoax Buster",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scanText" && info.selectionText) {



    
    const selectedText = info.selectionText;

    fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: selectedText })
    })
    .then(res => res.json())
    .then(data => {
      console.log("AI Hoax Buster result:", data);
      // Optional: send to popup or show notification
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "AI Hoax Buster",
        message: `Fake News: ${data.fake_news.label} (${data.fake_news.confidence})`
      });
    })
    .catch(err => {
      console.error("Error analyzing selected text:", err);
    });
  }
});