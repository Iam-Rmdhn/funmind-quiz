import Link from 'next/link';
import { getSessionAge, type QuizSession } from '@/lib/quiz-session';

// Loading State Component
export function QuizLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-black font-sans">
      <div className="text-2xl font-black mb-4">Loading your quiz...</div>
      <div className="size-12 rounded-full border-4 border-black border-t-yellow-400 animate-spin"></div>
    </div>
  );
}

// Error State Component
export function QuizError() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-black font-sans">
      <div className="text-2xl font-black mb-4">Failed to load questions.</div>
      <Link href="/dashboard" className="underline font-bold">Go Back</Link>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f8fafc]">
      <div className="w-full max-w-md rounded-3xl border-[3px] border-black bg-white p-8 shadow-[8px_8px_0_#000] text-center">
        <div className="text-6xl mb-4">
          📝
        </div>
        <h2 className="text-2xl font-black mb-2">Resume Quiz?</h2>
        <p className="text-gray-500 font-medium mb-6" suppressHydrationWarning>
          You have an unfinished quiz from {getSessionAge(session)}
        </p>
        
        {/* Quiz Info */}
        <div className="rounded-2xl border-2 border-black bg-gray-50 p-4 mb-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gray-700">Category</span>
            <span className="font-black text-sm max-w-[180px] truncate">{session.questions[0]?.category}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gray-700">Progress</span>
            <span className="font-black">
              Question {session.currentIndex + 1} of {session.questions.length}
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gray-700">Current Score</span>
            <span className="font-black text-green-600">{session.score} pts</span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 rounded-full bg-gray-200 border border-black overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-sm font-bold text-gray-500 mt-1">{progress}% complete</div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-[3px] border-black bg-accent font-bold text-lg shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all cursor-pointer"
          >
            <span className="material-symbols-rounded">play_arrow</span>
            Continue Quiz
          </button>
          <button
            onClick={onStartFresh}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-[3px] border-black bg-white font-bold text-lg shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all cursor-pointer"
          >
            <span className="material-symbols-rounded">restart_alt</span>
            Start Fresh
          </button>
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-gray-500 font-bold hover:text-gray-700 transition-colors"
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
    <div className="flex flex-col items-center md:items-start relative z-20 w-full md:w-auto mb-6 md:mb-0">
      <div className={`relative flex flex-col items-center justify-center size-24 md:size-36 rounded-full border-[3px] border-black shadow-[4px_4px_0_#000] ${isUrgent ? 'bg-red-100 animate-pulse' : 'bg-[#fffbeb]'}`}>
        {/* Notification Badge */}
        <div className="absolute top-0 -right-2 rotate-12 bg-pink-400 border-[3px] border-black rounded-xl p-1.5 shadow-sm">
          <span className="material-symbols-rounded text-white text-sm md:text-lg font-bold">alarm</span>
        </div>

        <span className={`material-symbols-rounded text-3xl md:text-5xl mb-1 ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`}>hourglass_top</span>
        
        <span className={`text-2xl md:text-4xl font-black leading-none ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}>{timeLeft}s</span>
        <span className={`text-xs md:text-sm font-bold ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`}>
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
    <div className="w-full max-w-5xl mb-12 relative">
      <div className="h-8 w-full rounded-full border-[3px] border-black bg-gray-200 overflow-visible relative shadow-[4px_4px_0_#000]">
        {/* Progress Fill */}
        <div 
          className="h-full bg-yellow-400 rounded-l-full border-r-[3px] border-black transition-all duration-500 ease-out flex items-center justify-end"
          style={{ width: `${progress}%` }}
        >
          {/* Highlight/Shine Effect on bar */}
          <div className="h-2 w-full bg-white/30 absolute top-1 rounded-full"></div>
        </div>

        {/* Current position marker */}
        <div 
          className="absolute top-1/2 -translate-y-[85%] transition-all duration-500 ease-out z-10"
          style={{ left: `calc(${progress}% - 24px)` }}
        >
          <div className="relative flex flex-col items-center">
            <div className="size-12 rounded-xl bg-gray-800 border-2 border-black flex items-center justify-center shadow-md">
              <span className="material-symbols-rounded text-2xl text-white">face</span>
            </div>
            {/* Downward arrow */}
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-800 -mt-[2px]"></div>
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

export function QuizHeader({ difficulty, category, score, type, currentIndex, totalQuestions }: QuizHeaderProps) {
  return (
    <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 md:px-6 py-2 shadow-[2px_2px_0_#000] md:shadow-[4px_4px_0_#000]">
          <span className="material-symbols-rounded text-yellow-400 text-base md:text-2xl">stars</span>
          <span className="font-black text-sm md:text-lg capitalize">{difficulty || 'Medium'}</span>
        </div>
        
        {/* Category Badge */}
        <div className="flex items-center gap-2 rounded-full border-[3px] border-black bg-blue-100 px-3 md:px-4 py-2 shadow-[2px_2px_0_#000] md:shadow-[3px_3px_0_#000]">
          <span className="material-symbols-rounded text-blue-500 text-xs md:text-sm">category</span>
          <span className="font-bold text-xs md:text-sm max-w-[120px] md:max-w-[150px] truncate">{category}</span>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-2 rounded-full border-[3px] border-black bg-green-100 px-3 md:px-4 py-2 shadow-[2px_2px_0_#000] md:shadow-[3px_3px_0_#000]">
          <span className="material-symbols-rounded text-green-600 text-xs md:text-sm">emoji_events</span>
          <span className="font-bold text-xs md:text-sm">{score} pts</span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end px-2">
        {/* Question Type Badge */}
        <div className={`px-3 py-1 rounded-full border-2 border-black text-[10px] md:text-xs font-bold ${type === 'boolean' ? 'bg-purple-200' : 'bg-orange-200'}`}>
          {type === 'boolean' ? 'True/False' : 'Multiple Choice'}
        </div>
        <div className="font-black text-lg md:text-xl text-gray-800">
          Question <span className="text-xl md:text-2xl">{currentIndex + 1}</span> <span className="text-gray-400 text-base md:text-lg">/{totalQuestions}</span>
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
    <div className="relative w-full rounded-3xl md:rounded-4xl border-[3px] border-black bg-white p-6 md:p-8 shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000] min-h-[120px] md:min-h-[160px] flex items-center justify-center text-center">
      {/* Speech Bubble Tail */}
      <div className="absolute top-0 -translate-y-[98%] left-1/2 -translate-x-1/2 w-0 h-0 border-l-15px border-l-transparent border-b-20px border-b-black border-r-15px border-r-transparent md:hidden"></div>
      <div className="absolute top-0 -translate-y-[98%] left-1/2 -translate-x-1/2 w-0 h-0 border-l-12px border-l-transparent border-b-16px border-b-white border-r-12px border-r-transparent md:hidden mt-[3px]"></div>

      <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-0 h-0 border-t-15px border-t-transparent border-r-20px border-r-black border-b-15px border-b-transparent hidden md:block"></div>
      <div className="absolute top-1/2 -left-[13px] -translate-y-1/2 w-0 h-0 border-t-12px border-t-transparent border-r-16px border-r-white border-b-12px border-b-transparent hidden md:block"></div>

      <h2 className="text-lg md:text-3xl font-black text-gray-800 leading-snug">
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
  onSelect 
}: QuizAnswerOptionProps) {
  return (
    <button 
      onClick={onSelect}
      disabled={isAnswered}
      className={`group relative flex items-center gap-4 rounded-3xl border-[3px] border-black px-6 py-4 shadow-[4px_4px_0_#000] transition-all cursor-pointer
        ${optionStyle}
        ${!isAnswered ? 'hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:shadow-none' : ''}
        ${isAnswered ? 'cursor-default' : ''}
      `}
    >
      <div className="flex size-10 min-w-10 items-center justify-center rounded-full border-2 border-black bg-white text-lg font-black shadow-sm group-hover:scale-110 transition-transform">
        {option.id}
      </div>
      <span className="text-xl font-bold text-gray-900 text-left leading-tight">
        {decodeHtml(option.label)}
      </span>

      {/* Correct/Wrong indicator */}
      {isAnswered && isCorrectAnswer && (
        <span className="material-symbols-rounded text-2xl text-green-700 ml-auto">check_circle</span>
      )}
      {isAnswered && isSelectedWrong && (
        <span className="material-symbols-rounded text-2xl text-red-700 ml-auto">cancel</span>
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
  onPlayAgain 
}: QuizSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl border-[3px] border-black bg-white p-8 shadow-[8px_8px_0_#000] animate-in fade-in zoom-in duration-300 text-center">
        <div className="text-7xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-black mb-2">{message}</h2>
        <p className="text-gray-500 font-medium mb-4">You&apos;ve completed the quiz!</p>
        
        {/* XP Earned Badge */}
        {earnedXP > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-yellow-500 bg-yellow-100 mb-6">
            <span className="material-symbols-rounded text-yellow-600">bolt</span>
            <span className="font-black text-yellow-700">+{earnedXP} XP</span>
          </div>
        )}
        
        <div className="rounded-2xl border-2 border-black bg-gray-50 p-6 mb-6">
          <div className="text-5xl font-black text-black mb-1">{score}/{totalQuestions}</div>
          <div className="text-lg font-bold text-gray-500 mb-4">Correct Answers</div>
          
          <div className="h-4 rounded-full bg-gray-200 border-2 border-black overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-2 text-xl font-black">{percentage}%</div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onGoHome}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-[3px] border-black bg-accent font-bold text-lg shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all cursor-pointer"
          >
            <span className="material-symbols-rounded">home</span>
            Back to Home
          </button>
          <button
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-[3px] border-black bg-white font-bold text-lg shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all cursor-pointer"
          >
            <span className="material-symbols-rounded">replay</span>
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
