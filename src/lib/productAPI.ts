import { apiCall } from './apiCaller';
import { Product, ProductsResponse } from '@/types/products';

/**
 * Fetch products with optional query parameters
 * @param options - Query options for products
 * @returns Promise with ProductsResponse data
 */
export async function getProducts(options: {
  limit?: number;
  skip?: number;
  category?: string;
  search?: string;
} = {}): Promise<ProductsResponse> {
  const { limit, skip, category, search } = options;
  let endpoint: string;
  const params = new URLSearchParams();

  // Add pagination parameters if provided
  if (limit) params.set('limit', limit.toString());
  if (skip) params.set('skip', skip.toString());

  // Build the appropriate endpoint based on filters
  if (search) {
    // Search endpoint
    params.set('q', search);
    endpoint = `products/search`;
  } else if (category) {
    // Category filtering
    endpoint = `products/category/${encodeURIComponent(category)}`;
  } else {
    // Regular product listing
    endpoint = 'products';
  }

  // Append query string if we have parameters
  const queryString = params.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }
  
  return apiCall<ProductsResponse>(endpoint);
}

/**
 * Fetch a single product by ID
 * @param id - Product ID
 * @returns Promise with Product data
 */
export async function getProductById(id: number | string): Promise<Product> {
  return apiCall<Product>(`products/${id}`);
}

/**
 * Fetch products by category
 * @param category - Category name
 * @param options - Pagination options
 * @returns Promise with ProductsResponse data
 */
export async function getProductsByCategory(
  category: string,
  options: { limit?: number; skip?: number } = {}
): Promise<ProductsResponse> {
  return getProducts({ ...options, category });
}

/**
 * Search products by query
 * @param query - Search query string
 * @param options - Pagination options
 * @returns Promise with ProductsResponse data
 */
export async function searchProducts(
  query: string,
  options: { limit?: number; skip?: number } = {}
): Promise<ProductsResponse> {
  return getProducts({ ...options, search: query });
}