"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { useUpload } from "@/hooks/useUpload";

interface ImageUploaderProps {
  value?: File | string | null;
  defaultUrl?: string;
  maxSize?: number; // bytes, default 10MB
  autoUpload?: boolean;
  onChange?: (value: string | File | null) => void;
  onRemove?: () => void;
  onUploaded?: (response: any) => void;
  onError?: (error: Error) => void;
  name?: string;
}

const ImageUploader = forwardRef<any, ImageUploaderProps>(
  ({
    value,
    defaultUrl,
    maxSize = 10 * 1024 * 1024,
    autoUpload = true,
    onChange,
    onRemove,
    onUploaded,
    onError,
    name,
  }, ref) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFile, uploading, error: uploadError, progress } = useUpload();

    // Support for external refs if needed
    useImperativeHandle(ref, () => ({
      focus: () => fileInputRef.current?.focus(),
      click: () => fileInputRef.current?.click(),
    }));

    const getImageUrl = (path: string | null | undefined): string | null => {
      if (!path) return null;
      if (typeof path === "string" && (path.startsWith("http://") || path.startsWith("https://"))) {
        return path;
      }
      if (typeof path === "string" && path.startsWith("/")) {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        return `${apiBase}${path}`;
      }
      return path || null;
    };

    useEffect(() => {
      if (value instanceof File) {
        const blobUrl = URL.createObjectURL(value);
        setPreviewUrl(blobUrl);
        return () => URL.revokeObjectURL(blobUrl);
      } else if (typeof value === "string" && value) {
        setPreviewUrl(getImageUrl(value));
      } else {
        setPreviewUrl(defaultUrl ? getImageUrl(defaultUrl) : null);
      }
    }, [value, defaultUrl]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        onError?.(new Error("Chỉ chấp nhận file ảnh"));
        return;
      }

      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
        onError?.(new Error(`File vượt quá kích thước tối đa ${maxSizeMB}MB`));
        return;
      }

      setSelectedFile(file);
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);

      if (autoUpload) {
        try {
          const response = await uploadFile(file, {
            maxSize,
            allowedTypes: ["image/*"],
          });
          const urlToEmit = response.url || response.path;
          if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
          }
          setPreviewUrl(getImageUrl(urlToEmit || ""));
          onChange?.(urlToEmit || "");
          onUploaded?.(response);
        } catch (err) {
          onError?.(err as Error);
        }
      } else {
        onChange?.(file);
      }

      e.target.value = "";
    };

    const handleRemove = () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setSelectedFile(null);
      onChange?.(null);
      onRemove?.();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleImageError = () => {
      setPreviewUrl(null);
    };

    return (
      <div className="image-uploader">
        {previewUrl ? (
          <div className="mb-3 relative inline-block group">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <Image
                src={previewUrl}
                alt="preview"
                fill
                className="object-cover rounded-xl border-2 border-dashed border-blue-200 p-1 bg-white shadow-sm transition-transform group-hover:scale-[1.02]"
                unoptimized
                onError={handleImageError}
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              title="Xóa ảnh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group"
          >
            <svg className="w-8 h-8 mb-1 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-[10px] font-medium group-hover:text-blue-600 transition-colors">Tải ảnh lên</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          name={name}
          onChange={handleFileChange}
          accept="image/*"
          disabled={uploading}
          className="hidden"
        />

        {uploading && (
          <div className="mt-2 w-full max-w-[128px]">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1 text-center font-medium">Đang tải... {progress}%</p>
          </div>
        )}

        {uploadError && (
          <p className="text-[10px] text-red-500 mt-1.5 font-medium flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {uploadError}
          </p>
        )}
      </div>
    );
  }
);

ImageUploader.displayName = "ImageUploader";

export default ImageUploader;



