import { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! Describe your symptoms." }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", text: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: newMessages
        })
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", text: data.reply }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", text: "Server error. Try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-lg px-4 py-2 rounded-lg ${
              msg.role === "user"
                ? "bg-primary text-white ml-auto"
                : "bg-white border"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-gray-500">Typing...</div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          placeholder="Describe your symptoms..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-primary text-white px-6 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;