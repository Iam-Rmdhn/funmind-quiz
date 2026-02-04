export default function DailyChallengeCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-4xl border-[3px] border-black bg-[#e9d5ff] p-6 shadow-[6px_6px_0_#000] ${className}`}
    >
      {/* Background Icon */}
      <div className="pointer-events-none absolute -top-4 -right-4 z-0 rotate-12 text-black/20">
        <span className="material-symbols-rounded text-9xl leading-none">extension</span>
      </div>

      {/* Decoration */}
      <div className="absolute -right-8 -bottom-8 z-0 size-24 rounded-full bg-white/30 blur-xl"></div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-black">Daily Challenge</h3>
        <p className="mt-2 mb-4 text-sm leading-snug font-medium">Beat your high score!</p>
        <button className="ml-auto block w-fit cursor-pointer rounded-full bg-black px-8 py-3 font-bold text-white transition-transform hover:scale-105 lg:ml-0 lg:w-full lg:px-0">
          Play Now
        </button>
      </div>
    </div>
  );
}
