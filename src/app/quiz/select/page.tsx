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
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0_#000] hover:-translate-y-0.5 transition-transform"
          >
            <span className="material-symbols-rounded">arrow_back</span>
            Back
          </Link>
          <h1 className="text-3xl font-black text-black">Choose Your Quiz</h1>
          <div className="w-24"></div>
        </div>

        {/* Step 1: Category Selection */}
        <div className="mb-10">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-black">
            <span className="flex items-center justify-center size-10 rounded-full bg-accent text-black font-black text-lg border-2 border-black">1</span>
            Select Category
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {QUIZ_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl border-[3px] border-black transition-all cursor-pointer
                  ${selectedCategory?.id === category.id 
                    ? 'bg-primary shadow-[2px_2px_0_#000] -translate-y-1' 
                    : 'bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]'
                  }`}
              >
                <div className={`size-12 rounded-xl ${category.bgColor} flex items-center justify-center border-2 border-black`}>
                  <span className={`material-symbols-rounded text-2xl ${category.color}`}>{category.icon}</span>
                </div>
                <span className="text-xs font-bold text-center leading-tight text-gray-800 line-clamp-2">
                  {category.name.replace('Entertainment: ', '').replace('Science: ', '')}
                </span>
                
                {selectedCategory?.id === category.id && (
                  <div className="absolute -top-2 -right-2 size-6 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
                    <span className="material-symbols-rounded text-white text-sm">check</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Difficulty Selection */}
        <div className="mb-10">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-black">
            <span className="flex items-center justify-center size-10 rounded-full bg-secondary text-white font-black text-lg border-2 border-black">2</span>
            Select Difficulty <span className="text-gray-400 font-normal text-base">(Optional)</span>
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedDifficulty('')}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-[3px] border-black transition-all cursor-pointer
                ${selectedDifficulty === '' 
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
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-[3px] border-black transition-all cursor-pointer
                  ${selectedDifficulty === diff.id 
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
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-black">
            <span className="flex items-center justify-center size-10 rounded-full bg-[#e9d5ff] text-black font-black text-lg border-2 border-black">3</span>
            Number of Questions
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {[5, 10, 15, 20, 25].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex items-center justify-center size-16 rounded-2xl border-[3px] border-black font-black text-xl transition-all cursor-pointer
                  ${questionCount === count 
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
            className={`flex items-center gap-3 px-10 py-4 rounded-full border-[3px] border-black font-black text-xl transition-all
              ${selectedCategory 
                ? 'bg-primary shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] cursor-pointer' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
          >
            <span className="material-symbols-rounded text-2xl">play_arrow</span>
            Start Quiz
          </button>
        </div>

        {/* Selected Summary */}
        {selectedCategory && (
          <div className="mt-8 p-6 rounded-3xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] max-w-md mx-auto">
            <h3 className="font-black text-lg mb-3 text-black">Your Quiz Settings:</h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-bold">Category:</span> {selectedCategory.name}</p>
              <p><span className="font-bold">Difficulty:</span> {selectedDifficulty || 'Any'}</p>
              <p><span className="font-bold">Questions:</span> {questionCount}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
