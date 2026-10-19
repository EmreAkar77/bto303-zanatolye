// Atölyem Örnek Veri Katmanı (Mock Data)
// Gerçek Neon veritabanı bağlanana kadar arayüzün zengin ve tam işlevsel görünmesini sağlar.

export interface MockInstructor {
  id: number;
  fullName: string;
  specialty: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

export interface MockWorkshop {
  id: number;
  title: string;
  category: 'Seramik' | 'Resim' | 'Fotoğrafçılık' | 'Kahve' | 'Ahşap' | 'Kodlama' | 'Cam' | 'Deri';
  description: string;
  details: string;
  startDate: string;
  quota: number;
  registeredCount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'DRAFT' | 'CANCELLED';
  price: string;
  location: string;
  duration: string;
  imageUrl: string;
  fallbackColor: string;
  instructorId: number;
  instructor?: MockInstructor;
}

export interface MockRegistration {
  id: number;
  workshopId: number;
  participantName: string;
  participantEmail: string;
  registrationDate: string;
  status: 'REGISTERED' | 'ATTENDED' | 'CANCELLED';
}

export const mockInstructors: MockInstructor[] = [
  {
    id: 1,
    fullName: 'Ahmet Yılmaz',
    specialty: 'Geleneksel Ahşap Oymacılığı',
    email: 'ahmet.yilmaz@atolye.com',
    bio: '25 yıllık ahşap restorasyon ve geleneksel oyma ustası. Tarihi konaklar ve antik mobilyalar üzerine uzman.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 2,
    fullName: 'Zeynep Kaya',
    specialty: 'Seramik ve Çömlekçilik',
    email: 'zeynep.kaya@atolye.com',
    bio: 'Mimar Sinan Güzel Sanatlar mezunu; seramik tornası ve yüksek dereceli sır pişirimi konusunda 10+ yıl deneyimli.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 3,
    fullName: 'Mehmet Demir',
    specialty: 'Robotik Kodlama ve IoT',
    email: 'mehmet.demir@atolye.com',
    bio: 'Yazılım mühendisi ve maker kültür öncüsü. Çocuklar ve yetişkinler için gömülü sistemler eğitimleri veriyor.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 4,
    fullName: 'Elif Şahin',
    specialty: 'Klasik Türk Ebru Sanatı',
    email: 'elif.sahin@atolye.com',
    bio: 'Geleneksel su üzeri resim sanatı icazetli ebruzen. Doğal toprak boyalar ve at kılı fırçalarla özgün sergiler açtı.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 5,
    fullName: 'Burak Çelik',
    specialty: 'El Dikişi Deri Zanaatı',
    email: 'burak.celik@atolye.com',
    bio: 'Kişiye özel lüks deri çanta ve aksesuar tasarımcısı. Saraç dikişi tekniğinin Türkiye\'deki genç temsilcilerinden.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 6,
    fullName: 'Selin Doğan',
    specialty: 'Nitelikli Kahve ve Barista Sanatı',
    email: 'selin.dogan@atolye.com',
    bio: 'SCA sertifikalı profesyonel barista eğitmeni. Çekirdek kavurma profilleri ve demleme kimyası uzmanı.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 7,
    fullName: 'Can Öztürk',
    specialty: 'Manuel Fotoğrafçılık & Karanlık Oda',
    email: 'can.ozturk@atolye.com',
    bio: 'Belgesel fotoğrafçısı. Analog film banyosu, sokak fotoğrafçılığı ve ışık kompozisyonu atölyeleri yürütüyor.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
  },
];

export const mockWorkshops: MockWorkshop[] = [
  {
    id: 1,
    title: 'Çömlekçi Tornasında Form Verme ve Sırlama',
    category: 'Seramik',
    description: 'Kendi seramik fincanınızı veya vazonuzu çark başında ellerinizle şekillendirin.',
    details: 'Bu atölyede çömlekçi tornasında kil merkezleme, silindir çekme ve ağız açma tekniklerini öğreneceksiniz. İlk gün şekillendirilen ürünler kurutulduktan sonra ikinci aşamada renkli sırlarla kaplanıp yüksek fırında fırınlanacaktır. Tüm kil ve koruyucu önlükler atölyemizce temin edilir.',
    startDate: '2026-10-26T14:00:00Z',
    quota: 8,
    registeredCount: 5,
    status: 'ACTIVE',
    price: '1.250 ₺',
    location: 'Kadıköy Sanat Stüdyosu, İstanbul',
    duration: '3 Saat (Tek Seans)',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#d97706',
    instructorId: 2,
  },
  {
    id: 2,
    title: 'Geleneksel Ahşap Oyma ve Rölyef Çalışması',
    category: 'Ahşap',
    description: 'Ihlamur ağacı bloğu üzerinde oyma bıçaklarıyla geleneksel motifleri hayata geçirin.',
    details: 'Ağaç lif yönlerini okuma, iskarpela ve oyma bıçağı bileme teknikleriyle başlayıp adım adım kendi ahşap duvar panonuzu oluşturacaksınız. Güvenli tutuş teknikleri ve son kat keten tohumu yağı uygulaması eğitimi dahildir.',
    startDate: '2026-10-28T11:00:00Z',
    quota: 6,
    registeredCount: 6, // Kontenjan doldu örneği!
    status: 'ACTIVE',
    price: '1.400 ₺',
    location: 'Moda Zanaat Evi, İstanbul',
    duration: '4 Saat',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#78350f',
    instructorId: 1,
  },
  {
    id: 3,
    title: '35mm Analog Sokak Fotoğrafçılığı ve Kompozisyon',
    category: 'Fotoğrafçılık',
    description: 'Şehrin ritmini vizörden yakalayın; diyafram, enstantane ve doğal ışık dengesi kurun.',
    details: 'Fotoğrafçılık teorisini sahada pratiğe döküyoruz. Karaköy ve Galata sokaklarında 2 saatlik çekim turunun ardından atölyeye dönüp çekilen karelerin kadraj ve hikaye anlatımı kritiğini yapacağız.',
    startDate: '2026-10-30T10:00:00Z',
    quota: 10,
    registeredCount: 3,
    status: 'ACTIVE',
    price: '950 ₺',
    location: 'Galata Görsel Sanatlar Alanı, İstanbul',
    duration: '4 Saat',
    imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#1e293b',
    instructorId: 7,
  },
  {
    id: 4,
    title: 'Nitelikli Kahve Demleme & Latte Art Teknikleri',
    category: 'Kahve',
    description: 'V60, Aeropress ve Chemex ile demleme reçeteleri; kusursuz süt kreması ve latte sanatı.',
    details: 'Farklı coğrafyaların çekirdek tat profillerini tadacak, su sıcaklığı ve öğütüm derecesinin fincandaki etkisini bizzat ölçeceksiniz. Espresso makinesinde buhar çubuğu ile kadife kıvamında süt kreması hazırlayıp kalp ve lale desenleri dökeceksiniz.',
    startDate: '2026-11-02T13:00:00Z',
    quota: 10,
    registeredCount: 4,
    status: 'ACTIVE',
    price: '1.100 ₺',
    location: 'Beşiktaş Kahve Akademisi, İstanbul',
    duration: '2.5 Saat',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#451a03',
    instructorId: 6,
  },
  {
    id: 5,
    title: 'Islak Üzerine Islak Suluboya Peyzaj Çizimi',
    category: 'Resim',
    description: 'Pamuk kağıtta renklerin özgürce yayılmasını yönetin ve derinlikli bir manzara üretin.',
    details: 'Suluboyada su dengesi kurma, fırça darbeleriyle gökyüzü bulutları ve su yansımaları oluşturma çalışmaları yapılacaktır. Atölye sonunda her katılımcı çerçevelenmeye hazır 30x40 cm bir suluboya tablosuyla ayrılacaktır.',
    startDate: '2026-11-05T15:00:00Z',
    quota: 12,
    registeredCount: 7,
    status: 'ACTIVE',
    price: '850 ₺',
    location: 'Cihangir Sanat Atölyesi, İstanbul',
    duration: '3 Saat',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#2563eb',
    instructorId: 4,
  },
  {
    id: 6,
    title: 'Python ve ESP32 ile IoT Sensör Programlama',
    category: 'Kodlama',
    description: 'Fiziksel dünyayı internete bağlayın; ortam verilerini okuyup buluta aktaran cihaz üretin.',
    details: 'MicroPython dili kullanılarak ESP32 mikrodenetleyici üzerinde sıcaklık, nem ve hareket sensörleri okunacak; web paneli üzerinden gerçek zamanlı grafikleme ve röle kontrolü yapılacaktır. Önceden kodlama bilgisi gerekmez.',
    startDate: '2026-11-08T10:00:00Z',
    quota: 15,
    registeredCount: 8,
    status: 'ACTIVE',
    price: '1.600 ₺',
    location: 'Maslak Maker Laboratuvarı, İstanbul',
    duration: '5 Saat',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#059669',
    instructorId: 3,
  },
  {
    id: 7,
    title: 'El Yapımı Deri Kartlık ve Pasaport Kılıfı',
    category: 'Deri',
    description: 'Gerçek vaketa deriyi elle kesip delerek dayanıklı bir seyahat aksesuarına dönüştürün.',
    details: 'Deri el zanaatının temel prensipleri: şablon çıkarma, kenar tıraşlama, balmumlu iple çift iğne dikişi ve kenar perdahlama işlemleri adım adım uygulanacaktır.',
    startDate: '2026-11-12T14:00:00Z',
    quota: 8,
    registeredCount: 2,
    status: 'ACTIVE',
    price: '1.300 ₺',
    location: 'Balat Deri Atölyesi, İstanbul',
    duration: '3.5 Saat',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#b45309',
    instructorId: 5,
  },
  {
    id: 8,
    title: 'Tarihi Restorasyon Semineri (Geçmiş Atölye)',
    category: 'Ahşap',
    description: 'Eski ahşap eserlerin belgelenmesi ve gomalak cila uygulamaları (Tamamlandı).',
    details: 'Bu atölye geçmiş tarihlidir ve yeni kayıt kabul edilmemektedir (İş Kuralı 3 kanıtı).',
    startDate: '2026-10-01T10:00:00Z', // Geçmiş tarih örneği!
    quota: 10,
    registeredCount: 10,
    status: 'COMPLETED',
    price: '1.200 ₺',
    location: 'Moda Zanaat Evi, İstanbul',
    duration: '4 Saat',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#64748b',
    instructorId: 1,
  },
];

// İlişkileri bağla
mockWorkshops.forEach((w) => {
  w.instructor = mockInstructors.find((i) => i.id === w.instructorId);
});
