"use client";

import { useEditorStore } from "@/lib/store";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState, useCallback, useRef } from "react";

// Global flag to track if LaTeX language has been registered
let isLatexLanguageRegistered = false;

export default function LatexEditor() {
  const { code, setCode } = useEditorStore();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Local state for editor content to prevent re-render storm
  const [localCode, setLocalCode] = useState(code);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local code with store code when component mounts or code changes externally
  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  // Debounced update to Zustand store
  const handleEditorChange = useCallback((value: string | undefined) => {
    const newValue = value || "";
    setLocalCode(newValue);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce update to store (300ms)
    debounceRef.current = setTimeout(() => {
      setCode(newValue);
    }, 300);
  }, [setCode]);

  // Cleanup debounce on unmount
  useEffect(() => {
    setMounted(true);
    // Set a timeout to fallback to textarea if Monaco takes too long to load
    fallbackTimeoutRef.current = setTimeout(() => {
      // If still mounted and no editor detected, fallback
      const monacoContainer = document.querySelector('[data-testid="monaco-editor"]');
      if (!monacoContainer) {
        console.warn('[LatexEditor] Monaco took too long to load, falling back to textarea');
        setUseFallback(true);
      }
    }, 5000); // 5 second timeout
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, []);

  // Flush pending changes on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        // Ensure final state is saved
        setCode(localCode);
      }
    };
  }, [localCode, setCode]);

  // Handle textarea change (fallback editor)
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleEditorChange(e.target.value);
  };

  // Handle keyboard shortcuts in textarea
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      const compileButton = document.querySelector("[data-compile-button]") as HTMLButtonElement | null;
      if (compileButton && !compileButton.disabled) {
        compileButton.click();
      }
    }
    // Tab support
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = localCode.substring(0, start) + "  " + localCode.substring(end);
      handleEditorChange(newValue);
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback to textarea if Monaco takes too long or fails
  if (useFallback) {
    return (
      <div className="h-full w-full relative group">
        <textarea
          ref={textareaRef}
          value={localCode}
          onChange={handleTextareaChange}
          onKeyDown={handleTextareaKeyDown}
          className="w-full h-full resize-none outline-none p-4 font-mono text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-0"
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            lineHeight: 1.6,
            tabSize: 2,
          }}
          spellCheck={false}
        />
        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-zinc-100 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 flex items-center px-3 text-[10px] text-zinc-500 dark:text-zinc-400 select-none">
          <span className="font-medium mr-3">LaTeX (Fallback Mode)</span>
          <span className="mr-3">UTF-8</span>
          <span>{(localCode?.match(/\n/g) || []).length + 1 || 1} lines</span>
          <span className="ml-auto">{localCode?.length || 0} characters</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative group">
      <Editor
        height="100%"
        defaultLanguage="latex"
        value={localCode}
        onChange={handleEditorChange}
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          wordWrap: "on",
          tabSize: 2,
          insertSpaces: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontLigatures: true,
          padding: { top: 16, bottom: 16 },
          lineHeight: 1.6,
          renderWhitespace: "selection",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          folding: true,
          foldingHighlight: true,
          showFoldingControls: "always",
        }}
        loading={
          <div className="h-full w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-zinc-500">Loading Monaco Editor...</span>
            </div>
          </div>
        }
        onMount={(editor, monaco) => {
          // Clear fallback timeout since Monaco loaded successfully
          if (fallbackTimeoutRef.current) {
            clearTimeout(fallbackTimeoutRef.current);
            fallbackTimeoutRef.current = null;
          }

          // Register LaTeX language only once globally
          if (!isLatexLanguageRegistered) {
            isLatexLanguageRegistered = true;

            monaco.languages.register({ id: "latex" });
            monaco.languages.setLanguageConfiguration("latex", {
              comments: {
                lineComment: "%",
              },
              brackets: [
                ["{", "}"],
                ["[", "]"],
                ["(", ")"],
              ],
              autoClosingPairs: [
                { open: "{", close: "}" },
                { open: "[", close: "]" },
                { open: "(", close: ")" },
                { open: "$$", close: "$$" },
                { open: "$", close: "$" },
              ],
              surroundingPairs: [
                { open: "{", close: "}" },
                { open: "[", close: "]" },
                { open: "(", close: ")" },
                { open: "$", close: "$" },
              ],
            });
          }

          // Add custom command for compile
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            const compileButton = document.querySelector("[data-compile-button]") as HTMLButtonElement | null;
            if (compileButton && !compileButton.disabled) {
              compileButton.click();
            }
          });
        }}
      />

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-zinc-100 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 flex items-center px-3 text-[10px] text-zinc-500 dark:text-zinc-400 select-none pointer-events-none">
        <span className="font-medium mr-3">LaTeX</span>
        <span className="mr-3">UTF-8</span>
        <span>{(localCode?.match(/\n/g) || []).length + 1 || 1} lines</span>
        <span className="ml-auto">{localCode?.length || 0} characters</span>
      </div>
    </div>
  );
}
