import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Build URL with query parameters
 * @param {string} url - Base URL or endpoint.
 * @param {Record<string, string | number>} query - Query parameters as key-value pairs.
 * @returns {string} - Full URL with query parameters appended.
 */
const buildUrlWithQuery = (url: string, query: Record<string, string | number>): string => {
  if (!query || Object.keys(query).length === 0) return url;
  const queryString = new URLSearchParams(query as Record<string, string>).toString();
  return `${url}?${queryString}`;
};

/**
 * Generic GET request
 * @param {string} endpoint - API endpoint.
 * @param {Record<string, string | number>} query - Query parameters.
 * @param {Record<string, string | number>} params - Path parameters (if needed).
 * @param {string | null} token - Optional Authorization token.
 * @returns {Promise<AxiosResponse | string>} - Axios response or error message.
 */
const getRequest = async (
  endpoint: string,
  query: Record<string, string | number> = {},
  params: Record<string, string | number> = {},
  token: string | null = null
): Promise<AxiosResponse | string> => {
  try {
    const url = buildUrlWithQuery(endpoint, query);
    const headers: Record<string, string|boolean> = token ? { Authorization: `Bearer ${token}` } : {};
    const config: AxiosRequestConfig = { headers, params,withCredentials:true};
    const response = await axios.get(url, config);
    return response;
  } catch (error: any) {
    // console.error("Error in GET request:", error.response || error.message || error);
    throw error
  }
};

/**
 * Generic POST request
 * @param {string} endpoint - API endpoint.
 * @param {Record<string, string | number>} query - Query parameters.
 * @param {Record<string, string | number>} params - Path parameters (if needed).
 * @param {Record<string, any>} body - Request body.
 * @param {string | null} token - Optional Authorization token.
 * @returns {Promise<AxiosResponse | string>} - Axios response or error message.
 */
const postRequest = async (
  endpoint: string,
  query: Record<string, string | number> = {},
  params: Record<string, string | number> = {},
  body: Record<string, any> = {},
  token: string | null = null
) => {
  try {
    const url = buildUrlWithQuery(endpoint, query);
    console.log("Request URL:", url);
    const headers: Record<string, string|boolean> = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    const config: AxiosRequestConfig = { headers, params,withCredentials:true };
    const response = await axios.post(url, body, config);
    console.log(response)
    return response;
  } catch (error: any) {
    // console.error("Error in POST request:", error.response || error.message || error);
    throw error;
  }
};

export { getRequest, postRequest };
