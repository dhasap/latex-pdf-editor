"use client";

import { useEditorStore } from "@/lib/store";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LatexEditor() {
  const { code, setCode } = useEditorStore();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full relative group">
      <Editor
        height="100%"
        defaultLanguage="latex"
        value={code}
        onChange={(value) => setCode(value || "")}
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
              <span className="text-sm text-zinc-500">Loading editor...</span>
            </div>
          </div>
        }
      />

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-zinc-100 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 flex items-center px-3 text-[10px] text-zinc-500 dark:text-zinc-400 select-none pointer-events-none">
        <span className="font-medium mr-3">LaTeX</span>
        <span className="mr-3">UTF-8</span>
        <span>{code.split('\n').length} lines</span>
        <span className="ml-auto">{code.length} characters</span>
      </div>
    </div>
  );
}
