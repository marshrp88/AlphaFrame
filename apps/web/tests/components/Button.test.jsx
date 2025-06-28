import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });
}); 
