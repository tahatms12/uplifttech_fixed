import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

expect.extend(matchers);

import JobPosting from '../JobPosting';

const mockJob = {
  id: 1,
  title: "Sales Development Representative",
  department: "Sales",
  location: "Remote",
  type: "Full-time",
  description: "We're looking for ambitious Sales Development Representatives",
  responsibilities: [
    "Conduct outbound calls and emails",
    "Qualify leads and schedule appointments"
  ],
  requirements: [
    "Previous sales experience preferred",
    "Excellent communication skills"
  ]
};

const renderJobPosting = () => {
  return render(
    <BrowserRouter>
      <JobPosting job={mockJob} />
    </BrowserRouter>
  );
};

describe('JobPosting Component', () => {
  beforeEach(() => {
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    class MockIntersectionObserver {
      observe() {
        return null;
      }
      unobserve() {
        return null;
      }
      disconnect() {
        return null;
      }
    }

    // @ts-expect-error jsdom mock
    window.IntersectionObserver = MockIntersectionObserver;
  });

  it('renders job title as h2 heading', () => {
    renderJobPosting();
    const heading = screen.getByRole('heading', { level: 2, name: mockJob.title });
    expect(heading).toBeInTheDocument();
  });

    it('displays job metadata correctly', () => {
      renderJobPosting();
      const [container] = screen.getAllByTestId('job-metadata');
      expect(container).toHaveTextContent(mockJob.department);
      expect(container).toHaveTextContent(mockJob.location);
      expect(container).toHaveTextContent(mockJob.type);
  });

    it('expands/collapses job details on click', async () => {
      renderJobPosting();
      const user = userEvent.setup();
      const buttons = screen.getAllByRole('button', { name: /view job details/i });
      const toggleButton = buttons[buttons.length - 1];
    
    // Initially collapsed
    expect(screen.queryByText(mockJob.responsibilities[0])).not.toBeInTheDocument();
    
    // Expand
    await user.click(toggleButton);
    expect(screen.getByText(mockJob.responsibilities[0])).toBeInTheDocument();
    
    // Collapse
    await user.click(toggleButton);
    expect(screen.queryByText(mockJob.responsibilities[0])).toBeNull();
  });

    it('renders responsibilities list correctly when expanded', async () => {
      renderJobPosting();
      const user = userEvent.setup();
      const buttons = screen.getAllByRole('button', { name: /view job details/i });
      const toggleButton = buttons[buttons.length - 1];
      await user.click(toggleButton);

      const [responsibilities] = screen.getAllByTestId('responsibilities-list');
      mockJob.responsibilities.forEach(item => {
        expect(within(responsibilities).getByText(item)).toBeInTheDocument();
      });
  });

    it('renders requirements list correctly when expanded', async () => {
      renderJobPosting();
      const user = userEvent.setup();
      const buttons = screen.getAllByRole('button', { name: /view job details/i });
      const toggleButton = buttons[buttons.length - 1];
      await user.click(toggleButton);

      const [requirements] = screen.getAllByTestId('requirements-list');
      mockJob.requirements.forEach(item => {
        expect(within(requirements).getByText(item)).toBeInTheDocument();
      });
  });

    it('has working apply button with correct link', async () => {
      renderJobPosting();
      const user = userEvent.setup();
      const buttons = screen.getAllByRole('button', { name: /view job details/i });
      const toggleButton = buttons[buttons.length - 1];
      await user.click(toggleButton);

      const [applyButton] = screen.getAllByRole('link', { name: /apply now/i });
      expect(applyButton).toHaveAttribute('href', '/apply');
  });

    it('maintains proper heading hierarchy', () => {
      renderJobPosting();
      const headings = screen.getAllByRole('heading');
    const levels = headings.map(h => parseInt(h.tagName.slice(1)));
    
    // Verify h2 -> h3 -> h4 progression
    expect(levels).toEqual(expect.arrayContaining([2, 3, 3]));
    expect(Math.min(...levels)).toBe(2);
    expect(Math.max(...levels)).toBe(3);
  });

    it('has proper ARIA attributes for expandable content', async () => {
      renderJobPosting();
      const user = userEvent.setup();
      const buttons = screen.getAllByRole('button', { name: /view job details/i });
      const toggleButton = buttons[buttons.length - 1];

      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('applies correct CSS classes for responsive design', () => {
      renderJobPosting();
      const [container] = screen.getAllByTestId('job-posting-card');
      expect(container).toHaveClass('glass-card', 'overflow-hidden');
    });
  });