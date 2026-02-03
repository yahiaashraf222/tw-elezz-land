import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { CartController, resolveProductId } from "../../controllers/cart-controller.js";
import { sanitizeImageUrl } from "../../utils/sanitize.js";

/**
 * Salla Twilight sticky add-to-cart bar: product image, title, price, buy now button.
 * Uses salla.cart.addItem(); product_id from config or product page context.
 * Shown fixed at bottom; theme can control visibility via class or scroll.
 */
export default class StickyAtcBar extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  @property({ type: Boolean, reflect: true })
  hidden = false;

  private cart = new CartController(this);

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
      direction: rtl;
    }
    .sticky-atc-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      padding: 10px 15px;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
    .sticky-atc-bar.hidden {
      transform: translateY(100%);
    }
    .sticky-atc-info {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }
    .sticky-atc-info img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }
    .sticky-atc-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .sticky-atc-title {
      font-size: 12px;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }
    .sticky-atc-price {
      font-size: 14px;
      font-weight: 900;
      color: var(--color-primary, #004d73);
    }
    .sticky-atc-btn {
      background: var(--color-primary, #004d73);
      color: var(--color-primary-reverse, #fff);
      border: none;
      padding: 12px 25px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.3s;
      flex-shrink: 0;
    }
    .sticky-atc-btn:hover {
      filter: brightness(0.95);
    }
    .sticky-atc-btn.loading {
      opacity: 0.7;
      pointer-events: none;
    }
    @media (min-width: 768px) {
      .sticky-atc-bar {
        padding: 12px 30px;
      }
      .sticky-atc-title {
        max-width: 200px;
        font-size: 14px;
      }
      .sticky-atc-btn {
        padding: 12px 40px;
        font-size: 16px;
      }
    }
  `;

  willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("config")) {
      this.cart.productId = resolveProductId(this.config?.product_id as string | number | undefined);
    }
  }

  private async handleBuyNow(): Promise<void> {
    await this.cart.addToCart();
  }

  render() {
    const title = String(this.config?.title ?? "المنتج");
    const price = String(this.config?.price ?? "199 ر.س");
    const imageUrl = sanitizeImageUrl(this.config?.image_url ?? "");
    const buttonText = String(this.config?.button_text ?? "اشتري الآن");

    return html`
      <div class="sticky-atc-bar ${this.hidden ? "hidden" : ""}">
        <div class="sticky-atc-info">
          ${imageUrl ? html`<img src="${imageUrl}" alt="${title}" loading="lazy" decoding="async" />` : ""}
          <div class="sticky-atc-details">
            <span class="sticky-atc-title">${title}</span>
            <span class="sticky-atc-price">${price}</span>
          </div>
        </div>
        <button
          type="button"
          class="sticky-atc-btn ${this.cart.loading ? "loading" : ""}"
          @click=${this.handleBuyNow}
          ?disabled=${this.cart.loading}
        >
          ${this.cart.loading ? this.cart.addButtonText : buttonText}
        </button>
      </div>
    `;
  }
}
