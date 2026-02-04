'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, DIFFICULTY_LEVELS } from '@/lib/quiz-categories';

interface QuizSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function QuizSettingsModal({ isOpen, onClose, category }: QuizSettingsModalProps) {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [questionCount, setQuestionCount] = useState(10);

  if (!isOpen || !category) return null;

  const handleStartQuiz = () => {
    const params = new URLSearchParams({
      category: category.id.toString(),
      amount: questionCount.toString(),
    });

    if (selectedDifficulty) {
      params.append('difficulty', selectedDifficulty);
    }

    router.push(`/quiz/play?${params.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="animate-in fade-in zoom-in relative w-full max-w-md rounded-3xl border-[3px] border-black bg-white p-6 shadow-[8px_8px_0_#000] duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <span className="material-symbols-rounded">close</span>
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className={`size-14 rounded-xl ${category.bgColor} flex items-center justify-center border-2 border-black`}
          >
            <span className={`material-symbols-rounded text-3xl ${category.color}`}>
              {category.icon}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black text-black">{category.name}</h2>
            <p className="text-sm text-gray-500">Configure your quiz</p>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-bold text-black">Difficulty</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty('')}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 border-black px-4 py-2 transition-all ${
                selectedDifficulty === ''
                  ? 'bg-accent shadow-[2px_2px_0_#000]'
                  : 'bg-white shadow-[3px_3px_0_#000] hover:-translate-y-0.5'
              }`}
            >
              <span className="material-symbols-rounded text-sm text-gray-500">shuffle</span>
              <span className="text-sm font-bold text-black">Any</span>
            </button>

            {DIFFICULTY_LEVELS.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 border-black px-4 py-2 transition-all ${
                  selectedDifficulty === diff.id
                    ? 'bg-accent shadow-[2px_2px_0_#000]'
                    : 'bg-white shadow-[3px_3px_0_#000] hover:-translate-y-0.5'
                }`}
              >
                <span className={`material-symbols-rounded text-sm ${diff.color}`}>
                  {diff.icon}
                </span>
                <span className="text-sm font-bold text-black">{diff.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="mb-8">
          <h3 className="mb-3 text-lg font-bold text-black">Questions</h3>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex size-12 cursor-pointer items-center justify-center rounded-xl border-2 border-black text-lg font-black transition-all ${
                  questionCount === count
                    ? 'bg-accent shadow-[2px_2px_0_#000]'
                    : 'bg-white shadow-[3px_3px_0_#000] hover:-translate-y-0.5'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          className="bg-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-[3px] border-black py-4 text-lg font-black shadow-[4px_4px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000]"
        >
          <span className="material-symbols-rounded text-xl">play_arrow</span>
          Start Quiz
        </button>
      </div>
    </div>
  );
}
