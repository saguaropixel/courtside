'use client';

import { SportSurface, themes } from '@/components/SportSurface';
import { Button } from '@/components/ui/button';
import type { PublicCase } from '@/lib/cases';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Result = {
  correct: boolean;
  answer: number;
  ruling: string;
  rulebookNote: string;
  counts: number[];
};

const ACCENT = '#FFB224';
const letters = ['A', 'B', 'C', 'D'];

export function CaseScreen({ c, allIds }: { c: PublicCase; allIds: string[] }) {
  const t = themes[c.sport];
  const storageKey = `rules-court:${c.id}`;
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // undefined = not worked out yet, null = every case has been played
  const [nextId, setNextId] = useState<string | null | undefined>(undefined);

  // Restore a previous answer so a refresh doesn't let people vote twice.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { choice, result: r } = JSON.parse(saved);
        setPicked(choice);
        setResult(r);
      }
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    if (!result) return;
    const played = new Set(
      allIds.filter((id) => {
        try {
          return !!localStorage.getItem(`rules-court:${id}`);
        } catch {
          return false;
        }
      })
    );
    const start = allIds.indexOf(c.id);
    const order = [...allIds.slice(start + 1), ...allIds.slice(0, start)];
    setNextId(order.find((id) => !played.has(id)) ?? null);
  }, [result, allIds, c.id]);

  async function lockIn() {
    if (picked === null || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: c.id, choice: picked }),
      });
      if (!res.ok) throw new Error('Vote failed');
      const r: Result = await res.json();
      setResult(r);
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ choice: picked, result: r })
        );
      } catch {}
      if (r.correct)
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
    } catch {
      setError(
        "Couldn't record your call. Check your connection and try again."
      );
    } finally {
      setBusy(false);
    }
  }

  const total = result ? result.counts.reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left: sport surface */}
      <section
        className="relative flex min-h-[420px] flex-col justify-between gap-12 overflow-hidden px-6 pb-14 pt-7 sm:px-10"
        style={{ background: t.surface, color: t.ink }}
      >
        <SportSurface sport={c.sport} />
        <span className="relative font-[family-name:var(--font-cond)] text-[34px] font-extrabold leading-none">
          Courtside
        </span>
        <div className="relative flex flex-col gap-5">
          <span
            className="inline-flex min-h-[34px] items-center self-start rounded-md px-3.5 font-[family-name:var(--font-cond)] text-xl font-bold"
            style={{ background: t.chipBg, color: t.chipFg ?? ACCENT }}
          >
            {t.label} · {c.year}
          </span>
          <h1 className="text-balance font-[family-name:var(--font-cond)] text-[64px] font-extrabold leading-[0.9] tracking-tight sm:text-[88px] lg:text-[104px]">
            {c.title}
          </h1>
        </div>
      </section>

      {/* Right: story and call */}
      <section className="flex flex-col gap-9 bg-[#15110E] px-6 pb-14 pt-7 sm:px-10">
        <nav className="flex justify-end">
          <span className="flex min-h-11 items-center rounded-full bg-[#2A221C] px-[18px] text-base font-semibold">
            Rules Court
          </span>
        </nav>

        <p className="max-w-[56ch] text-pretty text-[19px] leading-relaxed text-[#E3D8C9]">
          {c.setup}
        </p>

        <div className="flex flex-col gap-5">
          <h2 className="font-[family-name:var(--font-cond)] text-4xl font-bold leading-tight">
            {c.question}
          </h2>

          <div className="flex flex-col gap-3">
            {c.options.map((opt, i) => {
              const selected = picked === i;
              const isAnswer = result?.answer === i;
              const pct =
                result && total > 0
                  ? Math.round((result.counts[i] / total) * 100)
                  : 0;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!!result}
                  aria-pressed={selected}
                  onClick={() => setPicked(i)}
                  className="relative flex min-h-[72px] items-center gap-4 overflow-hidden rounded-xl border-2 bg-[#1F1915] px-5 py-3 text-left text-lg disabled:cursor-default"
                  style={{
                    borderColor: isAnswer
                      ? ACCENT
                      : selected
                        ? ACCENT
                        : '#3A2F27',
                    opacity: result && !isAnswer && !selected ? 0.75 : 1,
                  }}
                >
                  {result && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 left-0 bg-[#2A2016]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  )}
                  <span
                    className="relative flex size-10 flex-none items-center justify-center rounded-full font-[family-name:var(--font-cond)] text-[26px] font-extrabold"
                    style={{
                      background: selected || isAnswer ? ACCENT : '#2A221C',
                      color: selected || isAnswer ? '#15110E' : ACCENT,
                    }}
                  >
                    {letters[i]}
                  </span>
                  <span className="relative flex-1 font-medium">
                    {opt}
                    {result && isAnswer && (
                      <span className="ml-2 font-semibold text-[#FFB224]">
                        Correct ruling
                      </span>
                    )}
                    {result && selected && !isAnswer && (
                      <span className="ml-2 text-[#C9BCAB]">Your pick</span>
                    )}
                  </span>
                  {result && (
                    <span className="relative font-semibold tabular-nums">
                      {pct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {!result && (
            <Button
              onClick={lockIn}
              disabled={picked === null || busy}
              className="h-14 rounded-xl bg-[#FFB224] font-[family-name:var(--font-cond)] text-[26px] font-extrabold text-[#15110E] hover:bg-[#FFC24D] disabled:opacity-50"
            >
              {busy ? 'Locking in...' : 'Lock in my call'}
            </Button>
          )}
          {error && (
            <p role="alert" className="text-[#FFB224]">
              {error}
            </p>
          )}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3 rounded-2xl bg-[#1F1915] p-6"
          >
            <h3 className="font-[family-name:var(--font-cond)] text-3xl font-bold">
              {result.correct ? 'You called it.' : 'Not quite.'}
            </h3>
            <p className="text-lg leading-relaxed text-[#E3D8C9]">
              {result.ruling}
            </p>
            <p className="text-base leading-relaxed text-[#C9BCAB]">
              {result.rulebookNote}
            </p>
            {total > 0 && (
              <p className="text-sm text-[#C9BCAB]">
                {total} {total === 1 ? 'call' : 'calls'} so far.
              </p>
            )}
          </motion.div>
        )}
        {result &&
          nextId !== undefined &&
          (nextId ? (
            <Link
              href={`/rules-court/${nextId}`}
              className="flex h-14 items-center justify-center rounded-xl bg-[#FFB224] font-[family-name:var(--font-cond)] text-[26px] font-extrabold text-[#15110E] hover:bg-[#FFC24D]"
            >
              Next ruling
            </Link>
          ) : (
            <p className="text-lg text-[#E3D8C9]">
              That's every ruling for now. Come back when new cases are added.
            </p>
          ))}
      </section>
    </div>
  );
}
