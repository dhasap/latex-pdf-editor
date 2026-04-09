import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultCode, templates, defaultTemplateId } from "./templates";

interface EditorState {
  code: string;
  pdfUrl: string | null;
  isCompiling: boolean;
  error: string | null;
  isApiDown: boolean;
  selectedTemplate: string;
  activeTab: "editor" | "preview";
  isMobile: boolean;
  // Track active compile request for cancellation
  activeCompileAbortController: AbortController | null;
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
  revokePdfUrl: () => void;
  cancelCompile: () => void;
  resetToTemplate: () => void;
  // Helper to check if current code matches selected template
  isCodeModified: () => boolean;
}

// Helper to normalize line endings for comparison
const normalizeLineEndings = (str: string): string => {
  return str.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
};

// Helper to validate and fix persisted state
const validatePersistedState = (state: Partial<EditorState>) => {
  const validTemplateIds = templates.map((t) => t.id);
  let needsFix = false;
  let fixedState: Partial<EditorState> = { ...state };

  // Check if selectedTemplate exists in templates
  if (!state.selectedTemplate || !validTemplateIds.includes(state.selectedTemplate)) {
    fixedState.selectedTemplate = defaultTemplateId;
    fixedState.code = defaultCode;
    needsFix = true;
  }

  // If code doesn't match the selected template, it means user modified it
  // This is valid - we keep the modified code but ensure selectedTemplate is valid

  return { fixedState, needsFix };
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      code: defaultCode,
      pdfUrl: null,
      isCompiling: false,
      error: null,
      isApiDown: false,
      selectedTemplate: defaultTemplateId,
      activeTab: "editor",
      isMobile: false,
      activeCompileAbortController: null,

      setCode: (code) => set({ code }),
      setPdfUrl: (url) => set({ pdfUrl: url }),
      setIsCompiling: (isCompiling) => set({ isCompiling }),
      setError: (error) => set({ error }),
      setSelectedTemplate: (template) => {
        // Validate template exists
        const validTemplate = templates.find((t) => t.id === template);
        if (!validTemplate) {
          console.warn(`[Store] Invalid template ID: ${template}, falling back to default`);
          set({ selectedTemplate: defaultTemplateId, code: defaultCode });
          return;
        }
        set({ selectedTemplate: template, code: validTemplate.code });
      },
      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsMobile: (isMobile) => set({ isMobile }),
      clearError: () => set({ error: null, isApiDown: false }),

      cancelCompile: () => {
        const { activeCompileAbortController } = get();
        if (activeCompileAbortController) {
          activeCompileAbortController.abort();
          set({ activeCompileAbortController: null, isCompiling: false });
        }
      },

      revokePdfUrl: () => {
        const { pdfUrl } = get();
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
      },

      resetToTemplate: () => {
        const { selectedTemplate } = get();
        const template = templates.find((t) => t.id === selectedTemplate);
        if (template) {
          set({ code: template.code });
        }
      },

      isCodeModified: () => {
        const { code, selectedTemplate } = get();
        const template = templates.find((t) => t.id === selectedTemplate);
        if (!template) return false;
        return normalizeLineEndings(code) !== normalizeLineEndings(template.code);
      },

      compile: async () => {
        const { pdfUrl, activeCompileAbortController, isMobile } = get();

        // Cancel any ongoing compile request and wait briefly
        if (activeCompileAbortController) {
          activeCompileAbortController.abort();
          // Small delay to ensure cleanup completes
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Create new abort controller for this request
        const abortController = new AbortController();

        // Revoke previous URL and reset state
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }

        set({
          isCompiling: true,
          error: null,
          isApiDown: false,
          pdfUrl: null,
          activeCompileAbortController: abortController,
        });

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
                  content: get().code,
                  file: "main.tex",
                },
              ],
            }),
            signal: abortController.signal,
          });

          // Clear abort controller after request completes
          set({ activeCompileAbortController: null });

          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
            } catch {
              errorData = { error: await response.text() };
            }

            // Handle 500/502 error - API down
            if (response.status === 500 || response.status === 502) {
              const error = new Error("Server sedang maintenance/down. Coba lagi nanti.");
              set({
                isApiDown: true,
                error: error.message,
                isCompiling: false,
                pdfUrl: null,
              });
              throw error;
            }

            const error = new Error(errorData.error || `Compilation failed: ${response.status}`);
            set({
              error: error.message,
              isCompiling: false,
              pdfUrl: null,
            });
            throw error;
          }

          // Validate content type is PDF
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/pdf")) {
            const text = await response.text();
            const error = new Error(`Invalid response type: expected PDF, got ${contentType || "unknown"}. Response: ${text.substring(0, 200)}`);
            set({
              error: error.message,
              isCompiling: false,
              pdfUrl: null,
            });
            throw error;
          }

          const blob = await response.blob();

          // Validate blob is not empty and is PDF
          if (blob.size === 0) {
            const error = new Error("Received empty PDF");
            set({
              error: error.message,
              isCompiling: false,
              pdfUrl: null,
            });
            throw error;
          }

          const url = URL.createObjectURL(blob);
          // Only auto-switch to preview on mobile, not on desktop
          const state: { pdfUrl: string; isCompiling: boolean; isApiDown: boolean; activeTab?: "editor" | "preview" } = { pdfUrl: url, isCompiling: false, isApiDown: false };
          if (isMobile) {
            state.activeTab = "preview";
          }
          set(state);
        } catch (err) {
          // Don't update state if request was aborted
          if (err instanceof Error && err.name === "AbortError") {
            return;
          }

          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          set({
            error: errorMessage,
            isCompiling: false,
            pdfUrl: null,
            activeCompileAbortController: null,
          });
          // Re-throw so toast.promise can catch it
          throw err instanceof Error ? err : new Error(errorMessage);
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
      // Validate and fix persisted state on rehydration
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const { fixedState, needsFix } = validatePersistedState(state);

        if (needsFix) {
          console.log("[Store] Fixing invalid persisted state:", fixedState);
          // Apply fixes
          state.selectedTemplate = fixedState.selectedTemplate!;
          state.code = fixedState.code!;
        }
      },
    }
  )
);
