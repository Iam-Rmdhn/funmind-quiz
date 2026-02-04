'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getQuizHistory, clearQuizHistory, formatHistoryDate, getQuizStats } from '@/lib/quiz-history';
import type { QuizHistoryItem } from '@/lib/quiz-history';

export default function HistoryPage() {
  const router = useRouter();
  
  // Use lazy initialization to load data from localStorage
  const [history, setHistory] = useState<QuizHistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    return getQuizHistory();
  });
  
  const [stats, setStats] = useState(() => {
    if (typeof window === 'undefined') return getQuizStats();
    return getQuizStats();
  });

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      clearQuizHistory();
      setHistory([]);
      setStats(getQuizStats());
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-200';
      case 'medium': return 'bg-yellow-200';
      case 'hard': return 'bg-red-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#e0f5ea] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center justify-center size-12 rounded-xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all cursor-pointer"
            >
              <span className="material-symbols-rounded">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-black text-black">Quiz History</h1>
              <p className="text-gray-600 font-medium">Your recent quiz results</p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-[3px] border-black bg-red-100 text-red-700 font-bold shadow-[3px_3px_0_#000] hover:-translate-y-1 transition-all cursor-pointer"
            >
              <span className="material-symbols-rounded text-lg">delete</span>
              Clear All
            </button>
          )}
        </div>

        {/* Stats Summary */}
        {stats && stats.totalQuizzes > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#000]">
              <div className="text-3xl font-black text-black">{stats.totalQuizzes}</div>
              <div className="text-sm font-bold text-gray-500">Quizzes Played</div>
            </div>
            <div className="rounded-2xl border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#000]">
              <div className="text-3xl font-black text-green-600">{stats.totalCorrect}</div>
              <div className="text-sm font-bold text-gray-500">Correct Answers</div>
            </div>
            <div className="rounded-2xl border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#000]">
              <div className="text-3xl font-black text-blue-600">{stats.averageScore}%</div>
              <div className="text-sm font-bold text-gray-500">Average Score</div>
            </div>
            <div className="rounded-2xl border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#000]">
              <div className="text-3xl font-black text-yellow-600">{stats.bestScore}%</div>
              <div className="text-sm font-bold text-gray-500">Best Score</div>
            </div>
          </div>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <div className="rounded-3xl border-[3px] border-black bg-white p-12 shadow-[6px_6px_0_#000] text-center">
            <span className="material-symbols-rounded text-6xl text-gray-300 mb-4">history</span>
            <h2 className="text-2xl font-black text-gray-700 mb-2">No Quiz History</h2>
            <p className="text-gray-500 font-medium mb-6">Start playing quizzes to see your history here!</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 rounded-full border-[3px] border-black bg-accent font-bold shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer"
            >
              Start a Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border-[3px] border-black bg-white p-5 shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Category & Meta */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-black text-lg text-black">{item.category}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border border-black capitalize ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold border border-black bg-purple-100">
                        {item.type === 'boolean' ? 'T/F' : item.type === 'multiple' ? 'MCQ' : 'Mixed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-rounded text-base">schedule</span>
                        {formatHistoryDate(item.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-rounded text-base">quiz</span>
                        {item.totalQuestions} questions
                      </span>
                    </div>
                  </div>

                  {/* Right: Score */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                          <span className="material-symbols-rounded text-lg">check_circle</span>
                          {item.correctAnswers}
                        </span>
                        <span className="flex items-center gap-1 text-red-500 font-bold">
                          <span className="material-symbols-rounded text-lg">cancel</span>
                          {item.wrongAnswers}
                        </span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xl ${getScoreColor(item.percentage)}`}>
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
