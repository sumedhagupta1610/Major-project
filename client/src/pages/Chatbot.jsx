import React, { useState } from "react";

export default function Chatbot() {

  const API = "http://localhost:5000";

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMsg = { type: "user", text: message };
    setChat(prev => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/chat/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      const botMsg = {
        type: "bot",
        text: data.response || "No response"
      };

      setChat(prev => [...prev, botMsg]);

    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { type: "bot", text: "Error connecting to AI" }]);
    }

    setMessage("");
    setLoading(false);
  }

  return (
    <div style={{
      maxWidth: "500px",
      margin: "auto",
      background: "#fff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>

      <h3 style={{ textAlign: "center" }}>🤖 Smart AI Assistant</h3>

      {/* CHAT BOX */}
      <div style={{
        height: "300px",
        overflowY: "auto",
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px"
      }}>
        {chat.map((c, i) => (
          <div
            key={i}
            style={{
              textAlign: c.type === "user" ? "right" : "left",
              marginBottom: "8px"
            }}
          >
            <span style={{
              display: "inline-block",
              background: c.type === "user" ? "#2563eb" : "#e5e7eb",
              color: c.type === "user" ? "#fff" : "#000",
              padding: "6px 10px",
              borderRadius: "10px",
              maxWidth: "70%"
            }}>
              {c.text}
            </span>
          </div>
        ))}

        {loading && <p>AI is typing...</p>}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>

    </div>
  );
}