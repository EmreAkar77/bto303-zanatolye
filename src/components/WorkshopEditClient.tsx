'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MockInstructor, MockWorkshop } from '@/lib/data/mockData';
import { workshopSchema } from '@/lib/validations/schemas';
import { useWorkshopData } from '@/lib/data/useWorkshopData';
import type { WorkshopData } from '@/lib/data/workshopStore';

interface WorkshopEditClientProps {
  workshopId: number;
}

interface WorkshopEditFormProps {
  workshop: MockWorkshop;
  instructors: MockInstructor[];
  updateData: (update: (current: WorkshopData) => WorkshopData) => void;
}

export default function WorkshopEditClient({ workshopId }: WorkshopEditClientProps) {
  const { data, isLoaded, updateData } = useWorkshopData();
  const workshop = data.workshops.find((item) => item.id === workshopId);

  if (!isLoaded) {
    return <div className="max-w-3xl mx-auto p-12 text-center text-slate-500 text-xs">Atölye bilgileri yükleniyor...</div>;
  }

  if (!workshop) {
    return <div className="max-w-3xl mx-auto p-12 text-center text-slate-500 text-xs">Atölye bulunamadı.</div>;
  }

  return (
    <WorkshopEditForm
      key={workshop.id}
      workshop={workshop}
      instructors={data.instructors}
      updateData={updateData}
    />
  );
}

function WorkshopEditForm({ workshop, instructors, updateData }: WorkshopEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: workshop.title,
    category: workshop.category,
    description: workshop.description,
    startDate: workshop.startDate.slice(0, 16),
    quota: workshop.quota,
    instructorId: workshop.instructorId,
    status: workshop.status,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = workshopSchema.safeParse({
      title: formData.title,
      description: formData.description,
      startDate: new Date(formData.startDate),
      quota: Number(formData.quota),
      instructorId: Number(formData.instructorId),
      status: formData.status,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const instructor = instructors.find((item) => item.id === parsed.data.instructorId);
    if (!instructor) {
      setErrors({ instructorId: 'Lütfen kayıtlı bir eğitmen seçiniz.' });
      return;
    }

    updateData((current) => ({
      ...current,
      workshops: current.workshops.map((item) =>
        item.id === workshop.id
          ? {
              ...item,
              title: parsed.data.title,
              category: formData.category,
              description: parsed.data.description,
              details: parsed.data.description,
              startDate: parsed.data.startDate.toISOString(),
              quota: parsed.data.quota,
              status: parsed.data.status,
              instructorId: instructor.id,
              instructor,
            }
          : item
      ),
    }));
    setSuccess(true);
    setTimeout(() => {
      router.push('/admin');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Atölyeyi Düzenle</h1>
          <p className="text-xs text-slate-500 mt-0.5">#{workshop.id} numaralı atölye bilgilerini güncelleyin.</p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-semibold text-slate-600 hover:text-blue-600"
        >
          ← Yönetim Paneline Dön
        </Link>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium">
          ✅ Değişiklikler başarıyla kaydedildi! Yönetim paneline aktarılıyorsunuz...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="block text-2xs font-bold text-slate-700 mb-1">Atölye Başlığı *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border text-xs focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
            }`}
          />
          {errors.title && <p className="text-3xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as MockWorkshop['category'] })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
            >
              <option value="Seramik">Seramik</option>
              <option value="Ahşap">Ahşap</option>
              <option value="Fotoğrafçılık">Fotoğrafçılık</option>
              <option value="Kahve">Kahve</option>
              <option value="Resim">Resim</option>
              <option value="Kodlama">Kodlama</option>
              <option value="Deri">Deri</option>
            </select>
          </div>

          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">Eğitmen *</label>
            <select
              value={formData.instructorId}
              onChange={(e) => setFormData({ ...formData, instructorId: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
            >
              {instructors.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.fullName} ({ins.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">Toplam Kontenjan *</label>
            <input
              type="number"
              min="1"
              max="200"
              value={formData.quota}
              onChange={(e) => setFormData({ ...formData, quota: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
            />
            {errors.quota && <p className="text-3xs text-red-600 mt-1">{errors.quota}</p>}
          </div>

          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">Durum</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as MockWorkshop['status'] })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
            >
              <option value="ACTIVE">Aktif (Kayıt Açık)</option>
              <option value="COMPLETED">Tamamlandı</option>
              <option value="DRAFT">Taslak</option>
              <option value="CANCELLED">İptal Edildi</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-2xs font-bold text-slate-700 mb-1">Açıklama *</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border text-xs focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
            }`}
          />
          {errors.description && <p className="text-3xs text-red-600 mt-1">{errors.description}</p>}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
          >
            İptal
          </Link>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
