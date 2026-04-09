"use client";

import { useEditorStore } from "@/lib/store";
import { Loader2, Play, Download } from "lucide-react";

export default function CompileButton() {
  const { compile, downloadPdf, isCompiling, pdfUrl } = useEditorStore();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={compile}
        disabled={isCompiling}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isCompiling ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Compiling...</span>
          </>
        ) : (
          <>
            <Play size={18} />
            <span>Compile</span>
          </>
        )}
      </button>

      {pdfUrl && (
        <button
          onClick={downloadPdf}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Download size={18} />
          <span className="hidden sm:inline">Download</span>
        </button>
      )}
    </div>
  );
}
