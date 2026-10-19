import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockWorkshops } from '@/lib/data/mockData';
import { readWorkshopData, saveWorkshopData } from '@/lib/data/workshopStore';

describe('workshopStore', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with the sample data and persists newly added instructors and workshops', () => {
    const storage = new Map<string, string>();
    const browserWindow = {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal('window', browserWindow);

    const initialData = readWorkshopData();
    const instructor = {
      id: 20,
      fullName: 'Yeni Eğitmen',
      specialty: 'Seramik',
      email: 'yeni@atolye.com',
      bio: 'Seramik alanında eğitmen.',
      avatarUrl: 'https://example.com/avatar.jpg',
    };
    const workshop = {
      ...mockWorkshops[0],
      id: 20,
      title: 'Yeni Atölye',
      instructorId: instructor.id,
      instructor,
    };

    saveWorkshopData({
      instructors: [...initialData.instructors, instructor],
      workshops: [...initialData.workshops, workshop],
    });

    const savedData = readWorkshopData();
    expect(savedData.instructors.some((item) => item.fullName === instructor.fullName)).toBe(true);
    expect(savedData.workshops.find((item) => item.id === workshop.id)?.instructor?.fullName)
      .toBe(instructor.fullName);
  });
});
