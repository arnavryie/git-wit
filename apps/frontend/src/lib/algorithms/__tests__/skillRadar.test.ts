/**
 * Test Suite: Skill Radar Engine
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

import { SkillRadarEngine, DeveloperRawSignals } from '../skillRadar';

describe('SkillRadarEngine', () => {
  it('identifies systems and AI focus for polyglot engineers', () => {
    const signals: DeveloperRawSignals = {
      publicRepos: 72,
      followers: 120,
      totalStars: 850,
      languages: ['TypeScript', 'Python', 'Rust', 'Go'],
      hasAiProjects: true,
      hasSystemLanguages: true
    };

    const axes = SkillRadarEngine.computeRadar(signals);
    expect(axes.systemsArchitecture).toBeGreaterThanOrEqual(80);
    expect(axes.aiModernPrimitives).toBeGreaterThanOrEqual(85);
    expect(axes.fullStackVelocity).toBeGreaterThan(75);
    expect(axes.concurrencyScale).toBeGreaterThanOrEqual(80);
  });
});
