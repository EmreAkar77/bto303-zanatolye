'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useWorkshopData } from '@/lib/data/useWorkshopData';
import WorkshopCard from '@/components/WorkshopCard';

export default function HomePage() {
  const { data } = useWorkshopData();
  const { workshops, instructors } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'FULL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'date-asc' | 'date-desc' | 'quota-desc'>('date-asc');

  const categories = ['Tümü', 'Seramik', 'Ahşap', 'Fotoğrafçılık', 'Kahve', 'Resim', 'Kodlama', 'Deri'];

  // Filtreleme ve Sıralama
  const filteredWorkshops = useMemo(() => {
    const list = workshops.filter((workshop) => {
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

    // Sıralama
    return list.sort((a, b) => {
      if (sortOrder === 'date-asc') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortOrder === 'date-desc') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      if (sortOrder === 'quota-desc') {
        return b.quota - a.quota;
      }
      return 0;
    });
  }, [workshops, selectedCategory, searchQuery, statusFilter, sortOrder]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Alanı (Temiz, Profesyonel Beyaz Tasarım) */}
      <section className="bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
            <span>🎨</span> Zanaat ve Tasarım Workshop Yönetim Sistemi
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Usta Ellerden Öğrenin, <br className="hidden sm:inline" />
            <span className="text-blue-600">Kendi Atölyenizi Keşfedin</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            Seramik tornasından geleneksel ahşap oymaya, analog fotoğrafçılıktan gömülü IoT kodlamaya kadar seçkin workshop programlarına güvenle kaydolun.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#workshops"
              className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
            >
              Atölyeleri Keşfet ↓
            </a>
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-lg font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
            >
              Yönetim Paneli
            </Link>
          </div>

          {/* İstatistik Göstergeleri */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-8">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xl font-bold text-slate-900">{workshops.length}</div>
              <div className="text-2xs text-slate-500 font-medium">Workshop</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xl font-bold text-slate-900">{instructors.length}</div>
              <div className="text-2xs text-slate-500 font-medium">Usta Eğitmen</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xl font-bold text-slate-900">3</div>
              <div className="text-2xs text-slate-500 font-medium">Saf İş Kuralı</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xl font-bold text-slate-900">%100</div>
              <div className="text-2xs text-slate-500 font-medium">Zod Doğrulama</div>
            </div>
          </div>
        </div>
      </section>

      {/* Arama, Sıralama ve Filtreleme Bölümü */}
      <section id="workshops" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          {/* Arama Alanı */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Atölye başlığı, açıklama veya eğitmen adı ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder:text-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtre ve Sıralama Kontrolleri */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 whitespace-nowrap">Durum:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'FULL')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="ALL">Tümü</option>
                <option value="ACTIVE">Yalnızca Açık</option>
                <option value="FULL">Kontenjanı Dolanlar</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 whitespace-nowrap">Sırala:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'date-asc' | 'date-desc' | 'quota-desc')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="date-asc">Tarihe Göre (Önce En Yakın)</option>
                <option value="date-desc">Tarihe Göre (Önce En Uzak)</option>
                <option value="quota-desc">Kontenjana Göre (Büyükten Küçüğe)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Kategori Seçicileri */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Atölye Kartları Izgarası */}
        {filteredWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <div className="text-3xl text-slate-400">🔍</div>
            <h3 className="text-base font-bold text-slate-800">Eşleşen Atölye Bulunamadı</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Arama ifadenizi veya seçtiğiniz kategori filtresini değiştirerek tekrar deneyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Tümü');
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="inline-flex px-3.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Eğitmenlerimiz</h2>
            <p className="text-xs text-slate-500 mt-1">Atölyelerimize yön veren usta eğitmenlerle tanışın.</p>
          </div>
          <Link href="/instructors" className="text-xs font-semibold text-blue-700 hover:text-blue-800">
            Tüm eğitmenler →
          </Link>
        </div>
        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {instructors.map((instructor) => (
              <article key={instructor.id} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <img
                  src={instructor.avatarUrl}
                  alt={instructor.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{instructor.fullName}</h3>
                  <p className="text-xs text-blue-600 truncate">{instructor.specialty}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Henüz eğitmen eklenmemiş.</p>
        )}
      </section>
    </div>
  );
}
