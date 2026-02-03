import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { CartController, resolveProductId } from "../../controllers/cart-controller.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";
import { sanitizeImageUrl } from "../../utils/sanitize.js";

/**
 * Salla Twilight landing guarantee: header, subtitle, description, feature icons, CTA (buy now).
 * Uses salla.cart.addItem(); product_id from config or product page context.
 */
export default class LandingGuarantee extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  private cart = new CartController(this);

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
      direction: rtl;
      text-align: center;
    }
    .guarantee-section {
      width: 100%;
      padding: 40px 15px;
      background: #fff;
    }
    .guarantee-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .guarantee-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 15px;
    }
    .guarantee-header img {
      width: 40px;
      height: 40px;
    }
    .guarantee-title {
      font-size: 28px;
      font-weight: 900;
      color: #8b6914;
      font-style: italic;
    }
    .guarantee-subtitle {
      font-size: 22px;
      font-weight: 700;
      color: #5a4a3a;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .guarantee-subtitle span {
      color: #8b6914;
    }
    .guarantee-desc {
      font-size: 14px;
      color: #888;
      margin-bottom: 30px;
    }
    .guarantee-features {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
      margin-bottom: 30px;
    }
    .guarantee-feature {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 15px;
      background: #f9f7f4;
      border-radius: 12px;
      min-width: 140px;
      flex: 1;
      max-width: 160px;
    }
    .guarantee-feature img {
      width: 35px;
      height: 35px;
    }
    .guarantee-feature-text {
      font-size: 13px;
      font-weight: 600;
      color: #5a4a3a;
      line-height: 1.4;
    }
    .guarantee-cta {
      display: inline-block;
      background: #5a4a3a;
      color: #fff;
      padding: 14px 40px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.3s;
    }
    .guarantee-cta:hover {
      background: #4a3a2a;
    }
    .guarantee-cta.loading {
      opacity: 0.7;
      pointer-events: none;
    }
    @media (min-width: 768px) {
      .guarantee-section {
        padding: 60px 30px;
      }
      .guarantee-header img {
        width: 50px;
        height: 50px;
      }
      .guarantee-title {
        font-size: 36px;
      }
      .guarantee-subtitle {
        font-size: 28px;
      }
      .guarantee-desc {
        font-size: 16px;
      }
      .guarantee-features {
        gap: 20px;
      }
      .guarantee-feature {
        min-width: 180px;
        max-width: 200px;
        padding: 20px;
      }
      .guarantee-feature img {
        width: 45px;
        height: 45px;
      }
      .guarantee-feature-text {
        font-size: 15px;
      }
      .guarantee-cta {
        font-size: 18px;
        padding: 16px 50px;
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

  private _guaranteeFeaturesRaw: unknown;
  private _guaranteeFeaturesCache: Array<{ icon_url: string; text: string }> | null = null;

  private parseFeatures(): Array<{ icon_url: string; text: string }> {
    const raw = this.config?.guarantee_features;
    if (this._guaranteeFeaturesRaw === raw && this._guaranteeFeaturesCache) return this._guaranteeFeaturesCache;
    const mapOne = (x: unknown) => ({
      icon_url: typeof x === "object" && x && "icon_url" in x ? String((x as { icon_url?: string }).icon_url ?? "") : "",
      text: typeof x === "object" && x && "text" in x ? String((x as { text?: string }).text ?? "") : String(x ?? ""),
    });
    let result: Array<{ icon_url: string; text: string }>;
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
          { icon_url: "", text: "جودة عالمية" },
          { icon_url: "", text: "استرجاع مجاني\n100% محليًا" },
          { icon_url: "", text: "تجربه آمنة\nومرضية" },
          { icon_url: "", text: "توصيل\nسريع" },
        ];
      }
    } else {
      result = [
        { icon_url: "", text: "جودة عالمية" },
        { icon_url: "", text: "استرجاع مجاني\n100% محليًا" },
        { icon_url: "", text: "تجربه آمنة\nومرضية" },
        { icon_url: "", text: "توصيل\nسريع" },
      ];
    }
    this._guaranteeFeaturesRaw = raw;
    this._guaranteeFeaturesCache = result;
    return result;
  }

  render() {
    const title = String(this.config?.title ?? "ضمان ذهـــبي يريحك");
    const subtitle = String(this.config?.subtitle ?? "مع العز، تجربتك مضمـــونة");
    const subtitleHighlight = String(this.config?.subtitle_highlight ?? "محد مـــدحك؟");
    const desc = String(this.config?.description ?? "رجّع العطر مجانًا بدون أي تكلفة داخل السعودية..");
    const ctaText = String(this.config?.button_text ?? "نثق في عطونا ونثق بذوقــك");
    const headerIconUrl = sanitizeImageUrl(this.config?.header_icon_url ?? "");
    const features = this.parseFeatures();

    return html`
      <div class="guarantee-section">
        <div class="guarantee-container">
          <div class="guarantee-header">
            ${headerIconUrl ? html`<img src="${headerIconUrl}" alt="" loading="lazy" decoding="async" />` : ""}
            <h2 class="guarantee-title" style="${getTitleGradientStyle(this.config, "title_") || "color: #8b6914"}">${title}</h2>
          </div>
          <p class="guarantee-subtitle">${subtitle}<br /><span>${subtitleHighlight}</span></p>
          <p class="guarantee-desc">${desc}</p>
          <div class="guarantee-features">
            ${features.map((f) => {
              const iconUrl = sanitizeImageUrl(f.icon_url);
              return html`<div class="guarantee-feature">
                ${iconUrl ? html`<img src="${iconUrl}" alt="" loading="lazy" decoding="async" />` : ""}
                <span class="guarantee-feature-text" style="white-space: pre-line;">${f.text}</span>
              </div>`;
            })}
          </div>
          <button
            type="button"
            class="guarantee-cta ${this.cart.loading ? "loading" : ""}"
            @click=${this.handleCta}
            ?disabled=${this.cart.loading}
          >
            ${this.cart.loading ? this.cart.addButtonText : ctaText}
          </button>
        </div>
      </div>
    `;
  }
}
