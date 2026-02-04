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
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl border-[3px] border-black bg-white p-6 shadow-[8px_8px_0_#000] animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 size-10 rounded-full border-2 border-black bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <span className="material-symbols-rounded">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`size-14 rounded-xl ${category.bgColor} flex items-center justify-center border-2 border-black`}>
            <span className={`material-symbols-rounded text-3xl ${category.color}`}>{category.icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-black">{category.name}</h2>
            <p className="text-sm text-gray-500">Configure your quiz</p>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-black">Difficulty</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty('')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black transition-all cursor-pointer
                ${selectedDifficulty === '' 
                  ? 'bg-accent shadow-[2px_2px_0_#000]' 
                  : 'bg-white shadow-[3px_3px_0_#000] hover:-translate-y-0.5'
                }`}
            >
              <span className="material-symbols-rounded text-gray-500 text-sm">shuffle</span>
              <span className="font-bold text-sm text-black">Any</span>
            </button>
            
            {DIFFICULTY_LEVELS.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black transition-all cursor-pointer
                  ${selectedDifficulty === diff.id 
                    ? 'bg-accent shadow-[2px_2px_0_#000]' 
                    : 'bg-white shadow-[3px_3px_0_#000] hover:-translate-y-0.5'
                  }`}
              >
                <span className={`material-symbols-rounded text-sm ${diff.color}`}>{diff.icon}</span>
                <span className="font-bold text-sm text-black">{diff.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-black">Questions</h3>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex items-center justify-center size-12 rounded-xl border-2 border-black font-black text-lg transition-all cursor-pointer
                  ${questionCount === count 
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
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-[3px] border-black bg-primary font-black text-lg shadow-[4px_4px_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] transition-all cursor-pointer"
        >
          <span className="material-symbols-rounded text-xl">play_arrow</span>
          Start Quiz
        </button>
      </div>
    </div>
  );
}
