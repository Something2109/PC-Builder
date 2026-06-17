import { RequestObject } from "../types/interface";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * A default stealth fetch function.
 * Automatically injects randomized User-Agents and typical desktop browser
 * request headers to mimic legitimate user requests and bypass simple bot-detection filters.
 */
export async function defaultStealthFetch(req: RequestObject): Promise<Response> {
  const url = new URL(req.url.toString());
  const host = url.hostname;

  const stealthHeaders: Record<string, string> = {
    "User-Agent": getRandomUserAgent(),
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: `https://${host}/`,
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
  };

  // Merge headers from the original request
  const mergedHeaders = {
    ...stealthHeaders,
    ...(req.headers || {}),
  };

  const fetchOptions: RequestInit = {
    ...req,
    headers: mergedHeaders,
  };

  const res = await fetch(req.url, fetchOptions);
  if (!res.ok) {
    throw new Error(`Fetch failed for URL: ${req.url} - Status: ${res.status} ${res.statusText}`);
  }
  return res;
}
