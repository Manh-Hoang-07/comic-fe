/**
 * Image optimization utilities
 */

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fit?: string;
}

interface Breakpoints {
  [key: string]: string;
}

// Lazy loading observer
let imageObserver: IntersectionObserver | null = null;

// Initialize intersection observer for lazy loading
const initImageObserver = (): IntersectionObserver => {
  if (imageObserver) return imageObserver;

  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || "";
          img.classList.remove("lazy");
          imageObserver?.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.01,
    }
  );

  return imageObserver;
};

// Lazy load image
export const lazyLoadImage = (imgElement: HTMLImageElement): void => {
  if (typeof window === "undefined") return;
  const observer = initImageObserver();
  observer.observe(imgElement);
};

// Generate responsive image srcset
export const generateSrcSet = (
  imageUrl: string,
  sizes: number[] = [320, 640, 960, 1280]
): string => {
  if (!imageUrl) return "";

  return sizes.map((size) => `${imageUrl}?w=${size} ${size}w`).join(", ");
};

// Generate responsive image sizes attribute
export const generateSizes = (
  breakpoints: Breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  }
): string => {
  return (
    Object.entries(breakpoints)
      .map(([breakpoint, width]) => `(min-width: ${width}) ${width}`)
      .join(", ") + ", 100vw"
  );
};

// Optimize image URL with parameters
export const optimizeImageUrl = (
  url: string,
  options: ImageOptimizationOptions = {}
): string => {
  if (!url) return "";

  const {
    width,
    height,
    quality = 80,
    format = "webp",
    fit = "cover",
  } = options;

  const params = new URLSearchParams();

  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());
  if (quality) params.append("q", quality.toString());
  if (format) params.append("f", format);
  if (fit) params.append("fit", fit);

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${params.toString()}`;
};

// Generate placeholder for image
export const generatePlaceholder = (
  width: number,
  height: number,
  text: string = ""
): string => {
  if (typeof window === "undefined" || typeof document === "undefined")
    return "";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  canvas.width = width;
  canvas.height = height;

  // Background
  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(0, 0, width, height);

  // Text
  if (text) {
    ctx.fillStyle = "#9ca3af";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
  }

  return canvas.toDataURL();
};



