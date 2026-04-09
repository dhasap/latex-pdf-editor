"use client";

import { useEditorStore } from "@/lib/store";
import { Loader2, FileText } from "lucide-react";

export default function PDFPreview() {
  const { pdfUrl, isCompiling, error } = useEditorStore();

  if (isCompiling) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-lg">Compiling LaTeX...</p>
        <p className="text-sm mt-2">This may take a few seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 max-w-md">
          <h3 className="text-red-700 dark:text-red-300 font-semibold mb-2">Compilation Error</h3>
          <p className="text-red-600 dark:text-red-400 text-sm whitespace-pre-wrap font-mono">{error}</p>
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
        <FileText size={64} className="mb-4 opacity-50" />
        <p className="text-lg">No PDF yet</p>
        <p className="text-sm mt-2">Click &quot;Compile&quot; to generate PDF</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900">
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
      />
    </div>
  );
}
