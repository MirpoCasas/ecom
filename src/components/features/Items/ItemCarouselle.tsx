'use client'

import { useRef } from "react";
import useSWR from "swr";
import ItemCard from "./ItemCard";
import { ProductsResponse } from "@/types/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getProducts } from "@/lib/productAPI";

// SWR fetcher that uses our API functions
const productsFetcher = () => getProducts({ limit: 20 });

export default function ItemCarouselle() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data } = useSWR<ProductsResponse>(["products"], productsFetcher);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 300; // Approximate width of a card + margin
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 300; // Approximate width of a card + margin
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mx-3 px-10">
      <button
        onClick={scrollLeft}
        className="absolute cursor-pointer w-10 h-10 left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full shadow-md"
        aria-label="Scroll left"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div className="overflow-hidden w-full">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide pb-4"
        >
          {data?.products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64">
              <ItemCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollRight}
        className="absolute cursor-pointer w-10 h-10 right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full shadow-md"
        aria-label="Scroll right"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
