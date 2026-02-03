import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";

/**
 * Salla Twilight component: product description box (title, text, highlight).
 * Config: title, description_text, highlight. Title supports gradient (title_gradient_*).
 */
export default class ProductDescription extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
    }
    .product-desc-box {
      background: #fff;
      border: 1px solid #eaeaea;
      border-radius: 12px;
      padding: 20px 15px;
      margin: 15px 0;
      text-align: center;
      direction: rtl;
      line-height: 1.8;
    }
    .product-desc-box .desc-title {
      font-size: 16px;
      font-weight: 900;
      color: #000;
      margin-bottom: 12px;
    }
    .product-desc-box .desc-text {
      font-size: 14px;
      color: #444;
      margin-bottom: 10px;
    }
    .product-desc-box .desc-highlight {
      font-size: 14px;
      font-weight: 700;
      color: #000;
    }
    @media (min-width: 768px) {
      .product-desc-box {
        padding: 15px 12px;
      }
      .product-desc-box .desc-title {
        font-size: 19px;
      }
      .product-desc-box .desc-text {
        font-size: 16px;
        line-height: 2.1;
      }
    }
  `;

  private get title(): string {
    return String(this.config?.title ?? "للملوك شتاء خاص - رحلة في عالم النوادر بكج شتاء الملوك");
  }

  private get descriptionText(): string {
    return String(
      this.config?.description_text ??
        "من قلب الأخشاب النادرة، حيث يولد الدفء من عمق الطبيعة. هيرش بخوري ، عطر يليسك بشت ، مبخرة متنقلة، وإلى نفحات الأناقة الساحرة التي لا تُمنح إلا للقلة، كلكات بلو رفيق صباحك الشتوي لأناقة تدوم ودفء خفيف ينعش الحواس."
    );
  }

  private get highlight(): string {
    return String(this.config?.highlight ?? "يجتمع هيرش بخوري وكلكات بلو في تجربة عطرية لا تشبه سواها ولا تُقارن.");
  }

  render() {
    const titleGradient = getTitleGradientStyle(this.config, "title_");
    return html`
      <div class="product-desc-box">
        <div class="desc-title" style="${titleGradient || "color: #000"}">${this.title}</div>
        <div class="desc-text">${this.descriptionText}</div>
        <div class="desc-highlight">${this.highlight}</div>
      </div>
    `;
  }
}
