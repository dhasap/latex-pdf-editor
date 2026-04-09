"use client";

import { useEditorStore } from "@/lib/store";
import { Terminal, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const compilers = [
  { id: "pdflatex", name: "pdfLaTeX", description: "Standard compiler, best for most documents" },
  { id: "xelatex", name: "XeLaTeX", description: "Supports modern fonts (fontspec) and Unicode" },
  { id: "lualatex", name: "LuaLaTeX", description: "Modern engine with Lua scripting support" },
] as const;

export default function CompilerSelector() {
  const { compiler, setCompiler } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = compilers.find((c) => c.id === compiler);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: "pdflatex" | "xelatex" | "lualatex") => {
    setCompiler(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        title={selected?.description}
      >
        <Terminal size={16} />
        <span className="hidden sm:inline">{selected?.name || "Compiler"}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg z-50 overflow-hidden">
          {compilers.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${
                compiler === c.id
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <div className="font-medium text-sm">{c.name}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {c.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
