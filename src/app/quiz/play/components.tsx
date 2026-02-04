import Link from 'next/link';
import { getSessionAge, type QuizSession } from '@/lib/quiz-session';

// Loading State Component
export function QuizLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] font-sans text-black">
      <div className="mb-4 text-2xl font-black">Loading your quiz...</div>
      <div className="size-12 animate-spin rounded-full border-4 border-black border-t-yellow-400"></div>
    </div>
  );
}

// Error State Component
export function QuizError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] font-sans text-black">
      <div className="mb-4 text-2xl font-black">Failed to load questions.</div>
      <Link href="/dashboard" className="font-bold underline">
        Go Back
      </Link>
    </div>
  );
}

// Resume Quiz Modal Component
interface ResumeQuizModalProps {
  session: QuizSession;
  onResume: () => void;
  onStartFresh: () => void;
}

export function ResumeQuizModal({ session, onResume, onStartFresh }: ResumeQuizModalProps) {
  const progress = Math.round(((session.currentIndex + 1) / session.questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-md rounded-3xl border-[3px] border-black bg-white p-8 text-center shadow-[8px_8px_0_#000]">
        <div className="mb-4 text-6xl">📝</div>
        <h2 className="mb-2 text-2xl font-black">Resume Quiz?</h2>
        <p className="mb-6 font-medium text-gray-500" suppressHydrationWarning>
          You have an unfinished quiz from {getSessionAge(session)}
        </p>

        {/* Quiz Info */}
        <div className="mb-6 rounded-2xl border-2 border-black bg-gray-50 p-4 text-left">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-bold text-gray-700">Category</span>
            <span className="max-w-[180px] truncate text-sm font-black">
              {session.questions[0]?.category}
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-bold text-gray-700">Progress</span>
            <span className="font-black">
              Question {session.currentIndex + 1} of {session.questions.length}
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-bold text-gray-700">Current Score</span>
            <span className="font-black text-green-600">{session.score} pts</span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 overflow-hidden rounded-full border border-black bg-gray-200">
            <div
              className="h-full bg-yellow-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 text-right text-sm font-bold text-gray-500">
            {progress}% complete
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="bg-accent flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-[3px] border-black py-4 text-lg font-bold shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]"
          >
            <span className="material-symbols-rounded">play_arrow</span>
            Continue Quiz
          </button>
          <button
            onClick={onStartFresh}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-[3px] border-black bg-white py-4 text-lg font-bold shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]"
          >
            <span className="material-symbols-rounded">restart_alt</span>
            Start Fresh
          </button>
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-gray-500 transition-colors hover:text-gray-700"
          >
            <span className="material-symbols-rounded text-lg">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Timer Component
interface QuizTimerProps {
  timeLeft: number;
}

export function QuizTimer({ timeLeft }: QuizTimerProps) {
  const isUrgent = timeLeft <= 5;

  return (
    <div className="relative z-20 mb-6 flex w-full flex-col items-center md:mb-0 md:w-auto md:items-start">
      <div
        className={`relative flex size-24 flex-col items-center justify-center rounded-full border-[3px] border-black shadow-[4px_4px_0_#000] md:size-36 ${isUrgent ? 'animate-pulse bg-red-100' : 'bg-[#fffbeb]'}`}
      >
        {/* Notification Badge */}
        <div className="absolute top-0 -right-2 rotate-12 rounded-xl border-[3px] border-black bg-pink-400 p-1.5 shadow-sm">
          <span className="material-symbols-rounded text-sm font-bold text-white md:text-lg">
            alarm
          </span>
        </div>

        <span
          className={`material-symbols-rounded mb-1 text-3xl md:text-5xl ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`}
        >
          hourglass_top
        </span>

        <span
          className={`text-2xl leading-none font-black md:text-4xl ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}
        >
          {timeLeft}s
        </span>
        <span
          className={`text-xs font-bold md:text-sm ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`}
        >
          {isUrgent ? 'Hurry!' : 'Time'}
        </span>
      </div>
    </div>
  );
}

// Progress Bar Component
interface QuizProgressBarProps {
  progress: number;
}

export function QuizProgressBar({ progress }: QuizProgressBarProps) {
  return (
    <div className="relative mb-12 w-full max-w-5xl">
      <div className="relative h-8 w-full overflow-visible rounded-full border-[3px] border-black bg-gray-200 shadow-[4px_4px_0_#000]">
        {/* Progress Fill */}
        <div
          className="flex h-full items-center justify-end rounded-l-full border-r-[3px] border-black bg-yellow-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Highlight/Shine Effect on bar */}
          <div className="absolute top-1 h-2 w-full rounded-full bg-white/30"></div>
        </div>

        {/* Current position marker */}
        <div
          className="absolute top-1/2 z-10 -translate-y-[85%] transition-all duration-500 ease-out"
          style={{ left: `calc(${progress}% - 24px)` }}
        >
          <div className="relative flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-xl border-2 border-black bg-gray-800 shadow-md">
              <span className="material-symbols-rounded text-2xl text-white">face</span>
            </div>
            {/* Downward arrow */}
            <div className="-mt-[2px] h-0 w-0 border-t-8 border-r-8 border-l-8 border-t-gray-800 border-r-transparent border-l-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Header Component
interface QuizHeaderProps {
  difficulty: string;
  category: string;
  score: number;
  type: 'multiple' | 'boolean';
  currentIndex: number;
  totalQuestions: number;
}

export function QuizHeader({
  difficulty,
  category,
  score,
  type,
  currentIndex,
  totalQuestions,
}: QuizHeaderProps) {
  return (
    <div className="mb-6 flex w-full max-w-5xl flex-col items-center justify-between gap-4 lg:flex-row">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 py-2 shadow-[2px_2px_0_#000] md:px-6 md:shadow-[4px_4px_0_#000]">
          <span className="material-symbols-rounded text-base text-yellow-400 md:text-2xl">
            stars
          </span>
          <span className="text-sm font-black capitalize md:text-lg">{difficulty || 'Medium'}</span>
        </div>

        {/* Category Badge */}
        <div className="flex items-center gap-2 rounded-full border-[3px] border-black bg-blue-100 px-3 py-2 shadow-[2px_2px_0_#000] md:px-4 md:shadow-[3px_3px_0_#000]">
          <span className="material-symbols-rounded text-xs text-blue-500 md:text-sm">
            category
          </span>
          <span className="max-w-[120px] truncate text-xs font-bold md:max-w-[150px] md:text-sm">
            {category}
          </span>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-2 rounded-full border-[3px] border-black bg-green-100 px-3 py-2 shadow-[2px_2px_0_#000] md:px-4 md:shadow-[3px_3px_0_#000]">
          <span className="material-symbols-rounded text-xs text-green-600 md:text-sm">
            emoji_events
          </span>
          <span className="text-xs font-bold md:text-sm">{score} pts</span>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-4 px-2 md:w-auto md:justify-end">
        {/* Question Type Badge */}
        <div
          className={`rounded-full border-2 border-black px-3 py-1 text-[10px] font-bold md:text-xs ${type === 'boolean' ? 'bg-purple-200' : 'bg-orange-200'}`}
        >
          {type === 'boolean' ? 'True/False' : 'Multiple Choice'}
        </div>
        <div className="text-lg font-black text-gray-800 md:text-xl">
          Question <span className="text-xl md:text-2xl">{currentIndex + 1}</span>{' '}
          <span className="text-base text-gray-400 md:text-lg">/{totalQuestions}</span>
        </div>
      </div>
    </div>
  );
}

// Question Bubble Component
interface QuizQuestionBubbleProps {
  question: string;
  decodeHtml: (html: string) => string;
}

export function QuizQuestionBubble({ question, decodeHtml }: QuizQuestionBubbleProps) {
  return (
    <div className="relative flex min-h-[120px] w-full items-center justify-center rounded-3xl border-[3px] border-black bg-white p-6 text-center shadow-[4px_4px_0_#000] md:min-h-[160px] md:rounded-4xl md:p-8 md:shadow-[6px_6px_0_#000]">
      {/* Speech Bubble Tail */}
      <div className="border-l-15px border-b-20px border-r-15px absolute top-0 left-1/2 h-0 w-0 -translate-x-1/2 -translate-y-[98%] border-r-transparent border-b-black border-l-transparent md:hidden"></div>
      <div className="border-l-12px border-b-16px border-r-12px absolute top-0 left-1/2 mt-[3px] h-0 w-0 -translate-x-1/2 -translate-y-[98%] border-r-transparent border-b-white border-l-transparent md:hidden"></div>

      <div className="border-t-15px border-r-20px border-b-15px absolute top-1/2 -left-4 hidden h-0 w-0 -translate-y-1/2 border-t-transparent border-r-black border-b-transparent md:block"></div>
      <div className="border-t-12px border-r-16px border-b-12px absolute top-1/2 -left-[13px] hidden h-0 w-0 -translate-y-1/2 border-t-transparent border-r-white border-b-transparent md:block"></div>

      <h2 className="text-lg leading-snug font-black text-gray-800 md:text-3xl">
        {decodeHtml(question)}
      </h2>
    </div>
  );
}

// Answer Option Component
import { QuizOption } from './use-quiz';

interface QuizAnswerOptionProps {
  option: QuizOption;
  isAnswered: boolean;
  isCorrectAnswer: boolean;
  isSelectedWrong: boolean;
  optionStyle: string;
  decodeHtml: (html: string) => string;
  onSelect: () => void;
}

export function QuizAnswerOption({
  option,
  isAnswered,
  isCorrectAnswer,
  isSelectedWrong,
  optionStyle,
  decodeHtml,
  onSelect,
}: QuizAnswerOptionProps) {
  return (
    <button
      onClick={onSelect}
      disabled={isAnswered}
      className={`group relative flex cursor-pointer items-center gap-4 rounded-3xl border-[3px] border-black px-6 py-4 shadow-[4px_4px_0_#000] transition-all ${optionStyle} ${!isAnswered ? 'hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:shadow-none' : ''} ${isAnswered ? 'cursor-default' : ''} `}
    >
      <div className="flex size-10 min-w-10 items-center justify-center rounded-full border-2 border-black bg-white text-lg font-black shadow-sm transition-transform group-hover:scale-110">
        {option.id}
      </div>
      <span className="text-left text-xl leading-tight font-bold text-gray-900">
        {decodeHtml(option.label)}
      </span>

      {/* Correct/Wrong indicator */}
      {isAnswered && isCorrectAnswer && (
        <span className="material-symbols-rounded ml-auto text-2xl text-green-700">
          check_circle
        </span>
      )}
      {isAnswered && isSelectedWrong && (
        <span className="material-symbols-rounded ml-auto text-2xl text-red-700">cancel</span>
      )}
    </button>
  );
}

// Summary Modal Component
interface QuizSummaryModalProps {
  isOpen: boolean;
  score: number;
  totalQuestions: number;
  percentage: number;
  message: string;
  emoji: string;
  earnedXP: number;
  onGoHome: () => void;
  onPlayAgain: () => void;
}

export function QuizSummaryModal({
  isOpen,
  score,
  totalQuestions,
  percentage,
  message,
  emoji,
  earnedXP,
  onGoHome,
  onPlayAgain,
}: QuizSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="animate-in fade-in zoom-in relative w-full max-w-md rounded-3xl border-[3px] border-black bg-white p-8 text-center shadow-[8px_8px_0_#000] duration-300">
        <div className="mb-4 text-7xl">{emoji}</div>
        <h2 className="mb-2 text-3xl font-black">{message}</h2>
        <p className="mb-4 font-medium text-gray-500">You&apos;ve completed the quiz!</p>

        {/* XP Earned Badge */}
        {earnedXP > 0 && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-yellow-500 bg-yellow-100 px-4 py-2">
            <span className="material-symbols-rounded text-yellow-600">bolt</span>
            <span className="font-black text-yellow-700">+{earnedXP} XP</span>
          </div>
        )}

        <div className="mb-6 rounded-2xl border-2 border-black bg-gray-50 p-6">
          <div className="mb-1 text-5xl font-black text-black">
            {score}/{totalQuestions}
          </div>
          <div className="mb-4 text-lg font-bold text-gray-500">Correct Answers</div>

          <div className="h-4 overflow-hidden rounded-full border-2 border-black bg-gray-200">
            <div
              className="bg-accent h-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-2 text-xl font-black">{percentage}%</div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onGoHome}
            className="bg-accent flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-[3px] border-black py-4 text-lg font-bold shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]"
          >
            <span className="material-symbols-rounded">home</span>
            Back to Home
          </button>
          <button
            onClick={onPlayAgain}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-[3px] border-black bg-white py-4 text-lg font-bold shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]"
          >
            <span className="material-symbols-rounded">replay</span>
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
