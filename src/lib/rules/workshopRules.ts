// Saf (Pure) İş Kuralları - Atölyem
// Harici servis veya veritabanı yan etkisi içermez; doğrudan ve deterministik test edilebilir.

export interface RuleResult {
  allowed: boolean;
  code?: 'QUOTA_FULL' | 'ALREADY_REGISTERED' | 'PAST_DATE' | 'INVALID_DATA' | 'RESTRICT_VIOLATION';
  message?: string;
}

/**
 * İş Kuralı 1: Kontenjan Kontrolü
 * Kontenjanı dolmuş atölyeye yeni kayıt yapılamaz.
 */
export function checkWorkshopQuota(currentRegistrationsCount: number, quota: number): RuleResult {
  if (quota <= 0) {
    return {
      allowed: false,
      code: 'INVALID_DATA',
      message: 'Atölye kontenjanı pozitif bir tam sayı olmalıdır.',
    };
  }

  if (currentRegistrationsCount >= quota) {
    return {
      allowed: false,
      code: 'QUOTA_FULL',
      message: 'Atölye kontenjanı tamamen dolmuştur, yeni kayıt kabul edilemez.',
    };
  }

  return { allowed: true };
}

/**
 * İş Kuralı 2: Mükerrer Kayıt Engeli
 * Aynı katılımcı aynı atölyeye iki kez kaydolamaz.
 */
export function checkDuplicateRegistration(
  existingParticipantIds: number[],
  participantId: number
): RuleResult {
  if (!participantId || participantId <= 0) {
    return {
      allowed: false,
      code: 'INVALID_DATA',
      message: 'Geçersiz katılımcı kimliği.',
    };
  }

  if (existingParticipantIds.includes(participantId)) {
    return {
      allowed: false,
      code: 'ALREADY_REGISTERED',
      message: 'Bu katılımcı bu atölyeye zaten kayıtlıdır.',
    };
  }

  return { allowed: true };
}

/**
 * İş Kuralı 3: Başlangıç Tarihi Kontrolü
 * Başlangıç tarihi geçmiş atölyeye yeni kayıt yapılamaz.
 */
export function checkWorkshopStartDate(
  workshopStartDate: Date | string | number,
  currentDate: Date = new Date()
): RuleResult {
  const targetDate = new Date(workshopStartDate);
  if (isNaN(targetDate.getTime())) {
    return {
      allowed: false,
      code: 'INVALID_DATA',
      message: 'Geçersiz başlangıç tarihi formatı.',
    };
  }

  if (targetDate.getTime() <= currentDate.getTime()) {
    return {
      allowed: false,
      code: 'PAST_DATE',
      message: 'Başlangıç tarihi geçmiş atölyelere yeni kayıt yapılamaz.',
    };
  }

  return { allowed: true };
}

/**
 * Kural 4: İptal Edilen Kayıtların Kontenjan Hesabı
 * İptal edilmiş (CANCELLED) kayıtlar kontenjan tüketmez; yalnızca REGISTERED ve ATTENDED kayıtlar sayılır.
 */
export function calculateActiveQuotaUsage(
  registrations: { status: 'REGISTERED' | 'ATTENDED' | 'CANCELLED' | string }[]
): number {
  return registrations.filter(
    (r) => r.status === 'REGISTERED' || r.status === 'ATTENDED'
  ).length;
}

/**
 * Kural 5: Silme ve İlişkisel Bütünlük Kontrolü (onDelete: Restrict)
 * İlişkili atölyesi bulunan eğitmen doğrudan silinemez.
 */
export function canDeleteInstructor(
  instructorId: number,
  workshops: { instructorId: number }[]
): RuleResult {
  const relatedCount = workshops.filter((w) => w.instructorId === instructorId).length;
  if (relatedCount > 0) {
    return {
      allowed: false,
      code: 'RESTRICT_VIOLATION',
      message: `Bu eğitmene ait ${relatedCount} adet atölye bulunmaktadır. Eğitmen silinmeden önce atölyeleri kaldırılmalı veya başka eğitmene devredilmelidir.`,
    };
  }
  return { allowed: true };
}

/**
 * Kural 6: Silme ve İlişkisel Bütünlük Kontrolü (onDelete: Restrict)
 * Kayıtlı katılımcısı bulunan atölye doğrudan silinemez.
 */
export function canDeleteWorkshop(
  workshopId: number,
  registrations: { workshopId: number; status?: string }[]
): RuleResult {
  const activeRegistrations = registrations.filter(
    (r) => r.workshopId === workshopId && r.status !== 'CANCELLED'
  );
  if (activeRegistrations.length > 0) {
    return {
      allowed: false,
      code: 'RESTRICT_VIOLATION',
      message: `Bu atölyeye kayıtlı ${activeRegistrations.length} adet katılımcı bulunmaktadır. Kayıt geçmişi olan atölyeler doğrudan silinemez.`,
    };
  }
  return { allowed: true };
}

/**
 * Birleşik Kayıt Uygunluk Denetleyicisi
 * 3 saf kuralı sırasıyla işletir. İlk takılan kuralın gerekçesini döner.
 */
export function validateRegistrationEligibility(params: {
  workshopStartDate: Date | string | number;
  quota: number;
  currentRegistrationsCount: number;
  existingParticipantIds: number[];
  participantId: number;
  currentDate?: Date;
}): RuleResult {
  // 1. Tarih kontrolü
  const dateCheck = checkWorkshopStartDate(params.workshopStartDate, params.currentDate);
  if (!dateCheck.allowed) return dateCheck;

  // 2. Kontenjan kontrolü
  const quotaCheck = checkWorkshopQuota(params.currentRegistrationsCount, params.quota);
  if (!quotaCheck.allowed) return quotaCheck;

  // 3. Mükerrer kayıt kontrolü
  const dupCheck = checkDuplicateRegistration(params.existingParticipantIds, params.participantId);
  if (!dupCheck.allowed) return dupCheck;

  return { allowed: true };
}

/**
 * Eşzamanlı (Concurrent) Kayıt Denetimi Simülatörü
 * İki veya daha fazla eşzamanlı kayıt isteği geldiğinde kontenjan aşımını önler.
 */
export function processRegistrationBatch(
  quota: number,
  initialCount: number,
  requests: { participantId: number; registeredAt: number }[]
): {
  successful: number[];
  rejected: { participantId: number; reason: string }[];
} {
  const successful: number[] = [];
  const rejected: { participantId: number; reason: string }[] = [];
  let currentCount = initialCount;
  const processedParticipantIds = new Set<number>();

  // Zaman sırasına göre sırala
  const sortedRequests = [...requests].sort((a, b) => a.registeredAt - b.registeredAt);

  for (const req of sortedRequests) {
    if (processedParticipantIds.has(req.participantId)) {
      rejected.push({
        participantId: req.participantId,
        reason: 'Aynı katılımcı mükerrer kayıt gönderdi.',
      });
      continue;
    }

    if (currentCount >= quota) {
      rejected.push({
        participantId: req.participantId,
        reason: 'Kontenjan doldu, eşzamanlı istek reddedildi.',
      });
      continue;
    }

    successful.push(req.participantId);
    processedParticipantIds.add(req.participantId);
    currentCount++;
  }

  return { successful, rejected };
}
