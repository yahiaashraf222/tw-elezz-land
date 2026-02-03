import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

/**
 * Salla Twilight landing marquee: horizontally scrolling text ticker.
 * Config: text, dot_char.
 */
export default class LandingMarquee extends LitElement {
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
      direction: ltr;
    }
    .features-marquee-wrapper {
      width: 100%;
      background: #1a1a1a;
      padding: 14px 0;
      overflow: hidden;
      position: relative;
      cursor: grab;
    }
    .features-marquee-wrapper:active {
      cursor: grabbing;
    }
    .marquee-track {
      display: flex;
      flex-wrap: nowrap;
      width: max-content;
      animation: marquee-scroll 30s linear infinite;
    }
    .marquee-item {
      display: inline-flex;
      align-items: center;
      padding: 0 5px;
      font-size: 14px;
      color: #fff;
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .marquee-item .dot {
      color: #c9a227;
      margin: 0 5px;
      font-size: 16px;
    }
    @keyframes marquee-scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    @media (min-width: 768px) {
      .marquee-item {
        padding: 0 8px;
        font-size: 15px;
      }
      .marquee-item .dot {
        margin: 0 8px;
        font-size: 18px;
      }
    }
  `;

  render() {
    const text = String(this.config?.text ?? "باقي أيام قليلة وينتهي العرض");
    const dot = String(this.config?.dot_char ?? "•");
    const duplicated = [text, text, text, text, text, text];

    return html`
      <div class="features-marquee-wrapper">
        <div class="marquee-track">
          ${duplicated.map(
            (t) =>
              html`<div class="marquee-item"><span class="dot">${dot}</span><span> ${t} </span></div>`
          )}
          ${duplicated.map(
            (t) =>
              html`<div class="marquee-item"><span class="dot">${dot}</span><span> ${t} </span></div>`
          )}
        </div>
      </div>
    `;
  }
}
