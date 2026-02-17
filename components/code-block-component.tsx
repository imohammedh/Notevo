"use client";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { Check, Copy, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
export const CodeBlockComponent = ({
  node,
  updateAttributes,
  extension,
}: any) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(node.textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const languages = [
    { value: "plaintext", label: "Plain Text" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "sql", label: "SQL" },
    { value: "bash", label: "Bash" },
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "markdown", label: "Markdown" },
  ];

  const currentLanguage = languages.find(
    (lang) => lang.value === (node.attrs.language || "plaintext"),
  );

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <div className="code-block-header">
        <div className="relative">
          <Button
            variant="ghost"
            className=" h-8 px-2 py-2 gap-2"
            contentEditable={false}
            onClick={() => setIsOpen(!isOpen)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            type="button"
          >
            {currentLanguage?.label}
            <ChevronDown className="w-3 h-3" />
          </Button>
          {isOpen && (
            <div
              contentEditable={false}
              className="absolute top-full left-0 mt-1 py-1 rounded-md shadow-lg border z-50 max-h-64 overflow-y-auto"
              style={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                minWidth: "140px",
              }}
            >
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    updateAttributes({ language: lang.value });
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-[hsl(var(--primary))]/10 transition-colors"
                  style={{
                    color:
                      lang.value === node.attrs.language
                        ? "hsl(var(--primary))"
                        : "hsl(var(--foreground))",
                    fontWeight:
                      lang.value === node.attrs.language ? "600" : "400",
                  }}
                  type="button"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className=" h-8 px-2 py-2 gap-2"
          contentEditable={false}
          onClick={copyToClipboard}
          type="button"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span className="font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <pre className="code-block-content">
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};
