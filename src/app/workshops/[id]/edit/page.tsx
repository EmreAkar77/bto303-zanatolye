import { Suspense } from 'react';
import { mockWorkshops } from '@/lib/data/mockData';
import WorkshopEditClient from '@/components/WorkshopEditClient';

export function generateStaticParams() {
  return mockWorkshops.map((w) => ({
    id: String(w.id),
  }));
}

export default async function WorkshopEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const workshopId = Number(resolvedParams?.id) || 1;

  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto p-12 text-center text-slate-500 text-xs">
          Düzenleme formu hazırlanıyor...
        </div>
      }
    >
      <WorkshopEditClient workshopId={workshopId} />
    </Suspense>
  );
}
