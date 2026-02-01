import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export default class FeaturedProductOverlap extends LitElement {
  @property({ type: Object })
  config?: Record<string, any>;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
    }
    .container {
      position: relative;
      width: 100%;
      min-height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .background-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      display: flex;
      flex-direction: column;
    }
    .bg-top {
      width: 100%;
      flex-grow: 1;
    }
    .bg-bottom {
      width: 100%;
    }
    .content-wrapper {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      align-items: center;
      justify-content: space-between;
      padding: 2rem;
      gap: 2rem;
      /* Default to flex-row (left-to-right) for LTR, but we might be in RTL context */
      /* Salla usually handles direction on the body. We should respect that. */
    }
    
    /* If the page is RTL, we want image on left, text on right. 
       If flex-direction is row, first item is left.
       In RTL, 'row' puts first item on right.
       
       Design: Text (Right), Image (Left).
       So in RTL: Text (1st in DOM) -> Right, Image (2nd) -> Left.
       
       Let's structure DOM: Image, Text.
       LTR: Image (Left), Text (Right).
       RTL: Image (Right), Text (Left).
       
       Wait, the image reference shows Text on Right, Image on Left.
       This is typical Arabic layout (RTL).
       So in RTL: Text (Right), Image (Left).
       
       If I put Text first in DOM:
       RTL: Text starts on Right, Image follows on Left. -> Matches design.
       LTR: Text starts on Left, Image follows on Right. -> Mirrored design.
       
       Let's stick to Text first in DOM.
    */

    .text-side {
      flex: 1;
      text-align: inherit; 
      padding: 1rem;
    }

    .image-side {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .product-image {
      max-width: 100%;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
      transition: transform 0.3s ease;
    }
    
    .product-image:hover {
      transform: scale(1.02);
    }

    .main-title {
      font-weight: 800;
      line-height: 1.3;
      margin-bottom: 0.5rem;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; 
      margin-top: 0;
    }

    .subtitle {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      line-height: 1.4;
    }

    .description {
      font-size: 1rem;
      line-height: 1.8;
      margin-bottom: 2.5rem;
      opacity: 0.9;
      max-width: 600px;
    }

    .action-btn {
      display: inline-block;
      padding: 15px 40px;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      text-align: center;
      min-width: 200px;
    }
    .action-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    @media (max-width: 768px) {
      .content-wrapper {
        flex-direction: column-reverse; /* Text bottom, Image top on mobile? Or standard stack */
        text-align: center;
        padding: 1rem;
      }
      
      /* In RTL column-reverse:
         1. Text
         2. Image
         
         Result: Image (top), Text (bottom).
      */
      
      .text-side {
        text-align: center;
        width: 100%;
      }
      
      .product-image {
        max-height: 300px;
        margin-bottom: 1rem;
      }
      
      .description {
        margin-left: auto;
        margin-right: auto;
      }
    }
  `;

  render() {
    const c = this.config || {};
    
    const topBg = c.top_bg_color || '#ffffff';
    const bottomBg = c.bottom_bg_color || '#fdf8f5';
    const bottomHeight = c.bottom_height_percent || 40;
    
    const title = c.main_title || '';
    const titleStart = c.title_gradient_start || '#8b4513';
    const titleEnd = c.title_gradient_end || '#cd853f';
    const titleSize = c.title_font_size || 36;
    
    const subtitle = c.subtitle || '';
    const subtitleColor = c.subtitle_color || '#5c3a21';
    
    const desc = c.description || '';
    const descColor = c.description_color || '#333333';
    
    const btnText = c.btn_text || '';
    const btnLink = c.btn_link || '#';
    const btnBg = c.btn_bg_color || '#000000';
    const btnTextColor = c.btn_text_color || '#ffffff';
    
    const imgSrc = c.product_image || 'https://cdn.salla.network/images/themes/default/placeholder.jpg';

    return html`
      <div class="container">
        <div class="background-layer">
          <div class="bg-top" style="background-color: ${topBg};"></div>
          <div class="bg-bottom" style="height: ${bottomHeight}%; background-color: ${bottomBg};"></div>
        </div>
        
        <div class="content-wrapper">
          <div class="text-side">
            <h2 class="main-title" style="
              background-image: linear-gradient(135deg, ${titleStart}, ${titleEnd});
              font-size: ${titleSize}px;
            ">
              ${title}
            </h2>
            
            ${subtitle ? html`
              <div class="subtitle" style="color: ${subtitleColor}">
                ${subtitle}
              </div>
            ` : ''}
            
            ${desc ? html`
              <div class="description" style="color: ${descColor}">
                ${desc}
              </div>
            ` : ''}
            
            ${btnText ? html`
              <a href="${btnLink}" class="action-btn" style="
                background-color: ${btnBg};
                color: ${btnTextColor};
              ">
                ${btnText}
              </a>
            ` : ''}
          </div>

          <div class="image-side">
             <img src="${imgSrc}" class="product-image" alt="${title}" />
          </div>
        </div>
      </div>
    `;
  }
}
