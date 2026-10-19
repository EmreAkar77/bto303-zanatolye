'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  mockWorkshops as initialWorkshops,
  mockInstructors as initialInstructors,
  MockWorkshop,
  MockInstructor,
} from '@/lib/data/mockData';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { canDeleteInstructor, canDeleteWorkshop } from '@/lib/rules/workshopRules';
import { instructorSchema } from '@/lib/validations/schemas';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'workshops' | 'instructors'>('workshops');

  // Atölye State
  const [workshops, setWorkshops] = useState<MockWorkshop[]>(initialWorkshops);
  const [workshopSearch, setWorkshopSearch] = useState('');
  const [workshopStatusFilter, setWorkshopStatusFilter] = useState('ALL');

  // Eğitmen State
  const [instructors, setInstructors] = useState<MockInstructor[]>(initialInstructors);
  const [instructorSearch, setInstructorSearch] = useState('');
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<MockInstructor | null>(null);
  const [instructorForm, setInstructorForm] = useState({ fullName: '', specialty: '', email: '' });
  const [instructorFormErrors, setInstructorFormErrors] = useState<Record<string, string>>({});

  // Silme Modalı State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'workshop' | 'instructor';
    id: number;
    title: string;
    hasRelations: boolean;
  } | null>(null);

  // Bildirim State
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Atölye Filtreleme
  const filteredWorkshops = workshops.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(workshopSearch.toLowerCase()) ||
      (w.instructor?.fullName.toLowerCase().includes(workshopSearch.toLowerCase()) ?? false);
    const matchesStatus = workshopStatusFilter === 'ALL' || w.status === workshopStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Eğitmen Filtreleme
  const filteredInstructors = instructors.filter((i) => {
    return (
      i.fullName.toLowerCase().includes(instructorSearch.toLowerCase()) ||
      i.specialty.toLowerCase().includes(instructorSearch.toLowerCase()) ||
      i.email.toLowerCase().includes(instructorSearch.toLowerCase())
    );
  });

  // Atölye Silme İsteği
  const handleWorkshopDeleteRequest = (workshop: MockWorkshop) => {
    const check = canDeleteWorkshop(
      workshop.id,
      workshops.map((w) => ({ workshopId: w.id, status: w.registeredCount > 0 ? 'REGISTERED' : 'CANCELLED' }))
    );
    setDeleteTarget({
      type: 'workshop',
      id: workshop.id,
      title: workshop.title,
      hasRelations: !check.allowed,
    });
  };

  // Eğitmen Silme İsteği
  const handleInstructorDeleteRequest = (instructor: MockInstructor) => {
    const check = canDeleteInstructor(
      instructor.id,
      workshops.map((w) => ({ instructorId: w.instructorId }))
    );
    setDeleteTarget({
      type: 'instructor',
      id: instructor.id,
      title: instructor.fullName,
      hasRelations: !check.allowed,
    });
  };

  // Silme Onaylama
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'workshop') {
      const check = canDeleteWorkshop(
        deleteTarget.id,
        workshops.map((w) => ({ workshopId: w.id, status: w.registeredCount > 0 ? 'REGISTERED' : 'CANCELLED' }))
      );
      if (!check.allowed) {
        setFeedback({ type: 'error', message: `Silme Engellendi (onDelete: Restrict): ${check.message}` });
        setDeleteTarget(null);
        return;
      }
      setWorkshops((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      setFeedback({ type: 'success', message: `"${deleteTarget.title}" atölyesi başarıyla silindi.` });
    } else {
      const check = canDeleteInstructor(
        deleteTarget.id,
        workshops.map((w) => ({ instructorId: w.instructorId }))
      );
      if (!check.allowed) {
        setFeedback({ type: 'error', message: `Silme Engellendi (onDelete: Restrict): ${check.message}` });
        setDeleteTarget(null);
        return;
      }
      setInstructors((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setFeedback({ type: 'success', message: `"${deleteTarget.title}" eğitmeni başarıyla silindi.` });
    }

    setDeleteTarget(null);
  };

  // Eğitmen Ekleme / Düzenleme Modalını Aç
  const openInstructorModal = (instructor?: MockInstructor) => {
    setInstructorFormErrors({});
    if (instructor) {
      setEditingInstructor(instructor);
      setInstructorForm({ fullName: instructor.fullName, specialty: instructor.specialty, email: instructor.email });
    } else {
      setEditingInstructor(null);
      setInstructorForm({ fullName: '', specialty: '', email: '' });
    }
    setIsInstructorModalOpen(true);
  };

  // Eğitmen Form Gönderimi
  const handleSaveInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    setInstructorFormErrors({});

    const parsed = instructorSchema.safeParse(instructorForm);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        fieldErrors[fieldName] = issue.message;
      });
      setInstructorFormErrors(fieldErrors);
      return;
    }

    if (editingInstructor) {
      // Düzenleme
      setInstructors((prev) =>
        prev.map((ins) =>
          ins.id === editingInstructor.id
            ? { ...ins, ...parsed.data }
            : ins
        )
      );
      setFeedback({ type: 'success', message: `"${parsed.data.fullName}" eğitmen bilgileri güncellendi.` });
    } else {
      // Yeni ekleme
      const newId = Math.max(...instructors.map((i) => i.id), 0) + 1;
      const newInstructor: MockInstructor = {
        id: newId,
        ...parsed.data,
        bio: `${parsed.data.specialty} alanında eğitmen.`,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      };
      setInstructors((prev) => [...prev, newInstructor]);
      setFeedback({ type: 'success', message: `Yeni eğitmen "${parsed.data.fullName}" başarıyla eklendi.` });
    }

    setIsInstructorModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Üst Başlık & Sekmeler */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Yönetim Paneli</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Atölyeleri ve eğitmenleri listeleyin, oluşturun, düzenleyin ve silin.
          </p>
        </div>

        {/* Sekme Seçicileri */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('workshops')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'workshops'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Atölye Yönetimi ({workshops.length})
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'instructors'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Eğitmen Yönetimi ({instructors.length})
          </button>
        </div>
      </div>

      {/* Flash Bildirim Mesajı */}
      {feedback && (
        <div
          className={`p-3.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <span>{feedback.type === 'success' ? '✅ ' : '⚠️ '}{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-2xs font-bold underline ml-3">
            Kapat
          </button>
        </div>
      )}

      {/* ================= ATÖLYE YÖNETİMİ ================= */}
      {activeTab === 'workshops' && (
        <div className="space-y-4">
          {/* Arama ve Yeni Atölye Butonu */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Atölye başlığı veya eğitmen adı ile filtrele..."
                value={workshopSearch}
                onChange={(e) => setWorkshopSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={workshopStatusFilter}
                onChange={(e) => setWorkshopStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
              >
                <option value="ALL">Tüm Durumlar</option>
                <option value="ACTIVE">Yalnızca Aktif</option>
                <option value="COMPLETED">Tamamlandı</option>
                <option value="DRAFT">Taslak</option>
              </select>

              <Link
                href="/workshops/new"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs whitespace-nowrap transition-colors"
              >
                + Yeni Atölye
              </Link>
            </div>
          </div>

          {/* Atölye Tablosu */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-2xs border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3.5">Atölye</th>
                    <th className="py-2.5 px-3.5">Kategori</th>
                    <th className="py-2.5 px-3.5">Eğitmen</th>
                    <th className="py-2.5 px-3.5">Tarih</th>
                    <th className="py-2.5 px-3.5">Kontenjan</th>
                    <th className="py-2.5 px-3.5">Durum</th>
                    <th className="py-2.5 px-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorkshops.length > 0 ? (
                    filteredWorkshops.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3.5 font-semibold text-slate-900 max-w-xs truncate">
                          <Link href={`/workshops/${w.id}`} className="hover:text-blue-600">
                            {w.title}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3.5">
                          <span className="px-2 py-0.5 rounded-md text-2xs font-medium bg-slate-100 text-slate-700">
                            {w.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-medium text-slate-800">
                          {w.instructor?.fullName || '-'}
                        </td>
                        <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-500">
                          {new Date(w.startDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          <span className="font-semibold text-slate-900">{w.registeredCount}</span> / {w.quota}
                        </td>
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-2xs font-semibold ${
                              w.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : w.status === 'COMPLETED'
                                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {w.status === 'ACTIVE' ? 'Aktif' : w.status === 'COMPLETED' ? 'Tamamlandı' : 'Taslak'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-right whitespace-nowrap space-x-1.5">
                          <Link
                            href={`/workshops/${w.id}`}
                            className="px-2.5 py-1 rounded-md text-2xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            Detay
                          </Link>
                          <Link
                            href={`/workshops/${w.id}/edit`}
                            className="px-2.5 py-1 rounded-md text-2xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            Düzenle
                          </Link>
                          <button
                            onClick={() => handleWorkshopDeleteRequest(w)}
                            className="px-2.5 py-1 rounded-md text-2xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        Eşleşen atölye kaydı bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= EĞİTMEN YÖNETİMİ (TAM CRUD) ================= */}
      {activeTab === 'instructors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Eğitmen adı, uzmanlık alanı veya e-posta ara..."
                value={instructorSearch}
                onChange={(e) => setInstructorSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>

            <button
              onClick={() => openInstructorModal()}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs whitespace-nowrap transition-colors"
            >
              + Yeni Eğitmen Ekle
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-2xs border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3.5">Eğitmen</th>
                    <th className="py-2.5 px-3.5">Uzmanlık Alanı</th>
                    <th className="py-2.5 px-3.5">E-posta</th>
                    <th className="py-2.5 px-3.5">Bağlı Atölyeler</th>
                    <th className="py-2.5 px-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInstructors.length > 0 ? (
                    filteredInstructors.map((ins) => {
                      const workshopCount = workshops.filter((w) => w.instructorId === ins.id).length;
                      return (
                        <tr key={ins.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-900 flex items-center gap-2">
                            <img src={ins.avatarUrl} alt={ins.fullName} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                            <span>{ins.fullName}</span>
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-700 font-medium">
                            {ins.specialty}
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-500">
                            {ins.email}
                          </td>
                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-md text-2xs font-semibold ${
                              workshopCount > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {workshopCount} Atölye
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => openInstructorModal(ins)}
                              className="px-2.5 py-1 rounded-md text-2xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleInstructorDeleteRequest(ins)}
                              className="px-2.5 py-1 rounded-md text-2xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400">
                        Eşleşen eğitmen kaydı bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Eğitmen Ekle / Düzenle Modalı */}
      {isInstructorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingInstructor ? 'Eğitmen Bilgilerini Düzenle' : 'Yeni Eğitmen Ekle'}
            </h3>

            <form onSubmit={handleSaveInstructor} className="space-y-3.5">
              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  placeholder="Örn: Mehmet Demir"
                  value={instructorForm.fullName}
                  onChange={(e) => setInstructorForm({ ...instructorForm, fullName: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    instructorFormErrors.fullName ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                  }`}
                />
                {instructorFormErrors.fullName && (
                  <p className="text-3xs text-red-600 mt-1">{instructorFormErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">Uzmanlık Alanı *</label>
                <input
                  type="text"
                  placeholder="Örn: Robotik Kodlama ve IoT"
                  value={instructorForm.specialty}
                  onChange={(e) => setInstructorForm({ ...instructorForm, specialty: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    instructorFormErrors.specialty ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                  }`}
                />
                {instructorFormErrors.specialty && (
                  <p className="text-3xs text-red-600 mt-1">{instructorFormErrors.specialty}</p>
                )}
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">E-posta Adresi *</label>
                <input
                  type="email"
                  placeholder="Örn: mehmet@atolye.com"
                  value={instructorForm.email}
                  onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    instructorFormErrors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                  }`}
                />
                {instructorFormErrors.email && (
                  <p className="text-3xs text-red-600 mt-1">{instructorFormErrors.email}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInstructorModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingInstructor ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Penceresi (Modal) */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        title={deleteTarget?.type === 'workshop' ? 'Atölye Silme Onayı' : 'Eğitmen Silme Onayı'}
        itemName={deleteTarget?.title || ''}
        hasRegistrations={deleteTarget?.hasRelations ?? false}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
