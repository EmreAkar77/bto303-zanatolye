'use client';

import { useCallback, useEffect, useState } from 'react';
import { mockInstructors, mockWorkshops } from '@/lib/data/mockData';
import {
  readWorkshopData,
  saveWorkshopData,
  subscribeToWorkshopData,
  WorkshopData,
} from '@/lib/data/workshopStore';

export function useWorkshopData() {
  const [data, setData] = useState<WorkshopData>({
    instructors: mockInstructors,
    workshops: mockWorkshops,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const refreshData = () => {
      setData(readWorkshopData());
      setIsLoaded(true);
    };

    refreshData();
    return subscribeToWorkshopData(refreshData);
  }, []);

  const updateData = useCallback((update: (current: WorkshopData) => WorkshopData) => {
    const nextData = update(readWorkshopData());
    saveWorkshopData(nextData);
  }, []);

  return { data, isLoaded, updateData };
}
