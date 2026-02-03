import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { CartController, resolveProductId } from "../../controllers/cart-controller.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";
import { sanitizeImageUrl } from "../../utils/sanitize.js";

interface IngredientNote {
  image_url?: string;
  name?: string;
}
interface IngredientSection {
  section_title?: string;
  ingredients?: IngredientNote[];
}
interface PerfumeCard {
  title?: string;
  sections?: IngredientSection[];
}
interface ExpertCard {
  title?: string;
  paragraphs?: string[];
  highlight?: string;
}

/**
 * Salla Twilight: single section block combining product description, price, perfume ingredients, expert section, and add-to-cart.
 * All texts and images overridable via config. Buy button uses Salla (product_id from config or product page).
 * All titles support optional gradient (enable, from_color, to_color, direction, style).
 */
export default class ProductSectionBlock extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  private cart = new CartController(this);
  private _perfumeCardsRaw: unknown;
  private _perfumeCardsCache: PerfumeCard[] | null = null;
  private _expertCardsRaw: unknown;
  private _expertCardsCache: ExpertCard[] | null = null;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
      direction: rtl;
    }
    .product-section-block {
      background: #fff;
      border: 1px solid #eaeaea;
      border-radius: 12px;
      padding: 24px 20px;
      margin: 20px 0;
    }
    .block-desc {
      text-align: center;
      margin-bottom: 20px;
      line-height: 1.8;
    }
    .block-desc .desc-title {
      font-size: 16px;
      font-weight: 900;
      margin-bottom: 12px;
    }
    .block-desc .desc-text {
      font-size: 14px;
      color: #444;
      margin-bottom: 10px;
    }
    .block-desc .desc-highlight {
      font-size: 14px;
      font-weight: 700;
      color: #000;
    }
    .block-price {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin: 15px 0 20px;
    }
    .block-price .current-price {
      font-size: 28px;
      font-weight: 900;
      color: #c00;
    }
    .block-price .old-price-wrap {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      color: #888;
    }
    .block-price .old-price {
      text-decoration: line-through;
      color: #999;
    }
    .block-price .save-badge {
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
    .block-ingredients {
      margin: 25px 0;
    }
    .block-ingredients .ing-main-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 18px;
      color: #333;
      text-align: center;
    }
    .perfume-card {
      background: #fafafa;
      border: 1px solid #eee;
      border-radius: 12px;
      padding: 20px 15px;
      margin-bottom: 15px;
    }
    .perfume-card-title {
      font-size: 20px;
      font-weight: 900;
      color: #000;
      text-align: center;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f0f0f0;
    }
    .ing-section-title {
      font-size: 16px;
      font-weight: bold;
      margin: 15px 0 10px;
      color: #555;
      text-align: center;
      padding: 8px 12px;
      border-radius: 20px;
      background: #f0f0f0;
    }
    .ing-notes-container {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
      margin-bottom: 15px;
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
    }
    .ingredient-name {
      font-size: 14px;
      color: #333;
      font-weight: 700;
      text-align: center;
    }
    .block-expert {
      margin-top: 25px;
    }
    .expert-banner-img {
      width: 100%;
      border-radius: 12px;
      margin-bottom: 20px;
      display: block;
      height: auto;
    }
    .expert-card {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 15px;
      text-align: right;
      font-size: 14px;
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
    .expert-highlight-box {
      background: #fff;
      padding: 12px;
      border-radius: 8px;
      margin-top: 15px;
      font-weight: bold;
      font-size: 13px;
      border: 1px solid #e0e0e0;
    }
    .block-atc {
      margin-top: 25px;
    }
    .atc-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .atc-label {
      font-weight: bold;
      color: #000;
      font-size: 16px;
    }
    .qty-controls {
      display: flex;
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
      height: 45px;
    }
    .qty-btn {
      width: 45px;
      background: #fff;
      border: none;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qty-input {
      width: 60px;
      text-align: center;
      border: none;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      font-weight: bold;
      font-size: 18px;
      -moz-appearance: textfield;
    }
    .qty-input::-webkit-outer-spin-button,
    .qty-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .buy-now-btn {
      width: 100%;
      background: var(--color-primary, #004d73);
      color: var(--color-primary-reverse, #fff);
      padding: 15px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 18px;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .buy-now-btn:hover {
      opacity: 0.9;
    }
    .buy-now-btn.loading {
      opacity: 0.7;
      pointer-events: none;
    }
    @media (min-width: 768px) {
      .product-section-block {
        padding: 30px 28px;
      }
      .block-desc .desc-title {
        font-size: 19px;
      }
      .block-desc .desc-text {
        font-size: 16px;
      }
    }
  `;

  willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("config")) {
      this.cart.productId = resolveProductId(this.config?.product_id as string | number | undefined);
    }
  }

  private get descTitle(): string {
    return String(this.config?.desc_title ?? "للملوك شتاء خاص - رحلة في عالم النوادر بكج شتاء الملوك");
  }
  private get descText(): string {
    return String(
      this.config?.desc_text ??
        "من قلب الأخشاب النادرة، حيث يولد الدفء من عمق الطبيعة. هيرش بخوري ، عطر يليسك بشت ، مبخرة متنقلة."
    );
  }
  private get descHighlight(): string {
    return String(this.config?.desc_highlight ?? "يجتمع هيرش بخوري وكلكات بلو في تجربة عطرية لا تشبه سواها.");
  }
  private get currentPrice(): number {
    return Number(this.config?.current_price ?? 199);
  }
  private get oldPrice(): number {
    return Number(this.config?.old_price ?? 850);
  }
  private get saveAmount(): number {
    return Number(this.config?.save_amount ?? 651);
  }
  private get priceLabel(): string {
    return String(this.config?.price_label ?? "بدلاً من");
  }
  private get ingredientsMainTitle(): string {
    return String(this.config?.ingredients_main_title ?? "مكونات العطر");
  }
  private get perfumeCards(): PerfumeCard[] {
    const raw = this.config?.perfume_cards;
    if (this._perfumeCardsRaw === raw && this._perfumeCardsCache) return this._perfumeCardsCache;
    if (Array.isArray(raw) && raw.length > 0) {
      this._perfumeCardsRaw = raw;
      this._perfumeCardsCache = raw.map((item: unknown) => {
        const o = item as Record<string, unknown>;
        let sections: IngredientSection[] = [];
        if (Array.isArray(o.sections)) sections = o.sections as IngredientSection[];
        else if (typeof o.sections === "string" && o.sections.trim()) {
          try {
            const parsed = JSON.parse(o.sections) as unknown;
            if (Array.isArray(parsed)) sections = parsed as IngredientSection[];
          } catch {
            // ignore
          }
        }
        return { title: o.title ?? "", sections };
      });
      return this._perfumeCardsCache;
    }
    try {
      if (typeof raw === "string") {
        const arr = JSON.parse(raw) as unknown;
        if (Array.isArray(arr)) {
          this._perfumeCardsRaw = raw;
          this._perfumeCardsCache = arr as PerfumeCard[];
          return this._perfumeCardsCache;
        }
      }
    } catch {
      // ignore
    }
    this._perfumeCardsRaw = raw;
    this._perfumeCardsCache = [
      {
        title: "كلكات بلو 200 مل :",
        sections: [
          {
            section_title: "مقدمة العطر",
            ingredients: [
              { image_url: "https://i.ibb.co/mVbDDfyD/image.png", name: "الكمثرى الماندرين" },
              { image_url: "https://i.ibb.co/4wxFCXq7/image.png", name: "البرغموت" },
            ],
          },
        ],
      },
    ];
    return this._perfumeCardsCache;
  }
  private get expertBannerImage(): string {
    return sanitizeImageUrl(this.config?.expert_banner_image ?? "https://i.ibb.co/nsc58ssG/Untitled-3.png");
  }
  private get expertCards(): ExpertCard[] {
    const raw = this.config?.expert_cards;
    if (this._expertCardsRaw === raw && this._expertCardsCache) return this._expertCardsCache;
    if (Array.isArray(raw) && raw.length > 0) {
      this._expertCardsRaw = raw;
      this._expertCardsCache = raw.map((item: unknown) => {
        const o = item as Record<string, unknown>;
        let paragraphs: string[] = [];
        if (Array.isArray(o.paragraphs)) paragraphs = o.paragraphs.map((p) => String(p ?? ""));
        else if (typeof o.paragraphs === "string" && o.paragraphs.trim()) {
          try {
            const parsed = JSON.parse(o.paragraphs) as unknown;
            if (Array.isArray(parsed)) paragraphs = parsed.map((p) => String(p ?? ""));
            else paragraphs = o.paragraphs.split(/\n/).map((s) => s.trim()).filter(Boolean);
          } catch {
            paragraphs = o.paragraphs.split(/\n/).map((s) => s.trim()).filter(Boolean);
          }
        }
        return { title: o.title ?? "", paragraphs, highlight: o.highlight ?? "" };
      });
      return this._expertCardsCache;
    }
    try {
      if (typeof raw === "string") {
        const arr = JSON.parse(raw) as unknown;
        if (Array.isArray(arr)) {
          this._expertCardsRaw = raw;
          this._expertCardsCache = arr as ExpertCard[];
          return this._expertCardsCache;
        }
      }
    } catch {
      // ignore
    }
    this._expertCardsRaw = raw;
    this._expertCardsCache = [
      {
        title: "كلمة خبير العطور عن بكج شتوية الملوك :",
        paragraphs: [
          "عندما ابتكرت هيرش بخوري و كلكات، لم أبحث عن عطور عابرة بل سعيت وراء أسطورة تُخلّد في ذاكرة عشاق النوادر.",
        ],
      },
      {
        paragraphs: ["هيرش بدخان البخور الطبيعي الممزوج بالتوت والتونكا. قوة تُشبه الأساطير، وثبات يُعلن حضورك."],
        highlight: "انت الان لست أمام عطور، بل أمام تجربة تروى كإحدى أساطير العطور.",
      },
    ];
    return this._expertCardsCache;
  }
  private get atcButtonText(): string {
    return String(this.config?.atc_button_text ?? "اشتري الآن");
  }
  private get atcQuantityLabel(): string {
    return String(this.config?.atc_quantity_label ?? "الكمية");
  }

  private handlePlus(): void {
    this.cart.increment();
  }
  private handleMinus(): void {
    this.cart.decrement();
  }
  private async handleBuyNow(): Promise<void> {
    await this.cart.addToCart();
  }

  render() {
    const descTitleStyle = getTitleGradientStyle(this.config, "desc_title_");
    const ingredientsTitleStyle = getTitleGradientStyle(this.config, "ingredients_title_");
    const expertTitleStyle = getTitleGradientStyle(this.config, "expert_title_");
    const perfumeCardTitleStyle = getTitleGradientStyle(this.config, "perfume_card_title_");

    return html`
      <div class="product-section-block">
        <div class="block-desc">
          <div class="desc-title" style="${descTitleStyle || "color: #000"}">${this.descTitle}</div>
          <div class="desc-text">${this.descText}</div>
          <div class="desc-highlight">${this.descHighlight}</div>
        </div>

        <div class="block-price">
          <span class="current-price">${this.currentPrice} <i class="sicon-sar"></i></span>
          <span class="old-price-wrap">
            <span>${this.priceLabel}</span>
            <span class="old-price">${this.oldPrice} <i class="sicon-sar"></i></span>
          </span>
          <span class="save-badge">وفر ${this.saveAmount}.00 <i class="sicon-sar"></i></span>
        </div>

        <div class="block-ingredients">
          <div class="ing-main-title" style="${ingredientsTitleStyle || "color: #333"}">${this.ingredientsMainTitle}</div>
          ${this.perfumeCards.map(
            (card) => html`
              <div class="perfume-card">
                <div class="perfume-card-title" style="${perfumeCardTitleStyle || "color: #000"}">${card.title ?? ""}</div>
                ${(card.sections ?? []).map(
                  (sec) => html`
                    <div class="ing-section-title">${sec.section_title ?? ""}</div>
                    <div class="ing-notes-container">
                      ${(sec.ingredients ?? []).map((ing) => {
                        const imgUrl = sanitizeImageUrl(ing.image_url);
                        return html`
                          <div class="ingredient-item">
                            ${imgUrl ? html`<img src="${imgUrl}" alt="${ing.name ?? ""}" class="ingredient-img" loading="lazy" decoding="async" />` : ""}
                            <span class="ingredient-name">${ing.name ?? ""}</span>
                          </div>
                        `;
                      })}
                    </div>
                  `
                )}
              </div>
            `
          )}
        </div>

        <div class="block-expert">
          <img src="${this.expertBannerImage}" alt="" class="expert-banner-img" loading="lazy" decoding="async" />
          ${this.expertCards.map(
            (card) => html`
              <div class="expert-card">
                ${card.title ? html`<span class="expert-title" style="${expertTitleStyle || "color: #000"}">${card.title}</span>` : ""}
                <div class="expert-text">
                  ${(card.paragraphs ?? []).map((p) => html`<p>${p}</p>`)}
                </div>
                ${card.highlight ? html`<div class="expert-highlight-box">${card.highlight}</div>` : ""}
              </div>
            `
          )}
        </div>

        <div class="block-atc">
          <div class="atc-row">
            <div class="atc-label">${this.atcQuantityLabel}</div>
            <div class="qty-controls">
              <button type="button" class="qty-btn" @click=${this.handlePlus} aria-label="زيادة الكمية">+</button>
              <input class="qty-input" type="number" .value=${String(this.cart.quantity)} readonly aria-label="الكمية" />
              <button type="button" class="qty-btn" @click=${this.handleMinus} aria-label="تقليل الكمية">−</button>
            </div>
          </div>
          <button
            type="button"
            class="buy-now-btn ${this.cart.loading ? "loading" : ""}"
            @click=${this.handleBuyNow}
            ?disabled=${this.cart.loading}
          >
            ${this.cart.loading ? this.cart.addButtonText : this.atcButtonText}
          </button>
        </div>
      </div>
    `;
  }
}
