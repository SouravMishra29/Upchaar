const sessions = {};

// Get or create session
function getSession(sessionId) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      duration: null,
      severity: null,
      symptoms: null,
      history: null,
      medications: null
    };
  }
  return sessions[sessionId];
}

// Update session from user text
function updateSession(session, text) {
  text = text.toLowerCase();

  if (!session.duration && /(day|days|week|since)/.test(text)) {
    session.duration = text;
  }

  if (!session.severity && /(mild|moderate|severe|\b(99|100|101|102|103|104)\b)/.test(text)) {
    session.severity = text;
  }

  if (!session.symptoms && /(pain|cough|headache|vomit|fatigue|fever)/.test(text)) {
    session.symptoms = text;
  }

  if (!session.history && /(diabetes|bp|asthma|thyroid|none|no)/.test(text)) {
    session.history = text;
  }

  if (!session.medications && /(medicine|medication|drug|none|no)/.test(text)) {
    session.medications = text;
  }

  return session;
}

// Get missing fields
function getMissingFields(session) {
  return Object.keys(session).filter(key => !session[key]);
}

module.exports = {
  getSession,
  updateSession,
  getMissingFields
};