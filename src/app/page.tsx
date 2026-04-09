"use client";

import Header from "@/components/Header";
import LatexEditor from "@/components/LatexEditor";
import PDFPreview from "@/components/PDFPreview";
import CompileButton from "@/components/CompileButton";
import TemplateSelector from "@/components/TemplateSelector";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <TemplateSelector />
          <CompileButton />
        </div>

        {/* Editor + Preview */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Editor */}
          <div className="flex-1 h-[50vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800">
            <LatexEditor />
          </div>

          {/* Preview */}
          <div className="flex-1 h-[50vh] lg:h-auto">
            <PDFPreview />
          </div>
        </div>
      </main>
    </div>
  );
}
