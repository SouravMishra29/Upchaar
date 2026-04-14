const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  text: { type: String, required: true },
});

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    symptoms: [{ type: String }],
    messages: [messageSchema],
    aiResponse: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);
