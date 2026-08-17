import { DatabaseSync } from "node:sqlite";

const dbPath = `${process.cwd()}/snippet.db`;
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS snippets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export const createSnippetRecord = ({ id, title, code }) => {
  db.prepare(
    `INSERT INTO snippets (id, title, code, created_at) VALUES (?, ?, ?, ?)`
  ).run(id, title, code, new Date().toISOString());

  return { id, title, code, comments: [] };
};

export const listSnippets = () => {
  const rows = db
    .prepare(`SELECT id, title, code FROM snippets ORDER BY created_at ASC`)
    .all();

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    code: row.code,
    comments: [],
  }));
};

export const findSnippetById = (id) => {
  const row = db.prepare(`SELECT id, title, code FROM snippets WHERE id = ?`).get(id);
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    code: row.code,
    comments: [],
  };
};
