import express from "express";
import cors from "cors";
import snippetRouter from "./routes/snippet.js";

const app = express();
const PORT = Number(process.env.PORT) || 8000;
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174,http://localhost:5175")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return CLIENT_ORIGINS.includes(origin) || /^http:\/\/localhost:517\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:517\d+$/.test(origin);
};

const requireAuth = (req, res, next) => {
  if (!AUTH_TOKEN) return next();

  const header = req.headers.authorization || "";
  if (header !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  return next();
};

app.use((req, _res, next) => {
  console.log(`[snippet] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/health", (_, res) => {
  return res.status(200).json({ status: "ok", service: "snippet" });
});

app.post("/events", requireAuth, (req, res) => {
  console.log("[snippet] Received event", req.body?.type);
  return res.status(200).json({ success: true });
});

app.use("/api/v1/snippet", requireAuth, snippetRouter);

app.use((error, _req, res, _next) => {
  console.error("[snippet] Unhandled error:", error.message);
  return res.status(500).json({ success: false, message: "Internal server error." });
});

const server = app.listen(PORT, () => {
  console.log(`Snippet service running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
