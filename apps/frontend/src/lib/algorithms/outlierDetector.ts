/**
 * Star Manipulation & Bot Activity Statistical Outlier Detector
 * Filters artificial velocity spikes using Interquartile Range (IQR) and Median Absolute Deviation (MAD).
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export interface AnomalyReport {
  isAnomaly: boolean;
  anomalyScore: number; // 0.0 - 1.0
  outlierType: 'Organic' | 'Suspicious Spike' | 'Star Farming' | 'Coordinated Burst';
  explanation: string;
}

export class OutlierDetector {
  /**
   * Calculates median of sorted numerical array
   */
  private static median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /**
   * Computes Median Absolute Deviation (MAD)
   */
  public static computeMAD(values: number[]): number {
    if (values.length === 0) return 0;
    const med = this.median(values);
    const deviations = values.map((v) => Math.abs(v - med));
    return this.median(deviations);
  }

  /**
   * Detects abnormal star velocity spikes compared to historical median
   */
  public static detectStarAnomaly(dailyStarIncrements: number[]): AnomalyReport {
    if (dailyStarIncrements.length < 5) {
      return {
        isAnomaly: false,
        anomalyScore: 0.1,
        outlierType: 'Organic',
        explanation: 'Insufficient historical sample window for anomaly thresholding.'
      };
    }

    const med = this.median(dailyStarIncrements);
    const mad = this.computeMAD(dailyStarIncrements);
    const latestValue = dailyStarIncrements[dailyStarIncrements.length - 1];

    // Standard modified Z-score using MAD: 0.6745 * (x - median) / MAD
    const modifiedZScore = mad > 0 ? (0.6745 * Math.abs(latestValue - med)) / mad : 0;

    let outlierType: AnomalyReport['outlierType'] = 'Organic';
    let isAnomaly = false;

    if (modifiedZScore > 5.0 && latestValue > 100) {
      isAnomaly = true;
      outlierType = latestValue > 500 ? 'Star Farming' : 'Coordinated Burst';
    } else if (modifiedZScore > 3.5) {
      isAnomaly = true;
      outlierType = 'Suspicious Spike';
    }

    const anomalyScore = Math.min(1.0, Number((modifiedZScore / 6.0).toFixed(2)));

    return {
      isAnomaly,
      anomalyScore,
      outlierType,
      explanation: isAnomaly
        ? `Observed daily velocity (${latestValue} stars) deviates significantly from median baseline (${med} stars, Z=${modifiedZScore.toFixed(1)}).`
        : 'Velocity pattern aligns with natural community adoption distributions.'
    };
  }
}
