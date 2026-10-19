// Saf (Pure) İş Kuralları - Atölyem
// Harici servis veya veritabanı yan etkisi içermez; doğrudan test edilebilir.

export interface RuleResult {
  allowed: boolean;
  code?: 'QUOTA_FULL' | 'ALREADY_REGISTERED' | 'PAST_DATE' | 'INVALID_DATA';
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
      message: 'Bu katılımcı atölyeye zaten kayıtlıdır.',
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
