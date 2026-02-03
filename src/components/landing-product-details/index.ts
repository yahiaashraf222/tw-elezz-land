import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";
import { getImageUrlFromConfig, sanitizeImageUrl } from "../../utils/sanitize.js";

/**
 * Salla Twilight landing product details: image slot, title, subtitle, price, discount bar, features list.
 * Display only; use with add-to-cart-actions or fast-checkout-block for buy. Config: title, subtitle, current_price, old_price, save_label, tax_label, features (collection).
 */
export default class LandingProductDetails extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  set state(value: Record<string, unknown> | undefined) {
    this.config = value;
    this.requestUpdate();
  }

  private _featuresRaw: unknown;
  private _featuresCache: Array<{ icon: string; text: string }> | null = null;

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
    .product-details-section {
      width: 100%;
      padding: 40px 15px;
      background: #f9f9f9;
    }
    .product-details-container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      align-items: center;
    }
    .product-details-image {
      flex: 1;
      min-width: 300px;
      max-width: 500px;
    }
    .product-details-image ::slotted(img),
    .product-details-image img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
    .product-details-info {
      flex: 1;
      min-width: 300px;
      text-align: right;
    }
    .product-details-title {
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .product-details-subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 20px;
    }
    .product-details-price {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .product-details-price .current-price {
      font-size: 26px;
      font-weight: bold;
      color: #333;
    }
    .product-details-price .price-label {
      font-size: 18px;
      color: #666;
    }
    .product-details-price .old-price {
      font-size: 18px;
      color: #999;
      text-decoration: line-through;
    }
    .product-details-tax {
      font-size: 14px;
      color: #888;
      margin-bottom: 15px;
    }
    .product-discount-bar {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
      color: #fff;
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 25px;
    }
    .product-discount-bar .fire-icon {
      font-size: 20px;
    }
    .product-features-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .product-feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      color: #555;
    }
    .product-feature-item .feature-icon {
      font-size: 20px;
      flex-shrink: 0;
    }
    @media (max-width: 768px) {
      .product-details-section {
        padding: 25px 15px;
      }
      .product-details-container {
        flex-direction: column;
      }
      .product-details-image,
      .product-details-info {
        max-width: 100%;
        min-width: 100%;
      }
      .product-details-info {
        text-align: center;
      }
      .product-details-title {
        font-size: 24px;
      }
      .product-details-price {
        justify-content: center;
      }
      .product-discount-bar {
        margin: 0 auto 25px;
      }
      .product-features-list {
        align-items: center;
      }
    }
  `;

  private parseFeatures(): Array<{ icon: string; text: string }> {
    const raw = this.config?.features;
    if (this._featuresRaw === raw && this._featuresCache) return this._featuresCache;
    const mapOne = (x: unknown) => ({
      icon: typeof x === "object" && x && "icon" in x ? String((x as { icon?: string }).icon ?? "🎁") : "🎁",
      text: typeof x === "object" && x && "text" in x ? String((x as { text?: string }).text ?? "") : String(x ?? ""),
    });
    let result: Array<{ icon: string; text: string }>;
    if (Array.isArray(raw)) {
      result = raw.map(mapOne);
    } else if (typeof raw === "string") {
      try {
        const arr = JSON.parse(raw) as unknown;
        result = Array.isArray(arr) ? arr.map(mapOne) : [];
      } catch {
        result = [];
      }
      if (result.length === 0) {
        result = [
          { icon: "🎁", text: "هدية مجانية: عينة 3 مل مع كل طلب" },
          { icon: "🚚", text: "شحن لدول الخليج، أوروبا، بريطانيا وأمريكا" },
        ];
      }
    } else {
      result = [
        { icon: "🎁", text: "هدية مجانية: عينة 3 مل مع كل طلب" },
        { icon: "🚚", text: "شحن لدول الخليج، أوروبا، بريطانيا وأمريكا" },
      ];
    }
    this._featuresRaw = raw;
    this._featuresCache = result;
    return result;
  }

  render() {
    const title = String(this.config?.title ?? "لا تخلي أحد يوصفلك");
    const subtitle = String(this.config?.subtitle ?? "جربه بنفسك");
    const currentPrice = Number(this.config?.current_price ?? 299);
    const oldPrice = Number(this.config?.old_price ?? 801);
    const saveLabel = String(this.config?.save_label ?? "وفر 502 ريال الآن");
    const taxLabel = String(this.config?.tax_label ?? "السعر شامل الضريبة");
    const priceLabel = String(this.config?.price_label ?? "فقط - بدلاً من");
    const features = this.parseFeatures();
    const imageUrl = getImageUrlFromConfig(this.config?.image_url) || "";
    const titleGradient = getTitleGradientStyle(this.config, "title_");

    return html`
      <div class="product-details-section">
        <div class="product-details-container">
          <div class="product-details-image">
            ${imageUrl
              ? html`<img src="${imageUrl}" alt="${title}" loading="lazy" decoding="async" />`
              : html`<slot name="image"></slot>`}
          </div>
          <div class="product-details-info">
            <h2 class="product-details-title" style="${titleGradient || "color: #333"}">${title}</h2>
            <p class="product-details-subtitle">${subtitle}</p>
            <div class="product-details-price">
              <span class="current-price">${currentPrice} <i class="sicon-sar"></i></span>
              <span class="price-label">${priceLabel}</span>
              <span class="old-price">${oldPrice} <i class="sicon-sar"></i></span>
            </div>
            <p class="product-details-tax">${taxLabel}</p>
            <div class="product-discount-bar">
              <span class="fire-icon">🔥</span>
              <span>${saveLabel}</span>
            </div>
            <div class="product-features-list">
              ${features.map(
                (f) =>
                  html`<div class="product-feature-item">
                    <span class="feature-icon">${f.icon}</span>
                    <span>${f.text}</span>
                  </div>`
              )}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
