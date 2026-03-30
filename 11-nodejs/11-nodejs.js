// ============================================================
// 11 - NODE.JS
// ============================================================
// Node.js is JavaScript outside the browser.
//
// Created by Ryan Dahl in 2009, Node.js took Google's V8
// JavaScript engine (the one in Chrome) and ran it as a
// standalone runtime on your computer/server.
//
// The problem it solved:
// Servers at the time (Apache, etc.) spawned a new THREAD
// for each incoming request. Threads are expensive (~1MB each).
// Under heavy load, you'd run out of memory handling thousands
// of concurrent connections — the "C10k problem."
//
// Node's insight: use JavaScript's event loop! Instead of threads,
// handle I/O with callbacks. One thread, non-blocking I/O,
// can handle thousands of connections with minimal memory.
// ============================================================


// ─────────────────────────────────────────────────────────────
// THE NODE.JS ARCHITECTURE
// ─────────────────────────────────────────────────────────────

/*
  Your JavaScript code
          │
          ▼
    V8 Engine (compiles JS to machine code)
          │
          ▼
    libuv (handles async I/O, thread pool, event loop)
          │
          ├── File System operations
          ├── Network I/O
          ├── DNS resolution
          ├── Timers
          └── Thread pool (for CPU-bound operations)

  This is why Node.js is fast for I/O-heavy work:
  - Network requests: non-blocking, handled by OS
  - File reads: async, uses OS kernel events
  - Database queries: async callbacks
  
  But NOT ideal for CPU-heavy work:
  - Image processing
  - Video encoding
  - Machine learning
  - Complex calculations
  (Use Worker Threads or a different language for these)
*/


// ─────────────────────────────────────────────────────────────
// NODE.JS GLOBALS
// ─────────────────────────────────────────────────────────────
// Node.js has globals that don't exist in browsers

// process — info about the running Node.js process
console.log(process.version);          // "v20.11.0"
console.log(process.platform);         // "linux", "darwin", "win32"
console.log(process.env.NODE_ENV);     // "production", "development", etc.
console.log(process.argv);            // ["node", "script.js", "--port", "3000"]
console.log(process.cwd());           // current working directory
console.log(process.pid);             // process ID
process.exit(0);                       // exit with code 0 (success)
// process.exit(1);                    // exit with non-zero = error

// __dirname and __filename (CommonJS only)
// import.meta.url and import.meta.dirname (ESM equivalent)
// console.log(__dirname);  // absolute path of current directory
// console.log(__filename); // absolute path of current file

// Buffer — handle binary data (images, files, network packets)
const buf = Buffer.from("Hello, World!", "utf8");
console.log(buf);                    // <Buffer 48 65 6c 6c 6f...>
console.log(buf.toString("hex"));    // "48656c6c6f..."
console.log(buf.toString("base64")); // "SGVsbG8sIFdvcmxkIQ=="


// ─────────────────────────────────────────────────────────────
// CORE MODULES (built-in, no install required)
// ─────────────────────────────────────────────────────────────

// ── fs: File System ──────────────────────────────────────────

const fsExamples = `
const fs = require("fs");
const fsPromises = require("fs/promises"); // Promise-based version

// Async (callback) read — the original Node.js style
fs.readFile("./data.json", "utf8", (err, data) => {
  if (err) throw err;
  const parsed = JSON.parse(data);
  console.log(parsed);
});

// Async (Promise) read — modern approach
async function readData() {
  const data = await fsPromises.readFile("./data.json", "utf8");
  return JSON.parse(data);
}

// Sync read — blocks the event loop, avoid in servers!
// Only use in startup scripts or CLI tools
const data = fs.readFileSync("./config.json", "utf8");

// Write a file
await fsPromises.writeFile("./output.txt", "Hello, Node.js!");

// Append to a file
await fsPromises.appendFile("./log.txt", "New log entry\\n");

// Check if file exists
const exists = await fsPromises.access("./file.txt")
  .then(() => true)
  .catch(() => false);

// Read a directory
const files = await fsPromises.readdir("./src");
console.log(files); // ["index.js", "utils.js", ...]

// Create directory (recursive: true creates parent dirs too)
await fsPromises.mkdir("./output/images", { recursive: true });

// File stats
const stats = await fsPromises.stat("./package.json");
console.log(stats.size);    // file size in bytes
console.log(stats.isFile()); // true
console.log(stats.isDirectory()); // false

// Watch for file changes (useful in dev tools)
fs.watch("./src", { recursive: true }, (event, filename) => {
  console.log(\`\${event}: \${filename}\`);
});
`;

// ── path: File path utilities ─────────────────────────────────

const pathExamples = `
const path = require("path");

// Join path segments (handles OS differences automatically)
path.join("src", "components", "Button.jsx");
// → "src/components/Button.jsx" (Unix)
// → "src\\\\components\\\\Button.jsx" (Windows)

// Resolve to absolute path
path.resolve("./src/index.js");
// → "/Users/alice/myproject/src/index.js"

// Get parts of a path
const filepath = "/Users/alice/project/src/index.js";
path.dirname(filepath);  // "/Users/alice/project/src"
path.basename(filepath); // "index.js"
path.extname(filepath);  // ".js"
path.parse(filepath);    // { root, dir, base, ext, name }

// Build paths safely
const src = path.join(__dirname, "src");
const config = path.join(__dirname, "config.json");
`;

// ── http/https: HTTP Server ───────────────────────────────────

const httpExample = `
const http = require("http");

// Create a basic HTTP server (raw Node.js, before Express)
const server = http.createServer((req, res) => {
  // req: IncomingMessage (the request)
  // res: ServerResponse (our response)

  console.log(req.method, req.url);

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Hello from Node.js!</h1>");

  } else if (req.method === "GET" && req.url === "/api/users") {
    const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));

  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
`;

// ── crypto: Cryptography ─────────────────────────────────────

const cryptoExample = `
const crypto = require("crypto");

// Hash (one-way, can't be reversed)
const hash = crypto.createHash("sha256").update("password123").digest("hex");
// Use bcrypt for passwords — crypto.createHash is for checksums, not passwords!

// HMAC (hash with a secret key — for signing tokens/webhooks)
const hmac = crypto.createHmac("sha256", "my-secret-key")
  .update("message to sign")
  .digest("hex");

// Random bytes (for tokens, IDs, etc.)
const token = crypto.randomBytes(32).toString("hex"); // 64-char hex token
const uuid  = crypto.randomUUID();  // "550e8400-e29b-41d4-a716-446655440000"

// Symmetric encryption (AES)
function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encrypted, iv: iv.toString("hex") };
}
`;

// ── events: EventEmitter ─────────────────────────────────────

const eventsExample = `
const EventEmitter = require("events");

// EventEmitter is the foundation of Node.js
// HTTP servers, streams, process — all extend EventEmitter

class UserService extends EventEmitter {
  async createUser(data) {
    const user = await db.create(data);
    this.emit("user:created", user);       // fire the event
    this.emit("audit", "user:created", { userId: user.id });
    return user;
  }

  async deleteUser(id) {
    await db.delete(id);
    this.emit("user:deleted", { id });
  }
}

const service = new UserService();

// Listen for events
service.on("user:created", (user) => {
  sendWelcomeEmail(user.email);
});

service.on("user:created", (user) => {
  updateAnalytics(user.id);           // multiple listeners, same event!
});

service.once("user:created", (user) => {
  // runs only ONE time, then removes itself
  sendOnboardingSequence(user);
});

service.on("audit", (action, data) => {
  logToAuditTrail(action, data);
});

// Remove a specific listener
function handler(user) { /* ... */ }
service.on("user:created", handler);
service.off("user:created", handler); // remove it

// Remove ALL listeners for an event
service.removeAllListeners("user:created");
`;


// ─────────────────────────────────────────────────────────────
// STREAMS: Handling Large Data Efficiently
// ─────────────────────────────────────────────────────────────

const streamsExample = `
const fs = require("fs");
const { Transform, pipeline } = require("stream");
const { promisify } = require("util");
const pipelineAsync = promisify(pipeline);

// Without streams — reads ENTIRE file into memory
// const data = await fsPromises.readFile("./huge-file.csv"); // ❌ GB files = crash!

// With streams — processes chunk by chunk
const source = fs.createReadStream("./huge-file.csv", { encoding: "utf8" });
const dest   = fs.createWriteStream("./output.csv");

// Transform stream: process each chunk
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// Pipeline: connect streams, handles errors and cleanup
await pipelineAsync(
  source,
  upperCaseTransform,
  dest
);
console.log("File processed!");

// Node.js 16+ has built-in stream utilities
import { Readable, Writable } from "stream/promises";
`;


// ─────────────────────────────────────────────────────────────
// EXPRESS.JS: The Most Popular Node.js Framework
// ─────────────────────────────────────────────────────────────

const expressExample = `
// npm install express
const express = require("express");
const app = express();

// Middleware: functions that run BEFORE route handlers
// They can read req, modify res, or pass to next middleware

// Built-in middleware
app.use(express.json());              // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static("public"));   // serve static files

// Custom middleware
function logger(req, res, next) {
  console.log(\`\${new Date().toISOString()} \${req.method} \${req.url}\`);
  next(); // ← MUST call next() or the request hangs!
}

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

app.use(logger); // apply to ALL routes

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// Route parameters
app.get("/users/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Query parameters (/users?page=2&limit=20&sort=name)
app.get("/users", async (req, res) => {
  const { page = 1, limit = 20, sort = "name" } = req.query;
  const users = await User.find()
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ users, page: Number(page), total: await User.countDocuments() });
});

// POST with body
app.post("/users", authenticate, async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json(user);
});

// PATCH (partial update)
app.patch("/users/:id", authenticate, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(user);
});

// DELETE
app.delete("/users/:id", authenticate, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// Error handling middleware (MUST have 4 parameters)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

app.listen(3000, () => console.log("Server on port 3000"));


// Router — organize routes in separate files
const usersRouter = express.Router();

usersRouter.get("/",    getUsers);
usersRouter.post("/",   createUser);
usersRouter.get("/:id", getUser);
usersRouter.put("/:id", updateUser);
usersRouter.delete("/:id", deleteUser);

app.use("/api/users", usersRouter);  // prefix all routes with /api/users
`;


// ─────────────────────────────────────────────────────────────
// THE NODE.JS ECOSYSTEM
// ─────────────────────────────────────────────────────────────

const ecosystem = {
  webFrameworks: {
    express:   "The classic, minimal, widely-supported",
    fastify:   "Faster than Express, schema-based validation, great DX",
    koa:       "From the Express team, middleware-first, async by design",
    hapi:      "Enterprise-focused, convention-heavy",
    nestjs:    "Full framework, TypeScript, Angular-inspired, opinionated",
    hono:      "Ultrafast, runs on Edge (Cloudflare Workers too)",
  },
  databases: {
    mongoose:  "MongoDB ODM — schema, validation, middleware",
    prisma:    "Type-safe ORM for Postgres, MySQL, SQLite — generates types",
    typeorm:   "TypeScript ORM, supports many databases",
    pg:        "PostgreSQL client",
    mysql2:    "MySQL client",
    redis:     "Redis client",
  },
  authentication: {
    passport:  "Authentication middleware, many strategies",
    "jsonwebtoken": "JWT creation and verification",
    bcrypt:    "Password hashing",
    "@clerk/node": "Managed auth service",
  },
  testing: {
    jest:      "Facebook's test runner, all-in-one",
    vitest:    "Vite-native test runner, Jest-compatible",
    mocha:     "Flexible test runner",
    supertest: "HTTP testing for Express",
  },
  utilities: {
    dotenv:    "Load .env files into process.env",
    joi:       "Schema validation",
    zod:       "TypeScript-first schema validation",
    winston:   "Logging",
    "node-cron": "Scheduled tasks",
    axios:     "HTTP client (works in browser too)",
  },
  devTools: {
    nodemon:   "Auto-restart on file changes",
    ts_node:   "Run TypeScript directly",
    eslint:    "Lint your code",
    prettier:  "Format your code",
  }
};

// ─────────────────────────────────────────────────────────────
// A MINIMAL BUT COMPLETE API
// ─────────────────────────────────────────────────────────────

const completeApiExample = `
// server.js — a production-quality minimal API structure

import express from "express";
import dotenv from "dotenv";
import { router as usersRouter } from "./routes/users.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { connectDatabase } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(express.json({ limit: "10mb" }));
app.set("trust proxy", 1);  // trust nginx proxy

// Rate limiting
app.use("/api", rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/v1/users", usersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function start() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT} in \${process.env.NODE_ENV} mode\`);
  });
}

start().catch(console.error);


// middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";
  
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
`;

console.log("Node.js module overview complete.");
