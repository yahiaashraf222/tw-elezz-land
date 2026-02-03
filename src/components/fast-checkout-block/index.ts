import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { CartController, resolveProductId } from "../../controllers/cart-controller.js";

/**
 * Salla Twilight fast checkout block: quantity + buy now button.
 * Uses salla.cart.addItem(); product_id from config or product page context.
 * Compatible with Salla landing page and mini-checkout; theme can add salla-mini-checkout-widget in slot.
 */
export default class FastCheckoutBlock extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  private cart = new CartController(this);

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
      direction: rtl;
    }
    .fast-checkout-block {
      padding: 1rem 0;
    }
    .fast-checkout-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .fast-checkout-label {
      font-weight: bold;
      color: #374151;
      font-size: 0.875rem;
    }
    .qty-controls {
      display: flex;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      overflow: hidden;
      height: 2.5rem;
    }
    .qty-btn {
      width: 2.5rem;
      background: #fff;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .qty-btn:hover {
      background: #f3f4f6;
    }
    .qty-input {
      width: 3rem;
      text-align: center;
      border: none;
      border-left: 1px solid #e5e7eb;
      border-right: 1px solid #e5e7eb;
      font-weight: 600;
      font-size: 1rem;
      -moz-appearance: textfield;
    }
    .qty-input::-webkit-outer-spin-button,
    .qty-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .buy-now-btn {
      width: 100%;
      background: var(--color-primary, #004d73);
      color: var(--color-primary-reverse, #fff);
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: bold;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .buy-now-btn:hover {
      opacity: 0.9;
    }
    .buy-now-btn.loading {
      opacity: 0.7;
      pointer-events: none;
    }
    .widget-slot {
      margin-top: 1rem;
    }
  `;

  willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("config")) {
      this.cart.productId = resolveProductId(this.config?.product_id as string | number | undefined);
    }
  }

  private handlePlus(): void {
    this.cart.increment();
  }

  private handleMinus(): void {
    this.cart.decrement();
  }

  private async handleBuyNow(): Promise<void> {
    await this.cart.addToCart();
  }

  render() {
    const buttonText = String(this.config?.button_text ?? "اشتري الآن");
    const quantityLabel = String(this.config?.quantity_label ?? "الكمية");
    const maxQty = Math.min(100, Math.max(1, Number(this.config?.max_quantity ?? 10)));

    return html`
      <div class="fast-checkout-block">
        <div class="fast-checkout-row">
          <label class="fast-checkout-label" for="qty">${quantityLabel}</label>
          <div class="qty-controls">
            <button type="button" class="qty-btn" @click=${this.handlePlus} aria-label="زيادة الكمية">+</button>
            <input
              id="qty"
              class="qty-input"
              type="number"
              .value=${String(this.cart.quantity)}
              readonly
              min="1"
              max="${maxQty}"
              aria-label="الكمية"
            />
            <button type="button" class="qty-btn" @click=${this.handleMinus} aria-label="تقليل الكمية">−</button>
          </div>
        </div>
        <button
          type="button"
          class="buy-now-btn ${this.cart.loading ? "loading" : ""}"
          @click=${this.handleBuyNow}
          ?disabled=${this.cart.loading}
        >
          ${this.cart.loading ? this.cart.addButtonText : buttonText}
        </button>
        <div class="widget-slot">
          <slot name="widget"></slot>
        </div>
      </div>
    `;
  }
}
