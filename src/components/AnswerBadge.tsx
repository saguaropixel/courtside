'use client';

import { ANSWERS_CHANGED, readStatus, type AnswerStatus } from '@/lib/answers';
import { useEffect, useState } from 'react';

export function AnswerBadge({ id }: { id: string }) {
  const [status, setStatus] = useState<AnswerStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(readStatus(id));
    update();
    window.addEventListener(ANSWERS_CHANGED, update);
    return () => window.removeEventListener(ANSWERS_CHANGED, update);
  }, [id]);

  if (!status || status === 'unplayed') return null;

  const correct = status === 'correct';
  return (
    <span className="absolute right-4 top-4 inline-flex min-h-[32px] items-center gap-1.5 rounded-full bg-[#15110E] px-3 text-base font-semibold text-[#F4EDE3]">
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={correct ? '#FFB224' : '#C9BCAB'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {correct ? (
          <path d="M5 13l4 4L19 7" />
        ) : (
          <path d="M6 6l12 12M18 6L6 18" />
        )}
      </svg>
      {correct ? 'Called it' : 'Missed'}
    </span>
  );
}
