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
  private cacheKeyBase = 'training-progress-cache-v1';

  private cacheKey(version?: string): string {
    return `${this.cacheKeyBase}-${version || 'legacy'}`;
  }

  private loadLocal(version?: string): CourseProgress[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(this.cacheKey(version));
    return raw ? (JSON.parse(raw) as CourseProgress[]) : [];
  }

  private saveLocal(progress: CourseProgress[], version?: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.cacheKey(version), JSON.stringify(progress));
  }

  async load(version?: string): Promise<CourseProgress[]> {
    return this.loadLocal(version);
  }

  async markStep(courseId: string, stepId: string, curriculumVersion?: string) {
    const current = await this.load(curriculumVersion);
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
    this.saveLocal(current, curriculumVersion);
  }
}

export const progressStore = new ProgressStore();
