export default function DailyChallengeCard({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-4xl border-[3px] border-black bg-[#e9d5ff] p-6 shadow-[6px_6px_0_#000] ${className}`}>
      {/* Background Icon */}
      <div className="absolute -top-4 -right-4 z-0 pointer-events-none rotate-12 text-black/20">
        <span className="material-symbols-rounded text-9xl leading-none">extension</span>
      </div>
      
      {/* Decoration */}
      <div className="absolute -bottom-8 -right-8 z-0 size-24 rounded-full bg-white/30 blur-xl"></div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-black">Daily Challenge</h3>
        <p className="mb-4 mt-2 text-sm font-medium leading-snug">Beat your high score!</p>
        <button className="block w-fit ml-auto px-8 lg:w-full lg:ml-0 lg:px-0 rounded-full bg-black py-3 font-bold text-white transition-transform hover:scale-105 cursor-pointer">
          Play Now
        </button>
      </div>
    </div>
  );
}
