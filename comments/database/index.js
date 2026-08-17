import { DatabaseSync } from "node:sqlite";

const dbPath = `${process.cwd()}/comments.db`;
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    snippet_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export const createCommentRecord = ({ id, snippetId, content }) => {
  db.prepare(
    `INSERT INTO comments (id, snippet_id, content, created_at) VALUES (?, ?, ?, ?)`
  ).run(id, snippetId, content, new Date().toISOString());

  return { id, content, snippetId };
};

export const listCommentsBySnippetId = (snippetId) => {
  const rows = db
    .prepare(`SELECT id, content FROM comments WHERE snippet_id = ? ORDER BY created_at ASC`)
    .all(snippetId);

  return rows.map((row) => ({ id: row.id, content: row.content }));
};
