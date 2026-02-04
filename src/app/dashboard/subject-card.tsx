import Link from 'next/link';

interface SubjectCardProps {
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  bgIconColor: string;
  buttonText: string;
  footerContent?: React.ReactNode;
  href?: string;
}

export default function SubjectCard({
  title,
  description,
  icon,
  iconBgColor,
  bgIconColor,
  buttonText,
  footerContent,
  href,
}: SubjectCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-4xl border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#000] transition-transform hover:-translate-y-1">
      {/* Background Icon */}
      <div
        className={`absolute -top-6 -right-6 ${bgIconColor} rotate-12 transition-transform group-hover:scale-110`}
      >
        <span className="material-symbols-rounded text-9xl leading-none">{icon}</span>
      </div>

      <div className="relative z-10">
        <div
          className={`mb-4 inline-flex size-14 items-center justify-center rounded-full border-[3px] border-black ${iconBgColor} shadow-[2px_2px_0_#000]`}
        >
          <span className="material-symbols-rounded text-2xl">{icon}</span>
        </div>
        <h3 className="mb-2 text-2xl font-black">{title}</h3>
        <p className="mb-6 font-medium text-gray-500">{description}</p>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        {footerContent}
        {href ? (
          <Link
            href={href}
            className="bg-accent inline-block cursor-pointer rounded-full border-2 border-black px-6 py-2 font-bold text-black shadow-[2px_2px_0_#000] transition-transform hover:scale-105 active:scale-95"
          >
            {buttonText}
          </Link>
        ) : (
          <button className="bg-accent cursor-pointer rounded-full border-2 border-black px-6 py-2 font-bold shadow-[2px_2px_0_#000] transition-transform hover:scale-105 active:scale-95">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
