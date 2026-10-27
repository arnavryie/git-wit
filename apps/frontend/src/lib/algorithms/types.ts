/**
 * Shared Type Definitions for Algorithmic & Scoring Primitives
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export type AlgorithmExecutionMode = 'realtime' | 'batch' | 'cached' | 'offline_mock';

export interface PerformanceTelemetry {
  executionDurationMs: number;
  cacheHit: boolean;
  algorithmVersion: string;
  timestamp: string;
}

export interface MetricThresholds {
  minVelocityForBreakout: number;
  maxAcceptableAnomalyScore: number;
  minConfidenceRatio: number;
}

export const DEFAULT_THRESHOLDS: MetricThresholds = {
  minVelocityForBreakout: 75.0,
  maxAcceptableAnomalyScore: 0.65,
  minConfidenceRatio: 0.8
};
