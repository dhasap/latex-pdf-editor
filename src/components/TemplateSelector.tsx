"use client";

import { useEditorStore } from "@/lib/store";
import { templates } from "@/lib/templates";
import { FileText, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate, setCode } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);

  const selected = templates.find((t) => t.id === selectedTemplate);

  const handleSelect = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setSelectedTemplate(id);
      setCode(template.code);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
      >
        <FileText size={16} />
        <span className="hidden sm:inline">{selected?.name || "Templates"}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg z-50 overflow-hidden">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className={`w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${
                  selectedTemplate === template.id
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {template.description}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
