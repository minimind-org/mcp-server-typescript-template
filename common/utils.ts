import axios from "axios";
import { createError } from "./errors";
import { USER_AGENT } from "./constant";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export function buildUrl(baseUrl: string, params: Record<string, string | number | undefined>): string {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  return url.toString();
}

export async function sendRequest(
  url: string,
  options: RequestOptions = {}
): Promise<unknown> {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT,
    ...options.headers,
  };

  try {
    const response = await axios({
      method: options.method || "GET",
      url,
      headers,
      data: options.body,
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw createError(error.response.status, error.response.data);
    }
    throw error;
  }
}