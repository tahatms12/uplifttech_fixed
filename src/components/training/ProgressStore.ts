export interface StepProgress {
  stepId: string;
  completed: boolean;
  completedAt?: string;
}

export interface CourseProgress {
  courseId: string;
  steps: StepProgress[];
}

export class ProgressStore {
  private cacheKey = 'training-progress-cache-v1';

  private loadLocal(): CourseProgress[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(this.cacheKey);
    return raw ? (JSON.parse(raw) as CourseProgress[]) : [];
  }

  private saveLocal(progress: CourseProgress[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.cacheKey, JSON.stringify(progress));
  }

  async load(): Promise<CourseProgress[]> {
    return this.loadLocal();
  }

  async markStep(courseId: string, stepId: string) {
    const current = await this.load();
    const course = current.find((c) => c.courseId === courseId) || { courseId, steps: [] };
    const step = course.steps.find((s) => s.stepId === stepId);
    const now = new Date().toISOString();
    if (step) {
      step.completed = true;
      step.completedAt = now;
    } else {
      course.steps.push({ stepId, completed: true, completedAt: now });
    }
    if (!current.find((c) => c.courseId === courseId)) {
      current.push(course);
    }
    this.saveLocal(current);
  }
}

export const progressStore = new ProgressStore();
