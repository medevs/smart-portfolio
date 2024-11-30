import { NextResponse } from 'next/server';
import { githubService } from '@/lib/github';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type Repo = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME;
    console.log('GitHub Username:', username);
    
    if (!username) {
      console.error('GitHub username not found in environment variables');
      return NextResponse.json({ 
        error: 'GitHub username not configured',
        details: 'Username is not set in environment variables'
      }, { status: 400 });
    }

    // First validate the token
    try {
      const isValid = await githubService.isTokenValid();
      console.log('GitHub Token Valid:', isValid);
      
      if (!isValid) {
        return NextResponse.json({ 
          error: 'GitHub token is invalid or not set',
          details: 'Token validation failed'
        }, { status: 401 });
      }
    } catch (authError) {
      console.error('Token validation error:', authError);
      return NextResponse.json({ 
        error: 'GitHub authentication failed',
        details: authError instanceof Error ? authError.message : 'Unknown authentication error'
      }, { status: 401 });
    }

    const repos = await githubService.octokit.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 100
    });
    console.log('Fetched Repos Count:', repos.data.length); // Debug log

    // Get language stats
    const languageMap = new Map<string, number>();
    repos.data.forEach((repo: Repo) => {
      if (repo.language) {
        languageMap.set(
          repo.language,
          (languageMap.get(repo.language) || 0) + 1
        );
      }
    });

    const languages = Array.from(languageMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);

    // Get top repos by stars
    const topRepos = repos.data
      .filter((repo): repo is Required<Pick<Repo, 'name' | 'stargazers_count'>> & Repo => 
        repo.name !== undefined && repo.stargazers_count !== undefined
      )
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map(repo => ({
        name: repo.name,
        stars: repo.stargazers_count
      }));

    return NextResponse.json({
      languages,
      topRepos
    });
  } catch (error) {
    console.error('Error in /api/github/insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub insights' }, 
      { status: 500 }
    );
  }
}
