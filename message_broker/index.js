import express from "express";
import axios from "axios";

const app = express();
const PORT = Number(process.env.PORT) || 8005;
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174,http://localhost:5175")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const targetUrls = (process.env.BROKER_TARGETS || "http://localhost:8000/events,http://localhost:3000/events,http://localhost:8002/events")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use((req, _res, next) => {
  console.log(`[broker] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || CLIENT_ORIGINS.includes(origin) || /^http:\/\/localhost:517\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:517\d+$/.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || CLIENT_ORIGINS[0]);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

app.get("/health", (_, res) => {
  return res.status(200).json({ status: "ok", service: "broker" });
});

app.post("/events", async (req, res) => {
  const events = req.body;

  if (!events || !events.type) {
    return res.status(400).json({ success: false, message: "Invalid event payload." });
  }

  const results = await Promise.allSettled(
    targetUrls.map((url) => axios.post(url, events))
  );

  const failed = results.filter((r) => r.status === "rejected");

  if (failed.length > 0) {
    console.error("[broker] Some event deliveries failed:", failed.length);
  }

  return res.status(200).json({
    success: true,
    delivered: results.filter((r) => r.status === "fulfilled").length,
    failed: failed.length,
  });
});

app.use((error, _req, res, _next) => {
  console.error("[broker] Unhandled error:", error.message);
  return res.status(500).json({ success: false, message: "Internal server error." });
});

const server = app.listen(PORT, () => {
  console.log(`Broker service running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});