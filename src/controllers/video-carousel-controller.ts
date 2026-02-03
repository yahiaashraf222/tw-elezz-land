import { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * Video carousel controller for Salla Twilight components.
 * Manages play/pause, single-active video, and fullscreen.
 * @see https://lit.dev/docs/composition/controllers/
 */
export class VideoCarouselController implements ReactiveController {
  host: ReactiveControllerHost;

  private itemElements: Array<{ item: HTMLElement; video: HTMLVideoElement; fullBtn: HTMLElement }> = [];

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  private requestFullScreen(el: HTMLVideoElement): void {
    const anyEl = el as unknown as { requestFullscreen?: () => Promise<void>; webkitRequestFullscreen?: () => Promise<void>; webkitEnterFullscreen?: () => void };
    if (anyEl.requestFullscreen) anyEl.requestFullscreen();
    else if (anyEl.webkitRequestFullscreen) anyEl.webkitRequestFullscreen();
    else if (anyEl.webkitEnterFullscreen) anyEl.webkitEnterFullscreen();
  }

  attach(
    container: HTMLElement,
    itemSelector: string,
    videoSelector: string,
    fullscreenBtnSelector: string
  ): void {
    this.itemElements = [];
    const items = container.querySelectorAll<HTMLElement>(itemSelector);
    items.forEach((item) => {
      const video = item.querySelector<HTMLVideoElement>(videoSelector);
      const fullBtn = item.querySelector<HTMLElement>(fullscreenBtnSelector);
      if (!video || !fullBtn) return;
      this.itemElements.push({ item, video, fullBtn });

      const handleClick = (e: Event): void => {
        const target = e.target as HTMLElement;
        if (target.closest(fullscreenBtnSelector)) {
          this.requestFullScreen(video);
          return;
        }
        if (video.paused) {
          this.itemElements.forEach(({ video: v }) => {
            if (v !== video) {
              v.pause();
              v.parentElement?.classList.remove("is-playing");
            }
          });
          video.play();
          item.classList.add("is-playing");
        } else {
          video.pause();
          item.classList.remove("is-playing");
        }
      };

      const handleDblClick = (e: Event): void => {
        e.preventDefault();
        this.requestFullScreen(video);
        if (video.paused) video.play();
      };

      item.onclick = handleClick;
      item.ondblclick = handleDblClick;
      video.onended = () => item.classList.remove("is-playing");
    });
  }

  hostUpdate(): void {}

  hostUpdated(): void {}
}
