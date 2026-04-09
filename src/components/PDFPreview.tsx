"use client";

import { useEditorStore } from "@/lib/store";
import { Loader2, FileText, AlertTriangle, Clock, RefreshCw, Eye } from "lucide-react";
import { useEffect, useRef } from "react";

export default function PDFPreview() {
  const { pdfUrl, isCompiling, error, isApiDown, clearError, compile } = useEditorStore();
  const currentPdfUrlRef = useRef<string | null>(null);

  // Cleanup URL when pdfUrl changes
  useEffect(() => {
    if (pdfUrl && pdfUrl !== currentPdfUrlRef.current) {
      if (currentPdfUrlRef.current) {
        URL.revokeObjectURL(currentPdfUrlRef.current);
      }
      currentPdfUrlRef.current = pdfUrl;
    }
  }, [pdfUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentPdfUrlRef.current) {
        URL.revokeObjectURL(currentPdfUrlRef.current);
      }
    };
  }, []);

  const handleRetry = () => {
    clearError();
    compile();
  };

  if (isCompiling) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative p-6 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        </div>
        <p className="mt-6 text-lg font-semibold text-zinc-700 dark:text-zinc-300">Compiling LaTeX...</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">This may take a few seconds</p>
      </div>
    );
  }

  if (isApiDown) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="p-6 md:p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 max-w-md text-center shadow-lg">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4">
            <Clock className="text-amber-600 dark:text-amber-400" size={32} />
          </div>
          <h3 className="text-amber-800 dark:text-amber-200 font-bold text-lg mb-2">Server Maintenance</h3>
          <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 mx-auto rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="p-6 md:p-8 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 max-w-2xl w-full shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <div>
              <h3 className="text-red-700 dark:text-red-300 font-bold">Compilation Error</h3>
              <p className="text-red-600/70 dark:text-red-400/70 text-xs">Check your LaTeX code and try again</p>
            </div>
            <button
              onClick={handleRetry}
              className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-red-100/50 dark:bg-red-900/20 overflow-auto max-h-[50vh]">
            <pre className="text-xs md:text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono leading-relaxed">
              {error}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="relative group">
          <div className="absolute inset-0 bg-zinc-500/10 blur-2xl rounded-full group-hover:bg-blue-500/10 transition-colors duration-500" />
          <div className="relative p-8 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 group-hover:border-blue-200 dark:group-hover:border-blue-800/50 transition-colors">
            <FileText size={48} className="text-zinc-300 dark:text-zinc-600 group-hover:text-blue-400 transition-colors" />
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Eye size={12} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <p className="mt-6 text-xl font-bold text-zinc-400 dark:text-zinc-500">No PDF Preview</p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1 text-center max-w-xs">
          Click the Compile button to generate a PDF preview of your LaTeX document
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-zinc-100 dark:bg-zinc-950 relative">
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div className="w-full h-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
          {/* Use object tag instead of iframe for better blob URL support */}
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full border-0"
            title="PDF Preview"
          >
            {/* Fallback to iframe if object doesn't work */}
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          </object>
        </div>
      </div>
    </div>
  );
}
