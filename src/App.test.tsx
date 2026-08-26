import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the main page hero copy for guests', () => {
    render(<App />);
    expect(screen.getByText(/질문은 빠르게/)).toBeInTheDocument();
    expect(screen.getAllByText('QANOW').length).toBeGreaterThan(0);
  });
});
