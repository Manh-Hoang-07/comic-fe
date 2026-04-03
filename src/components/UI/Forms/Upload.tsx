"use client";

import { useState, useRef } from "react";
import { useUpload, UploadResponse } from "@/hooks/useUpload";

interface UploadProps {
  value?: string | string[] | null;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // bytes
  disabled?: boolean;
  dragText?: string;
  hintText?: string;
  helpText?: string;
  onChange?: (value: string | string[] | null) => void;
  onUploaded?: (response: UploadResponse | UploadResponse[]) => void;
  onError?: (error: Error) => void;
  onRemove?: () => void;
}

export default function Upload({
  value,
  multiple = false,
  accept = "",
  maxSize = 10 * 1024 * 1024,
  disabled = false,
  dragText = "Kéo thả file vào đây hoặc click để chọn",
  hintText,
  helpText,
  onChange,
  onUploaded,
  onError,
  onRemove,
}: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResponse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploadFiles, uploading, error, progress } = useUpload();

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const getFileUrl = (path: string | undefined): string | null => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    if (path.startsWith("/")) {
      return `${apiBase}${path}`;
    }
    return path;
  };

  const hasFile = multiple ? uploadedFiles.length > 0 : uploadedFile !== null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const triggerFileInput = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    await processFiles(files);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled || uploading) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length === 0) return;
    await processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    try {
      if (multiple) {
        const responses = await uploadFiles(files, { maxSize });
        const newFiles = [...uploadedFiles, ...responses];
        setUploadedFiles(newFiles);
        const urls = newFiles.map((f) => f.url || f.path).filter(Boolean) as string[];
        onChange?.(urls);
        onUploaded?.(responses);
      } else {
        const file = files[0];
        if (!file) return;
        const response = await uploadFile(file, { maxSize });
        setUploadedFile(response);
        const urlToEmit = response.url || response.path || "";
        onChange?.(urlToEmit);
        onUploaded?.(response);
      }
    } catch (err) {
      onError?.(err as Error);
    }
  };

  const removeFile = (index?: number) => {
    if (multiple && typeof index === "number") {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);
      const urls = newFiles.map((f) => f.url || f.path).filter(Boolean) as string[];
      onChange?.(urls.length > 0 ? urls : null);
      onRemove?.();
    } else {
      setUploadedFile(null);
      onChange?.(null);
      onRemove?.();
    }
  };

  const defaultHintText =
    hintText ||
    (multiple
      ? `Tối đa 10 files, mỗi file tối đa ${(maxSize / 1024 / 1024).toFixed(2)}MB`
      : `Kích thước tối đa ${(maxSize / 1024 / 1024).toFixed(2)}MB`);

  return (
    <div className="upload-component">
      <div
        className={`upload-area border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-100"
            : disabled || uploading
            ? "opacity-50 cursor-not-allowed border-gray-300"
            : hasFile
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          disabled={disabled || uploading}
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="upload-content flex flex-col items-center justify-center">
          <div className="mb-4">
            {!uploading && !hasFile && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
            {uploading && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            )}
            {hasFile && !uploading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          <div className="upload-text flex flex-col items-center">
            <p
              className={`font-medium ${
                !uploading && !hasFile
                  ? "text-gray-700"
                  : uploading
                  ? "text-blue-600"
                  : "text-green-600"
              }`}
            >
              {!uploading && !hasFile
                ? dragText
                : uploading
                ? "Đang upload..."
                : "Upload thành công!"}
            </p>
            {!uploading && !hasFile && (
              <p className="text-sm text-gray-500 mt-1">{defaultHintText}</p>
            )}
          </div>

          {uploading && progress > 0 && (
            <div className="w-full mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">{progress}%</p>
            </div>
          )}
        </div>
      </div>

      {multiple && uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.filename || `File ${index + 1}`}
                  </p>
                  {file.size && file.mimetype && (
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.mimetype}
                    </p>
                  )}
                </div>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 transition"
                  title="Xóa file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!multiple && uploadedFile && (
        <div className="mt-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadedFile.filename || "File"}
                </p>
                {uploadedFile.size && uploadedFile.mimetype && (
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.size)} • {uploadedFile.mimetype}
                  </p>
                )}
                {(uploadedFile.url || uploadedFile.path) && (
                  <a
                    href={getFileUrl(uploadedFile.url || uploadedFile.path || "") || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                  >
                    Xem file
                  </a>
                )}
              </div>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeFile()}
                className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 transition"
                title="Xóa file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {helpText && !error && (
        <p className="mt-2 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}



