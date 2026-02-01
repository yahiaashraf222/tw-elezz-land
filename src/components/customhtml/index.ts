import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

export default class Customhtml extends LitElement {
  @property({ type: Object })
  config?: Record<string, any>;

  static styles = css`
    :host {
      display: block;
    }
    .customhtml {
      display: block;
    }
  `;

  render() {
    const htmlCode = this.config?.html_code || '';
    const cssCode = this.config?.css_code || '';
    
    return html`
      <div class="customhtml">
        ${cssCode ? html`<style>${cssCode}</style>` : ''}
        ${htmlCode ? unsafeHTML(htmlCode) : ''}
      </div>
    `;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('config') && this.config?.js_code) {
      this.executeScript(this.config.js_code);
    }
  }

  executeScript(scriptContent: string) {
    // Remove old scripts to prevent duplicate execution if config changes
    const oldScript = this.shadowRoot?.getElementById('custom-js');
    if (oldScript) {
      oldScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'custom-js';
    script.textContent = `
      (function() {
        try {
          ${scriptContent}
        } catch (e) {
          console.error("Error in Custom HTML component script:", e);
        }
      })();
    `;
    this.shadowRoot?.appendChild(script);
  }
}
