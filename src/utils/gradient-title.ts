/**
 * Gradient title helper for Salla Twilight components.
 * Use config prefix e.g. "title_" to read: title_gradient_enabled, title_gradient_from_color, etc.
 */
export interface GradientTitleConfig {
  gradient_enabled?: boolean;
  gradient_from_color?: string;
  gradient_to_color?: string;
  gradient_direction?: string;
  gradient_style?: "linear" | "radial";
}

const DEFAULT_FROM = "#8b6914";
const DEFAULT_TO = "#c9a227";
const DEFAULT_DIRECTION = "90deg";

function getConfigWithPrefix(
  config: Record<string, unknown> | undefined,
  prefix: string
): GradientTitleConfig {
  if (!config) return {};
  return {
    gradient_enabled: config[`${prefix}gradient_enabled`] as boolean | undefined,
    gradient_from_color: config[`${prefix}gradient_from_color`] as string | undefined,
    gradient_to_color: config[`${prefix}gradient_to_color`] as string | undefined,
    gradient_direction: config[`${prefix}gradient_direction`] as string | undefined,
    gradient_style: config[`${prefix}gradient_style`] as "linear" | "radial" | undefined,
  };
}

/**
 * Returns inline style string for a title element to show gradient text.
 * When disabled or missing, returns empty string.
 */
export function getTitleGradientStyle(
  config: Record<string, unknown> | undefined,
  prefix: string
): string {
  const g = getConfigWithPrefix(config, prefix);
  if (!g.gradient_enabled) return "";
  const from = (g.gradient_from_color ?? DEFAULT_FROM).trim() || DEFAULT_FROM;
  const to = (g.gradient_to_color ?? DEFAULT_TO).trim() || DEFAULT_TO;
  const dir = (g.gradient_direction ?? DEFAULT_DIRECTION).trim() || DEFAULT_DIRECTION;
  const style = g.gradient_style === "radial" ? "radial-gradient" : "linear-gradient";
  const value =
    style === "radial-gradient"
      ? `radial-gradient(circle, ${from}, ${to})`
      : `linear-gradient(${dir}, ${from}, ${to})`;
  return [
    `background: ${value}`,
    "-webkit-background-clip: text",
    "background-clip: text",
    "color: transparent",
  ].join("; ");
}

/**
 * Returns CSS class name when gradient is enabled (for scoped styles).
 * Use with static styles that define .title-gradient { ... }
 */
export function getTitleGradientClass(
  config: Record<string, unknown> | undefined,
  prefix: string
): string {
  const g = getConfigWithPrefix(config, prefix);
  return g.gradient_enabled ? "title-gradient" : "";
}

/**
 * Prefixes for use in config: "desc_title_", "expert_title_", etc.
 * Full keys: desc_title_gradient_enabled, desc_title_gradient_from_color, ...
 */
export const GRADIENT_PREFIX = {
  descTitle: "desc_title_",
  priceLabel: "price_label_",
  ingredientsTitle: "ingredients_title_",
  expertTitle: "expert_title_",
  sectionTitle: "section_title_",
} as const;
