import express from "express";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const DEV_DATA_PATH = path.join(process.cwd(), "data.json");
const TMP_DATA_PATH = "/tmp/data.json";

// Helper to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Helper to read data with /tmp fallback for Vercel Serverless environment
async function readData() {
  try {
    const useTmp = await fileExists(TMP_DATA_PATH);
    if (useTmp) {
      const data = await fs.readFile(TMP_DATA_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn("Failed to read from /tmp/data.json, falling back to data.json:", error);
  }

  const data = await fs.readFile(DEV_DATA_PATH, "utf-8");
  return JSON.parse(data);
}

// API routes first
app.get("/api/data", async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    console.error("Error reading data:", error);
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
    const dataString = JSON.stringify(req.body, null, 2);

    // 1. Write to /tmp/data.json (always writable on Vercel serverless environment)
    try {
      await fs.writeFile(TMP_DATA_PATH, dataString, "utf-8");
    } catch (e) {
      console.warn("Failed to write to /tmp/data.json:", e);
    }

    // 2. Also write to local data.json (succeeds in local dev, fails in read-only Vercel build-env)
    try {
      await fs.writeFile(DEV_DATA_PATH, dataString, "utf-8");
    } catch (e) {
      console.warn("Failed to write to local data.json (expected in read-only platforms):", e);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error writing data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Vite integration as middleware in dev, static files in prod
async function setupVite() {
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
}

setupVite();

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
