import { describe, it, expect } from 'vitest';
import {
  checkWorkshopQuota,
  checkDuplicateRegistration,
  checkWorkshopStartDate,
  calculateActiveQuotaUsage,
  canDeleteInstructor,
  canDeleteWorkshop,
  validateRegistrationEligibility,
  processRegistrationBatch,
} from '@/lib/rules/workshopRules';

describe('Saf İş Kuralları ve Senaryo Testleri (Comprehensive Business Rules)', () => {
  const fixedNow = new Date('2026-10-19T10:00:00Z');
  const futureWorkshopDate = new Date('2026-10-25T14:00:00Z');
  const pastWorkshopDate = new Date('2026-10-15T10:00:00Z');

  describe('Senaryo Grubu 1: Kontenjan ve Adım Adım Kayıt Akışı', () => {
    const quota = 3;

    it('Senaryo 1: Kontenjanı 3 olan atölyeye ilk katılımcı (1/3) başarıyla kaydedilmelidir', () => {
      const result = checkWorkshopQuota(0, quota);
      expect(result.allowed).toBe(true);
      expect(result.code).toBeUndefined();
    });

    it('Senaryo 2: İkinci ve üçüncü katılımcı kaydedilebilmeli, kontenjan sınırına ulaşılmalıdır', () => {
      const secondResult = checkWorkshopQuota(1, quota);
      expect(secondResult.allowed).toBe(true);

      const thirdResult = checkWorkshopQuota(2, quota);
      expect(thirdResult.allowed).toBe(true);
    });

    it('Senaryo 3: Kontenjan (3/3) dolduğunda dördüncü kayıt girişimi reddedilmelidir', () => {
      const fourthResult = checkWorkshopQuota(3, quota);
      expect(fourthResult.allowed).toBe(false);
      expect(fourthResult.code).toBe('QUOTA_FULL');
      expect(fourthResult.message).toContain('kontenjanı tamamen dolmuştur');
    });
  });

  describe('Senaryo Grubu 2: Mükerrerlik ve Farklı Atölyelere Kayıt', () => {
    it('Senaryo 4: Aynı katılımcıyı aynı atölyeye tekrar kaydetme girişimi engellenmelidir', () => {
      const existingInWorkshop1 = [101, 102, 103];
      const duplicateResult = checkDuplicateRegistration(existingInWorkshop1, 102);
      expect(duplicateResult.allowed).toBe(false);
      expect(duplicateResult.code).toBe('ALREADY_REGISTERED');
      expect(duplicateResult.message).toContain('zaten kayıtlıdır');
    });

    it('Senaryo 5: Aynı katılımcı farklı bir atölyeye (katılımcı listesinde yoksa) başarıyla kaydolabilmelidir', () => {
      const existingInWorkshop2 = [201, 202]; // 102 bu listede yok
      const allowedResult = checkDuplicateRegistration(existingInWorkshop2, 102);
      expect(allowedResult.allowed).toBe(true);
    });
  });

  describe('Senaryo Grubu 3: Tarih ve Geçmiş Atölye Engeli', () => {
    it('Senaryo 6: Başlangıç tarihi geçmiş atölyeye kayıt girişimi reddedilmelidir', () => {
      const result = checkWorkshopStartDate(pastWorkshopDate, fixedNow);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('PAST_DATE');
      expect(result.message).toContain('geçmiş atölyelere yeni kayıt yapılamaz');
    });

    it('Gelecek tarihli atölyeye kayıt onaylanmalıdır', () => {
      const result = checkWorkshopStartDate(futureWorkshopDate, fixedNow);
      expect(result.allowed).toBe(true);
    });
  });

  describe('Senaryo Grubu 4: İptal Edilen Kayıtların Kontenjan Hesabı', () => {
    it('Senaryo 8: İptal edilmiş kayıtlar kontenjan tüketmemeli, serbest kalan yere yeni kayıt alınabilmelidir', () => {
      const registrations = [
        { status: 'REGISTERED' },
        { status: 'ATTENDED' },
        { status: 'CANCELLED' }, // İptal edilmiş kayıt
      ];

      // Toplam 3 kayıt var ama sadece 2'si aktif
      const activeCount = calculateActiveQuotaUsage(registrations);
      expect(activeCount).toBe(2);

      // Kontenjan 3 ise, 1 kişilik boş yer olmalıdır
      const quotaCheck = checkWorkshopQuota(activeCount, 3);
      expect(quotaCheck.allowed).toBe(true);
    });
  });

  describe('Senaryo Grubu 5: Eşzamanlı (Concurrency) Kayıt Koruma', () => {
    it('Senaryo 9: Kalan 1 kontenjan için gelen iki eşzamanlı istekte kontenjan aşılmamalıdır', () => {
      const quota = 3;
      const initialCount = 2; // Sadece 1 yer kaldı!

      const concurrentRequests = [
        { participantId: 401, registeredAt: 100 }, // Milisaniye farkıyla önce geldi
        { participantId: 402, registeredAt: 102 }, // Milisaniye farkıyla sonra geldi
      ];

      const batchResult = processRegistrationBatch(quota, initialCount, concurrentRequests);

      expect(batchResult.successful).toEqual([401]);
      expect(batchResult.rejected.length).toBe(1);
      expect(batchResult.rejected[0].participantId).toBe(402);
      expect(batchResult.rejected[0].reason).toContain('Kontenjan doldu');
    });
  });

  describe('Senaryo Grubu 6: İlişkisel Bütünlük ve Silme Politikası (onDelete: Restrict)', () => {
    it('İlişkili atölyesi bulunan eğitmen silinmek istendiğinde kısıt hatası dönmelidir', () => {
      const mockWorkshopsList = [{ instructorId: 1 }, { instructorId: 2 }];
      const result = canDeleteInstructor(1, mockWorkshopsList);

      expect(result.allowed).toBe(false);
      expect(result.code).toBe('RESTRICT_VIOLATION');
      expect(result.message).toContain('atölyeleri kaldırılmalı veya başka eğitmene devredilmelidir');
    });

    it('Hiç atölyesi kalmamış serbest eğitmen silinebilmelidir', () => {
      const mockWorkshopsList = [{ instructorId: 2 }];
      const result = canDeleteInstructor(1, mockWorkshopsList);

      expect(result.allowed).toBe(true);
    });

    it('Kayıtlı katılımcısı bulunan atölye silinmek istendiğinde kısıt hatası dönmelidir', () => {
      const mockRegistrations = [{ workshopId: 5, status: 'REGISTERED' }];
      const result = canDeleteWorkshop(5, mockRegistrations);

      expect(result.allowed).toBe(false);
      expect(result.code).toBe('RESTRICT_VIOLATION');
      expect(result.message).toContain('Kayıt geçmişi olan atölyeler doğrudan silinemez');
    });

    it('Tüm kayıtları iptal edilmiş veya hiç kaydı olmayan atölye silinebilmelidir', () => {
      const mockRegistrations = [{ workshopId: 5, status: 'CANCELLED' }];
      const result = canDeleteWorkshop(5, mockRegistrations);

      expect(result.allowed).toBe(true);
    });
  });

  describe('Senaryo Grubu 7: Birleşik Kayıt Uygunluk Denetleyicisi', () => {
    it('Tüm koşullar sağlandığında onay vermeli', () => {
      const result = validateRegistrationEligibility({
        workshopStartDate: futureWorkshopDate,
        quota: 5,
        currentRegistrationsCount: 2,
        existingParticipantIds: [1, 2],
        participantId: 3,
        currentDate: fixedNow,
      });
      expect(result.allowed).toBe(true);
    });

    it('Geçmiş tarihli atölyede kontenjan boş olsa bile tarih hatası dönmeli', () => {
      const result = validateRegistrationEligibility({
        workshopStartDate: pastWorkshopDate,
        quota: 5,
        currentRegistrationsCount: 0,
        existingParticipantIds: [],
        participantId: 1,
        currentDate: fixedNow,
      });
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('PAST_DATE');
    });
  });
});
