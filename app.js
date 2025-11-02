const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Append a chat message
function appendMessage(sender, text, colorClass) {
  const message = document.createElement("div");
  message.classList.add("mb-2");
  message.innerHTML = `<strong class="${colorClass}">${sender}:</strong> ${text}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to backend
async function sendMessage() {
  const query = userInput.value.trim();
  if (!query) return;

  appendMessage("You", query, "text-blue-600");
  userInput.value = "";

  try {
    const response = await fetch("/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, top_k: 2 }),
    });

    // Try to parse JSON even if status != 200
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const msg = (data && data.error) || `Server Error: ${response.status}`;
      appendMessage("Bot", `⚠️ ${msg}`, "text-red-500");
      return;
    }

    if (data && data.answer) {
      appendMessage("Bot", data.answer, "text-green-700");
    } else if (data && data.error) {
      appendMessage("Bot", `⚠️ ${data.error}`, "text-red-500");
    } else {
      appendMessage("Bot", "⚠️ Unexpected response from backend.", "text-red-500");
    }

  } catch (err) {
    // Handles network / CORS errors
    appendMessage("Bot", `⚠️ Network error: ${err.message}`, "text-red-500");
    console.error("Fetch error:", err);
  }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});


console.log("test")
