"use client";

import { useState, useRef, useEffect, ReactNode, useCallback } from "react";

interface BaseSliderProps {
  title?: string;
  subtitle?: string;
  icon?: "category" | "product" | "default";
  showViewAll?: boolean;
  showNavigation?: boolean;
  showProgress?: boolean;
  onViewAll?: () => void;
  children: ReactNode;
  containerClass?: string;
  navigationButtonClass?: string;
}

export default function BaseSlider({
  title,
  subtitle,
  icon = "default",
  showViewAll = false,
  showNavigation = true,
  showProgress = false,
  onViewAll,
  children,
  containerClass = "",
  navigationButtonClass = "",
}: BaseSliderProps) {
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const checkScrollability = useCallback(() => {
    if (sliderContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scrollLeft = useCallback(() => {
    if (sliderContainerRef.current) {
      sliderContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (sliderContainerRef.current) {
      sliderContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, []);

  const handleScroll = useCallback(() => {
    checkScrollability();
  }, [checkScrollability]);

  useEffect(() => {
    checkScrollability();
    const container = sliderContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [children, checkScrollability, handleScroll]);

  const progressDots = Array.from({ length: Math.max(totalSlides, 5) });

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {(title || subtitle || showViewAll || showNavigation) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {icon && (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  {icon === "category" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  )}
                  {icon === "product" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  )}
                  {icon === "default" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </div>
              )}
              {(title || subtitle) && (
                <div>
                  {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
                  {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {showViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-200 group px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span>Xem tất cả</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {showNavigation && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={`w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group ${navigationButtonClass}`}
                  aria-label="Cuộn sang trái"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 group-hover:text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className={`w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group ${navigationButtonClass}`}
                  aria-label="Cuộn sang phải"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 group-hover:text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full">
        <div
          ref={sliderContainerRef}
          className={`relative overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth ${containerClass}`}
          onScroll={handleScroll}
        >
          <div className="flex gap-4 py-2" style={{ width: "max-content" }}>
            {children}
          </div>
        </div>

        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        )}
      </div>

      {showProgress && progressDots.length > 0 && (
        <div className="flex justify-center mt-6 space-x-2">
          {progressDots.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}



