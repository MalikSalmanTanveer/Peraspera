/** Mirrors befreaky.co Device.isWebGLAvailable() canvas probe. */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    const canvas = document.createElement('canvas');
    return (
      !!window.WebGLRenderingContext &&
      !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
