import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { Button } from '../../src/components/Button';

test('renders button with children', () => {
  render(<Button>Click Me</Button>);
  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();
}); 