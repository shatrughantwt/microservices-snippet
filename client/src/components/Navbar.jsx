import React from "react";

const Navbar = () => {
  return (
    <header className="mb-6 flex items-center justify-between px-1">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3b82f6]/20 text-[#7aa8ff] ring-1 ring-[#5d86c9]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M8.5 7.5L4 12l4.5 4.5L7 18l-6-6 6-6 1.5 1.5zm7 9L20 12l-4.5-4.5L17 6l6 6-6 6-1.5-1.5zM13.75 3l-1.5 1.5 5.25 15 1.5-1.5-5.25-15z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">Snippets</h1>
      </div>

      <button className="rounded-md border border-slate-600 bg-transparent px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800">
        Log out
      </button>
    </header>
  );
};

export default Navbar;
