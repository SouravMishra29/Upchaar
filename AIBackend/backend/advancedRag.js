const fs = require("fs");
const path = require("path");

// Load documents
const folder = path.join(__dirname, "medical_data");
const files = fs.readdirSync(folder);

const documents = files.map(file => {
  const content = fs.readFileSync(path.join(folder, file), "utf8");
  return content.toLowerCase();
});

// Better scoring
function scoreMatch(query, doc) {
  const words = query.toLowerCase().split(/\W+/);
  let score = 0;

  words.forEach(word => {
    if (doc.includes(word)) score += 2;
  });

  // Boost for important keywords
  if (doc.includes("fever") && query.includes("fever")) score += 5;

  return score;
}

// Search
function searchMedical(query) {
  const ranked = documents
    .map(doc => ({
      doc,
      score: scoreMatch(query, doc)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  return ranked.map(r => r.doc).join("\n");
}

module.exports = { searchMedical };