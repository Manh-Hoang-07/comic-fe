"use client";

import { useState } from "react";
import api from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";

export interface UploadResponse {
  url?: string;
  path?: string;
  filename?: string;
  size?: number;
  mimetype?: string;
}

export interface UploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: Error) => void;
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File, options?: UploadOptions): void => {
    const maxSize = options?.maxSize ?? 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
      throw new Error(`File ${file.name} vượt quá kích thước tối đa ${maxSizeMB}MB`);
    }

    if (options?.allowedTypes && options.allowedTypes.length > 0) {
      const isValidType = options.allowedTypes.some((allowedType) => {
        if (allowedType.endsWith("/*")) {
          const baseType = allowedType.slice(0, -2);
          return file.type.startsWith(baseType + "/");
        }
        return file.type === allowedType;
      });

      if (!isValidType) {
        throw new Error(
          `Loại file ${file.type} không được hỗ trợ. Chỉ chấp nhận: ${options.allowedTypes.join(", ")}`
        );
      }
    }
  };

  const uploadFile = async (
    file: File,
    options?: UploadOptions
  ): Promise<UploadResponse> => {
    validateFile(file, options);

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<{ success?: boolean; data?: UploadResponse; url?: string; path?: string }>(
        userEndpoints.uploads.file,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
              options?.onProgress?.(percentCompleted);
            }
          },
        }
      );

      let responseData: UploadResponse;
      if (response.data?.data) {
        responseData = response.data.data;
      } else if (response.data?.url || response.data?.path) {
        responseData = response.data as UploadResponse;
      } else {
        responseData = response.data as UploadResponse;
      }

      if (!responseData || (!responseData.url && !responseData.path)) {
        throw new Error("Invalid response from server");
      }

      options?.onSuccess?.(responseData);
      setProgress(100);

      setTimeout(() => {
        setProgress(0);
      }, 500);

      return responseData;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Upload thất bại";
      setError(errorMessage);
      options?.onError?.(new Error(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const uploadFiles = async (
    files: File[],
    options?: UploadOptions
  ): Promise<UploadResponse[]> => {
    if (files.length === 0) {
      throw new Error("Không có file nào để upload");
    }

    if (files.length > 10) {
      throw new Error("Chỉ có thể upload tối đa 10 files một lúc");
    }

    files.forEach((file) => {
      validateFile(file, options);
    });

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.post<any>(
        userEndpoints.uploads.files,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
              options?.onProgress?.(percentCompleted);
            }
          },
        }
      );

      // Handle different response structures
      // Case 1: { success: true, data: [...] }
      // Case 2: [...] (direct array)
      let responseData: UploadResponse[] = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        responseData = response.data.data;
      } else if (Array.isArray(response.data)) {
        responseData = response.data;
      }

      responseData.forEach((result) => {
        options?.onSuccess?.(result);
      });

      setProgress(100);
      setTimeout(() => {
        setProgress(0);
      }, 500);

      return responseData;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Upload thất bại";
      setError(errorMessage);
      options?.onError?.(new Error(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploadFiles,
    uploading,
    error,
    progress,
  };
}



