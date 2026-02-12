// XP System Utilities

const STORAGE_KEY = 'user_xp';

// XP rewards based on difficulty
export const XP_REWARDS = {
  easy: 10,
  medium: 20,
  hard: 30,
  any: 15, // default for mixed difficulty
};

export interface UserXP {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXP: number;
}

// XP required to level up (increases each level)
function getXPForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

/**
 * Get current user XP data
 */
export function getUserXP(): UserXP {
  if (typeof window === 'undefined') {
    return { totalXP: 0, level: 1, xpToNextLevel: 100, currentLevelXP: 0 };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const totalXP = stored ? parseInt(stored, 10) : 0;

    // Calculate level from total XP
    let level = 1;
    let xpUsed = 0;

    while (xpUsed + getXPForLevel(level) <= totalXP) {
      xpUsed += getXPForLevel(level);
      level++;
    }

    const currentLevelXP = totalXP - xpUsed;
    const xpToNextLevel = getXPForLevel(level);

    return {
      totalXP,
      level,
      xpToNextLevel,
      currentLevelXP,
    };
  } catch (error) {
    console.error('Failed to get user XP:', error);
    return { totalXP: 0, level: 1, xpToNextLevel: 100, currentLevelXP: 0 };
  }
}

/**
 * Add XP to user's total
 */
export function addXP(amount: number): UserXP {
  if (typeof window === 'undefined') {
    return getUserXP();
  }

  try {
    const currentXP = getUserXP().totalXP;
    const newTotalXP = currentXP + amount;
    localStorage.setItem(STORAGE_KEY, newTotalXP.toString());

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('xp-updated', { detail: { xp: newTotalXP } }));

    return getUserXP();
  } catch (error) {
    console.error('Failed to add XP:', error);
    return getUserXP();
  }
}

/**
 * Calculate XP earned from a quiz based on difficulty
 */
export function calculateQuizXP(difficulty: string, correctAnswers: number): number {
  const difficultyKey = difficulty.toLowerCase() as keyof typeof XP_REWARDS;
  const xpPerQuestion = XP_REWARDS[difficultyKey] || XP_REWARDS.any;
  return xpPerQuestion * correctAnswers;
}

/**
 * Reset user XP (for debugging/testing)
 */
export function resetXP(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('xp-updated', { detail: { xp: 0 } }));
}

/**
 * Format XP for display
 */
export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toLocaleString();
}

// XP Store for useSyncExternalStore
let xpCache: UserXP | null = null;
const defaultXP: UserXP = { totalXP: 0, level: 1, xpToNextLevel: 100, currentLevelXP: 0 };

export const xpStore = {
  subscribe(callback: () => void) {
    const handler = () => callback();
    window.addEventListener('xp-updated', handler);
    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) callback();
    };
    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener('xp-updated', handler);
      window.removeEventListener('storage', storageHandler);
    };
  },

  getSnapshot(): UserXP {
    if (typeof window === 'undefined') {
      return defaultXP;
    }

    const xpObj = getUserXP();

    // Return cached object if content hasn't changed to ensure referential stability
    if (xpCache && xpCache.totalXP === xpObj.totalXP) {
      return xpCache;
    }

    xpCache = xpObj;
    return xpObj;
  },

  getServerSnapshot(): UserXP {
    return defaultXP;
  },
};
