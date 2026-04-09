"use client";

import { useEditorStore } from "@/lib/store";
import { templates } from "@/lib/templates";
import { FileText, ChevronDown, Check, Layout, Presentation, FunctionSquare, Mail, AlertTriangle, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const iconMap: Record<string, React.ReactNode> = {
  article: <FileText size={16} />,
  resume: <Layout size={16} />,
  letter: <Mail size={16} />,
  beamer: <Presentation size={16} />,
  math: <FunctionSquare size={16} />,
};

export default function TemplateSelector() {
  const {
    selectedTemplate,
    setSelectedTemplate,
    setCode,
    resetToTemplate,
    isCodeModified,
  } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = templates.find((t) => t.id === selectedTemplate);
  const hasChanges = isCodeModified();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    // Don't do anything if selecting the same template
    if (id === selectedTemplate) {
      setIsOpen(false);
      return;
    }

    // Check if code has been modified (using store's normalized comparison)
    if (hasChanges) {
      setPendingTemplate(id);
      setShowConfirmDialog(true);
      setIsOpen(false);
      return;
    }

    applyTemplate(id);
  };

  const applyTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setSelectedTemplate(id);
      setCode(template.code);
    }
    setIsOpen(false);
    setShowConfirmDialog(false);
    setPendingTemplate(null);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setPendingTemplate(null);
  };

  const handleReset = () => {
    resetToTemplate();
  };

  // Handle case where selected template doesn't exist (shouldn't happen with validation)
  const displayTemplate = selected || templates[0];

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400">
              {iconMap[displayTemplate.id] || <FileText size={16} />}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Template</span>
              <span className="text-sm font-semibold -mt-0.5">{displayTemplate.name}</span>
            </div>
            <span className="sm:hidden text-sm font-medium">{displayTemplate.name.split(" ")[0]}</span>
            <ChevronDown
              size={14}
              className={`text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-900/10 dark:shadow-black/20 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Choose Template
                </p>
              </div>
              <div className="max-h-[60vh] overflow-y-auto py-1">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelect(template.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-all duration-150 flex items-start gap-3 group ${
                      selectedTemplate === template.id
                        ? "bg-blue-50/50 dark:bg-blue-950/20"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors ${
                        selectedTemplate === template.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                      }`}
                    >
                      {iconMap[template.id] || <FileText size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-sm ${
                            selectedTemplate === template.id
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {template.name}
                        </span>
                        {selectedTemplate === template.id && (
                          <Check size={14} className="text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset to Template Button - only show when code is modified */}
        {hasChanges && (
          <button
            onClick={handleReset}
            title={`Reset to ${displayTemplate.name} template`}
            className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200"
          >
            <RotateCcw size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Unsaved Changes
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Your current code will be replaced
                </p>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-300 mb-6">
              You have made changes to the current template. Switching to &quot;
              <span className="font-semibold">
                {templates.find((t) => t.id === pendingTemplate)?.name}
              </span>
              &quot; will overwrite your current code.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => applyTemplate(pendingTemplate)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
              >
                Switch Template
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
