import { getCase } from '@/lib/cases';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Marketplace installs may use either set of variable names. Check what Vercel created.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// Local-dev fallback only. It does not persist on Vercel.
const memory = new Map<string, number[]>();

async function readCounts(id: string, n: number): Promise<number[]> {
  if (!redis) return memory.get(id) ?? Array(n).fill(0);
  const h = (await redis.hgetall<Record<string, number>>(`rc:${id}`)) ?? {};
  return Array.from({ length: n }, (_, i) => Number(h[String(i)] ?? 0));
}

export async function POST(req: Request) {
  const { caseId, choice } = await req.json().catch(() => ({}));
  const c = typeof caseId === 'string' ? getCase(caseId) : undefined;

  if (
    !c ||
    !Number.isInteger(choice) ||
    choice < 0 ||
    choice >= c.options.length
  ) {
    return NextResponse.json({ error: 'Invalid vote' }, { status: 400 });
  }

  if (redis) {
    await redis.hincrby(`rc:${c.id}`, String(choice), 1);
  } else {
    const cur = memory.get(c.id) ?? Array(c.options.length).fill(0);
    cur[choice] += 1;
    memory.set(c.id, cur);
  }

  return NextResponse.json({
    correct: choice === c.answer,
    answer: c.answer,
    ruling: c.ruling,
    rulebookNote: c.rulebookNote,
    counts: await readCounts(c.id, c.options.length),
  });
}
