import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-20 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-lg">
                A
              </span>
              <span className="text-xl font-bold text-white tracking-tight">Atölyem</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              Geleneksel Türk zanaatlerinden çağdaş dijital üretim teknolojilerine kadar uzanan kapsamlı atölye ve workshop kayıt platformu. Usta ellerle katılımcıları buluşturur.
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-400 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700">Next.js 16</span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700">TypeScript</span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700">Prisma ORM</span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700">Neon Postgres</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">Tüm Atölyeler</Link>
              </li>
              <li>
                <Link href="/instructors" className="hover:text-amber-400 transition-colors">Eğitmenlerimiz</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">Yönetim Paneli</Link>
              </li>
              <li>
                <Link href="/workshops/new" className="hover:text-amber-400 transition-colors">Yeni Atölye Oluştur</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">İletişim & Konum</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Kadıköy & Moda Tasarım Stüdyoları<br />
              İstanbul, Türkiye<br />
              <span className="text-amber-400">destek@atolye.com</span>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© 2026 Atölyem Workshop Yönetim Sistemi. BTÖ-303 Ara Uygulama 2.</p>
          <p className="mt-2 sm:mt-0">Örnek veri ve canlı arayüz prototipi</p>
        </div>
      </div>
    </footer>
  );
}
