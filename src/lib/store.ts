import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultCode } from "./templates";

interface EditorState {
  code: string;
  pdfUrl: string | null;
  isCompiling: boolean;
  error: string | null;
  isApiDown: boolean;
  selectedTemplate: string;
  activeTab: "editor" | "preview";
  isMobile: boolean;
  setCode: (code: string) => void;
  setPdfUrl: (url: string | null) => void;
  setIsCompiling: (isCompiling: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTemplate: (template: string) => void;
  setActiveTab: (tab: "editor" | "preview") => void;
  setIsMobile: (isMobile: boolean) => void;
  compile: () => Promise<void>;
  downloadPdf: () => void;
  clearError: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      code: defaultCode,
      pdfUrl: null,
      isCompiling: false,
      error: null,
      isApiDown: false,
      selectedTemplate: "article",
      activeTab: "editor",
      isMobile: false,

      setCode: (code) => set({ code }),
      setPdfUrl: (url) => set({ pdfUrl: url }),
      setIsCompiling: (isCompiling) => set({ isCompiling }),
      setError: (error) => set({ error }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsMobile: (isMobile) => set({ isMobile }),
      clearError: () => set({ error: null, isApiDown: false }),

      compile: async () => {
        const { code } = get();
        set({ isCompiling: true, error: null, isApiDown: false });

        try {
          const response = await fetch("/api/compile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              compiler: "pdflatex",
              resources: [
                {
                  main: true,
                  content: code,
                  file: "main.tex",
                },
              ],
            }),
          });

          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
            } catch {
              errorData = { error: await response.text() };
            }

            // Handle 500/502 error - API down
            if (response.status === 500 || response.status === 502) {
              set({
                isApiDown: true,
                error: "Server sedang maintenance/down. Coba lagi nanti.",
                isCompiling: false
              });
              return;
            }

            throw new Error(errorData.error || `Compilation failed: ${response.status}`);
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          set({ pdfUrl: url, isCompiling: false, isApiDown: false, activeTab: "preview" });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Unknown error",
            isCompiling: false,
          });
        }
      },

      downloadPdf: () => {
        const { pdfUrl } = get();
        if (pdfUrl) {
          const link = document.createElement("a");
          link.href = pdfUrl;
          link.download = "document.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      },
    }),
    {
      name: "latex-editor-storage",
      partialize: (state) => ({ code: state.code, selectedTemplate: state.selectedTemplate }),
    }
  )
);
