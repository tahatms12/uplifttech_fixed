import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

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
  });

  it('renders job title as h2 heading', () => {
    renderJobPosting();
    const heading = screen.getByRole('heading', { level: 2, name: mockJob.title });
    expect(heading).toBeInTheDocument();
  });

  it('displays job metadata correctly', () => {
    renderJobPosting();
    const container = screen.getByTestId('job-metadata');
    expect(container).toHaveTextContent(mockJob.department);
    expect(container).toHaveTextContent(mockJob.location);
    expect(container).toHaveTextContent(mockJob.type);
  });

  it('expands/collapses job details on click', async () => {
    renderJobPosting();
    const user = userEvent.setup();
    const toggleButton = screen.getByRole('button', { name: /view job details/i });
    
    // Initially collapsed
    expect(screen.queryByText(mockJob.responsibilities[0])).not.toBeInTheDocument();
    
    // Expand
    await user.click(toggleButton);
    expect(screen.getByText(mockJob.responsibilities[0])).toBeVisible();
    
    // Collapse
    await user.click(toggleButton);
    expect(screen.queryByText(mockJob.responsibilities[0])).not.toBeVisible();
  });

  it('renders responsibilities list correctly when expanded', async () => {
    renderJobPosting();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /view job details/i }));
    
    const responsibilities = screen.getByTestId('responsibilities-list');
    mockJob.responsibilities.forEach(item => {
      expect(within(responsibilities).getByText(item)).toBeInTheDocument();
    });
  });

  it('renders requirements list correctly when expanded', async () => {
    renderJobPosting();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /view job details/i }));
    
    const requirements = screen.getByTestId('requirements-list');
    mockJob.requirements.forEach(item => {
      expect(within(requirements).getByText(item)).toBeInTheDocument();
    });
  });

  it('has working apply button with correct link', async () => {
    renderJobPosting();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /view job details/i }));
    
    const applyButton = screen.getByRole('link', { name: /apply now/i });
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
    const toggleButton = screen.getByRole('button', { name: /view job details/i });
    
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies correct CSS classes for responsive design', () => {
    renderJobPosting();
    const container = screen.getByTestId('job-posting-card');
    expect(container).toHaveClass('glass-card', 'overflow-hidden');
  });
});