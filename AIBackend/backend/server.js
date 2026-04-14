require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const axios    = require("axios");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const mongoose = require("mongoose");

const { searchMedical } = require("./advancedRag");
const Case          = require("./models/case");
const User          = require("./models/user");
const PatientRecord = require("./models/patientRecord");
const connectDB     = require("./db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "healthcare_jwt_secret_fallback";

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// ─────────────────────────────────────────────
// 🔐 AUTH MIDDLEWARE
// ─────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ success: false, error: "Not authenticated. Please log in again." });
  try {
    req.user = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Session expired. Please log in again." });
  }
}

// ─────────────────────────────────────────────
// 🧠 MEDICAL HELPERS
// ─────────────────────────────────────────────
function getMissingInfo(text) {
  text = text.toLowerCase();
  const missing = [];
  if (!/(day|days|week|since)/.test(text))                          missing.push("duration");
  if (!/\b(99|100|101|102|103|104|mild|moderate|severe)\b/.test(text)) missing.push("severity");
  if (!/(pain|cough|headache|vomit|fatigue|fever)/.test(text))     missing.push("symptoms");
  if (!/(diabetes|bp|asthma|thyroid|none|no)/.test(text))          missing.push("history");
  if (!/(medicine|medication|drug|none|no)/.test(text))            missing.push("medications");
  return missing;
}
function isCrossQuestion(text) { return /\?|what|why|how|should|can|is it/i.test(text); }
function isSevere(text)        { return /(chest pain|difficulty breathing|fainting|seizure|unconscious)/i.test(text); }

function detectSymptoms(text) {
  const t = text.toLowerCase();
  const s = [];
  if (t.includes("fever"))    s.push("fever");
  if (t.includes("cough"))    s.push("cough");
  if (t.includes("headache")) s.push("headache");
  if (t.includes("fatigue"))  s.push("fatigue");
  if (t.includes("cold"))     s.push("cold");
  if (t.includes("pain"))     s.push("pain");
  if (t.includes("vomit"))    s.push("vomiting");
  if (t.includes("nausea"))   s.push("nausea");
  if (t.includes("diarrhea")) s.push("diarrhea");
  if (t.includes("rash"))     s.push("rash");
  if (t.includes("sore throat")) s.push("sore throat");
  if (t.includes("chills"))   s.push("chills");
  return [...new Set(s)];
}

// ─────────────────────────────────────────────
// ✅ HEALTH CHECK
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  const states = { 0:"disconnected", 1:"connected", 2:"connecting", 3:"disconnecting" };
  res.json({ status: "Backend running ✅", mongodb: states[mongoose.connection.readyState], time: new Date().toISOString() });
});

// ─────────────────────────────────────────────
// 🔐 REGISTER
// ─────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("  📝 Register:", req.body.email);
    const { name, email, password, age, gender, bloodGroup } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ success: false, message: "This email is already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      age: age ? Number(age) : null,
      gender: gender || null,
      bloodGroup: bloodGroup || null,
    });

    console.log("  ✅ Registered:", user.email, "ID:", user._id);
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      success: true, token,
      user: { id: user._id, name: user.name, email: user.email, age: user.age, gender: user.gender, bloodGroup: user.bloodGroup, city: user.city },
    });
  } catch (err) {
    console.error("  ❌ Register error:", err.message);
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: "This email is already registered" });
    return res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
});

// ─────────────────────────────────────────────
// 🔐 LOGIN
// ─────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("  🔑 Login:", req.body.email);
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
    console.log("  ✅ Login:", user.email);

    return res.json({
      success: true, token,
      user: { id: user._id, name: user.name, email: user.email, age: user.age, gender: user.gender, bloodGroup: user.bloodGroup, city: user.city },
    });
  } catch (err) {
    console.error("  ❌ Login error:", err.message);
    return res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
});

// ─────────────────────────────────────────────
// 👤 GET PROFILE
// ─────────────────────────────────────────────
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// ─────────────────────────────────────────────
// ✏️ UPDATE FULL HEALTH PROFILE
// ─────────────────────────────────────────────
app.put("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const {
      name, age, gender, bloodGroup, phone, emergencyContact,
      city, state, diseases, allergies, medications,
      height, weight, smoking, alcohol
    } = req.body;

    console.log("  ✏️  Update profile:", req.user.email);

    const fields = {};
    if (name)             fields.name             = name.trim();
    if (age !== undefined) fields.age             = age === "" ? null : Number(age);
    if (gender)           fields.gender           = gender;
    if (bloodGroup)       fields.bloodGroup       = bloodGroup;
    if (phone !== undefined)            fields.phone            = phone;
    if (emergencyContact !== undefined) fields.emergencyContact = emergencyContact;
    if (city !== undefined)             fields.city             = city;
    if (state !== undefined)            fields.state            = state;
    if (diseases !== undefined)         fields.diseases         = diseases;
    if (allergies !== undefined)        fields.allergies        = allergies;
    if (medications !== undefined)      fields.medications      = medications;
    if (height !== undefined)           fields.height           = height === "" ? null : Number(height);
    if (weight !== undefined)           fields.weight           = weight === "" ? null : Number(weight);
    if (smoking)          fields.smoking          = smoking;
    if (alcohol)          fields.alcohol          = alcohol;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fields },
      { new: true, runValidators: false }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    console.log("  ✅ Profile saved:", user.email, "| city:", user.city, "| diseases:", user.diseases);
    return res.json({ success: true, user });
  } catch (err) {
    console.error("  ❌ Profile update error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to save: " + err.message });
  }
});

// ─────────────────────────────────────────────
// 💬 CHAT (AI)
// ─────────────────────────────────────────────
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages))
      return res.status(400).json({ error: "Messages required" });

    const fullText     = messages.map((m) => m.text).join(" ");
    const symptoms     = detectSymptoms(fullText);
    const lastMessage  = messages[messages.length - 1].text;

    // Log to cases collection for prediction
    if (symptoms.length > 0)
      await Case.create({ symptoms, location: "India" }).catch(() => {});

    if (isSevere(lastMessage))
      return res.json({ reply: "⚠️ This may be serious. Please seek immediate medical attention or call emergency services." });

    const conversation = messages.map((m) => `${m.role === "user" ? "Patient" : "Assistant"}: ${m.text}`).join("\n");
    const missingInfo  = getMissingInfo(fullText);

    let prompt = "";
    if (isCrossQuestion(lastMessage)) {
      prompt = `You are a professional doctor.\n\nConversation:\n${conversation}\n\nMedical knowledge:\n${searchMedical(fullText)}\n\nAnswer the question clearly. Do NOT prescribe medicines.`;
    } else if (missingInfo.length > 0) {
      prompt = `You are a doctor in a clinical consultation.\n\nConversation:\n${conversation}\n\nMissing: ${missingInfo.join(", ")}\n\nAsk ONE most important missing question. Sound natural.`;
    } else {
      prompt = `You are a highly experienced doctor.\n\nMedical knowledge:\n${searchMedical(fullText)}\n\nConversation:\n${conversation}\n\nProvide a professional clinical assessment:\n\nSummary:\nLikely Causes:\nSeverity Level:\nRecommended Actions:\nRed Flags:`;
    }

    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      { model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" } }
    );

    const reply = groqResponse.data?.choices?.[0]?.message?.content || "No response generated.";
    return res.json({ reply, symptoms });

  } catch (error) {
    console.error("  ❌ Chat error:", error.response?.data || error.message);
    return res.json({ reply: "AI is temporarily unavailable. Please try again." });
  }
});

// ─────────────────────────────────────────────
// 📋 PATIENT RECORDS — save / get / delete
// ─────────────────────────────────────────────

// POST — save patient disease record with name + location
app.post("/api/records", authMiddleware, async (req, res) => {
  try {
    const { messages, aiSummary, symptoms } = req.body;

    if (!messages?.length)
      return res.status(400).json({ success: false, error: "Messages required" });

    // Fetch full user to get name, city, diseases
    const user = await User.findById(req.user.id).select("name city state diseases");

    const detectedSymptoms = symptoms?.length
      ? symptoms
      : detectSymptoms(messages.map((m) => m.text).join(" "));

    const record = await PatientRecord.create({
      userId:    req.user.id,
      name:      user?.name     || "Unknown",
      location:  user?.city     ? `${user.city}${user.state ? ", " + user.state : ""}` : "Unknown",
      symptoms:  detectedSymptoms,
      diseases:  user?.diseases || null,
      aiSummary: aiSummary || "",
      messages,
    });

    console.log("  ✅ Patient record saved | name:", record.name, "| location:", record.location, "| symptoms:", record.symptoms);
    return res.status(201).json({ success: true, record });

  } catch (err) {
    console.error("  ❌ Save record error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to save: " + err.message });
  }
});

// GET — all records for this user
app.get("/api/records", authMiddleware, async (req, res) => {
  try {
    const records = await PatientRecord.find({ userId: req.user.id }).sort({ createdAt: -1 });
    console.log("  📋 Fetched", records.length, "records for:", req.user.email);
    return res.json({ success: true, records });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to fetch records" });
  }
});

// DELETE — remove one record
app.delete("/api/records/:id", authMiddleware, async (req, res) => {
  try {
    await PatientRecord.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    console.log("  🗑️  Record deleted:", req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to delete" });
  }
});

// ─────────────────────────────────────────────
// 📊 PREDICTION
// ─────────────────────────────────────────────
app.get("/api/prediction", async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const cases = await Case.find({ createdAt: { $gte: since } });

    const symptomCount = {};
    cases.forEach((c) => c.symptoms.forEach((s) => { symptomCount[s] = (symptomCount[s] || 0) + 1; }));

    const sorted = Object.entries(symptomCount)
      .sort((a, b) => b[1] - a[1])
      .map(([symptom, count]) => ({ symptom, count }));

    let prediction = null;
    if (sorted.length > 0) {
      const topSymptoms = sorted.slice(0, 5).map((s) => `${s.symptom} (${s.count} cases)`).join(", ");
      try {
        const groqRes = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          { model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: `Based on recent symptom reports: ${topSymptoms}\n\nRespond ONLY with valid JSON:\n{"topConditions":["c1","c2","c3"],"riskLevel":"Low","advisory":"text","preventionTips":["t1","t2","t3"]}` }] },
          { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" } }
        );
        prediction = JSON.parse((groqRes.data?.choices?.[0]?.message?.content || "{}").replace(/```json|```/g, "").trim());
      } catch {}
    }

    return res.json({
      success: true, totalCases: cases.length, symptomFrequency: sorted,
      prediction: prediction || { topConditions: ["Insufficient data"], riskLevel: "Low", advisory: "Not enough local data yet. Stay hydrated.", preventionTips: ["Wash hands regularly", "Stay hydrated", "Rest if unwell"] },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to generate prediction" });
  }
});

// ─────────────────────────────────────────────
// 🚀 START
// ─────────────────────────────────────────────
app.listen(3001, () => {
  console.log("\n========================================");
  console.log("  🚀 Backend → http://localhost:3001");
  console.log("  📦 MongoDB:", process.env.MONGODB_URI?.includes("atlas") ? "Atlas ☁️" : "Local 🖥️");
  console.log("  🔑 JWT:", JWT_SECRET ? "SET ✅" : "MISSING ❌");
  console.log("  🤖 Groq:", process.env.GROQ_API_KEY ? "SET ✅" : "MISSING ❌");
  console.log("========================================\n");
});
