const mongoose = require("mongoose");

// Stores each patient's disease report with name + location
// Created when the AI gives a diagnosis for a logged-in user
const patientRecordSchema = new mongoose.Schema(
  {
    // Patient identity
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name:      { type: String, required: true },   // patient's name at time of record
    location:  { type: String, default: "Unknown" }, // city from profile or "Unknown"

    // Disease / symptom data
    symptoms:  [{ type: String }],                 // detected symptoms
    diseases:  { type: String, default: null },    // existing diseases from profile
    aiSummary: { type: String, required: true },   // AI's clinical assessment

    // Full conversation (for reference)
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"] },
        text: { type: String },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientRecord", patientRecordSchema);
