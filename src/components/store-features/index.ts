import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";
import { getImageUrlFromConfig, sanitizeImageUrl } from "../../utils/sanitize.js";

export interface FeatureItem {
  icon_url?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Salla Twilight component: store features box (e.g. Tabby, fast delivery).
 * Config: features (array of { icon_url?, icon?, title, subtitle }).
 */
export default class StoreFeatures extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  set state(value: Record<string, unknown> | undefined) {
    this.config = value;
    this.requestUpdate();
  }

  static registerSallaComponent(tagName: string): void {
    customElements.define(tagName, this);
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
    }
    .store-features-box {
      background: #f9f9f9;
      border-radius: 12px;
      padding: 20px;
      margin: 15px 0 20px;
      border: 1px solid #f0f0f0;
      direction: rtl;
    }
    .feature-row {
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      margin-bottom: 18px;
    }
    .feature-row:last-child {
      margin-bottom: 0;
    }
    .feature-icon-wrapper {
      flex-shrink: 0;
      margin-left: 15px;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .feature-icon-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .feature-text-content {
      text-align: right;
      flex: 1;
    }
    .feature-title {
      font-weight: 800;
      font-size: 16px;
      color: #000;
      margin-bottom: 6px;
    }
    .feature-subtitle {
      font-size: 13px;
      color: #555;
      line-height: 1.6;
    }
    .section-title {
      font-size: 20px;
      font-weight: 900;
      color: #000;
      margin-bottom: 15px;
      text-align: right;
    }
  `;

  private get features(): FeatureItem[] {
    const raw = this.config?.features;
    if (Array.isArray(raw) && raw.length > 0) return raw as FeatureItem[];
    return [
      { icon_url: "https://i.ibb.co/WNS1Try3/icon1.png", title: "تابي & تمارا", subtitle: "قسم مشترياتك على 4 دفعات مع تابي وتمارا" },
      { icon_url: "https://i.ibb.co/tTJmkh01/icon2.png", title: "توصيل سريع", subtitle: "توصيل من 2 : 5 ايام في جميع أنحاء المملكة" },
    ];
  }

  render() {
    const sectionTitle = String(this.config?.title ?? "").trim();
    const titleGradient = getTitleGradientStyle(this.config, "title_");
    return html`
      <div class="store-features-box">
        ${sectionTitle ? html`<div class="section-title" style="${titleGradient || "color: #000"}">${sectionTitle}</div>` : ""}
        ${this.features.map((f) => {
          const iconUrl = getImageUrlFromConfig(f.icon_url);
          return html`
            <div class="feature-row">
              <div class="feature-icon-wrapper">
                ${iconUrl
                  ? html`<img src="${iconUrl}" alt="${f.title ?? ""}" loading="lazy" decoding="async" />`
                  : f.icon
                    ? html`<i class="${f.icon}" style="font-size:1.5rem;"></i>`
                    : ""}
              </div>
              <div class="feature-text-content">
                <div class="feature-title">${f.title ?? ""}</div>
                <div class="feature-subtitle">${f.subtitle ?? ""}</div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}
