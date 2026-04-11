require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { searchMedical } = require("./advancedRag");

const app = express();

app.use(cors());
app.use(express.json());

console.log("SERVER FILE LOADED");

// ------------------------
// 🧠 REQUIRED MEDICAL FIELDS
// ------------------------
const requiredInfo = [
  "duration",
  "severity",
  "symptoms",
  "history",
  "medications"
];

// ------------------------
// 🧠 CHECK MISSING INFO
// ------------------------
function getMissingInfo(text) {
  text = text.toLowerCase();

  const missing = [];

  if (!/(day|days|week|since)/.test(text)) missing.push("duration");
  if (!/\b(99|100|101|102|103|104|mild|moderate|severe)\b/.test(text)) missing.push("severity");
  if (!/(pain|cough|headache|vomit|fatigue|fever)/.test(text)) missing.push("symptoms");
  if (!/(diabetes|bp|asthma|thyroid|none|no)/.test(text)) missing.push("history");
  if (!/(medicine|medication|drug|none|no)/.test(text)) missing.push("medications");

  return missing;
}

// ------------------------
// 🧠 CROSS QUESTION
// ------------------------
function isCrossQuestion(text) {
  return /\?|what|why|how|should|can|is it/i.test(text);
}

// ------------------------
// 🚨 FIXED SAFETY (ONLY LAST MESSAGE)
// ------------------------
function isSevere(text) {
  return /(chest pain|difficulty breathing|fainting|seizure|unconscious)/i.test(text);
}

// ------------------------
// 🚀 ROUTES
// ------------------------
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/chat", async (req, res) => {
  try {
    console.log("HIT /chat");

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages required" });
    }

    const conversation = messages
      .map((m) =>
        `${m.role === "user" ? "Patient" : "Assistant"}: ${m.text}`
      )
      .join("\n");

    const fullText = messages.map((m) => m.text).join(" ");
    const lastMessage = messages[messages.length - 1].text;

    // 🚨 FIX: check ONLY last message
    if (isSevere(lastMessage)) {
      return res.json({
        reply:
          "⚠️ This may be serious. Please seek immediate medical attention."
      });
    }

    let prompt = "";

    const missingInfo = getMissingInfo(fullText);

    // ------------------------
    // 🟣 CROSS QUESTION MODE
    // ------------------------
    if (isCrossQuestion(lastMessage)) {
      const medicalContext = searchMedical(fullText);

      prompt = `
You are a professional doctor.

Conversation:
${conversation}

Medical knowledge:
${medicalContext}

Answer the patient's question clearly.

Rules:
- Be precise and professional
- Do NOT ignore the question
- Do NOT repeat earlier questions
- Do NOT prescribe medicines
`;
    }

    // ------------------------
    // 🟡 TRIAGE MODE (SMART)
    // ------------------------
    else if (missingInfo.length > 0) {
      prompt = `
You are a doctor conducting a clinical consultation.

Conversation:
${conversation}

Missing information:
${missingInfo.join(", ")}

Ask ONE most important question to gather missing information.

Rules:
- Ask ONLY ONE question
- Do NOT repeat
- Ask what is clinically most important next
- Sound natural and professional
`;
    }

    // ------------------------
    // 🟢 FINAL DIAGNOSIS MODE
    // ------------------------
    else {
      const medicalContext = searchMedical(fullText);

      prompt = `
You are a highly experienced doctor.

Medical knowledge:
${medicalContext}

Conversation:
${conversation}

Provide a professional clinical assessment.

Rules:
- Do NOT diagnose with certainty
- Do NOT prescribe medicines
- Base reasoning on symptoms
- Be medically accurate

Format:

Summary:
Likely Causes:
Severity Level:
Recommended Actions:
Red Flags:

After giving response, remain open for follow-up questions.
`;
    }

    // ------------------------
    // 🤖 GROQ CALL
    // ------------------------
    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      groqResponse.data?.choices?.[0]?.message?.content ||
      "No response generated.";

    res.json({ reply });

  } catch (error) {
    console.error("❌ ERROR:", error.response?.data || error.message);

    res.json({
      reply: "AI is temporarily unavailable. Please try again."
    });
  }
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});