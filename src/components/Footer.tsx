import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 mt-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                A
              </span>
              <span className="text-lg font-bold text-slate-900 tracking-tight">Atölyem</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Geleneksel zanaatler ve modern tasarım atölyeleri kayıt yönetim sistemi. Katılımcılarla usta eğitmenleri buluşturan kurumsal platform.
            </p>
            <div className="flex flex-wrap gap-2 text-2xs text-slate-600 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Next.js 16.4</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">TypeScript</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Prisma ORM</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Neon PostgreSQL</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Vitest</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Sayfalar</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">Tüm Atölyeler</Link>
              </li>
              <li>
                <Link href="/instructors" className="text-slate-600 hover:text-blue-600 transition-colors">Eğitmenler</Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-600 hover:text-blue-600 transition-colors">Yönetim Paneli</Link>
              </li>
              <li>
                <Link href="/workshops/new" className="text-slate-600 hover:text-blue-600 transition-colors">Yeni Atölye Aç</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">İletişim</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Moda & Kadıköy Tasarım Atölyeleri<br />
              İstanbul, Türkiye<br />
              <span className="text-blue-600 font-medium">iletisim@atolye.com</span>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-2xs text-slate-400">
          <p>© 2026 Atölyem Workshop Yönetim Sistemi — BTÖ-303 Ara Uygulama 2</p>
          <p className="mt-1 sm:mt-0">Temiz Beyaz Tema & Responsive Tasarım</p>
        </div>
      </div>
    </footer>
  );
}
