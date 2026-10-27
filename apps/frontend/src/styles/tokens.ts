/**
 * GitWit Universal Design Tokens
 * Harmonizes dark mode color scales, typography, and elevation across Web and Mobile.
 * Author: Yukta Tapdiya (@yukta06tapdiya)
 */

export const gitwitTheme = {
  colors: {
    background: {
      canvas: '#0d1117',
      surface: '#161b22',
      overlay: '#21262d',
      subtle: '#30363d'
    },
    border: {
      default: '#30363d',
      subtle: '#21262d',
      active: '#58a6ff',
      aiAccent: '#8957e5'
    },
    text: {
      primary: '#f0f6fc',
      secondary: '#8b949e',
      tertiary: '#6e7681',
      link: '#58a6ff',
      accent: '#bc8cff'
    },
    brand: {
      electricBlue: '#58a6ff',
      geminiPurple: '#8957e5',
      verifiedGreen: '#238636',
      warningOrange: '#d29922',
      dangerRed: '#f85149'
    }
  },
  typography: {
    fontMono: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
    fontSans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  }
} as const;
