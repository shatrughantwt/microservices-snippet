import { randomBytes } from "crypto";
import axios from "axios";
import { createCommentRecord, listCommentsBySnippetId } from "../database/index.js";

export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const snippetId = req.params.id;

    if (!snippetId || typeof snippetId !== "string" || !snippetId.trim()) {
      return res.status(400).json({ success: false, message: "Snippet id is required." });
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required." });
    }

    const commentId = randomBytes(4).toString("hex");
    const comment = createCommentRecord({
      id: commentId,
      snippetId,
      content: text.trim(),
    });

    await axios.post("http://localhost:8005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content: comment.content,
        snippetId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Comment added",
      comment: { id: comment.id, content: comment.content },
    });
  } catch (error) {
    console.error("Comment creation failed:", error.message);
    return res.status(500).json({ success: false, message: "Failed to add comment." });
  }
};

export const getCommentBySnippetId = (req, res) => {
  const snippetId = req.params.id;
  return res.status(200).json(listCommentsBySnippetId(snippetId));
};