"use client";

import { Product, ProductsResponse } from "@/types/products";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@heroui/react";
import { Category } from "@/types/categories";
import { getProducts } from "@/lib/productAPI";
import { getCategories } from "@/lib/categoriesAPI";
import ItemCard from "@/components/features/Items/ItemCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type Params = {
  category: string;
  search: string;
};

export default function AllPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useParams<Params>();

  // Get search params
  const currentCategory = searchParams.category
  const currentSearch = searchParams.search

  // Local state for user inputs
  const [searchInput, setSearchInput] = useState<string>(currentSearch);
  const [debouncedSearch] = useDebounce<string>(searchInput, 500);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Set<string>>(
    new Set([])
  );

  // Fetch products with SWR using our API functions
  const { data, error, isLoading } = useSWR<ProductsResponse>(
    ["products", currentCategory, debouncedSearch],
    () => {
      if (debouncedSearch) {
        return getProducts({ search: debouncedSearch });
      } else if (currentCategory) {
        return getProducts({ category: currentCategory });
      } else {
        return getProducts();
      }
    }
  );

  // Fetch categories
  const { data: categoriesData } = useSWR<Category[]>(
    ["categories"],
    getCategories
  );

  // Update categories state when data is fetched
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  // Update URL when search or category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    // Reset search when changing category
    if (searchInput) {
      setSearchInput("");
      params.delete("search");
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">All Products</h2>

      {/* Filters section */}
      <div className="mb-8 flex items-center gap-4">
        <Input
          placeholder="Search products..."
          className="w-60 p-2 rounded-lg"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="capitalize" color="primary">
              {selectedCategory.size > 0
                ? `${Array.from(selectedCategory).join(", ")}`
                : "Select Category"}
              <FontAwesomeIcon icon={faChevronDown} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            selectedKeys={selectedCategory}
            onSelectionChange={(keys) =>
              setSelectedCategory(keys as Set<string>)
            }
            selectionMode="single"
          >
            {categories?.map((category) => (
              <DropdownItem
                key={category.slug}
                onClick={() => handleCategoryChange(category.slug)}
              >
                {category.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500">
            Failed to load products. Please try again.
          </p>
        </div>
      )}

      {/* Empty state */}
      {data?.products?.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <p className="text-xl">
            No products found. Try adjusting your filters.
          </p>
        </div>
      )}

      {/* Products grid using ItemCard component */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.products?.map((product: Product) => (
          <div key={product.id}>
            <ItemCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination info */}
      {data && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {data.products.length} of {data.total} products
        </div>
      )}
    </div>
  );
}
