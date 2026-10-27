/**
 * Repository Trending Velocity & Viral Momentum Scorer
 * Calculates real-time acceleration metrics from star growth, forks, and commit recency.
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export interface RepoVelocityMetrics {
  stars: number;
  forks: number;
  openIssues: number;
  daysSinceLastCommit: number;
  createdDaysAgo: number;
}

export interface VelocityScoreResult {
  velocityIndex: number; // 0 - 100
  momentumTier: 'Breakout' | 'High-Growth' | 'Steady' | 'Dormant';
  growthMultiplier: number;
  confidenceScore: number;
}

export class VelocityScorer {
  /**
   * Calculates viral momentum index using exponential time decay
   */
  public static calculateVelocity(metrics: RepoVelocityMetrics): VelocityScoreResult {
    const { stars, forks, daysSinceLastCommit, createdDaysAgo } = metrics;

    // Daily star acquisition rate
    const ageDays = Math.max(createdDaysAgo, 1);
    const starRatePerDay = stars / ageDays;

    // Recency decay factor (e^(-t / 14)) where t is days since last commit
    const recencyDecay = Math.exp(-Math.max(daysSinceLastCommit, 0) / 14);

    // Fork leverage ratio (forks / stars indicative of active developer tampering)
    const forkLeverage = stars > 0 ? Math.min((forks / stars) * 5, 2.0) : 1.0;

    // Raw acceleration index
    const rawScore = (starRatePerDay * 12 + forks * 0.4) * recencyDecay * forkLeverage;

    // Normalized sigmoid scale (0 - 100)
    const normalized = Math.min(Math.round(100 / (1 + Math.exp(-0.05 * (rawScore - 40)))), 100);

    let momentumTier: VelocityScoreResult['momentumTier'] = 'Dormant';
    if (normalized >= 80) {
      momentumTier = 'Breakout';
    } else if (normalized >= 55) {
      momentumTier = 'High-Growth';
    } else if (normalized >= 25) {
      momentumTier = 'Steady';
    }

    return {
      velocityIndex: normalized,
      momentumTier,
      growthMultiplier: Number((1 + (normalized / 100) * 2.5).toFixed(2)),
      confidenceScore: Number(Math.min(0.98, 0.6 + (stars / 5000) * 0.38).toFixed(2))
    };
  }
}
