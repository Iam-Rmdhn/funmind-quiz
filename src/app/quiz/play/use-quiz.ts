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
// Colors for true/false (2 options)
const BOOLEAN_COLORS = ['bg-[#86efac]', 'bg-[#fca5a5]'];

// Default timer duration in seconds
const TIMER_DURATION = 30;

export function useQuiz({ categoryId, difficulty, amount, resumeSession }: UseQuizParams): UseQuizReturn {
  // Initialize state from resume session if available
  const [questions, setQuestions] = useState<QuizQuestion[]>(resumeSession?.questions || []);
  const [currentIndex, setCurrentIndex] = useState(resumeSession?.currentIndex || 0);
  const [loading, setLoading] = useState(!resumeSession);
  const [timeLeft, setTimeLeft] = useState(resumeSession?.timeLeft || TIMER_DURATION);
  const [score, setScore] = useState(resumeSession?.score || 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isResumed] = useState(!!resumeSession);
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
  }, [questions, currentIndex, score, timeLeft, isQuizFinished, isAnswered, categoryId, difficulty, amount]);

  // Save session on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
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
      // Already have questions from session
      return;
    }

    async function fetchQuestions() {
      try {
        let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;
        
        if (categoryId) {
          apiUrl += `&category=${categoryId}`;
        }
        if (difficulty) {
          apiUrl += `&difficulty=${difficulty}`;
        }

        const res = await fetch(apiUrl);
        const data = await res.json();
        
        if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
          console.error("No questions returned from API", data);
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
              id: q.type === 'boolean' ? (opt === 'True' ? 'T' : 'F') : String.fromCharCode(65 + index),
              label: opt,
              color: colors[index] || 'bg-white'
            }))
          };
        });

        setQuestions(processedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [amount, categoryId, difficulty, resumeSession]);

  // Handle advancing to next question
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev: number) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(TIMER_DURATION);
    } else {
      setIsQuizFinished(true);
    }
  };

  // Timer effect
  useEffect(() => {
    if (loading || isAnswered || isQuizFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          // Time's up - schedule next question advancement
          setTimeout(() => {
            if (currentIndex < questions.length - 1) {
              setCurrentIndex((p: number) => p + 1);
              setSelectedAnswer(null);
              setIsAnswered(false);
              setTimeLeft(TIMER_DURATION);
            } else {
              setIsQuizFinished(true);
            }
          }, 0);
          return TIMER_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading, isAnswered, isQuizFinished, currentIndex, questions.length]);

  // Save quiz result and clear session when finished
  const hasSavedResult = useRef(false);
  useEffect(() => {
    if (isQuizFinished && questions.length > 0 && !hasSavedResult.current) {
      hasSavedResult.current = true;
      
      // Clear the saved session since quiz is complete
      clearQuizSession();
      
      // Determine quiz type
      const types = new Set(questions.map(q => q.type));
      const quizType = types.size > 1 ? 'mixed' : (types.has('boolean') ? 'boolean' : 'multiple');
      
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
    const txt = document.createElement("textarea");
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
