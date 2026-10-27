/**
 * Repository Dependency Graph & PageRank Network Centrality Engine
 * Measures open source repository criticality using Markov chain random walks.
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export interface NetworkNode {
  id: string;
  name: string;
  stars: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
}

export interface PageRankResult {
  nodeId: string;
  rank: number;
  inDegree: number;
  outDegree: number;
  isCriticalDependency: boolean;
}

export class DependencyGraphEngine {
  private dampingFactor: number = 0.85;
  private maxIterations: number = 50;
  private convergenceTolerance: number = 0.0001;

  constructor(damping: number = 0.85, maxIter: number = 50) {
    this.dampingFactor = damping;
    this.maxIterations = maxIter;
  }

  /**
   * Computes PageRank centrality over dependency network
   */
  public computePageRank(nodes: NetworkNode[], edges: NetworkEdge[]): PageRankResult[] {
    const N = nodes.length;
    if (N === 0) return [];

    const nodeIds = nodes.map((n) => n.id);
    const ranks: Record<string, number> = {};
    const inDegree: Record<string, number> = {};
    const outDegree: Record<string, number> = {};
    const outgoingAdjacency: Record<string, string[]> = {};
    const incomingAdjacency: Record<string, string[]> = {};

    // Initialize state
    for (const id of nodeIds) {
      ranks[id] = 1.0 / N;
      inDegree[id] = 0;
      outDegree[id] = 0;
      outgoingAdjacency[id] = [];
      incomingAdjacency[id] = [];
    }

    // Build adjacency graphs
    for (const edge of edges) {
      if (outgoingAdjacency[edge.source] && incomingAdjacency[edge.target]) {
        outgoingAdjacency[edge.source].push(edge.target);
        incomingAdjacency[edge.target].push(edge.source);
        outDegree[edge.source] = (outDegree[edge.source] || 0) + 1;
        inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
      }
    }

    // Iterative power iteration
    for (let iter = 0; iter < this.maxIterations; iter++) {
      let maxDiff = 0;
      const nextRanks: Record<string, number> = {};

      let danglingRankSum = 0;
      for (const id of nodeIds) {
        if (outgoingAdjacency[id].length === 0) {
          danglingRankSum += ranks[id];
        }
      }

      for (const id of nodeIds) {
        let incomingRankSum = 0;
        for (const inboundId of incomingAdjacency[id]) {
          const numOutgoing = outgoingAdjacency[inboundId].length;
          if (numOutgoing > 0) {
            incomingRankSum += ranks[inboundId] / numOutgoing;
          }
        }

        const newRank =
          (1.0 - this.dampingFactor) / N +
          this.dampingFactor * (incomingRankSum + danglingRankSum / N);

        maxDiff = Math.max(maxDiff, Math.abs(newRank - ranks[id]));
        nextRanks[id] = newRank;
      }

      for (const id of nodeIds) {
        ranks[id] = nextRanks[id];
      }

      if (maxDiff < this.convergenceTolerance) {
        break;
      }
    }

    // Map into sorted results
    const results: PageRankResult[] = nodes.map((n) => {
      const score = ranks[n.id] || 0;
      return {
        nodeId: n.id,
        rank: Number(score.toFixed(6)),
        inDegree: inDegree[n.id] || 0,
        outDegree: outDegree[n.id] || 0,
        isCriticalDependency: score > (1.5 / N)
      };
    });

    results.sort((a, b) => b.rank - a.rank);
    return results;
  }

  /**
   * Extracts top central repositories from graph
   */
  public getTopCentralRepos(results: PageRankResult[], limit: number = 10): PageRankResult[] {
    return results.slice(0, limit);
  }
}

export const dependencyGraphEngine = new DependencyGraphEngine();
