import { PrismaClient, WorkshopStatus, RegistrationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Atölyem veritabanı tohumlama işlemi başlatılıyor...');

  // 1. Eğitmenler (Instructor) - En az 10 gerçekçi kayıt (İdempotent: upsert ile)
  const instructorsData = [
    { fullName: 'Ahmet Yılmaz', specialty: 'Geleneksel Ahşap Oymacılığı', email: 'ahmet.yilmaz@atolye.com' },
    { fullName: 'Zeynep Kaya', specialty: 'Seramik ve Çömlekçilik', email: 'zeynep.kaya@atolye.com' },
    { fullName: 'Mehmet Demir', specialty: 'Robotik Kodlama ve Nesnelerin İnterneti', email: 'mehmet.demir@atolye.com' },
    { fullName: 'Elif Şahin', specialty: 'Klasik Türk Ebru Sanatı', email: 'elif.sahin@atolye.com' },
    { fullName: 'Burak Çelik', specialty: 'Doğal Deri Çanta ve Cüzdan İşleme', email: 'burak.celik@atolye.com' },
    { fullName: 'Ayşe Yıldız', specialty: 'Dijital İllüstrasyon ve Karakter Tasarımı', email: 'ayse.yildiz@atolye.com' },
    { fullName: 'Can Öztürk', specialty: 'Cam Füzyon ve Vitray Yapımı', email: 'can.ozturk@atolye.com' },
    { fullName: 'Fatma Aydın', specialty: 'Suluboya Peyzaj ve Botanik İllüstrasyon', email: 'fatma.aydin@atolye.com' },
    { fullName: 'Emre Koç', specialty: '3B Modelleme ve Katmanlı Üretim', email: 'emre.koc@atolye.com' },
    { fullName: 'Deniz Arslan', specialty: 'Doğal Bitkisel Mum ve Sabun Tasarımı', email: 'deniz.arslan@atolye.com' },
    { fullName: 'Selin Doğan', specialty: 'Çağdaş Gümüş Takı Tasarımı', email: 'selin.dogan@atolye.com' },
  ];

  const instructors = [];
  for (const data of instructorsData) {
    const instructor = await prisma.instructor.upsert({
      where: { email: data.email },
      update: { fullName: data.fullName, specialty: data.specialty },
      create: data,
    });
    instructors.push(instructor);
  }
  console.log(`✅ ${instructors.length} eğitmen başarıyla tohumlandı.`);

  // 2. Atölyeler (Workshop) - En az 10 gerçekçi kayıt (Gelecek, geçmiş, aktif, tamamlanmış)
  const now = new Date();
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const threeWeeksLater = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const workshopsData = [
    {
      title: 'Temel Ahşap Oyma ve Oyma Bıçağı Kullanımı',
      description: 'Ahşap oyma sanatına giriş, ağaç türlerini tanıma, oyma bıçaklarının doğru bilenmesi ve ilk ıhlamur rölyef çalışması.',
      startDate: oneWeekLater,
      quota: 8,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[0].id,
    },
    {
      title: 'Çömlekçi Tornasında Form Verme Teknikleri',
      description: 'Kil hazırlığı, merkezleme, fincan ve vazo formlarının çekilmesi, sırlama prensiplerine giriş atölyesi.',
      startDate: twoWeeksLater,
      quota: 6,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[1].id,
    },
    {
      title: 'ESP32 ile Akıllı Ev Projeleri Geliştirme',
      description: 'Mikrodenetleyici programlama, sensör okuma, Wi-Fi üzerinden MQTT protokolü ile uzaktan kontrol uygulamaları.',
      startDate: threeWeeksLater,
      quota: 12,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[2].id,
    },
    {
      title: 'Geleneksel Battal ve Gelgit Ebru Yapımı',
      description: 'Kitre hazırlama, doğal toprak boyaların ezilmesi, öd ayarı ve kağıda aktarım incelikleri.',
      startDate: oneWeekLater,
      quota: 10,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[3].id,
    },
    {
      title: 'El Dikişi Deri Kartlık ve Cüzdan Üretimi',
      description: 'Vaketa deri kesimi, delik açma ve saraç dikişi tekniği ile ömürlük kişisel deri aksesuar üretimi.',
      startDate: twoWeeksLater,
      quota: 8,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[4].id,
    },
    {
      title: 'Procreate ile Karakter ve Konsept Çizimi',
      description: 'Dijital katman yönetimi, fırça ayarları, anatomik eskizleme ve ışık-gölge boyama teknikleri.',
      startDate: threeWeeksLater,
      quota: 15,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[5].id,
    },
    {
      title: 'Renkli Cam Füzyon Tabak ve Takı Yapımı',
      description: 'Cam kesme, opal ve şeffaf cam kombinasyonları, fırınlama eğrileri ve sıcak cam sanatı.',
      startDate: oneWeekLater,
      quota: 5,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[6].id,
    },
    {
      title: 'Islak Üzerine Islak Suluboya Doğa Manzarası',
      description: 'Pamuk kağıt seçimi, renk teorisi, kontrollü yayılma teknikleri ve atmosferik derinlik yakalama.',
      startDate: twoWeeksLater,
      quota: 10,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[7].id,
    },
    {
      title: 'Blender ile 3B Nesne Modelleme ve 3B Baskı',
      description: 'Poligon modelleme, mesh optimizasyonu ve dilimleme yazılımı ile 3B yazıcıdan ilk fiziksel çıktı.',
      startDate: threeWeeksLater,
      quota: 10,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[8].id,
    },
    {
      title: 'Soya Mumları ve Aromaterapik Uçucu Yağlar',
      description: 'Ekolojik soya mumu dökümü, ahşap fitil kullanımı ve esansiyel yağlarla koku piramidi tasarımı.',
      startDate: oneWeekLater,
      quota: 12,
      status: WorkshopStatus.ACTIVE,
      instructorId: instructors[9].id,
    },
    {
      title: 'Geçmiş Dönem Ahşap Restorasyon Semineri',
      description: 'Eski dönem mobilyalarının kurtarılması, gomalak cila ve kurtlanma önleyici bakım prensipleri (Tamamlandı).',
      startDate: oneMonthAgo,
      quota: 10,
      status: WorkshopStatus.COMPLETED,
      instructorId: instructors[0].id,
    },
    {
      title: 'Mikro Makrome ve Doğal Taş Dizimi (Taslak)',
      description: 'Düğümleme teknikleri ile bileklik ve kolye tasarımları için hazırlık süreci.',
      startDate: threeWeeksLater,
      quota: 6,
      status: WorkshopStatus.DRAFT,
      instructorId: instructors[10].id,
    },
  ];

  const workshops = [];
  for (const data of workshopsData) {
    const existing = await prisma.workshop.findFirst({
      where: { title: data.title, instructorId: data.instructorId },
    });
    if (existing) {
      const updated = await prisma.workshop.update({
        where: { id: existing.id },
        data,
      });
      workshops.push(updated);
    } else {
      const created = await prisma.workshop.create({ data });
      workshops.push(created);
    }
  }
  console.log(`✅ ${workshops.length} atölye başarıyla tohumlandı.`);

  // 3. Katılımcılar (Participant) - En az 10 gerçekçi kayıt (upsert ile)
  const participantsData = [
    { fullName: 'Ali Çetin', email: 'ali.cetin@example.com' },
    { fullName: 'Merve Bozkurt', email: 'merve.bozkurt@example.com' },
    { fullName: 'Oğuzhan Tekin', email: 'oguzhan.tekin@example.com' },
    { fullName: 'Gizem Vural', email: 'gizem.vural@example.com' },
    { fullName: 'Serkan Güler', email: 'serkan.guler@example.com' },
    { fullName: 'Büşra Keskin', email: 'busra.keskin@example.com' },
    { fullName: 'Kemal Erdem', email: 'kemal.erdem@example.com' },
    { fullName: 'Ece Polat', email: 'ece.polat@example.com' },
    { fullName: 'Onur Şimşek', email: 'onur.simsek@example.com' },
    { fullName: 'Derya Özdemir', email: 'derya.ozdemir@example.com' },
    { fullName: 'Tolga Çakır', email: 'tolga.cakir@example.com' },
    { fullName: 'Hande Kurt', email: 'hande.kurt@example.com' },
  ];

  const participants = [];
  for (const data of participantsData) {
    const participant = await prisma.participant.upsert({
      where: { email: data.email },
      update: { fullName: data.fullName },
      create: data,
    });
    participants.push(participant);
  }
  console.log(`✅ ${participants.length} katılımcı başarıyla tohumlandı.`);

  // 4. Atölye Kayıtları (WorkshopRegistration) - En az 10 gerçekçi ara model kaydı (upsert ile)
  const registrationsData = [
    { workshopId: workshops[0].id, participantId: participants[0].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[0].id, participantId: participants[1].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[0].id, participantId: participants[2].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[1].id, participantId: participants[3].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[1].id, participantId: participants[4].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[2].id, participantId: participants[5].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[2].id, participantId: participants[6].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[3].id, participantId: participants[7].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[4].id, participantId: participants[8].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[5].id, participantId: participants[9].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[6].id, participantId: participants[10].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[7].id, participantId: participants[11].id, status: RegistrationStatus.REGISTERED },
    { workshopId: workshops[10].id, participantId: participants[0].id, status: RegistrationStatus.ATTENDED },
    { workshopId: workshops[10].id, participantId: participants[1].id, status: RegistrationStatus.ATTENDED },
  ];

  let regCount = 0;
  for (const data of registrationsData) {
    await prisma.workshopRegistration.upsert({
      where: {
        unique_workshop_participant: {
          workshopId: data.workshopId,
          participantId: data.participantId,
        },
      },
      update: { status: data.status },
      create: data,
    });
    regCount++;
  }
  console.log(`✅ ${regCount} atölye kaydı başarıyla tohumlandı.`);

  console.log('🎉 Tohumlama işlemi başarıyla tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Tohumlama hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
