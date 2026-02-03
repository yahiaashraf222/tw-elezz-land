import { ReactiveController, ReactiveControllerHost } from "lit";
import { sanitizeProductId as sanitizeId } from "../utils/sanitize.js";

declare global {
  interface Window {
    salla?: {
      cart?: { addItem: (opts: { id: string; quantity: number }) => Promise<unknown> };
      config?: { get: (key: string) => unknown };
    };
  }
}

/**
 * Resolves and sanitizes product ID for landing page vs product page.
 * Use config product_id when on landing; on product page salla.config.get('product.id') can be used.
 * Returns only digits, max 20 chars; empty if invalid.
 */
export function resolveProductId(configProductId?: string | number | null): string {
  const fromConfig = configProductId != null && String(configProductId).trim() !== "" ? String(configProductId).trim() : "";
  if (fromConfig) return sanitizeId(fromConfig);
  try {
    const fromPage = window.salla?.config?.get?.("product.id");
    if (fromPage != null) return sanitizeId(String(fromPage));
  } catch {
    // ignore
  }
  return "";
}

/**
 * Cart controller for Salla Twilight components.
 * Manages quantity state and add-to-cart via salla.cart.addItem().
 * Compatible with landing page (config product_id) and product page (salla.config.get('product.id')).
 * @see https://lit.dev/docs/composition/controllers/
 */
export class CartController implements ReactiveController {
  host: ReactiveControllerHost;

  private _quantity = 1;
  private _productId = "";
  private _addButtonText = "إضافة للسلة";
  private _loading = false;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    const next = Math.max(1, Math.min(100, value));
    if (next === this._quantity) return;
    this._quantity = next;
    this.host.requestUpdate();
  }

  get productId(): string {
    return this._productId;
  }

  set productId(value: string) {
    this._productId = sanitizeId(value ?? "") ?? "";
  }

  get addButtonText(): string {
    return this._addButtonText;
  }

  get loading(): boolean {
    return this._loading;
  }

  increment(): void {
    this.quantity = this._quantity + 1;
  }

  decrement(): void {
    this.quantity = this._quantity - 1;
  }

  async addToCart(): Promise<boolean> {
    if (this._loading || !this._productId) return false;
    this._loading = true;
    this._addButtonText = "جاري الإضافة...";
    this.host.requestUpdate();

    try {
      const safeId = sanitizeId(this._productId);
      if (window.salla?.cart?.addItem && safeId) {
        await window.salla!.cart!.addItem!({ id: safeId, quantity: this._quantity });
        this._loading = false;
        this._addButtonText = "تمت الإضافة بنجاح ✓";
        this.host.requestUpdate();
        setTimeout(() => {
          this._addButtonText = "إضافة للسلة";
          this.host.requestUpdate();
        }, 2000);
        return true;
      }
      this._addButtonText = "حدث خطأ";
    } catch {
      this._addButtonText = "حدث خطأ";
    }
    this._loading = false;
    this.host.requestUpdate();
    setTimeout(() => {
      this._addButtonText = "إضافة للسلة";
      this.host.requestUpdate();
    }, 2000);
    return false;
  }

  hostUpdate(): void {}

  hostUpdated(): void {}
}
