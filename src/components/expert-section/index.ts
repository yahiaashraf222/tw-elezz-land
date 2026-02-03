import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";
import { getImageUrlFromConfig, sanitizeImageUrl } from "../../utils/sanitize.js";

/**
 * Salla Twilight component: expert section with banner and cards.
 * Config: banner_image, cards. Card titles support gradient (expert_title_gradient_*).
 */
export default class ExpertSection extends LitElement {
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
    .expert-section {
      margin-top: 25px;
      direction: rtl;
    }
    .expert-banner-img {
      width: 100%;
      border-radius: 12px;
      margin-bottom: 20px;
      display: block;
      height: auto;
    }
    .expert-grid {
      display: flex;
      gap: 15px;
      flex-direction: column;
    }
    .expert-card {
      background: #f5f5f5;
      border: 1px solid #ccc;
      border-radius: 12px;
      padding: 20px;
      flex: 1;
      text-align: right;
      font-size: 13px;
      line-height: 1.8;
      color: #333;
    }
    .expert-title {
      font-weight: 900;
      font-size: 16px;
      margin-bottom: 12px;
      color: #000;
      display: block;
    }
    .expert-text p {
      margin-bottom: 10px;
    }
    .expert-highlight-box {
      background: #fff;
      padding: 12px;
      border-radius: 8px;
      margin-top: 15px;
      font-weight: bold;
      font-size: 13px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
    }
    @media (min-width: 768px) {
      .expert-card {
        font-size: 14px;
      }
    }
  `;

  private get bannerImage(): string {
    return getImageUrlFromConfig(this.config?.banner_image) || sanitizeImageUrl("https://i.ibb.co/nsc58ssG/Untitled-3.png");
  }

  private get cards(): Array<{ title?: string; paragraphs?: string[]; highlight?: string }> {
    const raw = this.config?.cards;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item: unknown) => {
        const o = item as Record<string, unknown>;
        let paragraphs: string[] = [];
        if (Array.isArray(o.paragraphs)) {
          paragraphs = o.paragraphs.map((p: unknown) =>
            typeof p === "object" && p != null && "text" in p ? String((p as { text?: unknown }).text ?? "") : String(p ?? "")
          );
        } else if (typeof o.paragraphs === "string" && o.paragraphs.trim()) {
          paragraphs = o.paragraphs.split(/\n/).map((s) => s.trim()).filter(Boolean);
        }
        return { title: o.title ?? "", paragraphs, highlight: o.highlight ?? "" };
      });
    }
    return [
      {
        title: "كلمة خبير العطور عن بكج شتوية الملوك :",
        paragraphs: [
          "عندما ابتكرت هيرش بخوري و كلكات، لم أبحث عن عطور عابرة بل سعيت وراء أسطورة تُخلّد في ذاكرة عشاق النوادر.",
          "الأول، ملك الأخشاب والبخور، يمزج الثبات بالفوحان في توازن أسطوري.",
          "والثاني، جوهرة تنبض بالأناقة والغموض، تمنح حضورًا لا يُنسى.",
          "لقد ارتقيت بهما إلى مستوى يليق بالخبراء، لتكون التجربة أرقى من أي توقع.",
          "هذا هو بكج شتاء الملوك",
        ],
      },
      {
        paragraphs: [
          "هيرش بدخان البخور الطبيعي الممزوج بالتوت والتونكا. قوة تُشبه الأساطير، وثبات يُعلن حضورك.",
          "كلكات بلو برائحة الكمثرى وزهر البرتقال وخشب الصندل، يوازن المشهد بذائقة راقية و صعبة، رفيق صباحك الشتوي.",
        ],
        highlight:
          "انت الان لست أمام عطور، بل أمام تجربة تروى كإحدى أساطير العطور، أمام سيمفونية من الروائح حكاية تميز تحفر في الذاكرة، وتروى جيلاً بعد جيل.",
      },
    ];
  }

  render() {
    const titleGradient = getTitleGradientStyle(this.config, "expert_title_");
    return html`
      <div class="expert-section">
        <img src="${this.bannerImage}" alt="بكج شتاء الملوك" class="expert-banner-img" loading="lazy" decoding="async" />
        <div class="expert-grid">
          ${this.cards.map(
            (card) => html`
              <div class="expert-card">
                ${card.title ? html`<span class="expert-title" style="${titleGradient || "color: #000"}">${card.title}</span>` : ""}
                <div class="expert-text">
                  ${(card.paragraphs ?? []).map((p) => html`<p>${p}</p>`)}
                </div>
                ${card.highlight ? html`<div class="expert-highlight-box">${card.highlight}</div>` : ""}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
