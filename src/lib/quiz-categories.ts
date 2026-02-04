// OpenTDB API Categories
// Based on https://opentdb.com/api_category.php

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const QUIZ_CATEGORIES: Category[] = [
  {
    id: 9,
    name: 'General Knowledge',
    icon: 'lightbulb',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
  },
  {
    id: 10,
    name: 'Entertainment: Books',
    icon: 'menu_book',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    id: 11,
    name: 'Entertainment: Film',
    icon: 'movie',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  {
    id: 12,
    name: 'Entertainment: Music',
    icon: 'music_note',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
  },
  {
    id: 13,
    name: 'Entertainment: Musicals & Theatres',
    icon: 'theater_comedy',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    id: 14,
    name: 'Entertainment: Television',
    icon: 'tv',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    id: 15,
    name: 'Entertainment: Video Games',
    icon: 'sports_esports',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
  },
  {
    id: 16,
    name: 'Entertainment: Board Games',
    icon: 'casino',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 17,
    name: 'Science & Nature',
    icon: 'science',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
  },
  {
    id: 18,
    name: 'Science: Computers',
    icon: 'computer',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-100',
  },
  {
    id: 19,
    name: 'Science: Mathematics',
    icon: 'calculate',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 20,
    name: 'Mythology',
    icon: 'auto_stories',
    color: 'text-violet-500',
    bgColor: 'bg-violet-100',
  },
  {
    id: 21,
    name: 'Sports',
    icon: 'sports_soccer',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  { id: 22, name: 'Geography', icon: 'public', color: 'text-teal-500', bgColor: 'bg-teal-100' },
  {
    id: 23,
    name: 'History',
    icon: 'history_edu',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  {
    id: 24,
    name: 'Politics',
    icon: 'account_balance',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  { id: 25, name: 'Art', icon: 'palette', color: 'text-rose-500', bgColor: 'bg-rose-100' },
  { id: 26, name: 'Celebrities', icon: 'star', color: 'text-yellow-400', bgColor: 'bg-yellow-100' },
  { id: 27, name: 'Animals', icon: 'pets', color: 'text-lime-600', bgColor: 'bg-lime-100' },
  {
    id: 28,
    name: 'Vehicles',
    icon: 'directions_car',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  {
    id: 29,
    name: 'Entertainment: Comics',
    icon: 'auto_awesome',
    color: 'text-fuchsia-500',
    bgColor: 'bg-fuchsia-100',
  },
  {
    id: 30,
    name: 'Science: Gadgets',
    icon: 'smartphone',
    color: 'text-sky-500',
    bgColor: 'bg-sky-100',
  },
  {
    id: 31,
    name: 'Entertainment: Japanese Anime & Manga',
    icon: 'animation',
    color: 'text-pink-400',
    bgColor: 'bg-pink-100',
  },
  {
    id: 32,
    name: 'Entertainment: Cartoon & Animations',
    icon: 'face',
    color: 'text-amber-400',
    bgColor: 'bg-amber-100',
  },
];

export const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy', icon: 'sentiment_satisfied', color: 'text-green-500' },
  { id: 'medium', name: 'Medium', icon: 'sentiment_neutral', color: 'text-yellow-500' },
  { id: 'hard', name: 'Hard', icon: 'sentiment_very_dissatisfied', color: 'text-red-500' },
];

export function getCategoryById(id: number): Category | undefined {
  return QUIZ_CATEGORIES.find((cat) => cat.id === id);
}

export function getCategoryByName(name: string): Category | undefined {
  return QUIZ_CATEGORIES.find((cat) => cat.name.toLowerCase() === name.toLowerCase());
}
