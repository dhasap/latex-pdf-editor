"use client";

import { useEditorStore } from "@/lib/store";
import { templates } from "@/lib/templates";
import { FileText, ChevronDown, Check, Layout, TypeIcon, Presentation, FunctionSquare, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const iconMap: Record<string, React.ReactNode> = {
  article: <FileText size={16} />,
  resume: <Layout size={16} />,
  letter: <Mail size={16} />,
  beamer: <Presentation size={16} />,
  math: <FunctionSquare size={16} />,
};

// Type icon is not available in lucide-react v1.8.0, using FileText as fallback

export default function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate, setCode } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = templates.find((t) => t.id === selectedTemplate);

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
    const template = templates.find((t) => t.id === id);
    if (template) {
      setSelectedTemplate(id);
      setCode(template.code);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400">
          {selected ? iconMap[selected.id] || <FileText size={16} /> : <FileText size={16} />}
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Template</span>
          <span className="text-sm font-semibold -mt-0.5">{selected?.name || "Select"}</span>
        </div>
        <span className="sm:hidden text-sm font-medium">{selected?.name?.split(" ")[0] || "Template"}</span>
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
  );
}
