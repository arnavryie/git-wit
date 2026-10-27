/**
 * Code Churn & Refactoring Complexity Analyzer
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export interface FileChurnRecord {
  filePath: string;
  linesAdded: number;
  linesDeleted: number;
  changeFrequency: number;
}

export interface ChurnAnalysisSummary {
  totalFilesAnalyzed: number;
  netCodeGrowth: number;
  volatilityIndex: number; // 0 - 100
  highRiskHotspots: string[];
}

export class ChurnAnalyzer {
  public static analyzeChurn(records: FileChurnRecord[]): ChurnAnalysisSummary {
    let totalAdded = 0;
    let totalDeleted = 0;
    const hotspots: string[] = [];

    for (const rec of records) {
      totalAdded += rec.linesAdded;
      totalDeleted += rec.linesDeleted;

      // Identify files with high churn volatility
      const churnMagnitude = rec.linesAdded + rec.linesDeleted;
      if (churnMagnitude > 500 || rec.changeFrequency > 15) {
        hotspots.push(rec.filePath);
      }
    }

    const netGrowth = totalAdded - totalDeleted;
    const grossMovement = totalAdded + totalDeleted;
    const volatilityIndex = grossMovement > 0 ? Math.min(100, Math.round((grossMovement / 1000) * 15)) : 0;

    return {
      totalFilesAnalyzed: records.length,
      netCodeGrowth: netGrowth,
      volatilityIndex,
      highRiskHotspots: hotspots
    };
  }
}
