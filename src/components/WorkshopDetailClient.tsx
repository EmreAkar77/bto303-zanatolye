'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockWorkshops, MockWorkshop } from '@/lib/data/mockData';
import { validateRegistrationEligibility } from '@/lib/rules/workshopRules';

interface WorkshopDetailClientProps {
  workshopId: number;
}

export default function WorkshopDetailClient({ workshopId }: WorkshopDetailClientProps) {
  const workshop: MockWorkshop =
    mockWorkshops.find((w) => w.id === workshopId) || mockWorkshops[0];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [registeredList, setRegisteredList] = useState<string[]>([
    'ali@example.com',
    'ayse@example.com',
  ]);
  const [currentRegisteredCount, setCurrentRegisteredCount] = useState(workshop.registeredCount);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [imageError, setImageError] = useState(false);

  const isFull = currentRegisteredCount >= workshop.quota;
  const isPast = workshop.status === 'COMPLETED';
  const availableSeats = Math.max(0, workshop.quota - currentRegisteredCount);

  // Kayıt gönderme işlemi (İş kuralları denetimi)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!fullName.trim() || !email.trim()) {
      setFeedback({ type: 'error', message: 'Lütfen ad soyad ve e-posta alanlarını eksiksiz doldurunuz.' });
      return;
    }

    // 1. Mükerrer e-posta kontrolü
    if (registeredList.includes(email.toLowerCase())) {
      setFeedback({
        type: 'error',
        message: 'İş Kuralı İhlali: Bu e-posta adresi ile bu atölyeye daha önce kayıt yapılmıştır!',
      });
      return;
    }

    // 2. Saf iş kuralı denetimi
    const ruleResult = validateRegistrationEligibility({
      workshopStartDate: workshop.startDate,
      quota: workshop.quota,
      currentRegistrationsCount: currentRegisteredCount,
      existingParticipantIds: [1, 2, 3],
      participantId: 999,
    });

    if (!ruleResult.allowed) {
      setFeedback({
        type: 'error',
        message: `İş Kuralı Engeli: ${ruleResult.message}`,
      });
      return;
    }

    // Başarılı kayıt simülasyonu
    setCurrentRegisteredCount((prev) => prev + 1);
    setRegisteredList((prev) => [...prev, email.toLowerCase()]);
    setFeedback({
      type: 'success',
      message: `Tebrikler ${fullName}! Kaydınız başarıyla oluşturuldu. Kontenjan güncellendi.`,
    });
    setFullName('');
    setEmail('');
  };

  const formattedDate = new Date(workshop.startDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Geri Dönüş Butonu */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-amber-700 transition-colors"
        >
          ← Atölyelere Geri Dön
        </Link>
        <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-medium">
          {workshop.category}
        </span>
      </div>

      {/* Ana Başlık ve Hero Görsel */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 h-72 sm:h-96 w-full shadow-lg">
        {!imageError ? (
          <img
            src={workshop.imageUrl}
            alt={workshop.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover opacity-85"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white"
            style={{ backgroundColor: workshop.fallbackColor || '#78350f' }}
          >
            <span className="text-6xl">🎨</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-900/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">
              {workshop.category}
            </span>
            {isPast ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-700 text-neutral-200">
                Geçmiş Atölye
              </span>
            ) : isFull ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                Kontenjan Dolu
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
                Kayıtlar Açık
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-3xl leading-tight">
            {workshop.title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 mt-2 max-w-2xl line-clamp-2">
            {workshop.description}
          </p>
        </div>
      </div>

      {/* İçerik Düzeni (İki Sütun) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sol Sütun: Açıklama, Müfredat, Eğitmen */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detay Açıklaması */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Atölye Hakkında</h2>
            <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
              {workshop.details}
            </p>

            <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-500 block">Süre</span>
                <span className="font-bold text-neutral-800 text-sm">{workshop.duration}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-500 block">Konum</span>
                <span className="font-bold text-neutral-800 text-sm">{workshop.location}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-500 block">Materyaller</span>
                <span className="font-bold text-neutral-800 text-sm">Tümü Dahil</span>
              </div>
            </div>
          </div>

          {/* Eğitmen Kartı */}
          {workshop.instructor && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">Atölye Eğitmeni</h2>
              <div className="flex items-start gap-4">
                <img
                  src={workshop.instructor.avatarUrl}
                  alt={workshop.instructor.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-200 shadow-xs"
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-neutral-900">{workshop.instructor.fullName}</h3>
                  <p className="text-xs font-semibold text-amber-800">{workshop.instructor.specialty}</p>
                  <p className="text-xs text-neutral-600 leading-relaxed pt-1">{workshop.instructor.bio}</p>
                  <p className="text-2xs text-neutral-400 pt-1">✉️ {workshop.instructor.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sağ Sütun: Kayıt Formu ve Kontenjan Kartı */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-md space-y-6 sticky top-24">
          <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-xs text-neutral-500 block">Katılım Ücreti</span>
              <span className="text-2xl font-extrabold text-neutral-900">{workshop.price}</span>
            </div>
            <span className="text-xs font-semibold text-neutral-500">Kişi Başı</span>
          </div>

          {/* Kontenjan ve Tarih Özeti */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-neutral-700">
              <span>📅</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700">
              <span>📍</span>
              <span className="font-medium">{workshop.location}</span>
            </div>

            {/* Doluluk Çubuğu */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-neutral-600">Kontenjan Durumu:</span>
                <span className={isFull ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                  {currentRegisteredCount}/{workshop.quota} ({availableSeats} Yer Kaldı)
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFull ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (currentRegisteredCount / workshop.quota) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Geribildirim Mesajı */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-medium leading-relaxed ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {feedback.type === 'success' ? '✅ ' : '❌ '}
              {feedback.message}
            </div>
          )}

          {/* Kayıt Formu */}
          <form onSubmit={handleRegister} className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-neutral-900">Atölyeye Kaydol</h3>

            <div>
              <label className="block text-2xs font-semibold text-neutral-600 mb-1">Adınız Soyadınız</label>
              <input
                type="text"
                placeholder="Örn: Ayşe Demir"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isFull || isPast}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-neutral-600 mb-1">E-posta Adresiniz</label>
              <input
                type="email"
                placeholder="Örn: ayse@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isFull || isPast}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isFull || isPast}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                isPast
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : isFull
                  ? 'bg-red-100 text-red-600 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white hover:shadow'
              }`}
            >
              {isPast ? 'Atölye Süresi Doldu' : isFull ? 'Kontenjan Dolu' : 'Kaydı Onayla'}
            </button>
          </form>

          <p className="text-3xs text-neutral-400 text-center leading-normal">
            Kaydol butonuna bastığınızda kontenjan ve mükerrerlik saf iş kuralları doğrulanır.
          </p>
        </div>
      </div>
    </div>
  );
}
