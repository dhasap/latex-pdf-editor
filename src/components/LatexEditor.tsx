"use client";

import { useEditorStore } from "@/lib/store";
import Editor from "@monaco-editor/react";

export default function LatexEditor() {
  const { code, setCode } = useEditorStore();

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="tex"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
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
