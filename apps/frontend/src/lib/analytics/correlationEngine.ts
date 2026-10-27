/**
 * Developer Skill & Repository Synergy Correlation Engine
 * Measures mutual information and Pearson correlation between developer language vectors and repository requirements.
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export interface CorrelationMatrixResult {
  languageSynergy: number; // -1.0 to 1.0
  velocityAlignment: number; // 0.0 to 1.0
  topicAffinity: number; // 0.0 to 1.0
  overallSynergyIndex: number; // 0 to 100
}

export class CorrelationEngine {
  /**
   * Computes Pearson correlation coefficient between two equal-length numerical arrays
   */
  public static pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumX2 += x[i] * x[i];
      sumY2 += y[i] * y[i];
    }

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return Number((numerator / denominator).toFixed(4));
  }

  /**
   * Calculates multidimensional synergy index between a developer and a repository
   */
  public static computeSynergy(
    developerLanguages: Record<string, number>,
    repoLanguages: Record<string, number>,
    developerTopics: string[],
    repoTopics: string[]
  ): CorrelationMatrixResult {
    // 1. Language overlap
    const devKeys = Object.keys(developerLanguages);
    const repoKeys = Object.keys(repoLanguages);
    const allKeys = Array.from(new Set([...devKeys, ...repoKeys]));

    const devVector = allKeys.map((k) => developerLanguages[k] || 0);
    const repoVector = allKeys.map((k) => repoLanguages[k] || 0);

    const languageSynergy = this.pearsonCorrelation(devVector, repoVector);

    // 2. Topic affinity via Jaccard index
    const intersection = developerTopics.filter((t) => repoTopics.includes(t));
    const union = Array.from(new Set([...developerTopics, ...repoTopics]));
    const topicAffinity = union.length > 0 ? intersection.length / union.length : 0;

    // 3. Velocity alignment
    const velocityAlignment = Math.max(0, Math.min(1, (languageSynergy + 1) / 2));

    // 4. Overall composite synergy (0 - 100)
    const overallSynergyIndex = Math.round(
      velocityAlignment * 45 + topicAffinity * 35 + (intersection.length > 0 ? 20 : 0)
    );

    return {
      languageSynergy,
      velocityAlignment: Number(velocityAlignment.toFixed(3)),
      topicAffinity: Number(topicAffinity.toFixed(3)),
      overallSynergyIndex: Math.min(overallSynergyIndex, 100)
    };
  }
}
