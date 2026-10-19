'use client';

import Link from 'next/link';
import { mockInstructors, mockWorkshops } from '@/lib/data/mockData';

export default function InstructorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Başlık Alanı */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
          Usta Eğitmen Kadromuz
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Deneyimli Sanatçı ve Zanaatkarlar
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Her biri kendi alanında uzun yıllara dayanan deneyime sahip, geleneksel teknikleri ve çağdaş yöntemleri aktaran eğitmenlerimiz.
        </p>
      </div>

      {/* Eğitmen Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockInstructors.map((ins) => {
          const instructorWorkshops = mockWorkshops.filter((w) => w.instructorId === ins.id);

          return (
            <div
              key={ins.id}
              className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={ins.avatarUrl}
                    alt={ins.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-200 shadow-2xs"
                  />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">{ins.fullName}</h3>
                    <p className="text-xs font-semibold text-amber-800">{ins.specialty}</p>
                    <p className="text-2xs text-neutral-400 mt-0.5">✉️ {ins.email}</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">{ins.bio}</p>
              </div>

              {/* Verdiği Atölyeler */}
              <div className="pt-4 mt-4 border-t border-neutral-100">
                <h4 className="text-2xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Verdiği Atölyeler ({instructorWorkshops.length})
                </h4>
                <div className="space-y-1.5">
                  {instructorWorkshops.map((w) => (
                    <Link
                      key={w.id}
                      href={`/workshops/${w.id}`}
                      className="block text-xs font-medium text-neutral-700 hover:text-amber-700 truncate"
                    >
                      • {w.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
