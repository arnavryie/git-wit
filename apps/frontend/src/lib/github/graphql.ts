/**
 * GitWit GitHub GraphQL Client & Typed Query Documents
 * Author: Gayatri Thorwe (@gayatrithorwe-sys)
 */

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; locations?: any[] }>;
}

export interface UserContributionGraphData {
  user: {
    contributionsCollection: {
      totalCommitContributions: number;
      totalPullRequestContributions: number;
      totalIssueContributions: number;
      totalRepositoryContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            contributionCount: number;
            date: string;
            weekday: number;
          }>;
        }>;
      };
    };
    repositories: {
      totalCount: number;
      nodes: Array<{
        name: string;
        stargazerCount: number;
        forkCount: number;
        primaryLanguage: {
          name: string;
          color: string;
        } | null;
        languages: {
          edges: Array<{
            size: number;
            node: {
              name: string;
              color: string;
            };
          }>;
        };
      }>;
    };
  };
}

export const USER_CONTRIBUTION_QUERY = `
  query GetUserContributionGraph($login: String!) {
    user(login: $login) {
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
      repositories(first: 20, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          name
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export class GitHubGraphQLClient {
  private endpoint = 'https://api.github.com/graphql';

  constructor(private token?: string) {}

  public async fetchUserContributions(login: string): Promise<UserContributionGraphData | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${this.token}`,
          'User-Agent': 'GitWit-GraphQL-Client/1.0'
        },
        body: JSON.stringify({
          query: USER_CONTRIBUTION_QUERY,
          variables: { login }
        })
      });

      if (!response.ok) return null;
      const json: GraphQLResponse<UserContributionGraphData> = await response.json();
      return json.data || null;
    } catch {
      return null;
    }
  }
}
