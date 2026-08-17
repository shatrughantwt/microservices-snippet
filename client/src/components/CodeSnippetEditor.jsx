import { useEffect, useMemo, useRef, useState } from "react";

const LANGUAGE_OPTIONS = [
  { label: "JavaScript", value: "js", ext: "js", color: "#F1E05A" },
  { label: "TypeScript", value: "ts", ext: "ts", color: "#3178C6" },
  { label: "Python", value: "py", ext: "py", color: "#3572A5" },
  { label: "Go", value: "go", ext: "go", color: "#00ADD8" },
  { label: "Rust", value: "rs", ext: "rs", color: "#DEA584" },
  { label: "HTML", value: "html", ext: "html", color: "#E34C26" },
];

const INITIAL_SNIPPETS = [
  {
    id: 1,
    title: "debounce",
    language: "JavaScript",
    ext: "js",
    lineCount: 12,
    preview: "function debounce(fn, delay) {",
  },
  {
    id: 2,
    title: "fetchJSON",
    language: "TypeScript",
    ext: "ts",
    lineCount: 8,
    preview: "export async function fetchJSON<T>(url: string) {",
  },
  {
    id: 3,
    title: "format_date",
    language: "Python",
    ext: "py",
    lineCount: 15,
    preview: 'def format_date(dt, fmt="%Y-%m-%d"):',
  },
];

const getCursorInfo = (text, cursorIndex) => {
  const beforeCursor = text.slice(0, cursorIndex);
  const lines = beforeCursor.split("\n");
  const lineNumber = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { lineNumber, column };
};

const getCodeStats = (text) => {
  const lines = text.length > 0 ? text.split("\n") : [""];
  const lineCount = Math.max(lines.length, 1);
  const charCount = text.length;
  return { lineCount, charCount };
};

const getLanguageDotColor = (language) => {
  const exactLanguage =
    LANGUAGE_OPTIONS.find(
      (option) => option.value === language?.value || option.label === language?.label
    ) ?? LANGUAGE_OPTIONS[0];
  return exactLanguage.color;
};

export default function CodeSnippetEditor() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [errors, setErrors] = useState({ title: "", code: "" });
  const [snippets, setSnippets] = useState(INITIAL_SNIPPETS);
  const [toast, setToast] = useState("");
  const [cursorPos, setCursorPos] = useState({ lineNumber: 1, column: 1 });

  const textareaRef = useRef(null);
  const menuRef = useRef(null);
  const titleInputRef = useRef(null);

  const tabName = useMemo(() => {
    const cleaned = title.trim();
    return cleaned ? `${cleaned}.${selectedLanguage.ext}` : `untitled.${selectedLanguage.ext}`;
  }, [title, selectedLanguage.ext]);

  const codeStats = useMemo(() => getCodeStats(code), [code]);
  const lineNumbers = useMemo(
    () => Array.from({ length: Math.max(codeStats.lineCount, 1) }, (_, index) => index + 1),
    [codeStats.lineCount]
  );

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsLanguageMenuOpen(false);
      }
    };

    const handleGlobalShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleCreateSnippet();
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleGlobalShortcut);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleGlobalShortcut);
    };
  }, [title, code, selectedLanguage]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (textareaRef.current) {
      const selectionIndex = textareaRef.current.selectionStart ?? code.length;
      setCursorPos(getCursorInfo(code, selectionIndex));
    }
  }, [code]);

  const handleTitleChange = (value) => {
    setTitle(value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (errors.code) {
      setErrors((prev) => ({ ...prev, code: "" }));
    }
    if (textareaRef.current) {
      const selectionIndex = textareaRef.current.selectionStart ?? value.length;
      setCursorPos(getCursorInfo(value, selectionIndex));
    }
  };

  const handleCursorUpdate = () => {
    if (!textareaRef.current) return;
    const caretPosition = textareaRef.current.selectionStart ?? code.length;
    setCursorPos(getCursorInfo(code, caretPosition));
  };

  const handleCreateSnippet = () => {
    const nextErrors = { title: "", code: "" };

    if (!title.trim()) {
      nextErrors.title = "Give the snippet a name before saving.";
    }

    if (!code.trim()) {
      nextErrors.code = "Add some code before saving — an empty snippet isn't much use.";
    }

    setErrors(nextErrors);

    if (nextErrors.title || nextErrors.code) {
      return;
    }

    const previewText = code.split("\n").find((line) => line.trim()) || "";

    const newSnippet = {
      id: Date.now(),
      title: title.trim(),
      language: selectedLanguage.label,
      ext: selectedLanguage.ext,
      lineCount: code.split("\n").length,
      preview: previewText,
    };

    setSnippets((prev) => [newSnippet, ...prev]);
    setTitle("");
    setCode("");
    setErrors({ title: "", code: "" });
    setToast("Snippet created");
    setCursorPos({ lineNumber: 1, column: 1 });
    requestAnimationFrame(() => titleInputRef.current?.focus());
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setIsLanguageMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#0D0F16] px-4 py-8 text-[#E6E8F0] antialiased">
      <div className="mx-auto max-w-[760px] px-6 pb-[80px] pt-[28px]">
        <header className="mb-[32px] flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[rgba(124,158,255,0.14)] font-mono text-[13px] font-bold text-[#7C9EFF]">
              &lt;/&gt;
            </div>
            <div className="font-mono text-[16px] font-bold tracking-[0.2px] text-[#E6E8F0]">Snippets</div>
          </div>

          <button
            type="button"
            className="rounded-[8px] border border-[#2A2F3D] bg-transparent px-[14px] py-[8px] text-[13px] font-medium text-[#868DA3] transition-colors duration-150 hover:border-[#565C70] hover:text-[#E6E8F0] focus:outline-none focus:ring-2 focus:ring-[#7C9EFF] focus:ring-offset-2 focus:ring-offset-[#0D0F16]"
          >
            Log out
          </button>
        </header>

        <section className="overflow-hidden rounded-[14px] border border-[#2A2F3D] bg-[#161922] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between border-b border-[#2A2F3D] bg-[#1D212C] px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#F2A65A" }} />
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#5FE3B3" }} />
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#7C9EFF" }} />
              </div>

              <div className="flex items-center gap-[7px] rounded-[6px] border border-[#2A2F3D] bg-[#161922] px-[10px] py-[5px]">
                <span
                  className="h-[7px] w-[7px] rounded-full"
                  style={{ backgroundColor: getLanguageDotColor(selectedLanguage) }}
                />
                <span className="font-mono text-[12.5px] text-[#E6E8F0]">{tabName}</span>
              </div>
            </div>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isLanguageMenuOpen}
                onClick={() => setIsLanguageMenuOpen((open) => !open)}
                className="flex items-center gap-[8px] rounded-[7px] border border-[#2A2F3D] bg-[#161922] px-[10px] py-[2px] text-[12.5px] font-medium text-[#E6E8F0] transition-colors duration-150 hover:border-[#565C70] "
              >
                <span
                  className="h-[8px] w-[8px] rounded-full"
                  style={{ backgroundColor: getLanguageDotColor(selectedLanguage) }}
                />
                <span className="font-mono">{selectedLanguage.label}</span>
                <span className="text-[10px] text-[#868DA3]">⌄</span>
              </button>

              {isLanguageMenuOpen && (
                <ul
                  role="listbox"
                  className="absolute right-0 z-20 mt-2 w-[168px] rounded-[10px] border border-[#2A2F3D] bg-[#1D212C] p-1.5 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.8)]"
                >
                  {LANGUAGE_OPTIONS.map((language) => (
                    <li key={language.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={language.value === selectedLanguage.value}
                        onClick={() => handleLanguageSelect(language)}
                        className={`flex w-full items-center gap-[9px] rounded-[6px] px-[9px] py-[8px] text-left text-[13px] text-[#E6E8F0] transition-colors duration-150 hover:bg-[rgba(124,158,255,0.14)] ${language.value === selectedLanguage.value ? "bg-[rgba(124,158,255,0.14)]" : ""}`}
                      >
                        <span
                          className="h-[8px] w-[8px] rounded-full"
                          style={{ backgroundColor: getLanguageDotColor(language) }}
                        />
                        <span className="font-mono">{language.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex items-center gap-[10px] border-b border-[#2A2F3D] bg-[#1D212C] px-4 pb-3 pt-3">
            <span
              className="h-[8px] w-[8px] rounded-full"
              style={{ backgroundColor: getLanguageDotColor(selectedLanguage) }}
            />
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Name this snippet"
              className="w-full border-0 bg-transparent px-0 py-1 font-mono text-[14.5px] font-medium text-[#E6E8F0] placeholder:text-[#565C70] focus:outline-none"
              aria-invalid={Boolean(errors.title)}
            />
          </div>
          <div className="min-h-[18px] px-4 pt-2">
            {errors.title ? (
              <p className="font-sans text-[12px] text-[#F2836A]">{errors.title}</p>
            ) : null}
          </div>

          <div className="flex bg-[#161922]">
            <div className="w-[44px] shrink-0 overflow-hidden border-r border-[#2A2F3D] bg-[#1D212C] px-2 py-0 text-right font-mono text-[13.5px] leading-[1.65] text-[#565C70]">
              {lineNumbers.map((lineNumber) => (
                <div key={lineNumber} className="h-[1.65em] pr-3 leading-[1.65]">
                  {lineNumber}
                </div>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              value={code}
              onChange={(event) => handleCodeChange(event.target.value)}
              onClick={handleCursorUpdate}
              onKeyUp={handleCursorUpdate}
              onSelect={handleCursorUpdate}
              onScroll={(event) => {
                const gutterElement = event.currentTarget.previousElementSibling;
                if (gutterElement) {
                  gutterElement.scrollTop = event.currentTarget.scrollTop;
                }
              }}
              placeholder="Write or paste your code..."
              className="h-[170px] flex-1 resize-none border-0 bg-transparent px-4 py-4 font-mono text-[13.5px] leading-[1.65] text-[#E6E8F0] placeholder:text-[#565C70] focus:outline-none"
              aria-invalid={Boolean(errors.code)}
            />
          </div>

          <div className="min-h-[18px] px-4 pt-2">
            {errors.code ? (
              <p className="font-sans text-[12px] text-[#F2836A]">{errors.code}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-[16px] border-t border-[#2A2F3D] bg-[#1D212C] px-4 py-2 font-mono text-[11.5px] text-[#868DA3]">
            <span>Ln {cursorPos.lineNumber}, Col {cursorPos.column}</span>
            <span>{codeStats.lineCount} line{codeStats.lineCount === 1 ? "" : "s"}</span>
            <span>{codeStats.charCount} chars</span>
            <div className="flex-1" />
            <span className="flex items-center gap-[6px] text-[#E6E8F0]">
              <span
                className="h-[6px] w-[6px] rounded-full"
                style={{ backgroundColor: getLanguageDotColor(selectedLanguage) }}
              />
              <span>{selectedLanguage.label}</span>
            </span>
          </div>
        </section>

        <div className="mt-4 flex items-center justify-end gap-3">
          <span className="font-mono text-[11.5px] text-[#565C70]">
            <span className="rounded-[4px] border border-[#2A2F3D] bg-[#1D212C] px-[5px] py-[1.5px] text-[#868DA3]">Ctrl</span>
            <span>/</span>
            <span className="rounded-[4px] border border-[#2A2F3D] bg-[#1D212C] px-[5px] py-[1.5px] text-[#868DA3]">⌘</span>
            <span> + </span>
            <span className="rounded-[4px] border border-[#2A2F3D] bg-[#1D212C] px-[5px] py-[1.5px] text-[#868DA3]">Enter</span>
            <span className="text-[#868DA3]"> to save</span>
          </span>

          <button
            type="button"
            onClick={handleCreateSnippet}
            className="rounded-[8px] bg-[#7C9EFF] px-4 py-2 text-[14px] font-semibold text-[#0D0F16] shadow-[0_8px_22px_-10px_rgba(124,158,255,0.6)] transition-all duration-150 hover:bg-[#93AEFF] hover:shadow-[0_8px_24px_-10px_rgba(124,158,255,0.8)] active:translate-y-px focus:outline-none focus:ring-2 focus:ring-[#7C9EFF] focus:ring-offset-2 focus:ring-offset-[#0D0F16]"
          >
            Create snippet
          </button>
        </div>

        <section className="mt-[52px]">
          <div className="mb-[14px] text-[12.5px] font-semibold uppercase tracking-[0.6px] text-[#868DA3]">
            Recent snippets
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {snippets.map((snippet) => (
              <article
                key={snippet.id}
                className="rounded-[10px] border border-[#2A2F3D] bg-[#161922] p-[14px] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#565C70]"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-[8px]">
                    <span
                      className="inline-block h-[8px] w-[8px] rounded-full"
                      style={{
                        backgroundColor: getLanguageDotColor(
                          LANGUAGE_OPTIONS.find((option) => option.label === snippet.language) ??
                            LANGUAGE_OPTIONS[0]
                        ),
                      }}
                    />
                    <span className="max-w-[150px] truncate font-mono text-[13px] font-semibold text-[#E6E8F0]">
                      {snippet.title}.{snippet.ext}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-[6px] bg-[#1D212C] px-[9px] py-[8px] font-mono text-[11.5px] text-[#868DA3]">
                    {snippet.preview || "// empty snippet"}
                  </div>

                  <div className="text-[11px] text-[#565C70]">
                    {snippet.language} · {snippet.lineCount} line{snippet.lineCount === 1 ? "" : "s"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {toast && (
        <div className="pointer-events-none fixed bottom-[28px] left-1/2 flex -translate-x-1/2 translate-y-[12px] items-center gap-[9px] rounded-[9px] border border-[#2A2F3D] bg-[#1D212C] px-[16px] py-[10px] text-[13px] font-medium text-[#E6E8F0] opacity-100 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] transition-all duration-200 ease-out">
          <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#5FE3B3]" />
          <span>{toast}</span>
        </div>
      )}
    </main>
  );
}
