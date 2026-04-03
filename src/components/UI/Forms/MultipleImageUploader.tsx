"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUpload, UploadResponse } from "@/hooks/useUpload";

interface MultipleImageUploaderProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxSize?: number; // bytes, default 10MB
  maxFiles?: number; // default 10
  disabled?: boolean;
  label?: string;
  helpText?: string;
  error?: string;
}

export default function MultipleImageUploader({
  value = [],
  onChange,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 10,
  disabled = false,
  label,
  helpText,
  error,
}: MultipleImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles, uploading, error: uploadError } = useUpload();

  // Sync với value từ bên ngoài
  useEffect(() => {
    setImageUrls(value || []);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Kiểm tra số lượng file
    if (imageUrls.length + files.length > maxFiles) {
      alert(`Chỉ có thể upload tối đa ${maxFiles} ảnh. Hiện tại đã có ${imageUrls.length} ảnh.`);
      e.target.value = "";
      return;
    }

    try {
      // Upload files
      const responses = await uploadFiles(files, {
        maxSize,
        allowedTypes: ["image/*"],
      });

      // Parse response - responses đã được useUpload xử lý và trả về array UploadResponse[]
      const uploadedUrls = responses.map((res) => res.url || res.path || "").filter(Boolean);

      // Thêm vào danh sách
      const newUrls = [...imageUrls, ...uploadedUrls];
      setImageUrls(newUrls);
      onChange?.(newUrls);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error?.message || "Có lỗi xảy ra khi upload ảnh");
    }

    // Reset input
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    onChange?.(newUrls);
  };

  const getImageUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      return `${apiBase}${url}`;
    }
    return url;
  };

  return (
    <div className="multiple-image-uploader">
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <div className="mb-4">
        <label
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${disabled || uploading
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400"
            }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
            {uploading ? (
              <>
                <svg
                  className="animate-spin h-8 w-8 mb-2 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-sm font-medium">Đang tải lên...</p>
              </>
            ) : (
              <>
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-sm font-medium">Click để chọn nhiều ảnh</p>
                <p className="text-xs text-gray-400 mt-1">
                  Hoặc kéo thả ảnh vào đây
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled || uploading}
          />
        </label>
      </div>

      {helpText && (
        <p className="text-xs text-gray-500 mb-4">{helpText}</p>
      )}

      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={getImageUrl(url)}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 200px"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Xóa ảnh"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          Chưa có hình ảnh nào. Click vào khung trên để upload ảnh.
        </p>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      {uploadError && (
        <p className="mt-2 text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}



