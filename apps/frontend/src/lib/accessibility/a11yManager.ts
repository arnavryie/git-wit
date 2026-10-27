/**
 * GitWit Universal Accessibility & WCAG Compliance Engine
 * Focus trap helpers, ARIA live region announcers, and luminance contrast validation.
 * Author: Yukta Tapdiya (@yukta06tapdiya)
 */

export class AccessibilityManager {
  private static liveRegion: HTMLDivElement | null = null;

  /**
   * Initializes or retrieves an off-screen ARIA live region for screen readers
   */
  public static getLiveRegion(): HTMLDivElement | null {
    if (typeof document === 'undefined') return null;

    if (!this.liveRegion) {
      let el = document.getElementById('gitwit-a11y-live-region') as HTMLDivElement;
      if (!el) {
        el = document.createElement('div');
        el.id = 'gitwit-a11y-live-region';
        el.setAttribute('aria-live', 'polite');
        el.setAttribute('aria-atomic', 'true');
        el.style.position = 'absolute';
        el.style.width = '1px';
        el.style.height = '1px';
        el.style.padding = '0';
        el.style.margin = '-1px';
        el.style.overflow = 'hidden';
        el.style.clip = 'rect(0, 0, 0, 0)';
        el.style.whiteSpace = 'nowrap';
        el.style.border = '0';
        document.body.appendChild(el);
      }
      this.liveRegion = el;
    }
    return this.liveRegion;
  }

  /**
   * Announces dynamic content updates to assistive technologies
   */
  public static announce(message: string, assertive: boolean = false) {
    const region = this.getLiveRegion();
    if (region) {
      region.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
      region.textContent = '';
      setTimeout(() => {
        if (region) region.textContent = message;
      }, 50);
    }
  }

  /**
   * Computes relative luminance of hex color according to WCAG 2.1 specifications
   */
  public static getLuminance(hexColor: string): number {
    const cleanHex = hexColor.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    const sRGB = [r, g, b].map((val) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }

  /**
   * Calculates contrast ratio between two hex colors (e.g. text and background)
   */
  public static getContrastRatio(hex1: string, hex2: string): number {
    const lum1 = this.getLuminance(hex1);
    const lum2 = this.getLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
  }

  /**
   * Checks if contrast meets WCAG AA standards (4.5:1 for normal text, 3:1 for large)
   */
  public static isWcagCompliant(textHex: string, bgHex: string, isLargeText: boolean = false): boolean {
    const ratio = this.getContrastRatio(textHex, bgHex);
    return ratio >= (isLargeText ? 3.0 : 4.5);
  }
}
