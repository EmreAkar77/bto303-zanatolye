'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockWorkshops } from '@/lib/data/mockData';
import WorkshopCard from '@/components/WorkshopCard';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'FULL'>('ALL');

  const categories = ['Tümü', 'Seramik', 'Ahşap', 'Fotoğrafçılık', 'Kahve', 'Resim', 'Kodlama', 'Deri'];

  // Filtreleme mantığı
  const filteredWorkshops = useMemo(() => {
    return mockWorkshops.filter((workshop) => {
      const matchesCategory =
        selectedCategory === 'Tümü' || workshop.category === selectedCategory;

      const matchesSearch =
        workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workshop.instructor?.fullName.toLowerCase().includes(searchQuery.toLowerCase());

      const isFull = workshop.registeredCount >= workshop.quota;
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && workshop.status === 'ACTIVE' && !isFull) ||
        (statusFilter === 'FULL' && isFull);

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [selectedCategory, searchQuery, statusFilter]);

  return (
    <div className="space-y-16 pb-16">
      {/* Demo Veri Bilgilendirme Çubuğu */}
      <div className="bg-amber-500/10 border-b border-amber-200/60 px-4 py-2.5 text-center text-xs text-amber-900">
        <span className="font-semibold">ℹ️ Aşama 3 Bilgisi:</span> Bu sayfada zenginleştirilmiş örnek atölye ve eğitmen verileri gösterilmektedir. Neon bağlantısı tamamlandığında canlı veritabanı kayıtları listelenecektir.
      </div>

      {/* Hero Alanı (Büyük Karşılama) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/60 via-stone-50/40 to-transparent pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-xs font-semibold text-amber-900 shadow-2xs">
            <span>✨</span> Zanaat ve Teknolojiyi Buluşturan Deneyimler
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Usta Ellerden Öğrenin, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 bg-clip-text text-transparent">
              Kendi Atölyenizi Keşfedin
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 leading-relaxed">
            Seramik tornasından ahşap oymaya, analog fotoğrafçılıktan gömülü IoT kodlamaya kadar şehrin en ilham verici atölyelerine güvenle kaydolun.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#workshops"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Atölyeleri Keşfet ↓
            </a>
            <Link
              href="/admin"
              className="px-6 py-3.5 rounded-xl font-bold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 shadow-xs transition-all"
            >
              Yönetim Paneli
            </Link>
          </div>

          {/* İstatistik Rozetleri */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-amber-200/50">
            <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-amber-100">
              <div className="text-2xl font-extrabold text-amber-800">12+</div>
              <div className="text-xs text-neutral-500 font-medium">Farklı Atölye</div>
            </div>
            <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-amber-100">
              <div className="text-2xl font-extrabold text-amber-800">11</div>
              <div className="text-xs text-neutral-500 font-medium">Usta Eğitmen</div>
            </div>
            <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-amber-100">
              <div className="text-2xl font-extrabold text-amber-800">3</div>
              <div className="text-xs text-neutral-500 font-medium">Saf İş Kuralı</div>
            </div>
            <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-amber-100">
              <div className="text-2xl font-extrabold text-amber-800">%100</div>
              <div className="text-xs text-neutral-500 font-medium">Memnuniyet</div>
            </div>
          </div>
        </div>
      </section>

      {/* Arama ve Filtreleme Bölümü */}
      <section id="workshops" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          {/* Arama Alanı */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Atölye başlığı, açıklama veya eğitmen adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <span className="absolute left-3.5 top-3 text-neutral-400">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Durum Filtresi */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium whitespace-nowrap">Durum:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'FULL')}
              className="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="ACTIVE">Yalnızca Açık Kayıtlar</option>
              <option value="FULL">Kontenjanı Dolanlar</option>
            </select>
          </div>
        </div>

        {/* Kategori Hapları */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Atölye Kartları Izgarası */}
        {filteredWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
            <div className="text-4xl">🔎</div>
            <h3 className="text-lg font-bold text-neutral-900">Eşleşen Atölye Bulunamadı</h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto">
              Arama kriterlerinizi değiştirerek veya kategori filtresini sıfırlayarak tekrar deneyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Tümü');
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="inline-flex px-4 py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
