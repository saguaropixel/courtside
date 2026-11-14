import { CaseScreen } from '@/components/CaseScreen';
import { getAllIds, getCase, toPublic } from '@/lib/cases';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export function generateStaticParams() {
  return getAllIds().map((id) => ({ id }));
}

async function CaseLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCase(id);
  if (!c) notFound();
  return <CaseScreen key={c.id} c={toPublic(c)} allIds={getAllIds()} />;
}

export default function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#15110E]" />}>
      <CaseLoader params={params} />
    </Suspense>
  );
}
