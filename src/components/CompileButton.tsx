"use client";

import { useEditorStore } from "@/lib/store";
import { Loader2, Play, Download, FileCheck, Zap } from "lucide-react";
import { toast } from "sonner";

export default function CompileButton() {
  const { compile, downloadPdf, isCompiling, pdfUrl } = useEditorStore();

  const handleCompile = async () => {
    toast.promise(compile(), {
      loading: "Compiling LaTeX document...",
      success: "PDF compiled successfully!",
      error: (err) => `Compilation failed: ${err?.message || "Unknown error"}`,
    });
  };

  const handleDownload = () => {
    downloadPdf();
    toast.success("PDF download started!");
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <button
        onClick={handleCompile}
        disabled={isCompiling}
        className="group relative flex items-center gap-2 md:gap-2.5 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm md:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 transition-all duration-200 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        {isCompiling ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span className="hidden sm:inline">Compiling...</span>
            <span className="sm:hidden">Working...</span>
          </>
        ) : (
          <>
            <Zap size={18} className="hidden sm:block" />
            <Play size={18} className="sm:hidden" />
            <span className="hidden sm:inline">Compile</span>
            <span className="sm:hidden">Run</span>
          </>
        )}
      </button>

      {pdfUrl && (
        <button
          onClick={handleDownload}
          className="group flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          title="Download PDF"
        >
          <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
          <span className="hidden md:inline">Download</span>
        </button>
      )}
    </div>
  );
}
