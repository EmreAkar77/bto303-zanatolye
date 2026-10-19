'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MockWorkshop } from '@/lib/data/mockData';
import { workshopSchema } from '@/lib/validations/schemas';
import { useWorkshopData } from '@/lib/data/useWorkshopData';

export default function NewWorkshopPage() {
  const router = useRouter();
  const { data, updateData } = useWorkshopData();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Seramik' as MockWorkshop['category'],
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

    const instructor = data.instructors.find((item) => item.id === parsed.data.instructorId);
    if (!instructor) {
      setErrors({ instructorId: 'Lütfen kayıtlı bir eğitmen seçiniz.' });
      return;
    }

    updateData((current) => {
      const newWorkshop: MockWorkshop = {
        id: Math.max(...current.workshops.map((workshop) => workshop.id), 0) + 1,
        title: parsed.data.title,
        category: formData.category,
        description: parsed.data.description,
        details: parsed.data.description,
        startDate: parsed.data.startDate.toISOString(),
        quota: parsed.data.quota,
        registeredCount: 0,
        status: parsed.data.status,
        price: 'Bilgi için iletişime geçin',
        location: 'Atölye bilgisi için iletişime geçin',
        duration: 'Belirtilmedi',
        imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80',
        fallbackColor: '#64748b',
        instructorId: instructor.id,
        instructor,
      };

      return { ...current, workshops: [...current.workshops, newWorkshop] };
    });
    setSuccess(true);
    setTimeout(() => {
      router.push('/admin');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Yeni Atölye Oluştur</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerekli bilgileri eksiksiz doldurarak sisteme yeni bir atölye ekleyin.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-semibold text-slate-600 hover:text-blue-600"
        >
          ← Vazgeç
        </Link>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium">
          ✅ Atölye başarıyla oluşturuldu! Yönetim paneline aktarılıyorsunuz...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Başlık */}
        <div>
          <label className="block text-2xs font-bold text-slate-700 mb-1">
            Atölye Başlığı *
          </label>
          <input
            type="text"
            placeholder="Örn: Çömlekçi Tornasında Form Verme"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
            }`}
          />
          {errors.title && <p className="text-3xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        {/* Kategori ve Eğitmen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as MockWorkshop['category'] })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-2xs font-bold text-slate-700 mb-1">
              Atölye Eğitmeni *
            </label>
            <select
              value={formData.instructorId}
              onChange={(e) => setFormData({ ...formData, instructorId: Number(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 ${
                errors.instructorId ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
              }`}
            >
              {data.instructors.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.fullName} ({ins.specialty})
                </option>
              ))}
            </select>
            {errors.instructorId && <p className="text-3xs text-red-600 mt-1">{errors.instructorId}</p>}
          </div>
        </div>

        {/* Tarih ve Kontenjan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">
              Başlangıç Tarihi ve Saati *
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
              }`}
            />
            {errors.startDate && <p className="text-3xs text-red-600 mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">
              Toplam Kontenjan *
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={formData.quota}
              onChange={(e) => setFormData({ ...formData, quota: Number(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 ${
                errors.quota ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
              }`}
            />
            {errors.quota && <p className="text-3xs text-red-600 mt-1">{errors.quota}</p>}
          </div>
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-2xs font-bold text-slate-700 mb-1">
            Detaylı Açıklama *
          </label>
          <textarea
            rows={4}
            placeholder="Atölyede katılımcılara neler aktarılacak, hedeflenen kazanımlar nelerdir?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
            }`}
          />
          {errors.description && <p className="text-3xs text-red-600 mt-1">{errors.description}</p>}
        </div>

        {/* Butonlar */}
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
            Atölyeyi Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
