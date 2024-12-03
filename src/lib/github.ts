import { Octokit } from '@octokit/rest';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type UserResponse = RestEndpointMethodTypes["users"]["getByUsername"]["response"];
type ReposResponse = RestEndpointMethodTypes["repos"]["listForUser"]["response"];
type CommitsResponse = RestEndpointMethodTypes["repos"]["listCommits"]["response"];

class GitHubService {
  private static instance: GitHubService;
  public readonly octokit: Octokit;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  private constructor() {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
      console.error('GitHub token is not set in environment variables');
      throw new Error('GitHub token is not set in environment variables');
    }
    this.octokit = new Octokit({
      auth: token,
    });
  }

  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    for (let i = 0; i < this.MAX_RETRIES; i++) {
      try {
        return await operation();
      } catch (error: any) {
        console.error('GitHub API error:', error);
        lastError = error;
        if (error.status === 403) {
          // Rate limit exceeded, wait longer
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * Math.pow(2, i)));
        } else {
          throw error;
        }
      }
    }
    throw lastError;
  }

  private getCacheKey(method: string, params: any): string {
    return `${method}-${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getUserData(username: string): Promise<UserResponse> {
    const cacheKey = this.getCacheKey('getUserData', { username });
    const cached = this.getFromCache<UserResponse>(cacheKey);
    if (cached) return cached;

    const data = await this.retryOperation(() => 
      this.octokit.users.getByUsername({ username })
    );
    this.setCache(cacheKey, data);
    return data;
  }

  async getRepositories(username: string, options: any = {}): Promise<ReposResponse> {
    const cacheKey = this.getCacheKey('getRepositories', { username, ...options });
    const cached = this.getFromCache<ReposResponse>(cacheKey);
    if (cached) return cached;

    const data = await this.retryOperation(() => 
      this.octokit.repos.listForUser({ username, ...options })
    );
    this.setCache(cacheKey, data);
    return data;
  }

  async getRepositoryCommits(owner: string, repo: string, options: any = {}): Promise<CommitsResponse> {
    const cacheKey = this.getCacheKey('getRepositoryCommits', { owner, repo, ...options });
    const cached = this.getFromCache<CommitsResponse>(cacheKey);
    if (cached) return cached;

    const data = await this.retryOperation(() => 
      this.octokit.repos.listCommits({ owner, repo, ...options })
    );
    this.setCache(cacheKey, data);
    return data;
  }

  async isTokenValid(): Promise<boolean> {
    try {
      const response = await this.octokit.users.getAuthenticated();
      console.log('GitHub Authentication Success:', response.data.login);
      return true;
    } catch (error) {
      console.error('GitHub token validation error:', error);
      return false;
    }
  }
}

export const githubService = GitHubService.getInstance();
