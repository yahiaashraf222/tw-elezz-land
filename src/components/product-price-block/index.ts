import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";

/**
 * Salla Twilight component: product price block with current price, old price, and save badge.
 * Config: current_price, old_price, save_amount. Save label supports gradient (price_label_gradient_*).
 */
export default class ProductPriceBlock extends LitElement {
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
    .custom-price-wrapper {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      direction: rtl;
      margin: 10px 0 20px;
    }
    .custom-price-wrapper .current-price {
      font-size: 28px;
      font-weight: 900;
      color: #c00;
    }
    .custom-price-wrapper .old-price-wrap {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      color: #888;
    }
    .custom-price-wrapper .old-price {
      text-decoration: line-through;
      color: #999;
    }
    .custom-price-wrapper .save-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #fff;
      border: 1.5px solid #c00;
      border-radius: 5px;
      padding: 5px 10px;
      font-size: 14px;
      font-weight: bold;
      color: #c00;
    }
    .custom-price-wrapper .save-badge svg {
      width: 20px;
      height: 20px;
    }
  `;

  private get currentPrice(): number {
    return Number(this.config?.current_price ?? 199);
  }

  private get oldPrice(): number {
    return Number(this.config?.old_price ?? 850);
  }

  private get saveAmount(): number {
    return Number(this.config?.save_amount ?? 651);
  }

  private get saveLabel(): string {
    return String(this.config?.save_label ?? "وفر");
  }

  render() {
    const labelGradient = getTitleGradientStyle(this.config, "price_label_");
    return html`
      <div class="custom-price-wrapper">
        <span class="current-price">
          ${this.currentPrice}
          <i class="sicon-sar"></i>
        </span>
        <span class="old-price-wrap">
          <span>بدلاً من</span>
          <span class="old-price">
            ${this.oldPrice}
            <i class="sicon-sar"></i>
          </span>
        </span>
        <span class="save-badge" style="${labelGradient || ""}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.165 512.165">
            <path
              d="m437.476 320.656c-.004-.05-.007-.101-.011-.15-1.541-21.368-5.481-39.513-12.39-57.037-.093-.265-.193-.528-.302-.79-.395-.951-39.225-95.684-21.044-147.746 1.641-4.697.845-9.901-2.123-13.894s-7.716-6.249-12.691-6.037c-1.333.058-28.492 1.565-57.3 26.911-25.213-52.021-29.194-107.287-29.235-107.89-.341-5.227-3.383-9.896-8.026-12.32-4.644-2.425-10.213-2.249-14.697.457-39.788 24.034-70.525 53.365-91.356 87.18-16.82 27.302-27.192 57.459-30.829 89.634-2.184 19.327-1.665 37.002-.054 51.85.746 6.879-6.125 12.051-12.529 9.432l-38.613-15.797c-2.632-1.077-5.512-1.525-8.32-1.073-5.912.952-10.518 5.194-12.095 10.682-3.504 12.189-6.128 23.455-8.023 34.441-6.596 38.261-3.897 77.447 7.802 113.325 11.762 36.068 32.059 67.129 58.697 89.824 31.481 26.822 69.604 40.477 111.176 40.477 22.939 0 46.93-4.158 71.431-12.557 38.865-13.321 69.645-39.707 89.011-76.303 16.095-30.419 23.739-66.863 21.521-102.619z"
              fill="#ff001e"
            />
            <path
              d="m296.687 260.081c-3.792-5.657-10.918-8.056-17.356-5.829-6.438 2.223-10.57 8.503-10.063 15.295 1.789 23.976-.608 94.475-33.954 103.618-28.387 7.787-43.529-5.362-45-6.726-3.681-4.013-9.084-5.533-14.39-4.261-5.342 1.285-9.38 5.573-10.805 10.879-.283 1.053-2.793 10.461-3.851 16.59-6.784 39.356 6.081 78.356 33.576 101.781 16.127 13.74 35.578 20.736 56.725 20.736 11.536 0 23.58-2.084 35.855-6.292 19.779-6.78 36.691-21.121 48.908-41.475 10.219-17.024 16.161-36.889 16.305-54.5.366-45.31-16.889-91.515-55.95-149.816z"
              fill="#ffeb00"
            />
          </svg>
          ${this.saveLabel} ${this.saveAmount}.00
          <i class="sicon-sar"></i>
        </span>
      </div>
    `;
  }
}
