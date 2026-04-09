"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import LatexEditor from "@/components/LatexEditor";
import PDFPreview from "@/components/PDFPreview";
import CompileButton from "@/components/CompileButton";
import TemplateSelector from "@/components/TemplateSelector";
import { useEditorStore } from "@/lib/store";

export default function Home() {
  const { activeTab, setActiveTab, setIsMobile } = useEditorStore();

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setActiveTab("editor");
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile, setActiveTab]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
          <TemplateSelector />
          <CompileButton />
        </div>

        {/* Editor + Preview - Desktop Side by Side / Mobile Tab Switch */}
        <div className="flex-1 overflow-hidden relative">
          {/* Desktop: Side by Side */}
          <div className="hidden lg:flex h-full">
            {/* Editor Panel */}
            <div className="flex-1 h-full border-r border-zinc-200 dark:border-zinc-800">
              <LatexEditor />
            </div>

            {/* Preview Panel */}
            <div className="flex-1 h-full">
              <PDFPreview />
            </div>
          </div>

          {/* Mobile: Tab Switching */}
          <div className="lg:hidden h-full">
            {activeTab === "editor" ? (
              <div className="h-full">
                <LatexEditor />
              </div>
            ) : (
              <div className="h-full">
                <PDFPreview />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
