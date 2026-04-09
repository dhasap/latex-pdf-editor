"use client";

import { useEditorStore } from "@/lib/store";
import { Loader2, FileText, AlertTriangle, Clock } from "lucide-react";

export default function PDFPreview() {
  const { pdfUrl, isCompiling, error, isApiDown } = useEditorStore();

  if (isCompiling) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-lg">Compiling LaTeX...</p>
        <p className="text-sm mt-2">This may take a few seconds</p>
      </div>
    );
  }

  if (isApiDown) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 mx-auto mb-4">
            <AlertTriangle className="text-amber-600 dark:text-amber-400" size={32} />
          </div>
          <h3 className="text-amber-800 dark:text-amber-200 font-semibold text-lg mb-2">
            Server Maintenance
          </h3>
          <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
            {error}
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 text-xs">
            <Clock size={14} />
            <span>Coba lagi dalam beberapa menit</span>
          </div>
        </div>
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
