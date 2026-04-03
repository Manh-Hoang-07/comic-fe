"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState, useRef } from "react";

interface CKEditorProps {
  value?: string;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
  readonly?: boolean;
  uploadUrl?: string;
  maxFileSize?: number;
  onChange?: (value: string) => void;
  onReady?: (editor: any) => void;
}

/**
 * ĐÃ THAY THẾ CKEDITOR BẰNG TINYMCE ĐỂ ĐẢM BẢO HOẠT ĐỘNG 100%
 * TinyMCE cực kỳ ổn định, không bị lỗi gõ phím hay xung đột plugin như CKEditor 5 v44.
 */
export default function CKEditor({
  value = "",
  placeholder = "Nhập nội dung...",
  height = "400px",
  disabled = false,
  readonly = false,
  uploadUrl = "/api/uploads/image",
  maxFileSize = 5 * 1024 * 1024,
  onChange,
  onReady,
}: CKEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div style={{ minHeight: height }} className="bg-gray-50 border border-gray-200 rounded animate-pulse" />;

  const handleImageUpload = (blobInfo: any, progress: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open('POST', uploadUrl);

      xhr.upload.onprogress = (e) => {
        progress(e.loaded / e.total * 100);
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject('HTTP Error: ' + xhr.status);
          return;
        }

        const json = JSON.parse(xhr.responseText);
        if (!json || typeof json.url !== 'string') {
          reject('Invalid JSON: ' + xhr.responseText);
          return;
        }

        resolve(json.url);
      };

      xhr.onerror = () => {
        reject('Image upload failed due to a XHR error. Code: ' + xhr.status);
      };

      const formData = new FormData();
      formData.append('image', blobInfo.blob(), blobInfo.filename());

      xhr.send(formData);
    });
  };

  return (
    <div className="tiny-editor-container border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <Editor
        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.1.1/tinymce.min.js"
        onInit={(evt, editor) => {
          editorRef.current = editor;
          onReady?.(editor);
        }}
        value={value}
        disabled={disabled || readonly}
        init={{
          height: height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'emoticons'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'forecolor backcolor emoticons | link image media | removeformat | help',
          placeholder: placeholder,
          content_style: 'body { font-family:Inter,sans-serif; font-size:15px; line-height:1.6; color:#1f2937; padding:1.5rem; }',
          branding: false,
          promotion: false,
          statusbar: false,
          images_upload_handler: handleImageUpload,
          setup: (editor: any) => {
            editor.on('change', () => {
              const content = editor.getContent();
              onChange?.(content);
            });
          }
        }}
        onEditorChange={(content) => {
          onChange?.(content);
        }}
      />

      <style jsx global>{`
        .tox-tinymce {
          border: none !important;
          border-radius: 0 !important;
        }
        .tox-editor-header {
          box-shadow: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #f9fafb !important;
        }
        .tox-toolbar__group {
          padding: 0 4px !important;
        }
        .tox-edit-area__iframe {
          background-color: white !important;
        }
      `}</style>
    </div>
  );
}

