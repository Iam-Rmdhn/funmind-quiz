'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useActionState, useState } from 'react'
import { signup, signInWithGoogle } from '@/app/login/actions'

interface AuthState {
  error: string | null
}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(signup, { error: null })
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
    <div style={starryBgStyle} className="font-display min-h-screen flex flex-col items-center justify-center p-4 text-foreground">
      {/* Top Navigation */}
      <header className="w-full max-w-xl flex items-center justify-between py-4 mb-2 px-4 md:px-0">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 pr-6 rounded-full shadow-sm border-2 border-white">
          <div className="size-10 bg-(--tertiary) rounded-full flex items-center justify-center text-white shadow-inner">
            <span className="material-symbols-rounded font-bold">school</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary tracking-tight">FunMind</h1>
        </div>
        <div className="hidden md:flex gap-4">
          <button className="text-secondary font-bold hover:bg-white/50 px-4 py-2 rounded-full transition-colors font-sans hover:text-primary">Help</button>
          <Link href="/login" className="bg-white text-secondary font-bold px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all border-2 hover:text-primary border-secondary/10 font-sans">
            Log In
          </Link>
        </div>
      </header>
      
      {/* Main Content Card */}
      <main className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-white/60 relative z-10 p-8 lg:p-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-black mb-3 tracking-tight font-sans">Create Account</h2>
          <p className="text-slate-500 font-medium font-sans">Let&apos;s get your learning adventure started!</p>
        </div>
        
        <form action={formAction} className="space-y-6">
          {/* Username Field */}
          <div className="relative group space-y-2">
            <label className="block text-black text-sm font-bold ml-1 font-sans" htmlFor="username">Username</label>
            <div className="relative">
              <input 
                className="block w-full pl-14 pr-4 py-4 rounded-2xl bg-[#fffcf5] border-[3px] border-[#e8ddce] focus:border-amber-500 focus:bg-white focus:ring-0 outline-none transition-all placeholder:text-[#9c7a49]/60 font-semibold text-lg text-[#1c160d] h-16 font-sans peer disabled:opacity-50" 
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
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 peer-focus:text-amber-500 transition-all duration-300">
                <span className="material-symbols-rounded text-3xl">person</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 ml-1">3-20 characters, letters, numbers, and underscores only</p>
          </div>

          {/* Email Field */}
          <div className="relative group space-y-2">
            <label className="block text-black text-sm font-bold ml-1 font-sans" htmlFor="email">Email Address</label>
            <div className="relative">
              <input 
                className="block w-full pl-14 pr-4 py-4 rounded-2xl bg-[#fffcf5] border-[3px] border-[#e8ddce] focus:border-amber-500 focus:bg-white focus:ring-0 outline-none transition-all placeholder:text-[#9c7a49]/60 font-semibold text-lg text-[#1c160d] h-16 font-sans peer disabled:opacity-50" 
                id="email"
                name="email" 
                placeholder="user@example.com" 
                type="email"
                required
                disabled={isPending}
              />
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 peer-focus:text-amber-500 transition-all duration-300">
                <span className="material-symbols-rounded text-3xl">mail</span>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="relative group space-y-2">
            <label className="block text-black text-sm font-bold ml-1 font-sans" htmlFor="password">Secret Password</label>
            <div className="relative">
              <input 
                className="block w-full pl-14 pr-14 py-4 rounded-2xl bg-[#fffcf5] border-[3px] border-[#e8ddce] focus:border-amber-500 focus:bg-white focus:ring-0 outline-none transition-all placeholder:text-[#9c7a49]/60 font-semibold text-lg text-[#1c160d] h-16 font-sans peer disabled:opacity-50" 
                id="password"
                name="password" 
                placeholder="********" 
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                disabled={isPending}
              />
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 peer-focus:text-amber-500 transition-all duration-300">
                <span className="material-symbols-rounded text-3xl">key</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-amber-500 focus:outline-none transition-colors"
              >
                <span className="material-symbols-rounded text-2xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-500 ml-1">Minimum 6 characters</p>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="p-4 bg-red-100 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-rounded">error</span>
              {state.error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xl py-4 rounded-2xl flex items-center justify-center gap-2 font-sans transition-all duration-100 shadow-[0px_6px_0px_#b45309] hover:shadow-[0px_8px_0px_#b45309] hover:-translate-y-[2px] active:shadow-none active:translate-y-[6px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0px_6px_0px_#b45309]" 
              type="submit"
              disabled={isPending || isGoogleLoading}
            >
              {isPending ? (
                <>
                  <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
              <span className="px-4 bg-white text-gray-500 font-bold">Or sign up with</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isPending}
            className="w-full flex items-center justify-center gap-3 py-4 border-[3px] border-[#e8ddce] rounded-2xl bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 font-medium font-sans">
          Already have an account? <Link className="text-[#f59e0b] font-bold hover:underline" href="/login">Log In</Link>
        </p>
      </main>
      
      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500/60 text-md font-medium">
        <div className="flex items-center justify-center gap-4 mb-2">
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <span className="w-1 h-1 bg-gray-500/30 rounded-full"></span>
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
          <span className="w-1 h-1 bg-gray-500/30 rounded-full"></span>
          <a className="hover:text-primary transition-colors" href="#">Contact</a>
        </div>
        <p>Copyright © {new Date().getFullYear()} FunMind. Learning made magical!</p>
      </footer>
    </div>
  );
}
