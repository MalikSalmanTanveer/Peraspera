import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PRELOADER_STICKER_IMAGES } from '../data/preloader-stickers';
import {
  animateMobilePreloaderStickers,
  destroyPreloaderStickers,
  usePreloaderStickerTrail,
} from '../hooks/usePreloaderStickerTrail';

interface OpeningAnimationProps {
  onComplete: () => void;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Confirmed in befreaky bundle: timelineDuration = 5 */
const TIMELINE_DURATION = 5;

/** Confirmed CustomEase: Hn.create("bezier","0.94, 0, 0.06, 1") */
const TE_EASE = 'power4.inOut';

const BANNER_TEXT = 'AVAILABLE FROM 18.05.2026';

function PreloaderBanner() {
  const items = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div className="preloader-banner" aria-hidden="true">
      <div className="preloader-banner__track">
        {[...items, ...items].map((item, index) => (
          <div key={`${item}-${index}`} className="preloader-banner__item">
            <span className="preloader-banner__text">{BANNER_TEXT}</span>
            <svg className="preloader-banner__circle" width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path
                d="M3.98906 7.91875C3.58437 7.91875 3.31094 7.53594 3.31094 7.04375C3.31094 6.77031 3.40937 6.35469 3.60625 5.79687C3.80312 5.22812 3.90156 4.68125 3.90156 4.1125C3.42031 4.40781 3.05938 4.71406 2.78594 5.02031C2.23906 5.63281 1.70313 6.23438 1.13437 6.23438C0.784375 6.23438 0.5 5.96094 0.5 5.63281C0.5 5.27187 0.795312 4.91094 1.44063 4.40781C2.09766 3.90469 2.66304 3.41304 3.98913 3.41304C5.33696 3.41304 5.94565 4.02174 5.94565 4.76087C5.94565 5.51087 5.33696 6.1087 4.6087 6.1087C4.33696 6.1087 4.09766 6.02174 3.90156 5.88043C3.70547 5.73913 3.54297 5.54348 3.42383 5.31522C3.30469 5.08696 3.23906 4.83696 3.23906 4.58696C3.23906 4.09766 3.42383 3.65217 3.77109 3.29348C4.11835 2.93478 4.58696 2.73913 5.09766 2.73913C5.6087 2.73913 6.06522 2.92391 6.40217 3.27109C6.73913 3.61835 6.92391 4.07609 6.92391 4.58696C6.92391 5.09766 6.72826 5.56522 6.36957 5.9125C6.01087 6.25977 5.56522 6.44453 5.07609 6.44453C4.58696 6.44453 4.1413 6.25977 3.78261 5.9125C3.42391 5.56522 3.23913 5.09766 3.23913 4.58696H3.98913C3.98913 5.5 4.58696 6.1087 5.31522 6.1087C6.04348 6.1087 6.6413 5.5 6.6413 4.76087C6.6413 4.03261 6.04348 3.41304 5.31522 3.41304C4.58696 3.41304 3.98913 4.03261 3.98913 4.76087C3.98913 5.5 4.58696 6.1087 5.31522 6.1087Z"
                fill="currentColor"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickerContentRef = useRef<HTMLDivElement>(null);
  const insideRef = useRef<HTMLDivElement>(null);
  const outsideRef = useRef<HTMLDivElement>(null);
  const squareContainerRef = useRef<HTMLDivElement>(null);
  const squareLeftRef = useRef<HTMLDivElement>(null);
  const squareRightRef = useRef<HTMLDivElement>(null);
  const numberLeftRef = useRef<HTMLSpanElement[]>([]);
  const numberRightRef = useRef<HTMLSpanElement[]>([]);
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [trailEnabled, setTrailEnabled] = useState(true);

  usePreloaderStickerTrail({
    stickerRefs,
    enabled: trailEnabled,
  });

  useEffect(() => {
    const root = rootRef.current;
    const inside = insideRef.current;
    const outside = outsideRef.current;
    const squareContainer = squareContainerRef.current;
    const squareLeft = squareLeftRef.current;
    const squareRight = squareRightRef.current;
    const stickers = stickerRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!root || !inside || !outside || !squareContainer || !squareLeft || !squareRight) {
      onComplete();
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      onComplete();
      return;
    }

    document.body.style.overflow = 'hidden';

    const counter = { perc: 0 };
    const isDesktop = window.innerWidth > 768;
    const digitCount = numberLeftRef.current.length || 10;
    const cleanupMobileStickers = animateMobilePreloaderStickers(stickers, TIMELINE_DURATION);

    const onLoadingUpdate = () => {
      const value = Math.ceil(counter.perc);
      const tens = Math.floor(value / 10);
      const ones = value % 10;
      const angle = -45 * (tens / 9);
      const yPercentTens = -(tens * 100) / digitCount;
      const yPercentOnes = -(ones * 100) / digitCount;

      if (value > 2) {
        gsap.set([...numberLeftRef.current, ...numberRightRef.current], { opacity: 1 });
      }

      if (value === 98) {
        gsap.set([inside, outside], { yPercent: '-100%', autoAlpha: 0, duration: 0.2, ease: TE_EASE });
      }

      gsap.set(inside, {
        xPercent: isDesktop ? -50 : 30,
        yPercent: yPercentTens,
        autoAlpha: 1,
        top: isDesktop ? `${angle}%` : `${angle - 10}%`,
        left: isDesktop ? '50%' : '70%',
      });

      gsap.set(outside, {
        yPercent: yPercentOnes,
        autoAlpha: 1,
        top: isDesktop ? `${angle - 65}%` : `${angle - 45}%`,
      });
    };

    const runExit = () => {
      setTrailEnabled(false);
      destroyPreloaderStickers(stickers);

      const timeline = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          onComplete();
        },
      });

      if (isDesktop) {
        timeline
          .to([inside, outside], { yPercent: '-100%', autoAlpha: 0, duration: 0.2, ease: TE_EASE }, 0)
          .to(squareRight, { width: 0, duration: 0.5, ease: TE_EASE }, '>')
          .to(
            squareLeft,
            {
              position: 'fixed',
              borderRadius: '50%',
              width: '1rem',
              height: '1rem',
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              duration: 0.3,
              ease: 'power2.out',
            },
            '<',
          )
          .to(
            squareContainer,
            { width: '1rem', height: '1rem', duration: 0.3, ease: 'power2.out', zIndex: 120 },
            '<',
          )
          .to(squareContainer, { borderRadius: '50%', duration: 0.5, ease: TE_EASE, zIndex: 120 }, '<')
          .to(root, { autoAlpha: 0, duration: 0.5, ease: TE_EASE }, '<');
      } else {
        timeline
          .to([inside, outside], { yPercent: '-100%', autoAlpha: 0, duration: 0.2, ease: TE_EASE }, 0)
          .to(stickers, { scale: 0, duration: 0.2, ease: TE_EASE, stagger: 0.05 }, 0)
          .to(squareRight, { width: 0, duration: 0.6, ease: TE_EASE }, '>')
          .to(squareContainer, { zIndex: 0, opacity: 0, duration: 0.6, ease: TE_EASE }, '<')
          .to(root, { autoAlpha: 0, duration: 0.6, ease: TE_EASE }, '>');
      }
    };

    const tween = gsap.to(counter, {
      perc: 99,
      duration: TIMELINE_DURATION,
      ease: 'linear',
      onUpdate: onLoadingUpdate,
      onComplete: runExit,
    });

    return () => {
      tween.kill();
      cleanupMobileStickers?.();
      destroyPreloaderStickers(stickers);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div ref={rootRef} className="preloader" role="status" aria-live="polite" aria-label="Loading">
      <div ref={stickerContentRef} className="preloader__stickers__container" aria-hidden="true">
        {PRELOADER_STICKER_IMAGES.map((image, index) => (
          <div
            key={image}
            ref={(node) => {
              stickerRefs.current[index] = node;
            }}
            className="preloader__stickers"
          >
            <div
              className="preloader__stickers__inner"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
        ))}
      </div>

      <div ref={squareContainerRef} className="preloader__square__container">
        <div ref={squareLeftRef} className="preloader__square__left__wrapper">
          <div ref={insideRef} className="preloader__number__left">
            {DIGITS.map((digit, index) => (
              <span
                key={digit}
                ref={(node) => {
                  if (node) numberLeftRef.current[index] = node;
                }}
                className="preloader__number__left__text"
              >
                {digit}
              </span>
            ))}
          </div>
        </div>
        <div ref={squareRightRef} className="preloader__square__right__wrapper">
          <div ref={outsideRef} className="preloader__number__right">
            {DIGITS.map((digit, index) => (
              <span
                key={digit}
                ref={(node) => {
                  if (node) numberRightRef.current[index] = node;
                }}
                className="preloader__number__right__text"
              >
                {digit}
              </span>
            ))}
          </div>
        </div>
      </div>

      <PreloaderBanner />
    </div>
  );
}

export function shouldShowOpeningAnimation(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}
