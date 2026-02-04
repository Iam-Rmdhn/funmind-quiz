export interface QuizSession {
  // Quiz parameters
  categoryId: string | null;
  difficulty: string | null;
  amount: string;

  // Quiz state
  questions: Array<{
    type: 'multiple' | 'boolean';
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    options: Array<{
      id: string;
      label: string;
      color: string;
    }>;
  }>;
  currentIndex: number;
  score: number;
  timeLeft: number;

  // Metadata
  savedAt: string;
  startedAt: string;
}

const STORAGE_KEY = 'quiz_session';

/**
 * Save current quiz session to localStorage
 */
export function saveQuizSession(session: Omit<QuizSession, 'savedAt'>): void {
  if (typeof window === 'undefined') return;

  try {
    const sessionData: QuizSession = {
      ...session,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Failed to save quiz session:', error);
  }
}

/**
 * Get saved quiz session from localStorage
 */
export function getQuizSession(): QuizSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as QuizSession;

    const savedAt = new Date(session.savedAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      clearQuizSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to get quiz session:', error);
    return null;
  }
}

/**
 * Clear saved quiz session
 */
export function clearQuizSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if there's a saved quiz session
 */
export function hasQuizSession(): boolean {
  return getQuizSession() !== null;
}

/**
 * Format time elapsed since session started
 */
export function getSessionAge(session: QuizSession): string {
  const savedAt = new Date(session.savedAt);
  const now = new Date();
  const diffMs = now.getTime() - savedAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return 'More than a day ago';
}
