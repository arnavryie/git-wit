/**
 * GitHub API Resilient Rate Limiter & Backoff Engine
 * Prevents 403 Forbidden errors when fetching GitHub profiles and trending repos.
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export interface RateLimiterOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
}

export class GitHubRateLimiter {
  private static activeRequests = 0;
  private static maxConcurrent = 6;

  /**
   * Executes fetch with exponential backoff and rate limit header awareness
   */
  public static async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    config: RateLimiterOptions = {}
  ): Promise<Response> {
    const { maxRetries = 3, initialDelayMs = 600, maxDelayMs = 4000 } = config;
    let attempt = 0;

    while (this.activeRequests >= this.maxConcurrent) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    this.activeRequests++;

    try {
      while (attempt <= maxRetries) {
        attempt++;
        try {
          const response = await fetch(url, options);

          // If rate limited by GitHub
          if (response.status === 403 || response.status === 429) {
            const resetHeader = response.headers.get('x-ratelimit-reset');
            let waitTime = Math.min(initialDelayMs * Math.pow(2, attempt - 1), maxDelayMs);

            if (resetHeader) {
              const resetEpoch = parseInt(resetHeader, 10) * 1000;
              const delta = resetEpoch - Date.now();
              if (delta > 0 && delta < maxDelayMs) {
                waitTime = delta + 200;
              }
            }

            if (attempt > maxRetries) {
              return response;
            }

            await new Promise((res) => setTimeout(res, waitTime));
            continue;
          }

          return response;
        } catch (err) {
          if (attempt > maxRetries) throw err;
          await new Promise((res) => setTimeout(res, initialDelayMs * Math.pow(2, attempt - 1)));
        }
      }
      throw new Error(`Failed to fetch ${url} after ${maxRetries} attempts.`);
    } finally {
      this.activeRequests = Math.max(0, this.activeRequests - 1);
    }
  }
}
