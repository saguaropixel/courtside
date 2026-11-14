import fs from 'node:fs';
import path from 'node:path';

export type Sport =
  | 'baseball'
  | 'basketball'
  | 'football'
  | 'hockey'
  | 'soccer';

export type Case = {
  id: string;
  sport: Sport;
  year: number;
  title: string;
  setup: string;
  question: string;
  options: string[];
  answer: number;
  ruling: string;
  rulebookNote: string;
  source: string;
};

export type PublicCase = Pick<
  Case,
  'id' | 'sport' | 'year' | 'title' | 'setup' | 'question' | 'options'
>;

const SPORTS: Sport[] = [
  'baseball',
  'basketball',
  'football',
  'hockey',
  'soccer',
];
const DIR = path.join(process.cwd(), 'src', 'content', 'rules-court');

let cache: Case[] | null = null;

function isCase(x: unknown): x is Case {
  const c = x as Case;
  return (
    !!c &&
    typeof c.id === 'string' &&
    SPORTS.includes(c.sport) &&
    Number.isInteger(c.year) &&
    typeof c.title === 'string' &&
    typeof c.setup === 'string' &&
    typeof c.question === 'string' &&
    Array.isArray(c.options) &&
    c.options.length >= 2 &&
    Number.isInteger(c.answer) &&
    c.answer >= 0 &&
    c.answer < c.options.length &&
    typeof c.ruling === 'string' &&
    typeof c.rulebookNote === 'string'
  );
}

export function getAllCases(): Case[] {
  // In dev, re-read every time so edits show up on refresh.
  if (cache && process.env.NODE_ENV === 'production') return cache;

  const cases: Case[] = [];
  for (const file of fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()) {
    try {
      const parsed = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
      if (isCase(parsed)) cases.push(parsed);
      else
        console.warn(
          `[cases] ${file} is missing required fields and was skipped`
        );
    } catch {
      console.warn(`[cases] ${file} is not valid JSON and was skipped`);
    }
  }
  cache = cases;
  return cases;
}

export const getAllIds = () => getAllCases().map((c) => c.id);
export const getCase = (id: string) => getAllCases().find((c) => c.id === id);

export function getTodaysCase(): Case {
  const all = getAllCases();
  const day = Math.floor(Date.now() / 86_400_000);
  return all[day % all.length];
}

export function toPublic(c: Case): PublicCase {
  return {
    id: c.id,
    sport: c.sport,
    year: c.year,
    title: c.title,
    setup: c.setup,
    question: c.question,
    options: c.options,
  };
}
