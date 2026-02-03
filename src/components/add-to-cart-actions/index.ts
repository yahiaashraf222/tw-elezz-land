import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { CartController, resolveProductId } from "../../controllers/cart-controller.js";

/**
 * Salla Twilight component: quantity controls + add to cart button.
 * Uses CartController for state and salla.cart.addItem().
 * Config: product_id, button_text.
 */
export default class AddToCartActions extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  private cart = new CartController(this);

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
    }
    .custom-actions-box {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #eaeaea;
      margin: 15px 0 20px;
      direction: rtl;
    }
    .custom-qty-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .custom-qty-label {
      font-weight: bold;
      color: #000;
      font-size: 16px;
    }
    .qty-controls {
      display: flex;
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
      height: 45px;
    }
    .qty-btn {
      width: 45px;
      background: #fff;
      border: none;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
    }
    .qty-btn:hover {
      background: #f5f5f5;
    }
    .qty-input {
      width: 60px;
      text-align: center;
      border: none;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      font-weight: bold;
      font-size: 18px;
      -moz-appearance: textfield;
    }
    .qty-input::-webkit-outer-spin-button,
    .qty-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .custom-add-btn {
      width: 100%;
      background: #000;
      color: #fff;
      padding: 15px;
      border-radius: 8px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      font-size: 18px;
      transition: opacity 0.2s;
    }
    .custom-add-btn:hover {
      opacity: 0.9;
    }
    .custom-add-btn.loading {
      opacity: 0.7;
      pointer-events: none;
    }
  `;

  willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("config")) {
      const id = resolveProductId(this.config?.product_id as string | number | undefined) || "1593492853";
      this.cart.productId = id;
    }
  }

  private handlePlus(): void {
    this.cart.increment();
  }

  private handleMinus(): void {
    this.cart.decrement();
  }

  private async handleAdd(): Promise<void> {
    await this.cart.addToCart();
  }

  render() {
    const buttonText = String(this.config?.button_text ?? "إضافة للسلة");
    return html`
      <div class="custom-actions-box">
        <div class="custom-qty-row">
          <div class="qty-controls">
            <button type="button" class="qty-btn plus" @click=${this.handlePlus} aria-label="زيادة الكمية">+</button>
            <input
              class="qty-input"
              type="number"
              .value=${String(this.cart.quantity)}
              readonly
              aria-label="الكمية"
            />
            <button type="button" class="qty-btn minus" @click=${this.handleMinus} aria-label="تقليل الكمية">-</button>
          </div>
          <div class="custom-qty-label">الكمية</div>
        </div>
        <button
          type="button"
          class="custom-add-btn ${this.cart.loading ? "loading" : ""}"
          @click=${this.handleAdd}
          ?disabled=${this.cart.loading}
        >
          ${this.cart.loading ? this.cart.addButtonText : buttonText}
        </button>
      </div>
    `;
  }
}
