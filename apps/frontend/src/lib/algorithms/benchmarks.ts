/**
 * GitWit Algorithm Performance Benchmarking Harness
 * Evaluates execution latency, memory footprint, and numerical stability across large-scale repositories.
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

import { VelocityScorer, RepoVelocityMetrics } from './velocityScorer';
import { SkillRadarEngine, DeveloperRawSignals } from './skillRadar';

export interface BenchmarkMetricsResult {
  operation: string;
  totalIterations: number;
  totalDurationMs: number;
  averageLatencyMs: number;
  opsPerSecond: number;
  memoryUsageMb: {
    heapUsed: number;
    heapTotal: number;
  };
}

export class AlgorithmBenchmarkHarness {
  /**
   * Generates synthetic repository signals for high-throughput stress testing
   */
  public static generateSyntheticRepo(index: number): RepoVelocityMetrics {
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const stars = Math.floor(pseudoRandom(index * 1.1) * 25000);
    const forks = Math.floor(stars * (0.05 + pseudoRandom(index * 1.3) * 0.25));
    const openIssues = Math.floor(pseudoRandom(index * 1.7) * 200);
    const daysSinceLastCommit = Math.floor(pseudoRandom(index * 2.3) * 60);
    const createdDaysAgo = Math.max(Math.floor(pseudoRandom(index * 3.1) * 1200), 10);

    return {
      stars,
      forks,
      openIssues,
      daysSinceLastCommit,
      createdDaysAgo
    };
  }

  /**
   * Generates synthetic developer profiles
   */
  public static generateSyntheticDeveloper(index: number): DeveloperRawSignals {
    const languagePool = ['TypeScript', 'Python', 'Rust', 'Go', 'C++', 'Java', 'Solidity', 'Zig'];
    const selectedLanguages = languagePool.slice(0, (index % languagePool.length) + 1);

    return {
      publicRepos: (index % 50) + 1,
      followers: (index * 7) % 1500,
      totalStars: (index * 23) % 10000,
      languages: selectedLanguages,
      hasAiProjects: index % 2 === 0,
      hasSystemLanguages: selectedLanguages.some((l) => ['Rust', 'C++', 'Go'].includes(l))
    };
  }

  /**
   * Benchmark velocity calculation across 10,000 iterations
   */
  public static benchmarkVelocityScorer(iterations: number = 10000): BenchmarkMetricsResult {
    const dataset = Array.from({ length: iterations }, (_, i) => this.generateSyntheticRepo(i));

    const startTime = performance.now();
    for (let i = 0; i < iterations; i++) {
      VelocityScorer.calculateVelocity(dataset[i]);
    }
    const durationMs = performance.now() - startTime;

    const memory = typeof process !== 'undefined' && process.memoryUsage ? process.memoryUsage() : { heapUsed: 0, heapTotal: 0 };

    return {
      operation: 'VelocityScorer.calculateVelocity',
      totalIterations: iterations,
      totalDurationMs: Number(durationMs.toFixed(2)),
      averageLatencyMs: Number((durationMs / iterations).toFixed(4)),
      opsPerSecond: Math.round(iterations / (durationMs / 1000)),
      memoryUsageMb: {
        heapUsed: Number((memory.heapUsed / 1024 / 1024).toFixed(2)),
        heapTotal: Number((memory.heapTotal / 1024 / 1024).toFixed(2))
      }
    };
  }

  /**
   * Benchmark skill radar across 10,000 iterations
   */
  public static benchmarkSkillRadar(iterations: number = 10000): BenchmarkMetricsResult {
    const dataset = Array.from({ length: iterations }, (_, i) => this.generateSyntheticDeveloper(i));

    const startTime = performance.now();
    for (let i = 0; i < iterations; i++) {
      SkillRadarEngine.computeRadar(dataset[i]);
    }
    const durationMs = performance.now() - startTime;

    const memory = typeof process !== 'undefined' && process.memoryUsage ? process.memoryUsage() : { heapUsed: 0, heapTotal: 0 };

    return {
      operation: 'SkillRadarEngine.computeRadar',
      totalIterations: iterations,
      totalDurationMs: Number(durationMs.toFixed(2)),
      averageLatencyMs: Number((durationMs / iterations).toFixed(4)),
      opsPerSecond: Math.round(iterations / (durationMs / 1000)),
      memoryUsageMb: {
        heapUsed: Number((memory.heapUsed / 1024 / 1024).toFixed(2)),
        heapTotal: Number((memory.heapTotal / 1024 / 1024).toFixed(2))
      }
    };
  }
}
