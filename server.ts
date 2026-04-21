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

      const base = process.env.BASE_URL || `http://localhost:${PORT}`;
      const shortUrl = `${base}/r/${shortCode}`;

      res.json({ shortCode, shortUrl });
    } catch (error) {
      console.error("Error shortening URL:", error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  });

  // 🔹 Get all URLs
  app.get("/api/urls", async (req, res) => {
    try {
      const urls = await Url.find().sort({ createdAt: -1 });
      res.json(urls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch URLs" });
    }
  });

  // 🔹 Delete URL
  app.delete("/api/urls/:id", async (req, res) => {
    try {
      await Url.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete URL" });
    }
  });

  // 🔹 Redirect
  app.get("/r/:code", async (req, res) => {
    try {
      const url = await Url.findOne({ shortCode: req.params.code });

      if (!url) return res.status(404).send("Not found");

      url.clickCount++;
      await url.save();

      res.redirect(url.originalUrl);
    } catch {
      res.status(500).send("Error");
    }
  });

  // ✅ ROOT ROUTE (IMPORTANT FIX)
  app.get("/", (req, res) => {
    res.send("🚀 URL Shortener API is running");
  });

  // -------------------- START SERVER --------------------
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();