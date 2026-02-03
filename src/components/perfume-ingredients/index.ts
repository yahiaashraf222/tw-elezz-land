import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";
import { sanitizeImageUrl } from "../../utils/sanitize.js";

export interface IngredientNote {
  image_url?: string;
  name?: string;
}

export interface PerfumeCardData {
  title?: string;
  sections?: Array<{ section_title?: string; ingredients?: IngredientNote[] }>;
}

/**
 * Salla Twilight component: perfume ingredients section (cards with notes).
 * Config: cards (array of PerfumeCardData) or use built-in default.
 */
export default class PerfumeIngredients extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
    }
    .perfume-ingredients-section {
      direction: rtl;
      text-align: right;
      margin: 15px 0;
    }
    .perfume-card {
      background: #fff;
      border: 1px solid #eaeaea;
      border-radius: 12px;
      padding: 20px 15px;
      margin-bottom: 15px;
    }
    .perfume-card-title {
      font-size: 24px;
      font-weight: 900;
      color: #000;
      text-align: center;
      margin-bottom: 10px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
    }
    .ing-main-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 18px;
      color: #333;
      text-align: center;
    }
    .ing-section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #555;
      text-align: center;
      padding: 8px 15px;
      border-radius: 20px;
      background: #f9f9f9;
    }
    .ing-notes-container {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
      margin-bottom: 25px;
    }
    .ingredient-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
    }
    .ingredient-img {
      width: 65px;
      height: 65px;
      object-fit: contain;
      margin-bottom: 8px;
      transition: transform 0.3s;
    }
    .ingredient-item:hover .ingredient-img {
      transform: scale(1.1);
    }
    .ingredient-name {
      font-size: 15px;
      color: #333;
      font-weight: 700;
      text-align: center;
    }
  `;

  private static readonly DEFAULT_CARDS: PerfumeCardData[] = [
    {
      title: "كلكات بلو 200 مل :",
      sections: [
        {
          section_title: "مقدمة العطر",
          ingredients: [
            { image_url: "https://i.ibb.co/mVbDDfyD/image.png", name: "الكمثرى الماندرين" },
            { image_url: "https://i.ibb.co/zhWVx1nr/image.png", name: "البرتقال" },
            { image_url: "https://i.ibb.co/4wxFCXq7/image.png", name: "البرغموت" },
            { image_url: "https://i.ibb.co/tM0393jh/image.png", name: "الزنجبيل" },
          ],
        },
        {
          section_title: "قلب العطر",
          ingredients: [
            { image_url: "https://i.ibb.co/Z7fHrnV/image.png", name: "زهر البرتقال" },
            { image_url: "https://i.ibb.co/gbJzDsXC/image.png", name: "خشب الصندل" },
          ],
        },
        {
          section_title: "قاعدة العطر",
          ingredients: [
            { image_url: "https://i.ibb.co/hRPhqLyC/image.png", name: "خشب الأرز" },
            { image_url: "https://i.ibb.co/b5h2nCxH/image.png", name: "المسك" },
            { image_url: "https://i.ibb.co/qMhwGqG3/image.png", name: "آمبروفيكس" },
          ],
        },
      ],
    },
    {
      title: "هيرش بخوري 100 مل :",
      sections: [
        { section_title: "مقدمة العطر", ingredients: [{ image_url: "https://i.ibb.co/SwxpGyTC/image.png", name: "أخشاب بخور" }] },
        { section_title: "قلب العطر", ingredients: [{ image_url: "https://i.ibb.co/mKnQ9LT/image.png", name: "توت" }] },
        {
          section_title: "قاعدة العطر",
          ingredients: [
            { image_url: "https://i.ibb.co/b5h2nCxH/image.png", name: "مسك" },
            { image_url: "https://i.ibb.co/Rpn9jDMb/image.png", name: "فانيلا" },
            { image_url: "https://i.ibb.co/93S48Bbm/image.png", name: "عنبر" },
            { image_url: "https://i.ibb.co/kgqK2JHZ/image.png", name: "تونكا" },
            { image_url: "https://i.ibb.co/6JchYf6m/image.png", name: "باتشولي" },
            { image_url: "https://i.ibb.co/B2PtL3gw/image.png", name: "دهن العود" },
          ],
        },
      ],
    },
  ];

  private get cards(): PerfumeCardData[] {
    const raw = this.config?.cards;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item: unknown) => {
        const o = item as Record<string, unknown>;
        let sections: PerfumeCardData["sections"] = [];
        if (Array.isArray(o.sections)) sections = o.sections as PerfumeCardData["sections"];
        else if (typeof o.sections === "string" && o.sections.trim()) {
          try {
            const parsed = JSON.parse(o.sections) as unknown;
            if (Array.isArray(parsed)) sections = parsed as PerfumeCardData["sections"];
          } catch {
            // ignore
          }
        }
        return { title: o.title ?? "", sections };
      });
    }
    if (typeof raw === "string" && raw.trim()) {
      try {
        const arr = JSON.parse(raw) as unknown;
        if (Array.isArray(arr)) return arr as PerfumeCardData[];
      } catch {
        // ignore
      }
    }
    return PerfumeIngredients.DEFAULT_CARDS;
  }

  private renderIngredient(img: string | undefined, name: string): ReturnType<typeof html> {
    if (!name) return html``;
    const safeUrl = sanitizeImageUrl(img);
    return html`
      <div class="ingredient-item">
        ${safeUrl ? html`<img src="${safeUrl}" alt="${name}" class="ingredient-img" loading="lazy" decoding="async" />` : ""}
        <span class="ingredient-name">${name}</span>
      </div>
    `;
  }

  render() {
    const sectionTitleGradient = getTitleGradientStyle(this.config, "section_title_");
    const cardTitleGradient = getTitleGradientStyle(this.config, "card_title_");
    return html`
      <div class="perfume-ingredients-section">
        ${this.cards.map(
          (card) => html`
            <div class="perfume-card">
              <div class="perfume-card-title" style="${cardTitleGradient || "color: #000"}">${card.title ?? ""}</div>
              <div class="ing-main-title" style="${sectionTitleGradient || "color: #333"}">مكونات العطر:</div>
              ${(card.sections ?? []).map(
                (sec) => html`
                  <div class="ing-section-title">${sec.section_title ?? ""}</div>
                  <div class="ing-notes-container">
                    ${(sec.ingredients ?? []).map((ing) => this.renderIngredient(ing.image_url, ing.name ?? ""))}
                  </div>
                `
              )}
            </div>
          `
        )}
      </div>
    `;
  }
}
