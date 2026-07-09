import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_PATH = path.join(process.cwd(), "data.json");

// API routes first
app.get("/api/data", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading data.json:", error);
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "capt-noah";

  if (password === adminPassword) {
    res.json({ success: true, token: "authorized_session_token" });
  } else {
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
});

app.post("/api/data", async (req, res) => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(req.body, null, 2), "utf-8");
    res.json({ success: true });
  } catch (error) {
    console.error("Error writing data.json:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Vite integration as middleware in dev, static files in prod
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else if (!process.env.VERCEL) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
