import { useState, useRef, useEffect } from "react";

const symptomsList = [
  "Fever",
  "Headache",
  "Cold",
  "Cough",
  "Fatigue",
  "Body Pain"
];

function ChatSection() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi 👋 Tell me your symptoms or select one below."
    }
  ]);

  const [input, setInput] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Analyzing symptoms... (AI response coming soon)"
        }
      ]);
    }, 700);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden"> {/* 🔥 FIX */}

      {/* HEADER */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Chat Assistant
      </h2>

      {/* QUICK OPTIONS */}
      <div className="flex flex-wrap gap-2 mb-3">
        {symptomsList.map((symptom, i) => (
          <button
            key={i}
            onClick={() => sendMessage(symptom)}
            className="px-4 py-1.5 rounded-full bg-primary text-white text-sm hover:opacity-90 transition"
          >
            {symptom}
          </button>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3 border dark:border-gray-700">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl text-sm max-w-[70%] ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div className="mt-3 flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-xl border dark:border-gray-700 shrink-0"> {/* 🔥 FIX */}

        <input
          type="text"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 bg-transparent outline-none text-white placeholder-gray-400"
        />

        <button
          onClick={() => sendMessage(input)}
          className="px-5 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default ChatSection;