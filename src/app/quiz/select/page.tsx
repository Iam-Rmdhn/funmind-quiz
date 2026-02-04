'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QUIZ_CATEGORIES, DIFFICULTY_LEVELS, Category } from '@/lib/quiz-categories';

export default function QuizSelectPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [questionCount, setQuestionCount] = useState(10);

  const handleStartQuiz = () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    const params = new URLSearchParams({
      category: selectedCategory.id.toString(),
      amount: questionCount.toString(),
    });

    if (selectedDifficulty) {
      params.append('difficulty', selectedDifficulty);
    }

    router.push(`/quiz/play?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5"
          >
            <span className="material-symbols-rounded">arrow_back</span>
            Back
          </Link>
          <h1 className="text-3xl font-black text-black">Choose Your Quiz</h1>
          <div className="w-24"></div>
        </div>

        {/* Step 1: Category Selection */}
        <div className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-black text-black">
            <span className="bg-accent flex size-10 items-center justify-center rounded-full border-2 border-black text-lg font-black text-black">
              1
            </span>
            Select Category
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {QUIZ_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`group relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-[3px] border-black p-4 transition-all ${
                  selectedCategory?.id === category.id
                    ? 'bg-primary -translate-y-1 shadow-[2px_2px_0_#000]'
                    : 'bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]'
                }`}
              >
                <div
                  className={`size-12 rounded-xl ${category.bgColor} flex items-center justify-center border-2 border-black`}
                >
                  <span className={`material-symbols-rounded text-2xl ${category.color}`}>
                    {category.icon}
                  </span>
                </div>
                <span className="line-clamp-2 text-center text-xs leading-tight font-bold text-gray-800">
                  {category.name.replace('Entertainment: ', '').replace('Science: ', '')}
                </span>

                {selectedCategory?.id === category.id && (
                  <div className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-black bg-green-500">
                    <span className="material-symbols-rounded text-sm text-white">check</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Difficulty Selection */}
        <div className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-black text-black">
            <span className="bg-secondary flex size-10 items-center justify-center rounded-full border-2 border-black text-lg font-black text-white">
              2
            </span>
            Select Difficulty{' '}
            <span className="text-base font-normal text-gray-400">(Optional)</span>
          </h2>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedDifficulty('')}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border-[3px] border-black px-6 py-3 transition-all ${
                selectedDifficulty === ''
                  ? 'bg-accent shadow-[2px_2px_0_#000]'
                  : 'bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1'
              }`}
            >
              <span className="material-symbols-rounded text-gray-500">shuffle</span>
              <span className="font-bold text-black">Any</span>
            </button>

            {DIFFICULTY_LEVELS.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-[3px] border-black px-6 py-3 transition-all ${
                  selectedDifficulty === diff.id
                    ? 'bg-accent shadow-[2px_2px_0_#000]'
                    : 'bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1'
                }`}
              >
                <span className={`material-symbols-rounded ${diff.color}`}>{diff.icon}</span>
                <span className="font-bold text-black">{diff.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Question Count */}
        <div className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-black text-black">
            <span className="flex size-10 items-center justify-center rounded-full border-2 border-black bg-[#e9d5ff] text-lg font-black text-black">
              3
            </span>
            Number of Questions
          </h2>

          <div className="flex flex-wrap gap-3">
            {[5, 10, 15, 20, 25].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex size-16 cursor-pointer items-center justify-center rounded-2xl border-[3px] border-black text-xl font-black transition-all ${
                  questionCount === count
                    ? 'bg-accent shadow-[2px_2px_0_#000]'
                    : 'bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStartQuiz}
            disabled={!selectedCategory}
            className={`flex items-center gap-3 rounded-full border-[3px] border-black px-10 py-4 text-xl font-black transition-all ${
              selectedCategory
                ? 'bg-primary cursor-pointer shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000]'
                : 'cursor-not-allowed bg-gray-200 text-gray-400 shadow-none'
            }`}
          >
            <span className="material-symbols-rounded text-2xl">play_arrow</span>
            Start Quiz
          </button>
        </div>

        {/* Selected Summary */}
        {selectedCategory && (
          <div className="mx-auto mt-8 max-w-md rounded-3xl border-[3px] border-black bg-white p-6 shadow-[4px_4px_0_#000]">
            <h3 className="mb-3 text-lg font-black text-black">Your Quiz Settings:</h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-bold">Category:</span> {selectedCategory.name}
              </p>
              <p>
                <span className="font-bold">Difficulty:</span> {selectedDifficulty || 'Any'}
              </p>
              <p>
                <span className="font-bold">Questions:</span> {questionCount}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
