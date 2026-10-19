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
    month: 'long',
    year: 'numeric',
    weekday: 'short',
  });

  return (
    <article className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Görsel Alanı (Fallback Korumalı) */}
      <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
        {!imageError ? (
          <img
            src={workshop.imageUrl}
            alt={workshop.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 text-white"
            style={{ backgroundColor: workshop.fallbackColor || '#d97706' }}
          >
            <span className="text-3xl mb-1">🎨</span>
            <span className="text-sm font-semibold text-center">{workshop.category}</span>
          </div>
        )}

        {/* Kategori Etiketi */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-neutral-800 shadow-xs backdrop-blur-xs">
          {workshop.category}
        </span>

        {/* Durum Rozeti */}
        <div className="absolute top-3 right-3">
          {isPast ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900/80 text-neutral-200 backdrop-blur-xs">
              Tamamlandı
            </span>
          ) : isFull ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600 text-white shadow-xs">
              Kontenjan Dolu
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-xs">
              Aktif Kayıt
            </span>
          )}
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tarih ve Süre */}
          <div className="flex items-center gap-2 text-xs font-medium text-amber-800 mb-2">
            <span>📅 {formattedDate}</span>
            <span>•</span>
            <span>⏱️ {workshop.duration}</span>
          </div>

          {/* Başlık */}
          <h3 className="text-lg font-bold text-neutral-900 line-clamp-2 group-hover:text-amber-700 transition-colors mb-2">
            {workshop.title}
          </h3>

          {/* Açıklama */}
          <p className="text-sm text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
            {workshop.description}
          </p>
        </div>

        <div>
          {/* Eğitmen Bilgisi */}
          {workshop.instructor && (
            <div className="flex items-center gap-2.5 pt-3 border-t border-neutral-100 mb-4">
              <img
                src={workshop.instructor.avatarUrl}
                alt={workshop.instructor.fullName}
                className="w-7 h-7 rounded-full object-cover border border-amber-200"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-800 leading-tight">
                  {workshop.instructor.fullName}
                </span>
                <span className="text-2xs text-neutral-500 leading-tight">
                  {workshop.instructor.specialty}
                </span>
              </div>
            </div>
          )}

          {/* Kontenjan İlerleme Çubuğu */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-medium text-neutral-600 mb-1">
              <span>Doluluk: {workshop.registeredCount}/{workshop.quota}</span>
              <span className={isFull ? 'text-red-600 font-bold' : 'text-emerald-700'}>
                {isFull ? 'Dolu' : `${availableSeats} yer kaldı`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-red-500' : isPast ? 'bg-neutral-400' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, (workshop.registeredCount / workshop.quota) * 100)}%` }}
              />
            </div>
          </div>

          {/* Alt Butonlar */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-bold text-neutral-900">{workshop.price}</span>
            <Link
              href={`/workshops/${workshop.id}`}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors"
            >
              Detayı İncele →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
