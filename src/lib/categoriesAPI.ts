import { Category } from "@/types/categories";
import { apiCall } from "./apiCaller";

/**
 * Fetch all available product categories
 * @returns Promise with array of category strings
 */
export async function getCategories(): Promise<Category[]> {
  return apiCall<Category[]>("products/categories");
}
