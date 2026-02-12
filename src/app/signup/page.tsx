'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useActionState, useState } from 'react';
import { signup, signInWithGoogle } from '@/app/login/actions';

interface AuthState {
  error: string | null;
}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(signup, {
    error: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.url) {
        window.location.href = result.url;
      } else if (result.error) {
        console.error('Google sign in error:', result.error);
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setIsGoogleLoading(false);
    }
  };

  const starryBgStyle = {
    backgroundColor: '#E6E6FA',
    backgroundImage: `
      radial-gradient(#ffffff 2px, transparent 2px),
      radial-gradient(#ffffff 1.5px, transparent 1.5px)
    `,
    backgroundSize: '50px 50px',
    backgroundPosition: '0 0, 25px 25px',
  };

  return (
    <div
      style={starryBgStyle}
      className="font-display text-foreground flex min-h-screen flex-col items-center justify-center p-4"
    >
      {/* Top Navigation */}
      <header className="mb-2 flex w-full max-w-xl items-center justify-between px-4 py-4 md:px-0">
        <div className="flex items-center gap-3 rounded-full border-2 border-white bg-white/80 p-2 pr-6 shadow-sm backdrop-blur-sm">
          <div className="flex size-10 items-center justify-center rounded-full bg-(--tertiary) text-white shadow-inner">
            <span className="material-symbols-rounded font-bold">school</span>
          </div>
          <h1 className="text-secondary text-2xl font-bold tracking-tight">FunMind</h1>
        </div>
        <div className="hidden gap-4 md:flex">
          <button className="text-secondary hover:text-primary rounded-full px-4 py-2 font-sans font-bold transition-colors hover:bg-white/50">
            Help
          </button>
          <Link
            href="/login"
            className="text-secondary hover:text-primary border-secondary/10 rounded-full border-2 bg-white px-6 py-2 font-sans font-bold shadow-sm transition-all hover:shadow-md"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2.5rem] border-[6px] border-white/60 bg-white p-8 shadow-2xl lg:p-12">
        <div className="mb-8">
          <h2 className="mb-3 font-sans text-4xl font-bold tracking-tight text-black">
            Create Account
          </h2>
          <p className="font-sans font-medium text-slate-500">
            Let&apos;s get your learning adventure started!
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {/* Username Field */}
          <div className="group relative space-y-2">
            <label className="ml-1 block font-sans text-sm font-bold text-black" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <input
                className="peer block h-16 w-full rounded-2xl border-[3px] border-[#e8ddce] bg-[#fffcf5] py-4 pr-4 pl-14 font-sans text-lg font-semibold text-[#1c160d] transition-all outline-none placeholder:text-[#9c7a49]/60 focus:border-amber-500 focus:bg-white focus:ring-0 disabled:opacity-50"
                id="username"
                name="username"
                placeholder="Choose a username"
                type="text"
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores allowed"
                disabled={isPending}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 transition-all duration-300 peer-focus:text-amber-500">
                <span className="material-symbols-rounded text-3xl">person</span>
              </div>
            </div>
            <p className="ml-1 text-xs text-gray-500">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          {/* Email Field */}
          <div className="group relative space-y-2">
            <label className="ml-1 block font-sans text-sm font-bold text-black" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <input
                className="peer block h-16 w-full rounded-2xl border-[3px] border-[#e8ddce] bg-[#fffcf5] py-4 pr-4 pl-14 font-sans text-lg font-semibold text-[#1c160d] transition-all outline-none placeholder:text-[#9c7a49]/60 focus:border-amber-500 focus:bg-white focus:ring-0 disabled:opacity-50"
                id="email"
                name="email"
                placeholder="user@example.com"
                type="email"
                required
                disabled={isPending}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 transition-all duration-300 peer-focus:text-amber-500">
                <span className="material-symbols-rounded text-3xl">mail</span>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="group relative space-y-2">
            <label className="ml-1 block font-sans text-sm font-bold text-black" htmlFor="password">
              Secret Password
            </label>
            <div className="relative">
              <input
                className="peer block h-16 w-full rounded-2xl border-[3px] border-[#e8ddce] bg-[#fffcf5] py-4 pr-14 pl-14 font-sans text-lg font-semibold text-[#1c160d] transition-all outline-none placeholder:text-[#9c7a49]/60 focus:border-amber-500 focus:bg-white focus:ring-0 disabled:opacity-50"
                id="password"
                name="password"
                placeholder="********"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                disabled={isPending}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 transition-all duration-300 peer-focus:text-amber-500">
                <span className="material-symbols-rounded text-3xl">key</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 transition-colors hover:text-amber-500 focus:outline-none"
              >
                <span className="material-symbols-rounded text-2xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <p className="ml-1 text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-100 p-4 text-sm font-bold text-red-600">
              <span className="material-symbols-rounded">error</span>
              {state.error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f59e0b] py-4 font-sans text-xl font-bold text-white shadow-[0px_6px_0px_#b45309] transition-all duration-100 hover:-translate-y-0.5 hover:bg-[#d97706] hover:shadow-[0px_8px_0px_#b45309] active:translate-y-1.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0px_6px_0px_#b45309]"
              type="submit"
              disabled={isPending || isGoogleLoading}
            >
              {isPending ? (
                <>
                  <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <span>Join the Fun!</span>
                  <span className="material-symbols-rounded font-bold">rocket_launch</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 font-bold text-gray-500">Or sign up with</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isPending}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border-[3px] border-[#e8ddce] bg-white py-4 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <>
                <span className="size-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></span>
                <span className="font-bold text-gray-600">Connecting...</span>
              </>
            ) : (
              <>
                <Image
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span className="font-bold text-gray-600 group-hover:text-black">
                  Continue with Google
                </span>
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-sm font-medium text-gray-500">
          Already have an account?{' '}
          <Link className="font-bold text-[#f59e0b] hover:underline" href="/login">
            Log In
          </Link>
        </p>
      </main>

      {/* Footer */}
      <footer className="text-md mt-8 text-center font-medium text-gray-500/60">
        <div className="mb-2 flex items-center justify-center gap-4">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy
          </a>
          <span className="h-1 w-1 rounded-full bg-gray-500/30"></span>
          <a className="hover:text-primary transition-colors" href="#">
            Terms
          </a>
          <span className="h-1 w-1 rounded-full bg-gray-500/30"></span>
          <a className="hover:text-primary transition-colors" href="#">
            Contact
          </a>
        </div>
        <p>Copyright © {new Date().getFullYear()} FunMind. Learning made magical!</p>
      </footer>
    </div>
  );
}
