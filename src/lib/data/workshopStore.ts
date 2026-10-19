import { mockInstructors, mockWorkshops, MockInstructor, MockWorkshop } from '@/lib/data/mockData';

const STORAGE_KEY = 'atolyem-data';
const DATA_CHANGED_EVENT = 'atolyem-data-changed';

export interface WorkshopData {
  instructors: MockInstructor[];
  workshops: MockWorkshop[];
}

function createInitialData(): WorkshopData {
  return {
    instructors: mockInstructors.map((instructor) => ({ ...instructor })),
    workshops: mockWorkshops.map((workshop) => ({ ...workshop })),
  };
}

function hasWorkshopDataShape(value: unknown): value is WorkshopData {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<WorkshopData>;
  return Array.isArray(candidate.instructors) && Array.isArray(candidate.workshops);
}

export function readWorkshopData(): WorkshopData {
  if (typeof window === 'undefined') return createInitialData();

  const serializedData = window.localStorage.getItem(STORAGE_KEY);
  if (!serializedData) {
    const initialData = createInitialData();
    saveWorkshopData(initialData);
    return initialData;
  }

  let parsedData: unknown;
  try {
    parsedData = JSON.parse(serializedData);
  } catch (error) {
    throw new Error('Kayıtlı atölye verileri okunamadı.', { cause: error });
  }

  if (!hasWorkshopDataShape(parsedData)) {
    throw new Error('Kayıtlı atölye verilerinin biçimi geçersiz.');
  }

  return {
    ...parsedData,
    workshops: parsedData.workshops.map((workshop) => ({
      ...workshop,
      instructor: parsedData.instructors.find((instructor) => instructor.id === workshop.instructorId),
    })),
  };
}

export function saveWorkshopData(data: WorkshopData): void {
  if (typeof window === 'undefined') {
    throw new Error('Atölye verileri yalnızca tarayıcıda kaydedilebilir.');
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
}

export function subscribeToWorkshopData(onChange: () => void): () => void {
  const onStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };

  window.addEventListener(DATA_CHANGED_EVENT, onChange);
  window.addEventListener('storage', onStorageChange);
  return () => {
    window.removeEventListener(DATA_CHANGED_EVENT, onChange);
    window.removeEventListener('storage', onStorageChange);
  };
}
