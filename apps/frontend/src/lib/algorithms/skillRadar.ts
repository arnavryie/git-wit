/**
 * Developer Multi-Dimensional Skill Radar Engine
 * Maps developer GitHub signals to a 6-axis mathematical competency radar:
 * - Systems Architecture
 * - Full-Stack Velocity
 * - Open Source Community Reach
 * - Code Quality & Rigor
 * - AI / Modern Primitives
 * - Concurrency & Scale
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export interface DeveloperRawSignals {
  publicRepos: number;
  followers: number;
  totalStars: number;
  languages: string[];
  hasAiProjects: boolean;
  hasSystemLanguages: boolean; // C, C++, Rust, Go
}

export interface SkillRadarAxes {
  systemsArchitecture: number;  // 0 - 100
  fullStackVelocity: number;    // 0 - 100
  openSourceReach: number;       // 0 - 100
  codeRigor: number;             // 0 - 100
  aiModernPrimitives: number;    // 0 - 100
  concurrencyScale: number;      // 0 - 100
}

export class SkillRadarEngine {
  public static computeRadar(signals: DeveloperRawSignals): SkillRadarAxes {
    const { publicRepos, followers, totalStars, languages, hasAiProjects, hasSystemLanguages } = signals;

    // 1. Systems Architecture
    const sysScore = hasSystemLanguages ? 85 : languages.includes('TypeScript') ? 70 : 50;

    // 2. Full-Stack Velocity
    const velocityScore = Math.min(Math.round((publicRepos * 3.5) + (languages.length * 8)), 95);

    // 3. Open Source Reach
    const reachScore = Math.min(Math.round(Math.log10(Math.max(followers + totalStars, 1)) * 25), 98);

    // 4. Code Rigor
    const rigorScore = Math.min(Math.round(60 + (languages.length > 2 ? 20 : 10) + (totalStars > 100 ? 15 : 0)), 96);

    // 5. AI / Modern Primitives
    const aiScore = hasAiProjects ? 92 : languages.includes('Python') ? 78 : 60;

    // 6. Concurrency & Scale
    const scaleScore = hasSystemLanguages ? 88 : totalStars > 500 ? 82 : 65;

    return {
      systemsArchitecture: Math.max(sysScore, 30),
      fullStackVelocity: Math.max(velocityScore, 40),
      openSourceReach: Math.max(reachScore, 25),
      codeRigor: Math.max(rigorScore, 50),
      aiModernPrimitives: Math.max(aiScore, 35),
      concurrencyScale: Math.max(scaleScore, 40)
    };
  }
}
