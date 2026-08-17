import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateComment from "./CreateComment";

const authToken = import.meta.env.VITE_AUTH_TOKEN || "changeme";
const secureAxios = axios.create({
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

const CreateSnippet = () => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [snippets, setSnippets] = useState({});

  const handleCreateSnippet = async (e) => {
    e.preventDefault();
    try {
      const res = await secureAxios.post("http://localhost:8000/api/v1/snippet", {
        title,
        code,
      });
      alert(res.data.message);
      setTitle("");
      setCode("");
      const snippetRes = await axios.get("http://localhost:8002/snippets");
      setSnippets(snippetRes.data);
    } catch (error) {
      console.log("error occured", error);
    }
  };

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const res = await axios.get("http://localhost:8002/snippets");
        setSnippets(res.data);
      } catch (error) {
        console.log("error while fetching snippet", error);
      }
    };
    fetchSnippets();
  }, []);

  const recentSnippets = Object.values(snippets).slice(0, 3);

  return (
    <div>
      <form onSubmit={handleCreateSnippet} className="mb-8 w-full">
        <div className="overflow-hidden rounded-xl border border-[#2a3a52] bg-[#1b2331]/90 shadow-[0_0_0_1px_rgba(148,163,184,0.08)]">
          <div className="flex items-center justify-between border-b border-[#2b3547] bg-[#171e2a] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[#7aa8ff]" />
              <span>untitled.js</span>
            </div>

            <div className="w-24" />
          </div>

          <div className="border-b border-[#2b3547] bg-[#101924] px-4 py-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-[#ffb86c]">●</span>
                <span className="font-medium">Name this snippet</span>
              </div>
              <span className="rounded border border-[#374a68] bg-[#182334] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                JavaScript
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give the snippet a name before saving."
              className="mt-2 w-full border-0 bg-transparent px-0 py-1 text-sm text-slate-200 placeholder:text-[#7b8797] focus:outline-none"
            />
          </div>

          <div className="relative bg-[#101924] p-0">
            <div className="flex min-h-[280px]">
              <div className="w-12 border-r border-[#2b3547] bg-[#0d1723] pt-4 text-right text-xs text-slate-500">
                <div className="pr-2">1</div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write or paste your code..."
                className="min-h-[280px] flex-1 resize-none border-0 bg-transparent px-4 py-4 font-mono text-sm leading-6 text-slate-200 placeholder:text-[#7b8797] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#2b3547] bg-[#111b29] px-4 py-2 text-xs text-slate-400">
              <span className="text-[#ff9d66]">Add some code before saving — an empty snippet isn't much use.</span>
              <span className="text-slate-300">Ln 1, Col 1</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#171e2a] px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="rounded border border-[#374a68] bg-[#0f1824] px-2 py-1">Ctrl</span>
              <span className="text-slate-500">+</span>
              <span className="rounded border border-[#374a68] bg-[#0f1824] px-2 py-1">/</span>
              <span className="ml-1 text-slate-500">to save</span>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[#7aa8ff] px-4 py-2 text-sm font-medium text-[#08131d] shadow-[0_0_18px_rgba(122,168,255,0.35)] transition hover:bg-[#8db5ff]"
            >
              Create snippet
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Recent snippets</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {recentSnippets.length > 0 ? (
            recentSnippets.map((snippet) => (
              <div key={snippet.id} className="rounded-xl border border-[#2a3a52] bg-[#111b29] p-3 shadow-[0_0_0_1px_rgba(148,163,184,0.05)]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="truncate text-sm font-medium text-slate-200">{snippet.title || "untitled"}</span>
                </div>
                <div className="max-h-20 overflow-hidden rounded-md bg-[#0b1320] p-2 font-mono text-[11px] leading-5 text-slate-300">
                  {snippet.code || "// empty snippet"}
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  <span>JavaScript</span>
                  <span>{snippet.code ? snippet.code.split("\n").length : 0} lines</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-[#2a3a52] bg-[#111b29] p-4 text-sm text-slate-400">No snippets yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSnippet;
