'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useActionState, useState } from 'react'
import { login, signInWithGoogle } from './actions'

interface AuthState {
  error: string | null
}

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(login, { error: null })
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const result = await signInWithGoogle()
      if (result.url) {
        window.location.href = result.url
      } else if (result.error) {
        console.error('Google sign in error:', result.error)
        setIsGoogleLoading(false)
      }
    } catch (error) {
      console.error('Google sign in error:', error)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-black tracking-tight">
          Welcome to
        </h2>
        <Image 
          src="/assets/element/funmind_logo.png" 
          alt="FunMind Logo" 
          width={300} 
          height={100} 
          className="mx-auto w-auto h-20 object-contain"
          priority
        />
        <p className="text-gray-500 font-medium text-lg pt-2">Let&apos;s get your brain growing!</p>
      </div>

      {/* Form Section */}
      <form action={formAction} className="mt-8 space-y-6">
        <div className="space-y-5">
          {/* Email Input */}
          <div className="group">
            <label className="block text-sm font-bold text-black mb-2 ml-1 font-sans" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <span className="material-symbols-rounded">mail</span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="user@example.com"
                disabled={isPending}
                className="block w-full pl-11 pr-4 py-4 border-2 border-border rounded-full text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/50 focus:border-border transition-all duration-200 bg-gray-50 text-black font-semibold disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-black mb-2 ml-1 font-sans" htmlFor="password">
              Password 
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <span className="material-symbols-rounded">key</span>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="********"
                disabled={isPending}
                className="block w-full pl-11 pr-12 py-4 border-2 border-border rounded-full placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/50 focus:border-border transition-all duration-200 bg-gray-50 text-lg text-black font-semibold disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <span className="material-symbols-rounded text-2xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <a className="text-sm font-bold text-secondary hover:text-primary transition-colors" href="#">
                Forgot password?
              </a>
            </div>
          </div>
        </div>

        {state?.error && (
          <div className="p-4 bg-red-100 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-rounded">error</span>
            {state.error}
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={isPending}
          className="group relative w-full flex justify-center py-3 px-3 border-2 border-border text-lg font-extrabold rounded-full text-foreground bg-primary hover:bg-[#82d60b] focus:outline-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          {isPending ? (
            <>
              <span className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
              Signing in...
            </>
          ) : (
            <>
              Let&apos;s Go!
              <span className="absolute right-6 flex items-center group-hover:translate-x-1 transition-transform">
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
            <span className="px-4 bg-white text-gray-500 font-bold">Or jump in with...</span>
          </div>
        </div>

        {/* Social Login Buttons (Google Only) */}
        <div className="grid grid-cols-1 gap-4">
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isPending}
            className="flex items-center justify-center gap-3 w-full py-4 border-2 border-gray-200 rounded-full bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <>
                <span className="size-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                <span className="font-bold text-gray-600">Connecting...</span>
              </>
            ) : (
              <>
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} />
                <span className="font-bold text-gray-600 group-hover:text-black">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-base font-medium text-gray-600 mt-6">
          New here?{' '}
          <Link href="/signup" className="font-bold text-secondary hover:text-primary hover:underline transition-colors">
            Create a free account
          </Link>
        </p>
      </form>
    </div>
  )
}
