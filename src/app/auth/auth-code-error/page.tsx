import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] p-4 text-center">
      <div className="mb-4 text-6xl">😕</div>
      <h1 className="mb-2 text-3xl font-black text-black">Authentication Error</h1>
      <p className="mb-8 max-w-md font-medium text-gray-500">
        Oops! We couldn&apos;t sign you in. The verification link might be invalid or expired.
      </p>
      <Link
        href="/login"
        className="rounded-xl border-[3px] border-black bg-[#facc15] px-8 py-3 font-bold text-black shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]"
      >
        Back to Login
      </Link>
    </div>
  );
}
