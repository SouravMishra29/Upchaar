const fs = require("fs");
const path = require("path");

function getMedicalContext(symptom) {
  try {
    const filePath = path.join(__dirname, "medical_data", `${symptom}.txt`);

    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf8");
    }

    return "";
  } catch (err) {
    console.error("RAG ERROR:", err);
    return "";
  }
}

module.exports = getMedicalContext;