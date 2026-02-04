// Quiz History Types and Utilities

export interface QuizHistoryItem {
  id: string;
  date: string;
  category: string;
  categoryId: string | null;
  difficulty: string;
  type: 'mixed' | 'multiple' | 'boolean';
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  percentage: number;
}

const STORAGE_KEY = 'quiz_history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Get all quiz history from localStorage
 */
export function getQuizHistory(): QuizHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse quiz history:', error);
    return [];
  }
}

/**
 * Save a new quiz result to history
 */
export function saveQuizResult(result: Omit<QuizHistoryItem, 'id' | 'date'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getQuizHistory();
    
    const newItem: QuizHistoryItem = {
      ...result,
      id: generateId(),
      date: new Date().toISOString(),
    };
    
    // Add new item at the beginning
    history.unshift(newItem);
    
    // Keep only the last MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save quiz result:', error);
  }
}

/**
 * Clear all quiz history
 */
export function clearQuizHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Delete a specific history item
 */
export function deleteHistoryItem(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getQuizHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
}

/**
 * Get quiz statistics from history
 */
export function getQuizStats() {
  const history = getQuizHistory();
  
  if (history.length === 0) {
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      averageScore: 0,
      bestScore: 0,
      favoriteCategory: null,
    };
  }
  
  const totalQuizzes = history.length;
  const totalQuestions = history.reduce((sum, item) => sum + item.totalQuestions, 0);
  const totalCorrect = history.reduce((sum, item) => sum + item.correctAnswers, 0);
  const averageScore = Math.round(history.reduce((sum, item) => sum + item.percentage, 0) / totalQuizzes);
  const bestScore = Math.max(...history.map(item => item.percentage));
  
  // Find favorite category
  const categoryCounts: Record<string, number> = {};
  history.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  const favoriteCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  
  return {
    totalQuizzes,
    totalQuestions,
    totalCorrect,
    averageScore,
    bestScore,
    favoriteCategory,
  };
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format date for display
 */
export function formatHistoryDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
