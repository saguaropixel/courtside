'use client';

import { ANSWERS_CHANGED } from '@/lib/answers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ResetAnswers() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  function clearAll() {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('rules-court:')) keys.push(k);
      }
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {}
    setConfirming(false);
    setDone(true);
    window.dispatchEvent(new Event(ANSWERS_CHANGED));
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl bg-[#1F1915] p-6">
        <p className="max-w-[52ch] text-lg text-[#E3D8C9]">
          Clear all your answers on this device? Your picks will be removed so
          you can replay every ruling.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={clearAll}
            className="h-12 rounded-xl bg-[#FFB224] px-6 font-[family-name:var(--font-cond)] text-xl font-extrabold text-[#15110E] hover:bg-[#FFC24D]"
          >
            Clear answers
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="h-12 rounded-xl border-2 border-[#3A2F27] px-6 font-[family-name:var(--font-cond)] text-xl font-bold text-[#F4EDE3] hover:bg-[#2A221C]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={() => {
          setDone(false);
          setConfirming(true);
        }}
        className="h-12 rounded-xl border-2 border-[#3A2F27] px-6 font-[family-name:var(--font-cond)] text-xl font-bold text-[#F4EDE3] hover:bg-[#2A221C]"
      >
        Reset my answers
      </button>
      {done && (
        <p role="status" className="text-[#C9BCAB]">
          Answers cleared. Every ruling is ready to play again.
        </p>
      )}
    </div>
  );
}
