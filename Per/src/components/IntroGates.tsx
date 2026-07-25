import { useEffect, useState } from 'react';
import { isWebGLAvailable } from '../lib/webgl';

/**
 * WebGL + orientation gates from befreaky.co intro gating.
 * Unsupported screen starts visible when WebGL is missing (class removed = shown).
 * Orientation trigger logic in the original bundle could not be fully isolated — see note in README response.
 */
export function IntroGates() {
  const [webglSupported] = useState(() => isWebGLAvailable());
  const [orientationBlocked, setOrientationBlocked] = useState(false);

  useEffect(() => {
    const evaluateOrientation = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      const portrait = window.matchMedia('(orientation: portrait)').matches;
      setOrientationBlocked(mobile && portrait);
    };

    evaluateOrientation();
    window.addEventListener('resize', evaluateOrientation);
    window.addEventListener('orientationchange', evaluateOrientation);

    return () => {
      window.removeEventListener('resize', evaluateOrientation);
      window.removeEventListener('orientationchange', evaluateOrientation);
    };
  }, []);

  return (
    <>
      <section
        className={`intro-gate intro-gate--unsupported ${webglSupported ? 'intro-gate--disabled' : ''}`}
        id="unsupported-screen"
        aria-live="polite"
      >
        <div className="intro-gate__wrapper">
          <h1 className="intro-gate__title">
            Sorry, this folio is not optimized
            <br />
            for your browser.
          </h1>
          <p className="intro-gate__description">
            Come back after you{' '}
            <a href="https://get.webgl.org/" target="_blank" rel="noreferrer">
              enable WebGL
            </a>{' '}
            for the full experience.
          </p>
        </div>
      </section>

      <section
        className={`intro-gate intro-gate--orientation ${orientationBlocked ? '' : 'intro-gate--disabled'}`}
        id="orientation-screen"
        aria-live="polite"
      >
        <div className="intro-gate__wrapper">
          <h1 className="intro-gate__title intro-gate__title--center">Please rotate your device</h1>
        </div>
      </section>
    </>
  );
}

export function introGatesAllowSite(): boolean {
  return isWebGLAvailable();
}
