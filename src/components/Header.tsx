"use client";

import { FileText, Github, BookOpen, Menu, X, Sparkles } from "lucide-react";
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
            <Github size={16} />
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
              <Github size={18} />
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
