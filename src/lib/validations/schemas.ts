import { z } from 'zod';

export const WorkshopStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']);
export type WorkshopStatusType = z.infer<typeof WorkshopStatusEnum>;

export const RegistrationStatusEnum = z.enum(['REGISTERED', 'CANCELLED', 'ATTENDED']);
export type RegistrationStatusType = z.infer<typeof RegistrationStatusEnum>;

// Atölye Doğrulama Şeması
export const workshopSchema = z.object({
  title: z
    .string({ required_error: 'Atölye başlığı zorunludur.' })
    .trim()
    .min(3, 'Atölye başlığı en az 3 karakter olmalıdır.')
    .max(120, 'Atölye başlığı en fazla 120 karakter olabilir.'),
  description: z
    .string({ required_error: 'Atölye açıklaması zorunludur.' })
    .trim()
    .min(10, 'Açıklama en az 10 karakter olmalıdır.'),
  startDate: z.coerce.date({
    required_error: 'Başlangıç tarihi zorunludur.',
    invalid_type_error: 'Geçerli bir tarih giriniz.',
  }),
  quota: z.coerce
    .number({ required_error: 'Kontenjan zorunludur.' })
    .int('Kontenjan tam sayı olmalıdır.')
    .min(1, 'Kontenjan en az 1 olmalıdır.')
    .max(200, 'Kontenjan en fazla 200 olabilir.'),
  status: WorkshopStatusEnum.default('ACTIVE'),
  instructorId: z.coerce
    .number({ required_error: 'Eğitmen seçimi zorunludur.' })
    .int()
    .positive('Lütfen geçerli bir eğitmen seçiniz.'),
});

export type WorkshopInput = z.infer<typeof workshopSchema>;

// Eğitmen Doğrulama Şeması
export const instructorSchema = z.object({
  fullName: z
    .string({ required_error: 'Eğitmen adı soyadı zorunludur.' })
    .trim()
    .min(3, 'Ad soyad en az 3 karakter olmalıdır.')
    .max(100, 'Ad soyad en fazla 100 karakter olabilir.'),
  specialty: z
    .string({ required_error: 'Uzmanlık alanı zorunludur.' })
    .trim()
    .min(3, 'Uzmanlık alanı en az 3 karakter olmalıdır.')
    .max(100, 'Uzmanlık alanı en fazla 100 karakter olabilir.'),
  email: z
    .string({ required_error: 'E-posta adresi zorunludur.' })
    .trim()
    .email('Geçerli bir e-posta adresi giriniz.'),
});

export type InstructorInput = z.infer<typeof instructorSchema>;

// Katılımcı Doğrulama Şeması
export const participantSchema = z.object({
  fullName: z
    .string({ required_error: 'Katılımcı adı soyadı zorunludur.' })
    .trim()
    .min(3, 'Ad soyad en az 3 karakter olmalıdır.')
    .max(100, 'Ad soyad en fazla 100 karakter olabilir.'),
  email: z
    .string({ required_error: 'E-posta adresi zorunludur.' })
    .trim()
    .email('Geçerli bir e-posta adresi giriniz.'),
});

export type ParticipantInput = z.infer<typeof participantSchema>;

// Kayıt Doğrulama Şeması
export const registrationSchema = z.object({
  workshopId: z.coerce.number().int().positive('Geçerli bir atölye seçiniz.'),
  participantId: z.coerce.number().int().positive('Geçerli bir katılımcı seçiniz.'),
  status: RegistrationStatusEnum.default('REGISTERED'),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
