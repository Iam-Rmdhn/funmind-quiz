'use client';

import { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { formatXP, xpStore } from '@/lib/xp-system';
import { getQuizStats, getQuizHistory } from '@/lib/quiz-history';
import { getCategoryByName } from '@/lib/quiz-categories';

const defaultStats = {
  totalQuizzes: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  averageScore: 0,
  bestScore: 0,
  favoriteCategory: null as string | null,
};

// Cached store for quiz data to ensure referential stability
let cachedStats = defaultStats;
let cachedHistory: ReturnType<typeof getQuizHistory> = [];

const quizDataStore = {
  subscribe(cb: () => void) {
    window.addEventListener('storage', cb);
    return () => window.removeEventListener('storage', cb);
  },
  getStatsSnapshot() {
    const fresh = getQuizStats();
    if (fresh.totalQuizzes !== cachedStats.totalQuizzes ||
        fresh.totalCorrect !== cachedStats.totalCorrect ||
        fresh.bestScore !== cachedStats.bestScore) {
      cachedStats = fresh;
    }
    return cachedStats;
  },
  getHistorySnapshot() {
    const fresh = getQuizHistory();
    if (fresh.length !== cachedHistory.length) {
      cachedHistory = fresh;
    }
    return cachedHistory;
  },
  getServerStats: () => defaultStats,
  getServerHistory: () => cachedHistory,
};

export default function StatsPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const userXP = useSyncExternalStore(
    xpStore.subscribe,
    xpStore.getSnapshot,
    xpStore.getServerSnapshot
  );

  const stats = useSyncExternalStore(quizDataStore.subscribe, quizDataStore.getStatsSnapshot, quizDataStore.getServerStats);
  const history = useSyncExternalStore(quizDataStore.subscribe, quizDataStore.getHistorySnapshot, quizDataStore.getServerHistory);

  // Calculate XP progress percentage
  const xpProgressPercent =
    userXP.xpToNextLevel > 0
      ? Math.min(Math.round((userXP.currentLevelXP / userXP.xpToNextLevel) * 100), 100)
      : 0;

  // Find best score entry
  const bestScoreEntry = history.length > 0
    ? history.reduce((best, item) => (item.percentage > best.percentage ? item : best), history[0])
    : null;

  // Calculate category stats for best category
  const categoryStats: Record<string, { played: number; totalPercent: number; totalCorrect: number }> = {};
  history.forEach((item) => {
    if (!categoryStats[item.category]) {
      categoryStats[item.category] = { played: 0, totalPercent: 0, totalCorrect: 0 };
    }
    categoryStats[item.category].played += 1;
    categoryStats[item.category].totalPercent += item.percentage;
    categoryStats[item.category].totalCorrect += item.correctAnswers;
  });

  // Sort categories by total quizzes played
  const sortedCategories = Object.entries(categoryStats)
    .map(([name, data]) => ({
      name,
      played: data.played,
      avgScore: Math.round(data.totalPercent / data.played),
      totalCorrect: data.totalCorrect,
      category: getCategoryByName(name),
    }))
    .sort((a, b) => b.played - a.played);

  const bestCategory = sortedCategories[0] || null;

  const displayName = profile?.username
    ? profile.username.charAt(0).toUpperCase() + profile.username.slice(1)
    : 'User';

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="flex min-h-screen flex-col bg-[#e0f5ea] font-sans text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#e0f5ea] px-4 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center rounded-xl border-[3px] border-black bg-white p-2 shadow-[4px_4px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#000] active:translate-y-1 active:shadow-none"
            aria-label="Back to dashboard"
          >
            <span className="material-symbols-rounded text-2xl">arrow_back</span>
          </button>
          <h1 className="text-3xl font-black">My Stats</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 space-y-6 px-4 pb-12 lg:px-8">
        {/* Profile Card */}
        <section className="overflow-hidden rounded-4xl border-[3px] border-black bg-white shadow-[6px_6px_0_#000]">
          <div className="relative bg-linear-to-br from-[#4fd1c5] to-[#38b2ac] px-6 py-8 md:px-8">
            {/* Decorative dots */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)',
              backgroundSize: '24px 24px',
            }} />

            <div className="relative z-10 flex flex-col items-center gap-5 md:flex-row md:items-start">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="size-24 border-4 border-white bg-yellow-200 shadow-lg md:size-28">
                  {profile?.avatar_url ? (
                    <AvatarImage
                      src={profile.avatar_url}
                      alt={profile?.username || 'Profile'}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-yellow-200 text-4xl font-black">
                      {profile?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -right-1 -bottom-1 flex size-10 items-center justify-center rounded-full border-[3px] border-white bg-[#facc15] font-black text-black shadow-md">
                  {userXP.level}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-black text-white drop-shadow-sm">{displayName}</h2>
                <p className="mt-1 font-semibold text-white/80">{user?.email || 'No email'}</p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
                    <span className="material-symbols-rounded text-base">calendar_month</span>
                    Member since {memberSince}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
                    <span className="material-symbols-rounded text-base">quiz</span>
                    {stats.totalQuizzes} quizzes played
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* XP & Level Section */}
        <section className="rounded-4xl border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#000] md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[#facc15] text-black">
              <span className="material-symbols-rounded">bolt</span>
            </div>
            <h2 className="text-2xl font-black">XP & Level</h2>
          </div>

          {/* Level badge + total XP */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border-[3px] border-black bg-linear-to-r from-[#facc15] to-[#f59e0b] px-5 py-2 shadow-[3px_3px_0_#000]">
              <span className="material-symbols-rounded text-xl">military_tech</span>
              <span className="text-lg font-black">Level {userXP.level}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-5 py-2 shadow-[3px_3px_0_#000]">
              <span className="material-symbols-rounded text-xl text-[#facc15]">bolt</span>
              <span className="text-lg font-black">{formatXP(userXP.totalXP)} XP Total</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-bold text-gray-600">
              <span>Progress to Level {userXP.level + 1}</span>
              <span>{userXP.currentLevelXP} / {userXP.xpToNextLevel} XP</span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-full border-[3px] border-black bg-gray-100">
              <div
                className="flex h-full items-center justify-end rounded-full bg-linear-to-r from-[#93f20d] to-[#6dd607] pr-2 transition-all duration-700 ease-out"
                style={{ width: `${Math.max(xpProgressPercent, 3)}%` }}
              >
                {xpProgressPercent >= 15 && (
                  <span className="text-xs font-black text-black">{xpProgressPercent}%</span>
                )}
              </div>
            </div>
            {xpProgressPercent < 15 && (
              <p className="text-xs font-bold text-gray-500">{xpProgressPercent}% complete</p>
            )}
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Best Score Card */}
          <section className="rounded-4xl border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#000]">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#fde68a] text-black">
                <span className="material-symbols-rounded">emoji_events</span>
              </div>
              <h2 className="text-2xl font-black">Best Score</h2>
            </div>

            {bestScoreEntry ? (
              <div className="space-y-4">
                {/* Score Display */}
                <div className="flex items-center justify-center">
                  <div className="relative flex size-32 flex-col items-center justify-center rounded-full border-4 border-black bg-linear-to-br from-[#facc15] to-[#f59e0b] shadow-[4px_4px_0_#000]">
                    <span className="text-4xl font-black">{bestScoreEntry.percentage}%</span>
                    <span className="text-xs font-bold text-black/60">Score</span>
                  </div>
                </div>

                {/* Best Score Details */}
                <div className="space-y-2 rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">Category</span>
                    <span className="text-sm font-bold">
                      {bestScoreEntry.category.replace('Entertainment: ', '').replace('Science: ', '')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">Difficulty</span>
                    <span className="text-sm font-bold capitalize">{bestScoreEntry.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">Correct</span>
                    <span className="text-sm font-bold">
                      {bestScoreEntry.correctAnswers}/{bestScoreEntry.totalQuestions}
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border-2 border-black bg-emerald-50 p-3 text-center shadow-[2px_2px_0_#000]">
                    <p className="text-2xl font-black text-emerald-600">{stats.averageScore}%</p>
                    <p className="text-xs font-bold text-gray-500">Avg Score</p>
                  </div>
                  <div className="rounded-xl border-2 border-black bg-blue-50 p-3 text-center shadow-[2px_2px_0_#000]">
                    <p className="text-2xl font-black text-blue-600">{stats.totalCorrect}</p>
                    <p className="text-xs font-bold text-gray-500">Total Correct</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="material-symbols-rounded mb-2 text-6xl text-gray-300">emoji_events</span>
                <p className="text-lg font-bold text-gray-400">No quizzes yet</p>
                <p className="text-sm font-medium text-gray-400">Play a quiz to see your best score!</p>
              </div>
            )}
          </section>

          {/* Best Category Card */}
          <section className="rounded-4xl border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#000]">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#e9d5ff] text-black">
                <span className="material-symbols-rounded">category</span>
              </div>
              <h2 className="text-2xl font-black">Best Category</h2>
            </div>

            {bestCategory ? (
              <div className="space-y-4">
                {/* Best Category Display */}
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className={`grid size-20 place-items-center rounded-full border-[3px] border-black ${bestCategory.category?.bgColor || 'bg-purple-100'} shadow-[3px_3px_0_#000]`}>
                    <span className={`material-symbols-rounded text-4xl ${bestCategory.category?.color || 'text-purple-500'}`}>
                      {bestCategory.category?.icon || 'star'}
                    </span>
                  </div>
                  <h3 className="text-center text-xl font-black">
                    {bestCategory.name.replace('Entertainment: ', '').replace('Science: ', '')}
                  </h3>
                  <p className="text-sm font-bold text-gray-500">Most played category</p>
                </div>

                {/* Category Stats */}
                <div className="space-y-2 rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">Times Played</span>
                    <span className="text-sm font-bold">{bestCategory.played} quizzes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">Average Score</span>
                    <span className="text-sm font-bold">{bestCategory.avgScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">Total Correct</span>
                    <span className="text-sm font-bold">{bestCategory.totalCorrect} answers</span>
                  </div>
                </div>

                {/* All categories played */}
                {sortedCategories.length > 1 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">All Categories</p>
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {sortedCategories.map((cat) => {
                        const catInfo = cat.category;
                        return (
                          <div
                            key={cat.name}
                            className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-2"
                          >
                            <div className={`grid size-8 place-items-center rounded-lg ${catInfo?.bgColor || 'bg-gray-100'}`}>
                              <span className={`material-symbols-rounded text-lg ${catInfo?.color || 'text-gray-500'}`}>
                                {catInfo?.icon || 'quiz'}
                              </span>
                            </div>
                            <span className="flex-1 text-sm font-bold">
                              {cat.name.replace('Entertainment: ', '').replace('Science: ', '')}
                            </span>
                            <span className="text-xs font-bold text-gray-500">{cat.played}x</span>
                            <span className="text-xs font-bold text-emerald-600">{cat.avgScore}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="material-symbols-rounded mb-2 text-6xl text-gray-300">category</span>
                <p className="text-lg font-bold text-gray-400">No categories yet</p>
                <p className="text-sm font-medium text-gray-400">Play quizzes to discover your strengths!</p>
              </div>
            )}
          </section>
        </div>

        {/* Quick Summary Row */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total Quizzes', value: stats.totalQuizzes, icon: 'quiz', bg: 'bg-blue-100', color: 'text-blue-600' },
            { label: 'Questions Answered', value: stats.totalQuestions, icon: 'help', bg: 'bg-purple-100', color: 'text-purple-600' },
            { label: 'Total Correct', value: stats.totalCorrect, icon: 'check_circle', bg: 'bg-emerald-100', color: 'text-emerald-600' },
            { label: 'Avg Score', value: `${stats.averageScore}%`, icon: 'trending_up', bg: 'bg-amber-100', color: 'text-amber-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5"
            >
              <div className={`mb-2 grid size-10 place-items-center rounded-xl ${stat.bg}`}>
                <span className={`material-symbols-rounded ${stat.color}`}>{stat.icon}</span>
              </div>
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-xs font-bold text-gray-500">{stat.label}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
