import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { CartController, resolveProductId } from "../../controllers/cart-controller.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";
import { getImageUrlFromConfig, sanitizeImageUrl } from "../../utils/sanitize.js";

/**
 * Salla Twilight landing hero: image, title, subtitle, description, CTA (buy now).
 * Uses salla.cart.addItem(); product_id from config or product page context.
 */
export default class LandingHero extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  set state(value: Record<string, unknown> | undefined) {
    this.config = value;
    this.requestUpdate();
  }

  private cart = new CartController(this);

  static registerSallaComponent(tagName: string): void {
    customElements.define(tagName, this);
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
      direction: rtl;
    }
    .custom-hero-section {
      width: 100%;
      margin: 20px 0;
      background: #fff;
    }
    .hero-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 0;
      position: relative;
      z-index: 1;
    }
    .hero-image {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .hero-image img {
      max-width: 100%;
      height: auto;
    }
    .hero-content {
      width: 100%;
      text-align: center;
      padding: 20px;
    }
    .hero-title {
      font-size: 24px;
      font-weight: 900;
      color: #8b6914;
      margin-bottom: 8px;
      line-height: 1.4;
      font-style: italic;
    }
    .hero-subtitle {
      font-size: 18px;
      font-weight: 700;
      color: #8b6914;
      margin-bottom: 15px;
      font-style: italic;
    }
    .hero-desc {
      font-size: 16px;
      color: #555;
      line-height: 1.5;
      margin-bottom: 12px;
    }
    .hero-cta-btn {
      display: inline-block;
      background: #c9a227;
      color: #fff;
      padding: 12px 30px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.3s;
      margin-top: 10px;
    }
    .hero-cta-btn:hover {
      background: #b8922a;
    }
    .hero-cta-btn.loading {
      opacity: 0.7;
      pointer-events: none;
    }
    @media (min-width: 768px) {
      .hero-container {
        flex-direction: row;
        align-items: center;
        gap: 0;
      }
      .hero-image {
        width: 50%;
        justify-content: center;
      }
      .hero-image img {
        max-width: 350px;
      }
      .hero-content {
        width: 50%;
        text-align: right;
        padding: 0 30px;
      }
      .hero-title {
        font-size: 32px;
      }
      .hero-subtitle {
        font-size: 24px;
      }
      .hero-desc {
        font-size: 14px;
      }
      .hero-cta-btn {
        font-size: 16px;
        padding: 14px 40px;
      }
    }
  `;

  willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("config")) {
      this.cart.productId = resolveProductId(this.config?.product_id as string | number | undefined);
    }
  }

  private async handleCta(): Promise<void> {
    await this.cart.addToCart();
  }

  render() {
    const title = String(this.config?.title ?? "هـيـرش لهب رائحة لها هيبتــها");
    const subtitle = String(this.config?.subtitle ?? "بخّة وحدة تكفي والباقي يصير حكاية");
    const description = String(this.config?.description ?? "");
    const ctaText = String(this.config?.button_text ?? "عطر جوكر لكل الفصول ولكل اللحظات");
    const imageUrl = getImageUrlFromConfig(this.config?.image_url) || "";

    return html`
      <div class="custom-hero-section">
        <div class="hero-container">
          ${imageUrl
            ? html`<div class="hero-image"><img src="${imageUrl}" alt="${title}" loading="lazy" decoding="async" /></div>`
            : ""}
          <div class="hero-content">
            <h2 class="hero-title" style="${getTitleGradientStyle(this.config, "title_") || "color: #8b6914"}">${title}</h2>
            <p class="hero-subtitle">${subtitle}</p>
            ${description ? html`<p class="hero-desc">${description}</p>` : ""}
            <button
              type="button"
              class="hero-cta-btn ${this.cart.loading ? "loading" : ""}"
              @click=${this.handleCta}
              ?disabled=${this.cart.loading}
            >
              ${this.cart.loading ? this.cart.addButtonText : ctaText}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
