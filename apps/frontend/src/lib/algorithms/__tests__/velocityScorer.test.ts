/**
 * Test Suite: Velocity Scorer
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

import { VelocityScorer, RepoVelocityMetrics } from '../velocityScorer';

describe('VelocityScorer', () => {
  it('correctly scores high-growth trending repositories', () => {
    const breakoutMetrics: RepoVelocityMetrics = {
      stars: 4500,
      forks: 620,
      openIssues: 15,
      daysSinceLastCommit: 1,
      createdDaysAgo: 14
    };

    const result = VelocityScorer.calculateVelocity(breakoutMetrics);
    expect(result.velocityIndex).toBeGreaterThan(70);
    expect(['Breakout', 'High-Growth']).toContain(result.momentumTier);
    expect(result.growthMultiplier).toBeGreaterThan(1.5);
  });

  it('penalizes abandoned or dormant repositories with exponential decay', () => {
    const dormantMetrics: RepoVelocityMetrics = {
      stars: 500,
      forks: 30,
      openIssues: 120,
      daysSinceLastCommit: 180,
      createdDaysAgo: 700
    };

    const result = VelocityScorer.calculateVelocity(dormantMetrics);
    expect(result.velocityIndex).toBeLessThan(35);
    expect(['Steady', 'Dormant']).toContain(result.momentumTier);
  });
});
