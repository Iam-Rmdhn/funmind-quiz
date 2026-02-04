'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardHeader from './header';
import SidebarNav from './sidebar-nav';
import DailyChallengeCard from './daily-challenge-card';
import HeroRobot from './hero-robot';
import { QUIZ_CATEGORIES, Category } from '@/lib/quiz-categories';
import QuizSettingsModal from './quiz-settings-modal';
import { useAuth } from '@/hooks/use-auth';

// Default 3 categories to show on dashboard
const DEFAULT_CATEGORIES = QUIZ_CATEGORIES.slice(0, 3);

export default function Dashboard() {
  const { profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleRandomQuiz = () => {
    const randomIndex = Math.floor(Math.random() * QUIZ_CATEGORIES.length);
    const randomCategory = QUIZ_CATEGORIES[randomIndex];
    setSelectedCategory(randomCategory);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#e0f5ea] text-black font-sans flex flex-col">
      {/* Responsive Header */}
      <DashboardHeader />

      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 pl-4 lg:pl-8 overflow-hidden pb-4 pr-0">
        {/* Left Sidebar - Hidden on Mobile */}
        <div className="hidden lg:block h-full">
          <SidebarNav />
        </div>

        {/* Main Content */}
        <main className="h-full overflow-y-auto pr-4 lg:pr-8 pb-20 space-y-10">
          {/* Daily Challenge - Mobile Only */}
          <DailyChallengeCard className="lg:hidden" />

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-[2.5rem] border-[3px] border-black bg-white p-8 shadow-[8px_8px_0_#000] md:p-12">
            <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left gap-6 md:max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-pink-100 px-4 py-2 text-sm font-black uppercase tracking-wide rotate-5">
                <span className="material-symbols-rounded text-lg">waving_hand</span>
                Welcome Back!
              </div>
              
              <h1 className="text-xxl font-black leading-[1.2] max-line text-black md:text-6xl">
                Ready to learn, <span className="bg-[#e9d5ff] px-2 text-black font-italic">{profile?.username ? profile.username.charAt(0).toUpperCase() + profile.username.slice(1) : 'Friend'}?</span>
              </h1>
              
              <p className="text-lg font-medium text-gray-500">
                Pick a subject below to start your adventure and earn some awesome badges today!
              </p>

              <button 
                onClick={handleRandomQuiz}
                className="group mt-2 flex items-center gap-3 rounded-full border-[3px] border-black bg-accent px-8 py-4 text-xl font-bold text-black shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:shadow-none cursor-pointer"
              >
                Random Quiz
                <span className="material-symbols-rounded">casino</span>
              </button>
            </div>

            {/* Robot */}
            <div className="relative w-full h-auto aspect-square max-h-80 mt-6 md:absolute md:-right-12 md:bottom-0 md:top-0 md:aspect-auto md:max-h-none md:w-1/2 md:h-auto md:mt-0">
              <div className="relative h-full w-full">
                <HeroRobot />
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-black text-white">
                  <span className="material-symbols-rounded">grid_view</span>
                </div>
                <h2 className="text-3xl font-black">Pick Your Subject</h2>
              </div>
              <Link href="/quiz/select" className="text-lg font-bold underline decoration-2 underline-offset-4 hover:text-gray-600">View All</Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {DEFAULT_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-4xl border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#000] transition-transform hover:-translate-y-1 text-left cursor-pointer"
                >
                  {/* Background Icon */}
                  <div className={`absolute -right-6 -top-6 ${category.color} opacity-10 transition-transform group-hover:scale-110 rotate-12`}>
                    <span className="material-symbols-rounded text-9xl leading-none">{category.icon}</span>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`mb-4 inline-flex size-14 items-center justify-center rounded-full border-[3px] border-black ${category.bgColor} shadow-[2px_2px_0_#000]`}>
                      <span className={`material-symbols-rounded text-2xl ${category.color}`}>{category.icon}</span>
                    </div>
                    <h3 className="mb-2 text-2xl font-black">{category.name.replace('Entertainment: ', '').replace('Science: ', '')}</h3>
                    <p className="mb-6 font-medium text-gray-500">Test your knowledge in {category.name.toLowerCase()}!</p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className={`size-8 rounded-full border-2 border-white ${category.bgColor}`}></div>
                      <div className="size-8 rounded-full border-2 border-white bg-gray-100"></div>
                    </div>
                    <span className="rounded-full border-2 border-black bg-accent px-6 py-2 font-bold shadow-[2px_2px_0_#000] transition-transform group-hover:scale-105">
                      Play Now
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Quiz Settings Modal */}
      <QuizSettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
