/**
 * Base API caller utility for making fetch requests
 */

// Base API URL
const BASE_URL = 'https://dummyjson.com';

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * Sets up default headers for API requests
 * @param options - API request options
 * @returns HeadersInit object with appropriate headers
 */
export const setDefaultHeaders = (): HeadersInit => {
  const headers = defaultHeaders;
  
  return { ...headers };
};

/**
 * Makes an API call with the given parameters
 * @param endpoint - API endpoint path (without base URL)
 * @param options - Request options like method, headers, body
 * @param requestOptions - Additional API-specific options
 * @returns Promise with the response data
 */
export const apiCall = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const method = options?.method ?? 'GET';
  const cache = options?.cache ?? 'no-cache';
  const requestBody = options?.body ?? undefined;
  const headers = options?.headers ?? setDefaultHeaders();
  
  const log = `[API] [${method.toUpperCase()}] ${url}`;
  // console.debug(log);
  
  try {
    // Convert body to JSON string if needed
    let processedBody = requestBody;
    if (
      requestBody && 
      typeof requestBody === 'object' && 
      !(requestBody instanceof FormData)
    ) {
      processedBody = JSON.stringify(requestBody);
    }
    
    const response: Response = await fetch(url, {
      method,
      headers,
      cache,
      body: processedBody,
    });
    
    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    // Parse response body
    const body = await response.json();
    
    if (!response.ok) {
      const error = new Error(body.message || `API Error: ${response.status}`);
      throw error;
    }
    
    return body as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}