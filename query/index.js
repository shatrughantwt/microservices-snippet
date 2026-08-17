import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 8002;
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174,http://localhost:5175")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return CLIENT_ORIGINS.includes(origin) || /^http:\/\/localhost:517\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:517\d+$/.test(origin);
};

app.use((req, _res, next) => {
  console.log(`[query] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
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

const snippets = {};

app.get("/health", (_, res) => {
  return res.status(200).json({ status: "ok", service: "query" });
});

app.get("/snippets", (_, res) => {
  return res.status(200).json(snippets);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body || {};

  if (!type || !data) {
    return res.status(400).json({ success: false, message: "Invalid event payload." });
  }

  if (type === "SnippetCreated") {
    const { id, title } = data;
    if (!id || !title) {
      return res.status(400).json({ success: false, message: "Invalid snippet event payload." });
    }
    snippets[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, snippetId } = data;
    if (!snippetId || !id || !content) {
      return res.status(400).json({ success: false, message: "Invalid comment event payload." });
    }

    if (!snippets[snippetId]) {
      snippets[snippetId] = { id: snippetId, title: "Unknown snippet", comments: [] };
    }

    snippets[snippetId].comments.push({ id, content });
  }

  return res.status(200).json({ success: true });
});

app.use((error, _req, res, _next) => {
  console.error("[query] Unhandled error:", error.message);
  return res.status(500).json({ success: false, message: "Internal server error." });
});

const server = app.listen(PORT, () => {
  console.log(`Query service running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});