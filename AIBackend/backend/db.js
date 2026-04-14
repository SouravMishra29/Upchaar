const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("  ❌ MONGODB_URI is not set in .env");
    process.exit(1);
  }

  const isAtlas = uri.includes("mongodb+srv");
  console.log(`  🔌 Connecting to ${isAtlas ? "MongoDB Atlas ☁️" : "Local MongoDB 🖥️"}...`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,  // fail fast if Atlas is unreachable
    });
    console.log(`  ✅ MongoDB Connected → ${isAtlas ? "Atlas" : uri}`);
  } catch (error) {
    console.error("  ❌ MongoDB Connection Failed:", error.message);
    if (isAtlas) {
      console.error("  👉 Check: your Atlas URI in .env, IP whitelist (0.0.0.0/0), and credentials");
    } else {
      console.error("  👉 Make sure MongoDB is running: mongod");
    }
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => console.warn("  ⚠️  MongoDB disconnected"));
  mongoose.connection.on("reconnected",  () => console.log("  ✅ MongoDB reconnected"));
  mongoose.connection.on("error", (err) => console.error("  ❌ MongoDB error:", err.message));
};

module.exports = connectDB;
