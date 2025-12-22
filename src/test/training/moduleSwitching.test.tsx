// @vitest-environment jsdom
import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import TrainingCoursePage from '../../pages/training/TrainingCoursePage';

vi.mock('../../data/training/exports/curriculum.generated.json', () => ({
  default: {
    courses: [
      {
        id: 'course-1',
        title: 'Course One',
        description: 'Test course',
        audience: ['operations'],
        modules: [
          {
            id: 'module-1',
            title: 'Module One',
            lessons: [
              { id: 'lesson-1', title: 'Lesson One', contentMarkdown: 'Content 1', order: 1 },
            ],
          },
          {
            id: 'module-2',
            title: 'Module Two',
            lessons: [
              { id: 'lesson-2', title: 'Lesson Two', contentMarkdown: 'Content 2', order: 1 },
            ],
          },
        ],
      },
    ],
  },
}));

vi.mock('../../components/training/useTrainingProgress', () => ({
  useTrainingProgress: () => ({
    loading: false,
    error: null,
    progressByCourse: new Map([
      ['course-1', { lessons: [], quizzes: [] }],
    ]),
    progressByStep: new Map([
      ['lesson-1', { completed: true }],
    ]),
    curriculumVersion: 'v1',
    catalogVersion: 'v1',
  }),
}));

vi.mock('../../hooks/useTrainingRole', () => ({
  useTrainingRole: () => ({ role: 'operations', setRole: vi.fn() }),
}));

vi.mock('../../lib/trainingApi', () => ({
  trainingApi: {
    events: vi.fn().mockResolvedValue({ status: 200 }),
    issueCertificate: vi.fn().mockResolvedValue({ status: 200 }),
  },
}));

describe('module switching', () => {
  test('changes lesson content when switching modules', () => {
    render(
      <MemoryRouter initialEntries={["/training/course/course-1/module/module-1/lesson/lesson-1"]}>
        <Routes>
          <Route path="/training/course/:courseId/module/:moduleId/lesson/:lessonId" element={<TrainingCoursePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Lesson One')).toBeInTheDocument();
    const moduleButton = screen.getByRole('tab', { name: /Module Two/i });
    fireEvent.click(moduleButton);
    expect(screen.getByText('Lesson Two')).toBeInTheDocument();
  });
});
