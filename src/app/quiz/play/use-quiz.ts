'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { saveQuizResult } from '@/lib/quiz-history';
import { addXP, calculateQuizXP } from '@/lib/xp-system';
import { saveQuizSession, clearQuizSession, type QuizSession } from '@/lib/quiz-session';

// Types
export interface OpenTDBQuestion {
  type: 'multiple' | 'boolean';
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizOption {
  id: string;
  label: string;
  color: string;
}

export interface QuizQuestion {
  type: 'multiple' | 'boolean';
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  options: QuizOption[];
}

export interface QuizSummary {
  percentage: number;
  message: string;
  emoji: string;
}

export interface UseQuizParams {
  categoryId: string | null;
  difficulty: string | null;
  amount: string;
  resumeSession?: QuizSession | null;
  paused?: boolean;
}

export interface UseQuizReturn {
  // State
  questions: QuizQuestion[];
  currentIndex: number;
  loading: boolean;
  timeLeft: number;
  score: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  isQuizFinished: boolean;
  progress: number;
  currentQuestion: QuizQuestion | null;
  earnedXP: number;
  isResumed: boolean;

  // Actions
  handleAnswerClick: (selectedLabel: string) => void;
  getOptionStyle: (option: QuizOption) => string;
  getQuizSummary: () => QuizSummary;
  decodeHtml: (html: string) => string;
}

// Colors for multiple choice (4 options)
const MULTIPLE_CHOICE_COLORS = ['bg-[#fef08a]', 'bg-[#fca5a5]', 'bg-[#86efac]', 'bg-[#fdba74]'];
const BOOLEAN_COLORS = ['bg-[#86efac]', 'bg-[#fca5a5]'];

export function useQuiz({
  categoryId,
  difficulty,
  amount,
  resumeSession,
  paused,
}: UseQuizParams): UseQuizReturn {
  // total duration based on question count
  const getTotalTime = (questionCount: number): number => {
    switch (questionCount) {
      case 5:
        return 3 * 60;
      case 10:
        return 7 * 60;
      case 15:
        return 12 * 60;
      case 20:
        return 15 * 60;
      default:
        return questionCount * 45;
    }
  };

  // Initialize state from resume session if available
  const [questions, setQuestions] = useState<QuizQuestion[]>(resumeSession?.questions || []);
  const [currentIndex, setCurrentIndex] = useState(resumeSession?.currentIndex || 0);
  const [timeLeft, setTimeLeft] = useState(
    resumeSession?.timeLeft || getTotalTime(parseInt(amount))
  );
  const [loading, setLoading] = useState(!resumeSession);
  const [score, setScore] = useState(resumeSession?.score || 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  // Derived state for isResumed (only show if we haven't advanced past the resumed point)
  const isResumed = !!resumeSession && currentIndex === resumeSession.currentIndex;

  const startedAt = useRef(resumeSession?.startedAt || new Date().toISOString());

  // Calculate earned XP (derived from score and difficulty)
  const earnedXP = isQuizFinished ? calculateQuizXP(difficulty || 'any', score) : 0;

  // Derived state
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const currentQuestion = questions.length > 0 ? questions[currentIndex] : null;

  // Save session to localStorage whenever state changes (for resume feature)
  const saveCurrentSession = useCallback(() => {
    if (questions.length > 0 && !isQuizFinished && !isAnswered) {
      saveQuizSession({
        categoryId,
        difficulty,
        amount,
        questions,
        currentIndex,
        score,
        timeLeft,
        startedAt: startedAt.current,
      });
    }
  }, [
    questions,
    currentIndex,
    score,
    timeLeft,
    isQuizFinished,
    isAnswered,
    categoryId,
    difficulty,
    amount,
  ]);

  // Save session on page unload/hide and track page visibility for timer
  useEffect(() => {
    const handleSaveSession = () => {
      saveCurrentSession();
    };

    // Desktop: beforeunload fires when closing tab/window
    window.addEventListener('beforeunload', handleSaveSession);

    // Mobile/Desktop: visibilitychange fires when switching apps or tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveCurrentSession();
        setIsPageVisible(false);
      } else {
        setIsPageVisible(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mobile: pagehide is more reliable than beforeunload on iOS Safari
    window.addEventListener('pagehide', handleSaveSession);

    // Additional: blur/focus events for when user taps outside the browser
    const handleBlur = () => {
      saveCurrentSession();
      setIsPageVisible(false);
    };
    const handleFocus = () => {
      setIsPageVisible(true);
    };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('beforeunload', handleSaveSession);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleSaveSession);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [saveCurrentSession]);

  // Also save periodically (every 5 seconds)
  useEffect(() => {
    if (loading || isQuizFinished) return;

    const interval = setInterval(() => {
      saveCurrentSession();
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, isQuizFinished, saveCurrentSession]);

  // Fetch questions on mount (skip if resuming)
  useEffect(() => {
    if (resumeSession) {
      return;
    }

    let isMounted = true;

    async function fetchQuestions() {
      try {
        const buildUrl = (diff: string | null) => {
          let url = `https://opentdb.com/api.php?amount=${amount}`;
          if (categoryId) url += `&category=${categoryId}`;
          if (diff) url += `&difficulty=${diff}`;
          return url;
        };

        const fetchWithRetry = async (
          url: string,
          retries = 2
        ): Promise<{ response_code: number; results?: OpenTDBQuestion[] }> => {
          try {
            const res = await fetch(url);

            if (res.status === 429) {
              if (retries > 0) {
                await new Promise((r) => setTimeout(r, 2000));
                return fetchWithRetry(url, retries - 1);
              }
            }

            const data = await res.json();

            // Handle OpenTDB Rate Limit Code (5)
            if (data.response_code === 5 && retries > 0) {
              await new Promise((r) => setTimeout(r, 2000));
              return fetchWithRetry(url, retries - 1);
            }

            return data;
          } catch (err) {
            if (retries > 0) {
              await new Promise((r) => setTimeout(r, 1000));
              return fetchWithRetry(url, retries - 1);
            }
            throw err;
          }
        };

        // Initial fetch attempt
        let data = await fetchWithRetry(buildUrl(difficulty));

        // Fallback Strategy: If no results (Code 1), try removing difficulty constraint
        if (data.response_code === 1 && difficulty) {
          console.log(
            'Not enough questions for specific difficulty, falling back to any difficulty...'
          );
          data = await fetchWithRetry(buildUrl(null));
        }

        if (!isMounted) return;

        if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
          console.error('No questions returned from API', data);
          setLoading(false);
          return;
        }

        const processedQuestions = data.results.map((q: OpenTDBQuestion) => {
          let allOptions: string[];
          let colors: string[];

          if (q.type === 'boolean') {
            allOptions = ['True', 'False'];
            colors = BOOLEAN_COLORS;
          } else {
            allOptions = [...q.incorrect_answers, q.correct_answer];
            allOptions = allOptions.sort(() => Math.random() - 0.5);
            colors = MULTIPLE_CHOICE_COLORS;
          }

          return {
            ...q,
            options: allOptions.map((opt: string, index: number) => ({
              id:
                q.type === 'boolean'
                  ? opt === 'True'
                    ? 'T'
                    : 'F'
                  : String.fromCharCode(65 + index),
              label: opt,
              color: colors[index] || 'bg-white',
            })),
          };
        });

        if (isMounted) {
          setQuestions(processedQuestions);
          // Set initial time based on actual loaded question count
          setTimeLeft(getTotalTime(processedQuestions.length));
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch questions:', error);
          setLoading(false);
        }
      }
    }
    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [amount, categoryId, difficulty, resumeSession]);

  // Handle advancing to next question
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev: number) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      // Timer does NOT reset here anymore
    } else {
      setIsQuizFinished(true);
    }
  };

  // Timer effect
  useEffect(() => {
    // Only run timer if page is visible, not paused, not loading, and not finished
    if (!isPageVisible || paused || loading || isQuizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          setIsQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPageVisible, paused, loading, isQuizFinished]);

  // Save quiz result and clear session when finished
  const hasSavedResult = useRef(false);
  useEffect(() => {
    if (isQuizFinished && questions.length > 0 && !hasSavedResult.current) {
      hasSavedResult.current = true;

      // Clear the saved session since quiz is complete
      clearQuizSession();

      // Determine quiz type
      const types = new Set(questions.map((q) => q.type));
      const quizType = types.size > 1 ? 'mixed' : types.has('boolean') ? 'boolean' : 'multiple';

      saveQuizResult({
        category: questions[0].category,
        categoryId: categoryId,
        difficulty: difficulty || 'any',
        type: quizType,
        totalQuestions: questions.length,
        correctAnswers: score,
        wrongAnswers: questions.length - score,
        score: score,
        percentage: Math.round((score / questions.length) * 100),
      });

      // Award XP based on correct answers and difficulty
      const xpEarned = calculateQuizXP(difficulty || 'any', score);
      if (xpEarned > 0) {
        addXP(xpEarned);
      }
    }
  }, [isQuizFinished, questions, score, categoryId, difficulty]);

  // Decode HTML entities
  const decodeHtml = (html: string): string => {
    if (typeof window === 'undefined') return html;
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Handle answer selection
  const handleAnswerClick = (selectedLabel: string) => {
    if (isAnswered) return;

    setSelectedAnswer(selectedLabel);
    setIsAnswered(true);

    const isCorrect = selectedLabel === currentQuestion?.correct_answer;
    if (isCorrect) {
      setScore((prev: number) => prev + 1);
    }

    // Auto-advance after a delay
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  // Get option styling based on answer state
  const getOptionStyle = (option: QuizOption): string => {
    if (!isAnswered) {
      return option.color;
    }

    const isCorrect = option.label === currentQuestion?.correct_answer;
    const isSelected = option.label === selectedAnswer;

    if (isCorrect) {
      return 'bg-green-400 ring-4 ring-green-600';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-400 ring-4 ring-red-600';
    }
    return 'bg-gray-200 opacity-50';
  };

  // Get quiz summary for modal
  const getQuizSummary = (): QuizSummary => {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    let message = '';
    let emoji = '';

    if (percentage >= 80) {
      message = 'Excellent!';
      emoji = '🏆';
    } else if (percentage >= 60) {
      message = 'Good Job!';
      emoji = '👍';
    } else if (percentage >= 40) {
      message = 'Not Bad!';
      emoji = '😊';
    } else {
      message = 'Keep Practicing!';
      emoji = '💪';
    }

    return { percentage, message, emoji };
  };

  return {
    // State
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

    // Actions
    handleAnswerClick,
    getOptionStyle,
    getQuizSummary,
    decodeHtml,
  };
}
