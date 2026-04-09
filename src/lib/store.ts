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
  setCode: (code: string) => void;
  setPdfUrl: (url: string | null) => void;
  setIsCompiling: (isCompiling: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTemplate: (template: string) => void;
  compile: () => Promise<void>;
  downloadPdf: () => void;
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

      setCode: (code) => set({ code }),
      setPdfUrl: (url) => set({ pdfUrl: url }),
      setIsCompiling: (isCompiling) => set({ isCompiling }),
      setError: (error) => set({ error }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),

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
            const errorText = await response.text();

            // Handle 500 error - API down
            if (response.status === 500) {
              set({
                isApiDown: true,
                error: "Server sedang maintenance/down. Coba lagi nanti.",
                isCompiling: false
              });
              return;
            }

            throw new Error(`Compilation failed: ${errorText}`);
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          set({ pdfUrl: url, isCompiling: false, isApiDown: false });
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
          link.click();
        }
      },
    }),
    {
      name: "latex-editor-storage",
      partialize: (state) => ({ code: state.code, selectedTemplate: state.selectedTemplate }),
    }
  )
);
