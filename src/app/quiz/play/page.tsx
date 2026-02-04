'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuiz } from './use-quiz';
import { getQuizSession, clearQuizSession, type QuizSession } from '@/lib/quiz-session';
import {
  QuizLoading,
  QuizError,
  QuizHeader,
  QuizProgressBar,
  QuizTimer,
  QuizQuestionBubble,
  QuizAnswerOption,
  QuizSummaryModal,
  ResumeQuizModal,
} from './components';

import { Suspense } from 'react';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get quiz parameters from URL
  const categoryId = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const amount = searchParams.get('amount') || '10';

  // Check for saved session on initial render
  const [savedSession] = useState<QuizSession | null>(() => {
    if (typeof window === 'undefined') return null;
    return getQuizSession();
  });
  
  // Resume state management
  const [showResumePrompt, setShowResumePrompt] = useState(!!savedSession);
  const [resumeSession, setResumeSession] = useState<QuizSession | null>(null);

  // Use custom hook for all quiz logic - ALWAYS call hooks unconditionally
  const quizData = useQuiz({ 
    categoryId: resumeSession?.categoryId ?? categoryId, 
    difficulty: resumeSession?.difficulty ?? difficulty, 
    amount: resumeSession?.amount ?? amount,
    resumeSession,
  });

  const {
    questions,
    currentIndex,
    loading,
    timeLeft,
    score,
    selectedAnswer,
    isAnswered,
    isQuizFinished,
    progress,
    currentQuestion,
    earnedXP,
    isResumed,
    handleAnswerClick,
    getOptionStyle,
    getQuizSummary,
    decodeHtml,
  } = quizData;

  // Handle resume decision
  const handleResume = () => {
    setResumeSession(savedSession);
    setShowResumePrompt(false);
  };

  const handleStartFresh = () => {
    clearQuizSession();
    setResumeSession(null);
    setShowResumePrompt(false);
  };

  // Show resume prompt if there's a saved session
  if (showResumePrompt && savedSession) {
    return (
      <ResumeQuizModal
        session={savedSession}
        onResume={handleResume}
        onStartFresh={handleStartFresh}
      />
    );
  }

  // Loading state
  if (loading) {
    return <QuizLoading />;
  }

  // Error state
  if (questions.length === 0 || !currentQuestion) {
    return <QuizError />;
  }

  // Get summary for modal
  const summary = getQuizSummary();

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 text-black font-sans md:p-8 flex flex-col items-center">
      
      {/* Resumed Badge */}
      {isResumed && (
        <div className="mb-4 px-4 py-2 rounded-full border-2 border-blue-500 bg-blue-100 text-blue-700 font-bold text-sm flex items-center gap-2">
          <span className="material-symbols-rounded text-lg">history</span>
          Resumed Quiz
        </div>
      )}
      
      {/* Header Section */}
      <QuizHeader
        difficulty={currentQuestion.difficulty}
        category={currentQuestion.category}
        score={score}
        type={currentQuestion.type}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
      />

      {/* Progress Bar Section */}
      <QuizProgressBar progress={progress} />

      {/* Main Game Area */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 relative">
        
        {/* Left: Timer */}
        <QuizTimer timeLeft={timeLeft} />

        {/* Right: Question & Answers */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* Question Bubble */}
          <QuizQuestionBubble 
            question={currentQuestion.question} 
            decodeHtml={decodeHtml} 
          />

          {/* Answer Options Grid */}
          <div className={`grid gap-4 mt-4 ${currentQuestion.type === 'boolean' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
            {currentQuestion.options.map((option) => (
              <QuizAnswerOption
                key={option.id}
                option={option}
                isAnswered={isAnswered}
                isCorrectAnswer={option.label === currentQuestion.correct_answer}
                isSelectedWrong={option.label === selectedAnswer && option.label !== currentQuestion.correct_answer}
                optionStyle={getOptionStyle(option)}
                decodeHtml={decodeHtml}
                onSelect={() => handleAnswerClick(option.label)}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Quiz Summary Modal */}
      <QuizSummaryModal
        isOpen={isQuizFinished}
        score={score}
        totalQuestions={questions.length}
        percentage={summary.percentage}
        message={summary.message}
        emoji={summary.emoji}
        earnedXP={earnedXP}
        onGoHome={() => router.push('/dashboard')}
        onPlayAgain={() => window.location.reload()}
      />

    </div>
  );
}

export default function QuizPlayPage() {
  return (
    <Suspense fallback={<QuizLoading />}>
      <QuizContent />
    </Suspense>
  );
}
