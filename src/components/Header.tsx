"use client";

import { FileText, BookOpen, Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useEditorStore } from "@/lib/store";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { activeTab, setActiveTab, isMobile } = useEditorStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-sm border-b border-zinc-200/50 dark:border-zinc-800/50"
          : "bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="mx-auto flex h-14 md:h-16 max-w-[1920px] items-center justify-between px-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <FileText size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              LaTeX Editor
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 dark:text-zinc-400 -mt-0.5">
              Online PDF Compiler
            </span>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        {isMobile && (
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "editor"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "preview"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              Preview
            </button>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <a
            href="https://github.com/YtoTech/latex-on-http"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            <span>API</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
          >
            <BookOpen size={16} />
            <span>Docs</span>
          </a>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <a
            href="https://github.com/dhasap/latex-pdf-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles size={14} />
            <span>Star on GitHub</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-lg">
          <nav className="flex flex-col p-3 gap-1">
            <a
              href="https://github.com/YtoTech/latex-on-http"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>API Documentation</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={18} />
              <span>Documentation</span>
            </a>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
            <a
              href="https://github.com/dhasap/latex-pdf-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Sparkles size={16} />
              <span>Star on GitHub</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
