'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockInstructors, mockWorkshops } from '@/lib/data/mockData';

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockInstructors.filter((ins) => {
    return (
      ins.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.bio.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Başlık Alanı */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-2xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
          Usta Eğitmen Kadrosu
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Deneyimli Sanatçı ve Zanaatkarlar
        </h1>
        <p className="text-xs sm:text-sm text-white leading-relaxed">
          Geleneksel zanaat tekniklerini ve çağdaş üretim yöntemlerini katılımcılara aktaran uzman eğitmenlerimiz.
        </p>
      </div>

      {/* Arama Alanı */}
      <div className="max-w-md mx-auto relative">
        <input
          type="text"
          placeholder="Eğitmen veya uzmanlık alanı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
      </div>

      {/* Eğitmen Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ins) => {
          const instructorWorkshops = mockWorkshops.filter((w) => w.instructorId === ins.id);

          return (
            <div
              key={ins.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={ins.avatarUrl}
                    alt={ins.fullName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{ins.fullName}</h3>
                    <p className="text-xs font-semibold text-blue-600">{ins.specialty}</p>
                    <p className="text-2xs text-slate-400 mt-0.5">✉️ {ins.email}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{ins.bio}</p>
              </div>

              {/* Verdiği Atölyeler */}
              <div className="pt-3.5 mt-3.5 border-t border-slate-100">
                <h4 className="text-3xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Verdiği Atölyeler ({instructorWorkshops.length})
                </h4>
                <div className="space-y-1.5">
                  {instructorWorkshops.length > 0 ? (
                    instructorWorkshops.map((w) => (
                      <Link
                        key={w.id}
                        href={`/workshops/${w.id}`}
                        className="block text-xs font-medium text-slate-700 hover:text-blue-600 truncate"
                      >
                        • {w.title}
                      </Link>
                    ))
                  ) : (
                    <span className="text-2xs text-slate-400">Şu anda planlanan atölye yok.</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
