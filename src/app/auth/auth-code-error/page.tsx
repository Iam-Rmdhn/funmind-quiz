import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h1 className="text-3xl font-black text-black mb-2">Authentication Error</h1>
      <p className="text-gray-500 font-medium mb-8 max-w-md">
        Oops! We couldn&apos;t sign you in. The verification link might be invalid or expired.
      </p>
      <Link 
        href="/login" 
        className="px-8 py-3 rounded-xl border-[3px] border-black bg-[#facc15] font-bold text-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all"
      >
        Back to Login
      </Link>
    </div>
  )
}
