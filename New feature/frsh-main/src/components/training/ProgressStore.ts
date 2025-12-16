import { create } from 'zustand';

export type ProgressState = {
  courseProgress: Record<string, { completedSteps: string[]; lastStep?: string }>;
  toggleStep: (courseId: string, stepId: string) => void;
  setLastStep: (courseId: string, stepId: string) => void;
};

const storageKey = 'training-progress-v1';

const loadState = (): ProgressState['courseProgress'] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Unable to load progress', err);
  }
  return {};
};

const persist = (state: ProgressState['courseProgress']) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (err) {
    console.error('Unable to persist progress', err);
  }
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  courseProgress: typeof window !== 'undefined' ? loadState() : {},
  toggleStep: (courseId: string, stepId: string) => {
    const courseProgress = { ...get().courseProgress };
    const current = courseProgress[courseId] || { completedSteps: [] };
    const exists = current.completedSteps.includes(stepId);
    const completedSteps = exists
      ? current.completedSteps.filter((s) => s !== stepId)
      : [...current.completedSteps, stepId];
    courseProgress[courseId] = { ...current, completedSteps };
    set({ courseProgress });
    persist(courseProgress);
  },
  setLastStep: (courseId: string, stepId: string) => {
    const courseProgress = { ...get().courseProgress, [courseId]: { ...(get().courseProgress[courseId] || { completedSteps: [] }), lastStep: stepId } };
    set({ courseProgress });
    persist(courseProgress);
  },
}));
