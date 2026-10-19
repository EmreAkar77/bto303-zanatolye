'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MockWorkshop } from '@/lib/data/mockData';

interface WorkshopCardProps {
  workshop: MockWorkshop;
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
  const [imageError, setImageError] = useState(false);

  const isFull = workshop.registeredCount >= workshop.quota;
  const isPast = workshop.status === 'COMPLETED';
  const availableSeats = Math.max(0, workshop.quota - workshop.registeredCount);

  // Tarih biçimlendirme
  const formattedDate = new Date(workshop.startDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col hover:-translate-y-0.5">
      {/* Görsel Alanı (Sabit Oranlı, Fallback Korumalı) */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-slate-100">
        {!imageError ? (
          <img
            src={workshop.imageUrl}
            alt={workshop.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500">
            <span className="text-2xl mb-1">🎨</span>
            <span className="text-xs font-semibold">{workshop.category}</span>
          </div>
        )}

        {/* Kategori Etiketi */}
        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-2xs font-semibold bg-white/95 text-slate-700 shadow-2xs border border-slate-200/80">
          {workshop.category}
        </span>

        {/* Durum Rozeti */}
        <div className="absolute top-2.5 right-2.5">
          {isPast ? (
            <span className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-slate-800 text-white shadow-2xs">
              Tamamlandı
            </span>
          ) : isFull ? (
            <span className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-red-600 text-white shadow-2xs">
              Dolu
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-emerald-600 text-white shadow-2xs">
              Açık
            </span>
          )}
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Tarih ve Süre */}
          <div className="flex items-center gap-2 text-2xs font-medium text-slate-500 mb-1.5">
            <span>📅 {formattedDate}</span>
            <span>•</span>
            <span>⏱️ {workshop.duration}</span>
          </div>

          {/* Başlık */}
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors mb-1.5">
            {workshop.title}
          </h3>

          {/* Açıklama */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {workshop.description}
          </p>
        </div>

        <div>
          {/* Eğitmen Bilgisi */}
          {workshop.instructor && (
            <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 mb-3">
              <img
                src={workshop.instructor.avatarUrl}
                alt={workshop.instructor.fullName}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 truncate leading-tight">
                  {workshop.instructor.fullName}
                </span>
                <span className="text-3xs text-slate-500 truncate leading-tight">
                  {workshop.instructor.specialty}
                </span>
              </div>
            </div>
          )}

          {/* Kontenjan İlerleme Çubuğu */}
          <div className="mb-3.5">
            <div className="flex justify-between text-2xs font-medium text-slate-600 mb-1">
              <span>Kontenjan: {workshop.registeredCount}/{workshop.quota}</span>
              <span className={isFull ? 'text-red-600 font-bold' : 'text-emerald-700'}>
                {isFull ? 'Kontenjan Dolu' : `${availableSeats} yer açık`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-red-500' : isPast ? 'bg-slate-400' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, (workshop.registeredCount / workshop.quota) * 100)}%` }}
              />
            </div>
          </div>

          {/* Alt Fiyat ve Buton */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-slate-900">{workshop.price}</span>
            <Link
              href={`/workshops/${workshop.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-colors"
            >
              Detayı İncele →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
