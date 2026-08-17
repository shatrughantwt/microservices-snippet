import { randomBytes } from "crypto";
import axios from "axios";
import { createSnippetRecord, listSnippets } from "../database/index.js";

export const createSnippet = async (req, res) => {
  try {
    const { title, code } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required." });
    }

    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, message: "Code is required." });
    }

    const id = randomBytes(4).toString("hex");
    const snippet = createSnippetRecord({
      id,
      title: title.trim(),
      code,
    });

    await axios.post("http://localhost:8005/events", {
      type: "SnippetCreated",
      data: { id, title: title.trim() },
    });

    return res.status(201).json({
      success: true,
      snippet,
      message: "Snippet created successfully.",
    });
  } catch (error) {
    console.error("Snippet creation failed:", error.message);
    return res.status(500).json({ success: false, message: "Failed to create snippet." });
  }
};

export const getSnippet = (_, res) => {
  const snippets = listSnippets();
  return res.status(200).json(
    Object.fromEntries(snippets.map((snippet) => [snippet.id, snippet]))
  );
};