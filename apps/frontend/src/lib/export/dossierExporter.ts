/**
 * Developer Dossier Exporter Utility
 * Generates formatted Markdown summaries and exportable JSON dossiers for resumes and portfolios.
 * Author: Yukta Tapdiya (@yukta06tapdiya)
 */

export interface DossierExportData {
  handle: string;
  name?: string;
  archetype: string;
  velocityScore: number;
  superpower: string;
  badges: string[];
  primaryLanguages: string[];
  topRepositories: Array<{
    name: string;
    stars: number;
    description: string;
  }>;
}

export class DossierExporter {
  /**
   * Generates a GitHub-flavored Markdown dossier document
   */
  public static toMarkdown(data: DossierExportData): string {
    const lines: string[] = [
      `# ⚔️ GitWit Developer Dossier: @${data.handle}`,
      `> **Archetype:** ${data.archetype} | **Velocity Index:** ${data.velocityScore}/100`,
      '',
      `### ⚡ Core Superpower`,
      `*${data.superpower}*`,
      '',
      `### 🏆 Verified Badges`,
      data.badges.map((b) => `- **${b}**`).join('\n'),
      '',
      `### 🛠️ Primary Tech Stack`,
      data.primaryLanguages.map((l) => `\`${l}\``).join(' • '),
      '',
      `### 🌟 Highlighted Repositories`,
      ...data.topRepositories.map(
        (r) => `- **${r.name}** (⭐ ${r.stars.toLocaleString()}): ${r.description}`
      ),
      '',
      `---`,
      `*Generated autonomously by [GitWit](https://git-wit.vercel.app) — The Social Layer GitHub Never Built.*`
    ];

    return lines.join('\n');
  }

  /**
   * Generates a clean JSON representation for developer API consumers
   */
  public static toJSON(data: DossierExportData): string {
    return JSON.stringify(
      {
        schemaVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        dossier: data
      },
      null,
      2
    );
  }
}
