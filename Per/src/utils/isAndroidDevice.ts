/** True on Android phones/tablets (user agent), false on desktop, iOS, etc. */
export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}
