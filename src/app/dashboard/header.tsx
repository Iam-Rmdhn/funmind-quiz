'use client';

import { useState, useSyncExternalStore } from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatXP, xpStore } from '@/lib/xp-system';
import { useAuth } from '@/hooks/use-auth';


const MENU_ITEMS = [
  { name: 'Home', icon: 'home', id: 'home', href: '/dashboard' },
  { name: 'Stats', icon: 'bar_chart', id: 'stats', href: null },
  { name: 'History', icon: 'history', id: 'history', href: '/history' },
];

export default function DashboardHeader() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  
  const userXP = useSyncExternalStore(
    xpStore.subscribe,
    xpStore.getSnapshot,
    xpStore.getServerSnapshot
  );

  const handleNavClick = (item: typeof MENU_ITEMS[0]) => {
    setActive(item.id);
    setIsMobileMenuOpen(false);
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 px-4 py-4 lg:px-8 bg-[#e0f5ea]">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <NextImage 
              src="/assets/element/funmind_logo.png" 
              alt="FunMind Logo" 
              width={180} 
              height={60} 
              className="object-contain w-32 lg:w-44"
              priority
            />
          </div>

          {/* Search Bar - Desktop Only */}
          <div className="hidden max-w-xl flex-1 lg:block">
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <span className="material-symbols-rounded">search</span>
              </span>
              <input 
                type="text" 
                placeholder="Search for quizzes, friends, or topics..." 
                className="w-full rounded-full border-[3px] border-black bg-white py-3 pl-12 pr-4 font-bold placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 py-2 shadow-[4px_4px_0_#000]">
              <span className="material-symbols-rounded text-[#facc15]">bolt</span>
              <span className="font-black">{formatXP(userXP.totalXP)} XP</span>
            </div>
            <div className="relative group">
              <Avatar className="size-12 border-[3px] border-black bg-yellow-200 cursor-pointer">
                {profile?.avatar_url ? (
                  <AvatarImage 
                    src={profile.avatar_url} 
                    alt={profile?.username || 'Profile'}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-yellow-200 font-bold text-lg">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full border-2 border-white bg-green-500 text-[10px] font-bold text-white z-10">
                {userXP.level}
              </div>
              {/* Dropdown Menu */}
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute right-0 top-full mt-2 w-48 rounded-2xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] transition-all z-50">
                <div className="p-3 border-b-2 border-gray-200">
                  <p className="font-bold text-sm truncate">{profile?.username || 'Guest'}</p>
                  <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left font-bold text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                >
                  <span className="material-symbols-rounded">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="lg:hidden flex items-center justify-center rounded-xl border-[3px] border-black bg-white p-2 shadow-[4px_4px_0_#000] active:shadow-none active:translate-y-1 transition-all"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="material-symbols-rounded text-3xl">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 flex flex-col bg-[#e0f5ea] p-4 lg:hidden animate-in fade-in slide-in-from-right-10 duration-200">
          <div className="flex items-center justify-between mb-8">
             <NextImage 
              src="/assets/element/funmind_logo.png" 
              alt="FunMind Logo" 
              width={140} 
              height={50} 
              className="object-contain"
            />
            <button 
              className="flex items-center justify-center rounded-xl border-[3px] border-black bg-white p-2 shadow-[4px_4px_0_#000] active:shadow-none active:translate-y-1 transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-rounded text-3xl">close</span>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-4">
             {MENU_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex w-full items-center gap-4 rounded-full border-[3px] border-black px-6 py-4 text-lg font-bold shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:shadow-none text-left
                    ${isActive 
                      ? 'bg-accent' 
                      : 'bg-white'
                    }`}
                >
                  <span className="material-symbols-rounded text-3xl">{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
          </nav>

           {/* Mobile Profile & XP */}
          <div className="mt-auto mb-4 p-4 rounded-4xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border-2 border-black bg-yellow-200">
                  {profile?.avatar_url ? (
                    <AvatarImage 
                      src={profile.avatar_url} 
                      alt={profile?.username || 'Profile'}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-yellow-200 font-bold">
                      {profile?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="font-bold text-lg">{profile?.username || 'Guest'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border-2 border-black bg-[#facc15] px-3 py-1">
                <span className="material-symbols-rounded text-sm">bolt</span>
                <span className="font-bold text-sm">{formatXP(userXP.totalXP)} XP</span>
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut();
                setIsMobileMenuOpen(false);
                window.location.href = '/login';
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
            >
              <span className="material-symbols-rounded">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
