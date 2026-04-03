"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  lazy?: boolean;
  placeholder?: boolean;
  placeholderText?: string;
  className?: string;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

export default function OptimizedImage({
  src,
  alt = "",
  width,
  height,
  lazy = true,
  placeholder = true,
  placeholderText,
  className = "",
  fill,
  onLoad,
  onError,
  onClick,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (src) {
      // If src is a full URL, use it directly
      if (src.startsWith("http://") || src.startsWith("https://")) {
        setImageSrc(src);
      } else if (src.startsWith("/")) {
        // If it's a path, prepend API base URL
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        setImageSrc(`${apiBase}${src}`);
      } else {
        setImageSrc(src);
      }
    }
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setImageSrc("/default.svg");
    onError?.();
  };

  if (!imageSrc || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
        }}
      >
        {placeholderText && (
          <span className="text-gray-400 text-sm">{placeholderText}</span>
        )}
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {placeholder && !loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={`object-cover ${loaded ? "opacity-100" : "opacity-0"} transition-opacity`}
          loading={lazy ? "lazy" : "eager"}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {placeholder && !loaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        className={`${loaded ? "opacity-100" : "opacity-0"} transition-opacity`}
        loading={lazy ? "lazy" : "eager"}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        unoptimized
      />
    </div>
  );
}



