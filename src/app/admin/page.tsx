'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockWorkshops, mockInstructors, MockWorkshop } from '@/lib/data/mockData';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function AdminPage() {
  const [workshops, setWorkshops] = useState<MockWorkshop[]>(mockWorkshops);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedWorkshop, setSelectedWorkshop] = useState<MockWorkshop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtreleme
  const filteredWorkshops = workshops.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.instructor?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Silme isteği başlatma
  const handleDeleteRequest = (workshop: MockWorkshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };

  // Silme işlemini onaylama
  const handleConfirmDelete = () => {
    if (!selectedWorkshop) return;

    // İş Kuralı / Restrict Kontrolü: Kayıtlı katılımcısı varsa silinemez
    if (selectedWorkshop.registeredCount > 0) {
      setFeedback({
        type: 'error',
        message: `Silme Engellendi: "${selectedWorkshop.title}" atölyesinde ${selectedWorkshop.registeredCount} adet aktif kayıt bulunmaktadır. onDelete: Restrict politikası gereğince silinemez.`,
      });
      setIsModalOpen(false);
      return;
    }

    setWorkshops((prev) => prev.filter((w) => w.id !== selectedWorkshop.id));
    setFeedback({
      type: 'success',
      message: `"${selectedWorkshop.title}" atölyesi başarıyla silindi.`,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Üst Başlık & Aksiyon */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Atölye ve Eğitmen Yönetim Paneli
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Atölyeleri listele, yeni kayıt aç, düzenle veya silme onayıyla yönet.
          </p>
        </div>

        <Link
          href="/workshops/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all"
        >
          <span>+</span> Yeni Atölye Ekle
        </Link>
      </div>

      {/* Aşama Bilgilendirme Kartı */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <span className="text-base">📌</span>
        <div>
          <strong className="font-semibold">Aşama 3 Arayüz Prototipi:</strong> Yönetim ekranları, arama, filtreleme, silme onayı ve hata durumları tam işlevsel olarak modellenmiştir. Neon bağlantısı tamamlandığında kalıcı Server Actions CRUD operasyonlarına bağlanacaktır.
        </div>
      </div>

      {/* Flash Bildirim Mesajı */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <span>{feedback.type === 'success' ? '✅ ' : '⚠️ '}{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold underline ml-4">
            Kapat
          </button>
        </div>
      )}

      {/* Arama ve Filtreleme */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Atölye veya eğitmen adına göre filtrele..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500"
          />
          <span className="absolute left-3 top-2.5 text-neutral-400 text-xs">🔍</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-700 font-medium"
        >
          <option value="ALL">Tüm Durumlar</option>
          <option value="ACTIVE">Yalnızca Aktif</option>
          <option value="COMPLETED">Tamamlanmış</option>
          <option value="DRAFT">Taslak</option>
        </select>
      </div>

      {/* Atölye Yönetim Tablosu (375px yatay kaydırma korumalı) */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">
            Atölye Kayıtları ({filteredWorkshops.length})
          </h2>
          <span className="text-2xs text-neutral-400">Sayfalama: 1 / 1</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-500 uppercase font-semibold text-2xs border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Atölye</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Eğitmen</th>
                <th className="py-3 px-4">Başlangıç</th>
                <th className="py-3 px-4">Kontenjan</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredWorkshops.length > 0 ? (
                filteredWorkshops.map((workshop) => (
                  <tr key={workshop.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-neutral-900 max-w-xs truncate">
                      <Link href={`/workshops/${workshop.id}`} className="hover:text-amber-700">
                        {workshop.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-2xs font-medium bg-neutral-100 text-neutral-700">
                        {workshop.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-800">
                      {workshop.instructor?.fullName || '-'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {new Date(workshop.startDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-neutral-900">{workshop.registeredCount}</span> / {workshop.quota}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-2xs font-bold ${
                          workshop.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : workshop.status === 'COMPLETED'
                            ? 'bg-neutral-100 text-neutral-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {workshop.status === 'ACTIVE'
                          ? 'Aktif'
                          : workshop.status === 'COMPLETED'
                          ? 'Tamamlandı'
                          : 'Taslak'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        href={`/workshops/${workshop.id}`}
                        className="px-2.5 py-1 rounded-lg text-2xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                      >
                        Görüntüle
                      </Link>
                      <button
                        onClick={() => handleDeleteRequest(workshop)}
                        className="px-2.5 py-1 rounded-lg text-2xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-neutral-400">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Eğitmenler Bölümü */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Kayıtlı Eğitmenler ({mockInstructors.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockInstructors.map((ins) => (
            <div key={ins.id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 bg-neutral-50/50">
              <img src={ins.avatarUrl} alt={ins.fullName} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-neutral-900 truncate">{ins.fullName}</h4>
                <p className="text-2xs text-amber-800 truncate">{ins.specialty}</p>
                <p className="text-3xs text-neutral-400 truncate">{ins.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Silme Onay Penceresi (Modal) */}
      <DeleteConfirmModal
        isOpen={isModalOpen}
        title="Atölye Silme Onayı"
        itemName={selectedWorkshop?.title || ''}
        hasRegistrations={(selectedWorkshop?.registeredCount || 0) > 0}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
