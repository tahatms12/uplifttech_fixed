// @vitest-environment jsdom
import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import TrainingDashboardPage from '../../pages/training/TrainingDashboardPage';
import TrainingEntryPage from '../../pages/training/TrainingEntryPage';

vi.mock('../../components/training/useTrainingProgress', () => ({
  useTrainingProgress: () => ({
    loading: false,
    error: null,
    progressByCourse: new Map(),
  }),
}));

vi.mock('../../lib/trainingApi', () => ({
  trainingApi: {
    me: vi.fn().mockResolvedValue({ status: 401 }),
  },
}));

vi.mock('../../hooks/useTrainingRole', () => ({
  useTrainingRole: () => ({ role: '', setRole: vi.fn() }),
}));

describe('training accessibility smoke tests', () => {
  test('dashboard page has no critical accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <TrainingDashboardPage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  test('entry page has no critical accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <TrainingEntryPage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
