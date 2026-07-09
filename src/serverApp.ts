import express from "express";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const app = express();
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
    
    const data = await fs.readFile(DEV_DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    // If reading from /tmp is corrupted or fails, fallback to DEV_DATA_PATH
    try {
      const data = await fs.readFile(DEV_DATA_PATH, "utf-8");
      return JSON.parse(data);
    } catch (fallbackError) {
      console.error("Critical error reading data from both paths:", fallbackError);
      throw fallbackError;
    }
  }
}

// API Routes
app.get("/api/data", async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
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

    // 1. Write to /tmp/data.json first (always writable in Vercel lambda container instances)
    try {
      await fs.writeFile(TMP_DATA_PATH, dataString, "utf-8");
    } catch (e) {
      console.warn("Failed to write to /tmp/data.json:", e);
    }

    // 2. Also write to local data.json (will succeed in local dev, but fail on read-only Vercel build-env which is fine)
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

export default app;
