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
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="tex"
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
        }}
      />
    </div>
  );
}
