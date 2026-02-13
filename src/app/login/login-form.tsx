'use client';

import Image from 'next/image';
import { useActionState, useState } from 'react';
import { login } from './actions';

interface AuthState {
  error: string | null;
}

const DEMO_EMAIL = 'demo1@funmind.com';
const DEMO_PASSWORD = '123456';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(login, {
    error: null,
  });
  const [showPassword, setShowPassword] = useState(false);

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

      {/* Demo Account Info */}
      <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
        <span className="material-symbols-rounded text-2xl text-emerald-600">info</span>
        <div>
          <p className="font-sans text-sm font-bold text-emerald-800">Demo Account</p>
          <p className="font-sans text-xs font-medium text-emerald-600">
            Use the pre-filled credentials below to sign in.
          </p>
        </div>
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
                defaultValue={DEMO_EMAIL}
                placeholder="user@example.com"
                disabled={isPending}
                aria-label="Email address"
                tabIndex={1}
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
                defaultValue={DEMO_PASSWORD}
                placeholder="********"
                disabled={isPending}
                aria-label="Password"
                tabIndex={2}
                className="border-border focus:ring-primary/50 focus:border-border block w-full rounded-full border-2 bg-gray-50 py-4 pr-12 pl-11 text-lg font-semibold text-black placeholder-gray-400 transition-all duration-200 focus:ring-4 focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={4}
              >
                <span className="material-symbols-rounded text-2xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
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
          tabIndex={3}
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
      </form>
    </div>
  );
}
