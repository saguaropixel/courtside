'use client';

import { AnswerBadge } from '@/components/AnswerBadge';
import { SportSurface, themes } from '@/components/SportSurface';
import type { Sport } from '@/lib/cases';
import Link from 'next/link';
import { useState } from 'react';

type Item = { id: string; sport: Sport; year: number; title: string };

const SPORTS: Sport[] = [
  'baseball',
  'basketball',
  'football',
  'hockey',
  'soccer',
];
const ACCENT = '#FFB224';

function RulingCard({ c, className = '' }: { c: Item; className?: string }) {
  const t = themes[c.sport];
  return (
    <Link
      href={`/rules-court/${c.id}`}
      className={`relative flex min-h-[170px] flex-col justify-end gap-2 overflow-hidden rounded-2xl p-4 ${className}`}
      style={{ background: t.surface, color: t.ink }}
    >
      <SportSurface sport={c.sport} />
      <AnswerBadge id={c.id} />
      <span
        className="relative inline-flex min-h-[26px] items-center self-start rounded-md px-2.5 font-[family-name:var(--font-cond)] text-base font-bold"
        style={{ background: t.chipBg, color: t.chipFg ?? ACCENT }}
      >
        {t.label} · {c.year}
      </span>
      <h3 className="relative text-balance font-[family-name:var(--font-cond)] text-3xl font-extrabold leading-[0.95]">
        {c.title}
      </h3>
    </Link>
  );
}

export function RulingsBrowser({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<Sport | 'all'>('all');
  const count = (s: Sport) => items.filter((i) => i.sport === s).length;

  const chip = (active: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-base font-semibold transition-colors ${
      active ? 'bg-[#FFB224] text-[#15110E]' : 'bg-[#2A221C] text-[#E3D8C9]'
    }`;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-[family-name:var(--font-cond)] text-4xl font-bold">
        All rulings
      </h2>

      <div className="sticky top-0 z-10 -mx-6 bg-[#15110E]/90 px-6 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          <button
            type="button"
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
            className={chip(filter === 'all')}
          >
            All · {items.length}
          </button>
          {SPORTS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={filter === s}
              onClick={() => setFilter(s)}
              className={chip(filter === s)}
            >
              {themes[s].label} · {count(s)}
            </button>
          ))}
        </div>
      </div>

      {filter === 'all' ? (
        <div className="flex flex-col gap-8 px-6 sm:px-0">
          {SPORTS.filter((s) => count(s) > 0).map((s) => (
            <div key={s} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-[family-name:var(--font-cond)] text-2xl font-bold">
                  {themes[s].label}
                </h3>
                <button
                  type="button"
                  onClick={() => setFilter(s)}
                  className="min-h-11 px-1 text-base font-semibold text-[#FFB224]"
                >
                  See all {count(s)}
                </button>
              </div>
              <ul className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
                {items
                  .filter((i) => i.sport === s)
                  .map((c) => (
                    <li key={c.id} className="w-[240px] shrink-0 snap-start">
                      <RulingCard c={c} className="h-full" />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items
            .filter((i) => i.sport === filter)
            .map((c) => (
              <li key={c.id}>
                <RulingCard c={c} className="h-full" />
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
