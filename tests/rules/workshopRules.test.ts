import { describe, it, expect } from 'vitest';
import {
  checkWorkshopQuota,
  checkDuplicateRegistration,
  checkWorkshopStartDate,
  validateRegistrationEligibility,
} from '@/lib/rules/workshopRules';

describe('Saf İş Kuralları (Workshop Business Rules)', () => {
  describe('Kural 1: Kontenjan Kontrolü (checkWorkshopQuota)', () => {
    it('kontenjan müsait olduğunda kayda izin vermelidir', () => {
      const result = checkWorkshopQuota(5, 10);
      expect(result.allowed).toBe(true);
      expect(result.code).toBeUndefined();
    });

    it('kayıt sayısı tam kontenjana ulaştığında kaydı engellemelidir', () => {
      const result = checkWorkshopQuota(10, 10);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('QUOTA_FULL');
      expect(result.message).toContain('kontenjanı tamamen dolmuştur');
    });

    it('kayıt sayısı kontenjanı aştığında kaydı engellemelidir', () => {
      const result = checkWorkshopQuota(12, 10);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('QUOTA_FULL');
    });

    it('kontenjan sıfır veya negatif olduğunda geçersiz veri hatası dönmelidir', () => {
      const resultZero = checkWorkshopQuota(0, 0);
      expect(resultZero.allowed).toBe(false);
      expect(resultZero.code).toBe('INVALID_DATA');

      const resultNegative = checkWorkshopQuota(2, -5);
      expect(resultNegative.allowed).toBe(false);
      expect(resultNegative.code).toBe('INVALID_DATA');
    });
  });

  describe('Kural 2: Mükerrer Kayıt Engeli (checkDuplicateRegistration)', () => {
    const registeredParticipantIds = [101, 102, 103, 104];

    it('katılımcı listede yoksa kayda izin vermelidir', () => {
      const result = checkDuplicateRegistration(registeredParticipantIds, 105);
      expect(result.allowed).toBe(true);
    });

    it('katılımcı aynı atölyeye daha önce kaydolmuşsa kaydı engellemelidir', () => {
      const result = checkDuplicateRegistration(registeredParticipantIds, 102);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('ALREADY_REGISTERED');
      expect(result.message).toContain('zaten kayıtlıdır');
    });

    it('geçersiz katılımcı kimliği verildiğinde reddetmelidir', () => {
      const result = checkDuplicateRegistration(registeredParticipantIds, 0);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('INVALID_DATA');
    });
  });

  describe('Kural 3: Başlangıç Tarihi Kontrolü (checkWorkshopStartDate)', () => {
    const fixedNow = new Date('2026-10-19T10:00:00Z');

    it('gelecek tarihli bir atölyeye kayda izin vermelidir', () => {
      const futureDate = new Date('2026-10-25T14:00:00Z');
      const result = checkWorkshopStartDate(futureDate, fixedNow);
      expect(result.allowed).toBe(true);
    });

    it('geçmiş tarihli bir atölyeye kaydı engellemelidir', () => {
      const pastDate = new Date('2026-10-15T14:00:00Z');
      const result = checkWorkshopStartDate(pastDate, fixedNow);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('PAST_DATE');
      expect(result.message).toContain('geçmiş atölyelere yeni kayıt yapılamaz');
    });

    it('aynı an veya geçmiş tarih verildiğinde kaydı engellemelidir', () => {
      const exactNow = new Date('2026-10-19T10:00:00Z');
      const result = checkWorkshopStartDate(exactNow, fixedNow);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('PAST_DATE');
    });

    it('geçersiz tarih metni girildiğinde hata dönmelidir', () => {
      const result = checkWorkshopStartDate('gecersiz-tarih', fixedNow);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('INVALID_DATA');
    });
  });

  describe('Birleşik Kayıt Uygunluk Denetleyicisi (validateRegistrationEligibility)', () => {
    const fixedNow = new Date('2026-10-19T10:00:00Z');
    const futureDate = new Date('2026-10-25T14:00:00Z');

    it('tüm iş kuralları sağlandığında başarıyla onay vermelidir', () => {
      const result = validateRegistrationEligibility({
        workshopStartDate: futureDate,
        quota: 10,
        currentRegistrationsCount: 4,
        existingParticipantIds: [1, 2, 3, 4],
        participantId: 99,
        currentDate: fixedNow,
      });
      expect(result.allowed).toBe(true);
    });

    it('kontenjan doluysa mükerrerliğe bakmadan kontenjan hatası dönmelidir', () => {
      const result = validateRegistrationEligibility({
        workshopStartDate: futureDate,
        quota: 5,
        currentRegistrationsCount: 5,
        existingParticipantIds: [1, 2],
        participantId: 99,
        currentDate: fixedNow,
      });
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('QUOTA_FULL');
    });
  });
});
