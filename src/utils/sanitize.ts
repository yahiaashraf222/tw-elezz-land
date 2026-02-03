/**
 * Sanitization utilities for security: product IDs, image URLs, and HTML for custom content.
 */

/** Allowed URL protocols for images and links. */
const ALLOWED_PROTOCOLS = ["https:", "http:", "data:"];

/**
 * Returns a safe product ID: digits only, max 20 chars. Empty string if invalid.
 */
export function sanitizeProductId(value: string | number | null | undefined): string {
  if (value == null) return "";
  const s = String(value).trim();
  if (!s) return "";
  const digits = s.replace(/\D/g, "");
  return digits.length > 0 && digits.length <= 20 ? digits : "";
}

/**
 * Returns a safe image URL: only http(s) or data. Empty string if invalid or dangerous.
 */
export function sanitizeImageUrl(url: string | null | undefined): string {
  if (url == null || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed, "https://example.com");
    const protocol = parsed.protocol?.toLowerCase();
    if (!ALLOWED_PROTOCOLS.includes(protocol)) return "";
    if (protocol === "data:") {
      const m = trimmed.match(/^data:([^;,]+);/i);
      const type = m?.[1]?.toLowerCase() ?? "";
      if (!type.startsWith("image/")) return "";
    }
    return parsed.href;
  } catch {
    return "";
  }
}

/**
 * Strips script tags and event-handler-like attributes from HTML for safer display.
 * Use for customhtml when you want to reduce XSS; does not allow full arbitrary HTML.
 */
export function sanitizeHtmlForDisplay(htmlContent: string): string {
  if (typeof htmlContent !== "string") return "";
  return htmlContent
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, " ")
    .replace(/\s+on\w+\s*=\s*[^\s>]+/gi, " ");
}
