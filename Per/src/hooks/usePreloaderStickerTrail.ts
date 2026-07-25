import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';

const DESKTOP_THRESHOLD = 80;
const MOBILE_THRESHOLD = 20;

function getPointerPosition(event: MouseEvent | TouchEvent) {
  if ('touches' in event && event.touches[0]) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  return { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY };
}

function getDistance(
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Desktop mouse sticker trail from befreaky.co class `g8` (preloader mode).
 * Confirmed: threshold 80px, 0.8s power1.inOut move, 0.8s power3.inOut fade/scale.
 */
export function usePreloaderStickerTrail({
  stickerRefs,
  enabled,
}: {
  stickerRefs: RefObject<(HTMLElement | null)[]>;
  enabled: boolean;
}) {
  useEffect(() => {
    if (!enabled || window.innerWidth <= 768) {
      return;
    }

    const stickers = stickerRefs.current.filter(Boolean) as HTMLElement[];
    if (!stickers.length) {
      return;
    }

    const threshold = window.innerWidth > 768 ? DESKTOP_THRESHOLD : MOBILE_THRESHOLD;
    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cacheMousePos = { ...mousePos };
    const lastMousePos = { ...mousePos };
    let imgPosition = 0;
    let zIndexVal = 1;
    let canPlay = true;
    let frameId = 0;
    let rendering = false;

    stickers.forEach((sticker) => {
      gsap.set(sticker, { opacity: 0, scale: 1, x: 0, y: 0, rotation: 0 });
    });

    const showNextImage = () => {
      if (!canPlay) {
        return;
      }

      zIndexVal += 1;
      imgPosition = imgPosition < stickers.length - 1 ? imgPosition + 1 : 0;

      const sticker = stickers[imgPosition];
      const rect = sticker.getBoundingClientRect();
      const width = rect.width || 352;
      const height = rect.height || 352;

      let startRotation = (Math.atan2(20, 10) * 180) / Math.PI;
      if (Math.random() < 0.5) {
        startRotation = -startRotation;
      }

      gsap.killTweensOf(sticker);
      gsap
        .timeline()
        .set(sticker, { rotation: startRotation, duration: 0.1 }, 0)
        .fromTo(
          sticker,
          {
            opacity: 1,
            scale: 1,
            zIndex: zIndexVal,
            x: cacheMousePos.x - width / 2,
            y: cacheMousePos.y - height / 2,
          },
          {
            duration: 0.8,
            ease: 'power1.inOut',
            x: mousePos.x - width / 2,
            y: mousePos.y - height / 2,
          },
          '>',
        )
        .to(
          sticker,
          {
            duration: 0.8,
            ease: 'power3.inOut',
            opacity: 0,
            scale: 0.2,
          },
          0.4,
        );
    };

    const render = () => {
      const distance = getDistance(mousePos, lastMousePos);

      cacheMousePos.x = gsap.utils.interpolate(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
      cacheMousePos.y = gsap.utils.interpolate(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

      if (distance > threshold) {
        showNextImage();
        lastMousePos.x = mousePos.x;
        lastMousePos.y = mousePos.y;
      }

      frameId = window.requestAnimationFrame(render);
    };

    const startRender = () => {
      cacheMousePos.x = mousePos.x;
      cacheMousePos.y = mousePos.y;

      if (!rendering) {
        rendering = true;
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      Object.assign(mousePos, getPointerPosition(event));
    };

    const handleFirstMove = (event: MouseEvent | TouchEvent) => {
      Object.assign(mousePos, getPointerPosition(event));
      startRender();
      window.removeEventListener('mousemove', handleFirstMove);
      window.removeEventListener('touchmove', handleFirstMove);
    };

    window.addEventListener('mousemove', handleFirstMove);
    window.addEventListener('touchmove', handleFirstMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      canPlay = false;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleFirstMove);
      window.removeEventListener('touchmove', handleFirstMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      stickers.forEach((sticker) => gsap.killTweensOf(sticker));
    };
  }, [enabled, stickerRefs]);
}

/** Mobile timed sticker pop-ins from befreaky `animateStickers()`. */
export function animateMobilePreloaderStickers(
  stickers: HTMLElement[],
  duration: number,
) {
  if (window.innerWidth > 768 || !stickers.length) {
    return () => undefined;
  }

  const timeline = gsap.timeline();
  const keyframeDuration = 0.2;
  const staggerOffset = duration / stickers.length;

  stickers.forEach((sticker, index) => {
    gsap.set(sticker, { opacity: 1, zIndex: 2, scale: 1 });
    timeline.to(
      sticker,
      {
        keyframes: [
          { scale: 1.8, duration: keyframeDuration / 2 },
          { scale: 1, duration: keyframeDuration / 2, ease: 'power4.inOut' },
        ],
        opacity: 1,
        duration: keyframeDuration,
      },
      staggerOffset * index,
    );
  });

  return () => {
    timeline.kill();
  };
}

export function destroyPreloaderStickers(stickers: HTMLElement[]) {
  stickers.forEach((sticker) => gsap.killTweensOf(sticker));
}
