var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_promises = __toESM(require("fs/promises"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var DEV_DATA_PATH = import_path.default.join(process.cwd(), "data.json");
var TMP_DATA_PATH = "/tmp/data.json";
async function fileExists(filePath) {
  try {
    await import_promises.default.access(filePath);
    return true;
  } catch {
    return false;
  }
}
async function readData() {
  try {
    const useTmp = await fileExists(TMP_DATA_PATH);
    if (useTmp) {
      const data2 = await import_promises.default.readFile(TMP_DATA_PATH, "utf-8");
      return JSON.parse(data2);
    }
  } catch (error) {
    console.warn("Failed to read from /tmp/data.json, falling back to data.json:", error);
  }
  const data = await import_promises.default.readFile(DEV_DATA_PATH, "utf-8");
  return JSON.parse(data);
}
app.get("/hello", (req, res) => {
  res.send("Hello From Capt Noah!!");
});
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
    try {
      await import_promises.default.writeFile(TMP_DATA_PATH, dataString, "utf-8");
    } catch (e) {
      console.warn("Failed to write to /tmp/data.json:", e);
    }
    try {
      await import_promises.default.writeFile(DEV_DATA_PATH, dataString, "utf-8");
    } catch (e) {
      console.warn("Failed to write to local data.json (expected in read-only platforms):", e);
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error writing data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});
async function setupVite() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
}
setupVite();
if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
var server_default = app;
//# sourceMappingURL=server.cjs.map
