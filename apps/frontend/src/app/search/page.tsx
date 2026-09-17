import React from 'react';
import Link from 'next/link';
import { searchRepos, getGitHubUser } from '@/lib/github-api';
import { formatNumber } from '@/lib/utils';
import LanguageDot from '@/components/shared/LanguageDot';
import { Search as SearchIcon, User, Sparkles, ArrowRight } from 'lucide-react';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();
  const cleanUsername = query.replace(/^@/, '');

  let results: any[] = [];
  let userProfile: any = null;

  if (query) {
    const promises: Promise<any>[] = [
      searchRepos(cleanUsername).catch(() => []),
    ];

    // If query is a single word, try fetching GitHub user profile
    if (!cleanUsername.includes(' ')) {
      promises.push(getGitHubUser(cleanUsername).catch(() => null));
    }

    const [reposData, userData] = await Promise.all(promises);
    results = reposData || [];
    userProfile = userData || null;
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto flex flex-col gap-6">
      <div className="border-b border-gh-border pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <SearchIcon className="w-5 h-5 text-gh-muted" />
          <span>Search results</span>
        </h2>
        {query && <p className="text-xs text-gh-muted mt-1">Showing results for &quot;{query}&quot;</p>}
      </div>

      {/* Matching Developer Profile Card */}
      {userProfile && (
        <div className="p-5 bg-gradient-to-r from-purple-950/40 to-blue-950/30 border border-purple-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <img
              src={userProfile.avatar}
              alt={userProfile.displayName}
              className="w-14 h-14 rounded-full border border-purple-500/50 bg-gh-surface shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{userProfile.displayName}</h3>
                <span className="text-xs text-purple-300 font-mono">@{userProfile.username}</span>
              </div>
              {userProfile.bio && (
                <p className="text-xs text-gh-muted mt-1 line-clamp-1 max-w-md">{userProfile.bio}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-gh-muted mt-1.5">
                <span><strong className="text-white">{formatNumber(userProfile.followers || 0)}</strong> followers</span>
                <span>•</span>
                <span><strong className="text-white">{userProfile.publicRepos || 0}</strong> public repos</span>
              </div>
            </div>
          </div>

          <Link
            href={`/profile/${userProfile.username}`}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View Profile &amp; AI Dossier</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      )}

      {!query ? (
        <div className="text-center py-12 text-gh-muted text-sm">Type something in the search bar above.</div>
      ) : results.length === 0 && !userProfile ? (
        <div className="text-center py-12 border border-gh-border bg-gh-surface rounded-md text-gh-muted text-sm">
          No repositories or users found for &quot;{query}&quot;.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.length > 0 && (
            <h4 className="text-xs font-semibold text-gh-muted uppercase tracking-wider mb-1">Repositories</h4>
          )}
          {results.map((repo) => (
            <Link
              key={repo.id}
              href={`/repo/${repo.owner}/${repo.name}`}
              className="gh-card p-4 flex flex-col gap-2 hover:border-gh-blue transition-colors"
            >
              <div className="flex items-center gap-2">
                <img src={repo.avatarUrl} className="w-5 h-5 rounded" alt="" />
                <span className="text-gh-blue font-semibold text-sm">{repo.owner}/{repo.name}</span>
              </div>
              {repo.description && <p className="text-gh-muted text-sm">{repo.description}</p>}
              <div className="flex items-center gap-4 text-xs text-gh-muted">
                {repo.language !== "Unknown" && <LanguageDot language={repo.language} />}
                <span className="mono">★ {formatNumber(repo.stars)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
