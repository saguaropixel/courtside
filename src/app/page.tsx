import { AnswerBadge } from '@/components/AnswerBadge';
import { AnswerSummary } from '@/components/AnswerSummary';
import { Logo } from '@/components/Logo';
import { ResetAnswers } from '@/components/ResetAnswers';
import { RulingsBrowser } from '@/components/RulingsBrowser';
import { SportSurface, themes } from '@/components/SportSurface';
import { getAllCases, getTodaysCase } from '@/lib/cases';
import Link from 'next/link';
import { connection } from 'next/server';
import { Suspense } from 'react';

const ACCENT = '#FFB224';

async function TodaysRuling() {
  await connection(); // "today" is worked out per request
  const c = getTodaysCase();
  const t = themes[c.sport];
  return (
    <Link
      href={`/rules-court/${c.id}`}
      className="relative flex min-h-[420px] flex-col justify-between gap-12 overflow-hidden rounded-3xl p-8 sm:p-10"
      style={{ background: t.surface, color: t.ink }}
    >
      <SportSurface sport={c.sport} />
      <span className="relative text-lg font-medium">Today's ruling</span>
      <div className="relative flex flex-col gap-5">
        <span
          className="inline-flex min-h-[34px] items-center self-start rounded-md px-3.5 font-[family-name:var(--font-cond)] text-xl font-bold"
          style={{ background: t.chipBg, color: t.chipFg ?? ACCENT }}
        >
          {t.label} · {c.year}
        </span>
        <h2 className="text-balance font-[family-name:var(--font-cond)] text-6xl font-extrabold leading-[0.92] sm:text-8xl">
          {c.title}
        </h2>
        <span className="inline-flex h-14 items-center self-start rounded-xl bg-[#15110E] px-8 font-[family-name:var(--font-cond)] text-2xl font-extrabold text-[#FFB224]">
          Make the call
        </span>
      </div>
      <AnswerBadge id={c.id} />
    </Link>
  );
}

export default function Home() {
  const cases = getAllCases();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-14 px-6 pb-20 pt-7 sm:px-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="relative self-start">
          <Logo />
        </Link>
      </header>
      <AnswerSummary ids={cases.map((c) => c.id)} />

      <section className="flex max-w-3xl flex-col gap-5">
        <h1 className="text-balance font-[family-name:var(--font-cond)] text-7xl font-extrabold leading-[0.9] sm:text-9xl">
          Make the call.
        </h1>
        <p className="max-w-[52ch] text-pretty text-xl leading-relaxed text-[#E3D8C9]">
          Every case is a real moment where the ruling was in doubt. Pick what
          you think the officials decided, then see what actually happened.
        </p>
      </section>

      <Suspense
        fallback={<div className="min-h-[420px] rounded-3xl bg-[#1F1915]" />}
      >
        <TodaysRuling />
      </Suspense>

      <section className="flex flex-col gap-6">
        <RulingsBrowser
          items={cases.map(({ id, sport, year, title }) => ({
            id,
            sport,
            year,
            title,
          }))}
        />
        {/* <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => {
            const t = themes[c.sport];
            return (
              <li key={c.id}>
                <Link
                  href={`/rules-court/${c.id}`}
                  className="relative flex min-h-[220px] flex-col justify-end gap-3 overflow-hidden rounded-2xl p-6"
                  style={{ background: t.surface, color: t.ink }}
                >
                  <SportSurface sport={c.sport} />
                  <AnswerBadge id={c.id} />
                  <span
                    className="relative inline-flex min-h-[30px] items-center self-start rounded-md px-3 font-[family-name:var(--font-cond)] text-lg font-bold"
                    style={{ background: t.chipBg, color: t.chipFg ?? ACCENT }}
                  >
                    {t.label} · {c.year}
                  </span>
                  <h3 className="relative text-balance font-[family-name:var(--font-cond)] text-4xl font-extrabold leading-[0.95]">
                    {c.title}
                  </h3>
                </Link>
              </li>
            );
          })}
        </ul> */}
      </section>
      <ResetAnswers />
    </main>
  );
}
