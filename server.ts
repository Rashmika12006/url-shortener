import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();

// -------------------- SCHEMA --------------------
const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);

// -------------------- SERVER --------------------
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 10000;

  app.use(cors());
  app.use(express.json());

  // ✅ CONNECT MONGO
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }

  // -------------------- API --------------------

  // 🔹 Shorten URL
  app.post("/api/shorten", async (req, res) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const shortCode = nanoid(6);

      const newUrl = await Url.create({
        originalUrl: url,
        shortCode,
      });

      // ✅ FIXED BASE URL (IMPORTANT)
      const base =
        process.env.BASE_URL || `http://localhost:${PORT}`;

      const shortUrl = `${base}/r/${shortCode}`;

      res.json({
        id: newUrl._id,
        originalUrl: newUrl.originalUrl,
        shortCode,
        shortUrl,
        clickCount: newUrl.clickCount,
      });
    } catch (error) {
      console.error("Error shortening URL:", error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  });

  // 🔹 Get all URLs
  app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });

    // ✅ ensure id exists for frontend
    const formatted = urls.map((url) => ({
      ...url.toObject(),
      id: url._id.toString(), // ✅ THIS FIX
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});

  // 🔹 Delete URL
  // 🔹 Delete URL (FIXED)
app.delete("/api/urls/:code", async (req, res) => {
  try {
    const code = req.params.code;

    console.log("Deleting:", code);

    const deleted = await Url.findOneAndDelete({
      shortCode: code.trim(),
    });

    if (!deleted) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});
  // 🔹 Redirect (THIS IS KEY FEATURE)
  app.get("/r/:code", async (req, res) => {
    try {
      const url = await Url.findOne({
        shortCode: req.params.code,
      });

      if (!url) return res.status(404).send("Not found");

      url.clickCount++;
      await url.save();

      return res.redirect(url.originalUrl);
    } catch {
      res.status(500).send("Error");
    }
  });

  // ✅ ROOT ROUTE
  app.get("/", (req, res) => {
    res.send("🚀 URL Shortener API is running");
  });

  // -------------------- START SERVER --------------------
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();