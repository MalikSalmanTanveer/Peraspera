import { isWebGLAvailable } from '../lib/webgl';

/**
 * Shown when WebGL is unavailable. Orientation gate removed — mobile stays portrait-friendly.
 */
export function IntroGates() {
  const webglSupported = isWebGLAvailable();

  return (
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
  );
}

export function introGatesAllowSite(): boolean {
  return isWebGLAvailable();
}
