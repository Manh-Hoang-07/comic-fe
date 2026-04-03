"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface SimpleEditorProps {
  value?: string;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
  readonly?: boolean;
  onChange?: (value: string) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
}

export default function SimpleEditor({
  value = "",
  placeholder = "Nhập nội dung...",
  height = "300px",
  disabled = false,
  readonly = false,
  onChange,
  onFocus,
  onBlur,
}: SimpleEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(value);

  useEffect(() => {
    if (value !== content && editorRef.current) {
      editorRef.current.innerHTML = value;
      setContent(value);
    }
  }, [value, content]);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setContent(html);
    onChange?.(html);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "z") {
        e.preventDefault();
        execCommand("undo");
      } else if (e.key === "y") {
        e.preventDefault();
        execCommand("redo");
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value || "");
      const event = new Event("input", { bubbles: true });
      editorRef.current.dispatchEvent(event);
    }
  };

  const isActive = (command: string): boolean => {
    if (editorRef.current) {
      return document.queryCommandState(command);
    }
    return false;
  };

  return (
    <div className="simple-editor w-full border border-gray-300 rounded-lg overflow-hidden bg-white">
      {!readonly && (
        <div className="toolbar flex items-center p-2 bg-gray-50 border-b border-gray-200 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => execCommand("bold")}
            className={`px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 ${isActive("bold") ? "bg-blue-500 text-white" : ""
              }`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => execCommand("italic")}
            className={`px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 ${isActive("italic") ? "bg-blue-500 text-white" : ""
              }`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => execCommand("underline")}
            className={`px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 ${isActive("underline") ? "bg-blue-500 text-white" : ""
              }`}
            title="Underline"
          >
            <u>U</u>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => execCommand("insertUnorderedList")}
            className={`px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 ${isActive("insertUnorderedList") ? "bg-blue-500 text-white" : ""
              }`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => execCommand("insertOrderedList")}
            className={`px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 ${isActive("insertOrderedList") ? "bg-blue-500 text-white" : ""
              }`}
            title="Numbered List"
          >
            1. List
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => execCommand("justifyLeft")}
            className={`px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 ${isActive("justifyLeft") ? "bg-blue-500 text-white" : ""
              }`}
            title="Align Left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyCenter")}
            className={`px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 ${isActive("justifyCenter") ? "bg-blue-500 text-white" : ""
              }`}
            title="Align Center"
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyRight")}
            className={`px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 ${isActive("justifyRight") ? "bg-blue-500 text-white" : ""
              }`}
            title="Align Right"
          >
            →
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => execCommand("undo")}
            className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
            title="Undo"
          >
            ↶ Undo
          </button>
          <button
            type="button"
            onClick={() => execCommand("redo")}
            className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
            title="Redo"
          >
            ↷ Redo
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable={!readonly && !disabled}
        className="editor-content min-h-[300px] max-h-[600px] overflow-y-auto p-4 outline-none"
        style={{ minHeight: height }}
        onInput={handleInput}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: content }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        .editor-content:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}



