import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../../src/components/ui/Button';

describe('Button Component', () => {
  it('renders and is visible', () => {
    render(<Button />);
    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
  });
}); 