"use client";

import { Product, ProductsResponse } from "@/types/products";
import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
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

export default function AllPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get search params from URL
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";

  // Local state for user inputs
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [debouncedSearch] = useDebounce(searchInput, 500);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Set<string>>(
    currentCategory ? new Set([currentCategory]) : new Set([])
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

  // Create a memoized function to update URL
  const updateUrl = useCallback(
    (search: string, category: string) => {
      const params = new URLSearchParams();

      if (search) {
        params.set("search", search);
      }

      if (category) {
        params.set("category", category);
      }

      const newUrl = `${pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      router.push(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  // Effect for handling search param changes
  useEffect(() => {
    // Only update URL when debounced search changes and it's different from current URL
    if (debouncedSearch !== currentSearch) {
      updateUrl(debouncedSearch, currentCategory);
    }
  }, [debouncedSearch, currentSearch, currentCategory, updateUrl]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(new Set([category]));
    updateUrl(searchInput, category);
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
              {selectedCategory.size > 0 &&
              Array.from(selectedCategory)[0] !== ""
                ? `${Array.from(selectedCategory).join(", ")}`
                : "Select Category"}
              <FontAwesomeIcon icon={faChevronDown} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            selectedKeys={selectedCategory ? selectedCategory : new Set([])}
            onSelectionChange={(keys) => {
              if (Array.from(keys)[0]) {
                handleCategoryChange(Array.from(keys)[0].toString());
              } else {
                handleCategoryChange("");
              }
            }}
            selectionMode="single"
          >
            {categories?.map((category) => (
              <DropdownItem key={category.slug}>{category.name}</DropdownItem>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
