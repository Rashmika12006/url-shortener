async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // ✅ CONNECT MONGO INSIDE SERVER
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }

  // -------------------- API --------------------

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

  app.get("/api/urls", async (req, res) => {
    try {
      const urls = await Url.find().sort({ createdAt: -1 });
      res.json(urls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch URLs" });
    }
  });

  app.delete("/api/urls/:id", async (req, res) => {
    try {
      await Url.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete URL" });
    }
  });

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

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();