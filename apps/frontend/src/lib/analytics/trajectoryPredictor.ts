/**
 * Developer Career & Momentum Trajectory Predictor
 * Uses multi-epoch regression to predict developer growth, star acceleration, and milestone projections.
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export interface HistoricalDataPoint {
  date: string;
  stars: number;
  commitCount: number;
  followers: number;
}

export interface TrajectoryProjection {
  projectedStarsNextQuarter: number;
  projectedFollowersNextQuarter: number;
  velocityStatus: 'Exponential' | 'Linear' | 'Plateaued' | 'Volatile';
  confidenceInterval: {
    lowerBound: number;
    upperBound: number;
  };
  recommendedActions: string[];
}

export class TrajectoryPredictor {
  /**
   * Computes ordinary least squares linear regression across historic series
   */
  public static calculateSlope(values: number[]): { slope: number; intercept: number; rSquared: number } {
    const n = values.length;
    if (n < 2) return { slope: 0, intercept: values[0] || 0, rSquared: 0 };

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return { slope: 0, intercept: sumY / n, rSquared: 0 };

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared goodness of fit
    const meanY = sumY / n;
    let ssTotal = 0;
    let ssResidual = 0;

    for (let i = 0; i < n; i++) {
      const predictedY = slope * i + intercept;
      ssTotal += Math.pow(values[i] - meanY, 2);
      ssResidual += Math.pow(values[i] - predictedY, 2);
    }

    const rSquared = ssTotal === 0 ? 1 : Math.max(0, 1 - ssResidual / ssTotal);

    return { slope, intercept, rSquared };
  }

  /**
   * Projects developer metrics for next 90 days (1 quarter)
   */
  public static projectTrajectory(history: HistoricalDataPoint[]): TrajectoryProjection {
    if (history.length === 0) {
      return {
        projectedStarsNextQuarter: 0,
        projectedFollowersNextQuarter: 0,
        velocityStatus: 'Plateaued',
        confidenceInterval: { lowerBound: 0, upperBound: 0 },
        recommendedActions: ['Publish first open source repository to initiate trajectory tracking.']
      };
    }

    const starSeries = history.map((h) => h.stars);
    const followerSeries = history.map((h) => h.followers);

    const starRegression = this.calculateSlope(starSeries);
    const followerRegression = this.calculateSlope(followerSeries);

    const projectedSteps = 12; // 12 weeks = ~90 days
    const currentStars = starSeries[starSeries.length - 1];
    const currentFollowers = followerSeries[followerSeries.length - 1];

    const projectedStars = Math.max(
      Math.round(currentStars + starRegression.slope * projectedSteps),
      currentStars
    );
    const projectedFollowers = Math.max(
      Math.round(currentFollowers + followerRegression.slope * projectedSteps),
      currentFollowers
    );

    let velocityStatus: TrajectoryProjection['velocityStatus'] = 'Linear';
    if (starRegression.rSquared > 0.85 && starRegression.slope > 15) {
      velocityStatus = 'Exponential';
    } else if (starRegression.slope <= 1) {
      velocityStatus = 'Plateaued';
    } else if (starRegression.rSquared < 0.4) {
      velocityStatus = 'Volatile';
    }

    const marginOfError = Math.round(projectedStars * (1 - Math.min(starRegression.rSquared, 0.95)) * 0.3);

    const actions: string[] = [];
    if (velocityStatus === 'Exponential') {
      actions.push('Double down on AI tooling and active issue triage to maintain breakout velocity.');
      actions.push('Publish architectural breakdowns on GitWit communities.');
    } else if (velocityStatus === 'Plateaued') {
      actions.push('Refactor documentation and submit to trending topic hubs to increase discovery.');
    } else {
      actions.push('Maintain steady commit cadence across core primitives.');
    }

    return {
      projectedStarsNextQuarter: projectedStars,
      projectedFollowersNextQuarter: projectedFollowers,
      velocityStatus,
      confidenceInterval: {
        lowerBound: Math.max(currentStars, projectedStars - marginOfError),
        upperBound: projectedStars + marginOfError
      },
      recommendedActions: actions
    };
  }
}
