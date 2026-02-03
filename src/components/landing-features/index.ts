import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";
import { getImageUrlFromConfig, sanitizeImageUrl } from "../../utils/sanitize.js";

/**
 * Salla Twilight landing features: title, list of feature items, center image.
 * Config: title, feature_items (collection), image_url.
 */
export default class LandingFeatures extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  set state(value: Record<string, unknown> | undefined) {
    this.config = value;
    this.requestUpdate();
  }

  private _featureItemsRaw: unknown;
  private _featureItemsCache: string[] | null = null;

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
    .features-section {
      width: 100%;
      padding: 40px 15px;
      background: linear-gradient(180deg, #f5f0e8 0%, #ebe4d8 100%);
    }
    .features-container {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
    .features-title {
      font-size: 24px;
      font-weight: 900;
      color: #5a4a3a;
      margin-bottom: 30px;
      line-height: 1.5;
    }
    .features-title span {
      color: #8b6914;
    }
    .features-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 25px;
    }
    .features-image {
      width: 100%;
      max-width: 280px;
      order: 1;
    }
    .features-image img {
      width: 100%;
      height: auto;
    }
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
    .features-list-right {
      order: 2;
    }
    .features-list-left {
      order: 3;
    }
    .feature-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 15px;
      font-size: 15px;
      color: #5a4a3a;
      font-weight: 600;
      text-align: center;
    }
    .feature-item .star {
      color: #8b6914;
      font-size: 18px;
    }
    @media (min-width: 768px) {
      .features-section {
        padding: 60px 30px;
      }
      .features-title {
        font-size: 36px;
        margin-bottom: 50px;
      }
      .features-content {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 50px;
      }
      .features-image {
        max-width: 350px;
        order: 2;
      }
      .features-list {
        width: auto;
        min-width: 220px;
        gap: 20px;
      }
      .features-list-right {
        order: 1;
        text-align: right;
      }
      .features-list-left {
        order: 3;
        text-align: left;
      }
      .feature-item {
        font-size: 16px;
        padding: 10px 0;
        justify-content: flex-start;
      }
      .features-list-left .feature-item {
        justify-content: flex-end;
        flex-direction: row-reverse;
      }
    }
  `;

  private parseItems(): string[] {
    const raw = this.config?.feature_items;
    if (this._featureItemsRaw === raw && this._featureItemsCache) return this._featureItemsCache;
    let result: string[];
    if (Array.isArray(raw)) {
      result = raw.map((x) => (typeof x === "object" && x && "text" in x ? String((x as { text?: string }).text ?? "") : String(x ?? "")));
    } else if (typeof raw === "string") {
      try {
        const arr = JSON.parse(raw) as unknown;
        result = Array.isArray(arr) ? arr.map((x) => String(x ?? "")) : [raw];
      } catch {
        result = raw ? [raw] : [];
      }
    } else {
      result = [
        "يناسب الجنسين",
      "استخدام \"جوكر\" لكل وقت وموسم",
      "متوازن بين النعومة والجرأة",
      "رائحة قوية وثبات عالي",
        "تصميم زجاجة فاخر يليق كهدية",
      ];
    }
    this._featureItemsRaw = raw;
    this._featureItemsCache = result;
    return result;
  }

  render() {
    const title = String(this.config?.title ?? "ليش حصل <span>هيرش لهب</span><br>على أكثر من 1500 تقييم؟");
    const items = this.parseItems();
    const mid = Math.ceil(items.length / 2);
    const rightItems = items.slice(0, mid);
    const leftItems = items.slice(mid);
    const imageUrl = getImageUrlFromConfig(this.config?.image_url) || "";

    return html`
      <div class="features-section">
        <div class="features-container">
          <h2 class="features-title" style="${getTitleGradientStyle(this.config, "title_") || "color: #5a4a3a"}">${title}</h2>
          <div class="features-content">
            <div class="features-list features-list-right">
              ${rightItems.map((text) => html`<div class="feature-item"><span class="star">★</span> ${text}</div>`)}
            </div>
            ${imageUrl
              ? html`<div class="features-image"><img src="${imageUrl}" alt="" loading="lazy" decoding="async" /></div>`
              : ""}
            <div class="features-list features-list-left">
              ${leftItems.map((text) => html`<div class="feature-item"><span class="star">★</span> ${text}</div>`)}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
