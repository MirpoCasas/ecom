"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface ImageCarouselProps {
  images?: string[];
  alt?: string;
}

export function ImageCarousel({
  images,
  alt = "Product image",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const thumbnailWidth = 88; // 80px width + 8px margin (space-x-2)

  // Check if scrolling is needed
  useEffect(() => {
    const checkScrollable = () => {
      if (thumbnailsRef.current) {
        const { scrollWidth, clientWidth } = thumbnailsRef.current;
        const scrollable = scrollWidth > clientWidth;
        setShowScrollButtons(scrollable);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [images]);

  // Loading state when images are undefined
  if (images === undefined) {
    return (
      <div className="space-y-4">
        {/* Main image skeleton */}
        <div className="relative w-full aspect-square bg-gray-200 animate-pulse rounded-lg"></div>

        {/* Thumbnails skeleton */}
        <div className="flex space-x-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="min-w-[80px] h-20 bg-gray-200 animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // If there's only one image, don't show thumbnails
  if (images.length <= 1) {
    return (
      <div className="relative w-full aspect-square">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    );
  }

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailsRef.current) {
      const { current } = thumbnailsRef;

      if (direction === "left") {
        current.scrollBy({ left: -thumbnailWidth, behavior: "smooth" });
      } else {
        current.scrollBy({ left: thumbnailWidth, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative w-full aspect-square">
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Thumbnails row */}
      <div className="relative">
        <div
          className="flex space-x-2 overflow-hidden scroll-smooth"
          ref={thumbnailsRef}
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={
                "relative min-w-[80px] w-[80px] cursor-pointer h-20 border-2 rounded-md overflow-hidden transition-all " +
                (currentIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300")
              }
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Scroll buttons - only shown when needed */}
        {showScrollButtons && (
          <>
            <button
              onClick={() => scrollThumbnails("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white"
              aria-label="Scroll thumbnails left"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollThumbnails("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white"
              aria-label="Scroll thumbnails right"
            >
              <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
