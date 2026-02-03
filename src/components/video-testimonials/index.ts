import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { VideoCarouselController } from "../../controllers/video-carousel-controller.js";
import { getTitleGradientStyle } from "../../utils/gradient-title.js";

const DEFAULT_VIDEOS = [
  "https://custom.makaseb.tools/n1.mp4",
  "https://custom.makaseb.tools/n2.mp4",
  "https://custom.makaseb.tools/n3.mp4",
  "https://custom.makaseb.tools/n4.mp4",
];

/**
 * Salla Twilight component: video testimonials carousel.
 * Uses VideoCarouselController for play/pause/fullscreen.
 * Config: title, video_1_url .. video_4_url.
 */
export default class VideoTestimonials extends LitElement {
  @property({ type: Object })
  config?: Record<string, unknown>;

  set state(value: Record<string, unknown> | undefined) {
    this.config = value;
    this.requestUpdate();
  }

  private videoController = new VideoCarouselController(this);

  static registerSallaComponent(tagName: string): void {
    customElements.define(tagName, this);
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: inherit;
    }
    .custom-video-section {
      margin: 40px auto;
      padding: 0 15px;
      direction: rtl;
      text-align: center;
      max-width: 1200px;
    }
    .cvs-title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
      color: #000;
    }
    .cvs-carousel {
      display: flex;
      gap: 15px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding-bottom: 15px;
      -webkit-overflow-scrolling: touch;
    }
    .cvs-carousel::-webkit-scrollbar {
      display: none;
    }
    .cvs-item {
      flex: 0 0 85%;
      scroll-snap-align: center;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      position: relative;
      background: #000;
      cursor: pointer;
      touch-action: manipulation;
    }
    .cvs-video {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: 9 / 16;
      object-fit: cover;
    }
    .cvs-play-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      pointer-events: none;
      z-index: 2;
    }
    .cvs-play-btn svg {
      width: 25px;
      height: 25px;
      fill: #000;
      margin-left: 3px;
    }
    .cvs-fullscreen-btn {
      position: absolute;
      bottom: 15px;
      left: 15px;
      width: 35px;
      height: 35px;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .cvs-fullscreen-btn svg {
      width: 18px;
      height: 18px;
      fill: #fff;
    }
    .cvs-item.is-playing .cvs-play-btn {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    .cvs-item.is-playing .cvs-fullscreen-btn {
      opacity: 1;
    }
    @media (min-width: 768px) {
      .cvs-item {
        flex: 0 0 300px;
      }
    }
  `;

  private get videos(): string[] {
    const cfg = this.config ?? {};
    const urls: string[] = [];
    for (let i = 1; i <= 4; i++) {
      const key = `video_${i}_url`;
      const v = cfg[key];
      if (typeof v === "string" && v) urls.push(v);
    }
    return urls.length ? urls : DEFAULT_VIDEOS;
  }

  firstUpdated(): void {
    this.attachVideoHandlers();
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has("config")) {
      this.updateComplete.then(() => this.attachVideoHandlers());
    }
  }

  private attachVideoHandlers(): void {
    const root = this.shadowRoot;
    if (!root) return;
    const container = root.querySelector(".cvs-carousel");
    if (container instanceof HTMLElement) {
      this.videoController.attach(container, ".cvs-item", "video", ".cvs-fullscreen-btn");
    }
  }

  render() {
    const title = String(this.config?.title ?? "تجاربكم");
    const videos = this.videos;
    return html`
      <div class="custom-video-section">
        <h3 class="cvs-title" style="${getTitleGradientStyle(this.config, "title_") || "color: #000"}">${title}</h3>
        <div class="cvs-carousel">
          ${videos.map(
            (url) => html`
              <div class="cvs-item">
                <video class="cvs-video" playsinline preload="metadata">
                  <source src=${url} type="video/mp4" />
                </video>
                <div class="cvs-play-btn">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <button type="button" class="cvs-fullscreen-btn" aria-label="تكبير الفيديو">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
