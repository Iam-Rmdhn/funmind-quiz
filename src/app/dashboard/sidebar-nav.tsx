'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DailyChallengeCard from './daily-challenge-card';

const MENU_ITEMS = [
  { name: 'Home', icon: 'home', id: 'home', href: '/dashboard' },
  { name: 'Stats', icon: 'bar_chart', id: 'stats', href: null },
  { name: 'History', icon: 'history', id: 'history', href: '/history' },
];

export default function SidebarNav() {
  const router = useRouter();
  const [active, setActive] = useState('home');

  const handleNavClick = (item: typeof MENU_ITEMS[0]) => {
    setActive(item.id);
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <aside className="h-full flex flex-col overflow-y-auto pb-6 px-4 pt-2">
      {/* Navigation */}
      <nav className="flex flex-col gap-4">
        {MENU_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex w-full items-center gap-4 rounded-full border-[3px] border-black px-6 py-4 text-lg font-bold shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:shadow-none cursor-pointer
                ${isActive 
                  ? 'bg-accent' 
                  : 'bg-white hover:bg-gray-50'
                }`}
            >
              <span className="material-symbols-rounded text-3xl">{item.icon}</span>
              {item.name}
            </button>
          );
        })}
      </nav>
      <DailyChallengeCard className="mt-auto" />
    </aside>
  );
}
