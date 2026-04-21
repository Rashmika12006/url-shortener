/**
 * Clean MERN backend with MongoDB (no JSON file)
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- MONGODB --------------------
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

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
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

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

      const shortUrl = `${process.env.BASE_URL}/r/${shortCode}`;

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
      console.error("Error fetching URLs:", error);
      res.status(500).json({ error: "Failed to fetch URLs" });
    }
  });

  // 🔹 Delete URL
  app.delete("/api/urls/:id", async (req, res) => {
    try {
      await Url.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting URL:", error);
      res.status(500).json({ error: "Failed to delete URL" });
    }
  });

  // 🔹 Redirect
  app.get("/r/:code", async (req, res) => {
    try {
      const url = await Url.findOne({ shortCode: req.params.code });

      if (!url) {
        return res.status(404).send("URL not found");
      }

      url.clickCount += 1;
      await url.save();

      res.redirect(url.originalUrl);
    } catch (error) {
      console.error("Redirect error:", error);
      res.status(500).send("Server error");
    }
  });

  // -------------------- VITE --------------------

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
}

startServer();