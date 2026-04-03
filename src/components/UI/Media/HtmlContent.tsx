"use client";

import { useEffect, useRef, useState } from "react";

interface HtmlContentProps {
  content: string;
  maxLines?: number;
  placeholder?: string;
  clickable?: boolean;
  allowHtml?: boolean;
  onClick?: (content: string) => void;
}

export default function HtmlContent({
  content,
  maxLines = 3,
  placeholder = "Không có nội dung",
  clickable = false,
  allowHtml = true,
  onClick,
}: HtmlContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    if (!content) {
      setSanitizedContent("");
      return;
    }

    if (!allowHtml) {
      // Strip HTML tags
      const div = document.createElement("div");
      div.innerHTML = content;
      setSanitizedContent(div.textContent || div.innerText || "");
      return;
    }

    // Basic HTML sanitization
    const allowedTags = [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "pre",
    ];
    const allowedAttributes = ["clas", "style"];

    let sanitized = content;

    // Remove script tags and event handlers
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

    // Only allow specific tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitized;

    // Remove disallowed tags
    const allTags = tempDiv.querySelectorAll("*");
    allTags.forEach((tag) => {
      if (!allowedTags.includes(tag.tagName.toLowerCase())) {
        tag.outerHTML = tag.innerHTML;
      }
    });

    // Remove disallowed attributes
    allTags.forEach((tag) => {
      const attributes = Array.from(tag.attributes);
      attributes.forEach((attr) => {
        if (!allowedAttributes.includes(attr.name.toLowerCase())) {
          tag.removeAttribute(attr.name);
        }
      });
    });

    setSanitizedContent(tempDiv.innerHTML);
  }, [content, allowHtml]);

  const handleClick = () => {
    if (clickable && onClick) {
      onClick(content);
    }
  };

  const lineClampClass =
    maxLines > 0
      ? `line-clamp-${Math.min(maxLines, 5)}`
      : "";

  if (!content) {
    return <span className="text-gray-400 italic">{placeholder}</span>;
  }

  return (
    <div className="html-content">
      <div
        ref={contentRef}
        className={`content-preview ${lineClampClass} ${clickable ? "cursor-pointer" : ""}`}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        onClick={handleClick}
      />
    </div>
  );
}



