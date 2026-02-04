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

// Separate component for the actual quiz game
function QuizGame({
  categoryId,
  difficulty,
  amount,
  resumeSession,
}: {
  categoryId: string | null;
  difficulty: string | null;
  amount: string;
  resumeSession: QuizSession | null;
}) {
  const router = useRouter();

  const quizData = useQuiz({
    categoryId: resumeSession?.categoryId ?? categoryId,
    difficulty: resumeSession?.difficulty ?? difficulty,
    amount: resumeSession?.amount ?? amount,
    resumeSession,
    paused: false,
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
    <div className="flex min-h-screen flex-col items-center bg-[#f8fafc] p-4 font-sans text-black md:p-8">
      {/* Resumed Badge */}
      {isResumed && (
        <div className="mb-4 flex items-center gap-2 rounded-full border-2 border-blue-500 bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
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
      <div className="relative grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
        {/* Left: Timer */}
        <QuizTimer timeLeft={timeLeft} />

        {/* Right: Question & Answers */}
        <div className="flex w-full flex-col gap-6">
          {/* Question Bubble */}
          <QuizQuestionBubble question={currentQuestion.question} decodeHtml={decodeHtml} />

          {/* Answer Options Grid */}
          <div
            className={`mt-4 grid gap-4 ${currentQuestion.type === 'boolean' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}
          >
            {currentQuestion.options.map((option) => (
              <QuizAnswerOption
                key={option.id}
                option={option}
                isAnswered={isAnswered}
                isCorrectAnswer={option.label === currentQuestion.correct_answer}
                isSelectedWrong={
                  option.label === selectedAnswer && option.label !== currentQuestion.correct_answer
                }
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

function QuizContent() {
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

  // Resume state management - 'decided' means user has made a choice
  const [decision, setDecision] = useState<'pending' | 'resume' | 'fresh'>(
    savedSession ? 'pending' : 'fresh'
  );

  // Handle resume decision
  const handleResume = () => {
    setDecision('resume');
  };

  const handleStartFresh = () => {
    clearQuizSession();
    setDecision('fresh');
  };

  // Show resume prompt if there's a saved session and user hasn't decided
  if (decision === 'pending' && savedSession) {
    return (
      <ResumeQuizModal
        session={savedSession}
        onResume={handleResume}
        onStartFresh={handleStartFresh}
      />
    );
  }

  // Render the quiz game with appropriate session
  // Using key to force remount when decision changes
  return (
    <QuizGame
      key={decision}
      categoryId={categoryId}
      difficulty={difficulty}
      amount={amount}
      resumeSession={decision === 'resume' ? savedSession : null}
    />
  );
}

export default function QuizPlayPage() {
  return (
    <Suspense fallback={<QuizLoading />}>
      <QuizContent />
    </Suspense>
  );
}
