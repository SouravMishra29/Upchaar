const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
    symptoms: [String],
    location: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Case", caseSchema);