import { Suspense } from 'react';
import { mockWorkshops } from '@/lib/data/mockData';
import WorkshopDetailClient from '@/components/WorkshopDetailClient';

export function generateStaticParams() {
  return mockWorkshops.map((w) => ({
    id: String(w.id),
  }));
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const workshopId = Number(resolvedParams?.id) || 1;

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-500">
          Atölye bilgileri yükleniyor...
        </div>
      }
    >
      <WorkshopDetailClient workshopId={workshopId} />
    </Suspense>
  );
}
