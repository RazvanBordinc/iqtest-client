"use client";

import { useContext } from 'react';
import { useServerWakeUp as useServerWakeUpContext } from '@/components/shared/ServerWakeUpProvider';

// Re-export the hook for easier imports
export const useServerWakeUp = () => {
  return useServerWakeUpContext();
};

export default useServerWakeUp;