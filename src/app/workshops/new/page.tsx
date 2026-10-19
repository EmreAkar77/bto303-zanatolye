'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockInstructors } from '@/lib/data/mockData';
import { workshopSchema } from '@/lib/validations/schemas';

export default function NewWorkshopPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Seramik',
    description: '',
    startDate: '',
    quota: 10,
    instructorId: 1,
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Zod Doğrulama
    const parsed = workshopSchema.safeParse({
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
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

    setSuccess(true);
    setTimeout(() => {
      router.push('/admin');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Yeni Atölye Oluştur</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Gerekli bilgileri eksiksiz doldurarak yeni bir atölye kaydı açın.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-semibold text-neutral-600 hover:text-amber-700"
        >
          ← Vazgeç
        </Link>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
          ✅ Atölye başarıyla oluşturuldu! Yönetim paneline yönlendiriliyorsunuz...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
        {/* Başlık */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Atölye Başlığı *
          </label>
          <input
            type="text"
            placeholder="Örn: Çömlekçi Tornasında Form Verme"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-amber-500 ${
              errors.title ? 'border-red-400 bg-red-50/50' : 'border-neutral-200'
            }`}
          />
          {errors.title && <p className="text-2xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        {/* Kategori ve Eğitmen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white focus:ring-2 focus:ring-amber-500"
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
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Atölye Eğitmeni *
            </label>
            <select
              value={formData.instructorId}
              onChange={(e) => setFormData({ ...formData, instructorId: Number(e.target.value) })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white focus:ring-2 focus:ring-amber-500 ${
                errors.instructorId ? 'border-red-400 bg-red-50/50' : 'border-neutral-200'
              }`}
            >
              {mockInstructors.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.fullName} ({ins.specialty})
                </option>
              ))}
            </select>
            {errors.instructorId && <p className="text-2xs text-red-600 mt-1">{errors.instructorId}</p>}
          </div>
        </div>

        {/* Tarih ve Kontenjan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Başlangıç Tarihi ve Saati *
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-amber-500 ${
                errors.startDate ? 'border-red-400 bg-red-50/50' : 'border-neutral-200'
              }`}
            />
            {errors.startDate && <p className="text-2xs text-red-600 mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Toplam Kontenjan *
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.quota}
              onChange={(e) => setFormData({ ...formData, quota: Number(e.target.value) })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-amber-500 ${
                errors.quota ? 'border-red-400 bg-red-50/50' : 'border-neutral-200'
              }`}
            />
            {errors.quota && <p className="text-2xs text-red-600 mt-1">{errors.quota}</p>}
          </div>
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Detaylı Açıklama *
          </label>
          <textarea
            rows={4}
            placeholder="Atölyede katılımcılara neler öğretilecek, hangi malzemeler kullanılacak?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-amber-500 ${
              errors.description ? 'border-red-400 bg-red-50/50' : 'border-neutral-200'
            }`}
          />
          {errors.description && <p className="text-2xs text-red-600 mt-1">{errors.description}</p>}
        </div>

        {/* Butonlar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200"
          >
            İptal
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-xs"
          >
            Atölyeyi Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
