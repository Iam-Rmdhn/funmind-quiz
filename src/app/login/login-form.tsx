'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useActionState, useState } from 'react';
import { login, signInWithGoogle } from './actions';

interface AuthState {
  error: string | null;
}

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(login, {
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

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-black">Welcome to</h2>
        <Image
          src="/assets/element/funmind_logo.png"
          alt="FunMind Logo"
          width={300}
          height={100}
          className="mx-auto h-20 w-auto object-contain"
          priority
        />
        <p className="pt-2 text-lg font-medium text-gray-500">Let&apos;s get your brain growing!</p>
      </div>

      {/* Form Section */}
      <form action={formAction} className="mt-8 space-y-6">
        <div className="space-y-5">
          {/* Email Input */}
          <div className="group">
            <label
              className="mb-2 ml-1 block font-sans text-sm font-bold text-black"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <span className="material-symbols-rounded">mail</span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="user@example.com"
                disabled={isPending}
                className="border-border focus:ring-primary/50 focus:border-border block w-full rounded-full border-2 bg-gray-50 py-4 pr-4 pl-11 text-lg font-semibold text-black placeholder-gray-400 transition-all duration-200 focus:ring-4 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="mb-2 ml-1 block font-sans text-sm font-bold text-black"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <span className="material-symbols-rounded">key</span>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="********"
                disabled={isPending}
                className="border-border focus:ring-primary/50 focus:border-border block w-full rounded-full border-2 bg-gray-50 py-4 pr-12 pl-11 text-lg font-semibold text-black placeholder-gray-400 transition-all duration-200 focus:ring-4 focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <span className="material-symbols-rounded text-2xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <div className="mt-2 flex justify-end">
              <a
                className="text-secondary hover:text-primary text-sm font-bold transition-colors"
                href="#"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>

        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-100 p-4 text-sm font-bold text-red-600">
            <span className="material-symbols-rounded">error</span>
            {state.error}
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={isPending}
          className="group border-border text-foreground bg-primary relative flex w-full justify-center rounded-full border-2 px-3 py-3 text-lg font-extrabold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#82d60b] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none active:translate-x-[6px] active:translate-y-[6px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          {isPending ? (
            <>
              <span className="mr-2 size-5 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
              Signing in...
            </>
          ) : (
            <>
              Let&apos;s Go!
              <span className="absolute right-6 flex items-center transition-transform group-hover:translate-x-1">
                <span className="material-symbols-rounded font-bold">arrow_forward</span>
              </span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 font-bold text-gray-500">Or jump in with...</span>
          </div>
        </div>

        {/* Social Login Buttons (Google Only) */}
        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isPending}
            className="group flex w-full items-center justify-center gap-3 rounded-full border-2 border-gray-200 bg-white py-4 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-base font-medium text-gray-600">
          New here?{' '}
          <Link
            href="/signup"
            className="text-secondary hover:text-primary font-bold transition-colors hover:underline"
          >
            Create a free account
          </Link>
        </p>
      </form>
    </div>
  );
}
