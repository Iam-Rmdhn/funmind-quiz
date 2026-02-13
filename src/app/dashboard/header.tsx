'use client';

import { useState, useSyncExternalStore } from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatXP, xpStore } from '@/lib/xp-system';
import { useAuth } from '@/hooks/use-auth';
import { signOut as serverSignOut } from '@/app/login/actions';

const MENU_ITEMS = [
  { name: 'Home', icon: 'home', id: 'home', href: '/dashboard' },
  { name: 'Stats', icon: 'bar_chart', id: 'stats', href: '/stats' },
  { name: 'History', icon: 'history', id: 'history', href: '/history' },
];

export default function DashboardHeader() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [active, setActive] = useState('home');

  const userXP = useSyncExternalStore(
    xpStore.subscribe,
    xpStore.getSnapshot,
    xpStore.getServerSnapshot
  );

  // Helper to display username with proper capitalization
  const displayName = profile?.username
    ? profile.username.charAt(0).toUpperCase() + profile.username.slice(1)
    : 'User';

  const handleNavClick = (item: (typeof MENU_ITEMS)[0]) => {
    setActive(item.id);
    setIsMobileMenuOpen(false);
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#e0f5ea] px-4 py-4 lg:px-8">
        <div className="flex w-full items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <NextImage
              src="/assets/element/funmind_logo.png"
              alt="FunMind Logo"
              width={180}
              height={60}
              className="w-32 object-contain lg:w-44"
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
                className="w-full rounded-full border-[3px] border-black bg-white py-3 pr-4 pl-12 font-bold placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 py-2 shadow-[4px_4px_0_#000]">
              <span className="material-symbols-rounded text-[#facc15]">bolt</span>
              <span className="font-black">{formatXP(userXP.totalXP)} XP</span>
            </div>
            {/* Profile Dropdown */}
            <div className="relative" style={{ zIndex: isProfileOpen ? 9999 : 'auto' }}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative outline-none"
              >
                <Avatar className="size-12 cursor-pointer border-[3px] border-black bg-yellow-200 transition-transform hover:scale-105">
                  {profile?.avatar_url ? (
                    <AvatarImage
                      src={profile.avatar_url}
                      alt={profile?.username || 'Profile'}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-yellow-200 text-lg font-bold">
                      {profile?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute right-0 bottom-0 flex size-5 items-center justify-center rounded-full border-2 border-white bg-green-500 text-[10px] font-bold text-white">
                  {userXP.level}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  {/* Backdrop - must be first so dropdown is on top */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />

                  {/* Dropdown content */}
                  <div className="animate-in fade-in slide-in-from-top-2 absolute top-full right-0 z-50 mt-2 w-48 rounded-2xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] duration-200">
                    <div className="border-b-2 border-gray-200 p-3">
                      <p className="truncate text-sm font-bold">{displayName}</p>
                      <p className="truncate text-xs text-gray-500">{profile?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        signOut();
                        serverSignOut();

                        setIsProfileOpen(false);

                        localStorage.removeItem('user_xp');
                        localStorage.removeItem('quiz_session');

                        window.location.href = '/login';
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-b-xl px-4 py-3 text-left font-bold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <span className="material-symbols-rounded">logout</span>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="flex items-center justify-center rounded-xl border-[3px] border-black bg-white p-2 shadow-[4px_4px_0_#000] transition-all active:translate-y-1 active:shadow-none lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="material-symbols-rounded text-3xl">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="animate-in fade-in slide-in-from-right-10 fixed inset-0 z-100 flex flex-col bg-[#e0f5ea] p-4 duration-200 lg:hidden">
          <div className="mb-8 flex items-center justify-between">
            <NextImage
              src="/assets/element/funmind_logo.png"
              alt="FunMind Logo"
              width={140}
              height={50}
              className="object-contain"
            />
            <button
              className="flex items-center justify-center rounded-xl border-[3px] border-black bg-white p-2 shadow-[4px_4px_0_#000] transition-all active:translate-y-1 active:shadow-none"
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
                  className={`flex w-full items-center gap-4 rounded-full border-[3px] border-black px-6 py-4 text-left text-lg font-bold shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:shadow-none ${
                    isActive ? 'bg-accent' : 'bg-white'
                  }`}
                >
                  <span className="material-symbols-rounded text-3xl">{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Mobile Profile & XP */}
          <div className="mt-auto mb-4 rounded-4xl border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#000]">
            <div className="mb-4 flex items-center justify-between">
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
                <span className="text-lg font-bold">{displayName}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border-2 border-black bg-[#facc15] px-3 py-1">
                <span className="material-symbols-rounded text-sm">bolt</span>
                <span className="text-sm font-bold">{formatXP(userXP.totalXP)} XP</span>
              </div>
            </div>
            <button
              onClick={async () => {
                try {
                  await signOut();
                } catch (e) {
                  console.error('Client signOut error:', e);
                }

                try {
                  await serverSignOut();
                } catch (e) {
                  console.error('Server signOut error:', e);
                }

                setIsMobileMenuOpen(false);

                if (typeof window !== 'undefined') {
                  localStorage.removeItem('user_xp');
                  localStorage.removeItem('quiz_session');
                }

                window.location.href = '/login';
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 py-3 font-bold text-red-600 transition-colors hover:bg-red-100"
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
