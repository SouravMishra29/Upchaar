const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ── Auth ─────────────────────────────────
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },

    // ── Basic Info ───────────────────────────
    age:       { type: Number, default: null },
    gender:    { type: String, default: null },
    bloodGroup:{ type: String, default: null },
    phone:     { type: String, default: null },
    emergencyContact: { type: String, default: null },

    // ── Location ─────────────────────────────
    city:      { type: String, default: null },
    state:     { type: String, default: null },

    // ── Medical History ──────────────────────
    diseases:    { type: String, default: null },  // existing diseases
    allergies:   { type: String, default: null },
    medications: { type: String, default: null },

    // ── Physical Stats ───────────────────────
    height: { type: Number, default: null },  // cm
    weight: { type: Number, default: null },  // kg

    // ── Lifestyle ────────────────────────────
    smoking: { type: String, enum: ["No", "Yes"], default: "No" },
    alcohol: { type: String, enum: ["No", "Yes"], default: "No" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
