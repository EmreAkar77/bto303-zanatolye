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

  // Kayıt gönderme işlemi (3 Saf İş Kuralı Denetimi)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Form doğrulama kontrolü
    if (!fullName.trim() || !email.trim()) {
      setFeedback({ type: 'error', message: 'Lütfen ad soyad ve e-posta alanlarını eksiksiz doldurunuz.' });
      return;
    }

    // Basit e-posta formatı denetimi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFeedback({ type: 'error', message: 'Lütfen geçerli bir e-posta adresi giriniz.' });
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

    // 2. Saf iş kuralları denetimi
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Üst Geri Butonu & Kategori */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          ← Atölyelere Geri Dön
        </Link>
        <span className="text-2xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
          {workshop.category}
        </span>
      </div>

      {/* Hero Görsel Alanı */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-64 sm:h-80 w-full shadow-xs border border-slate-200">
        {!imageError ? (
          <img
            src={workshop.imageUrl}
            alt={workshop.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
            <span className="text-5xl">🎨</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-2xs font-semibold bg-blue-600 text-white">
              {workshop.category}
            </span>
            {isPast ? (
              <span className="px-2.5 py-0.5 rounded-md text-2xs font-semibold bg-slate-700 text-slate-200">
                Tamamlandı
              </span>
            ) : isFull ? (
              <span className="px-2.5 py-0.5 rounded-md text-2xs font-semibold bg-red-600 text-white">
                Kontenjan Dolu
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md text-2xs font-semibold bg-emerald-600 text-white">
                Açık Kayıt
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight max-w-3xl leading-snug">
            {workshop.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl line-clamp-2">
            {workshop.description}
          </p>
        </div>
      </div>

      {/* İki Sütunlu İçerik Düzeni */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Sol Alan: Detaylar & Eğitmen */}
        <div className="lg:col-span-2 space-y-6">
          {/* Açıklama Kartı */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Atölye Hakkında</h2>
            <p className="text-slate-700 leading-relaxed text-sm">
              {workshop.details}
            </p>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-slate-500 text-2xs block">Süre</span>
                <span className="font-bold text-slate-800 text-xs">{workshop.duration}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-slate-500 text-2xs block">Konum</span>
                <span className="font-bold text-slate-800 text-xs">{workshop.location}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-slate-500 text-2xs block">Malzemeler</span>
                <span className="font-bold text-slate-800 text-xs">Atölyece Sağlanır</span>
              </div>
            </div>
          </div>

          {/* Eğitmen Kartı */}
          {workshop.instructor && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Atölye Eğitmeni</h2>
              <div className="flex items-start gap-3.5">
                <img
                  src={workshop.instructor.avatarUrl}
                  alt={workshop.instructor.fullName}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900">{workshop.instructor.fullName}</h3>
                  <p className="text-xs font-semibold text-blue-600">{workshop.instructor.specialty}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{workshop.instructor.bio}</p>
                  <p className="text-2xs text-slate-400 pt-0.5">✉️ {workshop.instructor.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sağ Alan: Kayıt Formu & Kontenjan */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5 sticky top-20">
          <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-2xs text-slate-500 block">Katılım Bedeli</span>
              <span className="text-xl font-bold text-slate-900">{workshop.price}</span>
            </div>
            <span className="text-2xs font-semibold text-slate-500">Kişi Başı</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span className="font-medium">{workshop.location}</span>
            </div>

            {/* Doluluk Çubuğu */}
            <div className="pt-2">
              <div className="flex justify-between text-2xs font-medium mb-1">
                <span className="text-slate-500">Kontenjan Durumu:</span>
                <span className={isFull ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                  {currentRegisteredCount}/{workshop.quota} ({availableSeats} yer açık)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    isFull ? 'bg-red-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(100, (currentRegisteredCount / workshop.quota) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Geribildirim Bildirimi */}
          {feedback && (
            <div
              className={`p-3 rounded-lg text-xs font-medium leading-relaxed ${
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
          <form onSubmit={handleRegister} className="space-y-3 pt-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Hemen Kaydol</h3>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">Adınız Soyadınız *</label>
              <input
                type="text"
                placeholder="Örn: Ayşe Demir"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isFull || isPast}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">E-posta Adresiniz *</label>
              <input
                type="email"
                placeholder="Örn: ayse@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isFull || isPast}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isFull || isPast}
              className={`w-full py-2.5 rounded-lg font-semibold text-xs transition-colors shadow-2xs ${
                isPast
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : isFull
                  ? 'bg-red-50 text-red-600 border border-red-200 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isPast ? 'Süresi Doldu (Kayıt Kapalı)' : isFull ? 'Kontenjan Dolu' : 'Kaydı Tamamla'}
            </button>
          </form>

          <p className="text-3xs text-slate-400 text-center leading-normal">
            Kaydol butonuna tıklandığında kontenjan, mükerrerlik ve tarih saf iş kuralları denetlenir.
          </p>
        </div>
      </div>
    </div>
  );
}
