import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { sanitizeHtmlForDisplay } from "../../utils/sanitize.js";

export default class Customhtml extends LitElement {
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
    }
    .customhtml {
      display: block;
    }
  `;

  render() {
    const rawHtml = this.config?.html_code ?? "";
    const htmlCode = typeof rawHtml === "string" ? sanitizeHtmlForDisplay(rawHtml) : "";
    const rawCss = this.config?.css_code ?? "";
    const cssCode = typeof rawCss === "string" ? rawCss : "";

    return html`
      <div class="customhtml">
        ${cssCode ? html`<style>${cssCode}</style>` : ""}
        ${htmlCode ? unsafeHTML(htmlCode) : ""}
      </div>
    `;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("config") && typeof this.config?.js_code === "string" && this.config.js_code.trim()) {
      this.executeScript(this.config.js_code);
    }
  }

  /**
   * Runs trusted js_code from config. Only use with admin/trusted content; script runs in component scope.
   */
  executeScript(scriptContent: string): void {
    const oldScript = this.shadowRoot?.getElementById("custom-js");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = "custom-js";
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
