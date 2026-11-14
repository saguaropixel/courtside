'use client';

import { ANSWERS_CHANGED, readStatus } from '@/lib/answers';
import { useEffect, useState } from 'react';

export function AnswerSummary({ ids }: { ids: string[] }) {
  const [counts, setCounts] = useState<{
    played: number;
    correct: number;
  } | null>(null);

  useEffect(() => {
    const update = () => {
      const statuses = ids.map(readStatus);
      setCounts({
        played: statuses.filter((s) => s !== 'unplayed').length,
        correct: statuses.filter((s) => s === 'correct').length,
      });
    };
    update();
    window.addEventListener(ANSWERS_CHANGED, update);
    return () => window.removeEventListener(ANSWERS_CHANGED, update);
  }, [ids]);

  if (!counts || counts.played === 0) return null;

  return (
    <p className="text-lg text-[#E3D8C9]">
      You've called {counts.correct} of {counts.played}{' '}
      {counts.played === 1 ? 'ruling' : 'rulings'} correctly, with{' '}
      {ids.length - counts.played} to go.
    </p>
  );
}
