'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function HeroRobot() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/assets/element/animation.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load animation');
        return res.json();
      })
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Lottie Load Error:', err));
  }, []);

  if (!animationData) {
    return <div className="flex h-full w-full items-center justify-center"></div>;
  }

  return (
    <div className="h-full w-full">
      <Lottie
        animationData={animationData}
        loop={false}
        className="h-full w-full"
        rendererSettings={{
          preserveAspectRatio: 'xMaxYMin slice',
        }}
      />
    </div>
  );
}
