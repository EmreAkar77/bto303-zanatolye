import { describe, it, expect } from 'vitest';
import {
  workshopSchema,
  instructorSchema,
  participantSchema,
  registrationSchema,
} from '@/lib/validations/schemas';

describe('Zod Doğrulama Şemaları (Validation Schemas)', () => {
  describe('workshopSchema', () => {
    it('geçerli bir atölye verisini başarıyla doğrulamalıdır', () => {
      const validPayload = {
        title: 'Doğal Seramik Şekillendirme',
        description: 'Seramik çamuru ile fincan ve kase formlarının elde şekillendirilmesi.',
        startDate: '2026-11-01T10:00:00.000Z',
        quota: 12,
        status: 'ACTIVE',
        instructorId: 1,
      };

      const parsed = workshopSchema.safeParse(validPayload);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.title).toBe('Doğal Seramik Şekillendirme');
        expect(parsed.data.quota).toBe(12);
      }
    });

    it('başlık çok kısa olduğunda veya kontenjan geçersiz olduğunda hata vermelidir', () => {
      const invalidPayload = {
        title: 'Ab',
        description: 'Kısa',
        startDate: '2026-11-01',
        quota: -3,
        instructorId: 0,
      };

      const parsed = workshopSchema.safeParse(invalidPayload);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((i) => i.message);
        expect(errorMessages.some((m) => m.includes('en az 3 karakter'))).toBe(true);
        expect(errorMessages.some((m) => m.includes('en az 10 karakter'))).toBe(true);
        expect(errorMessages.some((m) => m.includes('en az 1 olmalıdır'))).toBe(true);
      }
    });
  });

  describe('instructorSchema ve participantSchema', () => {
    it('geçerli eğitmen verisini doğrulamalıdır', () => {
      const validInstructor = {
        fullName: 'Ahmet Sanatçı',
        specialty: 'Geleneksel Ebru',
        email: 'ahmet@atolye.com',
      };
      const parsed = instructorSchema.safeParse(validInstructor);
      expect(parsed.success).toBe(true);
    });

    it('hatalı e-posta formatında hata vermelidir', () => {
      const invalidInstructor = {
        fullName: 'Ahmet Sanatçı',
        specialty: 'Geleneksel Ebru',
        email: 'gecersiz-posta-adresi',
      };
      const parsed = instructorSchema.safeParse(invalidInstructor);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain('Geçerli bir e-posta adresi');
      }
    });

    it('katılımcı şeması geçerli veriyi onaylamalıdır', () => {
      const validParticipant = {
        fullName: 'Zeynep Öğrenci',
        email: 'zeynep@example.com',
      };
      const parsed = participantSchema.safeParse(validParticipant);
      expect(parsed.success).toBe(true);
    });
  });

  describe('registrationSchema', () => {
    it('geçerli kayıt verisini doğrulamalıdır', () => {
      const parsed = registrationSchema.safeParse({
        workshopId: 2,
        participantId: 5,
        status: 'REGISTERED',
      });
      expect(parsed.success).toBe(true);
    });
  });
});
