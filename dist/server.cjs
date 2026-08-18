var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_promise = __toESM(require("mysql2/promise"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var DB_HOST = process.env.DB_HOST || "mysql-db02.remote";
var DB_PORT = Number(process.env.DB_PORT) || 32636;
var DB_USER = process.env.DB_USER || "capt_noah";
var DB_PASS = process.env.DB_PASSWORD || "5RDPrt#xe67gx@bv";
var DB_NAME = process.env.DB_NAME || "portfolio_db";
console.log("--- \u{1F680} SERVER DATABASE CONFIGURATION ---");
console.log("DB_HOST:", DB_HOST);
console.log("DB_PORT:", DB_PORT);
console.log("DB_USER:", DB_USER);
console.log("DB_NAME:", DB_NAME);
console.log("----------------------------------------");
var pool = import_promise.default.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
  });
  next();
});
app.get("/api/db-test", async (req, res) => {
  try {
    const [ping] = await pool.query("SELECT 1 + 1 AS connection_test, NOW() AS server_time");
    const [tables] = await pool.query("SHOW TABLES");
    res.json({
      status: "success",
      message: "Node.js connected to MySQL on Plesk successfully!",
      connectionDetails: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        database: DB_NAME
      },
      ping: ping[0],
      tables
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      connectionDetails: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        database: DB_NAME
      }
    });
  }
});
app.get("/api/portfolio-data", async (req, res) => {
  try {
    const [experiences] = await pool.query(
      "SELECT period, role, description AS `desc` FROM experiences ORDER BY display_order ASC"
    );
    const [projectsRaw] = await pool.query(
      "SELECT id, title, meta, short_desc AS `desc`, detailed_desc AS detailedDesc, technologies, repo_url AS repo, live_link AS link FROM projects ORDER BY display_order ASC"
    );
    const [stack] = await pool.query("SELECT name, color FROM tech_stack");
    const [socials] = await pool.query("SELECT name, url FROM socials");
    const projects = projectsRaw.map((p) => ({
      ...p,
      technologies: typeof p.technologies === "string" ? JSON.parse(p.technologies) : p.technologies
    }));
    res.json({
      experience: experiences,
      projects,
      stack,
      socials
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
      code: error.code
    });
  }
});
var distPath = typeof __dirname !== "undefined" ? __dirname : process.cwd();
var indexPath = import_path.default.join(distPath, "index.html");
app.use(import_express.default.static(distPath));
app.get("/{*splat}", (req, res) => {
  if (import_fs.default.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send("React bundle dist/index.html not found. Run npm run build.");
  }
});
var PORT = process.env.PORT || 3e3;
app.listen(PORT, () => {
  console.log(`Portfolio server listening on port ${PORT}`);
});
//# sourceMappingURL=server.cjs.map
